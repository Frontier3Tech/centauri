import type { JSX } from 'preact';

interface ErrorScreenProps {
  error: Error;
  onRetry: () => void;
}

export function ErrorScreen({ error, onRetry }: ErrorScreenProps): JSX.Element {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-100">
      <div className="text-center max-w-md mx-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Initialization Failed</h1>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-800 font-medium mb-2">Error Details:</p>
          <p className="text-red-600 text-sm break-words">{error.message}</p>
        </div>
        <button
          onClick={onRetry}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
        >
          Retry Initialization
        </button>
      </div>
    </div>
  );
}
