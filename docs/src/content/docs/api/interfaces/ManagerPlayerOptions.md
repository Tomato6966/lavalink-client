---
editUrl: false
next: true
prev: true
title: "ManagerPlayerOptions"
---

Sub Manager Options, for player specific things

## Properties

| Property | Type | Description | Defined in |
| ------ | ------ | ------ | ------ |
| `applyVolumeAsFilter?` | `boolean` | Applies the volume via a filter, not via the lavalink volume transformer | [src/structures/Types/Manager.ts:164](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Types/Manager.ts#L164) |
| `clientBasedPositionUpdateInterval?` | `number` | How often it should update the the player Position | [src/structures/Types/Manager.ts:160](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Types/Manager.ts#L160) |
| `defaultSearchPlatform?` | [`SearchPlatform`](/api/type-aliases/searchplatform/) | What should be used as a searchPlatform, if no source was provided during the query | [src/structures/Types/Manager.ts:162](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Types/Manager.ts#L162) |
| `maxErrorsPerTime?` | `object` | Allows you to declare how many tracks are allowed to error/stuck within a time-frame before player is destroyed **Default** `"{threshold: 35000, maxAmount: 3 }"` | [src/structures/Types/Manager.ts:177](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Types/Manager.ts#L177) |
| `maxErrorsPerTime.maxAmount` | `number` | The max amount of errors within the threshold time which are allowed before destroying the player (when errors > maxAmount -> player.destroy()) | [src/structures/Types/Manager.ts:181](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Types/Manager.ts#L181) |
| `maxErrorsPerTime.threshold` | `number` | The threshold time to count errors (recommended is 35s) | [src/structures/Types/Manager.ts:179](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Types/Manager.ts#L179) |
| `minAutoPlayMs?` | `number` | Minimum time to play the song before autoPlayFunction is executed (prevents error spamming) Set to 0 to disable it **Default** `10000` | [src/structures/Types/Manager.ts:175](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Types/Manager.ts#L175) |
| `onDisconnect?` | `object` | What lavalink-client should do when the player reconnects | [src/structures/Types/Manager.ts:168](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Types/Manager.ts#L168) |
| `onDisconnect.autoReconnect?` | `boolean` | Try to reconnect? -> If fails -> Destroy | [src/structures/Types/Manager.ts:170](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Types/Manager.ts#L170) |
| `onDisconnect.destroyPlayer?` | `boolean` | Instantly destroy player (overrides autoReconnect) | Don't provide == disable feature | [src/structures/Types/Manager.ts:172](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Types/Manager.ts#L172) |
| `onEmptyQueue?` | `object` | - | [src/structures/Types/Manager.ts:184](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Types/Manager.ts#L184) |
| `onEmptyQueue.autoPlayFunction?` | (`player`: [`Player`](/api/classes/player/), `lastPlayedTrack`: [`Track`](/api/interfaces/track/)) => `Promise`\<`void`\> | Get's executed onEmptyQueue -> You can do any track queue previous transformations, if you add a track to the queue -> it will play it, if not queueEnd will execute! | [src/structures/Types/Manager.ts:186](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Types/Manager.ts#L186) |
| `onEmptyQueue.destroyAfterMs?` | `number` | - | [src/structures/Types/Manager.ts:188](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Types/Manager.ts#L188) |
| `requesterTransformer?` | (`requester`: `unknown`) => `unknown` | Transforms the saved data of a requested user | [src/structures/Types/Manager.ts:166](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Types/Manager.ts#L166) |
| `useUnresolvedData?` | `boolean` | - | [src/structures/Types/Manager.ts:191](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Types/Manager.ts#L191) |
| `volumeDecrementer?` | `number` | If the Lavalink Volume should be decremented by x number | [src/structures/Types/Manager.ts:158](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Types/Manager.ts#L158) |
