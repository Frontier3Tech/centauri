import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { MainContent } from './components/MainContent';

export function App() {
  return (
    <div className="flex flex-col w-screen h-screen bg-gray-100">
      <Header />

      <div className="flex flex-1">
        <Sidebar />
        <MainContent />
      </div>
    </div>
  );
}
