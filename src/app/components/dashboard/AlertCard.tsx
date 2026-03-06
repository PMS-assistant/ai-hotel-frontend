import { useState } from 'react';
import { AlertTriangle, Info, XCircle, Check, Loader2 } from 'lucide-react';
import { formatRelativeTime } from '../../lib/utils';
import type { AlertData } from '../../lib/mockData';

const severityConfig = {
  info: {
    border: '#3b82f6',
    bg: 'rgba(59,130,246,0.06)',
    icon: <Info size={14} />,
    iconColor: '#3b82f6',
    badgeBg: 'rgba(59,130,246,0.15)',
    badgeColor: '#93c5fd',
    label: 'Info',
  },
  warning: {
    border: '#f59e0b',
    bg: 'rgba(245,158,11,0.06)',
    icon: <AlertTriangle size={14} />,
    iconColor: '#f59e0b',
    badgeBg: 'rgba(245,158,11,0.15)',
    badgeColor: '#fcd34d',
    label: 'Warning',
  },
  critical: {
    border: '#ef4444',
    bg: 'rgba(239,68,68,0.06)',
    icon: <XCircle size={14} />,
    iconColor: '#ef4444',
    badgeBg: 'rgba(239,68,68,0.15)',
    badgeColor: '#fca5a5',
    label: 'Critical',
  },
};

interface AlertCardProps {
  alert: AlertData;
  onAcknowledge?: (id: string) => Promise<void>;
}

export function AlertCard({ alert, onAcknowledge }: AlertCardProps) {
  const config = severityConfig[alert.severity];
  const [dismissing, setDismissing] = useState(false);

  const handleDismiss = async () => {
    if (!onAcknowledge || dismissing) return;
    setDismissing(true);
    try {
      await onAcknowledge(alert.id);
    } finally {
      setDismissing(false);
    }
  };

  return (
    <div
      className="rounded-xl p-4 border-l-[3px] border border-transparent"
      style={{
        backgroundColor: config.bg,
        borderColor: 'transparent',
        borderLeftColor: config.border,
        borderTopColor: 'rgba(51,65,85,0.5)',
        borderRightColor: 'rgba(51,65,85,0.5)',
        borderBottomColor: 'rgba(51,65,85,0.5)',
      }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 min-w-0">
          <span className="mt-0.5 shrink-0" style={{ color: config.iconColor }}>
            {config.icon}
          </span>
          <div className="min-w-0">
            <p className="text-sm mb-1" style={{ color: '#e2e8f0', fontWeight: 500 }}>
              {alert.title}
            </p>
            <p className="text-xs leading-relaxed" style={{ color: '#94a3b8' }}>
              {alert.description}
            </p>
          </div>
        </div>
        <div className="flex flex-col items-end gap-2 shrink-0">
          <span
            className="text-xs px-2 py-0.5 rounded-full whitespace-nowrap"
            style={{
              backgroundColor: config.badgeBg,
              color: config.badgeColor,
              fontWeight: 500,
            }}
          >
            {config.label}
          </span>
          <span className="text-xs" style={{ color: '#475569' }}>
            {formatRelativeTime(alert.timestamp)}
          </span>
        </div>
      </div>
      <div className="mt-2 ml-7 flex items-center justify-between">
        <span
          className="text-xs px-1.5 py-0.5 rounded"
          style={{ backgroundColor: 'rgba(51,65,85,0.5)', color: '#64748b' }}
        >
          {alert.category}
        </span>
        {onAcknowledge && (
          <button
            onClick={handleDismiss}
            disabled={dismissing}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs transition-colors hover:opacity-80 disabled:opacity-50"
            style={{ backgroundColor: 'rgba(51,65,85,0.6)', color: '#94a3b8' }}
          >
            {dismissing ? <Loader2 size={11} className="animate-spin" /> : <Check size={11} />}
            Dismiss
          </button>
        )}
      </div>
    </div>
  );
}
