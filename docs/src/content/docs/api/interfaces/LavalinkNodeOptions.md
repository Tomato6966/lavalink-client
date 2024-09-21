---
editUrl: false
next: true
prev: true
title: "LavalinkNodeOptions"
---

Node Options for creating a lavalink node

## Properties

| Property | Type | Description | Defined in |
| ------ | ------ | ------ | ------ |
| `authorization` | `string` | The Lavalink Password / Authorization-Key | [src/structures/Types/Node.ts:21](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Types/Node.ts#L21) |
| `closeOnError?` | `boolean` | Close on error | [src/structures/Types/Node.ts:37](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Types/Node.ts#L37) |
| `enablePingOnStatsCheck?` | `boolean` | Recommended, to check wether the client is still connected or not on the stats endpoint | [src/structures/Types/Node.ts:41](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Types/Node.ts#L41) |
| `heartBeatInterval?` | `30000` | Heartbeat interval , set to <= 0 to disable heartbeat system | [src/structures/Types/Node.ts:39](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Types/Node.ts#L39) |
| `host` | `string` | The Lavalink Server-Ip / Domain-URL | [src/structures/Types/Node.ts:17](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Types/Node.ts#L17) |
| `id?` | `string` | Add a Custom ID to the node, for later use | [src/structures/Types/Node.ts:27](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Types/Node.ts#L27) |
| `port` | `number` | The Lavalink Connection Port | [src/structures/Types/Node.ts:19](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Types/Node.ts#L19) |
| `regions?` | `string`[] | Voice Regions of this Node | [src/structures/Types/Node.ts:29](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Types/Node.ts#L29) |
| `requestSignalTimeoutMS?` | `number` | signal for cancelling requests - default: AbortSignal.timeout(options.requestSignalTimeoutMS || 10000) - put <= 0 to disable | [src/structures/Types/Node.ts:35](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Types/Node.ts#L35) |
| `retryAmount?` | `number` | The retryAmount for the node. | [src/structures/Types/Node.ts:31](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Types/Node.ts#L31) |
| `retryDelay?` | `number` | The retryDelay for the node. | [src/structures/Types/Node.ts:33](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Types/Node.ts#L33) |
| `secure?` | `boolean` | Does the Server use ssl (https) | [src/structures/Types/Node.ts:23](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Types/Node.ts#L23) |
| `sessionId?` | `string` | RESUME THE PLAYER? by providing a sessionid on the node-creation | [src/structures/Types/Node.ts:25](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Types/Node.ts#L25) |
