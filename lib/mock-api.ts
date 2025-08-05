/**
 * Mock API for Real-Time Metrics Simulation
 *
 * This module simulates a real-time analytics API by generating
 * realistic variations of marketing metrics. In a production environment,
 * this would be replaced with actual API calls to your analytics service.
 *
 * Features:
 * - Realistic data variations using mathematical algorithms
 * - Proper error simulation and network delays
 * - TypeScript interfaces for type safety
 * - Formatted output ready for UI display
 */

import { generateVariation, formatCurrency, formatNumber, formatPercentage } from './utils';

/**
 * Base metrics configuration
 * These represent typical values for a marketing dashboard
 * Variations are generated around these baseline numbers
 */
const baseMetrics = {
  revenue: 54231,        // Monthly revenue in USD
  users: 14432,          // Total active users
  conversions: 2847,     // Monthly conversions
  growthPercent: 24.8    // Growth percentage
};

/**
 * Metric data structure
 * Represents a single metric with all display information
 */
export interface Metric {
  title: string;
  value: string;
  change: string;
  icon: React.ReactNode;
  trend: 'up' | 'down' | 'neutral';
  rawValue: number;
  changePercent: number;
}

/**
 * Generate realistic metric variations
 *
 * Creates dynamic metrics data with realistic fluctuations
 * that simulate real-world business analytics
 *
 * @returns Array of metric objects without icons (icons added in UI layer)
 */
export function generateMetricsData(): Omit<Metric, 'icon'>[] {
  // Generate current values with small variations from baseline
  const revenue = generateVariation(baseMetrics.revenue, 3);        // ±3% variation
  const users = generateVariation(baseMetrics.users, 4);            // ±4% variation
  const conversions = generateVariation(baseMetrics.conversions, 6); // ±6% variation
  const growthPercent = generateVariation(baseMetrics.growthPercent, 8); // ±8% variation

  // Generate month-over-month change percentages with realistic volatility
  const revenueChange = generateVariation(12.5, 20);      // Revenue growth: ~12.5% ±20%
  const usersChange = generateVariation(8.2, 25);         // User growth: ~8.2% ±25%
  const conversionsChange = generateVariation(15.3, 30);  // Conversion growth: ~15.3% ±30%
  const growthChange = generateVariation(4.1, 40);        // Growth rate change: ~4.1% ±40%

  return [
    {
      title: "Revenue",
      value: formatCurrency(revenue),
      change: `${revenueChange >= 0 ? '+' : ''}${formatPercentage(revenueChange)} from last month`,
      trend: revenueChange >= 0 ? 'up' : 'down',
      rawValue: revenue,
      changePercent: revenueChange
    },
    {
      title: "Users",
      value: formatNumber(Math.round(users)),
      change: `${usersChange >= 0 ? '+' : ''}${formatPercentage(usersChange)} from last month`,
      trend: usersChange >= 0 ? 'up' : 'down',
      rawValue: users,
      changePercent: usersChange
    },
    {
      title: "Conversions",
      value: formatNumber(Math.round(conversions)),
      change: `${conversionsChange >= 0 ? '+' : ''}${formatPercentage(conversionsChange)} from last month`,
      trend: conversionsChange >= 0 ? 'up' : 'down',
      rawValue: conversions,
      changePercent: conversionsChange
    },
    {
      title: "Growth %",
      value: formatPercentage(growthPercent),
      change: `${growthChange >= 0 ? '+' : ''}${formatPercentage(growthChange)} from last month`,
      trend: growthChange >= 0 ? 'up' : 'down',
      rawValue: growthPercent,
      changePercent: growthChange
    }
  ];
}

// Simulate API delay
function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Mock API endpoints
export class MockAPI {
  static async fetchMetrics(): Promise<Omit<Metric, 'icon'>[]> {
    await delay(100 + Math.random() * 200); // Simulate network delay
    return generateMetricsData();
  }

  static async fetchCampaigns(): Promise<any[]> {
    await delay(200 + Math.random() * 300);
    // Return existing campaign data - this could be enhanced with real-time updates
    return [];
  }
}

// Real-time metrics hook data
export interface MetricsUpdate {
  timestamp: number;
  metrics: Omit<Metric, 'icon'>[];
  isLoading: boolean;
  error?: string;
}
