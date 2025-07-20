import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Plus, Mic } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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
      
      {/* Main Chat Container */}
      <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full">
        {/* Chat Messages Area */}
        <div className="flex-1 overflow-y-auto px-4 py-6">
          {messages.length === 0 ? (
            // Welcome Screen
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-8">
              {/* ShiftIQ Logo/Icon */}
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center border border-primary/20">
                <Bot className="w-10 h-10 text-primary" />
              </div>
              
              {/* Welcome Message */}
              <div className="text-center space-y-3">
                <h1 className="text-4xl font-semibold text-foreground">Welcome to ShiftIQ</h1>
                <p className="text-lg text-muted-foreground font-normal">
                  Your intelligent shift assistant. Ask me anything about restaurant operations.
                </p>
              </div>

              {/* Quick Action Prompts */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-w-3xl mt-8">
                <Button
                  variant="outline"
                  onClick={() => handlePromptClick("How do I 86 something?")}
                  className="h-auto p-4 text-left justify-start hover:bg-muted/50 transition-all duration-200"
                >
                  <div className="text-sm font-medium">How do I 86 something?</div>
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handlePromptClick("What's our beer selection?")}
                  className="h-auto p-4 text-left justify-start hover:bg-muted/50 transition-all duration-200"
                >
                  <div className="text-sm font-medium">What's our beer selection?</div>
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handlePromptClick("POS troubleshooting")}
                  className="h-auto p-4 text-left justify-start hover:bg-muted/50 transition-all duration-200"
                >
                  <div className="text-sm font-medium">POS troubleshooting</div>
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handlePromptClick("Table rotation policy")}
                  className="h-auto p-4 text-left justify-start hover:bg-muted/50 transition-all duration-200"
                >
                  <div className="text-sm font-medium">Table rotation policy</div>
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handlePromptClick("Cocktail recipes")}
                  className="h-auto p-4 text-left justify-start hover:bg-muted/50 transition-all duration-200"
                >
                  <div className="text-sm font-medium">Cocktail recipes</div>
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handlePromptClick("Dress code policy")}
                  className="h-auto p-4 text-left justify-start hover:bg-muted/50 transition-all duration-200"
                >
                  <div className="text-sm font-medium">Dress code policy</div>
                </Button>
              </div>
            </div>
          ) : (
            // Messages List
            <div className="space-y-6 max-w-3xl mx-auto">
              {messages.map(message => (
                <div 
                  key={message.id} 
                  className={`flex items-start gap-4 group hover:bg-muted/20 rounded-lg p-3 -m-3 transition-all duration-200 ${
                    message.isUser ? 'flex-row-reverse' : ''
                  }`}
                >
                  {/* Avatar */}
                  <div className={`
                    w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0
                    ${message.isUser 
                      ? 'bg-user-message text-white' 
                      : 'bg-gradient-to-br from-primary/20 to-secondary/20 border border-primary/20'
                    }
                  `}>
                    {message.isUser ? (
                      <User className="w-4 h-4" />
                    ) : (
                      <Bot className="w-4 h-4 text-primary" />
                    )}
                  </div>

                  {/* Message Content */}
                  <div className={`flex-1 ${message.isUser ? 'text-right' : ''}`}>
                    <div className={`
                      inline-block max-w-[80%] p-4 rounded-2xl shadow-sm
                      ${message.isUser 
                        ? 'bg-user-message text-white rounded-br-md' 
                        : 'bg-assistant-message text-white rounded-bl-md'
                      }
                    `}>
                      <p className="text-sm font-medium leading-relaxed whitespace-pre-wrap">
                        {message.text}
                      </p>
                    </div>
                    <div className={`
                      mt-2 text-xs text-muted-foreground
                      ${message.isUser ? 'text-right' : 'text-left'}
                    `}>
                      {message.timestamp.toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </div>
                  </div>
                </div>
              ))}

              {/* Typing Indicator */}
              {isTyping && (
                <div className="flex items-start gap-4 opacity-70">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 border border-primary/20 flex items-center justify-center">
                    <Bot className="w-4 h-4 text-primary" />
                  </div>
                  <div className="bg-assistant-message text-white rounded-2xl rounded-bl-md p-4 max-w-[200px]">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-white/60 rounded-full animate-pulse"></div>
                      <div className="w-2 h-2 bg-white/60 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                      <div className="w-2 h-2 bg-white/60 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="border-t border-border bg-background/95 backdrop-blur-sm p-4">
          <div className="max-w-3xl mx-auto">
            {/* Category Quick Actions */}
            <div className="flex items-center justify-center gap-2 mb-4 flex-wrap">
              {["POS", "FOH", "BOH", "HR", "Menu", "Square"].map((category) => (
                <Button
                  key={category}
                  variant="outline"
                  size="sm"
                  className="text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all duration-200"
                >
                  {category}
                </Button>
              ))}
            </div>

            {/* Input Form */}
            <form onSubmit={handleSubmit} className="relative">
              <div className="flex items-center bg-card border border-border rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200">
                <Button 
                  type="button" 
                  size="icon" 
                  variant="ghost" 
                  className="ml-3 h-8 w-8 text-muted-foreground hover:text-foreground"
                >
                  <Plus className="w-4 h-4" />
                </Button>
                
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Ask ShiftIQ anything..."
                  className="flex-1 border-0 bg-transparent h-12 text-sm placeholder:text-muted-foreground focus-visible:ring-0 focus-visible:ring-offset-0 font-medium"
                  disabled={isTyping}
                />
                
                <Button 
                  type="button" 
                  size="icon" 
                  variant="ghost" 
                  className="mr-2 h-8 w-8 text-muted-foreground hover:text-foreground"
                >
                  <Mic className="w-4 h-4" />
                </Button>
                
                <Button
                  type="submit"
                  size="icon"
                  disabled={!inputValue.trim() || isTyping}
                  className="mr-3 h-8 w-8 bg-primary hover:bg-primary/90 text-primary-foreground disabled:opacity-50 rounded-lg transition-all duration-200"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </form>

            <div className="text-center mt-3">
              <p className="text-xs text-muted-foreground">
                ShiftIQ can make mistakes. Verify important information.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;