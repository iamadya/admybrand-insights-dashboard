'use client';

import React from 'react';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { 
  Home, 
  LayoutDashboard, 
  Megaphone, 
  BarChart3, 
  Settings 
} from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: React.ReactNode;
  isCurrentPage?: boolean;
}

interface BreadcrumbNavProps {
  activeSection?: string;
  onSectionChange?: (section: string) => void;
  className?: string;
}

const sectionConfig = {
  dashboard: {
    label: 'Dashboard',
    icon: <LayoutDashboard className="h-3 w-3" />,
    path: ['Home', 'Dashboard']
  },
  campaigns: {
    label: 'Campaigns',
    icon: <Megaphone className="h-3 w-3" />,
    path: ['Home', 'Campaigns']
  },
  reports: {
    label: 'Reports',
    icon: <BarChart3 className="h-3 w-3" />,
    path: ['Home', 'Reports']
  },
  settings: {
    label: 'Settings',
    icon: <Settings className="h-3 w-3" />,
    path: ['Home', 'Settings']
  }
};

export function BreadcrumbNav({ 
  activeSection = 'dashboard', 
  onSectionChange,
  className = ""
}: BreadcrumbNavProps) {
  const currentSection = sectionConfig[activeSection as keyof typeof sectionConfig] || sectionConfig.dashboard;
  
  const handleNavigation = (section: string) => {
    if (section === 'home' || section === 'dashboard') {
      onSectionChange?.('dashboard');
    } else {
      onSectionChange?.(section);
    }
  };

  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    const breadcrumbs: BreadcrumbItem[] = [
      {
        label: 'Home',
        href: '/',
        icon: <Home className="h-3 w-3" />,
        isCurrentPage: false
      }
    ];

    // Always add Dashboard as the second level
    if (activeSection === 'dashboard') {
      breadcrumbs.push({
        label: 'Dashboard',
        icon: <LayoutDashboard className="h-3 w-3" />,
        isCurrentPage: true
      });
    } else {
      // Add Dashboard as intermediate step
      breadcrumbs.push({
        label: 'Dashboard',
        href: '/dashboard',
        icon: <LayoutDashboard className="h-3 w-3" />,
        isCurrentPage: false
      });

      // Add current section
      breadcrumbs.push({
        label: currentSection.label,
        icon: currentSection.icon,
        isCurrentPage: true
      });
    }

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  return (
    <div className={`mb-4 ${className}`}>
      <Breadcrumb>
        <BreadcrumbList>
          {breadcrumbs.map((item, index) => (
            <React.Fragment key={item.label}>
              <BreadcrumbItem>
                {item.isCurrentPage ? (
                  <BreadcrumbPage className="flex items-center gap-1.5">
                    {item.icon}
                    <span>{item.label}</span>
                  </BreadcrumbPage>
                ) : (
                  <BreadcrumbLink
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      handleNavigation(item.label.toLowerCase());
                    }}
                    className="flex items-center gap-1.5 hover:text-primary transition-colors cursor-pointer"
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
              
              {/* Add separator if not the last item */}
              {index < breadcrumbs.length - 1 && <BreadcrumbSeparator />}
            </React.Fragment>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
}
