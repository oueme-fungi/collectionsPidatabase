# collectionsPidatabase
A node JS server hosting a mongoDB database, and a html5 app to interact with it.
All files should be on a server. The client_side_app.html will be served to the client but can also be used directly on the client, except for that the database cannot be loaded from the server and new data cannot be submitted to or updated in the database.

We use this server on a raspberryPi zero W, to be served on a local network. The security is thus in who has the password to the network.

The following is a guide to set up the Pi server:

Install raspbian lite on a microSD card
When creating the iso create a file named ssh on the boot partition to enable ssh from start

conect a scren and keyboard to the pi, start it and open a console and run:

sudo raspi-config
    expand filesystem to fill sd card
    set the network to connect to a local network

Then find the ip for the pi and ssh to it

First
sudo apt-get update
sudo apt-get upgrade

For node JS server, before making local network
Download, compile and install node.js

curl -o node-v8.11.1-linux-armv6l.tar.gz https://nodejs.org/dist/v8.11.1/node-v8.11.1-linux-armv6l.tar.gz
tar -xzf node-v8.11.1-linux-armv6l.tar.gz
sudo cp -r node-v8.11.1-linux-armv6l/* /usr/local/
node -v
npm -v
sudo apt-get install git

sudo apt-get install mongodb

Restart
sudo shutdown -r now

npm install pm2@latest -g
npm install mongodb --save

scp NGtrippServer.js to a folder on the server

pm2 start NGtrippServer.js

pm2 startup
run given command with neede changes (folder pm -> pm2)

To set up local network check out check out https://www.raspberrypi.org/documentation/configuration/wireless/access-point.md
