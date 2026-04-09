import { useState, useRef, useEffect, type KeyboardEvent } from 'react';
import { ArrowUp, Plus, X, CheckCircle2, Circle, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useUserStore } from '../../stores/useUserStore';

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
}

const INTEGRATIONS = [
  { id: 'cloudbeds', label: 'Cloudbeds PMS',       category: 'PMS',        storeKey: 'cloudbedsConnected' },
  { id: 'xero',      label: 'Xero Accounting',      category: 'Accounting', storeKey: 'xeroConnected' },
  { id: 'whatsapp',  label: 'WhatsApp',             category: 'Messaging',  storeKey: null, soon: true },
  { id: 'events',    label: 'Local Events API',     category: 'Intelligence', storeKey: null, soon: true },
  { id: 'opera',     label: 'Opera PMS',            category: 'PMS',        storeKey: null, soon: true },
] as const;

export function ChatInput({ onSend, disabled = false }: ChatInputProps) {
  const [value, setValue] = useState('');
  const [toolsOpen, setToolsOpen] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const store = useUserStore();

  // Close panel on outside click
  useEffect(() => {
    if (!toolsOpen) return;
    const handler = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setToolsOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [toolsOpen]);

  const handleSend = () => {
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setValue('');
    if (textareaRef.current) textareaRef.current.style.height = 'auto';
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInput = () => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 140)}px`;
  };

  const canSend = value.trim().length > 0 && !disabled;

  return (
    <div className="px-4 pb-5 pt-2 relative">
      {/* ── Tools panel (compact dropdown above + button) ── */}
      {toolsOpen && (
        <div
          ref={panelRef}
          className="absolute bottom-full mb-2 left-4 rounded-xl border overflow-hidden shadow-2xl"
          style={{
            backgroundColor: 'var(--vzir-surface-2)',
            borderColor: 'var(--vzir-border-hover)',
            zIndex: 50,
            width: '260px',
          }}
        >
          {/* Panel header */}
          <div
            className="flex items-center justify-between px-3 py-2.5 border-b"
            style={{ borderColor: 'var(--vzir-border)' }}
          >
            <p className="text-xs font-medium" style={{ color: 'var(--vzir-text-2)', letterSpacing: '0.04em' }}>
              Connected sources
            </p>
            <button
              onClick={() => setToolsOpen(false)}
              className="p-0.5 rounded transition-colors"
              style={{ color: 'var(--vzir-text-3)' }}
            >
              <X size={12} />
            </button>
          </div>

          {/* Integration list */}
          <div className="py-1">
            {INTEGRATIONS.map((intg) => {
              const connected = intg.storeKey ? (store as any)[intg.storeKey] : false;
              return (
                <div
                  key={intg.id}
                  className="flex items-center gap-2.5 px-3 py-2"
                  style={{ backgroundColor: connected ? 'var(--vzir-green-dim)' : 'transparent' }}
                >
                  {connected ? (
                    <CheckCircle2 size={13} style={{ color: 'var(--vzir-green)', flexShrink: 0 }} />
                  ) : (
                    <Circle size={13} style={{ color: 'var(--vzir-text-3)', flexShrink: 0 }} />
                  )}

                  <div className="flex-1 min-w-0">
                    <p className="text-xs" style={{ color: connected ? 'var(--vzir-text)' : 'var(--vzir-text-2)' }}>
                      {intg.label}
                    </p>
                  </div>

                  {intg.soon ? (
                    <span style={{ color: 'var(--vzir-text-3)', fontSize: '10px', letterSpacing: '0.04em' }}>
                      SOON
                    </span>
                  ) : connected ? (
                    <span style={{ color: 'var(--vzir-green)', fontSize: '11px' }}>Active</span>
                  ) : (
                    <button
                      onClick={() => { setToolsOpen(false); navigate('/integrations'); }}
                      className="flex items-center gap-1"
                      style={{ color: 'var(--vzir-gold)', fontSize: '11px' }}
                    >
                      Connect <ExternalLink size={9} />
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          {/* Footer */}
          <div className="px-4 py-2.5 border-t" style={{ borderColor: 'var(--vzir-border)' }}>
            <button
              onClick={() => { setToolsOpen(false); navigate('/integrations'); }}
              className="text-xs transition-colors"
              style={{ color: 'var(--vzir-text-3)' }}
              onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--vzir-gold)')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--vzir-text-3)')}
            >
              Manage all integrations →
            </button>
          </div>
        </div>
      )}

      {/* ── Input bar ── */}
      <div
        className="flex items-end gap-2 rounded-2xl px-3 py-3 border transition-all"
        style={{
          backgroundColor: 'var(--vzir-surface)',
          borderColor: toolsOpen ? 'var(--vzir-border-hover)' : 'var(--vzir-border)',
        }}
      >
        {/* + Tools button */}
        <button
          onClick={() => setToolsOpen((o) => !o)}
          title="Connected sources"
          className="shrink-0 w-8 h-8 rounded-xl flex items-center justify-center transition-all mb-px"
          style={{
            backgroundColor: toolsOpen ? 'var(--vzir-gold-glow)' : 'var(--vzir-surface-2)',
            color: toolsOpen ? 'var(--vzir-gold)' : 'var(--vzir-text-3)',
            border: `1px solid ${toolsOpen ? 'var(--vzir-border-hover)' : 'var(--vzir-border)'}`,
          }}
        >
          <Plus size={14} />
        </button>

        {/* Textarea */}
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onInput={handleInput}
          placeholder="Ask Vzir anything about your property…"
          disabled={disabled}
          rows={1}
          className="flex-1 resize-none bg-transparent outline-none text-sm leading-relaxed disabled:opacity-40"
          style={{
            color: 'var(--vzir-text)',
            caretColor: 'var(--vzir-gold)',
          }}
        />

        {/* Send button */}
        <button
          onClick={handleSend}
          disabled={!canSend}
          className="shrink-0 w-8 h-8 rounded-xl flex items-center justify-center transition-all mb-px"
          style={{
            backgroundColor: canSend ? 'var(--vzir-gold)' : 'var(--vzir-surface-2)',
            color: canSend ? 'var(--vzir-bg)' : 'var(--vzir-text-3)',
            border: `1px solid ${canSend ? 'var(--vzir-gold)' : 'var(--vzir-border)'}`,
          }}
        >
          <ArrowUp size={14} />
        </button>
      </div>

      <p className="mt-2 text-center text-xs" style={{ color: 'var(--vzir-text-3)' }}>
        Vzir reads from your connected systems. Always verify critical decisions.
      </p>
    </div>
  );
}
