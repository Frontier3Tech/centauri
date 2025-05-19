import { signer } from '@apophis-sdk/core/signals.js';
import { modals } from '@kiruse/cosmos-components';
import cx from 'classnames';
import { getNetworks } from '~/config';

export function Header() {
  const isConnected = !!signer.value;

  return (
    <header class="bg-white shadow-sm z-40 flex-shrink-0">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Frontier3 Centauri</h1>
          <p class="text-sm text-gray-500">Cosmos TokenFactory GUI</p>
        </div>
        {isConnected ? (
          <cosmos-user-address />
        ) : (
          <button
            onClick={connect}
            class={cx(
              'px-4 py-2 rounded-md',
              isConnected
                ? 'bg-green-500 hover:bg-green-600'
                : 'bg-blue-500 hover:bg-blue-600',
              'text-white font-medium transition-colors',
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
