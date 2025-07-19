import { useState } from "react";
import { Settings as SettingsIcon, Save, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Navigation } from "@/components/Navigation";

const Settings = () => {
  const [systemPrompt, setSystemPrompt] = useState(
    "You are ShiftIQ, an intelligent assistant for restaurant staff. You provide helpful, accurate information about restaurant operations, POS systems, kitchen procedures, beer knowledge, and hospitality best practices. Always be professional, concise, and supportive."
  );

  const [fallbackCategories, setFallbackCategories] = useState({
    hospitality: true,
    pos: true,
    beer: true,
    cocktails: true,
    kitchen: false,
    hr: false,
    management: false
  });

  const [rejectionPhrase, setRejectionPhrase] = useState(
    "I'm sorry, but I can only help with restaurant-related questions. Please ask me about POS systems, kitchen procedures, beer knowledge, or hospitality topics."
  );

  const [botTone, setBotTone] = useState(
    "professional and helpful with a friendly, supportive tone"
  );

  const handleSave = () => {
    // Save settings logic here
    console.log("Settings saved:", {
      systemPrompt,
      fallbackCategories,
      rejectionPhrase,
      botTone
    });
  };

  const handleReset = () => {
    // Reset to defaults
    setSystemPrompt("You are ShiftIQ, an intelligent assistant for restaurant staff. You provide helpful, accurate information about restaurant operations, POS systems, kitchen procedures, beer knowledge, and hospitality best practices. Always be professional, concise, and supportive.");
    setFallbackCategories({
      hospitality: true,
      pos: true,
      beer: true,
      cocktails: true,
      kitchen: false,
      hr: false,
      management: false
    });
    setRejectionPhrase("I'm sorry, but I can only help with restaurant-related questions. Please ask me about POS systems, kitchen procedures, beer knowledge, or hospitality topics.");
    setBotTone("professional and helpful with a friendly, supportive tone");
  };

  const toggleCategory = (category: keyof typeof fallbackCategories) => {
    setFallbackCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2 flex items-center justify-center gap-2">
            <SettingsIcon className="w-8 h-8 text-primary" />
            System Settings
          </h1>
          <p className="text-muted-foreground">Configure ShiftIQ's behavior and responses</p>
          <Badge variant="secondary" className="mt-2">Admin Only</Badge>
        </div>

        <Tabs defaultValue="prompt" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="prompt">System Prompt</TabsTrigger>
            <TabsTrigger value="fallback">Fallback Settings</TabsTrigger>
            <TabsTrigger value="tone">Response Tone</TabsTrigger>
          </TabsList>

          <TabsContent value="prompt" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>System Prompt Configuration</CardTitle>
                <p className="text-sm text-muted-foreground">
                  This prompt defines how ShiftIQ behaves and responds to questions. Changes take effect immediately.
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="system-prompt">System Prompt</Label>
                  <Textarea
                    id="system-prompt"
                    value={systemPrompt}
                    onChange={(e) => setSystemPrompt(e.target.value)}
                    rows={8}
                    className="mt-2"
                    placeholder="Enter the system prompt that defines ShiftIQ's behavior..."
                  />
                  <p className="text-xs text-muted-foreground mt-2">
                    Character count: {systemPrompt.length}
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="fallback" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Fallback Categories</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Enable which topics ShiftIQ can fall back to GPT-4 for when internal documentation doesn't have an answer.
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(fallbackCategories).map(([category, enabled]) => (
                    <div key={category} className="flex items-center justify-between p-3 border border-border rounded-lg">
                      <div>
                        <Label className="capitalize font-medium">{category.replace(/([A-Z])/g, ' $1')}</Label>
                        <p className="text-sm text-muted-foreground">
                          {category === 'hospitality' && 'Customer service and guest relations'}
                          {category === 'pos' && 'Point of sale system operations'}
                          {category === 'beer' && 'Beer knowledge and recommendations'}
                          {category === 'cocktails' && 'Cocktail recipes and mixing'}
                          {category === 'kitchen' && 'Kitchen procedures and cooking'}
                          {category === 'hr' && 'Human resources and policies'}
                          {category === 'management' && 'Management and operations'}
                        </p>
                      </div>
                      <Switch
                        checked={enabled}
                        onCheckedChange={() => toggleCategory(category as keyof typeof fallbackCategories)}
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Rejection Message</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Message shown when a question falls outside allowed categories.
                </p>
              </CardHeader>
              <CardContent>
                <div>
                  <Label htmlFor="rejection-phrase">Rejection Phrase</Label>
                  <Textarea
                    id="rejection-phrase"
                    value={rejectionPhrase}
                    onChange={(e) => setRejectionPhrase(e.target.value)}
                    rows={4}
                    className="mt-2"
                    placeholder="Enter the message shown for unauthorized topics..."
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tone" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Response Tone & Style</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Configure how ShiftIQ communicates with users.
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="bot-tone">Bot Personality & Tone</Label>
                  <Textarea
                    id="bot-tone"
                    value={botTone}
                    onChange={(e) => setBotTone(e.target.value)}
                    rows={3}
                    className="mt-2"
                    placeholder="Describe how the bot should communicate (e.g., professional, friendly, casual, etc.)"
                  />
                  <p className="text-xs text-muted-foreground mt-2">
                    This description helps guide the bot's communication style and personality.
                  </p>
                </div>

                <div className="border border-border rounded-lg p-4">
                  <h4 className="font-medium mb-2">Current Configuration Summary</h4>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-muted-foreground">Enabled fallback categories:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {Object.entries(fallbackCategories)
                          .filter(([_, enabled]) => enabled)
                          .map(([category]) => (
                            <Badge key={category} variant="secondary" className="text-xs">
                              {category.charAt(0).toUpperCase() + category.slice(1)}
                            </Badge>
                          ))
                        }
                      </div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Response tone:</span>
                      <span className="ml-2 text-foreground">{botTone}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Action Buttons */}
        <div className="flex gap-4 justify-center mt-8">
          <Button onClick={handleReset} variant="outline" className="flex items-center gap-2">
            <RotateCcw className="w-4 h-4" />
            Reset to Defaults
          </Button>
          <Button onClick={handleSave} className="flex items-center gap-2 glow-primary">
            <Save className="w-4 h-4" />
            Save Settings
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Settings;