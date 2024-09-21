---
editUrl: false
next: true
prev: true
title: "ManagerQueueOptions"
---

## Properties

| Property | Type | Description | Defined in |
| ------ | ------ | ------ | ------ |
| `maxPreviousTracks?` | `number` | Maximum Amount of tracks for the queue.previous array. Set to 0 to not save previous songs. Defaults to 25 Tracks | [src/structures/Types/Queue.ts:24](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Types/Queue.ts#L24) |
| `queueChangesWatcher?` | [`QueueChangesWatcher`](/api/interfaces/queuechangeswatcher/) | Custom Queue Watcher class | [src/structures/Types/Queue.ts:28](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Types/Queue.ts#L28) |
| `queueStore?` | [`QueueStoreManager`](/api/interfaces/queuestoremanager/) | Custom Queue Store option | [src/structures/Types/Queue.ts:26](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Types/Queue.ts#L26) |
