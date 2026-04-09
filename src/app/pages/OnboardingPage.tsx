import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';
import { ArrowRight, ChevronRight } from 'lucide-react';
import { useUserStore } from '../stores/useUserStore';

/* ─── Slide definitions ─────────────────────────────────────────── */
const SLIDES = [
  {
    id: 1,
    words: ['One AI.', 'Every Answer.'],
    sub: 'Ask anything about your property. Vzir reads from every connected system and gives you one clear answer.',
    gradient: 'radial-gradient(ellipse at 35% 55%, rgba(201,169,110,0.22) 0%, rgba(12,10,8,0.95) 55%), linear-gradient(160deg, #0C0A08 0%, #1a1208 100%)',
    accent: '#C9A96E',
    visual: <VisualRings />,
  },
  {
    id: 2,
    words: ['Connect.', "Don't Switch."],
    sub: 'PMS, accounting, WhatsApp — all feeding one intelligence layer. No more jumping between 5 different tools.',
    gradient: 'radial-gradient(ellipse at 65% 40%, rgba(56,119,255,0.18) 0%, rgba(4,10,30,0.97) 60%), linear-gradient(160deg, #04080f 0%, #060d1f 100%)',
    accent: '#4F8EFF',
    visual: <VisualNetwork />,
  },
  {
    id: 3,
    words: ['Your Guests.', 'Always Looked After.'],
    sub: 'From welcome message to review request — every guest touchpoint handled on WhatsApp, automatically.',
    gradient: 'radial-gradient(ellipse at 30% 60%, rgba(255,140,50,0.18) 0%, rgba(20,8,2,0.97) 60%), linear-gradient(160deg, #120500 0%, #1f0900 100%)',
    accent: '#FF8C32',
    visual: <VisualWhatsApp />,
  },
  {
    id: 4,
    words: ["Know What's Coming.", 'Before It Arrives.'],
    sub: 'Local events, weather, booking pace — all combined into one demand forecast so you\'re never caught off guard.',
    gradient: 'radial-gradient(ellipse at 60% 45%, rgba(138,79,255,0.20) 0%, rgba(10,5,25,0.97) 60%), linear-gradient(160deg, #060312 0%, #0d061e 100%)',
    accent: '#8A4FFF',
    visual: <VisualChart />,
  },
  {
    id: 5,
    words: ['Every Space.', 'Earning Its Keep.'],
    sub: 'Empty parking? Unsold rooms? Vzir spots the opportunity and your front desk acts on it — instantly.',
    gradient: 'radial-gradient(ellipse at 40% 55%, rgba(34,197,100,0.18) 0%, rgba(3,14,6,0.97) 60%), linear-gradient(160deg, #020d04 0%, #051509 100%)',
    accent: '#22C564',
    visual: <VisualGrid />,
  },
  {
    id: 6,
    words: ['Your Hotel.', 'Starts Now.'],
    sub: "You're all set. Connect your first system and let Vzir do the rest.",
    gradient: 'radial-gradient(ellipse at 50% 50%, rgba(201,169,110,0.25) 0%, rgba(12,10,8,0.97) 55%), linear-gradient(160deg, #0C0A08 0%, #1a1208 100%)',
    accent: '#C9A96E',
    visual: <VisualFinal />,
  },
];

const AUTO_ADVANCE_MS = 6500;

/* ─── Main component ─────────────────────────────────────────────── */
export default function OnboardingPage() {
  const [current, setCurrent] = useState(0);
  const [transitioning, setTransitioning] = useState(false);
  const [wordKey, setWordKey] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const navigate = useNavigate();
  const { completeOnboarding } = useUserStore();

  const slide = SLIDES[current];
  const isLast = current === SLIDES.length - 1;

  const goTo = (index: number) => {
    if (transitioning || index === current) return;
    setTransitioning(true);
    setTimeout(() => {
      setCurrent(index);
      setWordKey((k) => k + 1);
      setTransitioning(false);
    }, 350);
  };

  const goNext = () => {
    if (isLast) {
      handleEnter();
      return;
    }
    goTo(current + 1);
  };

  const handleEnter = () => {
    completeOnboarding();
    navigate('/chat', { replace: true });
  };

  // Auto-advance
  useEffect(() => {
    if (isLast) return;
    timerRef.current = setTimeout(goNext, AUTO_ADVANCE_MS);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [current, isLast]);

  // Reset timer on manual nav
  const handleDotClick = (i: number) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    goTo(i);
  };

  return (
    <div
      className="relative flex flex-col min-h-screen overflow-hidden"
      style={{
        background: slide.gradient,
        transition: 'background 0.8s ease',
        fontFamily: "'Inter', sans-serif",
      }}
    >
      {/* Noise/grain overlay for texture */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ opacity: 0.025, backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\'/%3E%3C/svg%3E")', backgroundRepeat: 'repeat', backgroundSize: '256px' }}
      />

      {/* Top bar */}
      <div className="relative flex items-center justify-between px-8 py-6 z-10">
        <div className="flex items-center gap-2">
          <div
            className="w-6 h-6 rounded flex items-center justify-center text-xs font-bold"
            style={{ backgroundColor: 'var(--vzir-gold)', color: 'var(--vzir-bg)' }}
          >
            V
          </div>
          <span className="text-sm tracking-widest uppercase" style={{ color: 'var(--vzir-text)', fontWeight: 500 }}>
            Vzir
          </span>
        </div>

        <button
          onClick={handleEnter}
          className="text-sm transition-colors px-4 py-1.5 rounded-lg"
          style={{ color: 'rgba(255,255,255,0.35)' }}
          onMouseEnter={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.7)')}
          onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.35)')}
        >
          Skip
        </button>
      </div>

      {/* Main content */}
      <div className="relative flex-1 flex flex-col lg:flex-row items-center z-10 px-8 lg:px-20 pb-8">

        {/* Left: Text */}
        <div
          className="flex-1 flex flex-col justify-center max-w-xl"
          style={{ opacity: transitioning ? 0 : 1, transform: transitioning ? 'translateY(12px)' : 'translateY(0)', transition: 'opacity 0.35s ease, transform 0.35s ease' }}
        >
          {/* Slide counter */}
          <p
            className="text-xs mb-8 tracking-widest uppercase"
            style={{ color: slide.accent, opacity: 0.7 }}
          >
            {String(current + 1).padStart(2, '0')} / {String(SLIDES.length).padStart(2, '0')}
          </p>

          {/* Animated headline */}
          <h1
            className="mb-6"
            style={{ lineHeight: 1.05 }}
          >
            {slide.words.map((line, li) => (
              <div key={li} className="overflow-hidden">
                <AnimatedLine
                  text={line}
                  slideKey={wordKey}
                  lineIndex={li}
                  accent={slide.accent}
                />
              </div>
            ))}
          </h1>

          {/* Subtitle */}
          <p
            className="text-base leading-relaxed mb-10 max-w-md"
            style={{
              color: 'rgba(255,255,255,0.55)',
              animation: 'vzir-fade-up 0.7s ease 0.5s both',
            }}
          >
            {slide.sub}
          </p>

          {/* CTA */}
          <div className="flex items-center gap-4">
            <button
              onClick={goNext}
              className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition-all"
              style={{
                backgroundColor: slide.accent,
                color: '#0C0A08',
                boxShadow: `0 0 24px ${slide.accent}40`,
                animation: 'vzir-fade-up 0.7s ease 0.65s both',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = `0 4px 32px ${slide.accent}60`; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = `0 0 24px ${slide.accent}40`; }}
            >
              {isLast ? (
                <>Enter Vzir <ArrowRight size={15} /></>
              ) : (
                <>Next <ChevronRight size={15} /></>
              )}
            </button>
          </div>
        </div>

        {/* Right: Visual */}
        <div
          className="hidden lg:flex flex-1 items-center justify-center"
          style={{ opacity: transitioning ? 0 : 1, transition: 'opacity 0.35s ease 0.1s' }}
        >
          <div className="w-[400px] h-[400px] flex items-center justify-center">
            {slide.visual}
          </div>
        </div>
      </div>

      {/* Bottom: Progress dots + progress bar */}
      <div className="relative z-10 flex flex-col items-center pb-10 gap-4">
        {/* Progress bar */}
        <div className="w-48 h-0.5 rounded-full overflow-hidden" style={{ backgroundColor: 'rgba(255,255,255,0.08)' }}>
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${((current + 1) / SLIDES.length) * 100}%`, backgroundColor: slide.accent }}
          />
        </div>

        {/* Dots */}
        <div className="flex items-center gap-2">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => handleDotClick(i)}
              className="rounded-full transition-all duration-300"
              style={{
                width: i === current ? '24px' : '6px',
                height: '6px',
                backgroundColor: i === current ? slide.accent : 'rgba(255,255,255,0.15)',
              }}
            />
          ))}
        </div>
      </div>

      <style>{`
        @keyframes vzir-word-in {
          from { opacity: 0; transform: translateY(100%); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes vzir-fade-up {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes vzir-pulse-ring {
          0%   { transform: scale(1);   opacity: 0.6; }
          100% { transform: scale(2.2); opacity: 0; }
        }
        @keyframes vzir-bar-grow {
          from { transform: scaleY(0); }
          to   { transform: scaleY(1); }
        }
        @keyframes vzir-bubble-in {
          from { opacity: 0; transform: translateX(-20px) scale(0.92); }
          to   { opacity: 1; transform: translateX(0) scale(1); }
        }
        @keyframes vzir-node-pulse {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50%       { opacity: 1;   transform: scale(1.15); }
        }
        @keyframes vzir-line-draw {
          from { stroke-dashoffset: 200; }
          to   { stroke-dashoffset: 0; }
        }
        @keyframes vzir-float {
          0%, 100% { transform: translateY(0); }
          50%       { transform: translateY(-8px); }
        }
      `}</style>
    </div>
  );
}

/* ─── Word-by-word animated line ────────────────────────────────── */
function AnimatedLine({ text, slideKey, lineIndex, accent }: { text: string; slideKey: number; lineIndex: number; accent: string }) {
  const words = text.split(' ');
  const baseDelay = lineIndex * 0.25;

  return (
    <div className="flex flex-wrap gap-x-4">
      {words.map((word, wi) => (
        <span
          key={`${slideKey}-${lineIndex}-${wi}`}
          style={{
            display: 'inline-block',
            fontSize: 'clamp(2.8rem, 6vw, 5rem)',
            fontWeight: 800,
            letterSpacing: '-0.03em',
            color: wi === 0 && lineIndex === 0 ? '#FFFFFF' : accent,
            animation: 'vzir-word-in 0.55s cubic-bezier(0.22, 1, 0.36, 1) both',
            animationDelay: `${baseDelay + wi * 0.12}s`,
          }}
        >
          {word}
        </span>
      ))}
    </div>
  );
}

/* ─── Slide visuals ──────────────────────────────────────────────── */

function VisualRings() {
  return (
    <div className="relative flex items-center justify-center w-full h-full">
      {[0, 1, 2, 3].map((i) => (
        <div
          key={i}
          className="absolute rounded-full border"
          style={{
            width: `${120 + i * 80}px`,
            height: `${120 + i * 80}px`,
            borderColor: 'rgba(201,169,110,0.15)',
            animation: `vzir-pulse-ring ${2 + i * 0.6}s ease-out ${i * 0.4}s infinite`,
          }}
        />
      ))}
      <div
        className="relative z-10 w-24 h-24 rounded-2xl flex items-center justify-center text-5xl font-black"
        style={{
          backgroundColor: 'rgba(201,169,110,0.1)',
          border: '1px solid rgba(201,169,110,0.3)',
          color: '#C9A96E',
          animation: 'vzir-float 3s ease-in-out infinite',
          boxShadow: '0 0 60px rgba(201,169,110,0.2)',
        }}
      >
        V
      </div>
    </div>
  );
}

function VisualNetwork() {
  const nodes = [
    { label: 'PMS', x: 50, y: 15, color: '#4F8EFF' },
    { label: 'Xero', x: 85, y: 42, color: '#4F8EFF' },
    { label: 'WA', x: 70, y: 80, color: '#4F8EFF' },
    { label: 'Events', x: 25, y: 78, color: '#4F8EFF' },
    { label: 'CRM', x: 10, y: 42, color: '#4F8EFF' },
  ];
  const cx = 50; const cy = 50;

  return (
    <div className="relative w-full h-full">
      <svg viewBox="0 0 100 100" className="w-full h-full">
        {nodes.map((n, i) => (
          <line
            key={i}
            x1={cx} y1={cy} x2={n.x} y2={n.y}
            stroke="rgba(79,142,255,0.25)"
            strokeWidth="0.4"
            strokeDasharray="200"
            style={{
              animation: `vzir-line-draw 1.2s ease ${i * 0.15 + 0.3}s both`,
            }}
          />
        ))}
        {/* Centre Vzir node */}
        <circle cx={cx} cy={cy} r="8" fill="rgba(79,142,255,0.15)" stroke="rgba(79,142,255,0.5)" strokeWidth="0.5" />
        <text x={cx} y={cy + 1.5} textAnchor="middle" fontSize="4" fill="#4F8EFF" fontWeight="800">V</text>
        {/* Outer nodes */}
        {nodes.map((n, i) => (
          <g key={i} style={{ animation: `vzir-node-pulse ${1.5 + i * 0.3}s ease-in-out ${i * 0.2}s infinite` }}>
            <circle cx={n.x} cy={n.y} r="6" fill="rgba(79,142,255,0.1)" stroke="rgba(79,142,255,0.35)" strokeWidth="0.4" />
            <text x={n.x} y={n.y + 1.8} textAnchor="middle" fontSize="3" fill="#4F8EFF">{n.label}</text>
          </g>
        ))}
      </svg>
    </div>
  );
}

function VisualWhatsApp() {
  const bubbles = [
    { text: 'Welcome to The Grand Meridian, James! 🏨', delay: '0.2s', right: false },
    { text: 'Could I get an extra towel?', delay: '0.8s', right: true },
    { text: 'Of course! On its way in 10 minutes ✓', delay: '1.4s', right: false },
    { text: 'Thank you for staying! Leave us a review?', delay: '2.0s', right: false },
  ];

  return (
    <div className="flex flex-col gap-3 w-full max-w-xs mx-auto px-4 pt-8">
      {bubbles.map((b, i) => (
        <div key={i} className={`flex ${b.right ? 'justify-end' : 'justify-start'}`}>
          <div
            className="px-4 py-2.5 rounded-2xl text-xs max-w-[80%] leading-relaxed"
            style={{
              backgroundColor: b.right ? 'rgba(255,140,50,0.25)' : 'rgba(255,255,255,0.08)',
              border: `1px solid ${b.right ? 'rgba(255,140,50,0.3)' : 'rgba(255,255,255,0.1)'}`,
              color: 'rgba(255,255,255,0.85)',
              animation: `vzir-bubble-in 0.5s ease ${b.delay} both`,
              borderRadius: b.right ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
            }}
          >
            {b.text}
          </div>
        </div>
      ))}
    </div>
  );
}

function VisualChart() {
  const bars = [
    { h: 40, delay: '0.1s' }, { h: 65, delay: '0.2s' },
    { h: 50, delay: '0.3s' }, { h: 85, delay: '0.4s' },
    { h: 55, delay: '0.5s' }, { h: 95, delay: '0.6s' },
    { h: 70, delay: '0.7s' },
  ];

  return (
    <div className="flex flex-col items-center justify-end w-full h-64 gap-2 px-8">
      {/* Event pin */}
      <div
        className="self-end mr-16 mb-2 px-2 py-1 rounded text-xs"
        style={{ backgroundColor: 'rgba(138,79,255,0.2)', color: '#8A4FFF', border: '1px solid rgba(138,79,255,0.3)', animation: 'vzir-fade-up 0.5s ease 1.2s both' }}
      >
        🎵 Festival nearby
      </div>
      <div className="flex items-end gap-2 w-full h-48">
        {bars.map((b, i) => (
          <div key={i} className="flex-1 rounded-t-lg" style={{
            height: `${b.h}%`,
            background: i === 5 ? 'linear-gradient(180deg, #8A4FFF, rgba(138,79,255,0.4))' : 'rgba(138,79,255,0.25)',
            border: '1px solid rgba(138,79,255,0.3)',
            transformOrigin: 'bottom',
            animation: `vzir-bar-grow 0.6s cubic-bezier(0.34,1.56,0.64,1) ${b.delay} both`,
          }} />
        ))}
      </div>
      <div className="flex gap-2 w-full">
        {['M','T','W','T','F','S','S'].map((d, i) => (
          <p key={i} className="flex-1 text-center" style={{ fontSize: '10px', color: 'rgba(255,255,255,0.25)' }}>{d}</p>
        ))}
      </div>
    </div>
  );
}

function VisualGrid() {
  const rooms = Array.from({ length: 15 }, (_, i) => ({
    status: i === 2 ? 'gold' : i === 7 ? 'green' : i === 11 ? 'gold' : i % 4 === 0 ? 'empty' : 'occupied',
    delay: `${i * 0.05}s`,
  }));

  const colorsMap: Record<string, string> = {
    occupied: 'rgba(34,197,100,0.2)',
    gold: 'rgba(201,169,110,0.35)',
    empty: 'rgba(255,255,255,0.05)',
    green: 'rgba(34,197,100,0.5)',
  };
  const borderMap: Record<string, string> = {
    occupied: 'rgba(34,197,100,0.3)',
    gold: 'rgba(201,169,110,0.5)',
    empty: 'rgba(255,255,255,0.08)',
    green: 'rgba(34,197,100,0.6)',
  };

  return (
    <div className="flex flex-col gap-3 items-center">
      <div className="grid grid-cols-5 gap-2">
        {rooms.map((r, i) => (
          <div
            key={i}
            className="w-12 h-10 rounded-lg flex items-center justify-center text-xs"
            style={{
              backgroundColor: colorsMap[r.status],
              border: `1px solid ${borderMap[r.status]}`,
              color: r.status === 'gold' ? '#C9A96E' : r.status === 'green' ? '#22C564' : 'rgba(255,255,255,0.2)',
              fontWeight: 500,
              fontSize: '10px',
              animation: `vzir-fade-up 0.4s ease ${r.delay} both`,
            }}
          >
            {String(101 + i)}
          </div>
        ))}
      </div>
      <div className="flex gap-4 mt-2">
        {[{ c: 'rgba(34,197,100,0.5)', l: 'Occupied' }, { c: 'rgba(201,169,110,0.35)', l: 'Revenue opp.' }, { c: 'rgba(255,255,255,0.06)', l: 'Available' }].map((item) => (
          <div key={item.l} className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: item.c }} />
            <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.35)' }}>{item.l}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function VisualFinal() {
  return (
    <div className="flex flex-col items-center justify-center gap-6">
      <div
        className="w-32 h-32 rounded-3xl flex items-center justify-center text-7xl font-black"
        style={{
          background: 'linear-gradient(135deg, rgba(201,169,110,0.25), rgba(201,169,110,0.08))',
          border: '1px solid rgba(201,169,110,0.3)',
          color: '#C9A96E',
          boxShadow: '0 0 80px rgba(201,169,110,0.15)',
          animation: 'vzir-float 3s ease-in-out infinite',
        }}
      >
        V
      </div>
      <div className="flex flex-col items-center gap-2">
        {['AI Intelligence', 'Guest Communication', 'Demand Forecasting', 'Operations'].map((f, i) => (
          <div
            key={f}
            className="flex items-center gap-2 px-4 py-2 rounded-full text-xs"
            style={{
              backgroundColor: 'rgba(201,169,110,0.08)',
              border: '1px solid rgba(201,169,110,0.15)',
              color: 'rgba(201,169,110,0.7)',
              animation: `vzir-fade-up 0.5s ease ${0.2 + i * 0.1}s both`,
            }}
          >
            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: '#C9A96E' }} />
            {f}
          </div>
        ))}
      </div>
    </div>
  );
}
