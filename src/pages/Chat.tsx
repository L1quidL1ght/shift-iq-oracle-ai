import { useState } from "react";
import { Send, Bot, User, Plus, Mic } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Navigation } from "@/components/Navigation";

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
      
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Messages */}
        <div className="flex-1 flex flex-col justify-center items-center px-4">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center space-y-6 w-full max-w-2xl">
              {/* Bot Icon */}
              <div className="w-20 h-20 rounded-2xl bg-muted/30 flex items-center justify-center mb-4">
                <Bot className="w-10 h-10 text-muted-foreground" />
              </div>
              
              {/* Welcome Message */}
              <div className="text-center space-y-1 mb-8">
                <h1 className="text-3xl font-normal text-foreground">Good to See You!</h1>
                <h2 className="text-3xl font-normal text-foreground">How Can I be an Assistance?</h2>
                <p className="text-muted-foreground mt-6 text-base">Im available 24/7 for you, ask me anything.</p>
              </div>
            </div>
          ) : (
            <div className="w-full max-w-2xl space-y-4 px-4">
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

        {/* Bottom Section */}
        <div className="w-full px-4 pb-6">
          <div className="max-w-2xl mx-auto">
            {/* Input Bar */}
            <div className="mb-4">
              <form onSubmit={handleSubmit} className="relative">
                <div className="flex items-center bg-muted/20 rounded-lg border border-border">
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    className="ml-2 h-10 w-10 text-muted-foreground hover:text-foreground"
                  >
                    <Plus className="w-5 h-5" />
                  </Button>
                  <Input
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Ask anything ..."
                    className="flex-1 border-0 bg-transparent h-14 text-base placeholder:text-muted-foreground focus-visible:ring-0 focus-visible:ring-offset-0"
                    disabled={isTyping}
                  />
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    className="mr-2 h-10 w-10 text-muted-foreground hover:text-foreground"
                  >
                    <Mic className="w-5 h-5" />
                  </Button>
                </div>
              </form>
            </div>

            {/* Suggested Actions */}
            {messages.length === 0 && (
              <div className="flex items-center justify-center gap-6">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handlePromptClick("Any advice for me?")}
                  className="text-muted-foreground hover:text-foreground text-sm font-normal"
                >
                  <User className="w-4 h-4 mr-2" />
                  Any advice for me?
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handlePromptClick("Some youtube video idea")}
                  className="text-muted-foreground hover:text-foreground text-sm font-normal"
                >
                  <Bot className="w-4 h-4 mr-2" />
                  Some youtube video idea
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handlePromptClick("Life lessons from kratos")}
                  className="text-muted-foreground hover:text-foreground text-sm font-normal"
                >
                  <Bot className="w-4 h-4 mr-2" />
                  Life lessons from kratos
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground hover:text-foreground"
                >
                  <span className="text-lg">•••</span>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;