import { useState } from "react";
import { LogIn, Mail, Lock, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Navigation } from "@/components/Navigation";

const Login = () => {
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [signupForm, setSignupForm] = useState({ name: '', email: '', password: '' });
  const [magicLinkEmail, setMagicLinkEmail] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle login logic here
    console.log('Login:', loginForm);
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle signup logic here
    console.log('Signup:', signupForm);
  };

  const handleMagicLink = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle magic link logic here
    console.log('Magic link for:', magicLinkEmail);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="flex items-center justify-center px-4 py-12">
        <Card className="w-full max-w-md chat-bubble-glow">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2 text-2xl">
              <LogIn className="w-6 h-6 text-primary" />
              Access ShiftIQ
            </CardTitle>
            <p className="text-muted-foreground">
              Login to save your chat history and bookmarks
            </p>
          </CardHeader>
          
          <CardContent>
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
                <TabsTrigger value="magic">Magic Link</TabsTrigger>
              </TabsList>

              <TabsContent value="login" className="space-y-4">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <Label htmlFor="login-email">Email</Label>
                    <div className="relative">
                      <Mail className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
                      <Input
                        id="login-email"
                        type="email"
                        value={loginForm.email}
                        onChange={(e) => setLoginForm(prev => ({ ...prev, email: e.target.value }))}
                        placeholder="Enter your email"
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="login-password">Password</Label>
                    <div className="relative">
                      <Lock className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
                      <Input
                        id="login-password"
                        type="password"
                        value={loginForm.password}
                        onChange={(e) => setLoginForm(prev => ({ ...prev, password: e.target.value }))}
                        placeholder="Enter your password"
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                  
                  <Button type="submit" className="w-full glow-primary">
                    Sign In
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="signup" className="space-y-4">
                <form onSubmit={handleSignup} className="space-y-4">
                  <div>
                    <Label htmlFor="signup-name">Full Name</Label>
                    <div className="relative">
                      <User className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
                      <Input
                        id="signup-name"
                        type="text"
                        value={signupForm.name}
                        onChange={(e) => setSignupForm(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Enter your full name"
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="signup-email">Email</Label>
                    <div className="relative">
                      <Mail className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
                      <Input
                        id="signup-email"
                        type="email"
                        value={signupForm.email}
                        onChange={(e) => setSignupForm(prev => ({ ...prev, email: e.target.value }))}
                        placeholder="Enter your email"
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="signup-password">Password</Label>
                    <div className="relative">
                      <Lock className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
                      <Input
                        id="signup-password"
                        type="password"
                        value={signupForm.password}
                        onChange={(e) => setSignupForm(prev => ({ ...prev, password: e.target.value }))}
                        placeholder="Create a password"
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                  
                  <Button type="submit" className="w-full glow-primary">
                    Create Account
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="magic" className="space-y-4">
                <form onSubmit={handleMagicLink} className="space-y-4">
                  <div>
                    <Label htmlFor="magic-email">Email</Label>
                    <div className="relative">
                      <Mail className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
                      <Input
                        id="magic-email"
                        type="email"
                        value={magicLinkEmail}
                        onChange={(e) => setMagicLinkEmail(e.target.value)}
                        placeholder="Enter your email"
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                  
                  <Button type="submit" className="w-full glow-primary">
                    Send Magic Link
                  </Button>
                  
                  <p className="text-sm text-muted-foreground text-center">
                    We'll send you a secure link to sign in without a password
                  </p>
                </form>
              </TabsContent>
            </Tabs>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Don't need an account?{" "}
                <a href="/chat" className="text-primary hover:underline">
                  Continue as guest
                </a>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;