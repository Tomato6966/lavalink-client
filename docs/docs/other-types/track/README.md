---
description: >-
  The Lavalink-Client Track Data, (transformed + enforced LavalinkTrack with a
  requester Property)
---

# Track

## O<mark style="color:red;">verview</mark>

<table><thead><tr><th width="142.33333333333331">Parameter</th><th width="198">Type</th><th>Description</th></tr></thead><tbody><tr><td>encoded</td><td><a href="../lavalinktrack/base64.md">Base64</a></td><td>The Base 64 encoded String</td></tr><tr><td>info</td><td><a href="trackinfo.md">TrackInfo</a></td><td>The Track Information (transformed)</td></tr><tr><td>pluginInfo</td><td><a href="https://www.geeksforgeeks.org/typescript-partialtype-utility-type/">Partial</a>&#x3C;<a href="plugininfo.md">PluginInfo</a>></td><td>The PluginInformation by client + by lavalink</td></tr><tr><td>requester</td><td>unknown</td><td>The Requester you provided<br>If <a href="../../lavalinkmanager/">Manager</a>#<a href="../../player/playeroptions.md">playerOptions</a>#<a href="../../lavalinkmanager/manager-options/managerplayeroptions/requesttransformer.md">requestTransformer </a>is present, then it is the transformed requester.</td></tr></tbody></table>

## <mark style="color:red;">Interface</mark>

```typescript
export interface Track {
    /** The Base 64 encoded String */
    encoded?: Base64;
    /** Track Information */
    info: TrackInfo;
    /** Plugin Information from Lavalink */
    pluginInfo: Partial<PluginInfo>;
    /** The Track's Requester */
    requester?: unknown;
}
```
