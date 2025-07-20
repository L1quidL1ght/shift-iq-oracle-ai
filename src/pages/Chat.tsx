
import { useState, useRef, useEffect } from "react";
import { Send, Plus, Mic, ArrowRight } from "lucide-react";
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
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col">
      <Navigation />
      
      {/* Main Chat Container */}
      <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full">
        {/* Chat Messages Area */}
        <div className="flex-1 overflow-y-auto">
          {messages.length === 0 ? (
            // Welcome Screen - ChatGPT Style Layout
            <div className="flex flex-col items-center justify-center min-h-[80vh] space-y-8 px-4">
              {/* Greeting Text */}
              <div className="text-center space-y-4">
                <h1 className="text-white text-4xl font-semibold tracking-tight">
                  How can I assist you today?
                </h1>
                <p className="text-[#a0a0a0] text-lg font-normal max-w-2xl">
                  Your intelligent shift assistant. Ask me anything about MuleKick operations.
                </p>
              </div>

              {/* Chat Input Field - Centered Under Greeting */}
              <div className="w-full max-w-2xl">
                <form onSubmit={handleSubmit} className="relative">
                  <div className="flex items-center bg-[#1a1a1a] border border-[#333] rounded-xl">
                    <Button 
                      type="button" 
                      size="icon" 
                      variant="ghost" 
                      className="ml-3 h-10 w-10 text-[#a0a0a0] hover:text-white hover:bg-[#2a2a2a]"
                    >
                      <Plus className="w-5 h-5" />
                    </Button>
                    
                    <Input 
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      placeholder="Ask ShiftIQ anything..."
                      className="flex-1 border-0 bg-transparent h-14 text-lg placeholder:text-[#a0a0a0] focus-visible:ring-0 focus-visible:ring-offset-0 font-medium text-white"
                      disabled={isTyping}
                    />
                    
                    <Button 
                      type="button" 
                      size="icon" 
                      variant="ghost" 
                      className="mr-2 h-10 w-10 text-[#a0a0a0] hover:text-white hover:bg-[#2a2a2a]"
                    >
                      <Mic className="w-5 h-5" />
                    </Button>
                    
                    <Button 
                      type="submit" 
                      size="icon" 
                      disabled={!inputValue.trim() || isTyping}
                      className="mr-3 h-10 w-10 bg-[#00ffff] hover:bg-[#00cccc] text-black disabled:opacity-50 rounded-lg"
                    >
                      <ArrowRight className="w-5 h-5" />
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
                    className="h-auto p-6 text-left justify-start bg-[#1a1a1a] border-[#333] hover:bg-[#2a2a2a] hover:border-[#00ffff] text-white rounded-xl"
                  >
                    <div className="text-sm font-medium">
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
                    className="px-6 py-2 text-sm font-medium bg-[#1a1a1a] border-[#333] hover:bg-[#2a2a2a] hover:border-[#00ffff] text-white rounded-lg"
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </div>
          ) : (
            // Messages List - ChatGPT Style
            <div className="w-full">
              {messages.map((message) => (
                <div key={message.id} className={`w-full py-4 ${message.isUser ? 'bg-[#0a0a0a]' : 'bg-[#1a1a1a]'}`}>
                  <div className="max-w-4xl mx-auto px-4">
                    <div className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[80%] p-4 rounded-lg ${
                        message.isUser 
                          ? 'bg-[#2563eb] text-white' 
                          : 'bg-[#1f2937] text-white'
                      }`}>
                        <p className="text-sm font-medium leading-relaxed whitespace-pre-wrap">
                          {message.text}
                        </p>
                        <div className="mt-2 text-xs opacity-70">
                          {message.timestamp.toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Typing Indicator */}
              {isTyping && (
                <div className="w-full py-4 bg-[#1a1a1a]">
                  <div className="max-w-4xl mx-auto px-4">
                    <div className="flex justify-start">
                      <div className="bg-[#1f2937] text-white rounded-lg p-4 max-w-[200px]">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-[#00ffff] rounded-full animate-pulse"></div>
                          <div className="w-2 h-2 bg-[#00ffff] rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
                          <div className="w-2 h-2 bg-[#00ffff] rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
                        </div>
                      </div>
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
          <div className="border-t border-[#333] bg-[#0a0a0a] p-4">
            <div className="max-w-4xl mx-auto">
              {/* Category Quick Actions */}
              <div className="flex items-center justify-center gap-2 mb-4 flex-wrap">
                {categories.map((category) => (
                  <Button 
                    key={category}
                    variant="outline"
                    size="sm"
                    className="text-xs font-medium text-[#a0a0a0] hover:text-white hover:bg-[#2a2a2a] bg-[#1a1a1a] border-[#333]"
                  >
                    {category}
                  </Button>
                ))}
              </div>

              {/* Input Form */}
              <form onSubmit={handleSubmit} className="relative">
                <div className="flex items-center bg-[#1a1a1a] border border-[#333] rounded-xl">
                  <Button 
                    type="button" 
                    size="icon" 
                    variant="ghost" 
                    className="ml-3 h-8 w-8 text-[#a0a0a0] hover:text-white hover:bg-[#2a2a2a]"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                  
                  <Input 
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Ask ShiftIQ anything..."
                    className="flex-1 border-0 bg-transparent h-12 text-sm placeholder:text-[#a0a0a0] focus-visible:ring-0 focus-visible:ring-offset-0 font-medium text-white"
                    disabled={isTyping}
                  />
                  
                  <Button 
                    type="button" 
                    size="icon" 
                    variant="ghost" 
                    className="mr-2 h-8 w-8 text-[#a0a0a0] hover:text-white hover:bg-[#2a2a2a]"
                  >
                    <Mic className="w-4 h-4" />
                  </Button>
                  
                  <Button 
                    type="submit" 
                    size="icon" 
                    disabled={!inputValue.trim() || isTyping}
                    className="mr-3 h-8 w-8 bg-[#00ffff] hover:bg-[#00cccc] text-black disabled:opacity-50 rounded-lg"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </form>

              <div className="text-center mt-3">
                <p className="text-xs text-[#a0a0a0]">
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
