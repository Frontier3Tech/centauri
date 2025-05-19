# Centauri Token Center
Centauri is a UI for the [TokenFactory Cosmos SDK](https://docs.osmosis.zone/osmosis-core/modules/tokenfactory/)
module, with launchpad features planned for the future.

## Dev Notes
Token creation may require a creation fee. This fee can be queried from the module's parameters:

```
GET /osmosis/tokenfactory/v1beta1/params
```

The following is an example response from Terra 2:

```json
{
  "params": {
    "denom_creation_fee": [
      {
        "denom": "uluna",
        "amount": "10000000"
      }
    ],
    "denom_creation_gas_consume": "1000000",
    "whitelisted_hooks": []
  }
}
```

And another from Neutron:

```json
{
  "params": {
    "denom_creation_fee": [],
    "denom_creation_gas_consume": "0",
    "fee_collector_address": "",
    "whitelisted_hooks": [
      {
        "code_id": "944",
        "denom_creator": "neutron1zlf3hutsa4qnmue53lz2tfxrutp8y2e3rj4nkghg3rupgl4mqy8s5jgxsn"
      }
    ]
  }
}
```

Neutron's TokenFactory module has been forked from the original Osmosis one. Injective's has not,
and is thus not compatible.
