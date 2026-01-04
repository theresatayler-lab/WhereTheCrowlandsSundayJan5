import React from 'react';
import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer className="border-t border-border bg-card/50 mt-24">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Logo and Description */}
          <div className="flex flex-col items-center md:items-start">
            <img 
              src="https://customer-assets.emergentagent.com/job_diywizardry/artifacts/9hb654f4_image.png"
              alt="Where The Crowlands Badge"
              className="h-48 w-48 mb-6"
              style={{ mixBlendMode: 'lighten' }}
            />
            <p className="font-crimson text-sm text-center md:text-left text-muted-foreground leading-relaxed">
              Build your own practice. No gatekeepers, no expensive services—just formulas, patterns, and your power.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-cinzel text-lg text-secondary mb-4">Explore</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/spell-request" className="font-crimson text-sm text-foreground hover:text-primary transition-colors">
                  Request a Spell
                </Link>
              </li>
              <li>
                <Link to="/deities" className="font-crimson text-sm text-foreground hover:text-primary transition-colors">
                  Deities
                </Link>
              </li>
              <li>
                <Link to="/figures" className="font-crimson text-sm text-foreground hover:text-primary transition-colors">
                  Historical Figures
                </Link>
              </li>
              <li>
                <Link to="/rituals" className="font-crimson text-sm text-foreground hover:text-primary transition-colors">
                  Rituals & Practices
                </Link>
              </li>
              <li>
                <Link to="/timeline" className="font-crimson text-sm text-foreground hover:text-primary transition-colors">
                  Timeline 1910-1945
                </Link>
              </li>
            </ul>
          </div>

          {/* AI Tools */}
          <div>
            <h4 className="font-cinzel text-lg text-secondary mb-4">AI Tools</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/ai-chat" className="font-crimson text-sm text-foreground hover:text-primary transition-colors">
                  AI Research Assistant
                </Link>
              </li>
              <li>
                <Link to="/ai-image" className="font-crimson text-sm text-foreground hover:text-primary transition-colors">
                  AI Image Generator
                </Link>
              </li>
            </ul>
            
            <div className="mt-6">
              <p className="font-crimson text-xs text-muted-foreground italic">
                Historical note: We document the claims and practices of the 1910-1945 era with scholarly integrity.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-border">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="font-crimson text-sm text-muted-foreground">
              © {new Date().getFullYear()} Where The Crowlands. All rights reserved.
            </p>
            <p className="font-crimson text-xs text-muted-foreground mt-2 md:mt-0">
              Built with historical research & modern technology
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
