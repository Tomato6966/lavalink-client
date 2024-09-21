---
editUrl: false
next: true
prev: true
title: "QueueStoreManager"
---

## Extends

- `Record`\<`string`, `any`\>

## Properties

| Property | Type | Description | Defined in |
| ------ | ------ | ------ | ------ |
| `delete` | (`guildId`: `unknown`) => `Promise`\<`unknown`\> | **Async** Delete a Database Value based of it's guildId | [src/structures/Types/Queue.ts:15](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Types/Queue.ts#L15) |
| `get` | (`guildId`: `unknown`) => `Promise`\<`unknown`\> | **Async** get a Value (MUST RETURN UNPARSED!) | [src/structures/Types/Queue.ts:11](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Types/Queue.ts#L11) |
| `parse` | (`value`: `unknown`) => `Promise`\<`Partial`\<[`StoredQueue`](/api/interfaces/storedqueue/)\>\> | **Async** Parse the saved value back to the Queue (IF YOU DON'T NEED PARSING/STRINGIFY, then just return the value) | [src/structures/Types/Queue.ts:19](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Types/Queue.ts#L19) |
| `set` | (`guildId`: `unknown`, `value`: `unknown`) => `Promise`\<`unknown`\> | **Async** Set a value inside a guildId (MUST BE UNPARSED) | [src/structures/Types/Queue.ts:13](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Types/Queue.ts#L13) |
| `stringify` | (`value`: `unknown`) => `Promise`\<`unknown`\> | **Async** Transform the value(s) inside of the QueueStoreManager (IF YOU DON'T NEED PARSING/STRINGIFY, then just return the value) | [src/structures/Types/Queue.ts:17](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Types/Queue.ts#L17) |
