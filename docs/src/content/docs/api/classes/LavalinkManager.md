---
editUrl: false
next: true
prev: true
title: "LavalinkManager"
---

## Extends

- `EventEmitter`

## Constructors

### new LavalinkManager()

```ts
new LavalinkManager(options: ManagerOptions): LavalinkManager
```

Create the Lavalink Manager

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `options` | [`ManagerOptions`](/api/interfaces/manageroptions/) |  |

#### Returns

[`LavalinkManager`](/api/classes/lavalinkmanager/)

#### Example

```ts
//const client = new Client({...}); // create your BOT Client (e.g. via discord.js)
client.lavalink = new LavalinkManager({
  nodes: [
    {
      authorization: "yourverystrongpassword",
      host: "localhost",
      port: 2333,
      id: "testnode"
    },
    sendToShard(guildId, payload) => client.guilds.cache.get(guildId)?.shard?.send(payload),
    client: {
      id: process.env.CLIENT_ID,
      username: "TESTBOT"
    },
    // optional Options:
    autoSkip: true,
    playerOptions: {
      applyVolumeAsFilter: false,
      clientBasedPositionUpdateInterval: 150,
      defaultSearchPlatform: "ytmsearch",
      volumeDecrementer: 0.75,
      //requesterTransformer: YourRequesterTransformerFunction,
      onDisconnect: {
        autoReconnect: true,
        destroyPlayer: false
      },
      onEmptyQueue: {
        destroyAfterMs: 30_000,
        //autoPlayFunction: YourAutoplayFunction,
      },
      useUnresolvedData: true
    },
    queueOptions: {
      maxPreviousTracks: 25,
      //queueStore: yourCustomQueueStoreManagerClass,
      //queueChangesWatcher: yourCustomQueueChangesWatcherClass
    },
    linksBlacklist: [],
    linksWhitelist: [],
    advancedOptions: {
      maxFilterFixDuration: 600_000,
      debugOptions: {
        noAudio: false,
        playerDestroy: {
          dontThrowError: false,
          debugLogs: false
        }
      }
    }
  ]
})
```

#### Overrides

`EventEmitter.constructor`

#### Defined in

[src/structures/LavalinkManager.ts:235](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/LavalinkManager.ts#L235)

## Properties

| Property | Modifier | Type | Default value | Description | Inherited from | Defined in |
| ------ | ------ | ------ | ------ | ------ | ------ | ------ |
| `initiated` | `public` | `boolean` | `false` | Wether the manager was initiated or not | - | [src/structures/LavalinkManager.ts:74](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/LavalinkManager.ts#L74) |
| `nodeManager` | `public` | [`NodeManager`](/api/classes/nodemanager/) | `undefined` | LavalinkManager's NodeManager to manage all Nodes | - | [src/structures/LavalinkManager.ts:70](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/LavalinkManager.ts#L70) |
| `options` | `public` | [`ManagerOptions`](/api/interfaces/manageroptions/) | `undefined` | The Options of LavalinkManager (changeable) | - | [src/structures/LavalinkManager.ts:68](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/LavalinkManager.ts#L68) |
| `players` | `readonly` | [`MiniMap`](/api/classes/minimap/)\<`string`, [`Player`](/api/classes/player/)\> | `undefined` | All Players stored in a MiniMap | - | [src/structures/LavalinkManager.ts:76](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/LavalinkManager.ts#L76) |
| `utils` | `public` | [`ManagerUtils`](/api/classes/managerutils/) | `undefined` | LavalinkManager's Utils Class | - | [src/structures/LavalinkManager.ts:72](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/LavalinkManager.ts#L72) |
| `captureRejections` | `static` | `boolean` | `undefined` | Value: [boolean](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Change the default `captureRejections` option on all new `EventEmitter` objects. **Since** v13.4.0, v12.16.0 | `EventEmitter.captureRejections` | node\_modules/.pnpm/@types+node@22.5.5/node\_modules/@types/node/events.d.ts:459 |
| `captureRejectionSymbol` | `readonly` | *typeof* `captureRejectionSymbol` | `undefined` | Value: `Symbol.for('nodejs.rejection')` See how to write a custom `rejection handler`. **Since** v13.4.0, v12.16.0 | `EventEmitter.captureRejectionSymbol` | node\_modules/.pnpm/@types+node@22.5.5/node\_modules/@types/node/events.d.ts:452 |
| `defaultMaxListeners` | `static` | `number` | `undefined` | By default, a maximum of `10` listeners can be registered for any single event. This limit can be changed for individual `EventEmitter` instances using the `emitter.setMaxListeners(n)` method. To change the default for _all_`EventEmitter` instances, the `events.defaultMaxListeners` property can be used. If this value is not a positive number, a `RangeError` is thrown. Take caution when setting the `events.defaultMaxListeners` because the change affects _all_ `EventEmitter` instances, including those created before the change is made. However, calling `emitter.setMaxListeners(n)` still has precedence over `events.defaultMaxListeners`. This is not a hard limit. The `EventEmitter` instance will allow more listeners to be added but will output a trace warning to stderr indicating that a "possible EventEmitter memory leak" has been detected. For any single `EventEmitter`, the `emitter.getMaxListeners()` and `emitter.setMaxListeners()` methods can be used to temporarily avoid this warning: `import { EventEmitter } from 'node:events'; const emitter = new EventEmitter(); emitter.setMaxListeners(emitter.getMaxListeners() + 1); emitter.once('event', () => { // do stuff emitter.setMaxListeners(Math.max(emitter.getMaxListeners() - 1, 0)); });` The `--trace-warnings` command-line flag can be used to display the stack trace for such warnings. The emitted warning can be inspected with `process.on('warning')` and will have the additional `emitter`, `type`, and `count` properties, referring to the event emitter instance, the event's name and the number of attached listeners, respectively. Its `name` property is set to `'MaxListenersExceededWarning'`. **Since** v0.11.2 | `EventEmitter.defaultMaxListeners` | node\_modules/.pnpm/@types+node@22.5.5/node\_modules/@types/node/events.d.ts:498 |
| `errorMonitor` | `readonly` | *typeof* `errorMonitor` | `undefined` | This symbol shall be used to install a listener for only monitoring `'error'` events. Listeners installed using this symbol are called before the regular `'error'` listeners are called. Installing a listener using this symbol does not change the behavior once an `'error'` event is emitted. Therefore, the process will still crash if no regular `'error'` listener is installed. **Since** v13.6.0, v12.17.0 | `EventEmitter.errorMonitor` | node\_modules/.pnpm/@types+node@22.5.5/node\_modules/@types/node/events.d.ts:445 |

## Accessors

### useable

```ts
get useable(): boolean
```

Checks wether the the lib is useable based on if any node is connected

#### Example

```ts
if(!client.lavalink.useable) return console.error("can'T search yet, because there is no useable lavalink node.")
// continue with code e.g. createing a player and searching
```

#### Returns

`boolean`

#### Defined in

[src/structures/LavalinkManager.ts:357](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/LavalinkManager.ts#L357)

## Methods

### \[captureRejectionSymbol\]()?

```ts
optional [captureRejectionSymbol]<K>(
   error: Error, 
   event: string | symbol, ...
   args: AnyRest): void
```

#### Type Parameters

| Type Parameter |
| ------ |
| `K` |

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `error` | `Error` |
| `event` | `string` \| `symbol` |
| ...`args` | `AnyRest` |

#### Returns

`void`

#### Inherited from

`EventEmitter.[captureRejectionSymbol]`

#### Defined in

node\_modules/.pnpm/@types+node@22.5.5/node\_modules/@types/node/events.d.ts:136

***

### addListener()

```ts
addListener<K>(eventName: string | symbol, listener: (...args: any[]) => void): this
```

Alias for `emitter.on(eventName, listener)`.

#### Type Parameters

| Type Parameter |
| ------ |
| `K` |

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `eventName` | `string` \| `symbol` |
| `listener` | (...`args`: `any`[]) => `void` |

#### Returns

`this`

#### Since

v0.1.26

#### Inherited from

`EventEmitter.addListener`

#### Defined in

node\_modules/.pnpm/@types+node@22.5.5/node\_modules/@types/node/events.d.ts:597

***

### createPlayer()

```ts
createPlayer(options: PlayerOptions): Player
```

Create a Music-Player. If a player exists, then it returns it before creating a new one

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `options` | [`PlayerOptions`](/api/interfaces/playeroptions/) |  |

#### Returns

[`Player`](/api/classes/player/)

#### Example

```ts
const player = client.lavalink.createPlayer({
  guildId: interaction.guildId,
  voiceChannelId: interaction.member.voice.channelId,
  // everything below is optional
  textChannelId: interaction.channelId,
  volume: 100,
  selfDeaf: true,
  selfMute: false,
  instaUpdateFiltersFix: true,
  applyVolumeAsFilter: false
  //only needed if you want to autopick node by region (configured by you)
  // vcRegion: interaction.member.voice.rtcRegion,
  // provide a specific node
  // node: client.lavalink.nodeManager.leastUsedNodes("memory")[0]
});
```

#### Defined in

[src/structures/LavalinkManager.ts:292](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/LavalinkManager.ts#L292)

***

### deletePlayer()

```ts
deletePlayer(guildId: string): boolean
```

Delete's a player from the cache without destroying it on lavalink (only works when it's disconnected)

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `guildId` | `string` |  |

#### Returns

`boolean`

#### Example

```ts
client.lavalink.deletePlayer(interaction.guildId);
// shouldn't be used except you know what you are doing.
```

#### Defined in

[src/structures/LavalinkManager.ts:331](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/LavalinkManager.ts#L331)

***

### destroyPlayer()

```ts
destroyPlayer(guildId: string, destroyReason?: string): Promise<Player>
```

Destroy a player with optional destroy reason and disconnect it from the voice channel

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `guildId` | `string` |  |
| `destroyReason`? | `string` |  |

#### Returns

`Promise`\<[`Player`](/api/classes/player/)\>

#### Example

```ts
client.lavalink.destroyPlayer(interaction.guildId, "forcefully destroyed the player");
// recommend to do it on the player tho: player.destroy("forcefully destroyed the player");
```

#### Defined in

[src/structures/LavalinkManager.ts:314](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/LavalinkManager.ts#L314)

***

### emit()

```ts
emit<Event>(event: Event, ...args: Parameters<LavalinkManagerEvents[Event]>): boolean
```

Emit an event

#### Type Parameters

| Type Parameter |
| ------ |
| `Event` *extends* keyof [`LavalinkManagerEvents`](/api/interfaces/lavalinkmanagerevents/) |

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `event` | `Event` | The event to emit |
| ...`args` | `Parameters`\<[`LavalinkManagerEvents`](/api/interfaces/lavalinkmanagerevents/)\[`Event`\]\> | The arguments to pass to the event |

#### Returns

`boolean`

#### Overrides

`EventEmitter.emit`

#### Defined in

[src/structures/LavalinkManager.ts:23](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/LavalinkManager.ts#L23)

***

### eventNames()

```ts
eventNames(): (string | symbol)[]
```

Returns an array listing the events for which the emitter has registered
listeners. The values in the array are strings or `Symbol`s.

```js
import { EventEmitter } from 'node:events';

const myEE = new EventEmitter();
myEE.on('foo', () => {});
myEE.on('bar', () => {});

const sym = Symbol('symbol');
myEE.on(sym, () => {});

console.log(myEE.eventNames());
// Prints: [ 'foo', 'bar', Symbol(symbol) ]
```

#### Returns

(`string` \| `symbol`)[]

#### Since

v6.0.0

#### Inherited from

`EventEmitter.eventNames`

#### Defined in

node\_modules/.pnpm/@types+node@22.5.5/node\_modules/@types/node/events.d.ts:922

***

### getMaxListeners()

```ts
getMaxListeners(): number
```

Returns the current max listener value for the `EventEmitter` which is either
set by `emitter.setMaxListeners(n)` or defaults to [defaultMaxListeners](LavalinkManager.md).

#### Returns

`number`

#### Since

v1.0.0

#### Inherited from

`EventEmitter.getMaxListeners`

#### Defined in

node\_modules/.pnpm/@types+node@22.5.5/node\_modules/@types/node/events.d.ts:774

***

### getPlayer()

```ts
getPlayer(guildId: string): Player
```

Get a Player from Lava

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `guildId` | `string` | The guildId of the player |

#### Returns

[`Player`](/api/classes/player/)

#### Example

```ts
const player = client.lavalink.getPlayer(interaction.guildId);
```
A quicker and easier way than doing:
```ts
const player = client.lavalink.players.get(interaction.guildId);
```

#### Defined in

[src/structures/LavalinkManager.ts:264](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/LavalinkManager.ts#L264)

***

### init()

```ts
init(clientData: BotClientOptions): Promise<LavalinkManager>
```

Initiates the Manager, creates all nodes and connects all of them

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `clientData` | [`BotClientOptions`](/api/interfaces/botclientoptions/) |  |

#### Returns

`Promise`\<[`LavalinkManager`](/api/classes/lavalinkmanager/)\>

#### Example

```ts
// on the bot ready event
client.on("ready", () => {
  client.lavalink.init({
    id: client.user.id,
    username: client.user.username
  });
});
```

#### Defined in

[src/structures/LavalinkManager.ts:376](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/LavalinkManager.ts#L376)

***

### listenerCount()

```ts
listenerCount<K>(eventName: string | symbol, listener?: Function): number
```

Returns the number of listeners listening for the event named `eventName`.
If `listener` is provided, it will return how many times the listener is found
in the list of the listeners of the event.

#### Type Parameters

| Type Parameter |
| ------ |
| `K` |

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `eventName` | `string` \| `symbol` | The name of the event being listened for |
| `listener`? | `Function` | The event handler function |

#### Returns

`number`

#### Since

v3.2.0

#### Inherited from

`EventEmitter.listenerCount`

#### Defined in

node\_modules/.pnpm/@types+node@22.5.5/node\_modules/@types/node/events.d.ts:868

***

### listeners()

```ts
listeners<K>(eventName: string | symbol): Function[]
```

Returns a copy of the array of listeners for the event named `eventName`.

```js
server.on('connection', (stream) => {
  console.log('someone connected!');
});
console.log(util.inspect(server.listeners('connection')));
// Prints: [ [Function] ]
```

#### Type Parameters

| Type Parameter |
| ------ |
| `K` |

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `eventName` | `string` \| `symbol` |

#### Returns

`Function`[]

#### Since

v0.1.26

#### Inherited from

`EventEmitter.listeners`

#### Defined in

node\_modules/.pnpm/@types+node@22.5.5/node\_modules/@types/node/events.d.ts:787

***

### off()

```ts
off<Event>(event: Event, listener: LavalinkManagerEvents[Event]): this
```

Remove an event listener

#### Type Parameters

| Type Parameter |
| ------ |
| `Event` *extends* keyof [`LavalinkManagerEvents`](/api/interfaces/lavalinkmanagerevents/) |

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `event` | `Event` | The event to remove the listener from |
| `listener` | [`LavalinkManagerEvents`](/api/interfaces/lavalinkmanagerevents/)\[`Event`\] | The listener to remove |

#### Returns

`this`

#### Overrides

`EventEmitter.off`

#### Defined in

[src/structures/LavalinkManager.ts:53](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/LavalinkManager.ts#L53)

***

### on()

```ts
on<Event>(event: Event, listener: LavalinkManagerEvents[Event]): this
```

Add an event listener

#### Type Parameters

| Type Parameter |
| ------ |
| `Event` *extends* keyof [`LavalinkManagerEvents`](/api/interfaces/lavalinkmanagerevents/) |

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `event` | `Event` | The event to listen to |
| `listener` | [`LavalinkManagerEvents`](/api/interfaces/lavalinkmanagerevents/)\[`Event`\] | The listener to add |

#### Returns

`this`

#### Overrides

`EventEmitter.on`

#### Defined in

[src/structures/LavalinkManager.ts:33](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/LavalinkManager.ts#L33)

***

### once()

```ts
once<Event>(event: Event, listener: LavalinkManagerEvents[Event]): this
```

Add an event listener that only fires once

#### Type Parameters

| Type Parameter |
| ------ |
| `Event` *extends* keyof [`LavalinkManagerEvents`](/api/interfaces/lavalinkmanagerevents/) |

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `event` | `Event` | The event to listen to |
| `listener` | [`LavalinkManagerEvents`](/api/interfaces/lavalinkmanagerevents/)\[`Event`\] | The listener to add |

#### Returns

`this`

#### Overrides

`EventEmitter.once`

#### Defined in

[src/structures/LavalinkManager.ts:43](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/LavalinkManager.ts#L43)

***

### prependListener()

```ts
prependListener<K>(eventName: string | symbol, listener: (...args: any[]) => void): this
```

Adds the `listener` function to the _beginning_ of the listeners array for the
event named `eventName`. No checks are made to see if the `listener` has
already been added. Multiple calls passing the same combination of `eventName`
and `listener` will result in the `listener` being added, and called, multiple times.

```js
server.prependListener('connection', (stream) => {
  console.log('someone connected!');
});
```

Returns a reference to the `EventEmitter`, so that calls can be chained.

#### Type Parameters

| Type Parameter |
| ------ |
| `K` |

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `eventName` | `string` \| `symbol` | The name of the event. |
| `listener` | (...`args`: `any`[]) => `void` | The callback function |

#### Returns

`this`

#### Since

v6.0.0

#### Inherited from

`EventEmitter.prependListener`

#### Defined in

node\_modules/.pnpm/@types+node@22.5.5/node\_modules/@types/node/events.d.ts:886

***

### prependOnceListener()

```ts
prependOnceListener<K>(eventName: string | symbol, listener: (...args: any[]) => void): this
```

Adds a **one-time**`listener` function for the event named `eventName` to the _beginning_ of the listeners array. The next time `eventName` is triggered, this
listener is removed, and then invoked.

```js
server.prependOnceListener('connection', (stream) => {
  console.log('Ah, we have our first user!');
});
```

Returns a reference to the `EventEmitter`, so that calls can be chained.

#### Type Parameters

| Type Parameter |
| ------ |
| `K` |

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `eventName` | `string` \| `symbol` | The name of the event. |
| `listener` | (...`args`: `any`[]) => `void` | The callback function |

#### Returns

`this`

#### Since

v6.0.0

#### Inherited from

`EventEmitter.prependOnceListener`

#### Defined in

node\_modules/.pnpm/@types+node@22.5.5/node\_modules/@types/node/events.d.ts:902

***

### rawListeners()

```ts
rawListeners<K>(eventName: string | symbol): Function[]
```

Returns a copy of the array of listeners for the event named `eventName`,
including any wrappers (such as those created by `.once()`).

```js
import { EventEmitter } from 'node:events';
const emitter = new EventEmitter();
emitter.once('log', () => console.log('log once'));

// Returns a new Array with a function `onceWrapper` which has a property
// `listener` which contains the original listener bound above
const listeners = emitter.rawListeners('log');
const logFnWrapper = listeners[0];

// Logs "log once" to the console and does not unbind the `once` event
logFnWrapper.listener();

// Logs "log once" to the console and removes the listener
logFnWrapper();

emitter.on('log', () => console.log('log persistently'));
// Will return a new Array with a single function bound by `.on()` above
const newListeners = emitter.rawListeners('log');

// Logs "log persistently" twice
newListeners[0]();
emitter.emit('log');
```

#### Type Parameters

| Type Parameter |
| ------ |
| `K` |

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `eventName` | `string` \| `symbol` |

#### Returns

`Function`[]

#### Since

v9.4.0

#### Inherited from

`EventEmitter.rawListeners`

#### Defined in

node\_modules/.pnpm/@types+node@22.5.5/node\_modules/@types/node/events.d.ts:818

***

### removeAllListeners()

```ts
removeAllListeners(eventName?: string | symbol): this
```

Removes all listeners, or those of the specified `eventName`.

It is bad practice to remove listeners added elsewhere in the code,
particularly when the `EventEmitter` instance was created by some other
component or module (e.g. sockets or file streams).

Returns a reference to the `EventEmitter`, so that calls can be chained.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `eventName`? | `string` \| `symbol` |

#### Returns

`this`

#### Since

v0.1.26

#### Inherited from

`EventEmitter.removeAllListeners`

#### Defined in

node\_modules/.pnpm/@types+node@22.5.5/node\_modules/@types/node/events.d.ts:758

***

### removeListener()

```ts
removeListener<Event>(event: Event, listener: LavalinkManagerEvents[Event]): this
```

Remove an event listener

#### Type Parameters

| Type Parameter |
| ------ |
| `Event` *extends* keyof [`LavalinkManagerEvents`](/api/interfaces/lavalinkmanagerevents/) |

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `event` | `Event` | The event to remove the listener from |
| `listener` | [`LavalinkManagerEvents`](/api/interfaces/lavalinkmanagerevents/)\[`Event`\] | The listener to remove |

#### Returns

`this`

#### Overrides

`EventEmitter.removeListener`

#### Defined in

[src/structures/LavalinkManager.ts:63](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/LavalinkManager.ts#L63)

***

### sendRawData()

```ts
sendRawData(data: ChannelDeletePacket | VoiceState | VoiceServer | VoicePacket): Promise<void>
```

Sends voice data to the Lavalink server.
! Without this the library won't work

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `data` | [`ChannelDeletePacket`](/api/interfaces/channeldeletepacket/) \| [`VoiceState`](/api/interfaces/voicestate/) \| [`VoiceServer`](/api/interfaces/voiceserver/) \| [`VoicePacket`](/api/interfaces/voicepacket/) |  |

#### Returns

`Promise`\<`void`\>

#### Example

```ts
// on the bot "raw" event
client.on("raw", (d) => {
  // required in order to send audio updates and register channel deletion etc.
  client.lavalink.sendRawData(d)
})
```

#### Defined in

[src/structures/LavalinkManager.ts:421](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/LavalinkManager.ts#L421)

***

### setMaxListeners()

```ts
setMaxListeners(n: number): this
```

By default `EventEmitter`s will print a warning if more than `10` listeners are
added for a particular event. This is a useful default that helps finding
memory leaks. The `emitter.setMaxListeners()` method allows the limit to be
modified for this specific `EventEmitter` instance. The value can be set to `Infinity` (or `0`) to indicate an unlimited number of listeners.

Returns a reference to the `EventEmitter`, so that calls can be chained.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `n` | `number` |

#### Returns

`this`

#### Since

v0.3.5

#### Inherited from

`EventEmitter.setMaxListeners`

#### Defined in

node\_modules/.pnpm/@types+node@22.5.5/node\_modules/@types/node/events.d.ts:768

***

### addAbortListener()

```ts
static addAbortListener(signal: AbortSignal, resource: (event: Event) => void): Disposable
```

Listens once to the `abort` event on the provided `signal`.

Listening to the `abort` event on abort signals is unsafe and may
lead to resource leaks since another third party with the signal can
call `e.stopImmediatePropagation()`. Unfortunately Node.js cannot change
this since it would violate the web standard. Additionally, the original
API makes it easy to forget to remove listeners.

This API allows safely using `AbortSignal`s in Node.js APIs by solving these
two issues by listening to the event such that `stopImmediatePropagation` does
not prevent the listener from running.

Returns a disposable so that it may be unsubscribed from more easily.

```js
import { addAbortListener } from 'node:events';

function example(signal) {
  let disposable;
  try {
    signal.addEventListener('abort', (e) => e.stopImmediatePropagation());
    disposable = addAbortListener(signal, (e) => {
      // Do something when signal is aborted.
    });
  } finally {
    disposable?.[Symbol.dispose]();
  }
}
```

:::caution[Experimental]
This API should not be used in production and may be trimmed from a public release.
:::

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `signal` | `AbortSignal` |
| `resource` | (`event`: `Event`) => `void` |

#### Returns

`Disposable`

Disposable that removes the `abort` listener.

#### Since

v20.5.0

#### Inherited from

`EventEmitter.addAbortListener`

#### Defined in

node\_modules/.pnpm/@types+node@22.5.5/node\_modules/@types/node/events.d.ts:437

***

### getEventListeners()

```ts
static getEventListeners(emitter: EventEmitter<DefaultEventMap> | EventTarget, name: string | symbol): Function[]
```

Returns a copy of the array of listeners for the event named `eventName`.

For `EventEmitter`s this behaves exactly the same as calling `.listeners` on
the emitter.

For `EventTarget`s this is the only way to get the event listeners for the
event target. This is useful for debugging and diagnostic purposes.

```js
import { getEventListeners, EventEmitter } from 'node:events';

{
  const ee = new EventEmitter();
  const listener = () => console.log('Events are fun');
  ee.on('foo', listener);
  console.log(getEventListeners(ee, 'foo')); // [ [Function: listener] ]
}
{
  const et = new EventTarget();
  const listener = () => console.log('Events are fun');
  et.addEventListener('foo', listener);
  console.log(getEventListeners(et, 'foo')); // [ [Function: listener] ]
}
```

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `emitter` | `EventEmitter`\<`DefaultEventMap`\> \| `EventTarget` |
| `name` | `string` \| `symbol` |

#### Returns

`Function`[]

#### Since

v15.2.0, v14.17.0

#### Inherited from

`EventEmitter.getEventListeners`

#### Defined in

node\_modules/.pnpm/@types+node@22.5.5/node\_modules/@types/node/events.d.ts:358

***

### getMaxListeners()

```ts
static getMaxListeners(emitter: EventEmitter<DefaultEventMap> | EventTarget): number
```

Returns the currently set max amount of listeners.

For `EventEmitter`s this behaves exactly the same as calling `.getMaxListeners` on
the emitter.

For `EventTarget`s this is the only way to get the max event listeners for the
event target. If the number of event handlers on a single EventTarget exceeds
the max set, the EventTarget will print a warning.

```js
import { getMaxListeners, setMaxListeners, EventEmitter } from 'node:events';

{
  const ee = new EventEmitter();
  console.log(getMaxListeners(ee)); // 10
  setMaxListeners(11, ee);
  console.log(getMaxListeners(ee)); // 11
}
{
  const et = new EventTarget();
  console.log(getMaxListeners(et)); // 10
  setMaxListeners(11, et);
  console.log(getMaxListeners(et)); // 11
}
```

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `emitter` | `EventEmitter`\<`DefaultEventMap`\> \| `EventTarget` |

#### Returns

`number`

#### Since

v19.9.0

#### Inherited from

`EventEmitter.getMaxListeners`

#### Defined in

node\_modules/.pnpm/@types+node@22.5.5/node\_modules/@types/node/events.d.ts:387

***

### ~~listenerCount()~~

```ts
static listenerCount(emitter: EventEmitter<DefaultEventMap>, eventName: string | symbol): number
```

A class method that returns the number of listeners for the given `eventName` registered on the given `emitter`.

```js
import { EventEmitter, listenerCount } from 'node:events';

const myEmitter = new EventEmitter();
myEmitter.on('event', () => {});
myEmitter.on('event', () => {});
console.log(listenerCount(myEmitter, 'event'));
// Prints: 2
```

:::caution[Deprecated]
Since v3.2.0 - Use `listenerCount` instead.
:::

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `emitter` | `EventEmitter`\<`DefaultEventMap`\> | The emitter to query |
| `eventName` | `string` \| `symbol` | The event name |

#### Returns

`number`

#### Since

v0.9.12

#### Inherited from

`EventEmitter.listenerCount`

#### Defined in

node\_modules/.pnpm/@types+node@22.5.5/node\_modules/@types/node/events.d.ts:330

***

### on()

#### on(emitter, eventName, options)

```ts
static on(
   emitter: EventEmitter<DefaultEventMap>, 
   eventName: string | symbol, 
options?: StaticEventEmitterIteratorOptions): AsyncIterableIterator<any[], any, any>
```

```js
import { on, EventEmitter } from 'node:events';
import process from 'node:process';

const ee = new EventEmitter();

// Emit later on
process.nextTick(() => {
  ee.emit('foo', 'bar');
  ee.emit('foo', 42);
});

for await (const event of on(ee, 'foo')) {
  // The execution of this inner block is synchronous and it
  // processes one event at a time (even with await). Do not use
  // if concurrent execution is required.
  console.log(event); // prints ['bar'] [42]
}
// Unreachable here
```

Returns an `AsyncIterator` that iterates `eventName` events. It will throw
if the `EventEmitter` emits `'error'`. It removes all listeners when
exiting the loop. The `value` returned by each iteration is an array
composed of the emitted event arguments.

An `AbortSignal` can be used to cancel waiting on events:

```js
import { on, EventEmitter } from 'node:events';
import process from 'node:process';

const ac = new AbortController();

(async () => {
  const ee = new EventEmitter();

  // Emit later on
  process.nextTick(() => {
    ee.emit('foo', 'bar');
    ee.emit('foo', 42);
  });

  for await (const event of on(ee, 'foo', { signal: ac.signal })) {
    // The execution of this inner block is synchronous and it
    // processes one event at a time (even with await). Do not use
    // if concurrent execution is required.
    console.log(event); // prints ['bar'] [42]
  }
  // Unreachable here
})();

process.nextTick(() => ac.abort());
```

Use the `close` option to specify an array of event names that will end the iteration:

```js
import { on, EventEmitter } from 'node:events';
import process from 'node:process';

const ee = new EventEmitter();

// Emit later on
process.nextTick(() => {
  ee.emit('foo', 'bar');
  ee.emit('foo', 42);
  ee.emit('close');
});

for await (const event of on(ee, 'foo', { close: ['close'] })) {
  console.log(event); // prints ['bar'] [42]
}
// the loop will exit after 'close' is emitted
console.log('done'); // prints 'done'
```

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `emitter` | `EventEmitter`\<`DefaultEventMap`\> |
| `eventName` | `string` \| `symbol` |
| `options`? | `StaticEventEmitterIteratorOptions` |

##### Returns

`AsyncIterableIterator`\<`any`[], `any`, `any`\>

An `AsyncIterator` that iterates `eventName` events emitted by the `emitter`

##### Since

v13.6.0, v12.16.0

##### Inherited from

`EventEmitter.on`

##### Defined in

node\_modules/.pnpm/@types+node@22.5.5/node\_modules/@types/node/events.d.ts:303

#### on(emitter, eventName, options)

```ts
static on(
   emitter: EventTarget, 
   eventName: string, 
options?: StaticEventEmitterIteratorOptions): AsyncIterableIterator<any[], any, any>
```

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `emitter` | `EventTarget` |
| `eventName` | `string` |
| `options`? | `StaticEventEmitterIteratorOptions` |

##### Returns

`AsyncIterableIterator`\<`any`[], `any`, `any`\>

##### Inherited from

`EventEmitter.on`

##### Defined in

node\_modules/.pnpm/@types+node@22.5.5/node\_modules/@types/node/events.d.ts:308

***

### once()

#### once(emitter, eventName, options)

```ts
static once(
   emitter: EventEmitter<DefaultEventMap>, 
   eventName: string | symbol, 
options?: StaticEventEmitterOptions): Promise<any[]>
```

Creates a `Promise` that is fulfilled when the `EventEmitter` emits the given
event or that is rejected if the `EventEmitter` emits `'error'` while waiting.
The `Promise` will resolve with an array of all the arguments emitted to the
given event.

This method is intentionally generic and works with the web platform [EventTarget](https://dom.spec.whatwg.org/#interface-eventtarget) interface, which has no special`'error'` event
semantics and does not listen to the `'error'` event.

```js
import { once, EventEmitter } from 'node:events';
import process from 'node:process';

const ee = new EventEmitter();

process.nextTick(() => {
  ee.emit('myevent', 42);
});

const [value] = await once(ee, 'myevent');
console.log(value);

const err = new Error('kaboom');
process.nextTick(() => {
  ee.emit('error', err);
});

try {
  await once(ee, 'myevent');
} catch (err) {
  console.error('error happened', err);
}
```

The special handling of the `'error'` event is only used when `events.once()` is used to wait for another event. If `events.once()` is used to wait for the
'`error'` event itself, then it is treated as any other kind of event without
special handling:

```js
import { EventEmitter, once } from 'node:events';

const ee = new EventEmitter();

once(ee, 'error')
  .then(([err]) => console.log('ok', err.message))
  .catch((err) => console.error('error', err.message));

ee.emit('error', new Error('boom'));

// Prints: ok boom
```

An `AbortSignal` can be used to cancel waiting for the event:

```js
import { EventEmitter, once } from 'node:events';

const ee = new EventEmitter();
const ac = new AbortController();

async function foo(emitter, event, signal) {
  try {
    await once(emitter, event, { signal });
    console.log('event emitted!');
  } catch (error) {
    if (error.name === 'AbortError') {
      console.error('Waiting for the event was canceled!');
    } else {
      console.error('There was an error', error.message);
    }
  }
}

foo(ee, 'foo', ac.signal);
ac.abort(); // Abort waiting for the event
ee.emit('foo'); // Prints: Waiting for the event was canceled!
```

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `emitter` | `EventEmitter`\<`DefaultEventMap`\> |
| `eventName` | `string` \| `symbol` |
| `options`? | `StaticEventEmitterOptions` |

##### Returns

`Promise`\<`any`[]\>

##### Since

v11.13.0, v10.16.0

##### Inherited from

`EventEmitter.once`

##### Defined in

node\_modules/.pnpm/@types+node@22.5.5/node\_modules/@types/node/events.d.ts:217

#### once(emitter, eventName, options)

```ts
static once(
   emitter: EventTarget, 
   eventName: string, 
options?: StaticEventEmitterOptions): Promise<any[]>
```

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `emitter` | `EventTarget` |
| `eventName` | `string` |
| `options`? | `StaticEventEmitterOptions` |

##### Returns

`Promise`\<`any`[]\>

##### Inherited from

`EventEmitter.once`

##### Defined in

node\_modules/.pnpm/@types+node@22.5.5/node\_modules/@types/node/events.d.ts:222

***

### setMaxListeners()

```ts
static setMaxListeners(n?: number, ...eventTargets?: (EventEmitter<DefaultEventMap> | EventTarget)[]): void
```

```js
import { setMaxListeners, EventEmitter } from 'node:events';

const target = new EventTarget();
const emitter = new EventEmitter();

setMaxListeners(5, target, emitter);
```

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `n`? | `number` | A non-negative number. The maximum number of listeners per `EventTarget` event. |
| ...`eventTargets`? | (`EventEmitter`\<`DefaultEventMap`\> \| `EventTarget`)[] | - |

#### Returns

`void`

#### Since

v15.4.0

#### Inherited from

`EventEmitter.setMaxListeners`

#### Defined in

node\_modules/.pnpm/@types+node@22.5.5/node\_modules/@types/node/events.d.ts:402
