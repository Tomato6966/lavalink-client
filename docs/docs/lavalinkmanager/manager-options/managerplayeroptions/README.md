# ManagerPlayerOptions

**Type:** [object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global\_Objects/Object)

<table data-full-width="true"><thead><tr><th width="314">Parameter</th><th width="227">Type</th><th width="102" align="center">Required</th><th>Description</th></tr></thead><tbody><tr><td>applyVolumeAsFilter</td><td><a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean">boolean</a></td><td align="center">X</td><td>If set to true, it will use the Lavalink's filter.volume instead of lavalink.volume.</td></tr><tr><td>clientBasedPositionUpdateInterval</td><td><a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number">number</a></td><td align="center">X</td><td>How frequently to update the player.position on the client side for more accurate position display, without requiring "more" cpu usage</td></tr><tr><td>defaultSearchPlatform</td><td><a href="../../../other-types/searchplatform/">SearchPlatform</a></td><td align="center">X</td><td>which SearchPlatform to use, when no Platform was provided doring player.search</td></tr><tr><td>volumeDecrementer</td><td><a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number">number</a></td><td align="center">X</td><td>Decrement the Volume on the Lavalink server by a x % (decimal. aka decrement 70% => 0.7)</td></tr><tr><td>requesterTransformer</td><td><a href="requesttransformer.md">RequestTransformer</a></td><td align="center">X</td><td>Transform the Requester User Object, to something you want, to reduce track-object-size aka save memory</td></tr><tr><td>onDisconnect</td><td><p>{ </p><p>autoReconnect?: <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean">boolean</a></p><p>destroyPlayer?: <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean">boolean</a></p><p>}</p></td><td align="center">X</td><td>What the Manager should do when the Bot get's disconnected</td></tr><tr><td><em>onDisconnect</em>.<strong>autoReconnect</strong></td><td><a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean">boolean</a></td><td align="center">X</td><td>Should the Manager try to reconnect the Bot?</td></tr><tr><td><em>onDisconnect</em>.<strong>destroyPlayer</strong></td><td><a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean">boolean</a></td><td align="center">X</td><td>Or should the Manager directly Destroy the Player (overrides autoReconnect)</td></tr><tr><td>onEmptyQueue</td><td><p>{ </p><p>destroyAfterMs?: <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number">number</a></p><p>autoPlayFunction?: () =></p><p>}</p></td><td align="center">X</td><td>What the Manager should do when the Queue get's empty</td></tr><tr><td><em>onEmptyQueue</em>.<strong>destroyAfterMs</strong></td><td><a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number">number</a></td><td align="center">X</td><td>== 0 => Destroy Player immediately<br><br>> 0 => Destroy Player after that amount (in Milliseconds)<br><br>&#x3C; 0 || NaN || undefined => Don't destroy the Player</td></tr><tr><td><em>onEmptyQueue</em>.<strong>autoPlayFunction</strong></td><td><a href="autoplayfunction.md">AutoplayFunction</a></td><td align="center">X</td><td>This Function get's execute when the queue ends (before <a href="../../#queueend">queueEnd </a>event fires). If this Function adds a Track to the Queue, it get's played and the event doesn't fire <em>(but</em> <a href="../../#trackend"><em>trackEnd</em></a> <em>does)</em></td></tr><tr><td>useUnresolvedData</td><td><a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean">boolean</a></td><td align="center">X</td><td>If true, and you provide an unresolvedTrack, when resolving the Track, it overrides the real data with the provided data (to fake/enforce sources / titles, whatever)</td></tr></tbody></table>

### Example

```typescript
{
    applyVolumeAsFilter: false,
    clientBasedPositionUpdateInterval: 50,
    defaultSearchPlatform: "ytmsearch",
    volumeDecrementer: 0.75, // on client 100% == on lavalink 75%
    requesterTransformer: requesterTransformer,
    onDisconnect: {
        autoReconnect: true, // automatically attempts a reconnect, if the bot disconnects from the voice channel, if it fails, it get's destroyed
        destroyPlayer: false // overrides autoReconnect and directly destroys the player if the bot disconnects from the vc
    },
    onEmptyQueue: {
        destroyAfterMs: 30_000, // 0 === instantly destroy | don't provide the option, to don't destroy the player
        autoPlayFunction: autoPlayFunction,
    },
    useUnresolvedData: true
}
```

### Interface

```typescript
export interface ManagerPlayerOptions {
  /** If the Lavalink Volume should be decremented by x number */
  volumeDecrementer?: number;
  /** How often it should update the the player Position */
  clientBasedPositionUpdateInterval?: number;
  /** What should be used as a searchPlatform, if no source was provided during the query */
  defaultSearchPlatform?: SearchPlatform;
  /** Applies the volume via a filter, not via the lavalink volume transformer */
  applyVolumeAsFilter?:boolean;
  /** Transforms the saved data of a requested user */
  requesterTransformer?: (requester:unknown) => unknown;
  /** What lavalink-client should do when the player reconnects */
  onDisconnect?: {
    /** Try to reconnect? -> If fails -> Destroy */
    autoReconnect?: boolean;
    /** Instantly destroy player (overrides autoReconnect) */
    destroyPlayer?: boolean;
  };
  /* What the Player should do, when the queue gets empty */
  onEmptyQueue?: {
    /** Get's executed onEmptyQueue -> You can do any track queue previous transformations, if you add a track to the queue -> it will play it, if not queueEnd will execute! */
    autoPlayFunction?: (player:Player, lastPlayedTrack:Track) => Promise<void>;
    /* aut. destroy the player after x ms, if 0 it instantly destroys, don't provide to not destroy the player */
    destroyAfterMs?: number;
  };
  /* If to override the data from the Unresolved Track. for unresolved tracks */
  useUnresolvedData?: boolean;
}
```
