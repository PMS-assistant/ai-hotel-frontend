import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Role = 'owner' | 'manager' | 'staff';
export type DataHealth = 'healthy' | 'delayed' | 'error';
export type SyncHealth = 'healthy' | 'delayed' | 'error';

export interface OtaChannel {
  id: string;
  name: string;
  connected: boolean;
  lastSyncTime: string | null;
  roomsThisMonth: number | null;
}

const DEFAULT_OTA_CHANNELS: OtaChannel[] = [
  { id: 'booking_com',    name: 'Booking.com',      connected: false, lastSyncTime: null, roomsThisMonth: null },
  { id: 'expedia',        name: 'Expedia',           connected: false, lastSyncTime: null, roomsThisMonth: null },
  { id: 'airbnb',         name: 'Airbnb',            connected: false, lastSyncTime: null, roomsThisMonth: null },
  { id: 'hotels_com',     name: 'Hotels.com',        connected: false, lastSyncTime: null, roomsThisMonth: null },
  { id: 'agoda',          name: 'Agoda',             connected: false, lastSyncTime: null, roomsThisMonth: null },
  { id: 'google_hotels',  name: 'Google Hotel Ads',  connected: false, lastSyncTime: null, roomsThisMonth: null },
];

interface UserState {
  isAuthenticated: boolean;
  onboardingCompleted: boolean;
  userId: string | null;
  email: string | null;
  role: Role;
  hotelName: string;
  hotelId: string;

  // PMS — Guestline / Rezlynx
  pmsConnected: boolean;
  pmsLastSyncTime: string | null;
  pmsDataHealth: DataHealth;

  // PMS — Cloudbeds
  cloudbedsConnected: boolean;
  cloudbedsPropertyId: string | null;
  cloudbedsLastSyncTime: string | null;
  cloudbedsDataHealth: DataHealth;

  // Accounting — Xero
  xeroConnected: boolean;
  xeroOrganisationName: string | null;
  xeroLastSyncTime: string | null;
  xeroSyncHealth: SyncHealth;

  // OTA Channels
  connectedOtas: OtaChannel[];

  // Token
  token: string | null;

  // Actions
  login: (email: string, role: Role) => void;
  setAuthFromApi: (user: { id: string; email: string; role: Role; hotelId: string }, token: string) => void;
  completeOnboarding: () => void;
  logout: () => void;
  setPmsConnected: (connected: boolean, syncTime?: string) => void;
  setPmsDataHealth: (health: DataHealth) => void;
  setCloudbedsConnected: (propertyId: string) => void;
  disconnectCloudbeds: () => void;
  setCloudbedsDataHealth: (health: DataHealth) => void;
  setXeroConnected: (orgName: string) => void;
  disconnectXero: () => void;
  connectOta: (id: string) => void;
  disconnectOta: (id: string) => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      onboardingCompleted: false,
      userId: null,
      email: null,
      role: 'owner',
      hotelName: 'The Grand Meridian',
      hotelId: 'hotel_001',
      token: null,

      pmsConnected: true, // Demo: allow Dashboard/Chat without PMS. Set false when real PMS connected.
      pmsLastSyncTime: null,
      pmsDataHealth: 'healthy',

      cloudbedsConnected: false,
      cloudbedsPropertyId: null,
      cloudbedsLastSyncTime: null,
      cloudbedsDataHealth: 'healthy',

      xeroConnected: false,
      xeroOrganisationName: null,
      xeroLastSyncTime: null,
      xeroSyncHealth: 'healthy',

      connectedOtas: DEFAULT_OTA_CHANNELS,

      login: (email, role) =>
        set({
          isAuthenticated: true,
          userId: `user_${Date.now()}`,
          email,
          role,
        }),

      setAuthFromApi: (user, token) =>
        set({
          isAuthenticated: true,
          userId: user.id,
          email: user.email,
          role: user.role,
          hotelId: user.hotelId,
          token,
          pmsConnected: true,
        }),

      completeOnboarding: () => set({ onboardingCompleted: true }),

      logout: () =>
        set({
          isAuthenticated: false,
          onboardingCompleted: false,
          userId: null,
          email: null,
          token: null,
          pmsConnected: false,
          pmsLastSyncTime: null,
          xeroConnected: false,
          xeroOrganisationName: null,
          xeroLastSyncTime: null,
          connectedOtas: DEFAULT_OTA_CHANNELS,
        }),

      setPmsConnected: (connected, syncTime) =>
        set({
          pmsConnected: connected,
          pmsLastSyncTime: connected ? (syncTime ?? new Date().toISOString()) : null,
        }),

      setPmsDataHealth: (health) => set({ pmsDataHealth: health }),

      setCloudbedsConnected: (propertyId) =>
        set({
          cloudbedsConnected: true,
          cloudbedsPropertyId: propertyId,
          cloudbedsLastSyncTime: new Date().toISOString(),
          cloudbedsDataHealth: 'healthy',
        }),

      disconnectCloudbeds: () =>
        set({
          cloudbedsConnected: false,
          cloudbedsPropertyId: null,
          cloudbedsLastSyncTime: null,
        }),

      setCloudbedsDataHealth: (health) => set({ cloudbedsDataHealth: health }),

      setXeroConnected: (orgName) =>
        set({
          xeroConnected: true,
          xeroOrganisationName: orgName,
          xeroLastSyncTime: new Date().toISOString(),
          xeroSyncHealth: 'healthy',
        }),

      disconnectXero: () =>
        set({
          xeroConnected: false,
          xeroOrganisationName: null,
          xeroLastSyncTime: null,
        }),

      connectOta: (id) =>
        set((state) => ({
          connectedOtas: state.connectedOtas.map((ota) =>
            ota.id === id
              ? {
                  ...ota,
                  connected: true,
                  lastSyncTime: new Date().toISOString(),
                  roomsThisMonth: Math.floor(Math.random() * 180) + 20,
                }
              : ota
          ),
        })),

      disconnectOta: (id) =>
        set((state) => ({
          connectedOtas: state.connectedOtas.map((ota) =>
            ota.id === id
              ? { ...ota, connected: false, lastSyncTime: null, roomsThisMonth: null }
              : ota
          ),
        })),
    }),
    { name: 'vzir-user-store-v1' }
  )
);
