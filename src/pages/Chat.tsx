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
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth"
    });
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

  const suggestedPrompts = [
    "How do I 86 something?",
    "What's our beer selection?", 
    "POS troubleshooting",
    "Table rotation policy",
    "Cocktail recipes",
    "Dress code policy"
  ];

  const categories = ["POS", "FOH", "BOH", "HR", "Menu", "Square"];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navigation />
      
      {/* Main Chat Container */}
      <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full">
        {/* Chat Messages Area */}
        <div className="flex-1 overflow-y-auto px-4 py-6">
          {messages.length === 0 ? (
            // Welcome Screen - ChatGPT Style Layout
            <div className="flex flex-col items-center justify-center min-h-[80vh] space-y-8 max-w-4xl mx-auto">
              {/* Large Circular Logo with Glow */}
              <div className="relative">
                <div className="absolute inset-0 w-24 h-24 rounded-full bg-gradient-to-br from-primary/30 to-secondary/30 blur-xl animate-pulse"></div>
                <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center border border-primary/30 backdrop-blur-sm">
                  <Bot className="w-12 h-12 text-primary" />
                </div>
              </div>
              
              {/* Large Greeting Text */}
              <div className="text-center space-y-4">
                <h1 className="text-foreground text-5xl font-semibold tracking-tight">
                  How can I assist you today?
                </h1>
                <p className="text-xl text-muted-foreground font-normal max-w-2xl">
                  Your intelligent shift assistant. Ask me anything about MuleKick operations.
                </p>
              </div>

              {/* Chat Input Field - Centered Under Greeting */}
              <div className="w-full max-w-2xl">
                <form onSubmit={handleSubmit} className="relative">
                  <div className="flex items-center bg-card/50 border border-border/50 rounded-2xl shadow-lg hover:shadow-xl backdrop-blur-sm transition-all duration-300">
                    <Button 
                      type="button" 
                      size="icon" 
                      variant="ghost" 
                      className="ml-4 h-10 w-10 text-muted-foreground hover:text-foreground"
                    >
                      <Plus className="w-5 h-5" />
                    </Button>
                    
                    <Input 
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      placeholder="Ask ShiftIQ anything..."
                      className="flex-1 border-0 bg-transparent h-14 text-lg placeholder:text-muted-foreground focus-visible:ring-0 focus-visible:ring-offset-0 font-medium"
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
                    
                    <Button 
                      type="submit" 
                      size="icon" 
                      disabled={!inputValue.trim() || isTyping}
                      className="mr-4 h-10 w-10 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white disabled:opacity-50 rounded-xl transition-all duration-200 shadow-lg"
                    >
                      <Send className="w-5 h-5" />
                    </Button>
                  </div>
                </form>
              </div>

              {/* Suggested Prompts - 2 rows of 3 */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl w-full mt-8">
                {suggestedPrompts.map((prompt, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    onClick={() => handlePromptClick(prompt)}
                    className="h-auto p-6 text-left justify-start bg-card/30 border-border/50 hover:bg-card/50 hover:border-primary/30 transition-all duration-300 rounded-xl backdrop-blur-sm group"
                  >
                    <div className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                      {prompt}
                    </div>
                  </Button>
                ))}
              </div>

              {/* Category Buttons Row */}
              <div className="flex items-center justify-center gap-3 flex-wrap mt-8">
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant="outline"
                    size="sm"
                    className="px-6 py-2 text-sm font-medium bg-card/30 border-border/50 hover:bg-gradient-to-r hover:from-primary/10 hover:to-secondary/10 hover:border-primary/30 transition-all duration-300 rounded-lg"
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </div>
          ) : (
            // Messages List
            <div className="space-y-6 max-w-3xl mx-auto">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex items-start gap-4 group hover:bg-muted/20 rounded-lg p-3 -m-3 transition-all duration-200 ${
                    message.isUser ? 'flex-row-reverse' : ''
                  }`}
                >
                  {/* Avatar */}
                  <div
                    className={`
                      w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0
                      ${
                        message.isUser
                          ? 'bg-gradient-to-br from-primary to-secondary text-white'
                          : 'bg-gradient-to-br from-primary/20 to-secondary/20 border border-primary/20'
                      }
                    `}
                  >
                    {message.isUser ? (
                      <User className="w-4 h-4" />
                    ) : (
                      <Bot className="w-4 h-4 text-primary" />
                    )}
                  </div>

                  {/* Message Content */}
                  <div className={`flex-1 ${message.isUser ? 'text-right' : ''}`}>
                    <div
                      className={`
                        inline-block max-w-[80%] p-4 rounded-2xl shadow-sm
                        ${
                          message.isUser
                            ? 'bg-gradient-to-br from-primary to-secondary text-white rounded-br-md'
                            : 'bg-card/50 text-foreground rounded-bl-md border border-border/50'
                        }
                      `}
                    >
                      <p className="text-sm font-medium leading-relaxed whitespace-pre-wrap">
                        {message.text}
                      </p>
                    </div>
                    <div
                      className={`
                        mt-2 text-xs text-muted-foreground
                        ${message.isUser ? 'text-right' : 'text-left'}
                      `}
                    >
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
                  <div className="bg-card/50 text-foreground rounded-2xl rounded-bl-md p-4 max-w-[200px] border border-border/50">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-primary/60 rounded-full animate-pulse"></div>
                      <div className="w-2 h-2 bg-primary/60 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                      <div className="w-2 h-2 bg-primary/60 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input Area - Only shown when there are messages */}
        {messages.length > 0 && (
          <div className="border-t border-border/50 bg-background/95 backdrop-blur-sm p-4">
            <div className="max-w-3xl mx-auto">
              {/* Category Quick Actions */}
              <div className="flex items-center justify-center gap-2 mb-4 flex-wrap">
                {categories.map((category) => (
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
                <div className="flex items-center bg-card/50 border border-border/50 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 backdrop-blur-sm">
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
                    className="mr-3 h-8 w-8 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white disabled:opacity-50 rounded-lg transition-all duration-200"
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
        )}
      </div>
    </div>
  );
};

export default Chat;