---
editUrl: false
next: true
prev: true
title: "QueueChangesWatcher"
---

## Properties

| Property | Type | Description | Defined in |
| ------ | ------ | ------ | ------ |
| `shuffled` | (`guildId`: `string`, `oldStoredQueue`: [`StoredQueue`](/api/interfaces/storedqueue/), `newStoredQueue`: [`StoredQueue`](/api/interfaces/storedqueue/)) => `void` | Set a value inside a guildId (MUST BE UNPARSED) | [src/structures/Types/Queue.ts:38](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Types/Queue.ts#L38) |
| `tracksAdd` | (`guildId`: `string`, `tracks`: ([`UnresolvedTrack`](/api/interfaces/unresolvedtrack/) \| [`Track`](/api/interfaces/track/))[], `position`: `number`, `oldStoredQueue`: [`StoredQueue`](/api/interfaces/storedqueue/), `newStoredQueue`: [`StoredQueue`](/api/interfaces/storedqueue/)) => `void` | get a Value (MUST RETURN UNPARSED!) | [src/structures/Types/Queue.ts:34](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Types/Queue.ts#L34) |
| `tracksRemoved` | (`guildId`: `string`, `tracks`: ([`UnresolvedTrack`](/api/interfaces/unresolvedtrack/) \| [`Track`](/api/interfaces/track/))[], `position`: `number` \| `number`[], `oldStoredQueue`: [`StoredQueue`](/api/interfaces/storedqueue/), `newStoredQueue`: [`StoredQueue`](/api/interfaces/storedqueue/)) => `void` | Set a value inside a guildId (MUST BE UNPARSED) | [src/structures/Types/Queue.ts:36](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Types/Queue.ts#L36) |
