# lavalink-client
Easy and advanced lavalink client. Use it with lavalink plugins as well as latest lavalink versions


### What is Lavalink?
- Lavalink is an open-source Discord Queue Manager and Audioplayer, as well as scraper.

*Coming soon*



## How to self Host Lavalink

<details>
<summary>
👉 Click here to see how to self host a Lavalink instance
</summary>

### Requirements - JAVA
- [v18](https://github.com/Tomato6966/Debian-Cheat-Sheat-Setup/wiki/3.5.7-java-18) - for Lavalink@latest (v3.5+ or rc*)
- [v13](https://github.com/Tomato6966/Debian-Cheat-Sheat-Setup/wiki/3.5.3-java-13) - for Lavalink v3.3-v3.4
- [v11](https://github.com/Tomato6966/Debian-Cheat-Sheat-Setup/wiki/3.5.2-java-11) - for all older Versions

### Installation
- First download the [Lavalink executeable File v3.6.2](https://github.com/freyacodes/Lavalink/releases/download/3.6.2/Lavalink.jar): [from the releases page](https://github.com/freyacodes/Lavalink/releases)
```
wget https://github.com/freyacodes/Lavalink/releases/download/3.6.2/Lavalink.jar
```
- Then download my [example **configuration File** application.yml](https://raw.githubusercontent.com/Tomato6966/Debian-Cheat-Sheet-Setup/main/application.yml) | [Example application.yml from official repo - LINK](https://github.com/freyacodes/Lavalink/blob/master/LavalinkServer/application.yml.example)
```
wget https://raw.githubusercontent.com/Tomato6966/Debian-Cheat-Sheet-Setup/main/application.yml
```
*Make sure the file-name is equal to: `application.yml` and is in the same Directory as the `Lavalink.jar` file*

**NOTE:** If you don't wanna use the spotify plugin, or any other sources Plugin, then remove it from MY EXAMPLE application.yml 
> other wise you'd get errors. as far this is just a note-cheatsheet FOR ME

# Plugins Example
- In the server config Level of the applicatino.yml for `plugins` you can find all plugins and their versions which will be downloaded

# Edit Application.yml
make sure to edit:
- **port** to access Lavalink from a different Port
- **password** so that you have a password
- **spotify** -> **clientId** & **clientSecret** [get them from here](https://developer.spotify.com/dashboard/applications)
- **deezer** -> **masterEncryptionKey** [find it out yourself, how to get it](https://github.com/yne/dzr/issues/11)
- All other values to fit your needs

# Start Lavalink

in the folder of `Lavalink.jar` and `application.yml` execute the following
```bash
java -jar Lavalink.jar
```

# How to start it 24/7 - 2 Methods

- pm2:

```bash
npm i -g pm2; # add pm2 to the system
pm2 start --name Lavalink --max-memory-restart 4G java -- -jar Lavalink.jar
```

- screen:
```bash
apt-get install screen
screen -t Lavalink -s Lavalink
java -jar Lavalink # in the screen window:

# strg + alt + a + d -> to exit
# screen -ls to view all screens
# screen -r <ID> to re-enter a screen
```

# How to connect to it?

you need the following information:
- host: `localhost` | `127.0.0.1` | `IPV4 Address` (only works if firewall allows it)
- port: `2333` | `defined_port`
- password: `youshallnotpass` | `defined_port`


# Recommendation

Start using ipv6 routating, to prevent an ip ban from youtube!
check [here](https://github.com/freyacodes/Lavalink/issues/369) for more infos and for how to use tunnelbroker to get an ipv6 address-block, if you don't have one

## How to do ip routing notes:

First enable allowments for ipv6

```
# Enable now
sysctl -w net.ipv6.ip_nonlocal_bind=1
# Persist for next boot
echo 'net.ipv6.ip_nonlocal_bind = 1' >> /etc/sysctl.conf
```

replace `1234:1234:1234::/64` with your BLOCK (e.g. `2a01:12ab:12::/64`), if it's a /48 then it's `1234:1234:1234::/48` ofc.

```
ip -6 route replace local 1234:1234:1234::/64 dev lo
```
Don't know how to route it with netplan / interfaces? Ask your provider or do:
```
ip add add local 1234:1234:1234::/64 dev lo
```

Test the config

```
# Test that IPv6 works in the first place
ping6 google.com

# If you have the IPv6 block 1234:1234:1234::/48
# You should be able to use any of the IPs within that block
ping6 -I 1234:1234:1234:: -c 2 google.com
ping6 -I 1234:1234:1234::1 -c 2 google.com
ping6 -I 1234:1234:1234::2 -c 2 google.com
ping6 -I 1234:1234:1234:dead:beef:1234:1234 -c 2 google.com
```

**IF you get could not assign requested address, then it's not routed to your system..**

**IF YOU GET 100% PACKET LOSS THEN EVERYTHING IS OKAY DO THE FOLLOWING:**
```
# Install routing proxy
sudo apt-get -y install ndppd
# Create / edit it's config file
nano /etc/ndppd.conf
# Next paste the following: again replace the block with your block

route-ttl 30000 

proxy enp1s0 { # your interface name
   router no # If it should send router bit | default: yes
   timeout 500 # How long (in ms) it waits to assign a request address (lower == faster but more unstable) | default: 500
   ttl 30000 # How long (in ms) it caches an Ip Address (for lavalink you can def. set this one to 3600000 | default: 30000
   rule 1234:1234:1234::/64{
       static # to respond immediatelly
   }
}
```

Before saving replace `enp1s0` with your interface block name

It's findable with: ip addr
there are multiple, just find the name of the one where your ipv6 Block is in!

**NOW START ndppd**

```
ndppd -d -c /etc/ndppd.conf
# Restart: systemctl restart ndppd
# Stop: systemctl stop ndppd
# Status : systemctl status ndppd
# Start: systemctl start ndppd
```

If apt-install fails do this:
```
wget http://data.vshell.net/files/ndppd-0.2.5.tar.gz
tar -zxvf ndppd-0.2.5.tar.gz
cd ndppd-0.2.5
make
make install
```


How does my /etc/ndppd.conf look like?
```
route-ttl 3600000 
proxy enp1s0 {
   router yes
   timeout 50
   ttl 3600000 
   rule 2423:2220:123:1234::/64{
       static
   }
}
```
  
</details>

## Public Lavalink Services:
  
https://lavalink.milrato.com


## Credits

[erela.js by @menudocs](https://github.com/MenuDocs/erela.js/) - Tomato originally extended this one, but now this repository is based upon it!
-> [tomato's erela.js fork (updated to current lavalink too)](https://github.com/Tomato6966/erela.js/) 
-> [What is different from erela.js] //Link the wiki