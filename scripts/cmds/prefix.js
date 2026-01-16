const fs = require("fs-extra");
const path = require("path");
const moment = require("moment-timezone");

module.exports = {
  config: {
    name: "prefix",
    version: "1.3.0",
    author: "Rx edit by tamim bbz",
    countDown: 5,
    role: 0,
    shortDescription: "Show bot prefix info without using any prefix",
    longDescription: "Show bot prefix info without using any prefix",
    category: "system",
    guide: {
      en: ""
    }
  },

  onChat: async function ({ api, event, threadsData }) {
    const { threadID, messageID, body } = event;
    if (!body) return;

    if (body.toLowerCase().trim() === "prefix") {
      const ping = Date.now() - event.timestamp;
      const day = moment.tz("Asia/Dhaka").format("dddd");

      // Goatbot-এ প্রিফিক্স ডাটাবেস থেকে নেওয়ার নিয়ম
      const threadSettings = await threadsData.getFile(threadID) || {};
      const prefix = threadSettings.prefix || global.GoatBot.config.prefix;
      const botName = global.GoatBot.config.userName || "𝗦𝗵𝗮𝘆𝗺𝗮 𝗯𝗮𝗯𝘆";

      const frames = [
        `🌟╔═༶• 𝗣𝗥𝗘𝗙𝗜𝗫 𝗜𝗡𝗙𝗢 •༶═╗🌟\n🕒 𝗣𝗶𝗻𝗴      : ${ping}ms\n📅 𝗗𝗮𝘆       : ${day}\n🤖 𝗕𝗼𝘁 𝗡𝗮𝗺𝗲  : ${botName}\n💠 𝗕𝗼𝘁 𝗣𝗿𝗲𝗳𝗶𝘅  : ${global.GoatBot.config.prefix}\n💬 𝗚𝗿𝗼𝘂𝗽 𝗣𝗿𝗲𝗳𝗶𝘅: ${prefix}\n🌟╚═༶• 𝗘𝗻𝗱 𝗢𝗳 𝗦𝘁𝗮𝘁𝘂𝘀 •༶═╝🌟`,
        `╭━━•✧𝗣𝗥𝗘𝗙𝗜𝗫 𝗦𝗧𝗔𝗧𝗨𝗦✧•━━╮\n│ ⏱  𝗣𝘂𝗻𝗴      : ${ping}ms\n│ 📆 𝗗𝗮𝘆       : ${day}\n│ 🤖 𝗕𝗼𝘁        : ${botName}\n│ 🔹 𝗕𝗼𝘁 𝗽𝗿𝗲𝗳𝗶𝘅  : ${global.GoatBot.config.prefix}\n│ 🔹 𝗚𝗿𝗼𝘂𝗽 𝗽𝗿𝗲𝗳𝗶𝘅: ${prefix}\n╰━━━━━━━━━━━━━━━╯`,
        `┏━༺ 𝗣𝗥𝗘𝗙𝗜𝗫 𝗜𝗡𝗙𝗢 ༻━┓\n┃ 🕒 𝗣𝗶𝗻𝗴      : ${ping}ms\n┃ 📅 𝗗𝗮𝘆       : ${day}\n┃ 🤖 𝗕𝗼𝘁 𝗡𝗮𝗺𝗲  : ${botName}\n┃ 💠 𝗕𝗼𝘁 𝗣𝗿𝗲𝗳𝗶𝘅  : ${global.GoatBot.config.prefix}\n┃ 💬 𝗚𝗿𝗼𝘂𝗽 𝗣𝗿𝗲𝗳𝗶𝘅: ${prefix}\n┗━━━━━━━━━━━━━━━━━┛`
      ];

      // GIF সিলেকশন
      const gifList = ["abdullah2.gif", "abdullah1.gif", "abdullah3.gif"];
      const randomGif = gifList[Math.floor(Math.random() * gifList.length)];
      
      // ফাইল পাথ (নিশ্চিত করো যে কমান্ড ফোল্ডারের ভেতর 'noprefix' ফোল্ডারটি আছে)
      const gifPath = path.join(__dirname, "noprefix", randomGif);
      const chosenFrame = frames[Math.floor(Math.random() * frames.length)];

      const form = {
        body: chosenFrame
      };

      if (fs.existsSync(gifPath)) {
        form.attachment = fs.createReadStream(gifPath);
      }

      return api.sendMessage(form, threadID, messageID);
    }
  },

  onStart: async function ({}) {
    // এটি খালি থাকবে কারণ আমরা onChat ব্যবহার করছি
  }
};
