import { useState } from "react";
import { NavLink } from "react-router-dom";
import { MessageCircle, Upload, LogIn, History, Settings, Menu, X, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { to: "/chat", icon: MessageCircle, label: "Chat" },
    { to: "/upload", icon: Upload, label: "Upload", adminOnly: true },
    { to: "/login", icon: LogIn, label: "Login" },
    { to: "/history", icon: History, label: "History" },
    { to: "/settings", icon: Settings, label: "Settings", adminOnly: true },
  ];

  const closeSheet = () => setIsOpen(false);

  return (
    <nav className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <NavLink to="/" className="flex items-center gap-2">
            <Bot className="w-6 h-6 text-primary" />
            <div>
              <span className="text-xl font-bold text-foreground">ShiftIQ</span>
              <p className="text-xs text-muted-foreground">by MuleKick</p>
            </div>
          </NavLink>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map(({ to, icon: Icon, label, adminOnly }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-4 py-2 rounded-lg transition-smooth ${
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`
                }
              >
                <Icon className="w-4 h-4" />
                <span className="text-sm font-medium">{label}</span>
                {adminOnly && (
                  <span className="text-xs bg-secondary text-secondary-foreground px-1.5 py-0.5 rounded">
                    Admin
                  </span>
                )}
              </NavLink>
            ))}
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-64">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <Bot className="w-6 h-6 text-primary" />
                    <div>
                      <span className="text-lg font-bold text-foreground">ShiftIQ</span>
                      <p className="text-xs text-muted-foreground">by MuleKick</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" onClick={closeSheet}>
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
                        `flex items-center gap-3 px-3 py-3 rounded-lg transition-smooth w-full ${
                          isActive
                            ? "bg-primary text-primary-foreground"
                            : "text-muted-foreground hover:text-foreground hover:bg-muted"
                        }`
                      }
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{label}</span>
                      {adminOnly && (
                        <span className="text-xs bg-secondary text-secondary-foreground px-1.5 py-0.5 rounded ml-auto">
                          Admin
                        </span>
                      )}
                    </NavLink>
                  ))}
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