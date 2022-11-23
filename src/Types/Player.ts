import { Node } from "./Node";

export interface PlayerUpdatePayload {
    state: { 
        connected: boolean, 
        ping: number, 
        position: number, 
        time: number
    },
    guildId: string
}


export interface PlayerOptions {
    /** @deprecated use guildId instead - The guild the Player belongs to. */
    guild: string;
    /** The guild the Player belongs to. */
    guildId: string,
    
    /** @deprecated use guildId instead - The text channel the Player belongs to. */
    textChannel?: string;
    /**The text channel the Player belongs to. */
    textChannelId?: string;

    /** @deprecated use voiceChannelId instead - The voice channel the Player belongs to. */
    voiceChannel: string;
    /**The voice channel the Player belongs to. */
    voiceChannelId: string;

    /** The node the Player should ses. */
    node?: Node|string;
    /** The initial volume the Player will use. */
    volume?: number;
    
    /** If the player should mute itself. */
    selfMute?: boolean;
    /** If the player should deaf itself. */
    selfDeafen?: boolean;

    /** Voice-Region */
    region?: string;
}


/** Unresolved tracks can't be played normally, they will resolve before playing into a Track. */
export interface UnresolvedTrack extends Partial<Track> {
    /** The title to search against. */
    title: string;
    /** The author to search against. */
    author?: string;
    /** The duration to search within 1500 milliseconds of the results from YouTube. */
    duration?: number;
    /** Thumbnail of the track */
    thumbnail?: string;
    /** Identifier of the track */
    identifier?: string;
    /** Resolves into a Track. */
    resolve(): Promise<void>;
}

export interface PlayOptions {
    /** The position to start the track. */
    startTime?: number;
    /** The position to end the track. */
    endTime?: number;
    /** Whether to not replace the track if a play payload is sent. */
    noReplace?: boolean;    
    /** If to start "paused" */
    pause?: boolean;
    /** The Volume to start with */
    volume?: number;
}


export interface EqualizerBand {
    /** The band number being 0 to 14. */
    band: number;
    /** The gain amount being -0.25 to 1.00, 0.25 being double. */
    gain: number;
}