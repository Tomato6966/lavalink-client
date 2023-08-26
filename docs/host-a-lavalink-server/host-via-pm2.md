# Host via pm2

1. Install [pm2](https://pm2.keymetrics.io)
   * **`npm install -g pm2`** / `yarn add --global pm2`
2. Go into the <mark style="color:red;">root directory</mark> of `Lavalink.jar,` and execute the following

<pre class="language-bash"><code class="lang-bash"><strong>pm2 start --name "Lavalink Server" --max-memory-restart 4G java -- -jar Lavalink.jar
</strong></code></pre>

now on <mark style="color:red;">`pm2 list`</mark> you can see the server (as well it's process ID)

with <mark style="color:red;">`pm2 stop <ID>`</mark> you can stop it

with <mark style="color:red;">`pm2 start <ID>`</mark> you can start it

on `4 Gigabyte` of memory usage, lavalink automatically <mark style="color:red;">stops and restart</mark> itsself

with <mark style="color:red;">`pm2 delete <ID>`</mark> you can stop + delete the lavalink server process (not the directory)

## What about the logs?

Pm2 has packages, to auto-rotate and auto-flush the logs to save storage!\


```bash
pm2 flush # to flush all current logs
pm2 install pm2-logrotate # pm2 install a plugin
pm2 set pm2-logrotate:max_size 10M # config it for 10mb of logs
pm2 set pm2-logrotate:compress true # compress the logs
pm2 set pm2-logrotate:rotateInterval '0 */1 * * *' # rotate logs every hr (cron-job)
```

### [General Pm2 Usage Tutorial](https://github.com/Tomato6966/Debian-Cheat-Sheet-Setup/wiki/4-pm2-tutorial)

I made that Pm2 + [Linux ](https://github.com/Tomato6966/Debian-Cheat-Sheet-Setup/wiki/)Tutorial Cheatsheet, if you ever need it!
