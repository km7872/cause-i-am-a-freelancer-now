import { useState } from "react";
import { motion } from "framer-motion";
import { Send, FileText, Bot, User, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { log } from "console";

interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
}

const mockContracts = [
  { id: "1", name: "Senior Frontend Developer - TechStart Inc." },
  { id: "2", name: "UI/UX Consultant - Design Agency Co." },
  { id: "3", name: "React Developer - Startup Labs" },
];

export function ChatView() {
  const [selectedContract, setSelectedContract] = useState(mockContracts[0]);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content:
        "Hello! I'm your contract assistant. I can help you understand your contract terms, answer questions about payment schedules, deliverables, and more. What would you like to know about your contract?",
      role: "assistant",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      role: "user",
      timestamp: new Date(),
    };

    setMessages([...messages, userMessage]);
    const currentInput = inputValue;
    console.log(inputValue);

    setInputValue("");

    try {
      const response = await fetch("http://localhost:8000/user_query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: currentInput }),
      });
      const data = await response.json();

      const aiMessage: Message = {
        id: Date.now().toString(),
        content: data.response,
        role: "assistant",
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error("Error calling RAG backend:", error);
    }
  };

  const suggestions = [
    "What are the payment terms?",
    "When does my contract end?",
    "What are my deliverables?",
    "Notice period requirements?",
  ];

  return (
    <div className="h-[calc(100vh-8rem)] flex gap-6">
      {/* Contract Selector */}
      <motion.div
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="w-72 glass-card p-4 flex flex-col"
      >
        <h3 className="font-display font-semibold text-foreground mb-4">
          Select Contract
        </h3>
        <div className="space-y-2">
          {mockContracts.map((contract) => (
            <button
              key={contract.id}
              onClick={() => setSelectedContract(contract)}
              className={cn(
                "w-full p-3 rounded-lg text-left transition-all flex items-center gap-3",
                selectedContract.id === contract.id
                  ? "bg-primary/20 border border-primary/30 text-foreground"
                  : "bg-secondary/50 text-muted-foreground hover:bg-secondary hover:text-foreground"
              )}
            >
              <FileText className="w-4 h-4 shrink-0" />
              <span className="text-sm truncate">{contract.name}</span>
            </button>
          ))}
        </div>
      </motion.div>

      {/* Chat Area */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="flex-1 glass-card flex flex-col"
      >
        {/* Chat Header */}
        <div className="p-4 border-b border-border flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="font-display font-semibold text-foreground">
              Contract AI Assistant
            </h2>
            <p className="text-xs text-muted-foreground">
              Ask anything about: {selectedContract.name}
            </p>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message, index) => (
            <motion.div
              key={message.id}
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
              className={cn(
                "flex gap-3",
                message.role === "user" ? "flex-row-reverse" : ""
              )}
            >
              <div
                className={cn(
                  "w-8 h-8 rounded-lg flex items-center justify-center shrink-0",
                  message.role === "user" ? "bg-primary/20" : "bg-secondary"
                )}
              >
                {message.role === "user" ? (
                  <User className="w-4 h-4 text-primary" />
                ) : (
                  <Bot className="w-4 h-4 text-muted-foreground" />
                )}
              </div>
              <div
                className={cn(
                  "max-w-[70%] rounded-xl px-4 py-3",
                  message.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-foreground"
                )}
              >
                <p className="text-sm">{message.content}</p>
                <p
                  className={cn(
                    "text-xs mt-2",
                    message.role === "user"
                      ? "text-primary-foreground/70"
                      : "text-muted-foreground"
                  )}
                >
                  {message.timestamp.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Suggestions */}
        <div className="px-4 pb-2">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {suggestions.map((suggestion) => (
              <button
                key={suggestion}
                onClick={() => setInputValue(suggestion)}
                className="shrink-0 px-3 py-1.5 text-xs bg-secondary text-muted-foreground rounded-full hover:bg-secondary/80 hover:text-foreground transition-colors"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>

        {/* Input */}
        <div className="p-4 border-t border-border">
          <div className="flex gap-3">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Ask about your contract..."
              className="flex-1 bg-secondary border-border"
            />
            <Button
              variant="glow"
              onClick={handleSend}
              disabled={!inputValue.trim()}
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
