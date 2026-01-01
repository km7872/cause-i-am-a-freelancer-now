import hashlib
import numpy as np
import redis
from redis.commands.search.field import VectorField, TextField
from redis.commands.search.index_definition import IndexDefinition, IndexType
from redis.exceptions import ResponseError
from app.ragservice.config import embeddings
import os
from dotenv import load_dotenv

load_dotenv()

redis_client = redis.Redis(
    host=os.getenv("REDIS_HOST", "localhost"),
    port=int(os.getenv("REDIS_PORT", 6379)),
    decode_responses=True
)

redis_bin = redis.Redis(decode_responses=False)

def store_in_redis(user_query, model_answer):
    key = "qa:" + hashlib.sha256(user_query.encode()).hexdigest()
    vec = np.array(
        embeddings.embed_query(user_query),
        dtype=np.float32
    )
    assert vec.shape[0] == 384
    redis_bin.hset(
        key,
        mapping={
            "query": user_query.encode(),
            "answer": model_answer.encode(),
            "embedding": vec.tobytes()
        }
    )

def define_redis_index():
    index_name = "query_index"
    try:
        # Check if index exists
        redis_client.ft(index_name).info()
        print("index already exists")
    except Exception as e:
        # We use a broader Exception check because sometimes it's a ConnectionError
        try:
            redis_client.ft(index_name).create_index(
                fields=[
                    TextField("query"),
                    TextField("answer"),
                    VectorField(
                        "embedding",
                        "FLAT",
                        {"TYPE": "FLOAT32", "DIM": 384, "DISTANCE_METRIC": "COSINE"}
                    )
                ],
                definition=IndexDefinition(
                    prefix=["qa:"],
                    index_type=IndexType.HASH
                )
            )
            print(f"Index '{index_name}' created successfully.")
        except ResponseError as re:
            if "Index already exists" in str(re):
                print("Index actually exists (race condition handled).")
            else:
                raise re

def retrieve_from_redis(user_query, top=1, threshold=0.2):
    vec = np.array(
        embeddings.embed_query(user_query),
        dtype=np.float32
    ).tobytes()

    res = redis_bin.execute_command(
        "FT.SEARCH", "query_index",
        f"*=>[KNN {top} @embedding $v AS score]",
        "SORTBY", "score",
        "RETURN", 3, "query", "answer", "score",
        "PARAMS", 2, "v", vec,
        "DIALECT", 2
    )

    if res[0] > 0:
        fields = dict(zip(res[2][::2], res[2][1::2]))
        if float(fields[b"score"]) <= threshold:
            return fields[b"answer"].decode()
    return None
