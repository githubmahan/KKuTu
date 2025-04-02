cd ./Server
node setup
cd ./lib
npm install discord.js@11
npm install pg@6.1.2
npm install ws@3.3.1
npm install cors
echo npm start > ../run.bat
grunt default pack