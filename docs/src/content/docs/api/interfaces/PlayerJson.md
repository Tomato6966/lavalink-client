---
editUrl: false
next: true
prev: true
title: "PlayerJson"
---

## Properties

| Property | Type | Description | Defined in |
| ------ | ------ | ------ | ------ |
| `createdTimeStamp?` | `number` | When the player was created | [src/structures/Types/Player.ts:36](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Types/Player.ts#L36) |
| `equalizer` | [`EQBand`](/api/interfaces/eqband/)[] | Equalizer Bands used in lavalink | [src/structures/Types/Player.ts:47](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Types/Player.ts#L47) |
| `filters` | [`FilterData`](/api/interfaces/filterdata/) | All current used fitlers Data | [src/structures/Types/Player.ts:38](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Types/Player.ts#L38) |
| `guildId` | `string` | Guild Id where the player was playing in | [src/structures/Types/Player.ts:12](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Types/Player.ts#L12) |
| `lastPosition` | `number` | Lavalink's position the player was at | [src/structures/Types/Player.ts:22](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Types/Player.ts#L22) |
| `lastPositionChange` | `number` | Last time the position was sent from lavalink | [src/structures/Types/Player.ts:24](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Types/Player.ts#L24) |
| `lavalinkVolume` | `number` | Real Volume used in lavalink (with the volumeDecrementer) | [src/structures/Types/Player.ts:28](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Types/Player.ts#L28) |
| `nodeId?` | `string` | The Id of the last used node | [src/structures/Types/Player.ts:49](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Types/Player.ts#L49) |
| `nodeSessionId?` | `string` | The SessionId of the node | [src/structures/Types/Player.ts:51](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Types/Player.ts#L51) |
| `options` | [`PlayerOptions`](/api/interfaces/playeroptions/) | Options provided to the player | [src/structures/Types/Player.ts:14](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Types/Player.ts#L14) |
| `paused` | `boolean` | Pause state | [src/structures/Types/Player.ts:32](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Types/Player.ts#L32) |
| `ping` | `object` | The player's ping object | [src/structures/Types/Player.ts:40](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Types/Player.ts#L40) |
| `ping.lavalink` | `number` | Avg. calc. Ping to the lavalink server | [src/structures/Types/Player.ts:44](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Types/Player.ts#L44) |
| `ping.ws` | `number` | Ping to the voice websocket server | [src/structures/Types/Player.ts:42](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Types/Player.ts#L42) |
| `playing` | `boolean` | Wether the player was playing or not | [src/structures/Types/Player.ts:34](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Types/Player.ts#L34) |
| `position` | `number` | Position the player was at | [src/structures/Types/Player.ts:20](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Types/Player.ts#L20) |
| `repeatMode` | [`RepeatMode`](/api/type-aliases/repeatmode/) | The repeatmode from the player | [src/structures/Types/Player.ts:30](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Types/Player.ts#L30) |
| `textChannelId?` | `string` | Text Channel Id the player was synced to | [src/structures/Types/Player.ts:18](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Types/Player.ts#L18) |
| `voiceChannelId` | `string` | Voice Channel Id the player was playing in | [src/structures/Types/Player.ts:16](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Types/Player.ts#L16) |
| `volume` | `number` | Volume in % from the player (without volumeDecrementer) | [src/structures/Types/Player.ts:26](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Types/Player.ts#L26) |
