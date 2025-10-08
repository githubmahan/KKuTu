cd ./Server
node setup
cd ./lib
npm install axios
npm install pg@6.1.2
npm install ws@3.3.1
npm install passport-roblox
npm install cors
echo npm start > ../run.bat
npm run build