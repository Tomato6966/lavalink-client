---
description: The main Base-Manager of this Package
---

# LavalinkManager

_Extends_ [_node:EventEmitter_](https://nodejs.org/dist/latest/docs/api/events.html#events\_class\_eventemitter)

### <mark style="color:red;">Import</mark>

{% tabs %}
{% tab title="Typescript / ESM" %}
<pre class="language-typescript" data-title="index.ts" data-line-numbers><code class="lang-typescript"><strong>import { LavalinkManager } from "lavalink-client";
</strong></code></pre>
{% endtab %}

{% tab title="JavaScript (cjs)" %}
{% code title="index.js" lineNumbers="true" %}
```javascript
const { LavalinkManager } = require("lavalink-client");
```
{% endcode %}
{% endtab %}
{% endtabs %}

### <mark style="color:red;">Overview</mark>



| Properties                     | Methods                                                                                                                                   | Event-Listeners                           |
| ------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------- |
| [initiated](./#.initated)      | [createPlayer()](./#.createplayer-options-playeroptions)                                                                                  | [trackStart](./#trackstart)               |
| [useable](./#.useable)         | [getPlayer()](./#.getplayer-guildid-string)                                                                                               | [trackEnd](./#trackend)                   |
| [options](./#.options)         | [deletePlayer()](./#.deleteplayer-guildid-string)                                                                                         | [trackStuck](./#trackstuck)               |
| [players](./#.players)         | [init()](./#.init-clientdata-botclientoptions-important) <mark style="color:red;">IMPORTANT</mark>                                        | [queueEnd](./#queueend)                   |
| [nodeManager](./#.nodemanager) | [sendRawData()](./#.sendrawdata-data-voicepacket-or-voiceserver-or-voicestate-or-any-important) <mark style="color:red;">IMPORTANT</mark> | [playerCreate](./#playercreate)           |
| [utils](./#.utils)             |                                                                                                                                           | [playerMove](./#playermove)               |
|                                |                                                                                                                                           | [playerDisconnect](./#playerdisconnect)   |
|                                |                                                                                                                                           | [playerSocketClose](./#playersocketclose) |
|                                |                                                                                                                                           | [playerDestroy](./#playerdestroy)         |
|                                |                                                                                                                                           | [playerUpdate](./#playerupdate)           |

### <mark style="color:blue;">Properties</mark>

#### <mark style="color:blue;">.initated</mark>

> _If the Manager was initated_

**Type**: [Boolean](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global\_Objects/Boolean)

#### <mark style="color:blue;">.useable</mark>

> _If the Manager is useable (If at least 1 Node is connected)_

**Type**: [Boolean](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global\_Objects/Boolean)

#### <mark style="color:blue;">.options</mark>

> _The options from the Manager_

**Type**: [ManagerOptions](manager-options/)

#### <mark style="color:blue;">.players</mark>

> _All the Players of the Manager_

**Type**_:_ [_MiniMap_](../managerutils/minimap.md)_\<guildId:_[_string_](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global\_Objects/String)_,_ [_Player_](../player/)_>_

#### <mark style="color:blue;">.nodeManager</mark>

> _The Node Manager of the Manager_

**Type**_:_ [_NodeManager_](../nodemanager/)

#### <mark style="color:blue;">.utils</mark>

> _The Manager's Utils_

**Type**_:_ [_ManagerUtils_](../managerutils/)

***

### <mark style="color:purple;">Methods</mark>

#### <mark style="color:purple;">.init(clientData:</mark> [BotClientOptions](../../botclientoptions.md)<mark style="color:purple;">)</mark> <mark style="color:red;">IMPORTANT!</mark>

> _Initializes the Manager and connects all Nodes_

**Returns**: [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global\_Objects/Promise)<[LavalinkManager](./)>

<pre class="language-typescript"><code class="lang-typescript"><strong>botClient.on("ready", async () => { // only init it when the Bot is ready...
</strong><strong>  await botClient.lavalink.init({ 
</strong><strong>    id: botClient.user.id, 
</strong><strong>    username: botclient.user.username
</strong><strong>  });
</strong><strong>});
</strong></code></pre>

#### <mark style="color:purple;">.createPlayer(options:</mark> [PlayerOptions](../player/playeroptions.md)<mark style="color:purple;">)</mark>

> _Create or get a Player_

**Returns**: [Player](../player/)

```typescript
const newPlayer = await client.lavalink.createPlayer({
  guildId: interaction.guildId, 
  voiceChannelId: interaction.member.voice?.channelId, 
  textChannelId: interaction.channelId, // (optional)
  selfDeaf: true, // (optional)
  selfMute: false, // (optional)
  volume: client.defaultVolume,  // (optional) default volume
  instaUpdateFiltersFix: true, // (optional)
  applyVolumeAsFilter: false, // (optional)
  // node: "YOUR_NODE_ID", // (optional)
  // vcRegion: interaction.member.voice?.channel?.rtcRegion // (optional)
});
```

#### <mark style="color:purple;">.getPlayer(guildId:</mark>[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global\_Objects/String)<mark style="color:purple;">)</mark>

> _Create a Player_

**Returns**: [Player](../player/) | [undefined](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global\_Objects/undefined)

<pre class="language-typescript"><code class="lang-typescript"><strong>const player = client.lavalink.getPlayer(interaction.guildId);
</strong></code></pre>

{% hint style="info" %}
Important Conditions to check:

* player is not undefined
* player is connected to a VoiceChannel
* user in a VoiceChannel && player in same VoiceChannel as user
* player.node is Connected
* player is playing / there is a current song in player.queue
{% endhint %}

#### <mark style="color:purple;">.deletePlayer(guildId:</mark>[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global\_Objects/String)<mark style="color:purple;">)</mark>

> _Removes a Player from the saved_ [_MiniMap_](../managerutils/minimap.md)_, needs to be destroyed first_

**Returns**: [Boolean](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global\_Objects/Boolean)

<pre class="language-typescript"><code class="lang-typescript"><strong>client.lavalink.deletePlayer(oldPlayer?.guildId || interaction.guildId);
</strong></code></pre>

#### <mark style="color:purple;">.sendRawData(data :</mark> <mark style="color:orange;">VoicePacket | VoiceServer | VoiceState | any</mark><mark style="color:purple;">)</mark> <mark style="color:red;">IMPORTANT!</mark>

> _Sends Raw Discord's Clients Event Data to the Manager_

**Returns**: [void](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/void)

<pre class="language-typescript"><code class="lang-typescript"><strong>botClient.on("raw", (data) => client.lavalink.sendRawData(data));
</strong><strong>
</strong></code></pre>

***

### <mark style="color:red;">Event-Listeners</mark>

> _All Events you can listen to on the LavalinkManager Class_

#### <mark style="color:red;">trackStart</mark>

> _Emitted whenever a Track plays_&#x20;

<table><thead><tr><th width="145.33333333333331">Parameter</th><th width="187">Type</th><th>Description</th></tr></thead><tbody><tr><td>player</td><td><a href="../player/">Player</a></td><td>The Player for this Event</td></tr><tr><td>track</td><td><a href="../other-types/track.md">Track</a></td><td>The current playing track (player.queue.current)</td></tr><tr><td>payload</td><td><a href="../other-types/payloads/trackstartevent.md">TrackStartEvent</a></td><td>The Payload Lavalink sent</td></tr></tbody></table>

```typescript
client.lavalink.on("trackStart", (player, track, payload) => { });
```

#### <mark style="color:red;">trackEnd</mark>

> _Emitted whenever a Track finished playing._

<table><thead><tr><th width="145.33333333333331">Parameter</th><th width="187">Type</th><th>Description</th></tr></thead><tbody><tr><td>player</td><td><a href="../player/">Player</a></td><td>The Player for this Event</td></tr><tr><td>track</td><td><a href="../other-types/track.md">Track</a></td><td>The Track that finished Playing</td></tr><tr><td>payload</td><td><a href="../other-types/payloads/trackendevent.md">TrackEndEvent</a></td><td>The Payload Lavalink sent</td></tr></tbody></table>

```typescript
client.lavalink.on("trackEnd", (player, track, payload) => { });
```

#### <mark style="color:red;">trackStuck</mark>

> _Emitted whenever a Track got stuck while playing_

<table><thead><tr><th width="145.33333333333331">Parameter</th><th width="187">Type</th><th>Description</th></tr></thead><tbody><tr><td>player</td><td><a href="../player/">Player</a></td><td>The Player for this Event</td></tr><tr><td>track</td><td><a href="../other-types/track.md">Track</a></td><td>The Track that got stuck</td></tr><tr><td>payload</td><td><a href="../other-types/payloads/trackstuckevent.md">TrackStuckEvent</a></td><td>The Payload Lavalink sent</td></tr></tbody></table>

```typescript
client.lavalink.on("trackStuck", (player, track, payload) => { });
```

#### <mark style="color:red;">trackError</mark>

> Emitted whenever a Track errored

<table><thead><tr><th width="145.33333333333331">Parameter</th><th width="193">Type</th><th>Description</th></tr></thead><tbody><tr><td>player</td><td><a href="../player/">Player</a></td><td>The Player for this Event</td></tr><tr><td>track</td><td><a href="../other-types/track.md">Track</a> | <a href="../other-types/unresolvedtrack.md">UnresolvedTrack</a></td><td>The Track that Errored</td></tr><tr><td>payload</td><td><a href="../other-types/payloads/trackexceptionevent.md">TrackExceptionEvent</a></td><td>The Payload Lavalink sent</td></tr></tbody></table>

```typescript
client.lavalink.on("trackError", (player, track, payload) => { });
```

#### <mark style="color:red;">queueEnd</mark>

> Emitted when the track Ended, but there are no more tracks in the queue
>
> (trackEnd, does NOT get exexcuted)&#x20;

<table><thead><tr><th width="145.33333333333331">Parameter</th><th width="198">Type</th><th>Description</th></tr></thead><tbody><tr><td>player</td><td><a href="../player/">Player</a></td><td>The Player for this Event</td></tr><tr><td>track</td><td><a href="../other-types/track.md">Track</a></td><td>The last played track</td></tr><tr><td>payload</td><td><a href="../other-types/payloads/trackendevent.md">TrackEndEvent</a> | <a href="../other-types/payloads/trackstuckevent.md">TrackStuckEvent</a> | <a href="../other-types/payloads/trackexceptionevent.md">TrackExceptionEvent</a></td><td>The Payload Lavalink sent</td></tr></tbody></table>

```typescript
client.lavalink.on("queueEnd", (player, track, payload) => { });
```

#### <mark style="color:red;">playerCreate</mark>

> Emitted whenver a Player get's created

<table><thead><tr><th width="145.33333333333331">Parameter</th><th width="187">Type</th><th>Description</th></tr></thead><tbody><tr><td>player</td><td><a href="../player/">Player</a></td><td>The created Player</td></tr></tbody></table>

```typescript
client.lavalink.on("playerCreate", (player) => { });
```

#### <mark style="color:red;">playerMove</mark>

> Emitted whenever a Player get's moved between Voice Channels&#x20;

<table><thead><tr><th width="201.33333333333331">Parameter</th><th width="187">Type</th><th>Description</th></tr></thead><tbody><tr><td>player</td><td><a href="../player/">Player</a></td><td>The Player for this Event</td></tr><tr><td>oldVoiceChannelId</td><td><a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String">string</a></td><td>old Voice Channel Id</td></tr><tr><td>newVoiceChannelId</td><td><a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String">string</a></td><td>new Voice Channel Id</td></tr></tbody></table>

```typescript
client.lavalink.on("playerMove", (player, oldVCId, newVCId) => { });
```

#### <mark style="color:red;">playerDisconnect</mark>

> Emitted whenever a player is disconnected from a channel&#x20;

<table><thead><tr><th width="167.33333333333331">Parameter</th><th width="187">Type</th><th>Description</th></tr></thead><tbody><tr><td>player</td><td><a href="../player/">Player</a></td><td>The Player for this Event</td></tr><tr><td>voiceChannelId</td><td><a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String">string</a></td><td>The disconnected voice Channel</td></tr></tbody></table>

```typescript
client.lavalink.on("playerDisconnect", (player, voiceChannelId) => { });
```

#### <mark style="color:red;">playerSocketClose</mark>

> Emitted when a Node-Socket got closed for a specific Player

<table><thead><tr><th width="145.33333333333331">Parameter</th><th width="216">Type</th><th>Description</th></tr></thead><tbody><tr><td>player</td><td><a href="../player/">Player</a></td><td>The Player for this Event</td></tr><tr><td>payload</td><td><a href="../other-types/payloads/websocketclosedevent.md">WebSocketClosedEvent</a></td><td>The Payload Lavalink sent</td></tr></tbody></table>

```typescript
client.lavalink.on("playerSocketClose", (player, track, payload) => { });
```

#### <mark style="color:red;">playerDestroy</mark>

> Emitted whenever a Player got destroyed

<table><thead><tr><th width="170.33333333333331">Parameter</th><th width="228">Type</th><th>Description</th></tr></thead><tbody><tr><td>player</td><td><a href="../player/">Player</a></td><td>The Destroyed Player</td></tr><tr><td>destroyReason</td><td>?<a href="../player/playerdestroyreasons.md">PlayerDestroyReasons</a></td><td>The Destroy Reason (if provided)</td></tr></tbody></table>

```typescript
client.lavalink.on("playerDestroy", (player, destroyReason) => { });
```

#### <mark style="color:red;">playerUpdate</mark>

> Emitted whenever a Player get's update from Lavalink's playerUpdate Event&#x20;

<table><thead><tr><th width="160">Parameter</th><th width="186.33333333333331">Type</th><th>Description</th></tr></thead><tbody><tr><td>oldPlayerJson</td><td><a href="../player/playertypes/playerjson.md">PlayerJson</a></td><td>Player Data before it was udpated</td></tr><tr><td>newPlayer</td><td><a href="../player/">Player</a></td><td>Afterwards the Player got updated</td></tr></tbody></table>

```typescript
client.lavalink.on("playerUpdate", (oldPlayerJson, newPlayer) => { });
```
