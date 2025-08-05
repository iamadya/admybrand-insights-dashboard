/**
 * ADmyBRAND Insights Dashboard - Main Page Component
 *
 * This is the primary dashboard page that displays:
 * - Real-time marketing metrics with live updates
 * - Interactive charts for revenue trends and campaign performance
 * - Comprehensive data table for campaign management
 * - Responsive design optimized for all devices
 *
 * Key Features:
 * - Real-time data updates every 5 seconds
 * - Dark/light theme support
 * - Export functionality for campaign data
 * - Mobile-optimized responsive layout
 */

"use client";

import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { ColumnDef } from '@tanstack/react-table';

// UI Components
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

// Custom Hooks and Utilities
import { useRealTimeMetrics } from '@/hooks/use-real-time-metrics';
import { campaignExportColumns, campaignFormatters } from '@/lib/export-utils';

// Chart Components from Recharts
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';

// Icons from Lucide React
import {
  DollarSign,
  Users,
  TrendingUp,
  BarChart3,
  Calendar,
  Target,
  PieChart as PieChartIcon,
  ArrowUpDown
} from 'lucide-react';

// Custom Dashboard Components
import { Layout } from '@/components/layout/Layout';
import { BreadcrumbNav } from '@/components/layout/BreadcrumbNav';
import { OverviewCard } from '@/components/dashboard/OverviewCard';
import { ChartWidget } from '@/components/dashboard/ChartWidget';
import { DataTable } from '@/components/dashboard/DataTable';

/**
 * Campaign Data Interface
 * Defines the structure for marketing campaign data used throughout the dashboard
 */
interface Campaign {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  spend: number;
  impressions: number;
  clicks: number;
  conversions: number;
  status: 'Active' | 'Completed' | 'Paused';
}

/**
 * Mock Chart Data
 * Static data used for chart visualizations
 * In a real application, this would come from your analytics API
 */
const monthlyRevenueData = [
  { month: 'Jan', revenue: 45000, target: 50000 },
  { month: 'Feb', revenue: 52000, target: 50000 },
  { month: 'Mar', revenue: 48000, target: 50000 },
  { month: 'Apr', revenue: 61000, target: 55000 },
  { month: 'May', revenue: 55000, target: 55000 },
  { month: 'Jun', revenue: 67000, target: 60000 },
  { month: 'Jul', revenue: 54231, target: 60000 }
];

const userGrowthCampaignData = [
  { campaign: 'Social Media', users: 2847, growth: 15.3 },
  { campaign: 'Email Marketing', users: 1923, growth: 8.7 },
  { campaign: 'Google Ads', users: 3421, growth: 22.1 },
  { campaign: 'Content Marketing', users: 1654, growth: 12.4 },
  { campaign: 'Influencer', users: 987, growth: 18.9 },
  { campaign: 'Referral', users: 1432, growth: 9.8 }
];

const conversionData = [
  { name: 'Email Signups', value: 35, color: 'hsl(var(--chart-1))' },
  { name: 'Free Trials', value: 28, color: 'hsl(var(--chart-2))' },
  { name: 'Purchases', value: 22, color: 'hsl(var(--chart-3))' },
  { name: 'Subscriptions', value: 15, color: 'hsl(var(--chart-4))' }
];

/**
 * Custom Tooltip Components for Charts
 * These provide enhanced tooltips with proper theming and formatting
 */
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background border border-border rounded-lg p-3 shadow-lg">
        <p className="font-medium text-foreground">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            {entry.name}: {entry.name === 'Revenue' || entry.name === 'Target' 
              ? `$${entry.value.toLocaleString()}` 
              : entry.value.toLocaleString()}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const PieTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background border border-border rounded-lg p-3 shadow-lg">
        <p className="font-medium text-foreground">{payload[0].name}</p>
        <p className="text-sm" style={{ color: payload[0].payload.color }}>
          {payload[0].value}% of conversions
        </p>
      </div>
    );
  }
  return null;
};

/**
 * Main Dashboard Component
 *
 * Manages the entire dashboard state including:
 * - Real-time metrics updates
 * - Theme switching
 * - Campaign data loading
 * - Navigation state
 */
export default function Dashboard() {
  // Component State Management
  const { theme } = useTheme();
  const [isLoading, setIsLoading] = useState(true);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [activeSection, setActiveSection] = useState('dashboard');
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Real-time metrics hook - updates every 5 seconds
  const { metrics: realtimeMetrics, isLoading: metricsLoading, timestamp } = useRealTimeMetrics(5000);
  const [previousMetrics, setPreviousMetrics] = useState<typeof realtimeMetrics>([]);

  // Track previous metrics for animation
  useEffect(() => {
    if (realtimeMetrics.length > 0) {
      setPreviousMetrics(prev => prev.length > 0 ? prev : realtimeMetrics);
    }
  }, [realtimeMetrics]);

  const handleSectionChange = (section: string) => {
    setActiveSection(section);
    // You can add scroll to section logic here if needed
    console.log(`Navigating to ${section}`);
  };

  // Simulate loading data
  useEffect(() => {
    const timer = setTimeout(() => {
      setCampaigns([
        {
          id: '1',
          name: 'Summer Sale 2025',
          startDate: '2025-06-01',
          endDate: '2025-08-31',
          spend: 15420,
          impressions: 2847392,
          clicks: 42847,
          conversions: 1247,
          status: 'Active'
        },
        {
          id: '2',
          name: 'Brand Awareness Q2',
          startDate: '2025-04-01',
          endDate: '2025-06-30',
          spend: 28750,
          impressions: 5294837,
          clicks: 73829,
          conversions: 2184,
          status: 'Completed'
        },
        {
          id: '3',
          name: 'Product Launch - Mobile',
          startDate: '2025-07-15',
          endDate: '2025-09-15',
          spend: 12890,
          impressions: 1847293,
          clicks: 28473,
          conversions: 892,
          status: 'Active'
        },
        {
          id: '4',
          name: 'Holiday Prep Campaign',
          startDate: '2025-09-01',
          endDate: '2025-11-30',
          spend: 34200,
          impressions: 6847392,
          clicks: 94738,
          conversions: 3247,
          status: 'Active'
        },
        {
          id: '5',
          name: 'Retargeting - Cart Abandoners',
          startDate: '2025-05-01',
          endDate: '2025-07-31',
          spend: 8950,
          impressions: 947382,
          clicks: 18473,
          conversions: 743,
          status: 'Completed'
        },
        {
          id: '6',
          name: 'Video Ad Series - Gen Z',
          startDate: '2025-08-01',
          endDate: '2025-10-31',
          spend: 19750,
          impressions: 3847291,
          clicks: 56829,
          conversions: 1684,
          status: 'Paused'
        },
        {
          id: '7',
          name: 'Local Market Expansion',
          startDate: '2025-03-15',
          endDate: '2025-05-15',
          spend: 22100,
          impressions: 4293847,
          clicks: 67384,
          conversions: 2047,
          status: 'Completed'
        },
        {
          id: '8',
          name: 'Influencer Collaboration',
          startDate: '2025-06-15',
          endDate: '2025-08-15',
          spend: 16800,
          impressions: 2947382,
          clicks: 41829,
          conversions: 1394,
          status: 'Active'
        },
        {
          id: '9',
          name: 'Email Signup Drive',
          startDate: '2025-07-01',
          endDate: '2025-09-30',
          spend: 7450,
          impressions: 1294738,
          clicks: 19847,
          conversions: 847,
          status: 'Active'
        },
        {
          id: '10',
          name: 'Black Friday Preview',
          startDate: '2025-10-01',
          endDate: '2025-11-29',
          spend: 45600,
          impressions: 8947382,
          clicks: 128473,
          conversions: 4829,
          status: 'Active'
        },
        {
          id: '11',
          name: 'Customer Loyalty Program',
          startDate: '2025-01-01',
          endDate: '2025-12-31',
          spend: 52300,
          impressions: 12847392,
          clicks: 184729,
          conversions: 6847,
          status: 'Active'
        },
        {
          id: '12',
          name: 'Spring Collection Launch',
          startDate: '2025-02-15',
          endDate: '2025-04-30',
          spend: 18900,
          impressions: 3294847,
          clicks: 52847,
          conversions: 1647,
          status: 'Completed'
        }
      ]);
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  // Define table columns
  const columns: ColumnDef<Campaign>[] = [
    {
      accessorKey: "name",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="hover:bg-transparent p-0 font-semibold"
          >
            Campaign Name
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue("name")}</div>
      ),
    },
    {
      accessorKey: "startDate",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="hover:bg-transparent p-0 font-semibold"
          >
            Start Date
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const date = new Date(row.getValue("startDate"));
        return <div>{date.toLocaleDateString()}</div>;
      },
    },
    {
      accessorKey: "endDate",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="hover:bg-transparent p-0 font-semibold"
          >
            End Date
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const date = new Date(row.getValue("endDate"));
        return <div>{date.toLocaleDateString()}</div>;
      },
    },
    {
      accessorKey: "spend",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="hover:bg-transparent p-0 font-semibold"
          >
            Spend
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const amount = parseFloat(row.getValue("spend"));
        const formatted = new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(amount);
        return <div className="font-medium">{formatted}</div>;
      },
    },
    {
      accessorKey: "impressions",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="hover:bg-transparent p-0 font-semibold"
          >
            Impressions
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const impressions = parseInt(row.getValue("impressions"));
        return <div>{impressions.toLocaleString()}</div>;
      },
    },
    {
      accessorKey: "clicks",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="hover:bg-transparent p-0 font-semibold"
          >
            Clicks
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const clicks = parseInt(row.getValue("clicks"));
        return <div>{clicks.toLocaleString()}</div>;
      },
    },
    {
      accessorKey: "conversions",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="hover:bg-transparent p-0 font-semibold"
          >
            Conversions
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const conversions = parseInt(row.getValue("conversions"));
        return <div className="font-medium">{conversions.toLocaleString()}</div>;
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        return (
          <Badge 
            variant={
              status === "Active" 
                ? "default" 
                : status === "Completed" 
                ? "secondary" 
                : "outline"
            }
            className={
              status === "Active"
                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                : status === "Completed"
                ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
            }
          >
            {status}
          </Badge>
        );
      },
    },
  ];

  // Use real-time metrics or fallback to static data
  const metrics = realtimeMetrics.length > 0 ? realtimeMetrics.map((metric, index) => {
    const icons = [
      <DollarSign className="h-4 w-4" />,
      <Users className="h-4 w-4" />,
      <BarChart3 className="h-4 w-4" />,
      <TrendingUp className="h-4 w-4" />
    ];

    return {
      ...metric,
      icon: icons[index] || <BarChart3 className="h-4 w-4" />,
      previousValue: previousMetrics[index]?.value || metric.value
    };
  }) : [
    {
      title: "Revenue",
      value: "$54,231",
      change: "+12.5% from last month",
      icon: <DollarSign className="h-4 w-4" />,
      trend: 'up' as const,
      previousValue: "$54,231"
    },
    {
      title: "Users",
      value: "14,432",
      change: "+8.2% from last month",
      icon: <Users className="h-4 w-4" />,
      trend: 'up' as const,
      previousValue: "14,432"
    },
    {
      title: "Conversions",
      value: "2,847",
      change: "+15.3% from last month",
      icon: <BarChart3 className="h-4 w-4" />,
      trend: 'up' as const,
      previousValue: "2,847"
    },
    {
      title: "Growth %",
      value: "24.8%",
      change: "+4.1% from last month",
      icon: <TrendingUp className="h-4 w-4" />,
      trend: 'up' as const,
      previousValue: "24.8%"
    }
  ];

  if (!mounted) {
    return null; // Prevent hydration mismatch
  }

  return (
    <Layout
      title="ADmyBRAND Insights"
      navbarProps={{
        activeSection: activeSection,
        onSectionChange: handleSectionChange,
        userName: "Jane Doe",
        userRole: "Marketing Manager",
        onProfileClick: () => console.log('Profile clicked'),
        onSettingsClick: () => console.log('Settings clicked'),
        onLogoutClick: () => console.log('Logout clicked')
      }}
      sidebarProps={{
        activeSection: activeSection,
        onSectionChange: handleSectionChange
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-8 mobile-optimized">
        {/* Breadcrumb Navigation */}
        <BreadcrumbNav
          activeSection={activeSection}
          onSectionChange={handleSectionChange}
        />

        {/* Welcome Section */}
        <div className="mb-6 md:mb-8 welcome-mobile">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
            Welcome back, Jane!
          </h2>
          <p className="text-sm md:text-base text-muted-foreground">
            Here's what's happening with your campaigns today.
          </p>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8 metrics-mobile">
          {metrics.map((metric, index) => (
            <div
              key={metric.title}
              className="animate-in fade-in slide-in-from-bottom-4"
              style={{
                animationDelay: `${index * 100}ms`,
                animationFillMode: 'both'
              }}
            >
              <OverviewCard
                {...metric}
                isUpdating={metricsLoading}
                previousValue={metric.previousValue}
              />
            </div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
          {/* Line Chart - Monthly Revenue */}
          <ChartWidget
            title="Monthly Revenue Trend"
            icon={<Calendar className="h-5 w-5" />}
            className="lg:col-span-2"
            height="280px"
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={monthlyRevenueData}
                margin={{ top: 5, right: 5, left: 25, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis
                  dataKey="month"
                  className="text-xs"
                  tick={{ fill: 'hsl(var(--muted-foreground))' }}
                />
                <YAxis
                  className="text-xs"
                  tick={{ fill: 'hsl(var(--muted-foreground))' }}
                  tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                  width={30}
                />
                <Tooltip
                  content={<CustomTooltip />}
                  cursor={{ stroke: 'transparent', strokeWidth: 0 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="revenue" 
                  name="Revenue"
                  stroke="hsl(var(--primary))" 
                  strokeWidth={3}
                  dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: 'hsl(var(--primary))', strokeWidth: 2 }}
                  animationDuration={1500}
                />
                <Line 
                  type="monotone" 
                  dataKey="target" 
                  name="Target"
                  stroke="hsl(var(--muted-foreground))" 
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={false}
                  animationDuration={1500}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartWidget>

          {/* Donut Chart - Conversion Breakdown */}
          <ChartWidget
            title="Conversion Breakdown"
            icon={<PieChartIcon className="h-5 w-5" />}
            height="280px"
          >
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={conversionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="value"
                  animationBegin={0}
                  animationDuration={1500}
                >
                  {conversionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<PieTooltip />} />
                <Legend 
                  verticalAlign="bottom" 
                  height={36}
                  formatter={(value) => <span className="text-sm text-foreground">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </ChartWidget>
        </div>

        {/* Bar Chart - Campaign Performance */}
        <div className="mb-6 md:mb-8">
          <ChartWidget
            title="User Growth by Campaign"
            icon={<Target className="h-5 w-5" />}
            height="320px"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={userGrowthCampaignData}
                margin={{ top: 10, right: 5, left: 25, bottom: 35 }}
              >
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis
                  dataKey="campaign"
                  className="text-xs"
                  tick={{ fill: 'hsl(var(--muted-foreground))' }}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                  interval={0}
                />
                <YAxis
                  className="text-xs"
                  tick={{ fill: 'hsl(var(--muted-foreground))' }}
                  tickFormatter={(value) => `${(value / 1000).toFixed(1)}k`}
                  width={30}
                />
                <Tooltip
                  content={<CustomTooltip />}
                  cursor={{ fill: 'transparent' }}
                />
                <Bar
                  dataKey="users"
                  name="Users"
                  fill="hsl(var(--primary))"
                  radius={[4, 4, 0, 0]}
                  animationDuration={1500}
                  style={{ cursor: 'pointer' }}
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartWidget>
        </div>

        {/* Additional Content Placeholder */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-8">
          <Card className="p-4 md:p-6">
            <h3 className="text-base md:text-lg font-semibold mb-3 md:mb-4">Recent Activity</h3>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center space-x-4 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors duration-200">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Campaign #{i} performance updated</p>
                    <p className="text-xs text-muted-foreground">{i} hours ago</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-4 md:p-6">
            <h3 className="text-base md:text-lg font-semibold mb-3 md:mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-3 md:gap-4">
              <Button variant="outline" className="h-10 md:h-12 text-xs md:text-sm hover:scale-105 transition-transform duration-200">
                Create Campaign
              </Button>
              <Button variant="outline" className="h-10 md:h-12 text-xs md:text-sm hover:scale-105 transition-transform duration-200">
                View Reports
              </Button>
              <Button variant="outline" className="h-10 md:h-12 text-xs md:text-sm hover:scale-105 transition-transform duration-200">
                Manage Audience
              </Button>
              <Button variant="outline" className="h-10 md:h-12 text-xs md:text-sm hover:scale-105 transition-transform duration-200">
                Settings
              </Button>
            </div>
          </Card>
        </div>

        {/* Campaigns Data Table */}
        <div className="mb-8">
          <DataTable
            title="Recent Marketing Campaigns"
            description="Track and analyze the performance of your marketing campaigns"
            icon={<BarChart3 className="h-5 w-5" />}
            columns={columns}
            data={campaigns}
            isLoading={isLoading}
            searchKey="name"
            searchPlaceholder="Search campaigns..."
            enableExport={true}
            exportFilename="marketing-campaigns"
            exportColumns={campaignExportColumns}
            exportFormatters={campaignFormatters}
            enableDateFilter={true}
            dateFilterKey="startDate"
            dateFilterLabel="Filter by start date"
          />
        </div>
      </div>
    </Layout>
  );
}