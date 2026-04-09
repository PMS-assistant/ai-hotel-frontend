import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router';
import { toast, Toaster } from 'sonner';
import { Loader2 } from 'lucide-react';
import { useUserStore, type Role } from '../stores/useUserStore';
import { apiClient } from '../lib/axios';

const QUOTES = [
  {
    text: 'Intelligence that checks in before your guests do.',
    sub: 'Know every arrival before the front desk opens.',
  },
  {
    text: 'Every question answered. Every number explained.',
    sub: 'Your hotel data, finally speaking your language.',
  },
  {
    text: 'From front desk to forecast — one conversation.',
    sub: 'Connect your PMS, Xero, and WhatsApp in minutes.',
  },
  {
    text: "Know tomorrow\u2019s demand. Today.",
    sub: 'Events, weather, and booking pace — combined.',
  },
  {
    text: 'Hotels run on data. Vzir makes it think.',
    sub: 'AI-powered operations for the modern property.',
  },
  {
    text: 'The future of hospitality is conversational.',
    sub: 'Ask anything. Get an answer in seconds.',
  },
];

export default function LoginPage() {
  const { login, setAuthFromApi } = useUserStore();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [quoteVisible, setQuoteVisible] = useState(true);

  // Rotate quotes every 5 seconds with fade
  useEffect(() => {
    const timer = setInterval(() => {
      setQuoteVisible(false);
      setTimeout(() => {
        setQuoteIndex((i) => (i + 1) % QUOTES.length);
        setQuoteVisible(true);
      }, 400);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error('Email is required');
      return;
    }
    setIsLoading(true);
    try {
      const hasApi = !!import.meta.env.VITE_API_BASE_URL;
      if (hasApi) {
        const { data: res } = await apiClient.post<{
          user: { id: string; email: string; role: Role; hotelId: string };
          token: string;
        }>('/auth/login', { email: email.trim(), password });
        useUserStore.getState().setAuthFromApi(res.user, res.token);
      } else {
        await new Promise<void>((r) => setTimeout(r, 800));
        login(email.trim(), 'owner');
      }
      navigate('/chat', { replace: true });
    } catch {
      toast.error('Invalid credentials. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const quote = QUOTES[quoteIndex];

  return (
    <div
      className="min-h-screen flex"
      style={{ backgroundColor: 'var(--vzir-bg)', fontFamily: "'Inter', sans-serif" }}
    >
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: 'var(--vzir-surface-2)',
            border: '1px solid var(--vzir-border)',
            color: 'var(--vzir-text)',
          },
        }}
      />

      {/* ── Left panel: rotating brand quotes ── */}
      <div
        className="hidden lg:flex flex-col flex-1 relative overflow-hidden px-16 py-14"
        style={{ backgroundColor: 'var(--vzir-surface)' }}
      >
        {/* Subtle gold grain texture overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse at 30% 50%, rgba(201,169,110,0.06) 0%, transparent 65%)',
          }}
        />

        {/* Top: Vzir wordmark */}
        <div className="relative flex items-center gap-2.5">
          <div
            className="w-7 h-7 rounded-md flex items-center justify-center text-xs font-bold"
            style={{ backgroundColor: 'var(--vzir-gold)', color: 'var(--vzir-bg)' }}
          >
            V
          </div>
          <span
            className="text-base tracking-[0.12em] uppercase"
            style={{ color: 'var(--vzir-text)', fontWeight: 500, letterSpacing: '0.12em' }}
          >
            Vzir
          </span>
        </div>

        {/* Center: quote */}
        <div className="relative flex-1 flex flex-col justify-center max-w-lg">
          <div
            className="mb-8 w-10 h-px"
            style={{ backgroundColor: 'var(--vzir-gold)', opacity: 0.6 }}
          />
          <blockquote
            className="text-3xl leading-snug mb-4 transition-all duration-400"
            style={{
              color: 'var(--vzir-text)',
              fontWeight: 300,
              letterSpacing: '-0.01em',
              opacity: quoteVisible ? 1 : 0,
              transform: quoteVisible ? 'translateY(0)' : 'translateY(6px)',
              transition: 'opacity 0.4s ease, transform 0.4s ease',
            }}
          >
            "{quote.text}"
          </blockquote>
          <p
            className="text-sm"
            style={{
              color: 'var(--vzir-text-2)',
              opacity: quoteVisible ? 1 : 0,
              transition: 'opacity 0.4s ease 0.1s',
            }}
          >
            {quote.sub}
          </p>

          {/* Quote dots */}
          <div className="flex gap-1.5 mt-10">
            {QUOTES.map((_, i) => (
              <div
                key={i}
                className="rounded-full transition-all duration-300"
                style={{
                  width: i === quoteIndex ? '20px' : '6px',
                  height: '6px',
                  backgroundColor:
                    i === quoteIndex ? 'var(--vzir-gold)' : 'var(--vzir-border-hover)',
                }}
              />
            ))}
          </div>
        </div>

        {/* Bottom tag */}
        <p className="relative text-xs tracking-widest uppercase" style={{ color: 'var(--vzir-text-3)' }}>
          AI Hotel Intelligence Platform
        </p>
      </div>

      {/* ── Right panel: sign-in form ── */}
      <div
        className="flex flex-col items-center justify-center w-full lg:w-[480px] shrink-0 px-8 py-12"
        style={{ backgroundColor: 'var(--vzir-bg)' }}
      >
        {/* Mobile logo */}
        <div className="flex items-center gap-2.5 mb-10 lg:hidden">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold"
            style={{ backgroundColor: 'var(--vzir-gold)', color: 'var(--vzir-bg)' }}
          >
            V
          </div>
          <span
            className="text-base tracking-widest uppercase"
            style={{ color: 'var(--vzir-text)', fontWeight: 500 }}
          >
            Vzir
          </span>
        </div>

        <div className="w-full max-w-sm">
          <h1
            className="text-2xl mb-1"
            style={{ color: 'var(--vzir-text)', fontWeight: 300, letterSpacing: '-0.02em' }}
          >
            Welcome back
          </h1>
          <p className="text-sm mb-8" style={{ color: 'var(--vzir-text-2)' }}>
            Sign in to your Vzir account
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            {/* Email */}
            <div>
              <label
                className="block text-xs mb-2 tracking-wide uppercase"
                style={{ color: 'var(--vzir-text-3)', fontWeight: 500, letterSpacing: '0.06em' }}
              >
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@hotel.com"
                autoComplete="email"
                className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
                style={{
                  backgroundColor: 'var(--vzir-surface)',
                  border: '1px solid var(--vzir-border)',
                  color: 'var(--vzir-text)',
                }}
                onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--vzir-gold-dim)')}
                onBlur={(e) => (e.currentTarget.style.borderColor = 'var(--vzir-border)')}
              />
            </div>

            {/* Password */}
            <div>
              <label
                className="block text-xs mb-2 tracking-wide uppercase"
                style={{ color: 'var(--vzir-text-3)', fontWeight: 500, letterSpacing: '0.06em' }}
              >
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
                className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
                style={{
                  backgroundColor: 'var(--vzir-surface)',
                  border: '1px solid var(--vzir-border)',
                  color: 'var(--vzir-text)',
                }}
                onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--vzir-gold-dim)')}
                onBlur={(e) => (e.currentTarget.style.borderColor = 'var(--vzir-border)')}
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm transition-all mt-2 disabled:opacity-50"
              style={{
                backgroundColor: 'var(--vzir-gold)',
                color: 'var(--vzir-bg)',
                fontWeight: 600,
                letterSpacing: '0.02em',
              }}
            >
              {isLoading ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  Signing in…
                </>
              ) : (
                'Sign in'
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px" style={{ backgroundColor: 'var(--vzir-border)' }} />
            <span className="text-xs" style={{ color: 'var(--vzir-text-3)' }}>
              or
            </span>
            <div className="flex-1 h-px" style={{ backgroundColor: 'var(--vzir-border)' }} />
          </div>

          <p className="text-center text-sm" style={{ color: 'var(--vzir-text-2)' }}>
            New to Vzir?{' '}
            <Link
              to="/signup"
              className="transition-colors"
              style={{ color: 'var(--vzir-gold)', fontWeight: 500 }}
            >
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
