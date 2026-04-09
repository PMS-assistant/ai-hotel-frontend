import { useState, useEffect, useCallback } from 'react';
import { apiClient } from '../lib/axios';
import { mockKPIs, mockAlerts, mockForecast, mockPickup, type KPIData, type AlertData, type ForecastPoint, type PickupPoint } from '../lib/mockData';

interface DashboardData {
  kpis: KPIData;
  alerts: AlertData[];
  forecast: ForecastPoint[];
  pickup: PickupPoint[];
}

interface UseDashboardReturn {
  data: DashboardData | null;
  isLoading: boolean;
  error: string | null;
  lastRefresh: Date | null;
  refetch: () => void;
  acknowledgeAlert: (id: string) => Promise<void>;
}

const hasApiBaseUrl = !!import.meta.env.VITE_API_BASE_URL;

export function useDashboard(): UseDashboardReturn {
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      if (hasApiBaseUrl) {
        const { data: apiData } = await apiClient.get<DashboardData>('/dashboard/summary');
        setData(apiData);
      } else {
        await new Promise<void>((resolve) => setTimeout(resolve, 400));
        setData({
          kpis: mockKPIs,
          alerts: mockAlerts,
          forecast: mockForecast,
          pickup: mockPickup,
        });
      }
      setLastRefresh(new Date());
    } catch (err: any) {
      console.error('Dashboard error:', err);
      const errorMsg = err?.response?.data?.detail || err?.message || 'Failed to load dashboard data. Please try again.';
      setError(errorMsg);
      setData({
        kpis: mockKPIs,
        alerts: mockAlerts,
        forecast: mockForecast,
        pickup: mockPickup,
      });
      setLastRefresh(new Date());
    } finally {
      setIsLoading(false);
    }
  }, []);

  const acknowledgeAlert = useCallback(async (id: string) => {
    if (hasApiBaseUrl) {
      await apiClient.patch(`/dashboard/alerts/${id}/acknowledge`);
    }
    setData((prev) => {
      if (!prev) return prev;
      return { ...prev, alerts: prev.alerts.filter((a) => a.id !== id) };
    });
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, isLoading, error, lastRefresh, refetch: fetchData, acknowledgeAlert };
}
