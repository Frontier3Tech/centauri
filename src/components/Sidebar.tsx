import { CreateSubdenom, creator, subdenom } from '~/state';
import { PlusCircleIcon } from './icon/PlusCircleIcon';
import { useAsyncComputed } from '~/hooks/useAsyncComputed';
import { TokenFactory } from '~/tokenfactory';
import { signals, type CosmosNetworkConfig } from '@apophis-sdk/core';

export function Sidebar() {
  const items = useAsyncComputed<string[]>([], async () => {
    const result = await TokenFactory.Query.denomsFromCreator(signals.network.value as CosmosNetworkConfig, creator.value!);
    return result.denoms ?? [];
  });

  return (
    <aside class="w-64 flex-shrink-0 bg-white shadow-sm">
      <ul class="flex flex-col space-y-2">
        {items.value.map((item) => (
          <li key={item} class="block">
            <a
              href="#"
              class="block px-4 py-2 hover:bg-gray-100 text-gray-700"
              onClick={(e) => {
                e.preventDefault();
                subdenom.value = item;
              }}
            >
              {item}
            </a>
          </li>
        ))}
        <li class="block">
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              subdenom.value = CreateSubdenom;
            }}
            class="block px-4 py-2 hover:bg-gray-100 text-gray-700 flex items-center gap-2"
          >
            <PlusCircleIcon width={20} height={20} class="text-gray-500" />
            Create
          </a>
        </li>
      </ul>
    </aside>
  );
}