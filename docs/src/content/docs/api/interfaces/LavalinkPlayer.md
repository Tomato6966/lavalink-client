---
editUrl: false
next: true
prev: true
title: "LavalinkPlayer"
---

## Properties

| Property | Type | Description | Defined in |
| ------ | ------ | ------ | ------ |
| `filters` | `Partial`\<[`LavalinkFilterData`](/api/interfaces/lavalinkfilterdata/)\> | All Audio Filters | [src/structures/Types/Utils.ts:463](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Types/Utils.ts#L463) |
| `guildId` | `string` | Guild Id of the player | [src/structures/Types/Utils.ts:453](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Types/Utils.ts#L453) |
| `paused` | `boolean` | Wether it's paused or not | [src/structures/Types/Utils.ts:459](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Types/Utils.ts#L459) |
| `state` | `object` | Lavalink-Voice-State Variables | [src/structures/Types/Utils.ts:465](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Types/Utils.ts#L465) |
| `state.connected` | `boolean` | COnnected or not | [src/structures/Types/Utils.ts:471](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Types/Utils.ts#L471) |
| `state.ping` | `number` | Ping to voice server | [src/structures/Types/Utils.ts:473](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Types/Utils.ts#L473) |
| `state.position` | `number` | Position of the track | [src/structures/Types/Utils.ts:469](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Types/Utils.ts#L469) |
| `state.time` | `number` | Time since connection established | [src/structures/Types/Utils.ts:467](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Types/Utils.ts#L467) |
| `track?` | [`LavalinkTrack`](/api/interfaces/lavalinktrack/) | IF playing a track, all of the track information | [src/structures/Types/Utils.ts:455](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Types/Utils.ts#L455) |
| `voice` | [`LavalinkPlayerVoice`](/api/interfaces/lavalinkplayervoice/) | Voice Endpoint data | [src/structures/Types/Utils.ts:461](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Types/Utils.ts#L461) |
| `volume` | `number` | Lavalink volume (mind volumedecrementer) | [src/structures/Types/Utils.ts:457](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Types/Utils.ts#L457) |
