import { signals } from '@apophis-sdk/core';
import { Cosmos } from '@apophis-sdk/cosmos';
import { useComputed, useSignal } from '@preact/signals';
import cx from 'classnames';
import { useMemo } from 'preact/hooks';
import * as state from '~/state';
import { TokenFactory } from '~/tokenfactory';
import { CreationFee } from './CreationFee';
import { Label } from './Label';

export function CreateSubdenom() {
  const newSubdenom = useSignal('');
  const isValid = useComputed(() => {
    if (!newSubdenom.value.trim()) return false;
    if (newSubdenom.value.includes('/')) return false;
    return true;
  });

  const msgs = useComputed(() => [
    new TokenFactory.CreateDenom({
      sender: signals.address.value!,
      subdenom: newSubdenom.value.trim(),
    }),
  ]);

  const tx = useMemo(() => Cosmos.signalTx(msgs), [msgs]);

  const handleCreate = () => {
    console.log('Create token:', {
      subdenom: newSubdenom.value.trim(),
    });
  };

  return (
    <div class="space-y-6">
      <div>
        <Label required info={
          <span>
            Subdenom of your new token. Must be unique to your account. The result will be <code class="font-mono">factory/{state.creator.value}/{newSubdenom.value || '<subdenom>'}</code>.
          </span>
        }>
          Subdenom
        </Label>
        <input
          value={newSubdenom.value}
          onChange={(e) => (newSubdenom.value = (e.target as HTMLInputElement).value)}
          class="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div class="flex justify-between">
        <CreationFee tx={tx} valid={isValid} />
        <div class="flex gap-2">
          <button
            onClick={handleCreate}
            disabled={!isValid.value}
            class={cx(
              "px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2",
              isValid.value
                ? "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            )}
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
}