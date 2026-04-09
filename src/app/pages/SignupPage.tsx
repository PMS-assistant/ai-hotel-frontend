import { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { toast, Toaster } from 'sonner';
import { Loader2 } from 'lucide-react';
import { useUserStore } from '../stores/useUserStore';
import { apiClient } from '../lib/axios';

export default function SignupPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [hotelName, setHotelName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !hotelName.trim()) {
      toast.error('Email and hotel name are required');
      return;
    }
    if (!password) {
      toast.error('Password is required');
      return;
    }
    setIsLoading(true);
    try {
      const hasApi = !!import.meta.env.VITE_API_BASE_URL;
      if (hasApi) {
        const { data: res } = await apiClient.post<{
          user: { id: string; email: string; role: 'owner'; hotelId: string };
          token: string;
        }>('/auth/signup', { email: email.trim(), password, hotel_name: hotelName.trim() });
        useUserStore.getState().setAuthFromApi(res.user, res.token);
      } else {
        await new Promise<void>((r) => setTimeout(r, 800));
        useUserStore.getState().login(email.trim(), 'owner');
      }
      navigate('/onboarding', { replace: true });
    } catch (err: any) {
      if (err?.response?.status === 409) {
        toast.error('Email already registered');
      } else {
        toast.error('Could not create account. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const inputCls = 'w-full px-4 py-3 rounded-xl text-sm outline-none transition-all';
  const inputStyle: React.CSSProperties = {
    backgroundColor: 'var(--vzir-surface)',
    border: '1px solid var(--vzir-border)',
    color: 'var(--vzir-text)',
  };
  const focusIn = (e: React.FocusEvent<HTMLInputElement>) =>
    (e.currentTarget.style.borderColor = 'var(--vzir-gold-dim)');
  const focusOut = (e: React.FocusEvent<HTMLInputElement>) =>
    (e.currentTarget.style.borderColor = 'var(--vzir-border)');
  const labelStyle: React.CSSProperties = {
    color: 'var(--vzir-text-3)',
    fontWeight: 500,
    letterSpacing: '0.06em',
  };

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

      {/* Left panel */}
      <div
        className="hidden lg:flex flex-col flex-1 relative overflow-hidden px-16 py-14"
        style={{ backgroundColor: 'var(--vzir-surface)' }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at 30% 50%, rgba(201,169,110,0.06) 0%, transparent 65%)',
          }}
        />
        <div className="relative flex items-center gap-2.5">
          <div
            className="w-7 h-7 rounded-md flex items-center justify-center text-xs font-bold"
            style={{ backgroundColor: 'var(--vzir-gold)', color: 'var(--vzir-bg)' }}
          >
            V
          </div>
          <span
            className="text-base tracking-[0.12em] uppercase"
            style={{ color: 'var(--vzir-text)', fontWeight: 500 }}
          >
            Vzir
          </span>
        </div>

        <div className="relative flex-1 flex flex-col justify-center max-w-lg">
          <div className="mb-8 w-10 h-px" style={{ backgroundColor: 'var(--vzir-gold)', opacity: 0.6 }} />
          <h2
            className="text-3xl leading-snug mb-4"
            style={{ color: 'var(--vzir-text)', fontWeight: 300, letterSpacing: '-0.01em' }}
          >
            "Your hotel's intelligence layer starts here."
          </h2>
          <p className="text-sm" style={{ color: 'var(--vzir-text-2)' }}>
            Connect your PMS, accounting, and guest communication tools. Let the AI do the rest.
          </p>
          <div className="mt-12 space-y-4">
            {[
              'Connect any PMS — Cloudbeds, Opera, Muse',
              'Guest communication via WhatsApp',
              'Event-driven demand forecasting',
            ].map((f) => (
              <div key={f} className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: 'var(--vzir-gold)' }} />
                <span className="text-sm" style={{ color: 'var(--vzir-text-2)' }}>{f}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="relative text-xs tracking-widest uppercase" style={{ color: 'var(--vzir-text-3)' }}>
          AI Hotel Intelligence Platform
        </p>
      </div>

      {/* Right panel */}
      <div
        className="flex flex-col items-center justify-center w-full lg:w-[480px] shrink-0 px-8 py-12"
        style={{ backgroundColor: 'var(--vzir-bg)' }}
      >
        <div className="flex items-center gap-2.5 mb-10 lg:hidden">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold"
            style={{ backgroundColor: 'var(--vzir-gold)', color: 'var(--vzir-bg)' }}
          >
            V
          </div>
          <span className="text-base tracking-widest uppercase" style={{ color: 'var(--vzir-text)', fontWeight: 500 }}>
            Vzir
          </span>
        </div>

        <div className="w-full max-w-sm">
          <h1
            className="text-2xl mb-1"
            style={{ color: 'var(--vzir-text)', fontWeight: 300, letterSpacing: '-0.02em' }}
          >
            Create your account
          </h1>
          <p className="text-sm mb-8" style={{ color: 'var(--vzir-text-2)' }}>
            Set up Vzir for your property
          </p>

          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <label className="block text-xs mb-2 tracking-wide uppercase" style={labelStyle}>
                Hotel name
              </label>
              <input
                type="text"
                value={hotelName}
                onChange={(e) => setHotelName(e.target.value)}
                placeholder="The Grand Meridian"
                className={inputCls}
                style={inputStyle}
                onFocus={focusIn}
                onBlur={focusOut}
              />
            </div>
            <div>
              <label className="block text-xs mb-2 tracking-wide uppercase" style={labelStyle}>
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@hotel.com"
                autoComplete="email"
                className={inputCls}
                style={inputStyle}
                onFocus={focusIn}
                onBlur={focusOut}
              />
            </div>
            <div>
              <label className="block text-xs mb-2 tracking-wide uppercase" style={labelStyle}>
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="new-password"
                className={inputCls}
                style={inputStyle}
                onFocus={focusIn}
                onBlur={focusOut}
              />
            </div>

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
                <><Loader2 size={14} className="animate-spin" />Creating account…</>
              ) : (
                'Get started'
              )}
            </button>
          </form>

          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px" style={{ backgroundColor: 'var(--vzir-border)' }} />
            <span className="text-xs" style={{ color: 'var(--vzir-text-3)' }}>or</span>
            <div className="flex-1 h-px" style={{ backgroundColor: 'var(--vzir-border)' }} />
          </div>

          <p className="text-center text-sm" style={{ color: 'var(--vzir-text-2)' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: 'var(--vzir-gold)', fontWeight: 500 }}>
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
