import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useDropzone } from "react-dropzone";
import { 
  Upload as UploadIcon, 
  FileText, 
  Search, 
  Edit2, 
  Trash2, 
  X, 
  Check, 
  Filter,
  AlertCircle,
  Loader2,
  CloudUpload
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Navigation } from "@/components/Navigation";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/contexts/AuthContext";
import { supabase, type Document } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

const CATEGORIES = ["POS", "Kitchen", "HR", "Beer", "Cocktails", "Service"];
const SUPPORTED_TYPES = {
  'text/plain': ['.txt'],
  'text/markdown': ['.md'], 
  'application/pdf': ['.pdf'],
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
};

const FILE_EXTENSIONS = {
  '.txt': 'text/plain',
  '.md': 'text/markdown',
  '.pdf': 'application/pdf',
  '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
};

interface UploadProgress {
  filename: string;
  progress: number;
  status: 'uploading' | 'processing' | 'complete' | 'error';
  error?: string;
}

interface EditingDocument {
  id: string;
  title: string;
  category: string;
  tags: string;
}

const Upload = () => {
  const navigate = useNavigate();
  const { user, profile, isAdmin } = useAuth();
  const { toast } = useToast();
  
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [editingDoc, setEditingDoc] = useState<EditingDocument | null>(null);
  const [deleteDoc, setDeleteDoc] = useState<Document | null>(null);
  const [uploads, setUploads] = useState<UploadProgress[]>([]);
  
  // Form state for manual document creation
  const [showManualForm, setShowManualForm] = useState(false);
  const [manualDoc, setManualDoc] = useState({
    title: '',
    category: '',
    tags: '',
    content: ''
  });

  // Check admin access
  useEffect(() => {
    if (!isAdmin && !loading) {
      toast({
        variant: "destructive",
        title: "Access Denied",
        description: "You need admin privileges to access this page."
      });
      navigate('/chat');
    }
  }, [isAdmin, loading, navigate, toast]);

  // Load documents
  const loadDocuments = useCallback(async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDocuments(data || []);
    } catch (error) {
      console.error('Error loading documents:', error);
      toast({
        variant: "destructive",
        title: "Error loading documents",
        description: "Failed to load documents from database."
      });
    } finally {
      setLoading(false);
    }
  }, [user, toast]);

  useEffect(() => {
    loadDocuments();
  }, [loadDocuments]);

  // Process file upload
  const processFile = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsText(file);
    });
  };

  // Handle file drops
  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const newUploads: UploadProgress[] = acceptedFiles.map(file => ({
      filename: file.name,
      progress: 0,
      status: 'uploading'
    }));
    
    setUploads(prev => [...prev, ...newUploads]);

    for (let i = 0; i < acceptedFiles.length; i++) {
      const file = acceptedFiles[i];
      const uploadIndex = uploads.length + i;
      
      try {
        // Update progress
        setUploads(prev => prev.map((upload, idx) => 
          idx === uploadIndex ? { ...upload, progress: 25 } : upload
        ));

        // Read file content
        const content = await processFile(file);
        
        setUploads(prev => prev.map((upload, idx) => 
          idx === uploadIndex ? { ...upload, progress: 50 } : upload
        ));

        // Determine file type
        const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
        const fileType = fileExtension;

        // Create document in database
        const { data: newDoc, error } = await supabase
          .from('documents')
          .insert({
            title: file.name.replace(/\.[^/.]+$/, ""), // Remove extension
            content,
            category: 'POS', // Default category
            tags: [],
            file_type: fileType,
            created_by: profile?.id
          })
          .select()
          .single();

        if (error) throw error;

        setUploads(prev => prev.map((upload, idx) => 
          idx === uploadIndex ? { ...upload, progress: 75, status: 'processing' } : upload
        ));

        // Process document for embeddings
        const response = await fetch('https://zcjuzbjspjlcrclqrjhq.supabase.co/functions/v1/process-document', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`
          },
          body: JSON.stringify({ documentId: newDoc.id })
        });

        if (!response.ok) {
          throw new Error('Failed to process document');
        }

        setUploads(prev => prev.map((upload, idx) => 
          idx === uploadIndex ? { ...upload, progress: 100, status: 'complete' } : upload
        ));

        // Reload documents
        loadDocuments();

        toast({
          title: "Document uploaded successfully",
          description: `${file.name} has been processed and is ready for use.`
        });

      } catch (error) {
        console.error('Upload error:', error);
        setUploads(prev => prev.map((upload, idx) => 
          idx === uploadIndex ? { 
            ...upload, 
            status: 'error', 
            error: error instanceof Error ? error.message : 'Upload failed'
          } : upload
        ));
        
        toast({
          variant: "destructive",
          title: "Upload failed",
          description: `Failed to upload ${file.name}`
        });
      }
    }

    // Clear completed uploads after 3 seconds
    setTimeout(() => {
      setUploads(prev => prev.filter(upload => upload.status !== 'complete'));
    }, 3000);
  }, [uploads.length, profile?.id, loadDocuments, toast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: SUPPORTED_TYPES,
    maxSize: 10485760, // 10MB
    multiple: true
  });

  // Handle manual document creation
  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualDoc.title || !manualDoc.category || !manualDoc.content) return;

    try {
      const { data: newDoc, error } = await supabase
        .from('documents')
        .insert({
          title: manualDoc.title,
          content: manualDoc.content,
          category: manualDoc.category,
          tags: manualDoc.tags.split(',').map(tag => tag.trim()).filter(Boolean),
          file_type: '.txt',
          created_by: profile?.id
        })
        .select()
        .single();

      if (error) throw error;

      // Process for embeddings
      await fetch('https://zcjuzbjspjlcrclqrjhq.supabase.co/functions/v1/process-document', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`
        },
        body: JSON.stringify({ documentId: newDoc.id })
      });

      setManualDoc({ title: '', category: '', tags: '', content: '' });
      setShowManualForm(false);
      loadDocuments();
      
      toast({
        title: "Document created successfully",
        description: "Your document has been saved and processed."
      });
    } catch (error) {
      console.error('Error creating document:', error);
      toast({
        variant: "destructive",
        title: "Error creating document",
        description: "Failed to save document to database."
      });
    }
  };

  // Handle document editing
  const handleEdit = async () => {
    if (!editingDoc) return;

    try {
      const { error } = await supabase
        .from('documents')
        .update({
          title: editingDoc.title,
          category: editingDoc.category,
          tags: editingDoc.tags.split(',').map(tag => tag.trim()).filter(Boolean),
          updated_at: new Date().toISOString()
        })
        .eq('id', editingDoc.id);

      if (error) throw error;

      setEditingDoc(null);
      loadDocuments();
      
      toast({
        title: "Document updated",
        description: "Document has been successfully updated."
      });
    } catch (error) {
      console.error('Error updating document:', error);
      toast({
        variant: "destructive",
        title: "Error updating document",
        description: "Failed to update document."
      });
    }
  };

  // Handle document deletion
  const handleDelete = async () => {
    if (!deleteDoc) return;

    try {
      const { error } = await supabase
        .from('documents')
        .delete()
        .eq('id', deleteDoc.id);

      if (error) throw error;

      setDeleteDoc(null);
      loadDocuments();
      
      toast({
        title: "Document deleted",
        description: "Document has been successfully deleted."
      });
    } catch (error) {
      console.error('Error deleting document:', error);
      toast({
        variant: "destructive",
        title: "Error deleting document",
        description: "Failed to delete document."
      });
    }
  };

  // Filter documents
  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || doc.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (!isAdmin) {
    return null; // Prevent flash before redirect
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Document Management</h1>
          <p className="text-muted-foreground text-lg">Upload and manage internal documentation for ShiftIQ</p>
          <div className="flex items-center justify-center gap-2 mt-4">
            <Badge variant="secondary" className="text-secondary-foreground">
              Admin Access Required
            </Badge>
            {profile && (
              <Badge variant="outline">
                Role: {profile.role.replace('_', ' ').toUpperCase()}
              </Badge>
            )}
          </div>
        </div>

        <Tabs defaultValue="upload" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="upload">Upload Documents</TabsTrigger>
            <TabsTrigger value="manage">Manage Documents</TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="space-y-6">
            {/* File Upload Area */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CloudUpload className="w-5 h-5" />
                  File Upload
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div
                  {...getRootProps()}
                  className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-200 ${
                    isDragActive 
                      ? 'border-primary bg-primary/10 scale-105' 
                      : 'border-border hover:border-primary/50 hover:bg-muted/50'
                  }`}
                >
                  <input {...getInputProps()} />
                  <UploadIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  {isDragActive ? (
                    <p className="text-primary text-lg font-medium">Drop files here to upload</p>
                  ) : (
                    <div>
                      <p className="text-foreground text-lg font-medium mb-2">
                        Drag & drop files here, or click to select
                      </p>
                      <p className="text-muted-foreground text-sm">
                        Supports: {Object.keys(FILE_EXTENSIONS).join(', ')} (max 10MB each)
                      </p>
                    </div>
                  )}
                </div>

                {/* Upload Progress */}
                {uploads.length > 0 && (
                  <div className="mt-6 space-y-3">
                    <h4 className="font-medium text-foreground">Upload Progress</h4>
                    {uploads.map((upload, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-foreground">{upload.filename}</span>
                          <div className="flex items-center gap-2">
                            {upload.status === 'uploading' && <Loader2 className="w-4 h-4 animate-spin" />}
                            {upload.status === 'processing' && <Loader2 className="w-4 h-4 animate-spin" />}
                            {upload.status === 'complete' && <Check className="w-4 h-4 text-green-500" />}
                            {upload.status === 'error' && <AlertCircle className="w-4 h-4 text-destructive" />}
                            <span className="text-muted-foreground">
                              {upload.status === 'complete' ? 'Complete' : 
                               upload.status === 'error' ? 'Failed' :
                               upload.status === 'processing' ? 'Processing...' : 'Uploading...'}
                            </span>
                          </div>
                        </div>
                        <Progress value={upload.progress} className="h-2" />
                        {upload.error && (
                          <p className="text-destructive text-xs">{upload.error}</p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Manual Document Creation */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Create Document Manually
                </CardTitle>
              </CardHeader>
              <CardContent>
                {!showManualForm ? (
                  <Button onClick={() => setShowManualForm(true)} variant="outline" className="w-full">
                    Create New Document
                  </Button>
                ) : (
                  <form onSubmit={handleManualSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="title">Document Title *</Label>
                        <Input
                          id="title"
                          value={manualDoc.title}
                          onChange={(e) => setManualDoc(prev => ({ ...prev, title: e.target.value }))}
                          placeholder="e.g., POS Refund Procedures"
                        />
                      </div>
                      <div>
                        <Label htmlFor="category">Category *</Label>
                        <Select value={manualDoc.category} onValueChange={(value) => setManualDoc(prev => ({ ...prev, category: value }))}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select Category" />
                          </SelectTrigger>
                          <SelectContent>
                            {CATEGORIES.map(cat => (
                              <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="tags">Tags (comma-separated)</Label>
                      <Input
                        id="tags"
                        value={manualDoc.tags}
                        onChange={(e) => setManualDoc(prev => ({ ...prev, tags: e.target.value }))}
                        placeholder="e.g., refund, payment, procedure"
                      />
                    </div>
                    <div>
                      <Label htmlFor="content">Content *</Label>
                      <Textarea
                        id="content"
                        value={manualDoc.content}
                        onChange={(e) => setManualDoc(prev => ({ ...prev, content: e.target.value }))}
                        placeholder="Enter the document content here..."
                        rows={8}
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button type="submit" disabled={!manualDoc.title || !manualDoc.category || !manualDoc.content}>
                        Create Document
                      </Button>
                      <Button type="button" variant="outline" onClick={() => setShowManualForm(false)}>
                        Cancel
                      </Button>
                    </div>
                  </form>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="manage" className="space-y-6">
            {/* Search and Filters */}
            <Card>
              <CardContent className="p-4">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      placeholder="Search documents by title or tags..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4 text-muted-foreground" />
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                      <SelectTrigger className="w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        {CATEGORIES.map(cat => (
                          <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Documents Table */}
            <Card>
              <CardHeader>
                <CardTitle>Documents ({filteredDocuments.length})</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
                  </div>
                ) : filteredDocuments.length === 0 ? (
                  <div className="text-center py-8">
                    <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">
                      {searchTerm || selectedCategory !== 'all' ? 'No documents match your search criteria' : 'No documents uploaded yet'}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredDocuments.map(doc => (
                      <div key={doc.id} className="border border-border rounded-lg p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-foreground truncate">{doc.title}</h4>
                            <div className="flex items-center gap-2 mt-2 flex-wrap">
                              <Badge variant="outline">{doc.category}</Badge>
                              <Badge variant="secondary" className="text-xs">{doc.file_type}</Badge>
                              {doc.tags.map(tag => (
                                <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
                              ))}
                            </div>
                            <p className="text-sm text-muted-foreground mt-2">
                              Created: {new Date(doc.created_at).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="flex gap-2 ml-4">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setEditingDoc({
                                id: doc.id,
                                title: doc.title,
                                category: doc.category,
                                tags: doc.tags.join(', ')
                              })}
                            >
                              <Edit2 className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => setDeleteDoc(doc)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Edit Dialog */}
      <Dialog open={!!editingDoc} onOpenChange={() => setEditingDoc(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Document</DialogTitle>
          </DialogHeader>
          {editingDoc && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-title">Title</Label>
                <Input
                  id="edit-title"
                  value={editingDoc.title}
                  onChange={(e) => setEditingDoc(prev => prev ? { ...prev, title: e.target.value } : null)}
                />
              </div>
              <div>
                <Label htmlFor="edit-category">Category</Label>
                <Select value={editingDoc.category} onValueChange={(value) => setEditingDoc(prev => prev ? { ...prev, category: value } : null)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map(cat => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="edit-tags">Tags (comma-separated)</Label>
                <Input
                  id="edit-tags"
                  value={editingDoc.tags}
                  onChange={(e) => setEditingDoc(prev => prev ? { ...prev, tags: e.target.value } : null)}
                />
              </div>
              <div className="flex gap-2 pt-4">
                <Button onClick={handleEdit}>Save Changes</Button>
                <Button variant="outline" onClick={() => setEditingDoc(null)}>Cancel</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteDoc} onOpenChange={() => setDeleteDoc(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Document</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{deleteDoc?.title}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Upload;