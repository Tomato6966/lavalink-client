---
editUrl: false
next: true
prev: true
title: "LavalinkPlayOptions"
---

## Extends

- [`BasePlayOptions`](/api/interfaces/baseplayoptions/)

## Extended by

- [`PlayOptions`](/api/interfaces/playoptions/)

## Properties

| Property | Type | Description | Inherited from | Defined in |
| ------ | ------ | ------ | ------ | ------ |
| `endTime?` | `number` | The position to end the track. | [`BasePlayOptions`](/api/interfaces/baseplayoptions/).`endTime` | [src/structures/Types/Player.ts:84](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Types/Player.ts#L84) |
| `filters?` | `Partial`\<[`LavalinkFilterData`](/api/interfaces/lavalinkfilterdata/)\> | The Lavalink Filters to use | only with the new REST API | [`BasePlayOptions`](/api/interfaces/baseplayoptions/).`filters` | [src/structures/Types/Player.ts:90](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Types/Player.ts#L90) |
| `paused?` | `boolean` | If to start "paused" | [`BasePlayOptions`](/api/interfaces/baseplayoptions/).`paused` | [src/structures/Types/Player.ts:86](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Types/Player.ts#L86) |
| `position?` | `number` | The position to start the track. | [`BasePlayOptions`](/api/interfaces/baseplayoptions/).`position` | [src/structures/Types/Player.ts:82](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Types/Player.ts#L82) |
| `track?` | `object` | Which Track to play | don't provide, if it should pick from the Queue | - | [src/structures/Types/Player.ts:96](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Types/Player.ts#L96) |
| `track.encoded?` | `string` | The track encoded base64 string to use instead of the one from the queue system | - | [src/structures/Types/Player.ts:98](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Types/Player.ts#L98) |
| `track.identifier?` | `string` | The identifier of the track to use | - | [src/structures/Types/Player.ts:100](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Types/Player.ts#L100) |
| `track.requester?` | `unknown` | The Track requester for when u provide encodedTrack / identifer | - | [src/structures/Types/Player.ts:104](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Types/Player.ts#L104) |
| `track.userData?` | [`anyObject`](/api/type-aliases/anyobject/) | Custom User Data for the track to provide, will then be on the userData object from the track | - | [src/structures/Types/Player.ts:102](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Types/Player.ts#L102) |
| `voice?` | [`LavalinkPlayerVoiceOptions`](/api/type-aliases/lavalinkplayervoiceoptions/) | Voice Update for Lavalink | [`BasePlayOptions`](/api/interfaces/baseplayoptions/).`voice` | [src/structures/Types/Player.ts:92](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Types/Player.ts#L92) |
| `volume?` | `number` | The Volume to start with | [`BasePlayOptions`](/api/interfaces/baseplayoptions/).`volume` | [src/structures/Types/Player.ts:88](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Types/Player.ts#L88) |
