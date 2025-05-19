import { render } from 'preact';
import { App } from './App';
import './global.sass';
import { CosmosComponents } from '@kiruse/cosmos-components';
import { Apophis } from '@apophis-sdk/core';
import { SplashScreen } from './components/SplashScreen';
import { ErrorScreen } from './components/ErrorScreen';
import { getNetworks } from './config';

CosmosComponents.register();

render(<SplashScreen />, document.getElementById('app')!);

async function initialize() {
  try {
    await Apophis.init();
    await getNetworks();
    render(<App />, document.getElementById('app')!);
  } catch (error) {
    console.error('Failed to initialize:', error);
    render(
      <ErrorScreen
        error={error instanceof Error ? error : new Error(String(error))}
        onRetry={initialize}
      />,
      document.getElementById('app')!
    );
  }
}
initialize();
