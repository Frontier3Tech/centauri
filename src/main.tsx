import { Apophis, signals } from '@apophis-sdk/core';
import { DefaultCosmosMiddlewares } from '@apophis-sdk/cosmos';
import { registerCosmosSigners } from '@apophis-sdk/cosmos-signers';
import { CosmosComponents, reconnectSigner } from '@kiruse/cosmos-components';
import { render } from 'preact';
import { App } from './App';
import { ErrorScreen } from './components/ErrorScreen';
import { SplashScreen } from './components/SplashScreen';
import { getNetworks } from './config';
import '@kiruse/cosmos-components/preact.js';
import './global.sass';

CosmosComponents.register();

render(<SplashScreen />, document.getElementById('app')!);

async function initialize() {
  try {
    await Apophis.init();
    Apophis.use(...DefaultCosmosMiddlewares);

    const networks = await getNetworks();
    signals.network.value = networks.neutron;

    registerCosmosSigners('c82fda1a49f08badc3cf3e0acea65036');
    await reconnectSigner(Object.values(networks));

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
