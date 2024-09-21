---
editUrl: false
next: true
prev: true
title: "UnresolvedTrackInfo"
---

## Extends

- `Partial`\<[`TrackInfo`](/api/interfaces/trackinfo/)\>

## Extended by

- [`UnresolvedQuery`](/api/interfaces/unresolvedquery/)

## Properties

| Property | Type | Description | Overrides | Inherited from | Defined in |
| ------ | ------ | ------ | ------ | ------ | ------ |
| `artworkUrl?` | `string` | The URL of the artwork if available | - | `Partial.artworkUrl` | [src/structures/Types/Track.ts:45](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Types/Track.ts#L45) |
| `author?` | `string` | The Name of the Author | - | `Partial.author` | [src/structures/Types/Track.ts:41](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Types/Track.ts#L41) |
| `duration?` | `number` | The duration of the Track | - | `Partial.duration` | [src/structures/Types/Track.ts:43](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Types/Track.ts#L43) |
| `identifier?` | `string` | The Identifier of the Track | - | `Partial.identifier` | [src/structures/Types/Track.ts:37](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Types/Track.ts#L37) |
| `isrc?` | `string` | If isrc code is available, it's provided | - | `Partial.isrc` | [src/structures/Types/Track.ts:55](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Types/Track.ts#L55) |
| `isSeekable?` | `boolean` | Wether the audio is seekable | - | `Partial.isSeekable` | [src/structures/Types/Track.ts:51](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Types/Track.ts#L51) |
| `isStream?` | `boolean` | Wether the audio is of a live stream | - | `Partial.isStream` | [src/structures/Types/Track.ts:53](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Types/Track.ts#L53) |
| `sourceName?` | [`SourceNames`](/api/type-aliases/sourcenames/) | The Source name of the Track, e.g. soundcloud, youtube, spotify | - | `Partial.sourceName` | [src/structures/Types/Track.ts:49](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Types/Track.ts#L49) |
| `title` | `string` | Required | `Partial.title` | - | [src/structures/Types/Track.ts:125](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Types/Track.ts#L125) |
| `uri?` | `string` | The URL (aka Link) of the Track called URI | - | `Partial.uri` | [src/structures/Types/Track.ts:47](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Types/Track.ts#L47) |
