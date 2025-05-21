import { signer } from '@apophis-sdk/core/signals.js';
import { modals } from '@kiruse/cosmos-components';
import cx from 'classnames';
import { getNetworks } from '~/config';

export function Header() {
  const isConnected = !!signer.value;

  return (
    <header class="bg-sky-800 text-white shadow-sm z-40 flex-shrink-0">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <div>
          <h1 class="text-2xl font-bold text-white">Frontier3 Centauri</h1>
          <p class="text-sm text-gray-300">Cosmos TokenFactory GUI</p>
        </div>
        {isConnected ? (
          <cosmos-user-address />
        ) : (
          <button
            onClick={connect}
            class={cx(
              'px-4 py-2 rounded-md font-medium transition-colors cursor-pointer',
              'bg-gray-200 hover:bg-white',
              'text-sky-700 hover:text-sky-800',
            )}
          >
            Connect
          </button>
        )}
      </div>
    </header>
  );
}

async function connect() {
  modals.showWalletModal(Object.values(await getNetworks()));
}
