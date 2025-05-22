import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { MainContent } from './components/MainContent';

export function App() {
  return (
    <div class="flex flex-col w-full h-screen">
      <Header />

      <div class="flex flex-col md:flex-row flex-1">
        <Sidebar />
        <MainContent />
      </div>
    </div>
  );
}
