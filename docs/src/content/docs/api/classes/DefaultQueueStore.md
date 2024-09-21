---
editUrl: false
next: true
prev: true
title: "DefaultQueueStore"
---

## Implements

- [`QueueStoreManager`](/api/interfaces/queuestoremanager/)

## Constructors

### new DefaultQueueStore()

```ts
new DefaultQueueStore(): DefaultQueueStore
```

#### Returns

[`DefaultQueueStore`](/api/classes/defaultqueuestore/)

#### Defined in

[src/structures/Queue.ts:66](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Queue.ts#L66)

## Methods

### delete()

```ts
delete(guildId: any): Promise<boolean>
```

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `guildId` | `any` | The guild ID |

#### Returns

`Promise`\<`boolean`\>

The queue for the guild

#### Async

Delete a Database Value based of it's guildId

#### Implementation of

[`QueueStoreManager`](/api/interfaces/queuestoremanager/).`delete`

#### Defined in

[src/structures/Queue.ts:92](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Queue.ts#L92)

***

### get()

```ts
get(guildId: any): Promise<unknown>
```

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `guildId` | `any` | The guild ID |

#### Returns

`Promise`\<`unknown`\>

The queue for the guild

#### Async

get a Value (MUST RETURN UNPARSED!)

#### Implementation of

[`QueueStoreManager`](/api/interfaces/queuestoremanager/).`get`

#### Defined in

[src/structures/Queue.ts:73](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Queue.ts#L73)

***

### parse()

```ts
parse(value: any): Promise<Partial<StoredQueue>>
```

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `any` | The queue to parse |

#### Returns

`Promise`\<`Partial`\<[`StoredQueue`](/api/interfaces/storedqueue/)\>\>

The parsed queue

#### Async

Parse the saved value back to the Queue (IF YOU DON'T NEED PARSING/STRINGIFY, then just return the value)

#### Implementation of

[`QueueStoreManager`](/api/interfaces/queuestoremanager/).`parse`

#### Defined in

[src/structures/Queue.ts:110](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Queue.ts#L110)

***

### set()

```ts
set(guildId: any, valueToStringify: any): Promise<MiniMap<unknown, unknown>>
```

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `guildId` | `any` | The guild ID |
| `valueToStringify` | `any` | The queue to set |

#### Returns

`Promise`\<[`MiniMap`](/api/classes/minimap/)\<`unknown`, `unknown`\>\>

The queue for the guild

#### Async

Set a value inside a guildId (MUST BE UNPARSED)

#### Implementation of

[`QueueStoreManager`](/api/interfaces/queuestoremanager/).`set`

#### Defined in

[src/structures/Queue.ts:83](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Queue.ts#L83)

***

### stringify()

```ts
stringify(value: any): Promise<any>
```

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `any` | The queue to stringify |

#### Returns

`Promise`\<`any`\>

The stringified queue

#### Async

Transform the value(s) inside of the QueueStoreManager (IF YOU DON'T NEED PARSING/STRINGIFY, then just return the value)

#### Implementation of

[`QueueStoreManager`](/api/interfaces/queuestoremanager/).`stringify`

#### Defined in

[src/structures/Queue.ts:101](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Queue.ts#L101)
