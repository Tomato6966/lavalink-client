import {
	CommandInteractionOptionResolver, GuildMember, SlashCommandBuilder, VoiceChannel
} from "discord.js";

import { Command } from "../types/Client";

export default {
    data: new SlashCommandBuilder()
        .setName("ftts").setDescription("Use Flowery Text To Speech")
        .addStringOption(o => o.setName("text").setDescription("The Text to translate").setRequired(true))
        .addStringOption(o => o.setName("voice").setDescription("The Voice, and thus language to use").setRequired(false)),
    execute: async (client, interaction) => {
        if(!interaction.guildId) return;
        
        const vcId = (interaction.member as GuildMember)?.voice?.channelId;
        if(!vcId) return interaction.reply({ ephemeral: true, content: "Join a Voice Channel "});
        
        const vc = (interaction.member as GuildMember)?.voice?.channel as VoiceChannel;
        if(!vc.joinable || !vc.speakable) return interaction.reply({ ephemeral: true, content: "I am not able to join your channel / speak in there." });
        
        const player = await client.lavalink.createPlayer({
            guildId: interaction.guildId, 
            voiceChannelId: vcId, 
            textChannelId: interaction.channelId, 
            selfDeaf: true, 
            selfMute: false,
            volume: 100,  // default volume
            instaUpdateFiltersFix: true, // optional
            applyVolumeAsFilter: false, // if true player.setVolume(54) -> player.filters.setVolume(0.54)
            // node: "YOUR_NODE_ID",
            // vcRegion: (interaction.member as GuildMember)?.voice.channel?.rtcRegion!
        });
        const connected = player.connected;

        if(!connected) await player.connect();
        if(player.voiceChannelId !== vcId) return interaction.reply({ ephemeral: true, content: "You need to be in my Voice Channel" });
        
        const query = (interaction.options as CommandInteractionOptionResolver ).getString("text")!;
        const voice = (interaction.options as CommandInteractionOptionResolver ).getString("voice")!
        
        const extraParams = new URLSearchParams();
        if(voice) extraParams.append(`voice`, voice);
        
        const response = await player.search({ 
            query: `${query}`,
            extraQueryUrlParams: extraParams, 
            source: "ftts"
        }, interaction.user);

        if(!response || !response.tracks?.length) return interaction.reply({ content: `No Tracks found`, ephemeral: true });

        player.queue.add(response.tracks[0]);

        await interaction.reply({
            content: `Added your TTs request to queue position. #${player.queue.tracks.length}`,
            ephemeral: true,
        });

        if(!player.playing) await player.play(connected ? { volume: client.defaultVolume, paused: false } : undefined);
    }
} as Command;