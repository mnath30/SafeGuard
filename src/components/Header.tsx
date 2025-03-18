
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Shield, Settings, Users, Menu, X, Bell } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center gap-2" onClick={closeMenu}>
            <Shield className="h-6 w-6 text-safety" />
            <span className="font-semibold tracking-tight">She Shield</span>
          </Link>
        </div>

        {/* Mobile menu button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </Button>

        {/* Desktop navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link
            to="/"
            className={cn(
              "text-sm font-medium transition-colors hover:text-primary",
              isActive("/") ? "text-primary" : "text-muted-foreground"
            )}
          >
            Home
          </Link>
          <Link
            to="/contacts"
            className={cn(
              "text-sm font-medium transition-colors hover:text-primary",
              isActive("/contacts") ? "text-primary" : "text-muted-foreground"
            )}
          >
            Contacts
          </Link>
          <Link
            to="/settings"
            className={cn(
              "text-sm font-medium transition-colors hover:text-primary",
              isActive("/settings") ? "text-primary" : "text-muted-foreground"
            )}
          >
            Settings
          </Link>
        </nav>

        {/* Desktop notification icon */}
        <div className="hidden md:flex items-center gap-2">
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-safety-alert" />
          </Button>
        </div>

        {/* Mobile navigation */}
        {isMenuOpen && (
          <div className="absolute top-16 inset-x-0 bg-background border-b border-border/40 shadow-lg md:hidden animate-slide-down">
            <div className="container py-4 flex flex-col space-y-4">
              <Link
                to="/"
                className={cn(
                  "flex items-center gap-3 px-4 py-2 rounded-md transition-colors",
                  isActive("/") ? "bg-accent text-accent-foreground" : "text-foreground hover:bg-muted"
                )}
                onClick={closeMenu}
              >
                <Shield className="h-5 w-5" />
                <span>Home</span>
              </Link>
              <Link
                to="/contacts"
                className={cn(
                  "flex items-center gap-3 px-4 py-2 rounded-md transition-colors",
                  isActive("/contacts") ? "bg-accent text-accent-foreground" : "text-foreground hover:bg-muted"
                )}
                onClick={closeMenu}
              >
                <Users className="h-5 w-5" />
                <span>Contacts</span>
              </Link>
              <Link
                to="/settings"
                className={cn(
                  "flex items-center gap-3 px-4 py-2 rounded-md transition-colors",
                  isActive("/settings") ? "bg-accent text-accent-foreground" : "text-foreground hover:bg-muted"
                )}
                onClick={closeMenu}
              >
                <Settings className="h-5 w-5" />
                <span>Settings</span>
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
