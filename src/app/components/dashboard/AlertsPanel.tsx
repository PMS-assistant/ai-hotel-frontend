import { AlertCard } from './AlertCard';
import { Skeleton } from '../ui/skeleton';
import type { AlertData } from '../../lib/mockData';

interface AlertsPanelProps {
  alerts: AlertData[];
  loading?: boolean;
  onAcknowledge?: (id: string) => Promise<void>;
}

export function AlertsPanel({ alerts, loading = false, onAcknowledge }: AlertsPanelProps) {
  const criticalCount = alerts.filter((a) => a.severity === 'critical').length;
  const warningCount = alerts.filter((a) => a.severity === 'warning').length;

  if (loading) {
    return (
      <div className="space-y-3">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="rounded-xl p-4 border"
            style={{ backgroundColor: '#1e293b', borderColor: '#334155' }}
          >
            <Skeleton className="h-3 w-40 mb-2" style={{ backgroundColor: '#334155' }} />
            <Skeleton className="h-3 w-full mb-1" style={{ backgroundColor: '#334155' }} />
            <Skeleton className="h-3 w-3/4" style={{ backgroundColor: '#334155' }} />
          </div>
        ))}
      </div>
    );
  }

  if (alerts.length === 0) {
    return (
      <div
        className="rounded-xl p-8 border text-center"
        style={{ backgroundColor: '#1e293b', borderColor: '#334155' }}
      >
        <p className="text-sm" style={{ color: '#64748b' }}>
          No active alerts — all systems nominal.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-4">
        <h2 className="text-sm" style={{ color: '#f1f5f9', fontWeight: 600 }}>
          Active Alerts
        </h2>
        <div className="flex items-center gap-2">
          {criticalCount > 0 && (
            <span
              className="text-xs px-2 py-0.5 rounded-full"
              style={{ backgroundColor: 'rgba(239,68,68,0.15)', color: '#fca5a5', fontWeight: 500 }}
            >
              {criticalCount} critical
            </span>
          )}
          {warningCount > 0 && (
            <span
              className="text-xs px-2 py-0.5 rounded-full"
              style={{ backgroundColor: 'rgba(245,158,11,0.15)', color: '#fcd34d', fontWeight: 500 }}
            >
              {warningCount} warning
            </span>
          )}
        </div>
      </div>
      <div className="space-y-3">
        {alerts
          .sort((a, b) => {
            const order = { critical: 0, warning: 1, info: 2 };
            return order[a.severity] - order[b.severity];
          })
          .map((alert) => (
            <AlertCard key={alert.id} alert={alert} onAcknowledge={onAcknowledge} />
          ))}
      </div>
    </div>
  );
}
