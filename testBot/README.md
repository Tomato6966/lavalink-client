# Lavalink-Client - __TestBot__

This is an example test Bot utilizing 100% of lavalink-client repository.

## Getting Started

1. Install packages:

```
npm i
```

2. Fill out env vars in the `example.env` and rename it to `.env`
  - For that you need a lavalink server on localhost (1. Install java, 2. download [Lavalink-v4](https://github.com/lavalink-devs/Lavalink/releases), 3. put `application.yml` into it's root-dir, 4. fill it out, 5. start it with `java -jar Lavalink.jar`)
  - For that Example Bot with REDIS Queue, you need to have a running Redis Server (with password if remotely), but you can test it without Redis by __commenting out__ the LavalinkManager Option: `queueStore`
  - Discord Token is required (obviously)

3. Run bot via:

```
npm run start
```