---
description: >-
  Easy, flexible and feature-rich lavalink@v4 Client. Both for Beginners and
  Proficients.
coverY: 311
---

# 😁 Lavalink Client

## INFORMATION

The Client is still on development, but already very powerful, its made fully in typescript with a modern coding style, to have the best coding experience and intellisense possible, while supporting old coding styles like cjs.

This Documentation is far from finished, Once this "Information" is gone, the Documentation is finished.&#x20;

The estimated finished Time of the Library is End of August.

The estimated finished Time of the Documentation is somewhen in September.

If you want to know how things work, check out the [Example Discord Bot](basics/example-discord-bot.md), because there almost every feature is shown and used.

## Install

<details>

<summary>👉 via NPM</summary>

```bash
npm install --save lavalink-client
```

Dev Version: (Current)

```bash
npm install tomato6966/lavalink-client
```

</details>

<details>

<summary>👉 via YARN</summary>

```bash
yarn add lavalink-client
```

Dev Version: (Current)

```bash
yarn add tomato6966/lavalink-client
```

</details>

## Libraries Supported

* [Discord.js](https://discord.js.org/)
* [Eris](https://abal.moe/Eris/)
* [Discordeno](https://discordeno.js.org)

_...all Discord Client Libraries!_

## Features

* 💯 Lavalink v4 Supported only (with Lavalink Plugins)
* ✅ Player-Destroy Reasons like:
  * Channel got deleted, Player got disconnected...
* ✨ Choose able queue stores (maps, collections, redis, databases, ...)
  * You can create your own queueStore, thus make it easy to sync queues accross multiple connections (e.g. dashboard-bot)
  * Automated Queue Sync methods
  * Automated unresolveable Tracks (save the queries as Partial Track Objects -> Fetch the tracks only once they are gonna play)
* 😍 Included Filter & Equalizer Management
* 👍 Multiple Player Options _for easier use_
  * onDisconnect -> Player Destroy / auto Reconnect
  * onEmptyQueue -> Player Destroy / leave After x Time
  * instaFixFilter -> seek the player after applying a filter, to instantly apply it's effect (only works for little-durational-songs)
  * applyVolumeAsFilter -> instead of using lavalink.volume, it uses lavalink.filters.volume which is much different!
* 🛡️ Lavalink Validations
  * It only let's you use the filters / plugins / sources, if Lavalink actually has it enabled
* 🧑‍💻 Memory friendly and easy style
  * Only the required data is displayed, and the store-way & types match Lavalink#IMPLEMENTATION.md
* 😘 Automated Handlings
  * Skips the songs, on TrackEnd, TrackStuck, TrackError,
  * Destroys the player on channeldelete
  * Pauses / resumes the player if it get's muted / unmuted (server-wide) \[soon]
  * ...
* 😁 Much much more!

