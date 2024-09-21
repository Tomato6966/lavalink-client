---
editUrl: false
next: true
prev: true
title: "LowPassFilter"
---

Higher frequencies get suppressed, while lower frequencies pass through this filter, thus the name low pass.
Any smoothing values equal to or less than 1.0 will disable the filter.

## Properties

| Property | Type | Description | Defined in |
| ------ | ------ | ------ | ------ |
| `smoothing?` | `number` | The smoothing factor (1.0 < x) | [src/structures/Types/Filters.ts:151](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Types/Filters.ts#L151) |
