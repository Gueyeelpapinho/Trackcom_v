import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ISSComponent, ComponentEvent } from '@/contexts/AppContext';

interface UseComponentNFTReturn {
  mintComponentNFT: (component: Omit<ISSComponent, 'id' | 'nftId' | 'events'>) => Promise<string>;
  addEventToNFT: (componentId: string, event: Omit<ComponentEvent, 'id'>, nftId?: string) => Promise<void>;
  getComponentHistory: (nftId: string) => Promise<ComponentEvent[]>;
  isLoading: boolean;
  error: string | null;
}

export const useComponentNFT = (): UseComponentNFTReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Mint a new NFT for an ISS component
  const mintComponentNFT = async (
    component: Omit<ISSComponent, 'id' | 'nftId' | 'events'>
  ): Promise<string> => {
    setIsLoading(true);
    setError(null);

    try {
      console.log('Calling Hedera mint NFT function...');
      
      const { data, error: functionError } = await supabase.functions.invoke(
        'hedera-mint-nft',
        {
          body: { componentData: component },
        }
      );

      if (functionError) {
        throw new Error(functionError.message);
      }

      if (!data.success) {
        throw new Error(data.error || 'Failed to mint NFT');
      }

      console.log('NFT minted successfully:', data.nftId);
      
      return data.nftId;
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to mint NFT';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Add event to component's NFT metadata
  const addEventToNFT = async (
    componentId: string,
    event: Omit<ComponentEvent, 'id'>,
    nftId?: string
  ): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      console.log('Calling Hedera add event function...');
      
      const { data, error: functionError } = await supabase.functions.invoke(
        'hedera-add-event',
        {
          body: { 
            componentId,
            nftId,
            eventData: event 
          },
        }
      );

      if (functionError) {
        throw new Error(functionError.message);
      }

      if (!data.success) {
        throw new Error(data.error || 'Failed to add event');
      }

      console.log('Event added successfully to HCS topic:', data.topicId);
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to add event';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Get component's complete history from blockchain
  const getComponentHistory = async (nftId: string): Promise<ComponentEvent[]> => {
    setIsLoading(true);
    setError(null);

    try {
      // TODO: Call backend edge function to query HCS messages
      // For now, return empty array
      await new Promise(resolve => setTimeout(resolve, 500));
      
      console.log('Fetching history for NFT:', nftId);
      
      return [];
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to fetch history';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    mintComponentNFT,
    addEventToNFT,
    getComponentHistory,
    isLoading,
    error,
  };
};
