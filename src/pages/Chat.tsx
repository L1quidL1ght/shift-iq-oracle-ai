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
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

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
      
      <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full px-4">
        {/* Header */}
        <div className="text-center py-8">
          <div className="flex items-center justify-center gap-3 mb-2">
            <Bot className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold text-foreground">ShiftIQ</h1>
          </div>
          <p className="text-lg text-muted-foreground">Your intelligent shift assistant</p>
          <p className="text-sm text-muted-foreground/80">by MuleKick</p>
        </div>

        {/* Category Bar */}
        <div className="flex flex-wrap gap-2 justify-center mb-6">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(selectedCategory === category ? null : category)}
              className="transition-smooth"
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Chat Messages */}
        <div className="flex-1 mb-4 space-y-4 overflow-y-auto">
          {messages.length === 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {suggestedPrompts.map((prompt, index) => (
                <Card
                  key={index}
                  className="p-4 cursor-pointer transition-smooth hover:bg-card/80 hover:scale-105 chat-bubble-glow"
                  onClick={() => handlePromptClick(prompt)}
                >
                  <p className="text-sm text-foreground">{prompt}</p>
                </Card>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
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
                    <Card className={`p-4 chat-bubble-glow ${
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

        {/* Input Bar */}
        <div className="sticky bottom-0 bg-background/95 backdrop-blur-sm border-t border-border py-4">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask me anything about your shift..."
              className="flex-1 bg-input border-border focus:ring-primary"
              disabled={isTyping}
            />
            <Button
              type="submit"
              disabled={!inputValue.trim() || isTyping}
              className="glow-primary pulse-glow"
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