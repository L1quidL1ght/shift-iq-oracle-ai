
import { useState } from "react";
import { NavLink } from "react-router-dom";
import { MessageCircle, Upload, LogIn, LogOut, History, Settings, Menu, X, Bot, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useAuth } from "@/contexts/AuthContext";
import AdminBadge from "./AdminBadge";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, profile, isAdmin, signOut } = useAuth();

  const navItems = [
    { to: "/chat", icon: MessageCircle, label: "Chat" },
    ...(isAdmin ? [
      { to: "/upload", icon: Upload, label: "Upload", adminOnly: true },
      { to: "/settings", icon: Settings, label: "Settings", adminOnly: true },
    ] : []),
    ...(user ? [
      { to: "/history", icon: History, label: "History" },
    ] : []),
  ];

  const closeSheet = () => setIsOpen(false);

  const handleSignOut = async () => {
    await signOut();
    closeSheet();
  };

  return (
    <nav className="border-b border-[#333] bg-[#1a1a1a] sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <NavLink to="/" className="flex items-center gap-2">
            <Bot className="w-6 h-6 text-[#00ffff]" />
            <div>
              <span className="text-xl font-bold text-white">ShiftIQ</span>
              <p className="text-xs text-[#a0a0a0]">by MuleKick</p>
            </div>
          </NavLink>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map(({ to, icon: Icon, label, adminOnly }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                    isActive
                      ? "bg-[#00ffff] text-black"
                      : "text-[#a0a0a0] hover:text-white hover:bg-[#2a2a2a]"
                  }`
                }
              >
                <Icon className="w-4 h-4" />
                <span className="text-sm font-medium">{label}</span>
                {adminOnly && <AdminBadge role="content_admin" size="sm" />}
              </NavLink>
            ))}
            
            {/* Auth Button */}
            {user ? (
              <div className="flex items-center gap-2 ml-2">
                <div className="flex items-center gap-2 px-3 py-2 text-sm">
                  <User className="w-4 h-4" />
                  <span className="text-[#a0a0a0]">
                    {user.email}
                  </span>
                  {profile && <AdminBadge role={profile.role} size="sm" />}
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleSignOut}
                  className="text-[#a0a0a0] hover:text-white hover:bg-[#2a2a2a]"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="ml-2">Sign Out</span>
                </Button>
              </div>
            ) : (
              <NavLink
                to="/login"
                className={({ isActive }) =>
                  `flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                    isActive
                      ? "bg-[#00ffff] text-black"
                      : "text-[#a0a0a0] hover:text-white hover:bg-[#2a2a2a]"
                  }`
                }
              >
                <LogIn className="w-4 h-4" />
                <span className="text-sm font-medium">Login</span>
              </NavLink>
            )}
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="text-[#a0a0a0] hover:text-white hover:bg-[#2a2a2a]">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-64 bg-[#1a1a1a] border-[#333]">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <Bot className="w-6 h-6 text-[#00ffff]" />
                    <div>
                      <span className="text-lg font-bold text-white">ShiftIQ</span>
                      <p className="text-xs text-[#a0a0a0]">by MuleKick</p>
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={closeSheet}
                    className="text-[#a0a0a0] hover:text-white hover:bg-[#2a2a2a]"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                
                <div className="space-y-2">
                  {navItems.map(({ to, icon: Icon, label, adminOnly }) => (
                    <NavLink
                      key={to}
                      to={to}
                      onClick={closeSheet}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-3 py-3 rounded-lg transition-colors w-full ${
                          isActive
                            ? "bg-[#00ffff] text-black"
                            : "text-[#a0a0a0] hover:text-white hover:bg-[#2a2a2a]"
                        }`
                      }
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{label}</span>
                      {adminOnly && <AdminBadge role="content_admin" size="sm" />}
                    </NavLink>
                  ))}
                  
                  {/* Mobile Auth */}
                  {user ? (
                    <>
                      <div className="flex items-center gap-2 px-3 py-3 border-t border-[#333] mt-4 pt-4">
                        <User className="w-5 h-5" />
                        <div className="flex-1">
                          <span className="font-medium text-white block">
                            {user.email}
                          </span>
                          {profile && <AdminBadge role={profile.role} size="sm" />}
                        </div>
                      </div>
                      <Button 
                        variant="ghost" 
                        className="w-full justify-start px-3 py-3 h-auto text-[#a0a0a0] hover:text-white hover:bg-[#2a2a2a]"
                        onClick={handleSignOut}
                      >
                        <LogOut className="w-5 h-5" />
                        <span className="ml-3">Sign Out</span>
                      </Button>
                    </>
                  ) : (
                    <NavLink
                      to="/login"
                      onClick={closeSheet}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-3 py-3 rounded-lg transition-colors w-full ${
                          isActive
                            ? "bg-[#00ffff] text-black"
                            : "text-[#a0a0a0] hover:text-white hover:bg-[#2a2a2a]"
                        }`
                      }
                    >
                      <LogIn className="w-5 h-5" />
                      <span className="font-medium">Login</span>
                    </NavLink>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
};

export { Navigation };
