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
import { Info } from './Info';
import { marshal } from '~/config';

type DenomUnit = TokenFactory.DenomUnit & {
  display?: boolean;
};

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
  const units = useSignal<DenomUnit[]>(metadata.peek()?.denomUnits ?? []);
  const aliases = useSignal<string[]>(metadata.peek()?.denomUnits?.[0]?.aliases ?? []);

  const newSubdenom = useSignal('');

  const isValid = useComputed(() => {
    if (creating.value) {
      if (!newSubdenom.value.trim()) return false;
      if (newSubdenom.value.includes('/')) return false;
    }

    if (!metadata.value) return false;

    const { name, symbol } = metadata.value;
    if (!name?.trim() || !symbol?.trim()) return false;

    if (units.value.some(unit => unit.denom?.trim() === '')) return false;

    return true;
  });

  const createFinalMetadata = () => {
    const denom = `factory/${state.creator.value}/${newSubdenom.value}`;
    const display = units.value.find(unit => unit.display);

    return {
      name: metadata.value.name?.trim() || '',
      symbol: metadata.value.symbol?.trim() || '',
      description: metadata.value.description?.trim() || undefined,
      uri: metadata.value.uri?.trim() || undefined,
      base: denom,
      display: display?.denom,
      denomUnits: [
        {
          denom,
          exponent: 0,
          aliases: aliases.value,
        },
        ...units.value.map(unit => ({
          denom: unit.denom?.trim() || '',
          exponent: unit.exponent,
          aliases: unit.aliases?.filter(Boolean) || [],
        })),
      ],
    } as TokenFactory.TokenMetadata;
  };

  const handleUpdate = () => {
    const finalMetadata = createFinalMetadata();

    if (creating.value) {
      // For creation, we need to include the subdenom
      console.log('Create token:', {
        subdenom: newSubdenom.value.trim(),
        metadata: finalMetadata
      });
    } else {
      // For update, we just need the metadata
      console.log('Update metadata:', finalMetadata);
    }
  };

  const handleCopyJson = () => {
    const finalMetadata = createFinalMetadata();
    navigator.clipboard.writeText(JSON.stringify(marshal(finalMetadata), null, 2));
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
        <div>
          <Label info="Aliases for the base unit of your token. Typically the micro-unit of your token, e.g. uatom, untrn, etc.">Aliases</Label>
          <input
            value={aliases.value.join(', ')}
            onChange={(e) => aliases.value = (e.target as HTMLInputElement).value.split(',').map(s => s.trim()).filter(Boolean)}
            placeholder="Comma-separated aliases"
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

      <Collapsible
        title={
          <div class="flex items-center gap-2">
            Units
            <Info>
              Additional units of your token. Typically, this includes the display unit, e.g. <i>atom</i> or <i>ntrn</i>, often
              with 6 decimals.
            </Info>
          </div>
        }
        class="border border-gray-300 rounded-md"
      >
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
        <div class="flex gap-2">
          <button
            onClick={handleCopyJson}
            disabled={!isValid.value}
            class={cx(
              "px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2",
              isValid.value
                ? "bg-gray-100 text-gray-700 hover:bg-gray-200 focus:ring-gray-500"
                : "bg-gray-100 text-gray-400 cursor-not-allowed"
            )}
          >
            Copy JSON
          </button>
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

  const handleDisplayChange = (index: number, checked: boolean) => {
    const newUnits = units.value.map((unit, i) => ({
      ...unit,
      display: i === index ? checked : false
    }));
    units.value = newUnits;
  };

  return (
    <div class="divide-y divide-gray-200">
      {units.value.map((unit, index) => (
        <div key={index} class="p-6 space-y-4">
          <div class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            <div class="flex justify-between items-center">
              <label class="inline-flex items-center gap-2 text-sm text-gray-500">
                <input
                  type="checkbox"
                  checked={unit.display}
                  onChange={(e) => handleDisplayChange(index, (e.target as HTMLInputElement).checked)}
                  class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span class="flex items-center gap-2">
                  For display
                  <Info>
                    When checked, UIs will use this unit's decimals for displaying purposes. Typically,
                    this is the unit with 6 decimals.
                  </Info>
                </span>
              </label>
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
