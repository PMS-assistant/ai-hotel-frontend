import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router';
import { Toaster } from 'sonner';
import { Sidebar } from './Sidebar';
import { useUserStore } from '../../stores/useUserStore';

export function Root() {
  const { isAuthenticated } = useUserStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) return null;

  return (
    <div
      className="flex h-screen overflow-hidden"
      style={{ backgroundColor: 'var(--vzir-bg)', fontFamily: "'Inter', sans-serif" }}
    >
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Outlet />
      </div>
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: 'var(--vzir-surface-2)',
            border: '1px solid var(--vzir-border)',
            color: 'var(--vzir-text)',
            fontFamily: "'Inter', sans-serif",
          },
        }}
      />
    </div>
  );
}
