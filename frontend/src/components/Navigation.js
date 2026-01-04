import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Moon, BookOpen, Users, MapPin, Scroll, Clock, Bot, Sparkles, User, LogOut } from 'lucide-react';

export const Navigation = ({ user, onLogout }) => {
  const location = useLocation();
  
  const links = [
    { to: '/', label: 'Home', icon: Moon },
    { to: '/spell-request', label: 'Request Spell', icon: Sparkles },
    { to: '/guides', label: 'Guides', icon: Users },
    { to: '/rituals', label: 'Rituals', icon: Scroll },
    { to: '/deities', label: 'Deities', icon: Moon },
    { to: '/figures', label: 'Figures', icon: Users },
    { to: '/sites', label: 'Sites', icon: MapPin },
    { to: '/timeline', label: 'Timeline', icon: Clock },
    { to: '/ai-chat', label: 'Research', icon: Bot },
  ];
  
  return (
    <nav className="border-b border-border bg-background/95 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex items-center space-x-3" data-testid="nav-logo">
            <img 
              src="https://customer-assets.emergentagent.com/job_diywizardry/artifacts/9hb654f4_image.png" 
              alt="Where The Crowlands Logo"
              className="h-16 w-auto"
              style={{ mixBlendMode: 'lighten' }}
            />
          </Link>
          
          <div className="flex items-center space-x-1">
            {links.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.to;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  data-testid={`nav-${link.label.toLowerCase().replace(' ', '-')}`}
                  className={`px-3 py-2 rounded-sm font-montserrat text-xs tracking-wider transition-all duration-300 flex items-center space-x-1 ${
                    isActive
                      ? 'bg-primary/10 text-primary border border-primary/30'
                      : 'text-muted-foreground hover:text-primary hover:bg-primary/5'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
            
            {user ? (
              <div className="flex items-center space-x-2 ml-4">
                <Link
                  to="/profile"
                  data-testid="nav-profile"
                  className="px-3 py-2 rounded-sm font-montserrat text-xs tracking-wider transition-all duration-300 flex items-center space-x-1 text-muted-foreground hover:text-primary hover:bg-primary/5"
                >
                  <User className="w-4 h-4" />
                  <span>{user.name}</span>
                </Link>
                <button
                  onClick={onLogout}
                  data-testid="nav-logout"
                  className="px-3 py-2 rounded-sm font-montserrat text-xs tracking-wider transition-all duration-300 flex items-center space-x-1 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link
                to="/auth"
                data-testid="nav-login"
                className="ml-4 px-4 py-2 bg-primary text-primary-foreground rounded-sm font-montserrat text-xs tracking-widest uppercase hover:bg-primary/90 transition-all duration-300"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};