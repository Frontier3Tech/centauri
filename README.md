# Centauri Token Center
Centauri is a UI for the [TokenFactory Cosmos SDK](https://docs.osmosis.zone/osmosis-core/modules/tokenfactory/)
module, with launchpad features planned for the future.

**THIS PROJECT IS ABORTED.**

Reason being that the chains I've tried do not implement querying token metadata & authority metadata via LCD. It is possible these are supported via gRPC, but my [Apophis SDK](https://docs.kiruse.dev/projects/apophis-sdk/introduction) does not currently support that. Thus, until gRPC is supported, this project is pointless as it essentially just boils down to `TokenFactory.MsgCreateDenom` with wallet connection, 1 text input, and 1 button.
