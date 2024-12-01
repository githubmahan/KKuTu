cd ./Server
node setup
cd ./lib
npm install discord.js@11
npm install pg@8.0.3
npm install ws@3.3.1
echo npm start > ../run.bat
grunt default pack