---
description: What a raw lavalink request information object looks like untransformed
---

# LavalinkTrackInfo

## <mark style="color:red;">Overview</mark>

<table><thead><tr><th width="214">Parameter</th><th width="204">Type</th><th>Description</th></tr></thead><tbody><tr><td>identifier</td><td><a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String">string</a></td><td>The Identifier of the Track</td></tr><tr><td>title</td><td><a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String">string</a></td><td>The Track Title / Name</td></tr><tr><td>author</td><td><a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String">string</a></td><td>The Name of the Author</td></tr><tr><td>length</td><td><a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number">number</a></td><td>The Duration of the Track</td></tr><tr><td>artworkUrl</td><td><a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String">string</a> | <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/null">null</a></td><td>The URL of the artwork if available</td></tr><tr><td>uri</td><td><a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String">string</a></td><td>THe URL (aka Link) of the Track</td></tr><tr><td>sourceName</td><td><a href="../sourcenames/">SourceNames</a></td><td>The Sourcename of the Track </td></tr><tr><td>isSeekable</td><td><a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean">boolean</a></td><td>Wether the audio is seekable</td></tr><tr><td>isStream</td><td><a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean">boolean</a></td><td>Wether the Track is a live-stream</td></tr><tr><td>isrc</td><td><a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String">string</a> | <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/null">null</a></td><td>The ISRC code of the Track, if available</td></tr></tbody></table>

## <mark style="color:red;">Interface</mark>

```typescript
export interface LavalinkTrackInfo {
    /** The Identifier of the Track */
    identifier: string;
    /** The Track Title / Name */
    title: string;
    /** The Name of the Author */
    author: string;
    /** The duration of the Track */
    length: number;
    /** The URL of the artwork if available */
    artworkUrl: string | null;
    /** The URL (aka Link) of the Track called URI */
    uri: string;
    /** The Source name of the song, e.g. soundcloud, youtube, spotify */
    sourceName: SourceNames;
    /** Wether the audio is seekable */
    isSeekable: boolean;
    /** Wether the audio is of a live stream */
    isStream: boolean;
    /** If isrc code is available, it's provided */
    isrc: string | null;
}
```
