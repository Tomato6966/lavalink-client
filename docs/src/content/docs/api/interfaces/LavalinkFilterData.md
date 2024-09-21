---
editUrl: false
next: true
prev: true
title: "LavalinkFilterData"
---

Actual Filter Data sent to Lavalink

## Extends

- [`FilterData`](/api/interfaces/filterdata/)

## Properties

| Property | Type | Inherited from | Defined in |
| ------ | ------ | ------ | ------ |
| `channelMix?` | [`ChannelMixFilter`](/api/interfaces/channelmixfilter/) | [`FilterData`](/api/interfaces/filterdata/).`channelMix` | [src/structures/Types/Filters.ts:164](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Types/Filters.ts#L164) |
| `distortion?` | [`DistortionFilter`](/api/interfaces/distortionfilter/) | [`FilterData`](/api/interfaces/filterdata/).`distortion` | [src/structures/Types/Filters.ts:163](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Types/Filters.ts#L163) |
| `equalizer?` | [`EQBand`](/api/interfaces/eqband/)[] | - | [src/structures/Types/Filters.ts:199](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Types/Filters.ts#L199) |
| `karaoke?` | [`KaraokeFilter`](/api/interfaces/karaokefilter/) | [`FilterData`](/api/interfaces/filterdata/).`karaoke` | [src/structures/Types/Filters.ts:158](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Types/Filters.ts#L158) |
| `lowPass?` | [`LowPassFilter`](/api/interfaces/lowpassfilter/) | [`FilterData`](/api/interfaces/filterdata/).`lowPass` | [src/structures/Types/Filters.ts:165](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Types/Filters.ts#L165) |
| `pluginFilters?` | `object` | [`FilterData`](/api/interfaces/filterdata/).`pluginFilters` | [src/structures/Types/Filters.ts:166](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Types/Filters.ts#L166) |
| `pluginFilters.echo?` | `object` | - | [src/structures/Types/Filters.ts:189](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Types/Filters.ts#L189) |
| `pluginFilters.echo.decay?` | `number` | - | [src/structures/Types/Filters.ts:191](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Types/Filters.ts#L191) |
| `pluginFilters.echo.echoLength?` | `number` | - | [src/structures/Types/Filters.ts:190](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Types/Filters.ts#L190) |
| `pluginFilters.high-pass?` | `object` | - | [src/structures/Types/Filters.ts:177](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Types/Filters.ts#L177) |
| `pluginFilters.high-pass.boostFactor?` | `number` | - | [src/structures/Types/Filters.ts:179](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Types/Filters.ts#L179) |
| `pluginFilters.high-pass.cutoffFrequency?` | `number` | - | [src/structures/Types/Filters.ts:178](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Types/Filters.ts#L178) |
| `pluginFilters.lavalink-filter-plugin?` | `object` | - | [src/structures/Types/Filters.ts:167](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Types/Filters.ts#L167) |
| `pluginFilters.lavalink-filter-plugin.echo?` | `object` | - | [src/structures/Types/Filters.ts:168](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Types/Filters.ts#L168) |
| `pluginFilters.lavalink-filter-plugin.echo.decay?` | `number` | - | [src/structures/Types/Filters.ts:170](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Types/Filters.ts#L170) |
| `pluginFilters.lavalink-filter-plugin.echo.delay?` | `number` | - | [src/structures/Types/Filters.ts:169](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Types/Filters.ts#L169) |
| `pluginFilters.lavalink-filter-plugin.reverb?` | `object` | - | [src/structures/Types/Filters.ts:172](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Types/Filters.ts#L172) |
| `pluginFilters.lavalink-filter-plugin.reverb.delays?` | `number`[] | - | [src/structures/Types/Filters.ts:173](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Types/Filters.ts#L173) |
| `pluginFilters.lavalink-filter-plugin.reverb.gains?` | `number`[] | - | [src/structures/Types/Filters.ts:174](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Types/Filters.ts#L174) |
| `pluginFilters.low-pass?` | `object` | - | [src/structures/Types/Filters.ts:181](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Types/Filters.ts#L181) |
| `pluginFilters.low-pass.boostFactor?` | `number` | - | [src/structures/Types/Filters.ts:183](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Types/Filters.ts#L183) |
| `pluginFilters.low-pass.cutoffFrequency?` | `number` | - | [src/structures/Types/Filters.ts:182](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Types/Filters.ts#L182) |
| `pluginFilters.normalization?` | `object` | - | [src/structures/Types/Filters.ts:185](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Types/Filters.ts#L185) |
| `pluginFilters.normalization.adaptive?` | `boolean` | - | [src/structures/Types/Filters.ts:187](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Types/Filters.ts#L187) |
| `pluginFilters.normalization.maxAmplitude?` | `number` | - | [src/structures/Types/Filters.ts:186](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Types/Filters.ts#L186) |
| `rotation?` | [`RotationFilter`](/api/interfaces/rotationfilter/) | [`FilterData`](/api/interfaces/filterdata/).`rotation` | [src/structures/Types/Filters.ts:162](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Types/Filters.ts#L162) |
| `timescale?` | [`TimescaleFilter`](/api/interfaces/timescalefilter/) | [`FilterData`](/api/interfaces/filterdata/).`timescale` | [src/structures/Types/Filters.ts:159](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Types/Filters.ts#L159) |
| `tremolo?` | [`TremoloFilter`](/api/interfaces/tremolofilter/) | [`FilterData`](/api/interfaces/filterdata/).`tremolo` | [src/structures/Types/Filters.ts:160](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Types/Filters.ts#L160) |
| `vibrato?` | [`VibratoFilter`](/api/interfaces/vibratofilter/) | [`FilterData`](/api/interfaces/filterdata/).`vibrato` | [src/structures/Types/Filters.ts:161](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Types/Filters.ts#L161) |
| `volume?` | `number` | [`FilterData`](/api/interfaces/filterdata/).`volume` | [src/structures/Types/Filters.ts:157](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Types/Filters.ts#L157) |
