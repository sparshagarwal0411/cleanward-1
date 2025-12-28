import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Ward } from '@/types';
import { wards as mockWards } from '@/data/wards';

interface PollutionStation {
  id: number;
  name: string;
  city: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  pm25: number;
  unit: string;
}

interface WardPollutionData {
  id: number;
  zone: string;
  pm25: number;
  aqi: number;
  pollutionScore: number;
  lastUpdated: string;
}

interface PollutionResponse {
  success: boolean;
  timestamp: string;
  stationsCount: number;
  avgPM25: string;
  stations: PollutionStation[];
  wards: WardPollutionData[];
  error?: string;
}

export function usePollutionData() {
  const [wards, setWards] = useState<Ward[]>(mockWards);
  const [stations, setStations] = useState<PollutionStation[]>([]);
  const [avgPM25, setAvgPM25] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUsingRealData, setIsUsingRealData] = useState(false);

  useEffect(() => {
    fetchPollutionData();
  }, []);

  const fetchPollutionData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      console.log('Fetching real pollution data from OpenAQ...');
      
      const { data, error: funcError } = await supabase.functions.invoke('fetch-pollution-data');

      if (funcError) {
        console.error('Edge function error:', funcError);
        throw new Error(funcError.message);
      }

      const response = data as PollutionResponse;

      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch pollution data');
      }

      console.log(`Received data from ${response.stationsCount} stations, avg PM2.5: ${response.avgPM25}`);

      // Merge real pollution data with mock ward data
      const updatedWards = mockWards.map(mockWard => {
        const realData = response.wards.find(w => w.id === mockWard.id);
        if (realData) {
          // Convert AQI-based score (0-500, higher is worse) to our score system (0-100, higher is better)
          // Good AQI (0-50) = Score 80-100
          // Moderate AQI (51-100) = Score 60-79
          // Unhealthy for Sensitive (101-150) = Score 40-59
          // Unhealthy (151-200) = Score 20-39
          // Very Unhealthy/Hazardous (201+) = Score 0-19
          const aqiToScore = (aqi: number): number => {
            if (aqi <= 50) return 100 - Math.round((aqi / 50) * 20); // 80-100
            if (aqi <= 100) return 80 - Math.round(((aqi - 50) / 50) * 20); // 60-79
            if (aqi <= 150) return 60 - Math.round(((aqi - 100) / 50) * 20); // 40-59
            if (aqi <= 200) return 40 - Math.round(((aqi - 150) / 50) * 20); // 20-39
            return Math.max(1, 20 - Math.round(((aqi - 200) / 300) * 20)); // 1-19
          };

          return {
            ...mockWard,
            pollutionScore: aqiToScore(realData.aqi),
            airQuality: aqiToScore(realData.aqi),
            zone: realData.zone || mockWard.zone,
          };
        }
        return mockWard;
      });

      setWards(updatedWards);
      setStations(response.stations);
      setAvgPM25(response.avgPM25);
      setLastUpdated(response.timestamp);
      setIsUsingRealData(true);
    } catch (err) {
      console.error('Failed to fetch real pollution data, using mock data:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch pollution data');
      setWards(mockWards);
      setIsUsingRealData(false);
    } finally {
      setIsLoading(false);
    }
  };

  const refetch = () => {
    fetchPollutionData();
  };

  return {
    wards,
    stations,
    avgPM25,
    lastUpdated,
    isLoading,
    error,
    isUsingRealData,
    refetch,
  };
}
