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
  return <div className="min-h-screen bg-background flex flex-col">
      <Navigation />
      
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Messages */}
        <div className="flex-1 flex flex-col justify-center items-center px-4">
          {messages.length === 0 ? <div className="flex flex-col items-center space-y-6 w-full max-w-2xl">
              {/* Bot Icon */}
              <div className="w-20 h-20 rounded-2xl bg-muted/30 flex items-center justify-center mb-4">
                <Bot className="w-10 h-10 text-muted-foreground" />
              </div>
              
              {/* Welcome Message */}
              <div className="text-center space-y-1 mb-8">
                <h1 className="text-3xl font-normal text-foreground">Welcome Back</h1>
                <h2 className="text-3xl font-normal text-foreground">How can I help with your shift?</h2>
                
              </div>
            </div> : <div className="w-full max-w-2xl space-y-4 px-4">
              {messages.map(message => <div key={message.id} className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}>
                  <div className={`flex items-start gap-3 max-w-[80%] ${message.isUser ? 'flex-row-reverse' : ''}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${message.isUser ? 'bg-primary' : 'bg-secondary'}`}>
                      {message.isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                    </div>
                    <Card className={`p-4 ${message.isUser ? 'bg-primary/20' : 'bg-secondary/20'}`}>
                      <p className="text-foreground">{message.text}</p>
                      <p className="text-xs text-muted-foreground mt-2">
                        {message.timestamp.toLocaleTimeString()}
                      </p>
                    </Card>
                  </div>
                </div>)}
            </div>}
        </div>

        {/* Bottom Section */}
        <div className="w-full px-4 pb-6">
          <div className="max-w-2xl mx-auto">
            {/* Typing Indicator */}
            {isTyping && (
              <div className="mb-3 flex justify-center">
                <div className="px-4 py-2 bg-orange-500/10 border border-orange-500/20 rounded-full">
                  <p className="text-orange-500/80 text-sm typing-dots">ShiftIQ is thinking…</p>
                </div>
              </div>
            )}

            {/* Input Bar */}
            <div className="mb-4">
              <form onSubmit={handleSubmit} className="relative">
                <div className="flex items-center bg-muted/20 rounded-lg border border-border">
                  <Button type="button" size="icon" variant="ghost" className="ml-2 h-10 w-10 text-muted-foreground hover:text-foreground">
                    <Plus className="w-5 h-5" />
                  </Button>
                  <Input value={inputValue} onChange={e => setInputValue(e.target.value)} placeholder="Ask anything ..." className="flex-1 border-0 bg-transparent h-14 text-base placeholder:text-muted-foreground focus-visible:ring-0 focus-visible:ring-offset-0" disabled={isTyping} />
                  <Button type="button" size="icon" variant="ghost" className="mr-2 h-10 w-10 text-muted-foreground hover:text-foreground">
                    <Mic className="w-5 h-5" />
                  </Button>
                </div>
              </form>
            </div>

            {/* Category Buttons */}
            <div className="flex items-center justify-center gap-3 mb-4">
              <Button variant="outline" size="sm" className="text-muted-foreground hover:text-foreground">
                POS
              </Button>
              <Button variant="outline" size="sm" className="text-muted-foreground hover:text-foreground">
                FOH
              </Button>
              <Button variant="outline" size="sm" className="text-muted-foreground hover:text-foreground">
                BOH
              </Button>
              <Button variant="outline" size="sm" className="text-muted-foreground hover:text-foreground">
                HR
              </Button>
              <Button variant="outline" size="sm" className="text-muted-foreground hover:text-foreground">
                Menu
              </Button>
              <Button variant="outline" size="sm" className="text-muted-foreground hover:text-foreground">
                Square
              </Button>
            </div>

            {/* Suggested Actions */}
            {messages.length === 0 && <div className="flex items-center justify-center gap-6">
                <Button variant="ghost" size="sm" onClick={() => handlePromptClick("Any advice for me?")} className="text-muted-foreground hover:text-foreground text-sm font-normal">
                  <User className="w-4 h-4 mr-2" />
                  Any advice for me?
                </Button>
                <Button variant="ghost" size="sm" onClick={() => handlePromptClick("Some youtube video idea")} className="text-muted-foreground hover:text-foreground text-sm font-normal">
                  <Bot className="w-4 h-4 mr-2" />
                  Some youtube video idea
                </Button>
                <Button variant="ghost" size="sm" onClick={() => handlePromptClick("Life lessons from kratos")} className="text-muted-foreground hover:text-foreground text-sm font-normal">
                  <Bot className="w-4 h-4 mr-2" />
                  Life lessons from kratos
                </Button>
                <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                  <span className="text-lg">•••</span>
                </Button>
              </div>}

            {/* Example Prompts */}
            <div className="mt-6 grid grid-cols-2 md:grid-cols-3 gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePromptClick("How do I 86 something?")}
                className="text-left justify-start text-muted-foreground hover:text-foreground h-auto py-3 px-4"
              >
                How do I 86 something?
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePromptClick("What's our beer selection?")}
                className="text-left justify-start text-muted-foreground hover:text-foreground h-auto py-3 px-4"
              >
                What's our beer selection?
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePromptClick("POS troubleshooting")}
                className="text-left justify-start text-muted-foreground hover:text-foreground h-auto py-3 px-4"
              >
                POS troubleshooting
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePromptClick("Table rotation policy")}
                className="text-left justify-start text-muted-foreground hover:text-foreground h-auto py-3 px-4"
              >
                Table rotation policy
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePromptClick("Cocktail recipes")}
                className="text-left justify-start text-muted-foreground hover:text-foreground h-auto py-3 px-4"
              >
                Cocktail recipes
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePromptClick("Dress code")}
                className="text-left justify-start text-muted-foreground hover:text-foreground h-auto py-3 px-4"
              >
                Dress code
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>;
};
export default Chat;