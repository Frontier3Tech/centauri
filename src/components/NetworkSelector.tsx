import type { JSX } from 'preact';
import { signals } from '@apophis-sdk/core';
import { type ChangeEvent } from 'preact/compat';
import { useNetworks } from '~/hooks/useNetworks';
import { Label } from './Label';

export interface NetworkSelectorProps {
  label?: string;
}

export function NetworkSelector({ label }: NetworkSelectorProps): JSX.Element {
  const networks = useNetworks();

  const handleNetworkChange = (e: ChangeEvent<HTMLSelectElement>) => {
    if (!networks.value) return;
    const network = networks.value.find(n => n.chainId === e.currentTarget.value);
    if (network) {
      signals.network.value = network;
    }
  };

  return (
    <div class="mb-6">
      {label && <Label>{label}</Label>}
      <select
        value={signals.network.value?.chainId ?? ''}
        onChange={handleNetworkChange}
        class="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {networks.value?.map(network => (
          <option key={network.chainId} value={network.chainId}>
            {network.prettyName}
          </option>
        ))}
      </select>
    </div>
  );
}