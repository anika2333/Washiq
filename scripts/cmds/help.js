const fs = require("fs-extra");
const axios = require("axios");
const path = require("path");
const { getPrefix } = global.utils;
const { commands, aliases } = global.GoatBot;

module.exports = {
  config: {
    name: "help",
    version: "1.23",
    author: "WASHIK",
    countDown: 5,
    role: 0,
    shortDescription: { en: "View command usage and list all commands directly" },
    longDescription: { en: "View command usage and list all commands directly" },
    category: "info",
    guide: { en: "{pn} [page] / help <cmdName>" },
    priority: 1,
  },

  onStart: async function ({ message, args, event, threadsData, role }) {
    const { threadID } = event;
    const threadData = await threadsData.get(threadID);
    const globalPrefix = global.GoatBot.config.prefix;
    const boxPrefix = threadData.data?.prefix || globalPrefix;
    
    // ফেন্সি ফন্ট কনভার্টার ফাংশন
    const fancyFont = (text) => {
      const fonts = {
        a: "𝐚", b: "𝐛", c: "𝐜", d: "𝐝", e: "𝐞", f: "𝐟", g: "𝐠", h: "𝐡", i: "𝐢", j: "𝐣", k: "𝐤", l: "𝐥", m: "𝐦",
        n: "𝐧", o: "𝐨", p: "𝐩", q: "𝐪", r: "𝐫", s: "𝐬", t: "𝐭", u: "𝐮", v: "𝐯", w: "𝐰", x: "𝐱", y: "𝐲", z: "𝐳",
        A: "𝐀", B: "𝐁", C: "𝐂", D: "𝐃", E: "𝐄", F: "𝐅", G: "𝐆", H: "𝐇", I: "𝐈", J: "𝐉", K: "𝐊", L: "𝐋", M: "𝐌",
        N: "𝐍", O: "𝐎", P: "𝐏", Q: "𝐐", R: "𝐑", S: "𝐒", T: "𝐓", U: "𝐔", V: "𝐕", W: "𝐖", X: "𝐗", Y: "𝐘", Z: "𝐙",
        "0": "𝟎", "1": "𝟏", "2": "𝟐", "3": "𝟑", "4": "𝟒", "5": "𝟓", "6": "𝟔", "7": "𝟕", "8": "𝟖", "9": "𝟗"
      };
      return text.split("").map(char => fonts[char] || char).join("");
    };

    // কমান্ড ক্যাটাগরাইজেশন
    const getCommandCategories = () => {
      const categories = {};
      
      for (const [name, value] of commands) {
        if (value.config.role > 1 && role < value.config.role) continue;
        const category = value.config.category || "Uncategorized";
        
        // Special case for hinata command
        if (name === "hinata") {
          categories["chat"] = categories["chat"] || { commands: [] };
          categories["chat"].commands.push(name);
        } else {
          categories[category] = categories[category] || { commands: [] };
          categories[category].commands.push(name);
        }
      }
      
      return categories;
    };

    // কমান্ড লিস্ট তৈরি (পেজ অনুসারে)
    const generateCommandList = (page = 1, categories) => {
      const totalCommands = commands.size;
      const categoryKeys = Object.keys(categories).sort();
      const commandsPerPage = 40; // প্রতি পেজে মোট কমান্ড
      
      let msg = "୨୧ ─·· 🍰 𝐂𝐨𝐦𝐦𝐚𝐧𝐝 𝐌𝐞𝐧𝐮 🍰 ··─ ୨୧\n\n";
      msg += `🍓 𝐂𝐨𝐦𝐦𝐚𝐧𝐝𝐬: ${totalCommands}\n`;
      msg += `🌐 𝐒𝐲𝐬𝐭𝐞𝐦 𝐩𝐫𝐞𝐟𝐢𝐱: ${globalPrefix}\n`;
      msg += `🛸 𝐘𝐨𝐮𝐫 𝐛𝐨𝐱 𝐜𝐡𝐚𝐭 𝐩𝐫𝐞𝐟𝐢𝐱: ${boxPrefix}\n`;
      
      // পেজ ক্যালকুলেশন
      const totalCategories = categoryKeys.length;
      const categoriesPerPage = Math.min(10, Math.ceil(commandsPerPage / 4)); // প্রতি পেজে ক্যাটাগরি
      const totalPages = Math.ceil(totalCategories / categoriesPerPage);
      
      // বর্তমান পেজের জন্য সঠিক পেজ নম্বর
      const currentPage = Math.max(1, Math.min(page, totalPages));
      const startIndex = (currentPage - 1) * categoriesPerPage;
      const endIndex = startIndex + categoriesPerPage;
      const currentCategories = categoryKeys.slice(startIndex, endIndex);
      
      msg += `📖 𝐏𝐚𝐠𝐞: ${currentPage} / ${totalPages}\n\n`;
      
      // বর্তমান পেজের ক্যাটাগরিগুলো দেখানো
      for (const category of currentCategories) {
        msg += `╭・─「 🌸 ${fancyFont(category.toUpperCase())} 🌸 」\n`;
        const names = categories[category].commands.sort();
        const fancyNames = names.map(name => fancyFont(name));
        
        // Show commands in groups of 3 for better formatting
        for (let i = 0; i < fancyNames.length; i += 3) {
          const group = fancyNames.slice(i, i + 3);
          msg += `│  🎀 ${group.join(" ✧ ")}\n`;
        }
        msg += `╰・─── ⬦ 🍓 ⬦ ───・\n\n`;
      }
      
      // AI Chatbot section (only on first page)
      if (currentPage === 1) {
        msg += `╭─⋅──⋅୨♡୧⋅──⋅─\n`;
        msg += `│ 🤖 𝐀𝐈 𝐂𝐡𝐚𝐭𝐛𝐨𝐭: 𝐇𝐢𝐧𝐚𝐭𝐚\n`;
        msg += `│ 💬 𝐓𝐫𝐢𝐠𝐠𝐞𝐫𝐬: baby, bby, jan, bot, megh, lamia\n`;
        msg += `│ 🌐 𝐅𝐞𝐚𝐭𝐮𝐫𝐞𝐬: chat, teach, list, edit, remove\n`;
        msg += `│ 📚 𝐔𝐬𝐚𝐠𝐞: ${boxPrefix}hinata [message]\n`;
        msg += `╰─⋅──⋅୨♡୧⋅──⋅─\n\n`;
      }
      
      // Navigation and footer
      msg += `╭─⋅──⋅୨♡୧⋅──⋅─\n`;
      
      if (totalPages > 1) {
        if (currentPage > 1) {
          msg += `│ ⏪ 𝐔𝐬𝐞: ${boxPrefix}help ${currentPage - 1}\n`;
        }
        if (currentPage < totalPages) {
          msg += `│ ⏩ 𝐔𝐬𝐞: ${boxPrefix}help ${currentPage + 1}\n`;
        }
      }
      
      msg += `│ 🔍 𝐔𝐬𝐞: ${boxPrefix}help <cmd> for details\n`;
      msg += `│ 📝 ${boxPrefix}addowner ➯ Add Bot Owner\n`;
      msg += `│ 🤝 ${boxPrefix}supportgc ➯ Join Support GC\n`;
      msg += `│ 👑 𝐂𝐫𝐞𝐚𝐭𝐨𝐫: 𝐖𝐀𝐒𝐇𝐈𝐊 ッ\n`;
      msg += `╰─⋅──⋅୨♡୧⋅──⋅─\n`;
      msg += `‧₊˚ ☁️⋅♡𓂃 ࣪ ִֶָ☾. 𝐏𝐚𝐠𝐞 ${currentPage}/${totalPages} ‧₊˚ ☁️⋅♡𓂃 ࣪ ִֶָ☾.`;
      
      return { message: msg, totalPages, currentPage };
    };

    // যদি পেজ নাম্বার দেওয়া হয়
    if (args.length > 0 && !isNaN(args[0])) {
      const pageNum = parseInt(args[0]);
      const categories = getCommandCategories();
      const result = generateCommandList(pageNum, categories);
      
      if (pageNum < 1 || pageNum > result.totalPages) {
        return message.reply(`❌ 𝐈𝐧𝐯𝐚𝐥𝐢𝐝 𝐩𝐚𝐠𝐞 𝐧𝐮𝐦𝐛𝐞𝐫! 𝐀𝐯𝐚𝐢𝐥𝐚𝐛𝐥𝐞: 1-${result.totalPages}`);
      }
      
      const helpListImages = ["https://files.catbox.moe/5kb6w8.jpg"];
      const helpListImage = helpListImages[Math.floor(Math.random() * helpListImages.length)];
      
      await message.reply({
        body: result.message,
        attachment: await global.utils.getStreamFromURL(helpListImage)
      });
    }
    // যদি কমান্ড নাম দেওয়া হয়
    else if (args.length > 0 && isNaN(args[0])) {
      const commandName = args[0].toLowerCase();
      const command = commands.get(commandName) || commands.get(aliases.get(commandName));

      if (!command) {
        await message.reply(`❌ 𝐂𝐨𝐦𝐦𝐚𝐧𝐝 "${commandName}" 𝐧𝐨𝐭 𝐟𝐨𝐮𝐧𝐝.`);
      } else {
        const configCommand = command.config;
        const roleText = roleTextToString(configCommand.role);
        const author = configCommand.author || "Unknown";
        const longDescription = configCommand.longDescription ? configCommand.longDescription.en || "No description" : "No description";
        const guideBody = configCommand.guide?.en || "No guide available.";
        const usage = guideBody.replace(/{pn}/g, boxPrefix + configCommand.name)
                              .replace(/{p}/g, boxPrefix)
                              .replace(/{n}/g, configCommand.name);

        // Special formatting for hinata command
        if (commandName === "hinata") {
          const response = `
╭────⊙『 **${fancyFont(configCommand.name.toUpperCase())}** 』
│ 📝 𝐃𝐞𝐬𝐜𝐫𝐢𝐩𝐭𝐢𝐨𝐧: ${longDescription}
│ 👑 𝐀𝐮𝐭𝐡𝐨𝐫: ${author}
│ ⚙️ 𝐆𝐮𝐢𝐝𝐞: ${usage}
│ 🔯 𝐕𝐞𝐫𝐬𝐢𝐨𝐧: ${configCommand.version || "1.0"}
│ ♻️ 𝐑𝐨𝐥𝐞: ${roleText}
│ 
│ 𝐓𝐫𝐢𝐠𝐠𝐞𝐫𝐬:
│ • 𝐄𝐧𝐠𝐥𝐢𝐬𝐡: baby, bot, bby, jan, xan, megh, lamia
│ • 𝐁𝐚𝐧𝐠𝐥𝐚: জান, বট, বেবি, মেঘ, লামিয়া
│ 
│ 𝐅𝐞𝐚𝐭𝐮𝐫𝐞𝐬:
│ • 𝐂𝐡𝐚𝐭: ${boxPrefix}hinata [message]
│ • 𝐓𝐞𝐚𝐜𝐡: ${boxPrefix}hinata teach [question] - [response]
│ • 𝐋𝐢𝐬𝐭: ${boxPrefix}hinata list / ${boxPrefix}hinata list all
│ • 𝐄𝐝𝐢𝐭: ${boxPrefix}hinata edit [question] - [newResponse]
│ • 𝐑𝐞𝐦𝐨𝐯𝐞: ${boxPrefix}hinata remove [question] - [index]
│ • 𝐌𝐬𝐠: ${boxPrefix}hinata msg [question]
╰────────────⊙`;

          await message.reply(response);
        } else {
          const response = `
╭────⊙『 **${fancyFont(configCommand.name.toUpperCase())}** 』
│ 📝 𝐃𝐞𝐬𝐜𝐫𝐢𝐩𝐭𝐢𝐨𝐧: ${longDescription}
│ 👑 𝐀𝐮𝐭𝐡𝐨𝐫: ${author}
│ ⚙️ 𝐆𝐮𝐢𝐝𝐞: ${usage}
│ 🔯 𝐕𝐞𝐫𝐬𝐢𝐨𝐧: ${configCommand.version || "1.0"}
│ ♻️ 𝐑𝐨𝐥𝐞: ${roleText}
╰────────────⊙`;

          await message.reply(response);
        }
      }
    }
    // যদি শুধু help টাইপ করা হয় (প্রথম পেজ)
    else {
      const categories = getCommandCategories();
      const result = generateCommandList(1, categories);
      
      const helpListImages = ["https://files.catbox.moe/5kb6w8.jpg"];
      const helpListImage = helpListImages[Math.floor(Math.random() * helpListImages.length)];
      
      await message.reply({
        body: result.message,
        attachment: await global.utils.getStreamFromURL(helpListImage)
      });
    }
  },
};

function roleTextToString(roleText) {
  switch (roleText) {
    case 0: return "𝟎 (𝐀𝐥𝐥 𝐮𝐬𝐞𝐫𝐬)";
    case 1: return "𝟏 (𝐆𝐫𝐨𝐮𝐩 𝐚𝐝𝐦𝐢𝐧𝐢𝐬𝐭𝐫𝐚𝐭𝐨𝐫𝐬)";
    case 2: return "𝟐 (𝐀𝐝𝐦𝐢𝐧 𝐛𝐨𝐭)";
    default: return "𝐔𝐧𝐤𝐧𝐨𝐰𝐧 𝐫𝐨𝐥𝐞";
  }
			}
