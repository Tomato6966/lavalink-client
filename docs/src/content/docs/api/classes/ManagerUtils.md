---
editUrl: false
next: true
prev: true
title: "ManagerUtils"
---

## Constructors

### new ManagerUtils()

```ts
new ManagerUtils(LavalinkManager?: LavalinkManager): ManagerUtils
```

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `LavalinkManager`? | [`LavalinkManager`](/api/classes/lavalinkmanager/) |

#### Returns

[`ManagerUtils`](/api/classes/managerutils/)

#### Defined in

[src/structures/Utils.ts:46](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Utils.ts#L46)

## Properties

| Property | Modifier | Type | Default value | Defined in |
| ------ | ------ | ------ | ------ | ------ |
| `LavalinkManager` | `public` | [`LavalinkManager`](/api/classes/lavalinkmanager/) | `null` | [src/structures/Utils.ts:45](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Utils.ts#L45) |

## Methods

### buildPluginInfo()

```ts
buildPluginInfo(data: any, clientData: any): any
```

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `data` | `any` |
| `clientData` | `any` |

#### Returns

`any`

#### Defined in

[src/structures/Utils.ts:50](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Utils.ts#L50)

***

### buildTrack()

```ts
buildTrack(data: Track | LavalinkTrack, requester: unknown): Track
```

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `data` | [`Track`](/api/interfaces/track/) \| [`LavalinkTrack`](/api/interfaces/lavalinktrack/) |
| `requester` | `unknown` |

#### Returns

[`Track`](/api/interfaces/track/)

#### Defined in

[src/structures/Utils.ts:57](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Utils.ts#L57)

***

### buildUnresolvedTrack()

```ts
buildUnresolvedTrack(query: UnresolvedTrack | UnresolvedQuery, requester: unknown): UnresolvedTrack
```

Builds a UnresolvedTrack to be resolved before being played  .

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `query` | [`UnresolvedTrack`](/api/interfaces/unresolvedtrack/) \| [`UnresolvedQuery`](/api/interfaces/unresolvedquery/) |  |
| `requester` | `unknown` |  |

#### Returns

[`UnresolvedTrack`](/api/interfaces/unresolvedtrack/)

#### Defined in

[src/structures/Utils.ts:111](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Utils.ts#L111)

***

### getClosestTrack()

```ts
getClosestTrack(data: UnresolvedTrack, player: Player): Promise<Track>
```

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `data` | [`UnresolvedTrack`](/api/interfaces/unresolvedtrack/) |
| `player` | [`Player`](/api/classes/player/) |

#### Returns

`Promise`\<[`Track`](/api/interfaces/track/)\>

#### Defined in

[src/structures/Utils.ts:219](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Utils.ts#L219)

***

### getTransformedRequester()

```ts
getTransformedRequester(requester: unknown): unknown
```

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `requester` | `unknown` |

#### Returns

`unknown`

#### Defined in

[src/structures/Utils.ts:154](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Utils.ts#L154)

***

### isNode()

```ts
isNode(data: LavalinkNode): boolean
```

Validate if a data is equal to a node

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `data` | [`LavalinkNode`](/api/classes/lavalinknode/) |  |

#### Returns

`boolean`

#### Defined in

[src/structures/Utils.ts:144](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Utils.ts#L144)

***

### isNodeOptions()

```ts
isNodeOptions(data: LavalinkNodeOptions): boolean
```

Validate if a data is equal to node options

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `data` | [`LavalinkNodeOptions`](/api/interfaces/lavalinknodeoptions/) |  |

#### Returns

`boolean`

#### Defined in

[src/structures/Utils.ts:175](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Utils.ts#L175)

***

### isTrack()

```ts
isTrack(data: UnresolvedTrack | Track): data is Track
```

Validate if a data is equal to a track

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `data` | [`UnresolvedTrack`](/api/interfaces/unresolvedtrack/) \| [`Track`](/api/interfaces/track/) | the Track to validate |

#### Returns

`data is Track`

#### Defined in

[src/structures/Utils.ts:195](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Utils.ts#L195)

***

### isUnresolvedTrack()

```ts
isUnresolvedTrack(data: UnresolvedTrack | Track): data is UnresolvedTrack
```

Checks if the provided argument is a valid UnresolvedTrack.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `data` | [`UnresolvedTrack`](/api/interfaces/unresolvedtrack/) \| [`Track`](/api/interfaces/track/) |

#### Returns

`data is UnresolvedTrack`

#### Defined in

[src/structures/Utils.ts:205](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Utils.ts#L205)

***

### isUnresolvedTrackQuery()

```ts
isUnresolvedTrackQuery(data: UnresolvedQuery): boolean
```

Checks if the provided argument is a valid UnresolvedTrack.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `data` | [`UnresolvedQuery`](/api/interfaces/unresolvedquery/) |

#### Returns

`boolean`

#### Defined in

[src/structures/Utils.ts:215](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Utils.ts#L215)

***

### transformLavaSearchQuery()

```ts
transformLavaSearchQuery(query: LavaSearchQuery): object
```

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `query` | [`LavaSearchQuery`](/api/type-aliases/lavasearchquery/) |

#### Returns

`object`

| Name | Type | Defined in |
| ------ | ------ | ------ |
| `query` | `string` | [src/structures/Utils.ts:338](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Utils.ts#L338) |
| `source` | `any` | [src/structures/Utils.ts:340](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Utils.ts#L340) |
| `types` | `string`[] | [src/structures/Utils.ts:339](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Utils.ts#L339) |

#### Defined in

[src/structures/Utils.ts:334](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Utils.ts#L334)

***

### transformQuery()

```ts
transformQuery(query: SearchQuery): object
```

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `query` | [`SearchQuery`](/api/type-aliases/searchquery/) |

#### Returns

`object`

| Name | Type | Defined in |
| ------ | ------ | ------ |
| `extraQueryUrlParams` | `URLSearchParams` | [src/structures/Utils.ts:322](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Utils.ts#L322) |
| `query` | `string` | [src/structures/Utils.ts:321](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Utils.ts#L321) |
| `source` | `any` | [src/structures/Utils.ts:323](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Utils.ts#L323) |

#### Defined in

[src/structures/Utils.ts:318](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Utils.ts#L318)

***

### validateQueryString()

```ts
validateQueryString(
   node: LavalinkNode, 
   queryString: string, 
   sourceString?: LavalinkSearchPlatform): void
```

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `node` | [`LavalinkNode`](/api/classes/lavalinknode/) |
| `queryString` | `string` |
| `sourceString`? | [`LavalinkSearchPlatform`](/api/type-aliases/lavalinksearchplatform/) |

#### Returns

`void`

#### Defined in

[src/structures/Utils.ts:236](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Utils.ts#L236)

***

### validateSourceString()

```ts
validateSourceString(node: LavalinkNode, sourceString: SearchPlatform): void
```

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `node` | [`LavalinkNode`](/api/classes/lavalinknode/) |
| `sourceString` | [`SearchPlatform`](/api/type-aliases/searchplatform/) |

#### Returns

`void`

#### Defined in

[src/structures/Utils.ts:351](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Utils.ts#L351)
