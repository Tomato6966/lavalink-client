---
editUrl: false
next: true
prev: true
title: "ManagerOptions"
---

Manager Options used to create the manager

## Properties

| Property | Type | Description | Defined in |
| ------ | ------ | ------ | ------ |
| `advancedOptions?` | `object` | Advanced Options for the Library, which may or may not be "library breaking" | [src/structures/Types/Manager.ts:219](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Types/Manager.ts#L219) |
| `advancedOptions.debugOptions?` | `object` | optional | [src/structures/Types/Manager.ts:225](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Types/Manager.ts#L225) |
| `advancedOptions.debugOptions.logCustomSearches?` | `boolean` | For logging custom searches | [src/structures/Types/Manager.ts:227](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Types/Manager.ts#L227) |
| `advancedOptions.debugOptions.noAudio?` | `boolean` | logs for debugging the "no-Audio" playing error | [src/structures/Types/Manager.ts:229](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Types/Manager.ts#L229) |
| `advancedOptions.debugOptions.playerDestroy?` | `object` | For Logging the Destroy function | [src/structures/Types/Manager.ts:231](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Types/Manager.ts#L231) |
| `advancedOptions.debugOptions.playerDestroy.debugLog?` | `boolean` | To show the debug reason at all times. | [src/structures/Types/Manager.ts:233](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Types/Manager.ts#L233) |
| `advancedOptions.debugOptions.playerDestroy.dontThrowError?` | `boolean` | If you get 'Error: Use Player#destroy("reason") not LavalinkManager#deletePlayer() to stop the Player' put it on true | [src/structures/Types/Manager.ts:235](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Types/Manager.ts#L235) |
| `advancedOptions.enableDebugEvents?` | `boolean` | Enable Debug event | [src/structures/Types/Manager.ts:223](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Types/Manager.ts#L223) |
| `advancedOptions.maxFilterFixDuration?` | `number` | Max duration for that the filter fix duration works (in ms) - default is 8mins | [src/structures/Types/Manager.ts:221](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Types/Manager.ts#L221) |
| `autoSkip?` | `boolean` | If it should skip to the next Track on TrackEnd / TrackError etc. events | [src/structures/Types/Manager.ts:207](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Types/Manager.ts#L207) |
| `autoSkipOnResolveError?` | `boolean` | If it should skip to the next Track if track.resolve errors while trying to play a track. | [src/structures/Types/Manager.ts:209](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Types/Manager.ts#L209) |
| `client?` | [`BotClientOptions`](/api/interfaces/botclientoptions/) | The Bot Client's Data for Authorization | [src/structures/Types/Manager.ts:201](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Types/Manager.ts#L201) |
| `emitNewSongsOnly?` | `boolean` | If it should emit only new (unique) songs and not when a looping track (or similar) is plaid, default false | [src/structures/Types/Manager.ts:211](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Types/Manager.ts#L211) |
| `linksAllowed?` | `boolean` | If links should be allowed or not. If set to false, it will throw an error if a link was provided. | [src/structures/Types/Manager.ts:217](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Types/Manager.ts#L217) |
| `linksBlacklist?` | (`string` \| `RegExp`)[] | Never allow link requests with links either matching some of that regExp or including some of that string (doesn't even allow if it's whitelisted) | [src/structures/Types/Manager.ts:215](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Types/Manager.ts#L215) |
| `linksWhitelist?` | (`string` \| `RegExp`)[] | Only allow link requests with links either matching some of that regExp or including some of that string | [src/structures/Types/Manager.ts:213](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Types/Manager.ts#L213) |
| `nodes` | [`LavalinkNodeOptions`](/api/interfaces/lavalinknodeoptions/)[] | The Node Options, for all Nodes! (on init) | [src/structures/Types/Manager.ts:197](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Types/Manager.ts#L197) |
| `playerOptions?` | [`ManagerPlayerOptions`](/api/interfaces/managerplayeroptions/) | PlayerOptions for all Players | [src/structures/Types/Manager.ts:205](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Types/Manager.ts#L205) |
| `queueOptions?` | [`ManagerQueueOptions`](/api/interfaces/managerqueueoptions/) | QueueOptions for all Queues | [src/structures/Types/Manager.ts:203](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Types/Manager.ts#L203) |
| `sendToShard` | (`guildId`: `string`, `payload`: [`GuildShardPayload`](/api/interfaces/guildshardpayload/)) => `void` | **Async** The Function to send the voice connection changes from Lavalink to Discord | [src/structures/Types/Manager.ts:199](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Types/Manager.ts#L199) |
