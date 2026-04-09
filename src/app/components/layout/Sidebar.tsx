import { NavLink, useNavigate } from 'react-router';
import {
  SquarePen,
  BarChart3,
  Users,
  Building2,
  TrendingUp,
  Bell,
  Plug,
  Settings,
  Trash2,
  MessageSquare,
  LogOut,
} from 'lucide-react';
import { useChatStore } from '../../stores/useChatStore';
import { useUserStore } from '../../stores/useUserStore';
import { cn } from '../../lib/utils';
import { formatRelativeTime } from '../../lib/utils';

const NAV_ITEMS = [
  { label: 'Dashboard',    path: '/dashboard',    icon: BarChart3,   roles: ['owner', 'manager'] },
  { label: 'Guests',       path: '/guests',        icon: Users,       roles: ['owner', 'manager'] },
  { label: 'Operations',   path: '/operations',    icon: Building2,   roles: ['owner', 'manager', 'staff'] },
  { label: 'Forecasting',  path: '/forecasting',   icon: TrendingUp,  roles: ['owner', 'manager'] },
  { label: 'Alerts',       path: '/alerts',        icon: Bell,        roles: ['owner', 'manager'] },
  { label: 'Integrations', path: '/integrations',  icon: Plug,        roles: ['owner'] },
  { label: 'Settings',     path: '/settings',      icon: Settings,    roles: ['owner'] },
];

function groupConversations(conversations: ReturnType<typeof useChatStore.getState>['conversations']) {
  const now = new Date();
  const today: typeof conversations = [];
  const yesterday: typeof conversations = [];
  const older: typeof conversations = [];

  conversations.forEach((c) => {
    const d = new Date(c.createdAt);
    const diffDays = Math.floor((now.getTime() - d.getTime()) / 86_400_000);
    if (diffDays === 0) today.push(c);
    else if (diffDays === 1) yesterday.push(c);
    else older.push(c);
  });

  return { today, yesterday, older };
}

export function Sidebar() {
  const { conversations, activeConversationId, createConversation, setActiveConversation, deleteConversation } =
    useChatStore();
  const { role, email, hotelName, logout } = useUserStore();
  const navigate = useNavigate();

  const visibleNav = NAV_ITEMS.filter((item) => item.roles.includes(role));
  const { today, yesterday, older } = groupConversations(conversations);

  const handleNewChat = () => {
    const id = createConversation(useUserStore.getState().hotelId);
    navigate('/chat');
  };

  const handleSelectConv = (id: string) => {
    setActiveConversation(id);
    navigate('/chat');
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside
      className="hidden md:flex flex-col h-screen sticky top-0 shrink-0 border-r select-none"
      style={{
        width: 'var(--vzir-sidebar-w)',
        backgroundColor: 'var(--vzir-surface)',
        borderColor: 'var(--vzir-border)',
      }}
    >
      {/* ── Top: Logo + New chat ── */}
      <div
        className="flex items-center justify-between px-4 py-4 border-b"
        style={{ borderColor: 'var(--vzir-border)' }}
      >
        <button
          onClick={() => navigate('/chat')}
          className="flex items-center gap-2.5 group"
        >
          <div
            className="w-6 h-6 rounded flex items-center justify-center text-xs font-bold shrink-0"
            style={{ backgroundColor: 'var(--vzir-gold)', color: 'var(--vzir-bg)' }}
          >
            V
          </div>
          <span
            className="text-sm tracking-[0.1em] uppercase"
            style={{ color: 'var(--vzir-text)', fontWeight: 500, letterSpacing: '0.1em' }}
          >
            Vzir
          </span>
        </button>

        <button
          onClick={handleNewChat}
          title="New conversation"
          className="p-1.5 rounded-lg transition-colors"
          style={{ color: 'var(--vzir-text-2)' }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--vzir-surface-2)';
            e.currentTarget.style.color = 'var(--vzir-gold)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.color = 'var(--vzir-text-2)';
          }}
        >
          <SquarePen size={15} />
        </button>
      </div>

      {/* ── Middle: Conversation list ── */}
      <div className="flex-1 overflow-y-auto py-2 min-h-0">
        {conversations.length === 0 && (
          <div className="px-4 py-10 text-center">
            <MessageSquare size={18} className="mx-auto mb-2" style={{ color: 'var(--vzir-border-hover)' }} />
            <p className="text-xs" style={{ color: 'var(--vzir-text-3)' }}>
              No conversations yet
            </p>
            <p className="text-xs mt-0.5" style={{ color: 'var(--vzir-text-3)' }}>
              Ask Vzir anything
            </p>
          </div>
        )}

        {today.length > 0 && (
          <ConvGroup label="Today" convs={today} activeId={activeConversationId} onSelect={handleSelectConv} onDelete={deleteConversation} />
        )}
        {yesterday.length > 0 && (
          <ConvGroup label="Yesterday" convs={yesterday} activeId={activeConversationId} onSelect={handleSelectConv} onDelete={deleteConversation} />
        )}
        {older.length > 0 && (
          <ConvGroup label="Earlier" convs={older} activeId={activeConversationId} onSelect={handleSelectConv} onDelete={deleteConversation} />
        )}
      </div>

      {/* ── Bottom: Navigation ── */}
      <div className="border-t pb-2" style={{ borderColor: 'var(--vzir-border)' }}>
        <div className="pt-2 px-2 space-y-0.5">
          {visibleNav.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 px-3 py-2 rounded-lg text-xs transition-all',
                    isActive ? '' : 'hover:opacity-90'
                  )
                }
                style={({ isActive }) => ({
                  backgroundColor: isActive ? 'var(--vzir-gold-glow)' : 'transparent',
                  color: isActive ? 'var(--vzir-gold)' : 'var(--vzir-text-2)',
                })}
                onMouseEnter={(e) => {
                  const el = e.currentTarget;
                  if (!el.dataset.active) el.style.backgroundColor = 'var(--vzir-surface-2)';
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget;
                  if (!el.dataset.active) el.style.backgroundColor = 'transparent';
                }}
              >
                <Icon size={14} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </div>

        {/* User row */}
        <div
          className="mx-2 mt-2 pt-2 border-t flex items-center gap-2 px-3 py-2 rounded-lg group cursor-pointer transition-colors"
          style={{ borderColor: 'var(--vzir-border)' }}
          onClick={handleLogout}
          title="Sign out"
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--vzir-surface-2)')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
        >
          <div
            className="w-6 h-6 rounded-full flex items-center justify-center text-xs shrink-0 font-medium"
            style={{ backgroundColor: 'var(--vzir-surface-3)', color: 'var(--vzir-gold)' }}
          >
            {(email?.[0] ?? 'U').toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs truncate" style={{ color: 'var(--vzir-text-2)' }}>
              {email ?? hotelName}
            </p>
          </div>
          <LogOut size={12} style={{ color: 'var(--vzir-text-3)' }} className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </div>
    </aside>
  );
}

/* ── Conversation group ── */
type Conv = ReturnType<typeof useChatStore.getState>['conversations'][number];

function ConvGroup({
  label,
  convs,
  activeId,
  onSelect,
  onDelete,
}: {
  label: string;
  convs: Conv[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <div className="mb-1">
      <p
        className="px-4 py-1 text-xs"
        style={{ color: 'var(--vzir-text-3)', letterSpacing: '0.04em' }}
      >
        {label}
      </p>
      {convs.map((conv) => {
        const isActive = conv.id === activeId;
        return (
          <div
            key={conv.id}
            onClick={() => onSelect(conv.id)}
            className="group flex items-center gap-2.5 mx-2 px-3 py-2 rounded-lg cursor-pointer transition-all"
            style={{
              backgroundColor: isActive ? 'var(--vzir-surface-2)' : 'transparent',
              borderLeft: isActive ? '2px solid var(--vzir-gold)' : '2px solid transparent',
            }}
            onMouseEnter={(e) => {
              if (!isActive) e.currentTarget.style.backgroundColor = 'var(--vzir-surface-2)';
            }}
            onMouseLeave={(e) => {
              if (!isActive) e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            <MessageSquare
              size={13}
              className="shrink-0 mt-px"
              style={{ color: isActive ? 'var(--vzir-gold)' : 'var(--vzir-text-3)' }}
            />
            <div className="flex-1 min-w-0">
              <p
                className="text-xs truncate"
                style={{
                  color: isActive ? 'var(--vzir-text)' : 'var(--vzir-text-2)',
                  fontWeight: isActive ? 500 : 400,
                }}
              >
                {conv.title}
              </p>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(conv.id);
              }}
              className="opacity-0 group-hover:opacity-100 p-0.5 rounded transition-all"
              style={{ color: 'var(--vzir-text-3)' }}
              onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--vzir-red)')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--vzir-text-3)')}
            >
              <Trash2 size={11} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
