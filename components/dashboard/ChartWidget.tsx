import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ChartWidgetProps {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  headerClassName?: string;
  contentClassName?: string;
  height?: string | number;
}

export function ChartWidget({
  title,
  icon,
  children,
  className = "",
  headerClassName = "",
  contentClassName = "",
  height = "320px"
}: ChartWidgetProps) {
  return (
    <Card className={`group hover:shadow-lg transition-all duration-300 ${className}`}>
      <CardHeader className={`flex flex-row items-center justify-between space-y-0 pb-2 p-4 md:p-6 ${headerClassName}`}>
        <CardTitle className="text-base md:text-lg font-semibold flex items-center gap-2">
          {icon && <span className="text-primary">{icon}</span>}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className={`p-3 pt-0 md:p-6 md:pt-0 chart-container-mobile ${contentClassName}`}>
        <div style={{ height: typeof height === 'string' ? height : `${height}px` }}>
          {children}
        </div>
      </CardContent>
    </Card>
  );
}