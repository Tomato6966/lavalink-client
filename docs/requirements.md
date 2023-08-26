---
description: What requirements your Bot needs, in order to work!
---

# Requirements

1. You need a working <mark style="color:red;">Lavalink Server (v4)</mark>&#x20;
   * The Lavalink Server must be accessable:
     * [ ] _Make sure the <mark style="color:red;">Firewall allows</mark> you to <mark style="color:red;">**connect**</mark>_
     * [ ] Make sure the Lavalink version is <mark style="color:red;">at least</mark> <mark style="color:red;"></mark><mark style="color:red;">**beta v4**</mark> <mark style="color:red;"></mark><mark style="color:red;">or higher</mark>
   * <mark style="color:orange;">**Guides:**</mark>
     * [Official Lavalink Getting Started Docs](https://lavalink.dev/getting-started/)
     * [My Lavalink Tutorial](host-a-lavalink-server/)
2. Your Discord Bot needs the following Intents:
   * [ ] [Guilds](https://discord-api-types.dev/api/discord-api-types-v10/enum/GatewayIntentBits#Guilds): `1 << 0 (1)`
   * [ ] [GuildVoiceStates](https://discord-api-types.dev/api/discord-api-types-v10/enum/GatewayIntentBits#GuildVoiceStates): `1 << 7 (128)`
3. On the Manager (Client):
   * [ ] Provide the right node-options in the Manager (required)
     * [ ] Provide the right <mark style="color:red;">**`authorization`**</mark> _(aka password)_
     * [ ] Provide the right <mark style="color:red;">**`port`**</mark>&#x20;
     * [ ] Provide the right <mark style="color:red;">**`host`**</mark> _(ip / domain-name)_
   * [ ] _Make sure to initalize the manager (either on bot-ready event / right on boot)_
     * <mark style="color:red;">**`lavalinkManager.init(client.user);`**</mark>
   * [ ] Make sure to listen to Bot-Ready events (JSON data)
     * <mark style="color:red;">**`bot.on("raw", payload => lavalinkManager.sendRawData(payload));`**</mark>

All of those are the minimum requirements, to get started using lavalink-client, and roughly cover any other lavalink clients for any language(s)

