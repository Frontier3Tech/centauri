import type { CosmosNetworkConfig } from '@apophis-sdk/core';
import { signals } from '@apophis-sdk/core';
import { Signal, useComputed, useSignal, useSignalEffect } from '@preact/signals';
import cx from 'classnames';
import { type ChangeEvent } from 'preact/compat';
import * as state from '~/state';
import { TokenFactory } from '~/tokenfactory';
import { Accordion } from './Accordion';
import { Collapsible } from './Collapsible';
import { CreationFee } from './CreationFee';
import { PlusCircleIcon } from './icon/PlusCircleIcon';
import { TrashIcon } from './icon/TrashIcon';
import { Label } from './Label';
import { NetworkSelector } from './NetworkSelector';

type DenomUnit = TokenFactory.DenomUnit;

export function MainContent() {
  const loading = useSignal(true);
  const metadata = useSignal<TokenFactory.TokenMetadata | null>(null);

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
      <main class="flex-1 w-full md:w-auto max-w-7xl mx-auto p-1 pt-4 md:p-4 overflow-y-auto overflow-x-hidden">
        <div class="bg-white rounded-lg shadow-sm p-6 mb-6">
          <p class="text-gray-500">No metadata available</p>
        </div>
      </main>
    );
  }

  return (
    <main class="flex-1 w-full md:w-auto max-w-7xl mx-auto p-1 pt-4 md:p-4 overflow-y-auto overflow-x-hidden">
      <NetworkSelector label="Network Selection" />

      <Accordion>
        <Accordion.Item title="Metadata">
          <MetadataSection metadata={metadata as Signal<TokenFactory.TokenMetadata>} />
        </Accordion.Item>
        <Accordion.Item title="Manage">
          {/* Add form content here */}
        </Accordion.Item>
      </Accordion>
    </main>
  );
}

function MetadataSection({ metadata }: { metadata: Signal<TokenFactory.TokenMetadata> }) {
  const creating = useComputed(() => state.subdenom.value === state.CreateSubdenom);
  const units = useSignal<DenomUnit[]>([]);

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

  return (
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
        <UnitsSection units={units} />
        <button
          class="w-full flex items-center gap-2 px-6 py-4 border-t border-gray-200 hover:bg-gray-50 text-gray-600 hover:text-gray-900"
          onClick={() => {
            units.value = [...units.peek(), { denom: '', exponent: 0, aliases: [] }];
          }}
        >
          <PlusCircleIcon width={20} height={20} />
          <span>Add unit</span>
        </button>
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
  );
}

function UnitsSection({ units }: { units: Signal<DenomUnit[]> }) {
  const handleUnitChange = (index: number, field: keyof DenomUnit, value: string | number | string[]) => {
    const newUnits = [...units.value];
    newUnits[index] = {
      ...newUnits[index],
      [field]: value
    };
    units.value = newUnits;
  };

  return (
    <div class="divide-y divide-gray-200">
      {units.value.map((unit, index) => (
        <div key={index} class="p-6 space-y-4">
          <div class="space-y-4">
            <div>
              <Label required>Denom</Label>
              <input
                required
                value={unit.denom}
                onChange={(e) => handleUnitChange(index, 'denom', (e.target as HTMLInputElement).value)}
                class="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <Label required>Decimals</Label>
              <input
                required
                type="number"
                step="1"
                min="0"
                value={unit.exponent}
                onChange={(e) => handleUnitChange(index, 'exponent', parseInt((e.target as HTMLInputElement).value) || 0)}
                class="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <Label>Aliases</Label>
              <input
                value={unit.aliases?.join(', ') || ''}
                onChange={(e) => handleUnitChange(index, 'aliases', (e.target as HTMLInputElement).value.split(',').map(s => s.trim()).filter(Boolean))}
                placeholder="Comma-separated aliases"
                class="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div class="flex justify-end">
              <button
                onClick={() => {
                  units.value = units.value.filter((_, i) => i !== index);
                }}
                class="inline-flex items-center gap-2 px-4 py-2 bg-red-700 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
              >
                <TrashIcon width={20} height={20} />
                <span>Delete</span>
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
