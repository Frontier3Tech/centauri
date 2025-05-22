import type { CosmosNetworkConfig } from '@apophis-sdk/core';
import { signals } from '@apophis-sdk/core';
import { useComputed, useSignal, useSignalEffect } from '@preact/signals';
import cx from 'classnames';
import { type ChangeEvent } from 'preact/compat';
import * as state from '~/state';
import { TokenFactory } from '~/tokenfactory';
import { Accordion } from './Accordion';
import { CreationFee } from './CreationFee';
import { Label } from './Label';
import { NetworkSelector } from './NetworkSelector';
import { Collapsible } from './Collapsible';

export function MainContent() {
  const creating = useComputed(() => state.subdenom.value === state.CreateSubdenom);
  const loading = useSignal(true);
  const metadata = useSignal<TokenFactory.TokenMetadata | null>(null);

  const newSubdenom = useSignal('');

  const isValid = useComputed(() => {
    if (creating.value) {
      if (newSubdenom.value.includes('/')) return false;
    }

    if (!metadata.value) return false;

    const { name, symbol } = metadata.value;
    if (!name?.trim() || !symbol?.trim()) return false;

    return true;
  });

  useSignalEffect(() => {
    loading.value = true;
    if (!state.subdenom.value) {
      metadata.value = null;
      loading.value = false;
      return;
    }

    if (state.subdenom.value === state.CreateSubdenom) {
      metadata.value = {};
      loading.value = false;
      return;
    }

    TokenFactory.Query.denomMetadata(
      signals.network.value as CosmosNetworkConfig,
      state.creator.value!,
      state.subdenom.value!,
    ).then(result => {
      metadata.value = result;
    }).finally(() => {
      loading.value = false;
    });
  });

  const handleUpdate = () => {
    // TODO: Implement metadata update logic
    console.log('Update metadata:', metadata.value);
  };

  const handleInputChange = (field: keyof TokenFactory.TokenMetadata) => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    metadata.value = {
      ...metadata.peek()!,
      [field]: (e.target as HTMLInputElement).value,
    };
  };

  if (loading.value) {
    return (
      <main class="flex-1 max-w-7xl mx-auto p-4 overflow-y-auto overflow-x-hidden">
        <div class="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div class="text-center">
            <div class="flex justify-center">
              <cosmos-spinner />
            </div>
            <p class="mt-4 text-gray-600">
              Loading metadata
              <span class="font-mono animate-ellipsis"></span>
            </p>
          </div>
        </div>
      </main>
    );
  }

  if (!metadata.value) {
    return (
      <main class="flex-1 max-w-7xl mx-auto p-4 overflow-y-auto overflow-x-hidden">
        <div class="bg-white rounded-lg shadow-sm p-6 mb-6">
          <p class="text-gray-500">No metadata available</p>
        </div>
      </main>
    );
  }

  return (
    <main class="flex-1 max-w-7xl mx-auto p-4 overflow-y-auto overflow-x-hidden">
      <NetworkSelector label="Network Selection" />

      <Accordion>
        <Accordion.Item title="Metadata">
          <div class="space-y-6">
            {creating.value && (
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
            )}
            <div class="grid grid-cols-2 gap-4">
              <div>
                <Label required info="Full name of your token.">
                  Name
                </Label>
                <input
                  value={metadata.value.name}
                  onChange={handleInputChange('name')}
                  class="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <Label required info="Canonical symbol of your token.">
                  Symbol
                </Label>
                <input
                  value={metadata.value.symbol}
                  onChange={handleInputChange('symbol')}
                  class="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <Label>Logo URI</Label>
                <input
                  value={metadata.value.uri || ''}
                  onChange={handleInputChange('uri')}
                  class="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <Label>Description</Label>
              <textarea
                value={metadata.value.description || ''}
                onChange={handleInputChange('description')}
                class="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
              />
            </div>

            <Collapsible title="Units" class="border border-gray-300 rounded-md">
              Foobar
            </Collapsible>

            <div class="flex justify-between">
              <CreationFee />
              <button
                onClick={handleUpdate}
                disabled={!isValid.value}
                class={cx(
                  "px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2",
                  isValid.value
                    ? "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                )}
              >
                {creating.value ? 'Create' : 'Update'}
              </button>
            </div>
          </div>
        </Accordion.Item>
        <Accordion.Item title="Manage">
          {/* Add form content here */}
        </Accordion.Item>
      </Accordion>
    </main>
  );
}