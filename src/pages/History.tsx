import { useState } from "react";
import { History as HistoryIcon, Bookmark, Search, Filter, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Navigation } from "@/components/Navigation";

interface HistoryItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  timestamp: Date;
  isBookmarked: boolean;
}

const History = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  // Mock data - in real app this would come from API/database
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>([
    {
      id: "1",
      question: "How do I process a refund in the POS?",
      answer: "To process a refund in the POS system: 1. Go to the Orders menu, 2. Find the original order, 3. Select 'Refund' option, 4. Choose full or partial refund, 5. Confirm the refund amount and reason.",
      category: "POS",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      isBookmarked: true
    },
    {
      id: "2",
      question: "What's the alcohol content of our Hazy IPA?",
      answer: "Our Hazy IPA has an alcohol content of 6.8% ABV with 45 IBU. It features tropical fruit notes with a smooth, hazy finish.",
      category: "Beer",
      timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
      isBookmarked: false
    },
    {
      id: "3",
      question: "What are the closing procedures for the kitchen?",
      answer: "Kitchen closing procedures: 1. Clean all cooking surfaces and equipment, 2. Store food items properly, 3. Check refrigeration temperatures, 4. Complete cleaning checklist, 5. Lock all storage areas.",
      category: "Kitchen",
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
      isBookmarked: true
    }
  ]);

  const categories = ["All", "POS", "Kitchen", "HR", "Beer", "Cocktails", "Service", "Management"];

  const filteredItems = historyItems.filter(item => {
    const matchesSearch = item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.answer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || selectedCategory === "All" || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const bookmarkedItems = filteredItems.filter(item => item.isBookmarked);

  const toggleBookmark = (id: string) => {
    setHistoryItems(prev => prev.map(item => 
      item.id === id ? { ...item, isBookmarked: !item.isBookmarked } : item
    ));
  };

  const deleteItem = (id: string) => {
    setHistoryItems(prev => prev.filter(item => item.id !== id));
  };

  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 48) return "Yesterday";
    return date.toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2 flex items-center justify-center gap-2">
            <HistoryIcon className="w-8 h-8 text-primary" />
            Question History
          </h1>
          <p className="text-muted-foreground">Review your previous questions and bookmarked answers</p>
        </div>

        {/* Search and Filter */}
        <div className="mb-6 space-y-4">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search your questions and answers..."
              className="pl-10"
            />
          </div>
          
          <div className="flex flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Filter by category:</span>
            </div>
            {categories.map(category => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(selectedCategory === category ? null : category)}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="all">All Questions ({filteredItems.length})</TabsTrigger>
            <TabsTrigger value="bookmarks">Bookmarks ({bookmarkedItems.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            {filteredItems.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <HistoryIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    {searchTerm || selectedCategory ? "No questions match your search" : "No questions in your history yet"}
                  </p>
                </CardContent>
              </Card>
            ) : (
              filteredItems.map(item => (
                <Card key={item.id} className="chat-bubble-glow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{item.category}</Badge>
                        <span className="text-sm text-muted-foreground">{formatTimestamp(item.timestamp)}</span>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleBookmark(item.id)}
                          className={item.isBookmarked ? "text-yellow-500" : "text-muted-foreground"}
                        >
                          <Bookmark className="w-4 h-4" fill={item.isBookmarked ? "currentColor" : "none"} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteItem(item.id)}
                          className="text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div>
                        <p className="font-medium text-foreground mb-1">Question:</p>
                        <p className="text-muted-foreground">{item.question}</p>
                      </div>
                      
                      <div>
                        <p className="font-medium text-foreground mb-1">Answer:</p>
                        <p className="text-muted-foreground">{item.answer}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="bookmarks" className="space-y-4">
            {bookmarkedItems.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <Bookmark className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    No bookmarked questions yet. Click the bookmark icon on any question to save it here.
                  </p>
                </CardContent>
              </Card>
            ) : (
              bookmarkedItems.map(item => (
                <Card key={item.id} className="chat-bubble-glow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{item.category}</Badge>
                        <span className="text-sm text-muted-foreground">{formatTimestamp(item.timestamp)}</span>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleBookmark(item.id)}
                          className="text-yellow-500"
                        >
                          <Bookmark className="w-4 h-4" fill="currentColor" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteItem(item.id)}
                          className="text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div>
                        <p className="font-medium text-foreground mb-1">Question:</p>
                        <p className="text-muted-foreground">{item.question}</p>
                      </div>
                      
                      <div>
                        <p className="font-medium text-foreground mb-1">Answer:</p>
                        <p className="text-muted-foreground">{item.answer}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default History;