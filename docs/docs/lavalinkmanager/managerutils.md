---
description: Utils you can use on the Manager side, for Tracks and other things!
---

# ManagerUtils

**ype:** [class](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/class)

## Constructor

```javascript
new LavalinkManager(options:ManagerOptions)
```

## <mark style="color:red;">Import</mark>

{% tabs %}
{% tab title="Typescript / ESM" %}
<pre class="language-typescript" data-title="index.ts" data-line-numbers><code class="lang-typescript"><strong>import { ManagerUtils } from "lavalink-client";
</strong></code></pre>
{% endtab %}

{% tab title="JavaScript (cjs)" %}
{% code title="index.js" lineNumbers="true" %}
```javascript
const { ManagerUtils } = require("lavalink-client");
```
{% endcode %}
{% endtab %}
{% endtabs %}

## <mark style="color:red;">Overview</mark>

| Properties                                          | Methods                                                                                                             | Event-Listeners |
| --------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- | --------------- |
| [LavalinkManager](managerutils.md#.lavalinkmanager) | [buildTrack](managerutils.md#.buildtrack-data-lavalinktrack-or-track-requester-any)                                 |                 |
|                                                     | [buildUnresolvedTrack](managerutils.md#.buildunresolvedtrack-data-unresolvedquery-or-unresolvedtrack-requester-any) |                 |
|                                                     | [isNode](managerutils.md#.isnode-data-lavalinknode)                                                                 |                 |
|                                                     | [isNodeOptions](managerutils.md#.isnodeoptions-data-lavalinknodeoptions)                                            |                 |
|                                                     | [isTrack](managerutils.md#.istrack-data-track)                                                                      |                 |
|                                                     | [isUnresolvedTrack](managerutils.md#.isunresolvedtrack-data-unresolvedtrack)                                        |                 |
|                                                     | [isUnresolvedTrackQuery](managerutils.md#.isunresolvedtrackquery-data-unresolvedquery)                              |                 |
|                                                     | [getClosestTrack](managerutils.md#.getclosesttrack-data-unresolvedtrack-player-player)                              |                 |
|                                                     | [validateQueryString](managerutils.md#.validatequerystring-node-lavalinknode-data-string)                           |                 |
|                                                     | [validateSourceString](managerutils.md#.validatesourcestring-node-lavalinknode-data-searchplatform)                 |                 |

***

## <mark style="color:blue;">Properties</mark>

### <mark style="color:blue;">.LavalinkManager</mark>

> _The provided Manager_

**Type**: [LavalinkManager](./) | [null](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/null)

## <mark style="color:purple;">Methods</mark>

### <mark style="color:purple;">.buildTrack(data:</mark> [LavalinkTrack](../other-types/lavalinktrack/)|[Track](../other-types/track/)<mark style="color:purple;">, requester:</mark>any<mark style="color:purple;">)</mark>

> _Builds a Lavalink Track Response to a Client-Track._
>
> _<mark style="color:orange;">If no Manager was proivided to the Util Manager, then manager#playerOptions#requestTransformer can't be used.</mark>_

**Returns**: [Track](../other-types/track/)

<pre class="language-typescript"><code class="lang-typescript"><strong>const LavalinkTrack = await player.node.request("/loadtracks?identifier=dQw4w9WgXcQ");
</strong><strong>const ClientTrack = client.lavalink.utils.buildTrack(LavalinkTrack, interaction.user);
</strong></code></pre>

### <mark style="color:purple;">.buildUnresolvedTrack(data:</mark>[UnresolvedQuery](../other-types/unresolvedquery.md)|[UnresolvedTrack](../other-types/unresolvedtrack.md)<mark style="color:purple;">, requester:</mark>any<mark style="color:purple;">)</mark>

> _Builds an unresolved Track of a UnresolvedQuery / Track._
>
> _<mark style="color:orange;">If no Manager was proivided to the Util Manager, then manager#playerOptions#requestTransformer can't be used.</mark>_

**Returns**: [UnresolvedTrack](../other-types/unresolvedtrack.md)

<pre class="language-typescript"><code class="lang-typescript"><strong>const UnresolvedTrackQuery = { 
</strong><strong>  // you can also do { info: { title, author } }
</strong><strong>  title: "Never gonna give you up", 
</strong><strong>  author: "Rick Astley"
</strong><strong>}
</strong><strong>const UnresolvedTrack = client.lavalink.utils.buildUnresolvedTrack(UnresolvedTrackQuery, interaction.user);
</strong></code></pre>

### <mark style="color:purple;">.isNode(data:</mark>[LavalinkNode](../nodemanager/types/lavalinknode.md)<mark style="color:purple;">)</mark>

> _Checks if provided data is a Lavalink Node._

**Returns**: [boolean](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global\_Objects/Boolean)

```typescript
if(!client.lavalink.utils.isNode(player?.node))
 throw new Error("player.node is not a valid node")
```

### <mark style="color:purple;">.isNodeOptions(data:</mark>[LavalinkNodeOptions](../nodemanager/types/lavalinknodeoptions.md)<mark style="color:purple;">)</mark>

> _Checks if provided data is a Lavalink Node Options Object._

**Returns**: [boolean](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global\_Objects/Boolean)

```typescript
if(!client.lavalink.utils.isNodeOptions({
  host: "localhost", port: 999999, // it will say false cause:
  // authorization is missing + port is invalid
}))
 throw new Error("player.node is not a valid node")
```

### <mark style="color:purple;">.isTrack(data:</mark>[Track](../other-types/track/)<mark style="color:purple;">)</mark>

> _Checks if provided data is a Client Track Object._

**Returns**: [boolean](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global\_Objects/Boolean)

```typescript
if(!client.lavalink.utils.isTrack(yourData))
 throw new Error("Provided data is not a Track")
```

### <mark style="color:purple;">.isUnresolvedTrack(data:</mark>[UnresolvedTrack](../other-types/unresolvedtrack.md)<mark style="color:purple;">)</mark>

> _Checks if provided data is a Client UnresolvedTrack Object._

**Returns**: [boolean](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global\_Objects/Boolean)

```typescript
if(!client.lavalink.utils.isUnresolvedTrack(yourData))
 throw new Error("Provided data is not an unresolved Track")
```

### <mark style="color:purple;">.isUnresolvedTrackQuery(data:</mark>[UnresolvedQuery](../other-types/unresolvedquery.md)<mark style="color:purple;">)</mark>

> _Checks if provided data is a UnresolvedQuery Object._

**Returns**: [boolean](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global\_Objects/Boolean)

```typescript
if(!client.lavalink.utils.isUnresolvedTrackQuery(yourData))
 throw new Error("Provided data is not an unresolved Track Query Object")
```

### <mark style="color:purple;">.getClosestTrack(data:</mark>[UnresolvedTrack](../other-types/unresolvedtrack.md)<mark style="color:purple;">, player:</mark> [Player](../player/)<mark style="color:purple;">)</mark>

> _Try's to find the Closest Track possible of an unresovled Track_
>
> _if Unresolved track has encoded: it will try to decode it_
>
> _If unresolved Track has uri / isrc it will try to search by that_

**Returns**: [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global\_Objects/Promise)<[Track ](../other-types/track/)| [undefined](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global\_Objects/undefined)>

```typescript
const unresolvedTrack = client.lavalink.utils.buildUnresolved({ title: "Never Gonna Give you up" }, interaction.user);
const closest = await client.lavalink.utils.getClosestTrack(unresolvedTrack, player);
player.queue.add(closest);
// note you can also add unresolved tracks to the queue, the queue will automatically try to resolve it, when it's time to play it.
// you can also run await unresolvedTrack.resolve(); to resolve the track
```

### <mark style="color:purple;">.validateQueryString(node:</mark> [LavalinkNode](../nodemanager/types/lavalinknode.md)<mark style="color:purple;">, data:</mark>[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global\_Objects/String)<mark style="color:purple;">)</mark>

> _Checks if the query string contains a link and checks the followings:_
>
> * If its source is enabled on the provided node
> * If managerOptions#validLinks is provided, it also checks for those

**Returns**: [boolean](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global\_Objects/Boolean)

```typescript
if(!client.lavalink.utils.validateQueryString(player.node, "https://www.youtube.com/watch?v=dQw4w9WgXcQ"))
 throw new Error("Can't use that link, cause the source of it is disabled on lavalink")
```

### <mark style="color:purple;">.validateSourceString(node:</mark> [LavalinkNode](../nodemanager/types/lavalinknode.md)<mark style="color:purple;">, data:</mark>[SearchPlatform](../other-types/searchplatform/)<mark style="color:purple;">)</mark>

> _Checks if SearchPlatform is useable, by checking if the source is enabled on the provided node_

**Returns**: [boolean](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global\_Objects/Boolean)

```typescript
if(!client.lavalink.utils.validateSourceString(player.node, "youtube"))
 throw new Error("Can't use that source, cause it's disabled on lavalink")
```

###
