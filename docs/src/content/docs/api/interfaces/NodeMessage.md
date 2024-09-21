---
editUrl: false
next: true
prev: true
title: "NodeMessage"
---

Interface for nodeStats from lavalink

## Extends

- [`NodeStats`](/api/interfaces/nodestats/)

## Properties

| Property | Type | Description | Inherited from | Defined in |
| ------ | ------ | ------ | ------ | ------ |
| `cpu` | [`CPUStats`](/api/interfaces/cpustats/) | The cpu stats for the node. | [`NodeStats`](/api/interfaces/nodestats/).`cpu` | [src/structures/Types/Node.ts:95](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Types/Node.ts#L95) |
| `frameStats` | [`FrameStats`](/api/interfaces/framestats/) | The frame stats for the node. | [`NodeStats`](/api/interfaces/nodestats/).`frameStats` | [src/structures/Types/Node.ts:105](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Types/Node.ts#L105) |
| `guildId` | `string` | The specific guild id for that message | - | [src/structures/Types/Utils.ts:533](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Types/Utils.ts#L533) |
| `memory` | [`MemoryStats`](/api/interfaces/memorystats/) | The memory stats for the node. | [`NodeStats`](/api/interfaces/nodestats/).`memory` | [src/structures/Types/Node.ts:93](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Types/Node.ts#L93) |
| `op` | `"playerUpdate"` \| `"stats"` \| `"event"` | what ops are applying to that event | - | [src/structures/Types/Utils.ts:531](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Types/Utils.ts#L531) |
| `players` | `number` | The amount of players on the node. | [`NodeStats`](/api/interfaces/nodestats/).`players` | [src/structures/Types/Node.ts:87](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Types/Node.ts#L87) |
| `playingPlayers` | `number` | The amount of playing players on the node. | [`NodeStats`](/api/interfaces/nodestats/).`playingPlayers` | [src/structures/Types/Node.ts:89](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Types/Node.ts#L89) |
| `type` | [`PlayerEventType`](/api/type-aliases/playereventtype/) | The type of the event | - | [src/structures/Types/Utils.ts:529](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Types/Utils.ts#L529) |
| `uptime` | `number` | The uptime for the node. | [`NodeStats`](/api/interfaces/nodestats/).`uptime` | [src/structures/Types/Node.ts:91](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Types/Node.ts#L91) |
