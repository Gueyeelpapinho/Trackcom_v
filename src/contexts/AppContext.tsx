import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useBlockchain } from '@/contexts/BlockchainContext';
import { useComponentNFT } from '@/hooks/useComponentNFT';

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
  addComponent: (component: Omit<ISSComponent, 'id' | 'events'>) => Promise<void>;
  addEvent: (componentId: string, event: Omit<ComponentEvent, 'id'>) => Promise<void>;
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
    nextMaintenance: Date.now() + 15 * 24 * 60 * 60 * 1000,
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
    nextMaintenance: Date.now() + 5 * 24 * 60 * 60 * 1000,
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
    nextMaintenance: Date.now() - 1 * 24 * 60 * 60 * 1000, // Overdue
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
  
  // Use blockchain context
  const { 
    isConnected: walletConnected, 
    walletAddress, 
    connectWallet: connectBlockchainWallet,
    disconnectWallet: disconnectBlockchainWallet,
  } = useBlockchain();
  
  const { mintComponentNFT, addEventToNFT } = useComponentNFT();

  const connectWallet = async () => {
    await connectBlockchainWallet();
  };

  const disconnectWallet = () => {
    disconnectBlockchainWallet();
  };

  const addComponent = async (componentData: Omit<ISSComponent, 'id' | 'events'>) => {
    try {
      // Mint NFT on Hedera for this component
      const nftId = await mintComponentNFT(componentData);
      
      const newComponent: ISSComponent = {
        ...componentData,
        id: `comp-${Date.now()}`,
        nftId,
        events: [],
      };
      setComponents(prev => [...prev, newComponent]);
    } catch (error) {
      console.error('Failed to add component:', error);
      throw error;
    }
  };

  const addEvent = async (componentId: string, eventData: Omit<ComponentEvent, 'id'>) => {
    try {
      const newEvent: ComponentEvent = {
        ...eventData,
        id: `evt-${Date.now()}`,
      };

      // Find component to get its NFT ID
      const component = components.find(c => c.id === componentId);

      // Add event to Hedera blockchain
      await addEventToNFT(componentId, eventData, component?.nftId);

      setComponents(prev =>
        prev.map(comp =>
          comp.id === componentId
            ? { ...comp, events: [...comp.events, newEvent] }
            : comp
        )
      );
    } catch (error) {
      console.error('Failed to add event:', error);
      throw error;
    }
  };

  const getComponent = (id: string) => {
    return components.find(comp => comp.id === id);
  };

  return (
    <AppContext.Provider
      value={{
        components,
        walletConnected,
        walletAddress,
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
