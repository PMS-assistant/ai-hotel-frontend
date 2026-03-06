import { useState, useEffect, useCallback } from 'react';
import { apiClient } from '../lib/axios';
import {
  mockRoomStatus,
  mockArrivals,
  mockDepartures,
  type RoomStatusData,
} from '../lib/mockData';

interface ArrivalData {
  name: string;
  room: string;
  time: string;
  type: string;
  nights: number;
}

interface DepartureData {
  name: string;
  room: string;
  time: string;
  nights: number;
}

interface RoomData {
  room: string;
  floor: number;
  status: 'occupied' | 'available' | 'checkout' | 'maintenance';
  guestName?: string;
  checkIn?: string;
  checkOut?: string;
  nights?: number;
}

interface OperationsData {
  rooms: RoomData[];
  arrivals: ArrivalData[];
  departures: DepartureData[];
}

interface UseOperationsReturn {
  data: OperationsData | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
  updateRoomStatus: (roomNumber: string, status: string) => Promise<void>;
}

const hasApiBaseUrl = !!import.meta.env.VITE_API_BASE_URL;

export function useOperations(): UseOperationsReturn {
  const [data, setData] = useState<OperationsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      if (hasApiBaseUrl) {
        const { data: apiData } = await apiClient.get<OperationsData>('/operations/summary');
        setData(apiData);
      } else {
        await new Promise<void>((r) => setTimeout(r, 600));
        setData({
          rooms: mockRoomStatus as RoomData[],
          arrivals: mockArrivals,
          departures: mockDepartures,
        });
      }
    } catch {
      setError('Failed to load operations data.');
      setData({
        rooms: mockRoomStatus as RoomData[],
        arrivals: mockArrivals,
        departures: mockDepartures,
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateRoomStatus = useCallback(async (roomNumber: string, status: string) => {
    if (hasApiBaseUrl) {
      await apiClient.patch(`/operations/rooms/${roomNumber}`, { status });
    }
    setData((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        rooms: prev.rooms.map((r) =>
          r.room === roomNumber
            ? {
                ...r,
                status: status as RoomData['status'],
                ...(status === 'available' ? { guestName: undefined, checkIn: undefined, checkOut: undefined, nights: undefined } : {}),
              }
            : r
        ),
      };
    });
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, isLoading, error, refetch: fetchData, updateRoomStatus };
}
