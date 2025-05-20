import type { CosmosNetworkConfig } from '@apophis-sdk/core';
import { signals } from '@apophis-sdk/core';
import { useSignal, useSignalEffect } from '@preact/signals';
import { type ChangeEvent } from 'preact/compat';
import { CreateSubdenom, creator, subdenom } from '~/state';
import { TokenFactory } from '~/tokenfactory';
import { Accordion } from './Accordion';
import { Label } from './Label';
import { NetworkSelector } from './NetworkSelector';

export function MainContent() {
  const loading = useSignal(true);
  const metadata = useSignal<TokenFactory.TokenMetadata | null>(null);

  useSignalEffect(() => {
    loading.value = true;
    if (!subdenom.value) {
      metadata.value = null;
      loading.value = false;
      return;
    }

    if (subdenom.value === CreateSubdenom) {
      metadata.value = {};
      loading.value = false;
      return;
    }

    TokenFactory.Query.denomMetadata(
      signals.network.value as CosmosNetworkConfig,
      creator.value!,
      subdenom.value!,
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

            <div class="flex justify-end">
              <button
                onClick={handleUpdate}
                class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                {subdenom.value === CreateSubdenom ? 'Create' : 'Update'}
              </button>
            </div>
          </div>
        </Accordion.Item>
        <Accordion.Item title="Mint Token">
          {/* Add form content here */}
        </Accordion.Item>
        <Accordion.Item title="Burn Token">
          {/* Add form content here */}
        </Accordion.Item>
        <Accordion.Item title="Force Transfer">
          {/* Add form content here */}
        </Accordion.Item>
      </Accordion>
    </main>
  );
}