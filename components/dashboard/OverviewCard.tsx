import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Activity } from 'lucide-react';

interface OverviewCardProps {
  title: string;
  value: string;
  change?: string;
  icon: React.ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  className?: string;
  onClick?: () => void;
  isUpdating?: boolean;
  previousValue?: string;
}

export function OverviewCard({
  title,
  value,
  change,
  icon,
  trend = 'neutral',
  className = "",
  onClick,
  isUpdating = false,
  previousValue
}: OverviewCardProps) {
  const [isAnimating, setIsAnimating] = useState(false);
  const [displayValue, setDisplayValue] = useState(value);

  // Animate value changes
  useEffect(() => {
    if (previousValue && previousValue !== value) {
      setIsAnimating(true);

      // Brief delay to show the animation
      const timer = setTimeout(() => {
        setDisplayValue(value);
        setIsAnimating(false);
      }, 300);

      return () => clearTimeout(timer);
    } else {
      setDisplayValue(value);
    }
  }, [value, previousValue]);

  const getTrendColor = () => {
    switch (trend) {
      case 'up':
        return 'text-green-600 dark:text-green-400';
      case 'down':
        return 'text-red-600 dark:text-red-400';
      default:
        return 'text-muted-foreground';
    }
  };

  return (
    <Card
      className={`relative overflow-hidden group cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-lg dark:hover:shadow-2xl border-border/50 hover:border-primary/20 mobile-card-compact ${className}`}
      onClick={onClick}
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {/* Update indicator */}
      {isUpdating && (
        <div className="absolute top-2 right-2 z-10">
          <Activity className="h-3 w-3 text-primary animate-pulse" />
        </div>
      )}

      <CardHeader className="card-header flex flex-row items-center justify-between space-y-0 pb-2 p-4 md:p-6">
        <CardTitle className="text-xs md:text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors duration-300">
          {title}
        </CardTitle>
        <div className={`text-muted-foreground group-hover:text-primary transition-all duration-300 group-hover:scale-110 ${
          isUpdating ? 'animate-pulse' : ''
        }`}>
          {icon}
        </div>
      </CardHeader>

      <CardContent className="card-content p-4 pt-0 md:p-6 md:pt-0">
        <div className={`text-xl md:text-2xl font-bold mb-1 group-hover:text-primary transition-all duration-300 ${
          isAnimating ? 'scale-105 text-primary' : ''
        }`}>
          {displayValue}
        </div>
        {change && (
          <p className={`text-xs flex items-center gap-1 transition-all duration-300 ${getTrendColor()}`}>
            <TrendingUp className={`h-3 w-3 transition-transform duration-300 ${
              trend === 'down' ? 'rotate-180' : ''
            } ${isUpdating ? 'animate-pulse' : ''}`} />
            {change}
          </p>
        )}
      </CardContent>
    </Card>
  );
}