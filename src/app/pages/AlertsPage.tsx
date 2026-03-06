import { useEffect } from 'react';
import { toast } from 'sonner';
import { TopBar } from '../components/layout/TopBar';
import { AlertsPanel } from '../components/dashboard/AlertsPanel';
import { useDashboard } from '../hooks/useDashboard';
import { useAutoRefresh } from '../hooks/useAutoRefresh';

export default function AlertsPage() {
  const { data, isLoading, error, lastRefresh, refetch, acknowledgeAlert } = useDashboard();

  useAutoRefresh(refetch, 5 * 60 * 1000);

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  return (
    <div style={{ backgroundColor: '#0f172a', minHeight: '100vh' }}>
      <TopBar
        title="Alerts"
        lastRefresh={lastRefresh}
        onRefresh={refetch}
        isRefreshing={isLoading}
      />
      <div className="px-6 py-6 max-w-3xl">
        <AlertsPanel alerts={data?.alerts ?? []} loading={isLoading} onAcknowledge={acknowledgeAlert} />
      </div>
    </div>
  );
}
