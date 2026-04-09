import { useUserStore } from '../../stores/useUserStore';

const PROMPTS = [
  "How many arrivals do we have next week?",
  "What's my occupancy rate this month?",
  "Show me yesterday's revenue",
  "Which rooms need cleaning right now?",
  "What's the forecast for next weekend?",
  "Any maintenance issues I should know about?",
];

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 18) return 'Good afternoon';
  return 'Good evening';
}

interface QuickPromptsProps {
  onSelect: (prompt: string) => void;
}

export function QuickPrompts({ onSelect }: QuickPromptsProps) {
  const { email, hotelName } = useUserStore();
  const firstName = email?.split('@')[0] ?? 'there';
  const greeting = getGreeting();

  return (
    <div className="flex flex-col items-center justify-center flex-1 px-6 py-16 min-h-0">
      {/* Vzir mark */}
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold mb-6"
        style={{ backgroundColor: 'var(--vzir-gold-glow)', border: '1px solid var(--vzir-border-hover)' }}
      >
        <span style={{ color: 'var(--vzir-gold)', fontWeight: 600 }}>V</span>
      </div>

      <h2
        className="text-2xl mb-2 text-center"
        style={{ color: 'var(--vzir-text)', fontWeight: 300, letterSpacing: '-0.02em' }}
      >
        {greeting}, {firstName}
      </h2>
      <p className="text-sm mb-10 text-center" style={{ color: 'var(--vzir-text-2)' }}>
        What would you like to know about{hotelName ? ` ${hotelName}` : ' your property'}?
      </p>

      {/* Prompt chips */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-xl">
        {PROMPTS.map((prompt) => (
          <button
            key={prompt}
            onClick={() => onSelect(prompt)}
            className="text-left px-4 py-3 rounded-xl text-sm transition-all"
            style={{
              backgroundColor: 'var(--vzir-surface)',
              border: '1px solid var(--vzir-border)',
              color: 'var(--vzir-text-2)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--vzir-border-hover)';
              e.currentTarget.style.color = 'var(--vzir-text)';
              e.currentTarget.style.backgroundColor = 'var(--vzir-surface-2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--vzir-border)';
              e.currentTarget.style.color = 'var(--vzir-text-2)';
              e.currentTarget.style.backgroundColor = 'var(--vzir-surface)';
            }}
          >
            {prompt}
          </button>
        ))}
      </div>
    </div>
  );
}
