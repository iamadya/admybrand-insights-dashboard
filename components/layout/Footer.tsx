import React from 'react';

interface FooterProps {
  companyName?: string;
  year?: number;
  links?: Array<{
    label: string;
    href: string;
  }>;
  className?: string;
}

export function Footer({
  companyName = "Your Company",
  year = new Date().getFullYear(),
  links = [],
  className = ""
}: FooterProps) {
  return (
    <footer className={`border-t border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
          <div className="text-sm text-muted-foreground">
            © {year} {companyName}. All rights reserved.
          </div>
          {links.length > 0 && (
            <div className="flex space-x-6">
              {links.map((link, index) => (
                <a
                  key={index}
                  href={link.href}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
                >
                  {link.label}
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </footer>
  );
}