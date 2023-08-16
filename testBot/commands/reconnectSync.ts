import { GuildMember, SlashCommandBuilder, VoiceChannel } from "discord.js";
import { Command } from "../types/Client";

export default {
    data: new SlashCommandBuilder()
        .setName("reconnect_sync").setDescription("Reconnects to a Voice Channel if the Bot crashed, and syncs the queue!"),
    execute: async (client, interaction) => {
        if(!interaction.guildId) return;
        
        const vcId = (interaction.member as GuildMember)?.voice?.channelId;
        if(!vcId) return interaction.reply({ ephemeral: true, content: "Join a Voice Channel "});
        
        const vc = (interaction.member as GuildMember)?.voice?.channel as VoiceChannel;
        if(!vc.joinable || !vc.speakable) return interaction.reply({ ephemeral: true, content: "I am not able to join your channel / speak in there." });
        
        const player = client.lavalink.getPlayer(interaction.guildId);
        if(player?.voiceChannelId && player.connected) return interaction.reply({ ephemeral: true, content: "I'm already connected." })
        if(player) { // player already created, but not connected yet -> connect to it!
            player.voiceChannelId = player?.voiceChannelId || vcId;
            await player.connect();
        }

        const newPlayer = await client.lavalink.createPlayer({ // if it was existing before, but connected afterwards, it just re-gets the player of the cache
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

        await newPlayer.connect();
        
        await newPlayer.queue.utils.sync(true, false);
        
        if(!newPlayer.queue.current && !newPlayer.queue.tracks.length) return await interaction.reply({ ephemeral: true, content: `No current Song could be synced, with no upcoming tracks`})

        await newPlayer.play();
    
        return await interaction.reply({
            content: `Joined your voiceChannel Synced`,
            ephemeral: true,
        });
    }
} as Command;