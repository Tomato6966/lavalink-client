---
editUrl: false
next: true
prev: true
title: "ChannelMixFilter"
---

Mixes both channels (left and right), with a configurable factor on how much each channel affects the other.
With the defaults, both channels are kept independent of each other.
Setting all factors to 0.5 means both channels get the same audio.

## Properties

| Property | Type | Description | Defined in |
| ------ | ------ | ------ | ------ |
| `leftToLeft?` | `number` | The left to left channel mix factor (0.0 ≤ x ≤ 1.0) | [src/structures/Types/Filters.ts:136](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Types/Filters.ts#L136) |
| `leftToRight?` | `number` | The left to right channel mix factor (0.0 ≤ x ≤ 1.0) | [src/structures/Types/Filters.ts:138](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Types/Filters.ts#L138) |
| `rightToLeft?` | `number` | The right to left channel mix factor (0.0 ≤ x ≤ 1.0) | [src/structures/Types/Filters.ts:140](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Types/Filters.ts#L140) |
| `rightToRight?` | `number` | The right to right channel mix factor (0.0 ≤ x ≤ 1.0) | [src/structures/Types/Filters.ts:142](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Types/Filters.ts#L142) |
