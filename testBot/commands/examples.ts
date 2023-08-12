import { GuildMember, SlashCommandBuilder } from "discord.js";
import { SubCommand } from "../types/Client";
import { StoredQueue } from "../../src";

export default {
    data: new SlashCommandBuilder()
        .setName("examples")
        .setDescription("Example Commands for tests")
        .addSubcommand(s => s.setName("remote_queue_change").setDescription("e.g. when you change the queue on the dashboard"))
        .addSubcommand(s => s.setName("clear_queue_sync").setDescription("Clear Queue")),
    execute: {
        remote_queue_change: async (client, interaction) => {
            // if not in a guild -> return
            if (!interaction.guildId) return;
            // get the guild's player
            const player = client.lavalink.getPlayer(interaction.guildId);
            // return if no player
            if (!player) return interaction.reply({ ephemeral: true, content: "I'm not connected" });
            // get old queue for difference
            const oldQueue = player.queue.tracks.map(v => "> - " + v.info.title);

            // clear old queue
            await client.redis.del("1015301715886624778");
            // override it
            await client.redis.set("1015301715886624778", JSON.stringify(getExampleQueue()));
            // sync the queue
            await player.queue.utils.sync(true);
            

            // reply
            await interaction.reply({
                content: `### Old Queue: \n${oldQueue.join("\n") || "> - Nothing"}\n### New Queue:\n${player.queue.tracks.map(v => "> - " + v.info.title).join("\n") || "> - Nothing"}`.substring(0, 1000)
            });
        },
        clear_queue_sync: async (client, interaction) => {
            // if not in a guild -> return
            if (!interaction.guildId) return;
            // get the guild's player
            const player = client.lavalink.getPlayer(interaction.guildId);
            // return if no player
            if (!player) return interaction.reply({ ephemeral: true, content: "I'm not connected" });
            // remove tracks
            await player.queue.splice(0, player.queue.tracks.length);
            // respond
            await interaction.reply({
                content: `There are now ${player.queue.tracks.length} Tracks`
            })
        }
    }
} as SubCommand;


function getExampleQueue() {
    return {
        "current": {
            "encoded": "QAABHQMAM0hleSBNYW1hIChmZWF0LiBCZWJlIFJleGhhLCBOaWNraSBNaW5haiAmIEFmcm9qYWNrKQAMRGF2aWQgR3VldHRhAAAAAAAC8egAC0hzejZoTF9hNjlRAAEAK2h0dHBzOi8vd3d3LnlvdXR1YmUuY29tL3dhdGNoP3Y9SHN6NmhMX2E2OVEBAIBodHRwczovL2xoMy5nb29nbGV1c2VyY29udGVudC5jb20vT0dOSm43RXpTM0xRVnRhc1pvZWtlVnI3OS13MzVHNDdfT1VWTWh4ckV0Wmx2aU9YMjEyR3hKM2JSLXFjd2YyM1lXeUNlanFnanQza2xlWGNmZz13MTAwMC1oMTAwMAAAB3lvdXR1YmUAAAAAAAAAAA==",
            "info": {
                "identifier": "Hsz6hL_a69Q",
                "title": "Hey Mama (feat. Bebe Rexha, Nicki Minaj & Afrojack)",
                "author": "David Guetta",
                "duration": 193000,
                "artworkUrl": "https://img.youtube.com/vi/Hsz6hL_a69Q/mqdefault.jpg",
                "uri": "https://www.youtube.com/watch?v=Hsz6hL_a69Q",
                "sourceName": "youtube",
                "isSeekable": true,
                "isStream": false,
                "isrc": null
            },
            "pluginInfo": {},
            "requester": {
                "id": "498094279793704991",
                "username": "chrissy8283",
                "globalName": "Chrissy",
                "avatar": "164c06b4e7ac2cdfffb941481e6511ca",
                "displayAvatarURL": "https://cdn.discordapp.com/avatars/498094279793704991/164c06b4e7ac2cdfffb941481e6511ca.webp"
            }
        },
        "previous": [],
        "tracks": [
            {
                "encoded": "QAAA4wMARkJsYWNrc3RyZWV0IC0gTm8gRGlnZ2l0eSAoT2ZmaWNpYWwgTXVzaWMgVmlkZW8pIGZ0LiBEci4gRHJlLCBRdWVlbiBQZW4AC0JsYWNrc3RyZWV0AAAAAAAEIpgACzNLTDltUnVzMTlvAAEAK2h0dHBzOi8vd3d3LnlvdXR1YmUuY29tL3dhdGNoP3Y9M0tMOW1SdXMxOW8BADRodHRwczovL2kueXRpbWcuY29tL3ZpLzNLTDltUnVzMTlvL21heHJlc2RlZmF1bHQuanBnAAAHeW91dHViZQAAAAAAAAAA",
                "info": {
                    "identifier": "3KL9mRus19o",
                    "title": "Blackstreet - No Diggity (Official Music Video) ft. Dr. Dre, Queen Pen",
                    "author": "Blackstreet",
                    "duration": 271000,
                    "artworkUrl": "https://img.youtube.com/vi/3KL9mRus19o/mqdefault.jpg",
                    "uri": "https://www.youtube.com/watch?v=3KL9mRus19o",
                    "sourceName": "youtube",
                    "isSeekable": true,
                    "isStream": false,
                    "isrc": null
                },
                "pluginInfo": {},
                "requester": {
                    "id": "498094279793704991",
                    "username": "chrissy8283",
                    "globalName": "Chrissy",
                    "avatar": "164c06b4e7ac2cdfffb941481e6511ca",
                    "displayAvatarURL": "https://cdn.discordapp.com/avatars/498094279793704991/164c06b4e7ac2cdfffb941481e6511ca.webp"
                }
            },
            {
                "encoded": "QAABHQMAM0hleSBNYW1hIChmZWF0LiBCZWJlIFJleGhhLCBOaWNraSBNaW5haiAmIEFmcm9qYWNrKQAMRGF2aWQgR3VldHRhAAAAAAAC8egAC0hzejZoTF9hNjlRAAEAK2h0dHBzOi8vd3d3LnlvdXR1YmUuY29tL3dhdGNoP3Y9SHN6NmhMX2E2OVEBAIBodHRwczovL2xoMy5nb29nbGV1c2VyY29udGVudC5jb20vT0dOSm43RXpTM0xRVnRhc1pvZWtlVnI3OS13MzVHNDdfT1VWTWh4ckV0Wmx2aU9YMjEyR3hKM2JSLXFjd2YyM1lXeUNlanFnanQza2xlWGNmZz13MTAwMC1oMTAwMAAAB3lvdXR1YmUAAAAAAAAAAA==",
                "info": {
                    "identifier": "Hsz6hL_a69Q",
                    "title": "Hey Mama (feat. Bebe Rexha, Nicki Minaj & Afrojack)",
                    "author": "David Guetta",
                    "duration": 193000,
                    "artworkUrl": "https://img.youtube.com/vi/Hsz6hL_a69Q/mqdefault.jpg",
                    "uri": "https://www.youtube.com/watch?v=Hsz6hL_a69Q",
                    "sourceName": "youtube",
                    "isSeekable": true,
                    "isStream": false,
                    "isrc": null
                },
                "pluginInfo": {},
                "requester": {
                    "id": "498094279793704991",
                    "username": "chrissy8283",
                    "globalName": "Chrissy",
                    "avatar": "164c06b4e7ac2cdfffb941481e6511ca",
                    "displayAvatarURL": "https://cdn.discordapp.com/avatars/498094279793704991/164c06b4e7ac2cdfffb941481e6511ca.webp"
                }
            },
            {
                "encoded": "QAAA+gMAEVNodXQgVXAgYW5kIERhbmNlAA1XQUxLIFRIRSBNT09OAAAAAAADDUAAC0dHc3VMVmxMT2JjAAEAK2h0dHBzOi8vd3d3LnlvdXR1YmUuY29tL3dhdGNoP3Y9R0dzdUxWbExPYmMBAH5odHRwczovL2xoMy5nb29nbGV1c2VyY29udGVudC5jb20vVEJad0dWZXhWd0txQjcyZGNHR1cxWTdnQ1dFX0o1Z0Q5V2FfM0xIbzBnb0xvNXZXbU5xLUJ2UHBfNEphdjhGTjhaM3NYYW5wTy1BVTgtWnQ9dzEwMDAtaDEwMDAAAAd5b3V0dWJlAAAAAAAAAAA=",
                "info": {
                    "identifier": "GGsuLVlLObc",
                    "title": "Shut Up and Dance",
                    "author": "WALK THE MOON",
                    "duration": 200000,
                    "artworkUrl": "https://img.youtube.com/vi/GGsuLVlLObc/mqdefault.jpg",
                    "uri": "https://www.youtube.com/watch?v=GGsuLVlLObc",
                    "sourceName": "youtube",
                    "isSeekable": true,
                    "isStream": false,
                    "isrc": null
                },
                "pluginInfo": {},
                "requester": {
                    "id": "498094279793704991",
                    "username": "chrissy8283",
                    "globalName": "Chrissy",
                    "avatar": "164c06b4e7ac2cdfffb941481e6511ca",
                    "displayAvatarURL": "https://cdn.discordapp.com/avatars/498094279793704991/164c06b4e7ac2cdfffb941481e6511ca.webp"
                }
            }
        ]
    } as StoredQueue
}