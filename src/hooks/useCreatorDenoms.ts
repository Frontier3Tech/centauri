import { type CosmosNetworkConfig, signals } from '@apophis-sdk/core';
import { creator } from '~/state';
import { TokenFactory } from '~/tokenfactory';
import { useAsyncComputed } from './useAsyncComputed';

export function useCreatorDenoms() {
  return useAsyncComputed<string[]>([], async () => {
    if (!creator.value) return [];
    const denoms = await TokenFactory.Query.denomsFromCreator(signals.network.value as CosmosNetworkConfig, creator.value);
    return denoms ?? [];
  });
}
