# collectionsPidatabase
A node JS server hosting a JSON format database, and a html5 app to interact with it.
All files should be on a server.
The client_side_app.html will be served to the client but can also be used directly on the client without connection with the server, except for that the database cannot be loaded from the server and new data cannot be submitted to or updated in the database.

We use this server on a Raspberry Pi Zero W, to be served on a local network. The security is thus in who has the password to the network.

The following is a guide to set up the Pi server:

Install raspbian lite on a microSD card
When creating the iso create a file named ssh on the boot partition to enable ssh from start.

Connect a screen and keyboard to the pi, start it and open a console and run:

sudo raspi-config
    expand filesystem to fill sd card
    set the network to connect to a local network

Then find the ip for the pi and ssh to it

First
sudo apt-get update
sudo apt-get upgrade

For node JS server, before making local network
Download and install node.js (note that the version of node.js depend of what pi you use this is for Pi Zero W)

curl -o node-v8.11.1-linux-armv6l.tar.gz https://nodejs.org/dist/v8.11.1/node-v8.11.1-linux-armv6l.tar.gz
tar -xzf node-v8.11.1-linux-armv6l.tar.gz
sudo cp -r node-v8.11.1-linux-armv6l/* /usr/local/
node -v
npm -v
sudo apt-get install git

Restart
sudo shutdown -r now

npm install pm2@latest -g

scp all files to a suitable folder on the server (e.g. web)

The server is created in node.js using NGtrippServer.js
pm2 will run the server as a service that will start automatically when the Pi starts
The server script is in NGtrippServer.js

pm2 start NGtrippServer.js

pm2 startup
run given command with needed changes (folder pm -> pm2)

The settings.json file include database settings. If you want any particular name on your collection you can set it here.
The other javascripts (.js) are for database maintenance (creating database based on settings, or deleting documents from database)

To set up local network check out check out https://www.raspberrypi.org/documentation/configuration/wireless/access-point.md
Do this last as you may not have any internet connection afterwards, depending on your setup

The setup was tested on a National Geographic funded expedition (CP-126R-12) going through five countries in West Africa from June 19-July 14, 2018.
