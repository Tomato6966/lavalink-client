---
editUrl: false
next: true
prev: true
title: "RoutePlanner"
---

## Properties

| Property | Type | Description | Defined in |
| ------ | ------ | ------ | ------ |
| `class?` | [`RoutePlannerTypes`](/api/type-aliases/routeplannertypes/) | - | [src/structures/Types/Utils.ts:395](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Types/Utils.ts#L395) |
| `details?` | `object` | - | [src/structures/Types/Utils.ts:396](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Types/Utils.ts#L396) |
| `details.blockIndex?` | `string` | The information in which /64 block ips are chosen. This number increases on each ban. | [src/structures/Types/Utils.ts:415](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Types/Utils.ts#L415) |
| `details.currentAddress?` | `string` | The current address being used | [src/structures/Types/Utils.ts:411](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Types/Utils.ts#L411) |
| `details.currentAddressIndex?` | `string` | The current offset in the ip block | [src/structures/Types/Utils.ts:413](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Types/Utils.ts#L413) |
| `details.failingAddresses` | [`FailingAddress`](/api/interfaces/failingaddress/)[] | The failing addresses | [src/structures/Types/Utils.ts:405](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Types/Utils.ts#L405) |
| `details.ipBlock` | `object` | The ip block being used | [src/structures/Types/Utils.ts:398](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Types/Utils.ts#L398) |
| `details.ipBlock.size` | `string` | The size of the ip block | [src/structures/Types/Utils.ts:402](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Types/Utils.ts#L402) |
| `details.ipBlock.type` | `"Inet4Address"` \| `"Inet6Address"` | The type of the ip block | [src/structures/Types/Utils.ts:400](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Types/Utils.ts#L400) |
| `details.ipIndex?` | `string` | The current offset in the block | [src/structures/Types/Utils.ts:409](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Types/Utils.ts#L409) |
| `details.rotateIndex?` | `string` | The number of rotations | [src/structures/Types/Utils.ts:407](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Types/Utils.ts#L407) |
