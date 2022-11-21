import { User } from "discord.js";

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
    guildId: string;
    /** The text channel the Player belongs to. */
    textChannel: string;
    /** The voice channel the Player belongs to. */
    voiceChannel?: string;
    /** The node the Player uses. */
    node?: string;
    /** The initial volume the Player will use. */
    volume?: number;
    /** If the player should mute itself. */
    selfMute?: boolean;
    /** If the player should deaf itself. */
    selfDeafen?: boolean;
}

// will be used for the class (you don't need to make interfaces for classes, but just to keep in )
export interface LavalinkPlayer {
    /** @deprecated use guildId instead - The guild the Player belongs to. */
    guild: string;
    /** The guild the Player belongs to. */
    guildId: string,
//    queue: Track[],
    creator: User,
    createdAt: number,
}

export class Player {
    
}
