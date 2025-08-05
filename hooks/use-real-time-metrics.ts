/**
 * Real-Time Metrics Hook
 *
 * A custom React hook that provides real-time metrics data with automatic polling.
 * Features:
 * - Configurable polling interval (default: 5 seconds)
 * - Automatic pause/resume on tab visibility change
 * - Error handling and loading states
 * - Memory leak prevention with proper cleanup
 *
 * @param intervalMs - Polling interval in milliseconds
 * @returns Object containing metrics data, loading state, and control functions
 */

'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { MockAPI, MetricsUpdate } from '@/lib/mock-api';

export function useRealTimeMetrics(intervalMs: number = 5000) {
  // State to hold metrics data and loading/error states
  const [metricsData, setMetricsData] = useState<MetricsUpdate>({
    timestamp: Date.now(),
    metrics: [],
    isLoading: true,
    error: undefined
  });

  // Refs for managing polling interval and component mount state
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const mountedRef = useRef(true);

  /**
   * Fetches metrics from the Mock API
   * Handles loading states and error conditions
   */
  const fetchMetrics = useCallback(async () => {
    if (!mountedRef.current) return;

    try {
      setMetricsData(prev => ({ ...prev, isLoading: true, error: undefined }));
      
      const metrics = await MockAPI.fetchMetrics();
      
      if (mountedRef.current) {
        setMetricsData({
          timestamp: Date.now(),
          metrics,
          isLoading: false,
          error: undefined
        });
      }
    } catch (error) {
      if (mountedRef.current) {
        setMetricsData(prev => ({
          ...prev,
          isLoading: false,
          error: error instanceof Error ? error.message : 'Failed to fetch metrics'
        }));
      }
    }
  }, []);

  /**
   * Starts the polling mechanism
   * Fetches data immediately, then sets up interval for continuous updates
   */
  const startPolling = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    // Fetch immediately for instant data
    fetchMetrics();

    // Set up recurring interval
    intervalRef.current = setInterval(fetchMetrics, intervalMs);
  }, [fetchMetrics, intervalMs]);

  /**
   * Stops the polling mechanism and cleans up interval
   */
  const stopPolling = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  /**
   * Manually refresh metrics data
   */
  const refreshMetrics = useCallback(() => {
    fetchMetrics();
  }, [fetchMetrics]);

  useEffect(() => {
    mountedRef.current = true;
    startPolling();

    return () => {
      mountedRef.current = false;
      stopPolling();
    };
  }, [startPolling, stopPolling]);

  /**
   * Handle browser tab visibility changes
   * Pauses polling when tab is hidden to save resources
   * Resumes polling when tab becomes visible again
   */
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        stopPolling(); // Pause when tab is hidden
      } else {
        startPolling(); // Resume when tab becomes visible
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [startPolling, stopPolling]);

  return {
    ...metricsData,
    refreshMetrics,
    startPolling,
    stopPolling
  };
}
