import { useState } from "react";
import { Upload as UploadIcon, FileText, Plus, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Navigation } from "@/components/Navigation";

const categories = ["POS", "Kitchen", "HR", "Beer", "Cocktails", "Service", "Management"];

interface Document {
  id: string;
  title: string;
  category: string;
  tags: string[];
  content: string;
  type: 'text' | 'pdf' | 'markdown' | 'word';
  uploadedAt: Date;
}

interface Beer {
  id: string;
  name: string;
  style: string;
  abv: number;
  ibu: number;
  tasteProfile: string;
  brewery: string;
  similarTo?: string;
}

const Upload = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [beers, setBeers] = useState<Beer[]>([]);
  const [newDoc, setNewDoc] = useState({
    title: '',
    category: '',
    tags: '',
    content: ''
  });
  const [newBeer, setNewBeer] = useState({
    name: '',
    style: '',
    abv: '',
    ibu: '',
    tasteProfile: '',
    brewery: '',
    similarTo: ''
  });

  const handleDocSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDoc.title || !newDoc.category || !newDoc.content) return;

    const document: Document = {
      id: Date.now().toString(),
      title: newDoc.title,
      category: newDoc.category,
      tags: newDoc.tags.split(',').map(tag => tag.trim()).filter(Boolean),
      content: newDoc.content,
      type: 'text',
      uploadedAt: new Date()
    };

    setDocuments(prev => [document, ...prev]);
    setNewDoc({ title: '', category: '', tags: '', content: '' });
  };

  const handleBeerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBeer.name || !newBeer.style || !newBeer.brewery) return;

    const beer: Beer = {
      id: Date.now().toString(),
      name: newBeer.name,
      style: newBeer.style,
      abv: parseFloat(newBeer.abv) || 0,
      ibu: parseInt(newBeer.ibu) || 0,
      tasteProfile: newBeer.tasteProfile,
      brewery: newBeer.brewery,
      similarTo: newBeer.similarTo || undefined
    };

    setBeers(prev => [beer, ...prev]);
    setNewBeer({ name: '', style: '', abv: '', ibu: '', tasteProfile: '', brewery: '', similarTo: '' });
  };

  const deleteDocument = (id: string) => {
    setDocuments(prev => prev.filter(doc => doc.id !== id));
  };

  const deleteBeer = (id: string) => {
    setBeers(prev => prev.filter(beer => beer.id !== id));
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Document & Beer Management</h1>
          <p className="text-muted-foreground">Upload internal documentation and manage beer lists</p>
          <Badge variant="secondary" className="mt-2">Admin Only</Badge>
        </div>

        <Tabs defaultValue="documents" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="documents">Documentation</TabsTrigger>
            <TabsTrigger value="beers">Beer List</TabsTrigger>
          </TabsList>

          <TabsContent value="documents" className="space-y-6">
            {/* Upload Form */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UploadIcon className="w-5 h-5" />
                  Upload Documentation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleDocSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="title">Document Title</Label>
                      <Input
                        id="title"
                        value={newDoc.title}
                        onChange={(e) => setNewDoc(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="e.g., POS Refund Procedures"
                      />
                    </div>
                    <div>
                      <Label htmlFor="category">Category</Label>
                      <select
                        id="category"
                        value={newDoc.category}
                        onChange={(e) => setNewDoc(prev => ({ ...prev, category: e.target.value }))}
                        className="w-full h-10 px-3 py-2 bg-input border border-border rounded-md text-foreground"
                      >
                        <option value="">Select Category</option>
                        {categories.map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="tags">Tags (comma-separated)</Label>
                    <Input
                      id="tags"
                      value={newDoc.tags}
                      onChange={(e) => setNewDoc(prev => ({ ...prev, tags: e.target.value }))}
                      placeholder="e.g., refund, payment, procedure"
                    />
                  </div>
                  <div>
                    <Label htmlFor="content">Content</Label>
                    <Textarea
                      id="content"
                      value={newDoc.content}
                      onChange={(e) => setNewDoc(prev => ({ ...prev, content: e.target.value }))}
                      placeholder="Enter the document content here..."
                      rows={8}
                    />
                  </div>
                  <Button type="submit" className="w-full">
                    <Plus className="w-4 h-4 mr-2" />
                    Upload Document
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Documents List */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-foreground">Uploaded Documents</h3>
              {documents.length === 0 ? (
                <Card>
                  <CardContent className="p-8 text-center">
                    <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No documents uploaded yet</p>
                  </CardContent>
                </Card>
              ) : (
                documents.map(doc => (
                  <Card key={doc.id}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-semibold text-foreground">{doc.title}</h4>
                          <div className="flex items-center gap-2 mt-2">
                            <Badge variant="outline">{doc.category}</Badge>
                            {doc.tags.map(tag => (
                              <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
                            ))}
                          </div>
                          <p className="text-sm text-muted-foreground mt-2">
                            {doc.content.substring(0, 150)}...
                          </p>
                          <p className="text-xs text-muted-foreground mt-2">
                            Uploaded: {doc.uploadedAt.toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="destructive" size="sm" onClick={() => deleteDocument(doc.id)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="beers" className="space-y-6">
            {/* Beer Form */}
            <Card>
              <CardHeader>
                <CardTitle>Add Beer to List</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleBeerSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="beer-name">Beer Name</Label>
                      <Input
                        id="beer-name"
                        value={newBeer.name}
                        onChange={(e) => setNewBeer(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="e.g., Hazy IPA"
                      />
                    </div>
                    <div>
                      <Label htmlFor="beer-style">Style</Label>
                      <Input
                        id="beer-style"
                        value={newBeer.style}
                        onChange={(e) => setNewBeer(prev => ({ ...prev, style: e.target.value }))}
                        placeholder="e.g., New England IPA"
                      />
                    </div>
                    <div>
                      <Label htmlFor="beer-abv">ABV (%)</Label>
                      <Input
                        id="beer-abv"
                        type="number"
                        step="0.1"
                        value={newBeer.abv}
                        onChange={(e) => setNewBeer(prev => ({ ...prev, abv: e.target.value }))}
                        placeholder="6.5"
                      />
                    </div>
                    <div>
                      <Label htmlFor="beer-ibu">IBU</Label>
                      <Input
                        id="beer-ibu"
                        type="number"
                        value={newBeer.ibu}
                        onChange={(e) => setNewBeer(prev => ({ ...prev, ibu: e.target.value }))}
                        placeholder="45"
                      />
                    </div>
                    <div>
                      <Label htmlFor="beer-brewery">Brewery</Label>
                      <Input
                        id="beer-brewery"
                        value={newBeer.brewery}
                        onChange={(e) => setNewBeer(prev => ({ ...prev, brewery: e.target.value }))}
                        placeholder="e.g., Local Brewing Co."
                      />
                    </div>
                    <div>
                      <Label htmlFor="beer-similar">Similar To (Optional)</Label>
                      <Input
                        id="beer-similar"
                        value={newBeer.similarTo}
                        onChange={(e) => setNewBeer(prev => ({ ...prev, similarTo: e.target.value }))}
                        placeholder="e.g., Dogfish Head 60 Minute IPA"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="beer-taste">Taste Profile</Label>
                    <Textarea
                      id="beer-taste"
                      value={newBeer.tasteProfile}
                      onChange={(e) => setNewBeer(prev => ({ ...prev, tasteProfile: e.target.value }))}
                      placeholder="Citrusy hop aroma with tropical fruit notes..."
                      rows={3}
                    />
                  </div>
                  <Button type="submit" className="w-full">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Beer
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Beer List */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-foreground">Current Beer List</h3>
              {beers.length === 0 ? (
                <Card>
                  <CardContent className="p-8 text-center">
                    <div className="w-12 h-12 text-muted-foreground mx-auto mb-4">🍺</div>
                    <p className="text-muted-foreground">No beers in the list yet</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {beers.map(beer => (
                    <Card key={beer.id}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h4 className="font-semibold text-foreground">{beer.name}</h4>
                            <p className="text-sm text-muted-foreground">{beer.brewery}</p>
                          </div>
                          <Button variant="destructive" size="sm" onClick={() => deleteBeer(beer.id)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Style:</span>
                            <span className="text-foreground">{beer.style}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">ABV:</span>
                            <span className="text-foreground">{beer.abv}%</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">IBU:</span>
                            <span className="text-foreground">{beer.ibu}</span>
                          </div>
                          {beer.similarTo && (
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Similar to:</span>
                              <span className="text-foreground">{beer.similarTo}</span>
                            </div>
                          )}
                          <p className="text-sm text-muted-foreground mt-2">{beer.tasteProfile}</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Upload;