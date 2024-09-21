---
editUrl: false
next: true
prev: true
title: "Player"
---

## Constructors

### new Player()

```ts
new Player(options: PlayerOptions, LavalinkManager: LavalinkManager): Player
```

Create a new Player

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `options` | [`PlayerOptions`](/api/interfaces/playeroptions/) |  |
| `LavalinkManager` | [`LavalinkManager`](/api/classes/lavalinkmanager/) |  |

#### Returns

[`Player`](/api/classes/player/)

#### Defined in

[src/structures/Player.ts:82](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Player.ts#L82)

## Properties

| Property | Modifier | Type | Default value | Description | Defined in |
| ------ | ------ | ------ | ------ | ------ | ------ |
| `connected` | `public` | `boolean` | `false` | The Player Connection's State (from Lavalink) | [src/structures/Player.ts:67](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Player.ts#L67) |
| `createdTimeStamp` | `public` | `number` | `undefined` | When the player was created [Timestamp in Ms] (from lavalink) | [src/structures/Player.ts:65](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Player.ts#L65) |
| `filterManager` | `public` | [`FilterManager`](/api/classes/filtermanager/) | `undefined` | Filter Manager per player | [src/structures/Player.ts:18](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Player.ts#L18) |
| `guildId` | `public` | `string` | `undefined` | The Guild Id of the Player | [src/structures/Player.ts:29](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Player.ts#L29) |
| `lastPosition` | `public` | `number` | `0` | The current Positin of the player (from Lavalink) | [src/structures/Player.ts:60](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Player.ts#L60) |
| `lastPositionChange` | `public` | `number` | `null` | The timestamp when the last position change update happened | [src/structures/Player.ts:58](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Player.ts#L58) |
| `lastSavedPosition` | `public` | `number` | `0` | - | [src/structures/Player.ts:62](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Player.ts#L62) |
| `LavalinkManager` | `public` | [`LavalinkManager`](/api/classes/lavalinkmanager/) | `undefined` | circular reference to the lavalink Manager from the Player for easier use | [src/structures/Player.ts:20](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Player.ts#L20) |
| `lavalinkVolume` | `public` | `number` | `100` | The Volume Lavalink actually is outputting | [src/structures/Player.ts:51](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Player.ts#L51) |
| `node` | `public` | [`LavalinkNode`](/api/classes/lavalinknode/) | `undefined` | The lavalink node assigned the the player, don't change it manually | [src/structures/Player.ts:24](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Player.ts#L24) |
| `options` | `public` | [`PlayerOptions`](/api/interfaces/playeroptions/) | `undefined` | Player options currently used, mutation doesn't affect player's state | [src/structures/Player.ts:22](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Player.ts#L22) |
| `paused` | `public` | `boolean` | `false` | States if the Bot is paused or not | [src/structures/Player.ts:37](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Player.ts#L37) |
| `ping` | `public` | `object` | `undefined` | Player's ping | [src/structures/Player.ts:41](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Player.ts#L41) |
| `ping.lavalink` | `public` | `number` | `0` | - | [src/structures/Player.ts:43](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Player.ts#L43) |
| `ping.ws` | `public` | `number` | `0` | - | [src/structures/Player.ts:45](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Player.ts#L45) |
| `playing` | `public` | `boolean` | `false` | States if the Bot is supposed to be outputting audio | [src/structures/Player.ts:35](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Player.ts#L35) |
| `queue` | `public` | [`Queue`](/api/classes/queue/) | `undefined` | The queue from the player | [src/structures/Player.ts:26](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Player.ts#L26) |
| `repeatMode` | `public` | [`RepeatMode`](/api/type-aliases/repeatmode/) | `"off"` | Repeat Mode of the Player | [src/structures/Player.ts:39](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Player.ts#L39) |
| `textChannelId` | `public` | `string` | `null` | The Text Channel Id of the Player | [src/structures/Player.ts:33](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Player.ts#L33) |
| `voice` | `public` | [`LavalinkPlayerVoiceOptions`](/api/type-aliases/lavalinkplayervoiceoptions/) | `undefined` | Voice Server Data (from Lavalink) | [src/structures/Player.ts:69](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Player.ts#L69) |
| `voiceChannelId` | `public` | `string` | `null` | The Voice Channel Id of the Player | [src/structures/Player.ts:31](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Player.ts#L31) |
| `volume` | `public` | `number` | `100` | The Display Volume | [src/structures/Player.ts:49](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Player.ts#L49) |

## Accessors

### position

```ts
get position(): number
```

The current Positin of the player (Calculated)

#### Returns

`number`

#### Defined in

[src/structures/Player.ts:54](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Player.ts#L54)

## Methods

### changeNode()

```ts
changeNode(newNode: string | LavalinkNode): Promise<string>
```

Move the player on a different Audio-Node

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `newNode` | `string` \| [`LavalinkNode`](/api/classes/lavalinknode/) | New Node / New Node Id |

#### Returns

`Promise`\<`string`\>

#### Defined in

[src/structures/Player.ts:697](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Player.ts#L697)

***

### changeVoiceState()

```ts
changeVoiceState(data: object): Promise<Player>
```

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `data` | `object` |
| `data.selfDeaf`? | `boolean` |
| `data.selfMute`? | `boolean` |
| `data.voiceChannelId`? | `string` |

#### Returns

`Promise`\<[`Player`](/api/classes/player/)\>

#### Defined in

[src/structures/Player.ts:556](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Player.ts#L556)

***

### clearData()

```ts
clearData(): Player
```

CLears all the custom data.

#### Returns

[`Player`](/api/classes/player/)

#### Defined in

[src/structures/Player.ts:145](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Player.ts#L145)

***

### connect()

```ts
connect(): Promise<Player>
```

Connects the Player to the Voice Channel

#### Returns

`Promise`\<[`Player`](/api/classes/player/)\>

#### Defined in

[src/structures/Player.ts:538](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Player.ts#L538)

***

### deleteSponsorBlock()

```ts
deleteSponsorBlock(): Promise<void>
```

Delete the SponsorBlock

#### Returns

`Promise`\<`void`\>

#### Defined in

[src/structures/Player.ts:402](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Player.ts#L402)

***

### destroy()

```ts
destroy(reason?: string, disconnect?: boolean): Promise<Player>
```

Destroy the player and disconnect from the voice channel

#### Parameters

| Parameter | Type | Default value |
| ------ | ------ | ------ |
| `reason`? | `string` | `undefined` |
| `disconnect`? | `boolean` | `true` |

#### Returns

`Promise`\<[`Player`](/api/classes/player/)\>

#### Defined in

[src/structures/Player.ts:605](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Player.ts#L605)

***

### disconnect()

```ts
disconnect(force: boolean): Promise<Player>
```

Disconnects the Player from the Voice Channel, but keeps the player in the cache

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `force` | `boolean` | `false` | If false it throws an error, if player thinks it's already disconnected |

#### Returns

`Promise`\<[`Player`](/api/classes/player/)\>

#### Defined in

[src/structures/Player.ts:584](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Player.ts#L584)

***

### get()

```ts
get<T>(key: string): T
```

Get custom data.

#### Type Parameters

| Type Parameter |
| ------ |
| `T` |

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `key` | `string` |  |

#### Returns

`T`

#### Defined in

[src/structures/Player.ts:138](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Player.ts#L138)

***

### getAllData()

```ts
getAllData(): Record<string, unknown>
```

Get all custom Data

#### Returns

`Record`\<`string`, `unknown`\>

#### Defined in

[src/structures/Player.ts:157](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Player.ts#L157)

***

### getCurrentLyrics()

```ts
getCurrentLyrics(skipTrackSource?: boolean): Promise<LyricsResult>
```

Get the current lyrics of the track currently playing on the guild

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `skipTrackSource`? | `boolean` | If true, it will not try to get the lyrics from the track source |

#### Returns

`Promise`\<[`LyricsResult`](/api/interfaces/lyricsresult/)\>

The current lyrics

#### Example

```ts
const lyrics = await player.getCurrentLyrics();
```

#### Defined in

[src/structures/Player.ts:649](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Player.ts#L649)

***

### getLyrics()

```ts
getLyrics(track: Track, skipTrackSource?: boolean): Promise<LyricsResult>
```

Get the lyrics of a specific track

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `track` | [`Track`](/api/interfaces/track/) | The track to get the lyrics for |
| `skipTrackSource`? | `boolean` | If true, it will not try to get the lyrics from the track source |

#### Returns

`Promise`\<[`LyricsResult`](/api/interfaces/lyricsresult/)\>

The lyrics of the track

#### Example

```ts
const lyrics = await player.getLyrics(player.queue.tracks[0], true);
```

#### Defined in

[src/structures/Player.ts:663](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Player.ts#L663)

***

### getSponsorBlock()

```ts
getSponsorBlock(): Promise<SponsorBlockSegment[]>
```

Get the SponsorBlock

#### Returns

`Promise`\<[`SponsorBlockSegment`](/api/type-aliases/sponsorblocksegment/)[]\>

#### Defined in

[src/structures/Player.ts:396](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Player.ts#L396)

***

### lavaSearch()

```ts
lavaSearch(
   query: LavaSearchQuery, 
   requestUser: unknown, 
throwOnEmpty: boolean): Promise<SearchResult | LavaSearchResponse>
```

Search for a track

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `query` | [`LavaSearchQuery`](/api/type-aliases/lavasearchquery/) | `undefined` | The query to search for |
| `requestUser` | `unknown` | `undefined` | The user that requested the track |
| `throwOnEmpty` | `boolean` | `false` | If an error should be thrown if no track is found |

#### Returns

`Promise`\<[`SearchResult`](/api/interfaces/searchresult/) \| [`LavaSearchResponse`](/api/interfaces/lavasearchresponse/)\>

The search result

#### Defined in

[src/structures/Player.ts:383](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Player.ts#L383)

***

### pause()

```ts
pause(): Promise<Player>
```

Pause the player

#### Returns

`Promise`\<[`Player`](/api/classes/player/)\>

#### Defined in

[src/structures/Player.ts:430](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Player.ts#L430)

***

### play()

```ts
play(options: Partial<PlayOptions>): any
```

Play the next track from the queue / a specific track, with playoptions for Lavalink

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `options` | `Partial`\<[`PlayOptions`](/api/interfaces/playoptions/)\> |  |

#### Returns

`any`

#### Defined in

[src/structures/Player.ts:165](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Player.ts#L165)

***

### resume()

```ts
resume(): Promise<Player>
```

Resume the Player

#### Returns

`Promise`\<[`Player`](/api/classes/player/)\>

#### Defined in

[src/structures/Player.ts:443](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Player.ts#L443)

***

### search()

```ts
search(
   query: SearchQuery, 
   requestUser: unknown, 
throwOnEmpty: boolean): Promise<UnresolvedSearchResult | SearchResult>
```

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `query` | [`SearchQuery`](/api/type-aliases/searchquery/) | `undefined` | Query for your data |
| `requestUser` | `unknown` | `undefined` |  |
| `throwOnEmpty` | `boolean` | `false` | - |

#### Returns

`Promise`\<[`UnresolvedSearchResult`](/api/interfaces/unresolvedsearchresult/) \| [`SearchResult`](/api/interfaces/searchresult/)\>

#### Defined in

[src/structures/Player.ts:410](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Player.ts#L410)

***

### seek()

```ts
seek(position: number): Promise<Player>
```

Seek to a specific Position

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `position` | `number` |  |

#### Returns

`Promise`\<[`Player`](/api/classes/player/)\>

#### Defined in

[src/structures/Player.ts:456](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Player.ts#L456)

***

### set()

```ts
set(key: string, value: unknown): Player
```

Set custom data.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `key` | `string` |  |
| `value` | `unknown` |  |

#### Returns

[`Player`](/api/classes/player/)

#### Defined in

[src/structures/Player.ts:129](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Player.ts#L129)

***

### setRepeatMode()

```ts
setRepeatMode(repeatMode: RepeatMode): Promise<Player>
```

Set the Repeatmode of the Player

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `repeatMode` | [`RepeatMode`](/api/type-aliases/repeatmode/) |  |

#### Returns

`Promise`\<[`Player`](/api/classes/player/)\>

#### Defined in

[src/structures/Player.ts:481](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Player.ts#L481)

***

### setSponsorBlock()

```ts
setSponsorBlock(segments: SponsorBlockSegment[]): Promise<void>
```

Set the SponsorBlock

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `segments` | [`SponsorBlockSegment`](/api/type-aliases/sponsorblocksegment/)[] | The segments to set |

#### Returns

`Promise`\<`void`\>

#### Defined in

[src/structures/Player.ts:390](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Player.ts#L390)

***

### setVolume()

```ts
setVolume(volume: number, ignoreVolumeDecrementer: boolean): Promise<Player>
```

Set the Volume for the Player

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `volume` | `number` | `undefined` | The Volume in percent |
| `ignoreVolumeDecrementer` | `boolean` | `false` | If it should ignore the volumedecrementer option |

#### Returns

`Promise`\<[`Player`](/api/classes/player/)\>

#### Defined in

[src/structures/Player.ts:348](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Player.ts#L348)

***

### skip()

```ts
skip(skipTo: number, throwError: boolean): Promise<Player>
```

Skip the current song, or a specific amount of songs

#### Parameters

| Parameter | Type | Default value |
| ------ | ------ | ------ |
| `skipTo` | `number` | `0` |
| `throwError` | `boolean` | `true` |

#### Returns

`Promise`\<[`Player`](/api/classes/player/)\>

#### Defined in

[src/structures/Player.ts:491](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Player.ts#L491)

***

### stopPlaying()

```ts
stopPlaying(clearQueue: boolean, executeAutoplay: boolean): Promise<Player>
```

Clears the queue and stops playing. Does not destroy the Player and not leave the channel

#### Parameters

| Parameter | Type | Default value |
| ------ | ------ | ------ |
| `clearQueue` | `boolean` | `true` |
| `executeAutoplay` | `boolean` | `false` |

#### Returns

`Promise`\<[`Player`](/api/classes/player/)\>

#### Defined in

[src/structures/Player.ts:514](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Player.ts#L514)

***

### subscribeLyrics()

```ts
subscribeLyrics(): Promise<any>
```

Subscribe to the lyrics event on a specific guild to active live lyrics events

#### Returns

`Promise`\<`any`\>

The unsubscribe function

#### Example

```ts
const lyrics = await player.subscribeLyrics();
```

#### Defined in

[src/structures/Player.ts:676](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Player.ts#L676)

***

### toJSON()

```ts
toJSON(): PlayerJson
```

Converts the Player including Queue to a Json state

#### Returns

[`PlayerJson`](/api/interfaces/playerjson/)

#### Defined in

[src/structures/Player.ts:739](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Player.ts#L739)

***

### unsubscribeLyrics()

```ts
unsubscribeLyrics(guildId: string): Promise<any>
```

Unsubscribe from the lyrics event on a specific guild to disable live lyrics events

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `guildId` | `string` | The guild id to unsubscribe from |

#### Returns

`Promise`\<`any`\>

The unsubscribe function

#### Example

```ts
const lyrics = await player.unsubscribeLyrics();
```

#### Defined in

[src/structures/Player.ts:689](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Player.ts#L689)
