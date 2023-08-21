---
description: >-
  The Raw LavalinkTrack data when you search from the node manually without the
  player.search method. it won't be recognised as a "Track Object" tho.
---

# LavalinkTrack

## <mark style="color:red;">Overview</mark>

<table><thead><tr><th width="147.33333333333331">Parameter</th><th width="232">Type</th><th>Description</th></tr></thead><tbody><tr><td>encoded</td><td><a href="base64.md">Base64</a></td><td>The Base64 encoded String</td></tr><tr><td>info</td><td><a href="lavalinktrackinfo.md">LavalinkTrackInfo</a></td><td>Track Information, raw by lavalink</td></tr><tr><td>pluginInfo</td><td><a href="https://www.geeksforgeeks.org/typescript-partialtype-utility-type/">Partial</a>&#x3C;<a href="../track/plugininfo.md">PluginInfo</a>></td><td>Plugin Information, raw by lavalink</td></tr></tbody></table>

## <mark style="color:red;">Interface</mark>

```typescript
export interface LavalinkTrack {
    /** The Base 64 encoded String */
    encoded?: Base64;
    /** Track Information */
    info: LavalinkTrackInfo;
    /** Plugin Information from Lavalink */
    pluginInfo: Partial<PluginInfo>;
}
```
