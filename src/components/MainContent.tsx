import { Accordion } from './Accordion';

export function MainContent() {
  return (
    <main className="flex-1 max-w-7xl mx-auto p-4 overflow-y-auto overflow-x-hidden">
      {/* Metadata Section */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Metadata</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">Network</p>
            <p className="font-medium">Cosmos Hub</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Chain ID</p>
            <p className="font-medium">cosmoshub-4</p>
          </div>
        </div>
      </div>

      {/* Forms Accordion */}
      <Accordion>
        <Accordion.Item title="Create Token">
          {/* Add form content here */}
        </Accordion.Item>
        <Accordion.Item title="Mint Token">
          {/* Add form content here */}
        </Accordion.Item>
        <Accordion.Item title="Burn Token">
          {/* Add form content here */}
        </Accordion.Item>
      </Accordion>
    </main>
  );
}