---
editUrl: false
next: true
prev: true
title: "Queue"
---

## Constructors

### new Queue()

```ts
new Queue(
   guildId: string, 
   data: Partial<StoredQueue>, 
   QueueSaver?: QueueSaver, 
   queueOptions?: ManagerQueueOptions): Queue
```

Create a new Queue

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `guildId` | `string` | The guild ID |
| `data` | `Partial`\<[`StoredQueue`](/api/interfaces/storedqueue/)\> | The data to initialize the queue with |
| `QueueSaver`? | [`QueueSaver`](/api/classes/queuesaver/) | The queue saver to use |
| `queueOptions`? | [`ManagerQueueOptions`](/api/interfaces/managerqueueoptions/) |  |

#### Returns

[`Queue`](/api/classes/queue/)

#### Defined in

[src/structures/Queue.ts:132](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Queue.ts#L132)

## Properties

| Property | Modifier | Type | Default value | Description | Defined in |
| ------ | ------ | ------ | ------ | ------ | ------ |
| `current` | `public` | [`Track`](/api/interfaces/track/) | `null` | - | [src/structures/Queue.ts:118](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Queue.ts#L118) |
| `options` | `public` | `object` | `undefined` | - | [src/structures/Queue.ts:119](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Queue.ts#L119) |
| `options.maxPreviousTracks` | `public` | `number` | `25` | - | [src/structures/Queue.ts:119](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Queue.ts#L119) |
| `previous` | `readonly` | [`Track`](/api/interfaces/track/)[] | `[]` | - | [src/structures/Queue.ts:117](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Queue.ts#L117) |
| `tracks` | `readonly` | ([`UnresolvedTrack`](/api/interfaces/unresolvedtrack/) \| [`Track`](/api/interfaces/track/))[] | `[]` | - | [src/structures/Queue.ts:116](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Queue.ts#L116) |
| `utils` | `public` | `object` | `undefined` | Utils for a Queue | [src/structures/Queue.ts:148](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Queue.ts#L148) |
| `utils.destroy` | `public` | () => `Promise`\<`unknown`\> | `undefined` | - | [src/structures/Queue.ts:173](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Queue.ts#L173) |
| `utils.save` | `public` | () => `Promise`\<`unknown`\> | `undefined` | Save the current cached Queue on the database/server (overides the server) | [src/structures/Queue.ts:152](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Queue.ts#L152) |
| `utils.sync` | `public` | (`override`: `boolean`, `dontSyncCurrent`: `boolean`) => `Promise`\<`void`\> | `undefined` | Sync the current queue database/server with the cached one | [src/structures/Queue.ts:161](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Queue.ts#L161) |
| `utils.toJSON` | `public` | () => [`StoredQueue`](/api/interfaces/storedqueue/) | `undefined` | - | [src/structures/Queue.ts:181](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Queue.ts#L181) |
| `utils.totalDuration` | `public` | () => `number` | `undefined` | Get the Total Duration of the Queue-Songs summed up | [src/structures/Queue.ts:194](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Queue.ts#L194) |

## Methods

### add()

```ts
add(TrackOrTracks: UnresolvedTrack | Track | (UnresolvedTrack | Track)[], index?: number): any
```

Add a Track to the Queue, and after saved in the "db" it returns the amount of the Tracks

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `TrackOrTracks` | [`UnresolvedTrack`](/api/interfaces/unresolvedtrack/) \| [`Track`](/api/interfaces/track/) \| ([`UnresolvedTrack`](/api/interfaces/unresolvedtrack/) \| [`Track`](/api/interfaces/track/))[] |  |
| `index`? | `number` | At what position to add the Track |

#### Returns

`any`

Queue-Size (for the next Tracks)

#### Defined in

[src/structures/Queue.ts:231](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Queue.ts#L231)

***

### remove()

```ts
remove<T>(removeQueryTrack: T): Promise<object>
```

Remove stuff from the queue.tracks array
 - single Track | UnresolvedTrack
 - multiple Track | UnresovedTrack
 - at the index or multiple indexes

#### Type Parameters

| Type Parameter |
| ------ |
| `T` *extends* \| `number` \| [`UnresolvedTrack`](/api/interfaces/unresolvedtrack/) \| [`UnresolvedTrack`](/api/interfaces/unresolvedtrack/)[] \| `number`[] \| [`Track`](/api/interfaces/track/) \| [`Track`](/api/interfaces/track/)[] \| (`number` \| [`UnresolvedTrack`](/api/interfaces/unresolvedtrack/) \| [`Track`](/api/interfaces/track/))[] |

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `removeQueryTrack` | `T` |  |

#### Returns

`Promise`\<`object`\>

null (if nothing was removed) / { removed } where removed is an array with all removed elements

| Name | Type | Defined in |
| ------ | ------ | ------ |
| `removed` | ([`UnresolvedTrack`](/api/interfaces/unresolvedtrack/) \| [`Track`](/api/interfaces/track/))[] | [src/structures/Queue.ts:305](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Queue.ts#L305) |

#### Example

```js
// remove single track

const track = player.queue.tracks[4];
await player.queue.remove(track);

// if you already have the index you can straight up pass it too
await player.queue.remove(4);

// if you want to remove multiple tracks, e.g. from position 4 to position 10 you can do smt like this
await player.queue.remove(player.queue.tracks.slice(4, 10)) // get's the tracks from 4 - 10, which then get's found in the remove function to be removed

// I still highly suggest to use .splice!

await player.queue.splice(4, 10); // removes at index 4, 10 tracks

await player.queue.splice(1, 1); // removes at index 1, 1 track

await player.queue.splice(4, 0, ...tracks) // removes 0 tracks at position 4, and then inserts all tracks after position 4.
```

#### Defined in

[src/structures/Queue.ts:305](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Queue.ts#L305)

***

### shiftPrevious()

```ts
shiftPrevious(): Promise<Track>
```

Shifts the previous array, to return the last previous track & thus remove it from the previous queue

#### Returns

`Promise`\<[`Track`](/api/interfaces/track/)\>

#### Example

```js
// example on how to play the previous track again
const previous = await player.queue.shiftPrevious(); // get the previous track and remove it from the previous queue array!!
if(!previous) return console.error("No previous track found");
await player.play({ clientTrack: previous }); // play it again
```

#### Defined in

[src/structures/Queue.ts:398](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Queue.ts#L398)

***

### shuffle()

```ts
shuffle(): Promise<number>
```

Shuffles the current Queue, then saves it

#### Returns

`Promise`\<`number`\>

Amount of Tracks in the Queue

#### Defined in

[src/structures/Queue.ts:203](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Queue.ts#L203)

***

### splice()

```ts
splice(
   index: number, 
   amount: number, 
   TrackOrTracks?: UnresolvedTrack | Track | (UnresolvedTrack | Track)[]): any
```

Splice the tracks in the Queue

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `index` | `number` | Where to remove the Track |
| `amount` | `number` | How many Tracks to remove? |
| `TrackOrTracks`? | [`UnresolvedTrack`](/api/interfaces/unresolvedtrack/) \| [`Track`](/api/interfaces/track/) \| ([`UnresolvedTrack`](/api/interfaces/unresolvedtrack/) \| [`Track`](/api/interfaces/track/))[] | Want to Add more Tracks? |

#### Returns

`any`

Spliced Track

#### Defined in

[src/structures/Queue.ts:253](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Queue.ts#L253)
