import { signer } from '@apophis-sdk/core/signals.js';
import { modals } from '@kiruse/cosmos-components';
import cx from 'classnames';
import { getNetworks } from '~/config';

export function ConnectButton({ class: className }: { class?: string }) {
  const isConnected = !!signer.value;

  if (isConnected) {
    return <cosmos-user-address class={className} />;
  }

  return (
    <button
      onClick={connect}
      class={cx(
        'px-4 py-2 font-medium transition-colors cursor-pointer',
        'bg-gray-200 hover:bg-white',
        'text-sky-700 hover:text-sky-800',
        className
      )}
    >
      Connect
    </button>
  );
}

async function connect() {
  modals.showWalletModal(Object.values(await getNetworks()));
}