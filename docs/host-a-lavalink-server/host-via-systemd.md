# Host via systemd

First create this file in <mark style="color:red;">`/usr/lib/systemd/system`</mark>\
_(replacing the values inside the `<>` brackets):_

{% code title="lavalink.service" %}
```editorconfig
[Unit]
# Describe the service
Description=Lavalink Service

# Configure service order
After=syslog.target network.target

[Service]
# The user which will run Lavalink
User=<usr>

# The group which will run Lavalink
Group=<usr>

# Where the program should start
WorkingDirectory=</home/usr/lavalink>

# The command to start Lavalink
ExecStart=java -Xmx4G -jar </home/usr/lavalink>/Lavalink.jar

# Restart the service if it crashes
Restart=on-failure

# Delay each restart by 5s
RestartSec=5s

[Install]
# Start this service as part of normal system start-up
WantedBy=multi-user.target
```
{% endcode %}

### Init the service

```
sudo systemctl daemon-reload
sudo systemctl enable lavalink
sudo systemctl start lavalink
```

### View the logs

```
sudo journalctl -u lavalink
```
