
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, User, Mail, Lock, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { createSuperAdmin } from '@/utils/createSuperAdmin';

const AdminSetup = () => {
  const { signUp } = useAuth();
  const { toast } = useToast();
  const [isCreating, setIsCreating] = useState(false);
  const [adminForm, setAdminForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (adminForm.password !== adminForm.confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "Passwords do not match. Please try again.",
        variant: "destructive",
      });
      return;
    }

    if (adminForm.password.length < 6) {
      toast({
        title: "Password Too Short",
        description: "Password must be at least 6 characters long.",
        variant: "destructive",
      });
      return;
    }

    setIsCreating(true);
    
    try {
      const { error } = await signUp(adminForm.email, adminForm.password, adminForm.name);
      
      if (error) {
        toast({
          title: "Admin Creation Failed",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Admin Account Created!",
          description: "Please check your email to verify your account. You'll need to manually set the admin role in Supabase dashboard.",
        });
        
        // Reset form
        setAdminForm({ name: '', email: '', password: '', confirmPassword: '' });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
    }
    
    setIsCreating(false);
  };

  const handleCreateSuperAdmin = async () => {
    setIsCreating(true);
    
    try {
      const result = await createSuperAdmin();
      
      if (result.success) {
        toast({
          title: "Super Admin Created!",
          description: result.message,
        });
      } else {
        toast({
          title: "Super Admin Creation Failed",
          description: result.error,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
    }
    
    setIsCreating(false);
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2 text-xl">
          <Shield className="w-5 h-5 text-primary" />
          Create Admin Account
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <Alert className="mb-6">
          <Shield className="w-4 h-4" />
          <AlertDescription>
            Click the button below to create a super admin account with pre-configured credentials.
          </AlertDescription>
        </Alert>

        <div className="space-y-4">
          <Button onClick={handleCreateSuperAdmin} className="w-full" disabled={isCreating}>
            {isCreating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                Creating Super Admin...
              </>
            ) : (
              <>
                <Shield className="w-4 h-4 mr-2" />
                Create Super Admin Account
              </>
            )}
          </Button>
        </div>

        <form onSubmit={handleCreateAdmin} className="space-y-4 mt-8">
          <div>
            <Label htmlFor="admin-name">Full Name</Label>
            <div className="relative">
              <User className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
              <Input
                id="admin-name"
                type="text"
                value={adminForm.name}
                onChange={(e) => setAdminForm(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter admin's full name"
                className="pl-10"
                required
                disabled={isCreating}
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="admin-email">Email</Label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
              <Input
                id="admin-email"
                type="email"
                value={adminForm.email}
                onChange={(e) => setAdminForm(prev => ({ ...prev, email: e.target.value }))}
                placeholder="Enter admin email"
                className="pl-10"
                required
                disabled={isCreating}
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="admin-password">Password</Label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
              <Input
                id="admin-password"
                type="password"
                value={adminForm.password}
                onChange={(e) => setAdminForm(prev => ({ ...prev, password: e.target.value }))}
                placeholder="Create a password"
                className="pl-10"
                required
                minLength={6}
                disabled={isCreating}
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="admin-confirm-password">Confirm Password</Label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
              <Input
                id="admin-confirm-password"
                type="password"
                value={adminForm.confirmPassword}
                onChange={(e) => setAdminForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                placeholder="Confirm password"
                className="pl-10"
                required
                minLength={6}
                disabled={isCreating}
              />
            </div>
          </div>
          
          <Button type="submit" className="w-full" disabled={isCreating}>
            {isCreating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                Creating Admin...
              </>
            ) : (
              <>
                <Shield className="w-4 h-4 mr-2" />
                Create Admin Account
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default AdminSetup;
