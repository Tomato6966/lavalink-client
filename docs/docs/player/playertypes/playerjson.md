# PlayerJson

**Type:** [Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global\_Objects/Object)

<table><thead><tr><th width="202.33333333333331">Parameter</th><th width="191">Type</th><th>Description</th></tr></thead><tbody><tr><td>guildId</td><td><a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String">string</a></td><td>The GuildId of the Player</td></tr><tr><td>options</td><td><a href="../playeroptions.md">PlayerOptions</a></td><td>The Player's Creation Option</td></tr><tr><td>voiceChannelId</td><td><a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String">string</a> | <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/null">null</a></td><td>The VoiceChannel Id of the Player</td></tr><tr><td>textChannelId</td><td><a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String">string</a> | <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/null">null</a></td><td>The TextChannel Id of the Player</td></tr><tr><td>position</td><td><a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number">number</a></td><td>The current Position (included the calculated one)</td></tr><tr><td>lastPosition</td><td><a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number">number</a></td><td>The last Position, lavalink stated</td></tr><tr><td>volume</td><td><a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number">number</a></td><td>The Client sided Volume (included the VolumeDecrementer)</td></tr><tr><td>lavalinkVolume</td><td><a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number">number</a></td><td>The real Volume, lavalink is outputting</td></tr><tr><td>repeatMode</td><td><a href="repeatmode.md">RepeatMode</a></td><td>The Repeat mode of the Player</td></tr><tr><td>paused</td><td><a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean">boolean</a></td><td>If the Player is paused / not</td></tr><tr><td>playing</td><td><a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean">boolean</a></td><td>If the Player is actually supposed to be outputting audio</td></tr><tr><td>createdTimeStamp</td><td><a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number">number</a></td><td>When the Player was created (on Lavalink)</td></tr><tr><td>filters</td><td><a href="../../other-types/filterdata/">FilterData</a></td><td>The Filter Data(s) of the Player (not the filter states, the actual values)</td></tr><tr><td>Equalizer</td><td><a href="../../other-types/eqband.md">EQBand</a>[]</td><td>The Equalizer(s) of the Player</td></tr><tr><td>nodeId</td><td>?<a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String">string</a></td><td>The Node of the Player</td></tr><tr><td>ping</td><td><p>{ </p><p>  ws: <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number">number</a>,</p><p>  lavalink: <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number">number</a></p><p> }</p></td><td>The Ping of the Player</td></tr></tbody></table>

```typescript
export interface PlayerJson {
    guildId: string;
    options: PlayerOptions;
    voiceChannelId: string;
    textChannelId?: string;
    position: number;
    lastPosition: number;
    volume: number;
    lavalinkVolume: number;
    repeatMode: RepeatMode;
    paused: boolean;
    playing: boolean;
    createdTimeStamp?: number;
    filters: FilterData;
    ping: {
        ws: number;
        lavalink: number;
    }
    equalizer: EQBand[];
    nodeId?: string;
}

```
