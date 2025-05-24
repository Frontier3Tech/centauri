import type { CosmosNetworkConfig } from '@apophis-sdk/core';
import { network } from '@apophis-sdk/core/signals.js';
import type { CosmosTxSignal } from '@apophis-sdk/cosmos';
import { Decimal } from '@kiruse/decimal';
import { useComputed, type ReadonlySignal } from '@preact/signals';
import { tips } from '~/config';
import { useAsyncComputed } from '~/hooks/useAsyncComputed';
import { TokenFactory } from '~/tokenfactory';

export function CreationFee({ tx, valid }: { tx: CosmosTxSignal, valid: ReadonlySignal<boolean> }) {
  const nativeFees = useAsyncComputed<{ denom: string; amount: Decimal }[]>([], async () => {
    if (!network.value) return [];
    const params = await TokenFactory.Query.params(network.value as CosmosNetworkConfig)
      .catch(() => null);
    return params?.denomCreationFee?.map(coin => {
      const asset = getAsset(network.value as CosmosNetworkConfig, coin.denom);
      return {
        denom: asset?.name ?? coin.denom,
        amount: new Decimal(coin.amount, asset?.display?.decimals ?? 6),
      };
    }) ?? [];
  });

  const centauriFee = useComputed(() => {
    const fee = tips[network.value?.name as keyof typeof tips];
    if (!fee) return null;
    const asset = getAsset(network.value as CosmosNetworkConfig, fee.denom);
    return {
      denom: asset?.name ?? fee.denom,
      amount: new Decimal(fee.amount, asset?.display?.decimals ?? 6),
    };
  });

  if (!centauriFee.value && nativeFees.value.length === 0) return null;

  return (
    <div class="flex items-center gap-1">
      <div class="flex flex-col gap-2">
        {nativeFees.value.length > 0 && (
          <div class="flex gap-2 items-center justify-between text-sm">
            <span>TokenFactory fee:</span>
            <div>
              {nativeFees.value.map((coin) => (
                <cosmos-balance denom={coin.denom} value={coin.amount}></cosmos-balance>
              ))}
            </div>
          </div>
        )}
        {!!centauriFee.value && (
          <div class="flex gap-2 items-center justify-between text-sm">
            <span>Centauri fee:</span>
            <cosmos-balance denom={centauriFee.value.denom} value={centauriFee.value.amount}></cosmos-balance>
          </div>
        )}
        {valid.value && (
          <div class="flex gap-2 items-center justify-between text-sm">
            <span>Gas estimate:</span>
            <cosmos-gas-estimate tx={tx} />
          </div>
        )}
      </div>
    </div>
  );
}

const getAsset = (network: CosmosNetworkConfig | undefined, denom: string) =>
  network?.assets.find(asset => asset.denom === denom);
