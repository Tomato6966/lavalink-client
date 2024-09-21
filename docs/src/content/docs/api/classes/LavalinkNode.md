---
editUrl: false
next: true
prev: true
title: "LavalinkNode"
---

Lavalink Node creator class

## Constructors

### new LavalinkNode()

```ts
new LavalinkNode(options: LavalinkNodeOptions, manager: NodeManager): LavalinkNode
```

Create a new Node

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `options` | [`LavalinkNodeOptions`](/api/interfaces/lavalinknodeoptions/) | Lavalink Node Options |
| `manager` | [`NodeManager`](/api/classes/nodemanager/) | Node Manager |

#### Returns

[`LavalinkNode`](/api/classes/lavalinknode/)

#### Example

```ts
// don't create a node manually, instead use:

client.lavalink.nodeManager.createNode(options)
```

#### Defined in

[src/structures/Node.ts:85](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Node.ts#L85)

## Properties

| Property | Modifier | Type | Default value | Description | Defined in |
| ------ | ------ | ------ | ------ | ------ | ------ |
| `calls` | `public` | `number` | `0` | The amount of rest calls the node has made. | [src/structures/Node.ts:30](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Node.ts#L30) |
| `decode` | `public` | `object` | `undefined` | Decode Track or Tracks | [src/structures/Node.ts:596](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Node.ts#L596) |
| `decode.multipleTracks` | `public` | (`encodeds`: `string`[], `requester`: `unknown`) => `Promise`\<[`Track`](/api/interfaces/track/)[]\> | `undefined` | Decodes multiple tracks into their info **Example** `const encodedBase64_1 = 'QAACDgMACk5vIERpZ2dpdHkAC0JsYWNrc3RyZWV0AAAAAAAEo4AABjkxNjQ5NgABAB9odHRwczovL2RlZXplci5jb20vdHJhY2svOTE2NDk2AQBpaHR0cHM6Ly9lLWNkbnMtaW1hZ2VzLmR6Y2RuLm5ldC9pbWFnZXMvY292ZXIvZGFlN2EyNjViNzlmYjcxMjc4Y2RlMjUwNDg0OWQ2ZjcvMTAwMHgxMDAwLTAwMDAwMC04MC0wLTAuanBnAQAMVVNJUjE5NjAwOTc4AAZkZWV6ZXIBAChObyBEaWdnaXR5OiBUaGUgVmVyeSBCZXN0IE9mIEJsYWNrc3RyZWV0AQAjaHR0cHM6Ly93d3cuZGVlemVyLmNvbS9hbGJ1bS8xMDMyNTQBACJodHRwczovL3d3dy5kZWV6ZXIuY29tL2FydGlzdC8xODYxAQBqaHR0cHM6Ly9lLWNkbnMtaW1hZ2VzLmR6Y2RuLm5ldC9pbWFnZXMvYXJ0aXN0L2YxNmNhYzM2ZmVjMzkxZjczN2I3ZDQ4MmY1YWM3M2UzLzEwMDB4MTAwMC0wMDAwMDAtODAtMC0wLmpwZwEAT2h0dHBzOi8vY2RuLXByZXZpZXctYS5kemNkbi5uZXQvc3RyZWFtL2MtYTE1Yjg1NzFhYTYyMDBjMDQ0YmY1OWM3NmVkOTEyN2MtNi5tcDMAAAAAAAAAAAA='; const encodedBase64_2 = 'QAABJAMAClRhbGsgYSBMb3QACjQwNHZpbmNlbnQAAAAAAAHr1gBxTzpodHRwczovL2FwaS12Mi5zb3VuZGNsb3VkLmNvbS9tZWRpYS9zb3VuZGNsb3VkOnRyYWNrczo4NTE0MjEwNzYvMzUyYTRiOTAtNzYxOS00M2E5LWJiOGItMjIxMzE0YzFjNjNhL3N0cmVhbS9obHMAAQAsaHR0cHM6Ly9zb3VuZGNsb3VkLmNvbS80MDR2aW5jZW50L3RhbGstYS1sb3QBADpodHRwczovL2kxLnNuZGNkbi5jb20vYXJ0d29ya3MtRTN1ek5Gc0Y4QzBXLTAtb3JpZ2luYWwuanBnAQAMUVpITkExOTg1Nzg0AApzb3VuZGNsb3VkAAAAAAAAAAA='; const tracks = await player.node.decode.multipleTracks([encodedBase64_1, encodedBase64_2], interaction.user);` | [src/structures/Node.ts:628](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Node.ts#L628) |
| `decode.singleTrack` | `public` | (`encoded`: `string`, `requester`: `unknown`) => `Promise`\<[`Track`](/api/interfaces/track/)\> | `undefined` | Decode a single track into its info **Example** `const encodedBase64 = 'QAACDgMACk5vIERpZ2dpdHkAC0JsYWNrc3RyZWV0AAAAAAAEo4AABjkxNjQ5NgABAB9odHRwczovL2RlZXplci5jb20vdHJhY2svOTE2NDk2AQBpaHR0cHM6Ly9lLWNkbnMtaW1hZ2VzLmR6Y2RuLm5ldC9pbWFnZXMvY292ZXIvZGFlN2EyNjViNzlmYjcxMjc4Y2RlMjUwNDg0OWQ2ZjcvMTAwMHgxMDAwLTAwMDAwMC04MC0wLTAuanBnAQAMVVNJUjE5NjAwOTc4AAZkZWV6ZXIBAChObyBEaWdnaXR5OiBUaGUgVmVyeSBCZXN0IE9mIEJsYWNrc3RyZWV0AQAjaHR0cHM6Ly93d3cuZGVlemVyLmNvbS9hbGJ1bS8xMDMyNTQBACJodHRwczovL3d3dy5kZWV6ZXIuY29tL2FydGlzdC8xODYxAQBqaHR0cHM6Ly9lLWNkbnMtaW1hZ2VzLmR6Y2RuLm5ldC9pbWFnZXMvYXJ0aXN0L2YxNmNhYzM2ZmVjMzkxZjczN2I3ZDQ4MmY1YWM3M2UzLzEwMDB4MTAwMC0wMDAwMDAtODAtMC0wLmpwZwEAT2h0dHBzOi8vY2RuLXByZXZpZXctYS5kemNkbi5uZXQvc3RyZWFtL2MtYTE1Yjg1NzFhYTYyMDBjMDQ0YmY1OWM3NmVkOTEyN2MtNi5tcDMAAAAAAAAAAAA='; const track = await player.node.decode.singleTrack(encodedBase64, interaction.user);` | [src/structures/Node.ts:609](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Node.ts#L609) |
| `info` | `public` | [`LavalinkInfo`](/api/interfaces/lavalinkinfo/) | `null` | Actual Lavalink Information of the Node | [src/structures/Node.ts:58](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Node.ts#L58) |
| `isAlive` | `public` | `boolean` | `false` | - | [src/structures/Node.ts:514](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Node.ts#L514) |
| `lyrics` | `public` | `object` | `undefined` | - | [src/structures/Node.ts:640](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Node.ts#L640) |
| `lyrics.get` | `public` | (`track`: [`Track`](/api/interfaces/track/), `skipTrackSource`: `boolean`) => `Promise`\<[`LyricsResult`](/api/interfaces/lyricsresult/)\> | `undefined` | Get the lyrics of a track **Example** `const lyrics = await player.node.lyrics.get(track, true); // use it of player instead: // const lyrics = await player.getLyrics(track, true);` | [src/structures/Node.ts:654](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Node.ts#L654) |
| `lyrics.getCurrent` | `public` | (`guildId`: `string`, `skipTrackSource`: `boolean`) => `Promise`\<[`LyricsResult`](/api/interfaces/lyricsresult/)\> | `undefined` | Get the lyrics of the current playing track **Example** `const lyrics = await player.node.lyrics.getCurrent(guildId); // use it of player instead: // const lyrics = await player.getCurrentLyrics();` | [src/structures/Node.ts:683](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Node.ts#L683) |
| `lyrics.subscribe` | `public` | (`guildId`: `string`) => `Promise`\<`any`\> | `undefined` | subscribe to lyrics updates for a guild **Example** `await player.node.lyrics.subscribe(guildId); // use it of player instead: // const lyrics = await player.subscribeLyrics();` | [src/structures/Node.ts:712](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Node.ts#L712) |
| `lyrics.unsubscribe` | `public` | (`guildId`: `string`) => `Promise`\<`any`\> | `undefined` | unsubscribe from lyrics updates for a guild **Example** `await player.node.lyrics.unsubscribe(guildId); // use it of player instead: // const lyrics = await player.unsubscribeLyrics();` | [src/structures/Node.ts:740](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Node.ts#L740) |
| `options` | `public` | [`LavalinkNodeOptions`](/api/interfaces/lavalinknodeoptions/) | `undefined` | The provided Options of the Node | [src/structures/Node.ts:28](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Node.ts#L28) |
| `resuming` | `public` | `object` | `undefined` | Wether the node resuming is enabled or not | [src/structures/Node.ts:56](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Node.ts#L56) |
| `resuming.enabled` | `public` | `boolean` | `undefined` | - | [src/structures/Node.ts:56](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Node.ts#L56) |
| `resuming.timeout` | `public` | `number` | `undefined` | - | [src/structures/Node.ts:56](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Node.ts#L56) |
| `routePlannerApi` | `public` | `object` | `undefined` | Lavalink's Route Planner Api | [src/structures/Node.ts:803](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Node.ts#L803) |
| `routePlannerApi.getStatus` | `public` | () => `Promise`\<[`RoutePlanner`](/api/interfaces/routeplanner/)\> | `undefined` | Get routplanner Info from Lavalink for ip rotation **Example** `const routePlannerStatus = await player.node.routePlannerApi.getStatus(); const usedBlock = routePlannerStatus.details?.ipBlock; const currentIp = routePlannerStatus.currentAddress;` | [src/structures/Node.ts:815](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Node.ts#L815) |
| `routePlannerApi.unmarkAllFailedAddresses` | `public` | () => `Promise`\<`any`\> | `undefined` | Release all blacklisted IP addresses into pool of IPs **Example** `await player.node.routePlannerApi.unmarkAllFailedAddresses();` | [src/structures/Node.ts:849](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Node.ts#L849) |
| `routePlannerApi.unmarkFailedAddress` | `public` | (`address`: `string`) => `Promise`\<`void`\> | `undefined` | Release blacklisted IP address into pool of IPs for ip rotation **Example** `await player.node.routePlannerApi.unmarkFailedAddress("ipv6address");` | [src/structures/Node.ts:830](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Node.ts#L830) |
| `sessionId?` | `public` | `string` | `null` | The current sessionId, only present when connected | [src/structures/Node.ts:54](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Node.ts#L54) |
| `stats` | `public` | [`NodeStats`](/api/interfaces/nodestats/) | `undefined` | Stats from lavalink, will be updated via an interval by lavalink. | [src/structures/Node.ts:32](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Node.ts#L32) |

## Accessors

### connected

```ts
get connected(): boolean
```

Returns if connected to the Node.

#### Example

```ts
const isConnected = player.node.connected;
console.log("node is connected: ", isConnected ? "yes" : "no")
```

#### Returns

`boolean`

#### Defined in

[src/structures/Node.ts:509](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Node.ts#L509)

***

### connectionStatus

```ts
get connectionStatus(): string
```

Returns the current ConnectionStatus

#### Example

```ts
try {
    const statusOfConnection = player.node.connectionStatus;
    console.log("node's connection status is:", statusOfConnection)
} catch (error) {
    console.error("no socket available?", error)
}
```

#### Returns

`string`

#### Defined in

[src/structures/Node.ts:529](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Node.ts#L529)

***

### heartBeatPing

```ts
get heartBeatPing(): number
```

#### Returns

`number`

#### Defined in

[src/structures/Node.ts:22](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Node.ts#L22)

***

### id

```ts
get id(): string
```

Get the id of the node

#### Example

```ts
const nodeId = player.node.id;
console.log("node id is: ", nodeId)
```

#### Returns

`string`

#### Defined in

[src/structures/Node.ts:462](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Node.ts#L462)

## Methods

### connect()

```ts
connect(sessionId?: string): void
```

Connect to the Lavalink Node

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `sessionId`? | `string` | Provide the Session Id of the previous connection, to resume the node and it's player(s) |

#### Returns

`void`

void

#### Example

```ts
player.node.connect(); // if provided on bootup in managerOptions#nodes, this will be called automatically when doing lavalink.init()

// or connect from a resuming session:
player.node.connect("sessionId");
```

#### Defined in

[src/structures/Node.ts:389](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Node.ts#L389)

***

### deleteSponsorBlock()

```ts
deleteSponsorBlock(player: Player): Promise<void>
```

Delete the sponsorblock plugins

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `player` | [`Player`](/api/classes/player/) | passthrough the player |

#### Returns

`Promise`\<`void`\>

void

#### Example

```ts
// use it on the player via player.deleteSponsorBlock();
const sponsorBlockSegments = await player.node.deleteSponsorBlock(player);
```

#### Defined in

[src/structures/Node.ts:1388](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Node.ts#L1388)

***

### destroy()

```ts
destroy(destroyReason?: string, deleteNode?: boolean): void
```

Destroys the Node-Connection (Websocket) and all player's of the node

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `destroyReason`? | `string` | `undefined` | Destroyreason to use when destroying the players |
| `deleteNode`? | `boolean` | `true` | wether to delete the nodte from the nodes list too, if false it will emit a disconnect. |

#### Returns

`void`

void

#### Default

```ts
true
```

#### Example

```ts
player.node.destroy("custom Player Destroy Reason", true);
```

#### Defined in

[src/structures/Node.ts:477](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Node.ts#L477)

***

### destroyPlayer()

```ts
destroyPlayer(guildId: any): Promise<any>
```

Destroys the Player on the Lavalink Server

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `guildId` | `any` |  |

#### Returns

`Promise`\<`any`\>

request result

#### Example

```ts
// use player.destroy() instead
player.node.destroyPlayer(player.guildId);
```

#### Defined in

[src/structures/Node.ts:370](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Node.ts#L370)

***

### fetchAllPlayers()

```ts
fetchAllPlayers(): Promise<LavalinkPlayer[] | InvalidLavalinkRestRequest>
```

Gets all Players of a Node

#### Returns

`Promise`\<[`LavalinkPlayer`](/api/interfaces/lavalinkplayer/)[] \| [`InvalidLavalinkRestRequest`](/api/interfaces/invalidlavalinkrestrequest/)\>

array of players inside of lavalink

#### Example

```ts
const node = lavalink.nodes.get("NODEID");
const playersOfLavalink = await node?.fetchAllPlayers();
```

#### Defined in

[src/structures/Node.ts:544](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Node.ts#L544)

***

### fetchInfo()

```ts
fetchInfo(): Promise<LavalinkInfo>
```

Request Lavalink information.

#### Returns

`Promise`\<[`LavalinkInfo`](/api/interfaces/lavalinkinfo/)\>

lavalink info object

#### Example

```ts
const lavalinkInfo = await player.node.fetchInfo();
const availablePlugins:string[] = lavalinkInfo.plugins.map(plugin => plugin.name);
const availableSources:string[] = lavalinkInfo.sourceManagers;
```

#### Defined in

[src/structures/Node.ts:796](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Node.ts#L796)

***

### fetchPlayer()

```ts
fetchPlayer(guildId: string): Promise<LavalinkPlayer | InvalidLavalinkRestRequest>
```

Gets specific Player Information

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `guildId` | `string` |

#### Returns

`Promise`\<[`LavalinkPlayer`](/api/interfaces/lavalinkplayer/) \| [`InvalidLavalinkRestRequest`](/api/interfaces/invalidlavalinkrestrequest/)\>

lavalink player object if player exists on lavalink

#### Example

```ts
const node = lavalink.nodes.get("NODEID");
const playerInformation = await node?.fetchPlayer("guildId");
```

#### Defined in

[src/structures/Node.ts:559](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Node.ts#L559)

***

### fetchStats()

```ts
fetchStats(): Promise<BaseNodeStats>
```

Request Lavalink statistics.

#### Returns

`Promise`\<[`BaseNodeStats`](/api/interfaces/basenodestats/)\>

the lavalink node stats

#### Example

```ts
const lavalinkStats = await player.node.fetchStats();
```

#### Defined in

[src/structures/Node.ts:767](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Node.ts#L767)

***

### fetchVersion()

```ts
fetchVersion(): Promise<string>
```

Request Lavalink version.

#### Returns

`Promise`\<`string`\>

the current used lavalink version

#### Example

```ts
const lavalinkVersion = await player.node.fetchVersion();
```

#### Defined in

[src/structures/Node.ts:780](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Node.ts#L780)

***

### getSponsorBlock()

```ts
getSponsorBlock(player: Player): Promise<SponsorBlockSegment[]>
```

Get the current sponsorblocks for the sponsorblock plugin

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `player` | [`Player`](/api/classes/player/) | passthrough the player |

#### Returns

`Promise`\<[`SponsorBlockSegment`](/api/type-aliases/sponsorblocksegment/)[]\>

sponsorblock seggment from lavalink

#### Example

```ts
// use it on the player via player.getSponsorBlock();
const sponsorBlockSegments = await player.node.getSponsorBlock(player);
```

#### Defined in

[src/structures/Node.ts:1334](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Node.ts#L1334)

***

### lavaSearch()

```ts
lavaSearch(
   query: LavaSearchQuery, 
   requestUser: unknown, 
throwOnEmpty: boolean): Promise<SearchResult | LavaSearchResponse>
```

Search something using the lavaSearchPlugin (filtered searches by types)

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `query` | [`LavaSearchQuery`](/api/type-aliases/lavasearchquery/) | `undefined` | LavaSearchQuery Object |
| `requestUser` | `unknown` | `undefined` | Request User for creating the player(s) |
| `throwOnEmpty` | `boolean` | `false` | Wether to throw on an empty result or not |

#### Returns

`Promise`\<[`SearchResult`](/api/interfaces/searchresult/) \| [`LavaSearchResponse`](/api/interfaces/lavasearchresponse/)\>

LavaSearchresult

#### Example

```ts
// use player.search() instead
player.node.lavaSearch({ types: ["playlist", "album"], query: "Rick Astley", source: "spotify" }, interaction.user);
```

#### Defined in

[src/structures/Node.ts:283](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Node.ts#L283)

***

### request()

```ts
request(
   endpoint: string, 
   modify?: ModifyRequest, 
parseAsText?: boolean): Promise<any>
```

Makes an API call to the Node. Should only be used for manual parsing like for not supported plugins

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `endpoint` | `string` | `undefined` | The endpoint that we will make the call to |
| `modify`? | [`ModifyRequest`](/api/type-aliases/modifyrequest/) | `undefined` | Used to modify the request before being sent |
| `parseAsText`? | `boolean` | `false` | - |

#### Returns

`Promise`\<`any`\>

The returned data

#### Example

```ts
player.node.request(`/loadtracks?identifier=Never gonna give you up`, (options) => options.method = "GET", false);
```

#### Defined in

[src/structures/Node.ts:183](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Node.ts#L183)

***

### search()

```ts
search(
   query: SearchQuery, 
   requestUser: unknown, 
throwOnEmpty: boolean): Promise<SearchResult>
```

Search something raw on the node, please note only add tracks to players of that node

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `query` | [`SearchQuery`](/api/type-aliases/searchquery/) | `undefined` | SearchQuery Object |
| `requestUser` | `unknown` | `undefined` | Request User for creating the player(s) |
| `throwOnEmpty` | `boolean` | `false` | Wether to throw on an empty result or not |

#### Returns

`Promise`\<[`SearchResult`](/api/interfaces/searchresult/)\>

Searchresult

#### Example

```ts
// use player.search() instead
player.node.search({ query: "Never gonna give you up by Rick Astley", source: "soundcloud" }, interaction.user);
player.node.search({ query: "https://deezer.com/track/123456789" }, interaction.user);
```

#### Defined in

[src/structures/Node.ts:209](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Node.ts#L209)

***

### setSponsorBlock()

```ts
setSponsorBlock(player: Player, segments: SponsorBlockSegment[]): Promise<void>
```

Set the current sponsorblocks for the sponsorblock plugin

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `player` | [`Player`](/api/classes/player/) | passthrough the player |
| `segments` | [`SponsorBlockSegment`](/api/type-aliases/sponsorblocksegment/)[] | - |

#### Returns

`Promise`\<`void`\>

void

#### Example

```ts
// use it on the player via player.setSponsorBlock();
const sponsorBlockSegments = await player.node.setSponsorBlock(player, ["sponsor", "selfpromo"]);
```

#### Defined in

[src/structures/Node.ts:1352](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Node.ts#L1352)

***

### updatePlayer()

```ts
updatePlayer(data: PlayerUpdateInfo): Promise<LavalinkPlayer>
```

Update the Player State on the Lavalink Server

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `data` | [`PlayerUpdateInfo`](/api/interfaces/playerupdateinfo/) | data to send to lavalink and sync locally |

#### Returns

`Promise`\<[`LavalinkPlayer`](/api/interfaces/lavalinkplayer/)\>

result from lavalink

#### Example

```ts
// use player.search() instead
player.node.updatePlayer({ guildId: player.guildId, playerOptions: { paused: true } }); // example to pause it
```

#### Defined in

[src/structures/Node.ts:330](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Node.ts#L330)

***

### updateSession()

```ts
updateSession(resuming?: boolean, timeout?: number): Promise<InvalidLavalinkRestRequest | Session>
```

Updates the session with and enables/disables resuming and timeout

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `resuming`? | `boolean` | Whether resuming is enabled for this session or not |
| `timeout`? | `number` | The timeout in seconds (default is 60s) |

#### Returns

`Promise`\<[`InvalidLavalinkRestRequest`](/api/interfaces/invalidlavalinkrestrequest/) \| [`Session`](/api/interfaces/session/)\>

the result of the request

#### Example

```ts
const node = player.node || lavalink.nodes.get("NODEID");
await node?.updateSession(true, 180e3); // will enable resuming for 180seconds
```

#### Defined in

[src/structures/Node.ts:576](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Node.ts#L576)
