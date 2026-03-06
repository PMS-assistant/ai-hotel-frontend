import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';
import { BookOpen, ExternalLink } from 'lucide-react';
import { TopBar } from '../components/layout/TopBar';
import { KPICard } from '../components/dashboard/KPICard';
import { AlertsPanel } from '../components/dashboard/AlertsPanel';
import { ForecastChart } from '../components/dashboard/ForecastChart';
import { PickupChart } from '../components/dashboard/PickupChart';
import { FinancialComparisonChart } from '../components/dashboard/FinancialComparisonChart';
import { useDashboard } from '../hooks/useDashboard';
import { useAutoRefresh } from '../hooks/useAutoRefresh';
import { useUserStore } from '../stores/useUserStore';
import { formatCurrency, formatPercent } from '../lib/utils';

export default function DashboardPage() {
  const { role, xeroConnected } = useUserStore();
  const navigate = useNavigate();
  const { data, isLoading, error, lastRefresh, refetch, acknowledgeAlert } = useDashboard();

  useAutoRefresh(refetch, 5 * 60 * 1000);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const showFinancials = role === 'owner' || role === 'manager';

  return (
    <div style={{ backgroundColor: '#0f172a', minHeight: '100vh' }}>
      <TopBar
        title="Executive Overview"
        lastRefresh={lastRefresh}
        onRefresh={refetch}
        isRefreshing={isLoading}
      />

      <div className="px-6 py-6 space-y-8">
        {/* KPI Row */}
        {showFinancials && (
          <section>
            <p
              className="text-xs uppercase tracking-widest mb-4"
              style={{ color: '#475569', fontWeight: 500 }}
            >
              Today's Performance
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              <KPICard
                title="Occupancy"
                value={isLoading ? '—' : formatPercent(data?.kpis.occupancyToday ?? 0)}
                trend={data?.kpis.occupancyTrend}
                trendLabel="%"
                loading={isLoading}
              />
              <KPICard
                title="ADR"
                value={isLoading ? '—' : formatCurrency(data?.kpis.adrToday ?? 0)}
                trend={data?.kpis.adrTrend}
                trendLabel=""
                loading={isLoading}
              />
              <KPICard
                title="RevPAR"
                value={isLoading ? '—' : formatCurrency(data?.kpis.revpar ?? 0)}
                trend={data?.kpis.revparTrend}
                trendLabel=""
                loading={isLoading}
              />
              <KPICard
                title="Rooms Available"
                value={
                  isLoading
                    ? '—'
                    : `${data?.kpis.roomsAvailable ?? 0} / ${data?.kpis.totalRooms ?? 0}`
                }
                loading={isLoading}
              />
              <KPICard
                title="Cancellation Rate"
                value={isLoading ? '—' : formatPercent(data?.kpis.cancellationRate ?? 0)}
                trend={data?.kpis.cancellationRateTrend}
                trendLabel="%"
                trendInverse
                loading={isLoading}
              />
            </div>
          </section>
        )}

        {/* Error state */}
        {error && !isLoading && (
          <div
            className="rounded-xl p-5 border text-center"
            style={{ backgroundColor: '#1e293b', borderColor: '#334155' }}
          >
            <p className="text-sm mb-3" style={{ color: '#94a3b8' }}>
              {error}
            </p>
            <button
              onClick={refetch}
              className="px-4 py-2 rounded-lg text-sm transition-colors"
              style={{ backgroundColor: '#7c3aed', color: '#fff' }}
            >
              Retry
            </button>
          </div>
        )}

        {/* Alerts */}
        <section>
          <AlertsPanel alerts={data?.alerts ?? []} loading={isLoading} onAcknowledge={acknowledgeAlert} />
        </section>

        {/* Charts */}
        {showFinancials && (
          <section>
            <p
              className="text-xs uppercase tracking-widest mb-4"
              style={{ color: '#475569', fontWeight: 500 }}
            >
              Forecasting &amp; Pickup
            </p>
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
              <ForecastChart data={data?.forecast ?? []} loading={isLoading} />
              <PickupChart data={data?.pickup ?? []} loading={isLoading} />
            </div>
          </section>
        )}

        {/* Financial Comparison — Xero-gated */}
        {showFinancials && xeroConnected && (
          <FinancialComparisonChart />
        )}

        {/* Xero upsell nudge — only for owners when not yet connected */}
        {showFinancials && !xeroConnected && role === 'owner' && (
          <div
            className="rounded-xl border px-5 py-4 flex items-center justify-between gap-4"
            style={{
              backgroundColor: 'rgba(0,176,122,0.05)',
              borderColor: 'rgba(0,176,122,0.18)',
            }}
          >
            <div className="flex items-center gap-3">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                style={{ backgroundColor: 'rgba(0,176,122,0.15)' }}
              >
                <BookOpen size={15} style={{ color: '#34d399' }} />
              </div>
              <div>
                <p className="text-sm" style={{ color: '#e2e8f0', fontWeight: 500 }}>
                  Unlock financial comparison dashboards
                </p>
                <p className="text-xs mt-0.5" style={{ color: '#64748b' }}>
                  Connect Xero to view revenue vs budget, P&amp;L summaries and 6-month trend charts.
                </p>
              </div>
            </div>
            <button
              onClick={() => navigate('/integrations')}
              className="shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs transition-all"
              style={{ backgroundColor: '#00b07a', color: '#fff', fontWeight: 500 }}
            >
              <ExternalLink size={11} />
              Connect Xero
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
