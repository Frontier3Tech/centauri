import type { CosmosNetworkConfig } from '@apophis-sdk/core';
import { useSignal } from '@preact/signals';
import { useEffect } from 'preact/hooks';
import { getNetworks } from '~/config';

export function useNetworks() {
  const networks = useSignal<CosmosNetworkConfig[] | undefined>(undefined);
  useEffect(() => {
    let mounted = true;
    getNetworks().then(result => {
      if (!mounted) return;
      networks.value = Object.values(result);
    });
    return () => {
      mounted = false;
    };
  }, []);
  return networks;
}
