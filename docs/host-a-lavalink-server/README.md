# Host a Lavalink-Server

There is an official [Getting-started](https://lavalink.dev/getting-started/index.html) Guide from [Lavalink](https://lavalink.dev/), I recommend checking it out!

1. Install <mark style="color:red;">Java 17</mark> or higher. You can download it [here](https://www.azul.com/downloads/?package=jdk#zulu).&#x20;
   1. _I recommend Java 20 or higher_
2. Download the latest <mark style="color:red;">`Lavalink.jar`</mark> from [GitHub-Releases-Page](https://github.com/lavalink-devs/Lavalink/releases/latest). or directly via this [latest-download-link](https://github.com/lavalink-devs/Lavalink/releases/latest/download/Lavalink.jar)
3. Now configure the Lavalink-Server via an `application.yml` file or env-variables. \
   _For that check out the_ [_configuration_](https://lavalink.dev/configuration/index.html) _page to learn out how._
   1. [_My configuration guide_](application.yml-configuration/)
4. Run Lavalink with `java -jar Lavalink.jar.`
   * To perma-host lavalink you can use multiple ways:
     1. [pm2 ](host-via-pm2.md)(node process manager package)
     2. [systemd ](host-via-systemd.md)(linux distro background process manager)
     3. [screen ](host-via-screen.md)(old)
5. Now test if you can use the lavalink server:

```bash
curl -H "Authorization: yourverystrongpassword" http://localhost:2333/v4/info | json_pp
```

<mark style="color:red;">`http://localhost:2333`</mark> is the url-domain of the lavalink server, aka on the same machine where it's hosted that's why <mark style="color:red;">`localhost`</mark>, and <mark style="color:red;">`2333`</mark> is the <mark style="color:red;">`port`</mark>. if you have a remote ip, you can use the ip / domain.

<mark style="color:red;">`/v4/info`</mark> is the request path, and <mark style="color:red;">`-H "Authorization: yourverystrongpassword"`</mark> is the Authorization header, aka <mark style="color:red;">`password`</mark> configured in lavalink server.\
That request-path returns all information of the lavalink-server which is same as <mark style="color:red;">**`player.node.info`**</mark>

<mark style="color:red;">`| json_pp`</mark> is a default linux package, to pretty-print the output (json) \[optional]

### Max Memory Limit

when you provide `-Xmx4G` for example, you tell java to allocate 4gigs of memory to that java-process, aka lavalink can't use more

### Spotify, Deezer, Apple-Music, etc. etc.

There are Lavalink-Server Plugins, check out [my example](application.yml-configuration/with-spotify-deezer-apple-music-etc..md)
