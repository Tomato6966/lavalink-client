---
editUrl: false
next: true
prev: true
title: "UnresolvedTrack"
---

## Properties

| Property | Type | Description | Defined in |
| ------ | ------ | ------ | ------ |
| `encoded?` | `string` | The Base 64 encoded String | [src/structures/Types/Track.ts:135](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Types/Track.ts#L135) |
| `info` | [`UnresolvedTrackInfo`](/api/interfaces/unresolvedtrackinfo/) | Track Information | [src/structures/Types/Track.ts:137](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Types/Track.ts#L137) |
| `pluginInfo` | `Partial`\<[`PluginInfo`](/api/interfaces/plugininfo/)\> | Plugin Information from Lavalink | [src/structures/Types/Track.ts:139](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Types/Track.ts#L139) |
| `requester?` | `unknown` | The Track's Requester | [src/structures/Types/Track.ts:143](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Types/Track.ts#L143) |
| `resolve` | (`player`: [`Player`](/api/classes/player/)) => `Promise`\<`void`\> | Required | [src/structures/Types/Track.ts:133](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Types/Track.ts#L133) |
| `userData?` | [`anyObject`](/api/type-aliases/anyobject/) | The userData Object from when you provide to the lavalink request | [src/structures/Types/Track.ts:141](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Types/Track.ts#L141) |
