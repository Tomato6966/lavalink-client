import { CommandInteractionOptionResolver, GuildMember, SlashCommandBuilder, VoiceChannel } from "discord.js";
import {  Command } from "../types/Client";
import { formatMS_HHMMSS } from "../Utils/Time";
import { SearchPlatform, SearchResult, Track, UnresolvedQuery } from "../../src";

const autocompleteMap = new Map();

export default {
    data: new SlashCommandBuilder()
        .setName("addunresolved")
        .setDescription("Example of adding an unresolved track")
        .addStringOption(o => o.setName("title").setDescription("What song title?").setRequired(true))
        .addStringOption(o => o.setName("author").setDescription("From which author?").setRequired(false))
        .addStringOption(o => o.setName("uri").setDescription("Do you have a song-link?").setRequired(false))
        // .addStringOption(o => o.setName("title").setDescription("What song title?").setRequired(false))
        .addStringOption(o => o.setName("source").setDescription("From which Source you want to add?").setRequired(false).setChoices(
            { name: "Youtube", value: "ytsearch" },
            { name: "Youtube Music", value: "ytmsearch" },
            { name: "Soundcloud", value: "scsearch" },
            { name: "Deezer", value: "dzsearch" },
            { name: "Spotify", value: "spsearch" },
            { name: "Apple Music", value: "amsearch" },
        )),
    execute: async (client, interaction) => {
        if(!interaction.guildId) return;
        
        const vcId = (interaction.member as GuildMember)?.voice?.channelId;
        if(!vcId) return interaction.reply({ ephemeral: true, content: `Join a voice Channel` });

        const vc = (interaction.member as GuildMember)?.voice?.channel as VoiceChannel;
        if(!vc.joinable || !vc.speakable) return interaction.reply({ ephemeral: true, content: "I am not able to join your channel / speak in there." });
        
        const src = (interaction.options as CommandInteractionOptionResolver).getString("source") as SearchPlatform|undefined;
        const title = (interaction.options as CommandInteractionOptionResolver).getString("title") as string;
        const author = (interaction.options as CommandInteractionOptionResolver).getString("author") as string;
        const uri = (interaction.options as CommandInteractionOptionResolver).getString("uri") as string;

        const player = client.lavalink.getPlayer(interaction.guildId) || await client.lavalink.createPlayer({
            guildId: interaction.guildId, 
            voiceChannelId: vcId, 
            textChannelId: interaction.channelId, 
            selfDeaf: true, 
            selfMute: false,
            volume: client.defaultVolume,  // default volume
            instaUpdateFiltersFix: true, // optional
            applyVolumeAsFilter: false, // if true player.setVolume(54) -> player.filters.setVolume(0.54)
            // node: "YOUR_NODE_ID",
            // vcRegion: (interaction.member as GuildMember)?.voice.channel?.rtcRegion!
        });
        
        const connected = player.connected;

        if(!connected) await player.connect();

        await player.queue.add(
            client.lavalink.utils.buildUnresolvedTrack({
                title: title,
                author: author || undefined,
                uri: uri || undefined,
                sourceName: src || undefined,
            } as UnresolvedQuery, interaction.user)
        );

        await interaction.reply({
            content: `Added a Unresolved Track, will resolve it once it's up to play! (skip to it)` 
        });

        if(!player.playing) await player.play(connected ? { volume: client.defaultVolume, paused: false } : undefined);
    },
} as Command;