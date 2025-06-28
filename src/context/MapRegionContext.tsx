import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Region } from 'react-native-maps';
import AsyncStorage from '@react-native-async-storage/async-storage';

const defaultRegion: Region = {
  latitude: -27.4705,
  longitude: 153.0260,
  latitudeDelta: 0.05,
  longitudeDelta: 0.05,
};

type MapRegionContextType = {
  region: Region;
  setRegion: (region: Region) => void;
};

const MapRegionContext = createContext<MapRegionContextType | undefined>(undefined);

export const MapRegionProvider = ({ children }: { children: ReactNode }) => {
  const [region, setRegionState] = useState<Region>(defaultRegion);

  useEffect(() => {
    const loadRegion = async () => {
      try {
        const saved = await AsyncStorage.getItem('lastMapRegion');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed.latitude && parsed.longitude) {
            setRegionState(parsed);
            console.log('[MapRegion] restored from storage:', parsed);
          }
        }
      } catch (e) {
        console.error('[MapRegion] failed to load from storage:', e);
      }
    };

    loadRegion();
  }, []);

  const setRegion = async (newRegion: Region) => {
    try {
      setRegionState(newRegion);
      await AsyncStorage.setItem('lastMapRegion', JSON.stringify(newRegion));
      console.log('[MapRegion] saved region:', newRegion);
    } catch (e) {
      console.error('[MapRegion] failed to save region:', e);
    }
  };

  return (
    <MapRegionContext.Provider value={{ region, setRegion }}>
      {children}
    </MapRegionContext.Provider>
  );
};

export const useMapRegion = (): MapRegionContextType => {
  const context = useContext(MapRegionContext);
  if (!context) {
    throw new Error('useMapRegion must be used within a MapRegionProvider');
  }
  return context;
};
