import { useState } from 'preact/hooks';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { MainContent } from './components/MainContent';

interface NavItem {
  id: string;
  label: string;
}

export function App() {
  const [isConnected, setIsConnected] = useState(false);
  const [navItems] = useState<NavItem[]>([
    { id: 'tokens', label: 'Tokens' },
    { id: 'contracts', label: 'Contracts' },
    { id: 'settings', label: 'Settings' },
  ]);

  return (
    <div className="flex flex-col w-screen h-screen bg-gray-100">
      <Header isConnected={isConnected} onConnect={() => setIsConnected(!isConnected)} />

      <div className="flex flex-1">
        <Sidebar items={navItems} />
        <MainContent />
      </div>
    </div>
  );
}
