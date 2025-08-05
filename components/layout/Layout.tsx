'use client';

/**
 * Main Layout Component
 *
 * A flexible layout wrapper that provides consistent structure across the application.
 * Features:
 * - Optional navbar, sidebar, and footer
 * - Responsive design with proper spacing
 * - Theme-aware styling
 * - Flexible prop forwarding to child components
 * - Sidebar integration with responsive behavior
 *
 * @param children - Main content to be rendered
 * @param title - Page title (passed to navbar)
 * @param subtitle - Page subtitle (passed to navbar)
 * @param showNavbar - Whether to display the navigation bar (default: true)
 * @param showSidebar - Whether to display the sidebar (default: true)
 * @param showFooter - Whether to display the footer (default: false)
 * @param navbarProps - Additional props to pass to the Navbar component
 * @param sidebarProps - Additional props to pass to the Sidebar component
 * @param footerProps - Additional props to pass to the Footer component
 * @param className - Additional CSS classes for the layout container
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { Footer } from './Footer';
import { ThemeProvider } from 'next-themes';

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  showNavbar?: boolean;
  showSidebar?: boolean;
  showFooter?: boolean;
  navbarProps?: React.ComponentProps<typeof Navbar>;
  sidebarProps?: React.ComponentProps<typeof Sidebar>;
  footerProps?: React.ComponentProps<typeof Footer>;
  className?: string;
}

export function Layout({
  children,
  title,
  subtitle,
  showNavbar = true,
  showSidebar = true,
  showFooter = false,
  navbarProps = {},
  sidebarProps = {},
  footerProps = {},
  className = ""
}: LayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Handle sidebar collapse state
  const handleSidebarCollapseChange = (collapsed: boolean) => {
    setSidebarCollapsed(collapsed);
  };

  // Handle mobile menu click
  const handleMobileMenuClick = () => {
    setMobileSidebarOpen(true);
  };



return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <div className={`min-h-screen bg-background transition-colors duration-300 ${className}`}>
        {/* Sidebar */}
        {showSidebar && (
          <Sidebar
            {...sidebarProps}
            onCollapseChange={handleSidebarCollapseChange}
            mobileOpen={mobileSidebarOpen}
            onMobileOpenChange={setMobileSidebarOpen}
          />
        )}

        {/* Main Content Area */}
        <div className={`flex flex-col min-h-screen transition-all duration-300 ${
          showSidebar
            ? sidebarCollapsed
              ? 'md:ml-16' // Only apply margin on desktop
              : 'md:ml-64' // Only apply margin on desktop
            : ''
        }`}>
          {showNavbar && (
            <Navbar
              title={title}
              subtitle={subtitle}
              showMobileMenuButton={showSidebar} // Always show on mobile, hidden via CSS on desktop
              onMobileMenuClick={handleMobileMenuClick}
              {...navbarProps}
            />
          )}

          <main className={`flex-1 ${showNavbar ? 'pt-4' : ''}`}>
            {children}
          </main>

          {showFooter && (
            <Footer {...footerProps} />
          )}
        </div>
      </div>
    </ThemeProvider>
  );
}