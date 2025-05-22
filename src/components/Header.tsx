import { ConnectButton } from './ConnectButton';

export function Header() {
  return (
    <header class="bg-sky-800 text-white shadow-sm z-40 flex-shrink-0">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <div>
          <h1 class="text-2xl font-bold text-white">Frontier3 Centauri</h1>
          <p class="text-sm text-gray-300">Cosmos TokenFactory GUI</p>
        </div>
        <ConnectButton class="hidden md:block rounded-md" />
      </div>
    </header>
  );
}
