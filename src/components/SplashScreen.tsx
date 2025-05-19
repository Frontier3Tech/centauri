import type { JSX } from 'preact';

export function SplashScreen(): JSX.Element {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Frontier3 Centauri</h1>
        <div className="flex justify-center">
          <cosmos-spinner />
        </div>
        <p className="mt-4 text-gray-600">
          Initializing
          <span className="font-mono animate-ellipsis"></span>
        </p>
      </div>
    </div>
  );
}