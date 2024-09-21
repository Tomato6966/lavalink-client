---
editUrl: false
next: true
prev: true
title: "NodeManagerEvents"
---

## Events

| Event | Type | Description | Defined in |
| ------ | ------ | ------ | ------ |
| `connect` | (`node`: [`LavalinkNode`](/api/classes/lavalinknode/)) => `void` | Emitted when a Node is connected. Manager.nodeManager#connect | [src/structures/Types/Node.ts:212](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Types/Node.ts#L212) |
| `create` | (`node`: [`LavalinkNode`](/api/classes/lavalinknode/)) => `void` | Emitted when a Node is created. Manager.nodeManager#create | [src/structures/Types/Node.ts:200](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Types/Node.ts#L200) |
| `destroy` | (`node`: [`LavalinkNode`](/api/classes/lavalinknode/), `destroyReason`?: `string`) => `void` | Emitted when a Node is destroyed. Manager.nodeManager#destroy | [src/structures/Types/Node.ts:206](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Types/Node.ts#L206) |
| `disconnect` | (`node`: [`LavalinkNode`](/api/classes/lavalinknode/), `reason`: `object`) => `void` | Emitted when a Node is disconnects. Manager.nodeManager#disconnect | [src/structures/Types/Node.ts:231](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Types/Node.ts#L231) |
| `error` | (`node`: [`LavalinkNode`](/api/classes/lavalinknode/), `error`: `Error`, `payload`?: `unknown`) => `void` | Emitted when a Node is error. Manager.nodeManager#error | [src/structures/Types/Node.ts:237](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Types/Node.ts#L237) |
| `raw` | (`node`: [`LavalinkNode`](/api/classes/lavalinknode/), `payload`: `unknown`) => `void` | Emits every single Node event. Manager.nodeManager#raw | [src/structures/Types/Node.ts:243](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Types/Node.ts#L243) |
| `reconnecting` | (`node`: [`LavalinkNode`](/api/classes/lavalinknode/)) => `void` | Emitted when a Node is reconnecting. Manager.nodeManager#reconnecting | [src/structures/Types/Node.ts:218](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Types/Node.ts#L218) |
| `reconnectinprogress` | (`node`: [`LavalinkNode`](/api/classes/lavalinknode/)) => `void` | Emitted When a node starts to reconnect (if you have a reconnection delay, the reconnecting event will be emitted after the retryDelay.) Useful to check wether the internal node reconnect system works or not Manager.nodeManager#reconnectinprogress | [src/structures/Types/Node.ts:225](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Types/Node.ts#L225) |
| `resumed` | (`node`: [`LavalinkNode`](/api/classes/lavalinknode/), `paylaod`: `object`, `players`: [`LavalinkPlayer`](/api/interfaces/lavalinkplayer/)[] \| [`InvalidLavalinkRestRequest`](/api/interfaces/invalidlavalinkrestrequest/)) => `void` | Emits when the node connects resumed. You then need to create all players within this event for your usecase. Aka for that you need to be able to save player data like vc channel + text channel in a db and then sync it again Manager.nodeManager#nodeResumed | [src/structures/Types/Node.ts:250](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Types/Node.ts#L250) |
