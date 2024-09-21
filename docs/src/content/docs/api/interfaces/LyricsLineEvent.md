---
editUrl: false
next: true
prev: true
title: "LyricsLineEvent"
---

## Extends

- [`PlayerEvent`](/api/interfaces/playerevent/)

## Properties

| Property | Type | Description | Inherited from | Defined in |
| ------ | ------ | ------ | ------ | ------ |
| `guildId` | `string` | The guildId | [`PlayerEvent`](/api/interfaces/playerevent/).`guildId` | [src/structures/Types/Utils.ts:289](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Types/Utils.ts#L289) |
| `line` | [`LyricsLine`](/api/interfaces/lyricsline/) | The line | - | [src/structures/Types/Utils.ts:293](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Types/Utils.ts#L293) |
| `lineIndex` | `number` | The line number | - | [src/structures/Types/Utils.ts:291](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Types/Utils.ts#L291) |
| `op` | `"event"` | - | [`PlayerEvent`](/api/interfaces/playerevent/).`op` | [src/structures/Types/Utils.ts:164](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Types/Utils.ts#L164) |
| `skipped` | `boolean` | skipped is true if the line was skipped | - | [src/structures/Types/Utils.ts:295](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Types/Utils.ts#L295) |
| `type` | `"LyricsLineEvent"` | The lyricsline event | [`PlayerEvent`](/api/interfaces/playerevent/).`type` | [src/structures/Types/Utils.ts:287](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Types/Utils.ts#L287) |
