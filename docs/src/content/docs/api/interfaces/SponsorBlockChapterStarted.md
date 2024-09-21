---
editUrl: false
next: true
prev: true
title: "SponsorBlockChapterStarted"
---

## Extends

- [`PlayerEvent`](/api/interfaces/playerevent/)

## Properties

| Property | Type | Description | Overrides | Inherited from | Defined in |
| ------ | ------ | ------ | ------ | ------ | ------ |
| `chapter` | `object` | The Chapter which started | - | - | [src/structures/Types/Utils.ts:234](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Types/Utils.ts#L234) |
| `chapter.duration` | `number` | - | - | - | [src/structures/Types/Utils.ts:242](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Types/Utils.ts#L242) |
| `chapter.end` | `number` | - | - | - | [src/structures/Types/Utils.ts:240](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Types/Utils.ts#L240) |
| `chapter.name` | `string` | The Name of the Chapter | - | - | [src/structures/Types/Utils.ts:236](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Types/Utils.ts#L236) |
| `chapter.start` | `number` | - | - | - | [src/structures/Types/Utils.ts:238](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Types/Utils.ts#L238) |
| `guildId` | `string` | - | - | [`PlayerEvent`](/api/interfaces/playerevent/).`guildId` | [src/structures/Types/Utils.ts:166](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Types/Utils.ts#L166) |
| `op` | `"event"` | - | - | [`PlayerEvent`](/api/interfaces/playerevent/).`op` | [src/structures/Types/Utils.ts:164](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Types/Utils.ts#L164) |
| `type` | `"ChapterStarted"` | - | [`PlayerEvent`](/api/interfaces/playerevent/).`type` | - | [src/structures/Types/Utils.ts:232](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Types/Utils.ts#L232) |
