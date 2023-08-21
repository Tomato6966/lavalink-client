---
description: Plugin Info is an object, provided by LAVALINK PLUGINS and the CLIENT mixed
---

# PluginInfo

What are Lavalink Plugins, which exist and how do they work? Check out those reference informations: [https://github.com/lavalink-devs/Lavalink/blob/master/PLUGINS.md](https://github.com/lavalink-devs/Lavalink/blob/master/PLUGINS.md)

The PluginInfo is only filled out when you use a lavalink plugin, like lavasrc, lavasearch, ...

If you want you can override pluginInfo.clientData if you want to have some custom track informations!

## <mark style="color:red;">Overview</mark>

<table><thead><tr><th width="145.33333333333331">Parameter</th><th width="182">Type</th><th width="217">Description</th><th>Of Which Plugin</th></tr></thead><tbody><tr><td>type</td><td>"album" | "playlist" |<br>"artist" |<br>"recommendations" | <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String">string</a></td><td>The Response type</td><td><a href="https://github.com/TopiSenpai/LavaSrc">LavaSrc</a> &#x26; <a href="https://github.com/topi314/LavaSearch">LavaSearch</a></td></tr><tr><td>albumName</td><td><a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String">string</a></td><td>The Album Name</td><td><a href="https://github.com/TopiSenpai/LavaSrc">LavaSrc</a> &#x26; <a href="https://github.com/topi314/LavaSearch">LavaSearch</a></td></tr><tr><td>albumArtUrl</td><td><a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String">string</a></td><td>The Album artwork</td><td><a href="https://github.com/TopiSenpai/LavaSrc">LavaSrc</a> &#x26; <a href="https://github.com/topi314/LavaSearch">LavaSearch</a></td></tr><tr><td>artistUrl</td><td><a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String">string</a></td><td>The Artist URL</td><td><a href="https://github.com/TopiSenpai/LavaSrc">LavaSrc</a> &#x26; <a href="https://github.com/topi314/LavaSearch">LavaSearch</a></td></tr><tr><td>artistArtUrl</td><td><a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String">string</a></td><td>The Artist artwork Url</td><td><a href="https://github.com/TopiSenpai/LavaSrc">LavaSrc</a> &#x26; <a href="https://github.com/topi314/LavaSearch">LavaSearch</a></td></tr><tr><td>previewUrl</td><td><a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String">string</a></td><td>The Preview Track Url</td><td><a href="https://github.com/TopiSenpai/LavaSrc">LavaSrc</a> &#x26; <a href="https://github.com/topi314/LavaSearch">LavaSearch</a></td></tr><tr><td>isPreview</td><td><a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean">boolean</a></td><td>Wether it's a preview track / not</td><td><a href="https://github.com/TopiSenpai/LavaSrc">LavaSrc</a> &#x26; <a href="https://github.com/topi314/LavaSearch">LavaSearch</a></td></tr><tr><td>totalTracks</td><td><a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number">number</a></td><td>Amount of tracks</td><td><a href="https://github.com/TopiSenpai/LavaSrc">LavaSrc</a> &#x26; <a href="https://github.com/topi314/LavaSearch">LavaSearch</a></td></tr><tr><td>identifier</td><td><a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String">string</a></td><td>The Identifier of smt</td><td><a href="https://github.com/TopiSenpai/LavaSrc">LavaSrc</a> &#x26; <a href="https://github.com/topi314/LavaSearch">LavaSearch</a></td></tr><tr><td>artworkUrl</td><td><a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String">string</a></td><td>The Artwork Url</td><td><a href="https://github.com/TopiSenpai/LavaSrc">LavaSrc</a> &#x26; <a href="https://github.com/topi314/LavaSearch">LavaSearch</a></td></tr><tr><td>author</td><td><a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String">string</a></td><td>The Author Name</td><td>-</td></tr><tr><td>url</td><td><a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String">string</a></td><td>A Url for smt (OLD)</td><td>-</td></tr><tr><td>uri</td><td><a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String">string</a></td><td>A Url for smt (OLD)</td><td>-</td></tr><tr><td>clientData</td><td>{ [key:string]: any }</td><td>Custom Client Data </td><td><ul><li>custom</li></ul></td></tr></tbody></table>

_**Note that it can always have more data then the interface, if a plugin returns that.**_

## <mark style="color:red;">Interface</mark>

```typescript
export interface PluginInfo {
    /** The Type provided by a plugin */
    type?: "album" | "playlist" | "artist" | "recommendations" | string;
    /** The Identifier provided by a plugin */
    albumName?: string;
    /** The url of the album art */
    albumArtUrl?: string;
    /** The url of the artist */
    artistUrl?: string;
    /** The url of the artist artwork */
    artistArtworkUrl?: string;
    /** The url of the preview */
    previewUrl?: string;
    /** Whether the track is a preview */
    isPreview?: boolean;
    /** The total number of tracks in the playlist */
    totalTracks?: number;
    /** The Identifier provided by a plugin */
    identifier?: string;
    /** The ArtworkUrl provided by a plugin */
    artworkUrl?: string;
    /** The Author Information provided by a plugin */
    author?: string;
    /** The Url provided by a Plugin */
    url?: string,
    /** The Url provided by a Plugin */
    uri?: string,
    /** You can put specific track information here, to transform the tracks... */
    clientData?: { [key:string] : any },
}
```

clientData is optional, and can be declared by you manually afterwards savly, without messing things up (if you want)
