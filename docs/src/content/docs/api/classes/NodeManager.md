---
editUrl: false
next: true
prev: true
title: "NodeManager"
---

## Extends

- `EventEmitter`

## Constructors

### new NodeManager()

```ts
new NodeManager(LavalinkManager: LavalinkManager): NodeManager
```

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `LavalinkManager` | [`LavalinkManager`](/api/classes/lavalinkmanager/) | The LavalinkManager that created this NodeManager |

#### Returns

[`NodeManager`](/api/classes/nodemanager/)

#### Overrides

`EventEmitter.constructor`

#### Defined in

[src/structures/NodeManager.ts:73](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/NodeManager.ts#L73)

## Properties

| Property | Modifier | Type | Description | Inherited from | Defined in |
| ------ | ------ | ------ | ------ | ------ | ------ |
| `LavalinkManager` | `public` | [`LavalinkManager`](/api/classes/lavalinkmanager/) | The LavalinkManager that created this NodeManager | - | [src/structures/NodeManager.ts:64](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/NodeManager.ts#L64) |
| `nodes` | `public` | [`MiniMap`](/api/classes/minimap/)\<`string`, [`LavalinkNode`](/api/classes/lavalinknode/)\> | A map of all nodes in the nodeManager | - | [src/structures/NodeManager.ts:68](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/NodeManager.ts#L68) |
| `captureRejections` | `static` | `boolean` | Value: [boolean](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Change the default `captureRejections` option on all new `EventEmitter` objects. **Since** v13.4.0, v12.16.0 | `EventEmitter.captureRejections` | node\_modules/.pnpm/@types+node@22.5.5/node\_modules/@types/node/events.d.ts:459 |
| `captureRejectionSymbol` | `readonly` | *typeof* `captureRejectionSymbol` | Value: `Symbol.for('nodejs.rejection')` See how to write a custom `rejection handler`. **Since** v13.4.0, v12.16.0 | `EventEmitter.captureRejectionSymbol` | node\_modules/.pnpm/@types+node@22.5.5/node\_modules/@types/node/events.d.ts:452 |
| `defaultMaxListeners` | `static` | `number` | By default, a maximum of `10` listeners can be registered for any single event. This limit can be changed for individual `EventEmitter` instances using the `emitter.setMaxListeners(n)` method. To change the default for _all_`EventEmitter` instances, the `events.defaultMaxListeners` property can be used. If this value is not a positive number, a `RangeError` is thrown. Take caution when setting the `events.defaultMaxListeners` because the change affects _all_ `EventEmitter` instances, including those created before the change is made. However, calling `emitter.setMaxListeners(n)` still has precedence over `events.defaultMaxListeners`. This is not a hard limit. The `EventEmitter` instance will allow more listeners to be added but will output a trace warning to stderr indicating that a "possible EventEmitter memory leak" has been detected. For any single `EventEmitter`, the `emitter.getMaxListeners()` and `emitter.setMaxListeners()` methods can be used to temporarily avoid this warning: `import { EventEmitter } from 'node:events'; const emitter = new EventEmitter(); emitter.setMaxListeners(emitter.getMaxListeners() + 1); emitter.once('event', () => { // do stuff emitter.setMaxListeners(Math.max(emitter.getMaxListeners() - 1, 0)); });` The `--trace-warnings` command-line flag can be used to display the stack trace for such warnings. The emitted warning can be inspected with `process.on('warning')` and will have the additional `emitter`, `type`, and `count` properties, referring to the event emitter instance, the event's name and the number of attached listeners, respectively. Its `name` property is set to `'MaxListenersExceededWarning'`. **Since** v0.11.2 | `EventEmitter.defaultMaxListeners` | node\_modules/.pnpm/@types+node@22.5.5/node\_modules/@types/node/events.d.ts:498 |
| `errorMonitor` | `readonly` | *typeof* `errorMonitor` | This symbol shall be used to install a listener for only monitoring `'error'` events. Listeners installed using this symbol are called before the regular `'error'` listeners are called. Installing a listener using this symbol does not change the behavior once an `'error'` event is emitted. Therefore, the process will still crash if no regular `'error'` listener is installed. **Since** v13.6.0, v12.17.0 | `EventEmitter.errorMonitor` | node\_modules/.pnpm/@types+node@22.5.5/node\_modules/@types/node/events.d.ts:445 |

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

### connectAll()

```ts
connectAll(): Promise<number>
```

Connects all not connected nodes

#### Returns

`Promise`\<`number`\>

Amount of connected Nodes

#### Defined in

[src/structures/NodeManager.ts:103](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/NodeManager.ts#L103)

***

### createNode()

```ts
createNode(options: LavalinkNodeOptions): LavalinkNode
```

Create a node and add it to the nodeManager

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `options` | [`LavalinkNodeOptions`](/api/interfaces/lavalinknodeoptions/) | The options for the node |

#### Returns

[`LavalinkNode`](/api/classes/lavalinknode/)

The node that was created

#### Defined in

[src/structures/NodeManager.ts:136](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/NodeManager.ts#L136)

***

### deleteNode()

```ts
deleteNode(node: string | LavalinkNode): void
```

Delete a node from the nodeManager and destroy it

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `node` | `string` \| [`LavalinkNode`](/api/classes/lavalinknode/) | The node to delete |

#### Returns

`void`

#### Defined in

[src/structures/NodeManager.ts:193](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/NodeManager.ts#L193)

***

### disconnectAll()

```ts
disconnectAll(deleteAllNodes: boolean): Promise<number>
```

Disconnects all Nodes from lavalink ws sockets

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `deleteAllNodes` | `boolean` | `false` | if the nodes should also be deleted from nodeManager.nodes |

#### Returns

`Promise`\<`number`\>

amount of disconnected Nodes

#### Defined in

[src/structures/NodeManager.ts:87](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/NodeManager.ts#L87)

***

### emit()

```ts
emit<Event>(event: Event, ...args: Parameters<NodeManagerEvents[Event]>): boolean
```

Emit an event

#### Type Parameters

| Type Parameter |
| ------ |
| `Event` *extends* keyof [`NodeManagerEvents`](/api/interfaces/nodemanagerevents/) |

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `event` | `Event` | The event to emit |
| ...`args` | `Parameters`\<[`NodeManagerEvents`](/api/interfaces/nodemanagerevents/)\[`Event`\]\> | The arguments to pass to the event |

#### Returns

`boolean`

#### Overrides

`EventEmitter.emit`

#### Defined in

[src/structures/NodeManager.ts:17](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/NodeManager.ts#L17)

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
set by `emitter.setMaxListeners(n)` or defaults to [defaultMaxListeners](NodeManager.md).

#### Returns

`number`

#### Since

v1.0.0

#### Inherited from

`EventEmitter.getMaxListeners`

#### Defined in

node\_modules/.pnpm/@types+node@22.5.5/node\_modules/@types/node/events.d.ts:774

***

### leastUsedNodes()

```ts
leastUsedNodes(sortType: 
  | "memory"
  | "cpuLavalink"
  | "cpuSystem"
  | "calls"
  | "playingPlayers"
  | "players"): LavalinkNode[]
```

Get the nodes sorted for the least usage, by a sorttype

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `sortType` | \| `"memory"` \| `"cpuLavalink"` \| `"cpuSystem"` \| `"calls"` \| `"playingPlayers"` \| `"players"` | `"players"` | The type of sorting to use |

#### Returns

[`LavalinkNode`](/api/classes/lavalinknode/)[]

#### Defined in

[src/structures/NodeManager.ts:148](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/NodeManager.ts#L148)

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
off<Event>(event: Event, listener: NodeManagerEvents[Event]): this
```

Remove an event listener

#### Type Parameters

| Type Parameter |
| ------ |
| `Event` *extends* keyof [`NodeManagerEvents`](/api/interfaces/nodemanagerevents/) |

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `event` | `Event` | The event to remove the listener from |
| `listener` | [`NodeManagerEvents`](/api/interfaces/nodemanagerevents/)\[`Event`\] | The listener to remove |

#### Returns

`this`

#### Overrides

`EventEmitter.off`

#### Defined in

[src/structures/NodeManager.ts:47](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/NodeManager.ts#L47)

***

### on()

```ts
on<Event>(event: Event, listener: NodeManagerEvents[Event]): this
```

Add an event listener

#### Type Parameters

| Type Parameter |
| ------ |
| `Event` *extends* keyof [`NodeManagerEvents`](/api/interfaces/nodemanagerevents/) |

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `event` | `Event` | The event to listen to |
| `listener` | [`NodeManagerEvents`](/api/interfaces/nodemanagerevents/)\[`Event`\] | The listener to add |

#### Returns

`this`

#### Overrides

`EventEmitter.on`

#### Defined in

[src/structures/NodeManager.ts:27](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/NodeManager.ts#L27)

***

### once()

```ts
once<Event>(event: Event, listener: NodeManagerEvents[Event]): this
```

Add an event listener that only fires once

#### Type Parameters

| Type Parameter |
| ------ |
| `Event` *extends* keyof [`NodeManagerEvents`](/api/interfaces/nodemanagerevents/) |

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `event` | `Event` | The event to listen to |
| `listener` | [`NodeManagerEvents`](/api/interfaces/nodemanagerevents/)\[`Event`\] | The listener to add |

#### Returns

`this`

#### Overrides

`EventEmitter.once`

#### Defined in

[src/structures/NodeManager.ts:37](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/NodeManager.ts#L37)

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

### reconnectAll()

```ts
reconnectAll(): Promise<number>
```

Forcefully reconnects all nodes

#### Returns

`Promise`\<`number`\>

amount of nodes

#### Defined in

[src/structures/NodeManager.ts:119](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/NodeManager.ts#L119)

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
removeListener<Event>(event: Event, listener: NodeManagerEvents[Event]): this
```

Remove an event listener

#### Type Parameters

| Type Parameter |
| ------ |
| `Event` *extends* keyof [`NodeManagerEvents`](/api/interfaces/nodemanagerevents/) |

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `event` | `Event` | The event to remove the listener from |
| `listener` | [`NodeManagerEvents`](/api/interfaces/nodemanagerevents/)\[`Event`\] | The listener to remove |

#### Returns

`this`

#### Overrides

`EventEmitter.removeListener`

#### Defined in

[src/structures/NodeManager.ts:57](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/NodeManager.ts#L57)

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
