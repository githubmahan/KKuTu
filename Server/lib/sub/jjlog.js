/**
 * Rule the words! KKuTu Online
 * Copyright (C) 2017 JJoriping(op@jjo.kr)
 * 
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 */

// 모듈 호출

var colors = require('colors');
var GLOBAL = require('./global.json')

if (GLOBAL.CHATLOG_OPTIONS.CHATLOG_USE) {
    var Discord = require('discord.js')
    var pg = require('pg');
    var discordClient = new Discord.Client();

    async function getNickname(id) {
        var pgClient = new pg.Client({
            user: GLOBAL.PG_OPTIONS.USER,
            host: GLOBAL.PG_OPTIONS.HOST,
            database: GLOBAL.PG_OPTIONS.DATABASE,
            password: GLOBAL.PG_OPTIONS.PASSWORD,
            port: GLOBAL.PG_OPTIONS.PORT,
        });
        
        await pgClient.connect();

        const res = await pgClient.query(
            'SELECT nickname FROM users WHERE _id = $1',
            [id]
        );

        if (res.rows.length > 0 && res.rows[0].nickname) {
            var nickname = res.rows[0].nickname + ` (${id})`
        } else {
            var nickname = id
        }

        await pgClient.end();
        return nickname;
    }
}

function callLog(text){
	var date = new Date();
	var o = {
		year: 1900 + date.getYear(),
		month: date.getMonth() + 1,
		date: date.getDate(),
		hour: date.getHours(),
		minute: date.getMinutes(),
		second: date.getSeconds()
	}, i;
	
	for(var i in o){
		if(o[i] < 10) o[i] = "0"+o[i];
		else o[i] = o[i].toString();
	}
	
    if (GLOBAL.CHATLOG_OPTIONS.CHATLOG_USE) {
        var jsonMatch = text.match(/{.*}$/);
        
        if (jsonMatch && jsonMatch[0]) {
            var jsonData = JSON.parse(jsonMatch[0]);
        
            if (jsonData.hasOwnProperty("type")) {
                if (jsonData.type === "talk" || jsonData.type === "chat") {
                    if (jsonData.relay === false || jsonData.relay === null || jsonData.relay === undefined) {
                        var idMatch = text.match(/#([a-zA-Z0-9_-]+):/);
                        if (idMatch) {
                            var mainorroom = text.match(/@(\d+)/);
                            if (mainorroom[1] === "0") {
                                var channel = discordClient.channels.get("1307187359628005437")
                                getNickname(idMatch[1]).then(idData => {channel.send("[" + o.year + "-" + o.month + "-" + o.date + " " + o.hour + ":" + o.minute + ":" + o.second + "] " + idData + " : " + jsonData.value)})
                            } else if (mainorroom[1] === "1") {
                                var channel = discordClient.channels.get("1307245355468853270")
                                getNickname(idMatch[1]).then(idData => {channel.send("[" + o.year + "-" + o.month + "-" + o.date + " " + o.hour + ":" + o.minute + ":" + o.second + "] " + idData + " : " + jsonData.value)})
                            }
                        }
                    }
                }
            }
        }
    }

	console.log("["+o.year+"-"+o.month+"-"+o.date+" "+o.hour+":"+o.minute+":"+o.second+"] "+text);
}

exports.log = function(text){
	callLog(text);
};
exports.info = function(text){
	callLog(text.cyan);
};
exports.success = function(text){
	callLog(text.green);
};
exports.alert = function(text){
	callLog(text.yellow);
};
exports.warn = function(text){
	callLog(text.black.bgYellow);
};
exports.error = function(text){
	callLog(text.bgRed);
};

if (GLOBAL.CHATLOG_OPTIONS.CHATLOG_USE) discordClient.login(GLOBAL.CHATLOG_OPTIONS.TOKEN)