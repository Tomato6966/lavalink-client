---
editUrl: false
next: true
prev: true
title: "parseLavalinkConnUrl"
---

```ts
function parseLavalinkConnUrl(connectionUrl: string): object
```

Parses Node Connection Url: "lavalink://<nodeId>:<nodeAuthorization(Password)>@<NodeHost>:<NodePort>"

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `connectionUrl` | `string` |  |

## Returns

`object`

| Name | Type | Default value | Defined in |
| ------ | ------ | ------ | ------ |
| `authorization` | `string` | parsed.password | [src/structures/Utils.ts:37](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Utils.ts#L37) |
| `host` | `string` | parsed.hostname | [src/structures/Utils.ts:39](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Utils.ts#L39) |
| `id` | `string` | parsed.username | [src/structures/Utils.ts:38](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Utils.ts#L38) |
| `port` | `number` | - | [src/structures/Utils.ts:40](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Utils.ts#L40) |

## Defined in

[src/structures/Utils.ts:33](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Utils.ts#L33)
