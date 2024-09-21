---
editUrl: false
next: true
prev: true
title: "PlayerFilters"
---

The "active" / "disabled" Player Filters

## Properties

| Property | Type | Description | Defined in |
| ------ | ------ | ------ | ------ |
| `audioOutput` | [`AudioOutputs`](/api/type-aliases/audiooutputs/) | audio Output (default stereo, mono sounds the fullest and best for not-stereo tracks) | [src/structures/Types/Filters.ts:26](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Types/Filters.ts#L26) |
| `custom` | `boolean` | Sets nightcore to false, and vaporwave to false | [src/structures/Types/Filters.ts:10](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Types/Filters.ts#L10) |
| `karaoke` | `boolean` | if karaoke filter is enabled / not | [src/structures/Types/Filters.ts:18](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Types/Filters.ts#L18) |
| `lavalinkFilterPlugin` | `object` | Filters for the Lavalink Filter Plugin | [src/structures/Types/Filters.ts:30](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Types/Filters.ts#L30) |
| `lavalinkFilterPlugin.echo` | `boolean` | if echo filter is enabled / not | [src/structures/Types/Filters.ts:32](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Types/Filters.ts#L32) |
| `lavalinkFilterPlugin.reverb` | `boolean` | if reverb filter is enabled / not | [src/structures/Types/Filters.ts:34](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Types/Filters.ts#L34) |
| `lavalinkLavaDspxPlugin` | `object` | - | [src/structures/Types/Filters.ts:36](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Types/Filters.ts#L36) |
| `lavalinkLavaDspxPlugin.echo` | `boolean` | if echo filter is enabled / not | [src/structures/Types/Filters.ts:44](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Types/Filters.ts#L44) |
| `lavalinkLavaDspxPlugin.highPass` | `boolean` | if highPass filter is enabled / not | [src/structures/Types/Filters.ts:40](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Types/Filters.ts#L40) |
| `lavalinkLavaDspxPlugin.lowPass` | `boolean` | if lowPass filter is enabled / not | [src/structures/Types/Filters.ts:38](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Types/Filters.ts#L38) |
| `lavalinkLavaDspxPlugin.normalization` | `boolean` | if normalization filter is enabled / not | [src/structures/Types/Filters.ts:42](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Types/Filters.ts#L42) |
| `lowPass` | `boolean` | - | [src/structures/Types/Filters.ts:24](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Types/Filters.ts#L24) |
| `nightcore` | `boolean` | Sets custom to false, and vaporwave to false | [src/structures/Types/Filters.ts:12](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Types/Filters.ts#L12) |
| `rotation` | `boolean` | If rotation filter is enabled / not | [src/structures/Types/Filters.ts:16](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Types/Filters.ts#L16) |
| `tremolo` | `boolean` | if tremolo filter is enabled / not | [src/structures/Types/Filters.ts:20](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Types/Filters.ts#L20) |
| `vaporwave` | `boolean` | Sets custom to false, and nightcore to false | [src/structures/Types/Filters.ts:14](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Types/Filters.ts#L14) |
| `vibrato` | `boolean` | if vibrato filter is enabled / not | [src/structures/Types/Filters.ts:22](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Types/Filters.ts#L22) |
| `volume` | `boolean` | Lavalink Volume FILTER (not player Volume, think of it as a gain booster) | [src/structures/Types/Filters.ts:28](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Types/Filters.ts#L28) |
