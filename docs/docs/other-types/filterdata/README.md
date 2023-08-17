# FilterData

```typescript
export interface LavalinkFilterData {
    volume?: number;
    karaoke?: KaraokeFilter;
    timescale?: TimescaleFilter;
    tremolo?: FreqFilter;
    vibrato?: FreqFilter;
    rotation?: RotationFilter;
    // rotating: RotationFilter
    distortion?: DistortionFilter;
    channelMix?: ChannelMixFilter;
    lowPass?: LowPassFilter;
    echo: EchoFilter,
    reverb: ReverbFilter,
}
```
