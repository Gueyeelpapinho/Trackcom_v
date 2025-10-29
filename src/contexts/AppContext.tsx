import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useHashPack } from '@/hooks/useHashPack';

export interface ComponentEvent {
  id: string;
  type: 'installation' | 'repair' | 'inspection' | 'replacement';
  timestamp: number;
  description: string;
  performedBy: string;
  metadata?: Record<string, any>;
}

export interface ISSComponent {
  id: string;
  nftId: string;
  name: string;
  type: 'air_filter' | 'battery' | 'sensor' | 'communication' | 'power_supply' | 'cooling_system';
  status: 'operational' | 'warning' | 'critical' | 'maintenance';
  location: string;
  installationDate: number;
  lastMaintenance: number;
  nextMaintenance: number;
  events: ComponentEvent[];
  metadata: {
    manufacturer?: string;
    serialNumber?: string;
    specifications?: string;
  };
}

interface AppContextType {
  components: ISSComponent[];
  walletConnected: boolean;
  walletAddress: string | null;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  addComponent: (component: Omit<ISSComponent, 'id' | 'events'>) => void;
  addEvent: (componentId: string, event: Omit<ComponentEvent, 'id'>) => void;
  getComponent: (id: string) => ISSComponent | undefined;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Mock data for demonstration
const mockComponents: ISSComponent[] = [
  {
    id: '1',
    nftId: 'NFT-ISS-001',
    name: 'Primary Air Filter Unit A',
    type: 'air_filter',
    status: 'operational',
    location: 'Module Destiny - Sector 3',
    installationDate: Date.now() - 90 * 24 * 60 * 60 * 1000,
    lastMaintenance: Date.now() - 15 * 24 * 60 * 60 * 1000,
    nextMaintenance: new Date('2026-02-15T00:00:00Z').getTime(),
    events: [
      {
        id: 'evt-1',
        type: 'installation',
        timestamp: Date.now() - 90 * 24 * 60 * 60 * 1000,
        description: 'Initial installation of primary air filter',
        performedBy: 'Astronaut J. Smith',
      },
      {
        id: 'evt-2',
        type: 'inspection',
        timestamp: Date.now() - 15 * 24 * 60 * 60 * 1000,
        description: 'Routine quarterly inspection - all parameters nominal',
        performedBy: 'Astronaut M. Chen',
      },
    ],
    metadata: {
      manufacturer: 'NASA ISS Division',
      serialNumber: 'AF-2024-001',
      specifications: 'HEPA filtration, 99.97% efficiency',
    },
  },
  {
    id: '2',
    nftId: 'NFT-ISS-002',
    name: 'Battery Pack B-12',
    type: 'battery',
    status: 'warning',
    location: 'Solar Array Section 4',
    installationDate: Date.now() - 180 * 24 * 60 * 60 * 1000,
    lastMaintenance: Date.now() - 45 * 24 * 60 * 60 * 1000,
    nextMaintenance: new Date('2026-01-10T00:00:00Z').getTime(),
    events: [
      {
        id: 'evt-3',
        type: 'installation',
        timestamp: Date.now() - 180 * 24 * 60 * 60 * 1000,
        description: 'Battery pack installation',
        performedBy: 'Ground Control Team',
      },
      {
        id: 'evt-4',
        type: 'repair',
        timestamp: Date.now() - 45 * 24 * 60 * 60 * 1000,
        description: 'Voltage regulator adjustment',
        performedBy: 'Astronaut R. Martinez',
      },
    ],
    metadata: {
      manufacturer: 'Orbital Power Systems',
      serialNumber: 'BP-B12-2023',
      specifications: 'Li-ion, 28V, 120Ah',
    },
  },
  {
    id: '3',
    nftId: 'NFT-ISS-003',
    name: 'Temperature Sensor Array',
    type: 'sensor',
    status: 'critical',
    location: 'Module Harmony - Life Support',
    installationDate: Date.now() - 200 * 24 * 60 * 60 * 1000,
    lastMaintenance: Date.now() - 60 * 24 * 60 * 60 * 1000,
    nextMaintenance: new Date('2025-12-10T00:00:00Z').getTime(),
    events: [
      {
        id: 'evt-5',
        type: 'installation',
        timestamp: Date.now() - 200 * 24 * 60 * 60 * 1000,
        description: 'Temperature sensor array deployment',
        performedBy: 'Ground Control Team',
      },
    ],
    metadata: {
      manufacturer: 'SpaceTech Sensors',
      serialNumber: 'TS-ARR-2023-003',
      specifications: 'Range: -50°C to +80°C, ±0.1°C accuracy',
    },
  },
];

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [components, setComponents] = useState<ISSComponent[]>(mockComponents);
  const { isConnected, accountId, connect, disconnect } = useHashPack();

  const connectWallet = async () => {
    await connect();
  };

  const disconnectWallet = () => {
    disconnect();
  };

  const addComponent = (componentData: Omit<ISSComponent, 'id' | 'events'>) => {
    const newComponent: ISSComponent = {
      ...componentData,
      id: `comp-${Date.now()}`,
      events: [],
    };
    setComponents(prev => [...prev, newComponent]);
  };

  const addEvent = (componentId: string, eventData: Omit<ComponentEvent, 'id'>) => {
    const newEvent: ComponentEvent = {
      ...eventData,
      id: `evt-${Date.now()}`,
    };

    setComponents(prev =>
      prev.map(comp =>
        comp.id === componentId
          ? { ...comp, events: [...comp.events, newEvent] }
          : comp
      )
    );
  };

  const getComponent = (id: string) => {
    return components.find(comp => comp.id === id);
  };

  return (
    <AppContext.Provider
      value={{
        components,
        walletConnected: isConnected,
        walletAddress: accountId,
        connectWallet,
        disconnectWallet,
        addComponent,
        addEvent,
        getComponent,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
