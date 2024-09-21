---
editUrl: false
next: true
prev: true
title: "EQBand"
---

There are 15 bands (0-14) that can be changed.
"gain" is the multiplier for the given band.
The default value is 0.
 Valid values range from -0.25 to 1.0, where -0.25 means the given band is completely muted, and 0.25 means it is doubled.
Modifying the gain could also change the volume of the output.

## Properties

| Property | Type | Description | Defined in |
| ------ | ------ | ------ | ------ |
| `band` | `number` \| [`IntegerNumber`](/api/type-aliases/integernumber/) | On what band position (0-14) it should work | [src/structures/Types/Filters.ts:57](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Types/Filters.ts#L57) |
| `gain` | `number` \| [`FloatNumber`](/api/type-aliases/floatnumber/) | The gain (-0.25 to 1.0) | [src/structures/Types/Filters.ts:59](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Types/Filters.ts#L59) |
