import csv
import os
from datetime import datetime

from app.ragservice.config import FEEDBACK_CSV_FILE

def save_feedback_to_csv(feedback_data: dict):
    """Appends feedback data to a CSV file."""

    # Check if the file exists to determine if we need to write headers
    file_exists = os.path.isfile(FEEDBACK_CSV_FILE)

    with open(FEEDBACK_CSV_FILE, mode='a', newline='', encoding='utf-8') as file:
        fieldnames = ["timestamp", "question", "answer", "feedback_type"]
        writer = csv.DictWriter(file, fieldnames=fieldnames)

        if not file_exists:
            writer.writeheader()  # Write the header row if the file is new

        # Prepare the row with a timestamp
        row = {
            "timestamp": datetime.now().isoformat(),
            "question": feedback_data.get("query"),
            "answer": feedback_data.get("answer"),
            "feedback_type": feedback_data.get("feedback_type"),
        }

        writer.writerow(row)