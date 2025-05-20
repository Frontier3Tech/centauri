import type { CosmosNetworkConfig } from '@apophis-sdk/core';
import { registerDefaultProtobufSchema } from '@apophis-sdk/core/encoding/protobuf/any.js';
import { Cosmos, registerDefaultAminos } from '@apophis-sdk/cosmos';
import { pbCoin } from '@apophis-sdk/cosmos/encoding/protobuf/core.js';
import { hpb } from '@kiruse/hiproto';
import type { RestMethods } from '@kiruse/restful';

export namespace TokenFactory {
  export type TokenFactoryRestApi = {
    osmosis: {
      tokenfactory: {
        v1beta1: {
          params: RestMethods<{
            get(): hpb.infer<typeof Query.pbParamsRes>;
          }>

          denoms_from_creator: {
            [creator: string]: RestMethods<{
              get(): hpb.infer<typeof Query.pbDenomsFromCreatorRes>;
            }>
          }
        } & {
          [denom: string]: {
            authority_metadata: RestMethods<{
              get(): hpb.infer<typeof Query.pbDenomAuthorityMetadataRes>;
            }>;
          };
        };
      };
    };
  };

  export type TokenMetadata = hpb.infer<typeof pbMetadata>;
  export type DenomUnit = Required<hpb.infer<typeof pbMetadata>>['denomUnits'][number];

  // TODO: Metadata has been added to Apophis SDK, but has not been released yet. Will be released
  // in v0.3.2.
  export const pbMetadata = hpb.message({
    description: hpb.string(1),
    denomUnits: hpb.repeated.submessage(2, {
      denom: hpb.string(1),
      exponent: hpb.uint32(2),
      aliases: hpb.repeated.string(3),
    }),
    base: hpb.string(3),
    display: hpb.string(4),
    name: hpb.string(5),
    symbol: hpb.string(6),
    uri: hpb.string(7),
    uriHash: hpb.string(8),
  });

  //#region Messages
  //#region CreateDenom
  export const pbMsgCreateDenomRequest = hpb.message({
    sender: hpb.string(1),
    subdenom: hpb.string(2),
  });

  export type CreateDenomData = hpb.infer<typeof pbMsgCreateDenomRequest>;

  export class CreateDenom {
    static readonly aminoTypeUrl = 'osmosis/tokenfactory/create-denom';
    static readonly protobufTypeUrl = '/osmosis.tokenfactory.v1beta1.MsgCreateDenom';
    static readonly protobufSchema = pbMsgCreateDenomRequest;
    constructor(public data: CreateDenomData) {}
  }

  registerDefaultProtobufSchema(CreateDenom);
  registerDefaultAminos(CreateDenom);
  //#endregion

  //#region Mint
  export const pbMsgMintRequest = hpb.message({
    sender: hpb.string(1),
    amount: hpb.submessage(2, pbCoin),
    mintToAddress: hpb.string(3),
  });

  export type MintData = hpb.infer<typeof pbMsgMintRequest>;


  export class Mint {
    static readonly aminoTypeUrl = 'osmosis/tokenfactory/mint';
    static readonly protobufTypeUrl = '/osmosis.tokenfactory.v1beta1.MsgMint';
    static readonly protobufSchema = pbMsgMintRequest;
    constructor(public data: MintData) {}
  }

  registerDefaultProtobufSchema(Mint);
  registerDefaultAminos(Mint);
  //#endregion

  //#region Burn
  export const pbMsgBurnRequest = hpb.message({
    sender: hpb.string(1),
    amount: hpb.submessage(2, pbCoin),
    burnFromAddress: hpb.string(3),
  });

  export type BurnData = hpb.infer<typeof pbMsgBurnRequest>;

  export class Burn {
    static readonly aminoTypeUrl = 'osmosis/tokenfactory/burn';
    static readonly protobufTypeUrl = '/osmosis.tokenfactory.v1beta1.MsgBurn';
    static readonly protobufSchema = pbMsgBurnRequest;
    constructor(public data: BurnData) {}
  }

  registerDefaultProtobufSchema(Burn);
  registerDefaultAminos(Burn);
  //#endregion

  //#region ChangeAdmin
  export const pbMsgChangeAdmin = hpb.message({
    sender: hpb.string(1),
    denom: hpb.string(2),
    newAdmin: hpb.string(3),
  });

  export type ChangeAdminData = hpb.infer<typeof pbMsgChangeAdmin>;

  export class ChangeAdmin {
    static readonly aminoTypeUrl = 'osmosis/tokenfactory/change-admin';
    static readonly protobufTypeUrl = '/osmosis.tokenfactory.v1beta1.MsgChangeAdmin';
    static readonly protobufSchema = pbMsgChangeAdmin;
    constructor(public data: ChangeAdminData) {}
  }

  registerDefaultProtobufSchema(ChangeAdmin);
  registerDefaultAminos(ChangeAdmin);
  //#endregion

  //#region SetDenomMetadata
  export const pbMsgSetDenomMetadata = hpb.message({
    sender: hpb.string(1),
    metadata: hpb.submessage(2, pbMetadata),
  });

  export type SetDenomMetadataData = hpb.infer<typeof pbMsgSetDenomMetadata>;

  export class SetDenomMetadata {
    static readonly protobufTypeUrl = '/osmosis.tokenfactory.v1beta1.MsgSetDenomMetadata';
    static readonly protobufSchema = pbMsgSetDenomMetadata;
    constructor(public data: SetDenomMetadataData) {}
  }

  registerDefaultProtobufSchema(SetDenomMetadata);
  //#endregion

  //#region ForceTransfer
  export const pbMsgForceTransfer = hpb.message({
    sender: hpb.string(1),
    amount: hpb.submessage(2, pbCoin),
    from: hpb.string(3),
    to: hpb.string(4),
  });

  export type ForceTransferData = hpb.infer<typeof pbMsgForceTransfer>;

  export class ForceTransfer {
    static readonly aminoTypeUrl = 'osmosis/tokenfactory/force-transfer';
    static readonly protobufTypeUrl = '/osmosis.tokenfactory.v1beta1.MsgForceTransfer';
    static readonly protobufSchema = pbMsgForceTransfer;
    constructor(public data: ForceTransferData) {}
  }

  registerDefaultProtobufSchema(ForceTransfer);
  registerDefaultAminos(ForceTransfer);
  //#endregion
  //#endregion Messages

  export namespace Query {
    const getApi = (network: CosmosNetworkConfig) => Cosmos.rest(network) as unknown as TokenFactoryRestApi;

    //#region DenomMetadata
    export async function denomMetadata(network: CosmosNetworkConfig, creator: string, subdenom: string) {
      const denom = encodeURIComponent(`factory/${creator}/${subdenom}`);
      const result = await Cosmos.rest(network).cosmos.bank.v1beta1.denoms_metadata[denom]!('GET');
      return result.metadata;
    }
    //#endregion

    //#region Params
    export const pbParamsReq = hpb.message({});

    export const pbParamsRes = hpb.message({
      params: hpb.submessage(1, {
        denomCreationFee: hpb.repeated.submessage(1, pbCoin),
        denomCreationGasConsume: hpb.uint64(2),
      }),
    });

    export async function params(network: CosmosNetworkConfig) {
      return await getApi(network).osmosis.tokenfactory.v1beta1.params('GET');
    }
    //#endregion

    //#region DenomAuthorityMetadata
    export const pbDenomAuthorityMetadataReq = hpb.message({
      denom: hpb.string(1),
    });

    export const pbDenomAuthorityMetadataRes = hpb.message({
      denomAuthorityMetadata: hpb.submessage(1, {
        admin: hpb.string(1),
      }),
    });

    export async function denomAuthorityMetadata(network: CosmosNetworkConfig, denom: string) {
      return await getApi(network).osmosis.tokenfactory.v1beta1[denom]!.authority_metadata('GET');
    }
    //#endregion

    //#region DenomsFromCreator
    export const pbDenomsFromCreatorReq = hpb.message({
      creator: hpb.string(1),
    });

    export const pbDenomsFromCreatorRes = hpb.message({
      denoms: hpb.repeated.string(1),
    });

    export async function denomsFromCreator(network: CosmosNetworkConfig, creator: string) {
      return await getApi(network).osmosis.tokenfactory.v1beta1.denoms_from_creator[creator]!('GET');
    }
    //#endregion
  }
}
