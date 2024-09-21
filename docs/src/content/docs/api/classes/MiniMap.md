---
editUrl: false
next: true
prev: true
title: "MiniMap"
---

## Extends

- `Map`\<`K`, `V`\>

## Type Parameters

| Type Parameter |
| ------ |
| `K` |
| `V` |

## Constructors

### new MiniMap()

```ts
new MiniMap<K, V>(data: [K, V][]): MiniMap<K, V>
```

#### Parameters

| Parameter | Type | Default value |
| ------ | ------ | ------ |
| `data` | [`K`, `V`][] | `[]` |

#### Returns

[`MiniMap`](/api/classes/minimap/)\<`K`, `V`\>

#### Inherited from

`Map<K, V>.constructor`

#### Defined in

[src/structures/Utils.ts:414](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Utils.ts#L414)

## Properties

| Property | Modifier | Type | Description | Inherited from | Defined in |
| ------ | ------ | ------ | ------ | ------ | ------ |
| `[toStringTag]` | `readonly` | `string` | - | `Map.[toStringTag]` | .doc/node\_modules/.pnpm/typescript@5.6.2/node\_modules/typescript/lib/lib.es2015.symbol.wellknown.d.ts:137 |
| `constructor` | `public` | `MiniMapConstructor` | The initial value of Object.prototype.constructor is the standard built-in Object constructor. | - | [src/structures/Utils.ts:410](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Utils.ts#L410) |
| `size` | `readonly` | `number` |  | `Map.size` | .doc/node\_modules/.pnpm/typescript@5.6.2/node\_modules/typescript/lib/lib.es2015.collection.d.ts:45 |
| `[species]` | `readonly` | `MapConstructor` | - | - | .doc/node\_modules/.pnpm/typescript@5.6.2/node\_modules/typescript/lib/lib.es2015.symbol.wellknown.d.ts:319 |

## Methods

### \[iterator\]()

```ts
iterator: MapIterator<[K, V]>
```

Returns an iterable of entries in the map.

#### Returns

`MapIterator`\<[`K`, `V`]\>

#### Inherited from

`Map.[iterator]`

#### Defined in

.doc/node\_modules/.pnpm/typescript@5.6.2/node\_modules/typescript/lib/lib.es2015.iterable.d.ts:143

***

### clear()

```ts
clear(): void
```

#### Returns

`void`

#### Inherited from

`Map.clear`

#### Defined in

.doc/node\_modules/.pnpm/typescript@5.6.2/node\_modules/typescript/lib/lib.es2015.collection.d.ts:20

***

### delete()

```ts
delete(key: K): boolean
```

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `key` | `K` |

#### Returns

`boolean`

true if an element in the Map existed and has been removed, or false if the element does not exist.

#### Inherited from

`Map.delete`

#### Defined in

.doc/node\_modules/.pnpm/typescript@5.6.2/node\_modules/typescript/lib/lib.es2015.collection.d.ts:24

***

### entries()

```ts
entries(): MapIterator<[K, V]>
```

Returns an iterable of key, value pairs for every entry in the map.

#### Returns

`MapIterator`\<[`K`, `V`]\>

#### Inherited from

`Map.entries`

#### Defined in

.doc/node\_modules/.pnpm/typescript@5.6.2/node\_modules/typescript/lib/lib.es2015.iterable.d.ts:148

***

### filter()

#### filter(fn)

```ts
filter<K2>(fn: (value: V, key: K, miniMap: this) => key is K2): MiniMap<K2, V>
```

Identical to
[Array.filter()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter),
but returns a MiniMap instead of an Array.

##### Type Parameters

| Type Parameter |
| ------ |
| `K2` |

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `fn` | (`value`: `V`, `key`: `K`, `miniMap`: `this`) => `key is K2` | The function to test with (should return boolean) |

##### Returns

[`MiniMap`](/api/classes/minimap/)\<`K2`, `V`\>

##### Example

```ts
miniMap.filter(user => user.username === 'Bob');
```

##### Defined in

[src/structures/Utils.ts:429](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Utils.ts#L429)

#### filter(fn)

```ts
filter<V2>(fn: (value: V, key: K, miniMap: this) => value is V2): MiniMap<K, V2>
```

##### Type Parameters

| Type Parameter |
| ------ |
| `V2` |

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `fn` | (`value`: `V`, `key`: `K`, `miniMap`: `this`) => `value is V2` |

##### Returns

[`MiniMap`](/api/classes/minimap/)\<`K`, `V2`\>

##### Defined in

[src/structures/Utils.ts:430](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Utils.ts#L430)

#### filter(fn)

```ts
filter(fn: (value: V, key: K, miniMap: this) => boolean): MiniMap<K, V>
```

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `fn` | (`value`: `V`, `key`: `K`, `miniMap`: `this`) => `boolean` |

##### Returns

[`MiniMap`](/api/classes/minimap/)\<`K`, `V`\>

##### Defined in

[src/structures/Utils.ts:431](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Utils.ts#L431)

#### filter(fn, thisArg)

```ts
filter<This, K2>(fn: (this: This, value: V, key: K, miniMap: this) => key is K2, thisArg: This): MiniMap<K2, V>
```

##### Type Parameters

| Type Parameter |
| ------ |
| `This` |
| `K2` |

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `fn` | (`this`: `This`, `value`: `V`, `key`: `K`, `miniMap`: `this`) => `key is K2` |
| `thisArg` | `This` |

##### Returns

[`MiniMap`](/api/classes/minimap/)\<`K2`, `V`\>

##### Defined in

[src/structures/Utils.ts:432](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Utils.ts#L432)

#### filter(fn, thisArg)

```ts
filter<This, V2>(fn: (this: This, value: V, key: K, miniMap: this) => value is V2, thisArg: This): MiniMap<K, V2>
```

##### Type Parameters

| Type Parameter |
| ------ |
| `This` |
| `V2` |

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `fn` | (`this`: `This`, `value`: `V`, `key`: `K`, `miniMap`: `this`) => `value is V2` |
| `thisArg` | `This` |

##### Returns

[`MiniMap`](/api/classes/minimap/)\<`K`, `V2`\>

##### Defined in

[src/structures/Utils.ts:436](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Utils.ts#L436)

#### filter(fn, thisArg)

```ts
filter<This>(fn: (this: This, value: V, key: K, miniMap: this) => boolean, thisArg: This): MiniMap<K, V>
```

##### Type Parameters

| Type Parameter |
| ------ |
| `This` |

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `fn` | (`this`: `This`, `value`: `V`, `key`: `K`, `miniMap`: `this`) => `boolean` |
| `thisArg` | `This` |

##### Returns

[`MiniMap`](/api/classes/minimap/)\<`K`, `V`\>

##### Defined in

[src/structures/Utils.ts:440](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Utils.ts#L440)

***

### forEach()

```ts
forEach(callbackfn: (value: V, key: K, map: Map<K, V>) => void, thisArg?: any): void
```

Executes a provided function once per each key/value pair in the Map, in insertion order.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `callbackfn` | (`value`: `V`, `key`: `K`, `map`: `Map`\<`K`, `V`\>) => `void` |
| `thisArg`? | `any` |

#### Returns

`void`

#### Inherited from

`Map.forEach`

#### Defined in

.doc/node\_modules/.pnpm/typescript@5.6.2/node\_modules/typescript/lib/lib.es2015.collection.d.ts:28

***

### get()

```ts
get(key: K): V
```

Returns a specified element from the Map object. If the value that is associated to the provided key is an object, then you will get a reference to that object and any change made to that object will effectively modify it inside the Map.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `key` | `K` |

#### Returns

`V`

Returns the element associated with the specified key. If no element is associated with the specified key, undefined is returned.

#### Inherited from

`Map.get`

#### Defined in

.doc/node\_modules/.pnpm/typescript@5.6.2/node\_modules/typescript/lib/lib.es2015.collection.d.ts:33

***

### has()

```ts
has(key: K): boolean
```

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `key` | `K` |

#### Returns

`boolean`

boolean indicating whether an element with the specified key exists or not.

#### Inherited from

`Map.has`

#### Defined in

.doc/node\_modules/.pnpm/typescript@5.6.2/node\_modules/typescript/lib/lib.es2015.collection.d.ts:37

***

### keys()

```ts
keys(): MapIterator<K>
```

Returns an iterable of keys in the map

#### Returns

`MapIterator`\<`K`\>

#### Inherited from

`Map.keys`

#### Defined in

.doc/node\_modules/.pnpm/typescript@5.6.2/node\_modules/typescript/lib/lib.es2015.iterable.d.ts:153

***

### map()

#### map(fn)

```ts
map<T>(fn: (value: V, key: K, miniMap: this) => T): T[]
```

Maps each item to another value into an array. Identical in behavior to
[Array.map()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map).

##### Type Parameters

| Type Parameter |
| ------ |
| `T` |

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `fn` | (`value`: `V`, `key`: `K`, `miniMap`: `this`) => `T` | Function that produces an element of the new array, taking three arguments |

##### Returns

`T`[]

##### Example

```ts
miniMap.map(user => user.tag);
```

##### Defined in

[src/structures/Utils.ts:464](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Utils.ts#L464)

#### map(fn, thisArg)

```ts
map<This, T>(fn: (this: This, value: V, key: K, miniMap: this) => T, thisArg: This): T[]
```

##### Type Parameters

| Type Parameter |
| ------ |
| `This` |
| `T` |

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `fn` | (`this`: `This`, `value`: `V`, `key`: `K`, `miniMap`: `this`) => `T` |
| `thisArg` | `This` |

##### Returns

`T`[]

##### Defined in

[src/structures/Utils.ts:465](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Utils.ts#L465)

***

### set()

```ts
set(key: K, value: V): this
```

Adds a new element with a specified key and value to the Map. If an element with the same key already exists, the element will be updated.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `key` | `K` |
| `value` | `V` |

#### Returns

`this`

#### Inherited from

`Map.set`

#### Defined in

.doc/node\_modules/.pnpm/typescript@5.6.2/node\_modules/typescript/lib/lib.es2015.collection.d.ts:41

***

### toJSON()

```ts
toJSON(): [K, V][]
```

#### Returns

[`K`, `V`][]

#### Defined in

[src/structures/Utils.ts:450](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Utils.ts#L450)

***

### values()

```ts
values(): MapIterator<V>
```

Returns an iterable of values in the map

#### Returns

`MapIterator`\<`V`\>

#### Inherited from

`Map.values`

#### Defined in

.doc/node\_modules/.pnpm/typescript@5.6.2/node\_modules/typescript/lib/lib.es2015.iterable.d.ts:158

***

### groupBy()

```ts
static groupBy<K, T>(items: Iterable<T, any, any>, keySelector: (item: T, index: number) => K): Map<K, T[]>
```

Groups members of an iterable according to the return value of the passed callback.

#### Type Parameters

| Type Parameter |
| ------ |
| `K` |
| `T` |

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `items` | `Iterable`\<`T`, `any`, `any`\> | An iterable. |
| `keySelector` | (`item`: `T`, `index`: `number`) => `K` | A callback which will be invoked for each item in items. |

#### Returns

`Map`\<`K`, `T`[]\>

#### Defined in

.doc/node\_modules/.pnpm/typescript@5.6.2/node\_modules/typescript/lib/lib.esnext.collection.d.ts:25
