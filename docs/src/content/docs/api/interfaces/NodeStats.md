---
editUrl: false
next: true
prev: true
title: "NodeStats"
---

Interface for nodeStats from lavalink

## Extends

- [`BaseNodeStats`](/api/interfaces/basenodestats/)

## Extended by

- [`NodeMessage`](/api/interfaces/nodemessage/)

## Properties

| Property | Type | Description | Overrides | Inherited from | Defined in |
| ------ | ------ | ------ | ------ | ------ | ------ |
| `cpu` | [`CPUStats`](/api/interfaces/cpustats/) | The cpu stats for the node. | - | [`BaseNodeStats`](/api/interfaces/basenodestats/).`cpu` | [src/structures/Types/Node.ts:95](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Types/Node.ts#L95) |
| `frameStats` | [`FrameStats`](/api/interfaces/framestats/) | The frame stats for the node. | [`BaseNodeStats`](/api/interfaces/basenodestats/).`frameStats` | - | [src/structures/Types/Node.ts:105](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Types/Node.ts#L105) |
| `memory` | [`MemoryStats`](/api/interfaces/memorystats/) | The memory stats for the node. | - | [`BaseNodeStats`](/api/interfaces/basenodestats/).`memory` | [src/structures/Types/Node.ts:93](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Types/Node.ts#L93) |
| `players` | `number` | The amount of players on the node. | - | [`BaseNodeStats`](/api/interfaces/basenodestats/).`players` | [src/structures/Types/Node.ts:87](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Types/Node.ts#L87) |
| `playingPlayers` | `number` | The amount of playing players on the node. | - | [`BaseNodeStats`](/api/interfaces/basenodestats/).`playingPlayers` | [src/structures/Types/Node.ts:89](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Types/Node.ts#L89) |
| `uptime` | `number` | The uptime for the node. | - | [`BaseNodeStats`](/api/interfaces/basenodestats/).`uptime` | [src/structures/Types/Node.ts:91](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Types/Node.ts#L91) |
