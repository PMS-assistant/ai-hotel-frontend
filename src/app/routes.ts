import { createBrowserRouter, redirect } from 'react-router';
import { Root } from './components/layout/Root';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import OnboardingPage from './pages/OnboardingPage';
import ChatPage from './pages/ChatPage';
import DashboardPage from './pages/DashboardPage';
import IntegrationsPage from './pages/IntegrationsPage';
import StaffPage from './pages/StaffPage';
import NotFoundPage from './pages/NotFoundPage';
import SettingsPage from './pages/SettingsPage';
import HomePage from './pages/HomePage';

export const router = createBrowserRouter([
  { path: '/login',     Component: LoginPage },
  { path: '/signup',    Component: SignupPage },
  { path: '/onboarding', Component: OnboardingPage },
  {
    path: '/',
    Component: Root,
    children: [
      { index: true,          loader: () => redirect('/home') },
      { path: 'home',         Component: HomePage },
      { path: 'chat',         Component: ChatPage },
      { path: 'dashboard',    Component: DashboardPage },
      { path: 'integrations', Component: IntegrationsPage },
      { path: 'operations',   Component: StaffPage },
      { path: 'settings',     Component: SettingsPage },
      // Legacy redirects
      { path: 'connect',      loader: () => redirect('/integrations') },
      { path: 'staff',        loader: () => redirect('/operations') },
      { path: 'alerts',       loader: () => redirect('/dashboard') },
      { path: 'guests',       loader: () => redirect('/chat') },
      { path: 'forecasting',  loader: () => redirect('/chat') },
      { path: '*',            Component: NotFoundPage },
    ],
  },
]);
