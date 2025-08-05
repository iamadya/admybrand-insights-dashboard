'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent } from '@/components/ui/sheet';

import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Megaphone,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

interface SidebarProps {
  activeSection?: string;
  onSectionChange?: (section: string) => void;
  onCollapseChange?: (collapsed: boolean) => void;
  className?: string;
  mobileOpen?: boolean;
  onMobileOpenChange?: (open: boolean) => void;
}

interface NavigationItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  href?: string;
  badge?: string;
}

const navigationItems: NavigationItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: <LayoutDashboard className="h-5 w-5" />,
    href: '/'
  },
  {
    id: 'campaigns',
    label: 'Campaigns',
    icon: <Megaphone className="h-5 w-5" />,
    href: '/campaigns'
  },
  {
    id: 'reports',
    label: 'Reports',
    icon: <BarChart3 className="h-5 w-5" />,
    href: '/reports'
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: <Settings className="h-5 w-5" />,
    href: '/settings'
  }
];

export function Sidebar({
  activeSection = 'dashboard',
  onSectionChange,
  onCollapseChange,
  className = "",
  mobileOpen = false,
  onMobileOpenChange
}: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Sync external mobile open state with internal state
  useEffect(() => {
    setIsMobileOpen(mobileOpen);
  }, [mobileOpen]);

  // Notify parent of collapse state changes
  useEffect(() => {
    onCollapseChange?.(isCollapsed);
  }, [isCollapsed, onCollapseChange]);

  const handleSectionChange = (sectionId: string) => {
    onSectionChange?.(sectionId);
    // Close mobile sidebar when navigating (will be handled by parent)
    setIsMobileOpen(false);
    onMobileOpenChange?.(false);
  };

  const SidebarContent = ({ isMobileSheet = false }: { isMobileSheet?: boolean }) => (
    <div className={cn(
      "flex flex-col h-full bg-background border-r-2 border-border shadow-lg",
      !isMobileSheet && "transition-all duration-300 ease-in-out mr-8",
      !isMobileSheet && isCollapsed ? "w-16" : "w-64",
      isMobileSheet && "w-full"
    )}>
      {/* Header */}
      <div className={cn(
        "flex items-center justify-between p-4 border-b border-border/40",
        isCollapsed && !isMobileSheet && "px-2"
      )}>
        {(!isCollapsed || isMobileSheet) && (
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <BarChart3 className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-semibold text-foreground">ADmyBRAND</span>
          </div>
        )}
        
        {!isMobileSheet && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={cn(
              "h-8 w-8 transition-all duration-200",
              isCollapsed && "mx-auto"
            )}
          >
            {isCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </Button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navigationItems.map((item) => (
          <Button
            key={item.id}
            variant={activeSection === item.id ? "secondary" : "ghost"}
            className={cn(
              "w-full justify-start transition-all duration-200 group relative",
              isCollapsed && !isMobileSheet ? "px-2" : "px-3",
              activeSection === item.id && "bg-primary/10 text-primary border-primary/20 shadow-sm"
            )}
            onClick={() => handleSectionChange(item.id)}
          >
            <div className={cn(
              "flex items-center",
              isCollapsed && !isMobileSheet ? "justify-center w-full" : "space-x-3"
            )}>
              <span className={cn(
                "transition-colors duration-200",
                activeSection === item.id ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
              )}>
                {item.icon}
              </span>
              
              {(!isCollapsed || isMobileSheet) && (
                <span className={cn(
                  "font-medium transition-colors duration-200",
                  activeSection === item.id ? "text-primary" : "text-foreground"
                )}>
                  {item.label}
                </span>
              )}
            </div>

            {/* Active indicator */}
            {activeSection === item.id && (
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary rounded-r-full" />
            )}

            {/* Tooltip for collapsed state */}
            {isCollapsed && !isMobileSheet && (
              <div className="absolute left-full ml-2 px-2 py-1 bg-popover text-popover-foreground text-sm rounded-md shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                {item.label}
              </div>
            )}
          </Button>
        ))}
      </nav>

      {/* Footer */}
      <div className={cn(
        "p-4 border-t border-border/40",
        isCollapsed && !isMobileSheet && "px-2"
      )}>
        <div className={cn(
          "text-xs text-muted-foreground",
          isCollapsed && !isMobileSheet ? "text-center" : "text-left"
        )}>
          {(!isCollapsed || isMobileSheet) ? "© 2025 ADmyBRAND" : "©"}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Sheet - Only render when explicitly opened */}
      <Sheet open={isMobileOpen} onOpenChange={(open) => {
        setIsMobileOpen(open);
        onMobileOpenChange?.(open);
      }}>
        <SheetContent side="left" className="p-0 w-64 mobile-sidebar-sheet">
          <SidebarContent isMobileSheet={true} />
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar - Always visible on desktop, hidden on mobile via CSS */}
      <aside className={cn(
        "fixed left-0 top-0 h-full z-40",
        "max-md:-translate-x-full md:translate-x-0", // Hidden on mobile, visible on desktop
        "transition-transform duration-300",
        className
      )}>
        <SidebarContent />
      </aside>
    </>
  );
}
