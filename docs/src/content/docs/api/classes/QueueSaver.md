---
editUrl: false
next: true
prev: true
title: "QueueSaver"
---

## Constructors

### new QueueSaver()

```ts
new QueueSaver(options: ManagerQueueOptions): QueueSaver
```

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `options` | [`ManagerQueueOptions`](/api/interfaces/managerqueueoptions/) |

#### Returns

[`QueueSaver`](/api/classes/queuesaver/)

#### Defined in

[src/structures/Queue.ts:19](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Queue.ts#L19)

## Properties

| Property | Modifier | Type | Description | Defined in |
| ------ | ------ | ------ | ------ | ------ |
| `options` | `public` | `object` | The options for the queue saver | [src/structures/Queue.ts:16](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Queue.ts#L16) |
| `options.maxPreviousTracks` | `public` | `number` | - | [src/structures/Queue.ts:17](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Queue.ts#L17) |

## Methods

### delete()

```ts
delete(guildId: string): Promise<unknown>
```

Delete the queue for a guild

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `guildId` | `string` | The guild ID |

#### Returns

`Promise`\<`unknown`\>

The queue for the guild

#### Defined in

[src/structures/Queue.ts:40](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Queue.ts#L40)

***

### get()

```ts
get(guildId: string): Promise<Partial<StoredQueue>>
```

Get the queue for a guild

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `guildId` | `string` | The guild ID |

#### Returns

`Promise`\<`Partial`\<[`StoredQueue`](/api/interfaces/storedqueue/)\>\>

The queue for the guild

#### Defined in

[src/structures/Queue.ts:31](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Queue.ts#L31)

***

### set()

```ts
set(guildId: string, valueToStringify: StoredQueue): Promise<unknown>
```

Set the queue for a guild

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `guildId` | `string` | The guild ID |
| `valueToStringify` | [`StoredQueue`](/api/interfaces/storedqueue/) | The queue to set |

#### Returns

`Promise`\<`unknown`\>

The queue for the guild

#### Defined in

[src/structures/Queue.ts:50](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Queue.ts#L50)

***

### sync()

```ts
sync(guildId: string): Promise<Partial<StoredQueue>>
```

Sync the queue for a guild

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `guildId` | `string` | The guild ID |

#### Returns

`Promise`\<`Partial`\<[`StoredQueue`](/api/interfaces/storedqueue/)\>\>

The queue for the guild

#### Defined in

[src/structures/Queue.ts:59](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Queue.ts#L59)
