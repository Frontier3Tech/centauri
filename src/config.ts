import type { CosmosNetworkConfig } from '@apophis-sdk/core';
import { Cosmos } from '@apophis-sdk/cosmos';
import { extendDefaultMarshaller, RecaseMarshalUnit } from '@kiruse/marshal';

/** Tips for denom creation, on top of denom creation fee (set in params). */
export const tips = {
  neutron: Cosmos.coin(10_000000n, 'untrn'),
  neutrontestnet: Cosmos.coin(100000n, 'untrn'),
  osmosis: Cosmos.coin(10_000000n, 'uosmo'),
  terra2: Cosmos.coin(10_000000n, 'uluna'),
};

var _networks: Record<string, CosmosNetworkConfig> | undefined;
export async function getNetworks() {
  if (_networks) return _networks;

  // endpoints in the chain registry can be outdated, so we override them here
  const endpoints = {
    neutron: {
      "rest": [
        "https://rest-lb.neutron.org",
        "https://rest-solara.neutron-1.neutron.org",
        "https://rest-vertexa.neutron-1.neutron.org",
        "https://rest-voidara.neutron-1.neutron.org",
        "https://rest-pulsarix.neutron-1.neutron.org",
        "https://rest.lavenderfive.com:443/neutron",
        "https://lcd-neutron.whispernode.com",
        "https://neutron-rest.publicnode.com",
      ],
      "rpc": [
        "https://rpc-lb.neutron.org",
        "https://neutron-rpc.publicnode.com:443",
        "https://neutron.drpc.org",
      ],
      "ws": [
        "wss://rpc-lb.neutron.org/websocket",
        "wss://neutron-rpc.publicnode.com:443/websocket",
        "wss://neutron.drpc.org/websocket",
      ],
    },
    neutrontestnet: {
      "rest": [
        "https://rest-falcron.pion-1.ntrn.tech",
      ],
      "rpc": [
        "https://rpc-falcron.pion-1.ntrn.tech",
        "https://neutron-testnet-rpc.polkachu.com/",
      ],
      "ws": [
        "wss://rpc-falcron.pion-1.ntrn.tech/websocket",
        "wss://neutron-testnet-rpc.polkachu.com/websocket",
      ],
    },
    osmosis: {
      "rest": [
        "https://lcd.osmosis.zone/",
        "https://rest.osmosis.goldenratiostaking.net",
        "https://rest.lavenderfive.com:443/osmosis",
        "https://osmosis-api.polkachu.com",
        "https://osmosis-mainnet-lcd.autostake.com:443",
        "https://lcd-osmosis.whispernode.com:443",
        "https://osmosis-rest.publicnode.com",
      ],
      "rpc": [
        "https://rpc.osmosis.zone/",
        "https://rpc.osmosis.goldenratiostaking.net",
        "https://rpc.lavenderfive.com:443/osmosis",
        "https://osmosis-rpc.polkachu.com",
        "https://osmosis-mainnet-rpc.autostake.com:443",
        "https://rpc-osmosis.whispernode.com:443",
        "https://osmosis-rpc.publicnode.com:443",
      ],
      "ws": [
        "wss://rpc.osmosis.zone/websocket",
        "wss://rpc.osmosis.goldenratiostaking.net/websocket",
        "wss://rpc.lavenderfive.com:443/osmosis/websocket",
        "wss://osmosis-rpc.polkachu.com/websocket",
        "wss://osmosis-mainnet-rpc.autostake.com:443/websocket",
        "wss://rpc-osmosis.whispernode.com:443/websocket",
        "wss://osmosis-rpc.publicnode.com:443/websocket",
        "wss://osmosis.drpc.org/websocket",
      ],
    },
    terra2: {
      "rest": [
        "https://terra-rest.publicnode.com",
        "https://terra-api.cosmosrescue.dev:8443",
      ],
      "rpc": [
        "https://rpc.lavenderfive.com:443/terra2",
        "https://terra-rpc.polkachu.com",
        "https://terra-rpc.publicnode.com:443",
        "https://terra-rpc.cosmosrescue.dev:8443",
      ],
      "ws": [
        "wss://rpc.lavenderfive.com:443/terra2/websocket",
        "wss://terra-rpc.polkachu.com/websocket",
        "wss://terra-rpc.publicnode.com:443/websocket",
        "wss://terra-rpc.cosmosrescue.dev:8443/websocket",
      ],
    },
  };

  _networks = Object.fromEntries(await Promise.all(
    Object.entries(endpoints).map(async ([name, endpoints]) =>
      [name, Object.assign(
        await Cosmos.getNetworkFromRegistry(name),
        { endpoints }
      )]
  )));
  return _networks! as Record<keyof typeof endpoints, CosmosNetworkConfig>;
}

export const { marshal } = extendDefaultMarshaller([
  RecaseMarshalUnit(
    (key) => key.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`),
    (key) => key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase())
  )
])
