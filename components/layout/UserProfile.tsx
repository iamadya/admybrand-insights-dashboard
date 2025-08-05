'use client';

import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  User, 
  Settings, 
  LogOut, 
  ChevronDown,
  UserCircle
} from 'lucide-react';

interface UserProfileProps {
  userName?: string;
  userRole?: string;
  userImage?: string;
  onProfileClick?: () => void;
  onSettingsClick?: () => void;
  onLogoutClick?: () => void;
  className?: string;
}

export function UserProfile({
  userName = "Jane Doe",
  userRole = "Marketing Manager",
  userImage,
  onProfileClick,
  onSettingsClick,
  onLogoutClick,
  className = ""
}: UserProfileProps) {
  const userInitials = userName
    .split(' ')
    .map(name => name.charAt(0))
    .join('')
    .toUpperCase();

  const handleProfileClick = () => {
    onProfileClick?.();
    console.log('Navigate to profile');
  };

  const handleSettingsClick = () => {
    onSettingsClick?.();
    console.log('Navigate to settings');
  };

  const handleLogoutClick = () => {
    onLogoutClick?.();
    console.log('Logout user');
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className={`flex items-center space-x-3 px-3 py-2 h-auto rounded-lg hover:bg-accent/50 transition-all duration-200 ${className}`}
        >
          {/* Avatar */}
          <Avatar className="h-8 w-8">
            <AvatarImage src={userImage} alt={userName} />
            <AvatarFallback className="bg-primary text-primary-foreground text-sm font-medium">
              {userInitials}
            </AvatarFallback>
          </Avatar>
          
          {/* User Info - Hidden on mobile */}
          <div className="hidden md:flex flex-col items-start text-left">
            <span className="text-sm font-medium text-foreground leading-none">
              {userName}
            </span>
            <span className="text-xs text-muted-foreground leading-none mt-1">
              {userRole}
            </span>
          </div>
          
          {/* Dropdown Arrow - Hidden on mobile */}
          <ChevronDown className="h-4 w-4 text-muted-foreground hidden md:block" />
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent
        className="w-48 md:w-56 !z-[9999] bg-background border shadow-lg"
        align="end"
        forceMount
        sideOffset={8}
        alignOffset={-4}
      >
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{userName}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {userRole}
            </p>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={handleProfileClick}
          className="cursor-pointer"
        >
          <User className="mr-2 h-4 w-4" />
          <span>Profile</span>
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={handleSettingsClick}
          className="cursor-pointer"
        >
          <Settings className="mr-2 h-4 w-4" />
          <span>Settings</span>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={handleLogoutClick}
          className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950"
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Logout</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
