export function TypingIndicator() {
  return (
    <div className="flex justify-start px-6 py-2">
      <div className="flex items-center gap-2 mb-2">
        <div
          className="w-5 h-5 rounded flex items-center justify-center text-xs font-bold shrink-0"
          style={{
            backgroundColor: 'var(--vzir-gold-glow)',
            color: 'var(--vzir-gold)',
            border: '1px solid var(--vzir-border-hover)',
          }}
        >
          V
        </div>
        <div className="flex items-center gap-1 px-1">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="w-1.5 h-1.5 rounded-full"
              style={{
                backgroundColor: 'var(--vzir-gold-dim)',
                animation: 'vzir-bounce 1.2s infinite',
                animationDelay: `${i * 0.18}s`,
              }}
            />
          ))}
          <style>{`
            @keyframes vzir-bounce {
              0%, 60%, 100% { transform: translateY(0); opacity: 0.5; }
              30% { transform: translateY(-4px); opacity: 1; }
            }
          `}</style>
        </div>
      </div>
    </div>
  );
}
