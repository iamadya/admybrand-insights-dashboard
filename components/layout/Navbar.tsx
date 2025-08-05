import React, { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { UserProfile } from './UserProfile';
import { BarChart3, Moon, Sun, Menu, X } from 'lucide-react';

interface NavbarProps {
  title?: string;
  subtitle?: string;
  logo?: React.ReactNode;
  showThemeToggle?: boolean;
  className?: string;
  activeSection?: string;
  onSectionChange?: (section: string) => void;
  showUserProfile?: boolean;
  userName?: string;
  userRole?: string;
  userImage?: string;
  onProfileClick?: () => void;
  onSettingsClick?: () => void;
  onLogoutClick?: () => void;
  showMobileMenuButton?: boolean;
  onMobileMenuClick?: () => void;
}

export function Navbar({
  title = "Dashboard",
  subtitle,
  logo,
  showThemeToggle = true,
  className = "",
  activeSection = "dashboard",
  onSectionChange,
  showUserProfile = true,
  userName = "Jane Doe",
  userRole = "Marketing Manager",
  userImage,
  onProfileClick,
  onSettingsClick,
  onLogoutClick,
  showMobileMenuButton = false,
  onMobileMenuClick
}: NavbarProps) {
  const { theme, setTheme } = useTheme();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [useJsScroll, setUseJsScroll] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Handle scroll effect for browsers without animation-timeline support (desktop only)
  useEffect(() => {
    let ticking = false;
    let timeoutId: NodeJS.Timeout;

    const handleScroll = () => {
      // Check if we're on mobile - if so, don't handle scroll
      if (window.innerWidth < 768) {
        return;
      }

      if (!ticking) {
        requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          const threshold = 80;
          const shouldBeScrolled = scrollY > threshold;

          // Add small delay to prevent rapid state changes
          clearTimeout(timeoutId);
          timeoutId = setTimeout(() => {
            if (shouldBeScrolled !== isScrolled) {
              setIsScrolled(shouldBeScrolled);
            }
          }, 10);

          ticking = false;
        });
        ticking = true;
      }
    };

    // Check if animation-timeline is supported and if we're on desktop
    const supportsAnimationTimeline = CSS.supports('animation-timeline', 'scroll()');
    const isDesktop = window.innerWidth >= 768;

    if (!supportsAnimationTimeline && isDesktop) {
      setUseJsScroll(true);
      window.addEventListener('scroll', handleScroll, { passive: true });
      return () => {
        window.removeEventListener('scroll', handleScroll);
        clearTimeout(timeoutId);
      };
    } else {
      setUseJsScroll(false);
    }

    return () => clearTimeout(timeoutId);
  }, [isScrolled]);

  const defaultLogo = (
    <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
      <BarChart3 className="h-5 w-5 text-primary-foreground" />
    </div>
  );

  const navigationItems: Array<{ id: string; label: string; href: string }> = [
    // Navigation items removed as requested
  ];

  const handleNavClick = (sectionId: string) => {
    if (onSectionChange) {
      onSectionChange(sectionId);
    }
    setIsMobileMenuOpen(false);
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <div className={`site-header w-full relative z-50 ${className}`}>
      <div className={`inside-header flex items-center justify-between w-full ${isScrolled ? 'scrolled' : ''} ${useJsScroll ? 'js-scroll' : ''}`}>
        {/* Logo and Title Section */}
        <div className="flex items-center space-x-3 sm:space-x-4">
          {/* Mobile Menu Button - Only show on mobile when enabled */}
          {showMobileMenuButton && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onMobileMenuClick}
              className="md:hidden rounded-full h-8 w-8 flex-shrink-0"
              aria-label="Open navigation menu"
            >
              <Menu className="h-4 w-4" />
            </Button>
          )}

          <div className="flex items-center space-x-3">
            <div className="transform transition-transform duration-300 hover:scale-110">
              {logo || defaultLogo}
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                {title}
              </h1>
              {subtitle && (
                <p className="text-xs sm:text-sm text-muted-foreground">{subtitle}</p>
              )}
            </div>
            <div className="block sm:hidden">
              <h1 className="text-sm font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent navbar-title-mobile">
                {title}
              </h1>
            </div>
          </div>
        </div>

        {/* Desktop Navigation Pills */}
        {navigationItems.length > 0 && (
          <nav className="hidden md:flex items-center space-x-2" role="navigation" aria-label="Main navigation">
            {navigationItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`nav-pill text-sm font-medium transition-all duration-200 ${
                  activeSection === item.id ? 'active' : ''
                }`}
                aria-label={`Navigate to ${item.label}`}
                aria-current={activeSection === item.id ? 'page' : undefined}
                type="button"
              >
                {item.label}
              </button>
            ))}
          </nav>
        )}

        {/* Right Side Actions */}
        <div className="flex items-center space-x-2">
          {/* Mobile Menu - Only show if there are navigation items */}
          {navigationItems.length > 0 && (
            <div className="md:hidden">
              <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full"
                    aria-label="Open navigation menu"
                  >
                    <Menu className="h-4 w-4" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                  <div className="flex flex-col space-y-4 mt-8">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-lg font-semibold">Navigation</h2>
                    </div>
                    {navigationItems.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => handleNavClick(item.id)}
                        className={`nav-pill text-left w-full text-sm font-medium transition-all duration-200 ${
                          activeSection === item.id ? 'active' : ''
                        }`}
                        aria-label={`Navigate to ${item.label}`}
                        aria-current={activeSection === item.id ? 'page' : undefined}
                        type="button"
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          )}

          {/* Theme Toggle */}
          {showThemeToggle && mounted && (
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="rounded-full transition-all duration-300 hover:scale-110 hover:bg-primary/10 focus:ring-2 focus:ring-primary/20 focus:outline-none"
              aria-label={theme === 'dark' ? "Switch to light mode" : "Switch to dark mode"}
            >
              {theme === 'dark' ? (
                <Sun className="h-4 w-4 transition-transform duration-300 hover:rotate-12" />
              ) : (
                <Moon className="h-4 w-4 transition-transform duration-300 hover:-rotate-12" />
              )}
            </Button>
          )}

          {/* User Profile */}
          {showUserProfile && (
            <UserProfile
              userName={userName}
              userRole={userRole}
              userImage={userImage}
              onProfileClick={onProfileClick}
              onSettingsClick={onSettingsClick}
              onLogoutClick={onLogoutClick}
            />
          )}
        </div>
      </div>
    </div>
  );
}