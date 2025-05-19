import cx from 'classnames';

export interface HeaderProps {
  isConnected: boolean;
  onConnect: () => void;
}

export function Header({ isConnected, onConnect }: HeaderProps) {
  return (
    <header className="bg-white shadow-sm z-40 flex-shrink-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Frontier3 Centauri</h1>
          <p className="text-sm text-gray-500">Cosmos TokenFactory GUI</p>
        </div>
        <button
          onClick={onConnect}
          className={cx(
            'px-4 py-2 rounded-md',
            isConnected
              ? 'bg-green-500 hover:bg-green-600'
              : 'bg-blue-500 hover:bg-blue-600',
            'text-white font-medium transition-colors',
          )}
        >
          {isConnected ? 'Connected' : 'Connect'}
        </button>
      </div>
    </header>
  );
}