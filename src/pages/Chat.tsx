import { useState } from "react";
import { Send, Bot, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Navigation } from "@/components/Navigation";

const suggestedPrompts = [
  "How do I 86 something?",
  "What's the alcohol content of our IPA?",
  "How do I process a refund in the POS?",
  "What are the closing procedures?",
  "How do I handle a complaint?",
  "What's our food allergy policy?"
];

const categories = [
  "POS", "Kitchen", "HR", "Beer", "Cocktails", "Service", "Management"
];

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

const Chat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: text.trim(),
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "I'm ShiftIQ, your intelligent shift assistant! I'm here to help with restaurant operations, but I'm still learning. This is a demo response.",
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 2000);
  };

  const handlePromptClick = (prompt: string) => {
    handleSendMessage(prompt);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage(inputValue);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navigation />
      
      <div className="flex-1 flex flex-col max-w-2xl mx-auto w-full px-4">
        {/* Chat Messages */}
        <div className="flex-1 flex flex-col justify-center items-center space-y-4 overflow-y-auto py-8">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center space-y-8 max-w-lg">
              {/* Bot Icon */}
              <div className="w-16 h-16 rounded-2xl bg-muted/50 flex items-center justify-center">
                <Bot className="w-8 h-8 text-muted-foreground" />
              </div>
              
              {/* Welcome Message */}
              <div className="text-center space-y-2">
                <h1 className="text-2xl font-medium text-foreground">Good to See You!</h1>
                <h2 className="text-2xl font-medium text-foreground">How Can I be an Assistance?</h2>
                <p className="text-muted-foreground mt-4">I'm available 24/7 for you, ask me anything:</p>
              </div>
            </div>
          ) : (
            <div className="w-full space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex items-start gap-3 max-w-[80%] ${message.isUser ? 'flex-row-reverse' : ''}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      message.isUser ? 'bg-primary' : 'bg-secondary'
                    }`}>
                      {message.isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                    </div>
                    <Card className={`p-4 ${
                      message.isUser ? 'bg-primary/20' : 'bg-secondary/20'
                    }`}>
                      <p className="text-foreground">{message.text}</p>
                      <p className="text-xs text-muted-foreground mt-2">
                        {message.timestamp.toLocaleTimeString()}
                      </p>
                    </Card>
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start">
                  <div className="flex items-start gap-3 max-w-[80%]">
                    <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
                      <Bot className="w-4 h-4" />
                    </div>
                    <Card className="p-4 bg-secondary/20">
                      <p className="text-foreground typing-dots">ShiftIQ is thinking</p>
                    </Card>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Suggested Prompts */}
        {messages.length === 0 && (
          <div className="space-y-3 mb-6">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Bot className="w-4 h-4" />
              <span>Any advice for me?</span>
            </div>
            <div className="flex gap-3 flex-wrap">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePromptClick("How do I 86 something?")}
                className="text-sm"
              >
                How do I 86 something?
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePromptClick("What's our food allergy policy?")}
                className="text-sm"
              >
                Life lessons from kratos
              </Button>
            </div>
          </div>
        )}

        {/* Input Bar */}
        <div className="py-4">
          <form onSubmit={handleSubmit} className="relative">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask anything..."
              className="w-full h-12 pl-4 pr-12 bg-muted/50 border-border rounded-lg text-base placeholder:text-muted-foreground"
              disabled={isTyping}
            />
            <Button
              type="submit"
              disabled={!inputValue.trim() || isTyping}
              size="icon"
              className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 glow-primary pulse-glow"
            >
              <Send className="w-4 h-4" />
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Chat;