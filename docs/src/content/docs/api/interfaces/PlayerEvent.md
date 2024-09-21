---
editUrl: false
next: true
prev: true
title: "PlayerEvent"
---

## Extended by

- [`TrackStartEvent`](/api/interfaces/trackstartevent/)
- [`TrackEndEvent`](/api/interfaces/trackendevent/)
- [`TrackExceptionEvent`](/api/interfaces/trackexceptionevent/)
- [`TrackStuckEvent`](/api/interfaces/trackstuckevent/)
- [`WebSocketClosedEvent`](/api/interfaces/websocketclosedevent/)
- [`SponsorBlockSegmentsLoaded`](/api/interfaces/sponsorblocksegmentsloaded/)
- [`SponsorBlockSegmentSkipped`](/api/interfaces/sponsorblocksegmentskipped/)
- [`SponsorBlockChapterStarted`](/api/interfaces/sponsorblockchapterstarted/)
- [`SponsorBlockChaptersLoaded`](/api/interfaces/sponsorblockchaptersloaded/)
- [`LyricsFoundEvent`](/api/interfaces/lyricsfoundevent/)
- [`LyricsNotFoundEvent`](/api/interfaces/lyricsnotfoundevent/)
- [`LyricsLineEvent`](/api/interfaces/lyricslineevent/)

## Properties

| Property | Type | Defined in |
| ------ | ------ | ------ |
| `guildId` | `string` | [src/structures/Types/Utils.ts:166](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Types/Utils.ts#L166) |
| `op` | `"event"` | [src/structures/Types/Utils.ts:164](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Types/Utils.ts#L164) |
| `type` | [`PlayerEventType`](/api/type-aliases/playereventtype/) | [src/structures/Types/Utils.ts:165](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Types/Utils.ts#L165) |
