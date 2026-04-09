import { createBrowserRouter, redirect } from 'react-router';
import { Root } from './components/layout/Root';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import OnboardingPage from './pages/OnboardingPage';
import ChatPage from './pages/ChatPage';
import DashboardPage from './pages/DashboardPage';
import IntegrationsPage from './pages/IntegrationsPage';
import StaffPage from './pages/StaffPage';
import AlertsPage from './pages/AlertsPage';
import NotFoundPage from './pages/NotFoundPage';

export const router = createBrowserRouter([
  {
    path: '/login',
    Component: LoginPage,
  },
  {
    path: '/signup',
    Component: SignupPage,
  },
  {
    path: '/onboarding',
    Component: OnboardingPage,
  },
  {
    path: '/',
    Component: Root,
    children: [
      {
        index: true,
        loader: () => redirect('/chat'),
      },
      {
        path: 'chat',
        Component: ChatPage,
      },
      {
        path: 'dashboard',
        Component: DashboardPage,
      },
      {
        path: 'integrations',
        Component: IntegrationsPage,
      },
      {
        path: 'connect',
        loader: () => redirect('/integrations'),
      },
      {
        path: 'operations',
        Component: StaffPage,
      },
      {
        path: 'staff',
        loader: () => redirect('/operations'),
      },
      {
        path: 'alerts',
        Component: AlertsPage,
      },
      {
        // Placeholder pages — redirect to chat until built
        path: 'guests',
        loader: () => redirect('/chat'),
      },
      {
        path: 'forecasting',
        loader: () => redirect('/chat'),
      },
      {
        path: 'settings',
        loader: () => redirect('/chat'),
      },
      {
        path: '*',
        Component: NotFoundPage,
      },
    ],
  },
]);
