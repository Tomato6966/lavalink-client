---
editUrl: false
next: true
prev: true
title: "FilterManager"
---

The FilterManager for each player

## Constructors

### new FilterManager()

```ts
new FilterManager(player: Player): FilterManager
```

The Constructor for the FilterManager

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `player` | [`Player`](/api/classes/player/) |

#### Returns

[`FilterManager`](/api/classes/filtermanager/)

#### Defined in

[src/structures/Filters.ts:108](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Filters.ts#L108)

## Properties

| Property | Modifier | Type | Default value | Description | Defined in |
| ------ | ------ | ------ | ------ | ------ | ------ |
| `data` | `public` | [`FilterData`](/api/interfaces/filterdata/) | `undefined` | The Filter Data sent to Lavalink, only if the filter is enabled (ofc.) | [src/structures/Filters.ts:39](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Filters.ts#L39) |
| `equalizerBands` | `public` | [`EQBand`](/api/interfaces/eqband/)[] | `[]` | The Equalizer bands currently applied to the Lavalink Server | [src/structures/Filters.ts:12](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Filters.ts#L12) |
| `filters` | `public` | [`PlayerFilters`](/api/interfaces/playerfilters/) | `undefined` | All "Active" / "disabled" Player Filters | [src/structures/Filters.ts:16](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Filters.ts#L16) |
| `filterUpdatedState` | `public` | `boolean` | `false` | Private Util for the instaFix Filters option | [src/structures/Filters.ts:14](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Filters.ts#L14) |
| `lavalinkFilterPlugin` | `public` | `object` | `undefined` | - | [src/structures/Filters.ts:549](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Filters.ts#L549) |
| `lavalinkFilterPlugin.toggleEcho` | `public` | (`delay`: `number`, `decay`: `number`) => `Promise`\<`boolean`\> | `undefined` | Enables / Disables the Echo effect, IMPORTANT! Only works with the correct Lavalink Plugin installed. (Optional: provide your Own Data) | [src/structures/Filters.ts:556](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Filters.ts#L556) |
| `lavalinkFilterPlugin.toggleReverb` | `public` | (`delays`: `number`[], `gains`: `number`[]) => `Promise`\<`boolean`\> | `undefined` | Enables / Disables the Echo effect, IMPORTANT! Only works with the correct Lavalink Plugin installed. (Optional: provide your Own Data) | [src/structures/Filters.ts:580](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Filters.ts#L580) |
| `lavalinkLavaDspxPlugin` | `public` | `object` | `undefined` | - | [src/structures/Filters.ts:443](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Filters.ts#L443) |
| `lavalinkLavaDspxPlugin.toggleEcho` | `public` | (`decay`?: `number`, `echoLength`?: `number`) => `Promise`\<`boolean`\> | `undefined` | Enables / Disables the Echo effect, IMPORTANT! Only works with the correct Lavalink Plugin installed. (Optional: provide your Own Data) | [src/structures/Filters.ts:529](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Filters.ts#L529) |
| `lavalinkLavaDspxPlugin.toggleHighPass` | `public` | (`boostFactor`: `number`, `cutoffFrequency`: `number`) => `Promise`\<`boolean`\> | `undefined` | Enables / Disables the HighPass effect, (Optional: provide your Own Data) | [src/structures/Filters.ts:477](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Filters.ts#L477) |
| `lavalinkLavaDspxPlugin.toggleLowPass` | `public` | (`boostFactor`: `number`, `cutoffFrequency`: `number`) => `Promise`\<`boolean`\> | `undefined` | Enables / Disables the LowPass effect, (Optional: provide your Own Data) | [src/structures/Filters.ts:451](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Filters.ts#L451) |
| `lavalinkLavaDspxPlugin.toggleNormalization` | `public` | (`maxAmplitude`?: `number`, `adaptive`?: `boolean`) => `Promise`\<`boolean`\> | `undefined` | Enables / Disables the Normalization effect. | [src/structures/Filters.ts:503](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Filters.ts#L503) |
| `player` | `public` | [`Player`](/api/classes/player/) | `undefined` | The Player assigned to this Filter Manager | [src/structures/Filters.ts:106](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Filters.ts#L106) |

## Methods

### applyPlayerFilters()

```ts
applyPlayerFilters(): Promise<void>
```

Apply Player filters for lavalink filter sending data, if the filter is enabled / not

#### Returns

`Promise`\<`void`\>

#### Defined in

[src/structures/Filters.ts:116](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Filters.ts#L116)

***

### checkFiltersState()

```ts
checkFiltersState(oldFilterTimescale?: Partial<TimescaleFilter>): boolean
```

Checks if the filters are correctly stated (active / not-active)

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `oldFilterTimescale`? | `Partial`\<[`TimescaleFilter`](/api/interfaces/timescalefilter/)\> |  |

#### Returns

`boolean`

#### Defined in

[src/structures/Filters.ts:175](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Filters.ts#L175)

***

### clearEQ()

```ts
clearEQ(): Promise<FilterManager>
```

Clears the equalizer bands.

#### Returns

`Promise`\<[`FilterManager`](/api/classes/filtermanager/)\>

#### Defined in

[src/structures/Filters.ts:689](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Filters.ts#L689)

***

### isCustomFilterActive()

```ts
isCustomFilterActive(): boolean
```

Function to find out if currently there is a custom timescamle etc. filter applied

#### Returns

`boolean`

#### Defined in

[src/structures/Filters.ts:655](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Filters.ts#L655)

***

### resetFilters()

```ts
resetFilters(): Promise<PlayerFilters>
```

Reset all Filters

#### Returns

`Promise`\<[`PlayerFilters`](/api/interfaces/playerfilters/)\>

#### Defined in

[src/structures/Filters.ts:203](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Filters.ts#L203)

***

### setAudioOutput()

```ts
setAudioOutput(type: AudioOutputs): Promise<AudioOutputs>
```

Set the AudioOutput Filter

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `type` | [`AudioOutputs`](/api/type-aliases/audiooutputs/) |  |

#### Returns

`Promise`\<[`AudioOutputs`](/api/type-aliases/audiooutputs/)\>

#### Defined in

[src/structures/Filters.ts:303](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Filters.ts#L303)

***

### setEQ()

```ts
setEQ(bands: EQBand | EQBand[]): Promise<FilterManager>
```

Sets the players equalizer band on-top of the existing ones.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `bands` | [`EQBand`](/api/interfaces/eqband/) \| [`EQBand`](/api/interfaces/eqband/)[] |  |

#### Returns

`Promise`\<[`FilterManager`](/api/classes/filtermanager/)\>

#### Defined in

[src/structures/Filters.ts:663](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Filters.ts#L663)

***

### setPitch()

```ts
setPitch(pitch: number): Promise<boolean>
```

Set custom filter.timescale#pitch . This method disabled both: nightcore & vaporwave. use 1 to reset it to normal

#### Parameters

| Parameter | Type | Default value |
| ------ | ------ | ------ |
| `pitch` | `number` | `1` |

#### Returns

`Promise`\<`boolean`\>

#### Defined in

[src/structures/Filters.ts:340](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Filters.ts#L340)

***

### setRate()

```ts
setRate(rate: number): Promise<boolean>
```

Set custom filter.timescale#rate . This method disabled both: nightcore & vaporwave. use 1 to reset it to normal

#### Parameters

| Parameter | Type | Default value |
| ------ | ------ | ------ |
| `rate` | `number` | `1` |

#### Returns

`Promise`\<`boolean`\>

#### Defined in

[src/structures/Filters.ts:365](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Filters.ts#L365)

***

### setSpeed()

```ts
setSpeed(speed: number): Promise<boolean>
```

Set custom filter.timescale#speed . This method disabled both: nightcore & vaporwave. use 1 to reset it to normal

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `speed` | `number` | `1` |  |

#### Returns

`Promise`\<`boolean`\>

#### Defined in

[src/structures/Filters.ts:316](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Filters.ts#L316)

***

### setVolume()

```ts
setVolume(volume: number): Promise<boolean>
```

Set the Filter Volume

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `volume` | `number` |  |

#### Returns

`Promise`\<`boolean`\>

#### Defined in

[src/structures/Filters.ts:288](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Filters.ts#L288)

***

### toggleKaraoke()

```ts
toggleKaraoke(
   level: number, 
   monoLevel: number, 
   filterBand: number, 
filterWidth: number): Promise<boolean>
```

Enable / Disables a Karaoke like Filter Effect

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `level` | `number` | `1` |  |
| `monoLevel` | `number` | `1` |  |
| `filterBand` | `number` | `220` |  |
| `filterWidth` | `number` | `100` |  |

#### Returns

`Promise`\<`boolean`\>

#### Defined in

[src/structures/Filters.ts:641](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Filters.ts#L641)

***

### toggleLowPass()

```ts
toggleLowPass(smoothing: number): Promise<boolean>
```

Enables / Disables the LowPass effect, (Optional: provide your Own Data)

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `smoothing` | `number` | `20` |  |

#### Returns

`Promise`\<`boolean`\>

#### Defined in

[src/structures/Filters.ts:434](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Filters.ts#L434)

***

### toggleNightcore()

```ts
toggleNightcore(
   speed: number, 
   pitch: number, 
rate: number): Promise<boolean>
```

Enables / Disables a Nightcore-like filter Effect. Disables/Overrides both: custom and Vaporwave Filter

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `speed` | `number` | `1.289999523162842` |  |
| `pitch` | `number` | `1.289999523162842` |  |
| `rate` | `number` | `0.9365999523162842` |  |

#### Returns

`Promise`\<`boolean`\>

#### Defined in

[src/structures/Filters.ts:602](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Filters.ts#L602)

***

### toggleRotation()

```ts
toggleRotation(rotationHz: number): Promise<boolean>
```

Enables / Disables the rotation effect, (Optional: provide your Own Data)

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `rotationHz` | `number` | `0.2` |  |

#### Returns

`Promise`\<`boolean`\>

#### Defined in

[src/structures/Filters.ts:388](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Filters.ts#L388)

***

### toggleTremolo()

```ts
toggleTremolo(frequency: number, depth: number): Promise<boolean>
```

Enables / Disables the Tremolo effect, (Optional: provide your Own Data)

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `frequency` | `number` | `4` |  |
| `depth` | `number` | `0.8` |  |

#### Returns

`Promise`\<`boolean`\>

#### Defined in

[src/structures/Filters.ts:420](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Filters.ts#L420)

***

### toggleVaporwave()

```ts
toggleVaporwave(
   speed: number, 
   pitch: number, 
rate: number): Promise<boolean>
```

Enables / Disables a Vaporwave-like filter Effect. Disables/Overrides both: custom and nightcore Filter

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `speed` | `number` | `0.8500000238418579` |  |
| `pitch` | `number` | `0.800000011920929` |  |
| `rate` | `number` | `1` |  |

#### Returns

`Promise`\<`boolean`\>

#### Defined in

[src/structures/Filters.ts:621](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Filters.ts#L621)

***

### toggleVibrato()

```ts
toggleVibrato(frequency: number, depth: number): Promise<boolean>
```

Enables / Disables the Vibrato effect, (Optional: provide your Own Data)

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `frequency` | `number` | `10` |  |
| `depth` | `number` | `1` |  |

#### Returns

`Promise`\<`boolean`\>

#### Defined in

[src/structures/Filters.ts:405](https://github.com/appujet/lavalink-client/blob/4880e032861893b27e80b7c2d6c36639afbb3479/src/structures/Filters.ts#L405)
