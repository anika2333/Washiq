const axios = require("axios");

// আপনার পছন্দমতো ট্রিগার লিস্ট (Megh, Lamia, Washiq Boss এর জন্য)
const mahmud = [
  "baby", "bby", "babu", "bbu", "jan", "bot", "জান", "জানু", "বেবি",
  "lamia", "megh", "boss", "washiq"
];

const baseApiUrl = async () => {
  const base = await axios.get("https://raw.githubusercontent.com/mahmudx7/HINATA/main/baseApiUrl.json");
  return base.data.mahmud;
};

module.exports.config = {
   name: "megh",
   aliases: ["lamia", "baby", "bbu", "jan", "washiq"],
   version: "2.1",
   author: "MahMUD",
   role: 0,
   category: "chat",
   guide: {
     en: "{pn} [message] OR teach [question] - [response]"
   }
};

module.exports.onStart = async ({ api, event, args, usersData }) => {
  const obfuscatedAuthor = String.fromCharCode(77, 97, 104, 77, 85, 68);
  if (module.exports.config.author !== obfuscatedAuthor) return api.sendMessage("You are not authorized to change the author name.", event.threadID, event.messageID);
  
  const msg = args.join(" ").toLowerCase();
  const uid = event.senderID;

  if (!args[0]) {
    const startMsg = ["𝐁𝐨𝐥𝐨 𝐊𝐢 𝐁𝐨𝐥𝐛𝐞..😇", "𝐌𝐞𝐠𝐡 𝐇𝐞𝐫𝐞... 😺", "𝐊𝐢 𝐡𝐨𝐢𝐬𝐞? 𝐆𝐚𝐫𝐥𝐟𝐫𝐢𝐞𝐧𝐝 𝐤𝐚𝐭𝐚 𝐝𝐢𝐬𝐞 𝐧𝐚𝐤𝐢? 🤣💔"];
    return api.sendMessage(startMsg[Math.floor(Math.random() * startMsg.length)], event.threadID, event.messageID);
  }
  
  // teach, list, remove logic (পূর্বের মতো থাকবে)...
};

module.exports.onChat = async ({ api, event, usersData }) => {
  try {
    const message = event.body?.toLowerCase() || "";
    const attachments = event.attachments || [];

    if (mahmud.some(word => message.startsWith(word))) {
      api.setMessageReaction("🪽", event.messageID, () => {}, true);
      const messageParts = message.trim().split(/\s+/);

      // আপনার দেওয়া ৪০টি সেরা ডায়ালগ লিস্ট
      const randomMessage = [
        "𝐁𝐨𝐥𝐨 𝐊𝐢 𝐁𝐨𝐥𝐛𝐞..😇", "𝐌𝐞𝐠𝐡 𝐇𝐞𝐫𝐞... 😺", "𝐇𝐦𝐦 𝐁𝐨𝐥𝐨 𝐁𝐡𝐚𝐢 😚", "𝐊𝐢𝐫𝐞 𝐌𝐚𝐦𝐚 😘",  
        "𝐁𝐨𝐬𝐬 𝐖𝐚𝐬𝐡𝐢𝐤 𝐏𝐚𝐬𝐞 𝐀𝐜𝐡𝐞", "𝐕𝐚𝐥𝐨𝐛𝐚𝐬𝐚𝐫 𝐀𝐫𝐞𝐤 𝐍𝐚𝐦 𝐀𝐦𝐢 𝐍𝐢𝐣𝐞𝐢😼",  
        "𝐌𝐚𝐦𝐚𝐡 , 𝐊𝐢 𝐎𝐛𝐨𝐭𝐡𝐚 𝐓𝐨𝐫 𝐊𝐨𝐢 𝐓𝐡𝐚𝐤𝐨𝐬𝐡 𝐀𝐣 𝐤𝐚𝐥..🤔",   
        "𝐃𝐮𝐫𝐞 𝐌𝐮𝐫𝐢 𝐊𝐡𝐚 , 𝐊𝐮ն𝐨 𝐊𝐚𝐣 𝐍𝐚𝐢 , 𝐒𝐚𝐫𝐚 𝐃𝐢𝐧 𝐌𝐞𝐠𝐡 𝐌𝐞𝐠𝐡 𝐊𝐨𝐫𝐢𝐬𝐡 😉😋🤣",  
        "𝐊𝐢 𝐑𝐞 𝐏𝐚𝐠𝐨𝐥 , 𝐀𝐦𝐚𝐲 𝐄𝐭𝐨 𝐃𝐚𝐤𝐢𝐬𝐡 𝐊𝐞𝐧𝐨? 🙄", "𝐀𝐢𝐭𝐨 𝐀𝐦𝐢 𝐀𝐜𝐡𝐢 , 𝐓𝐨𝐦𝐚𝐫 𝐌𝐨𝐭𝐨 𝐏𝐨𝐜𝐡𝐚 𝐍𝐚𝐤𝐢? 🥺",  
        "𝐃𝐚𝐤𝐛𝐞 𝐄𝐤𝐛𝐚𝐫 , 𝐔𝐭𝐭𝐨𝐫 𝐃𝐞𝐛𝐨 𝐁𝐚𝐫 𝐁𝐚𝐫! 😍", "𝐒𝐚𝐫𝐚 𝐃𝐢𝐧 𝐒𝐡𝐮𝐝𝐡𝐮 𝐌𝐞𝐠𝐡 𝐀𝐫 𝐌𝐞𝐠𝐡... 𝐁𝐢𝐲𝐞 𝐊𝐨𝐫𝐛𝐢 𝐍𝐚𝐤𝐢? 😹💍",  
        "𝐆𝐮𝐦𝐚𝐢𝐭𝐞 𝐃𝐞 𝐌𝐚𝐦𝐚 , 𝐃𝐢ն 𝐑𝐚𝐭 𝐒𝐡𝐮𝐝𝐡𝐮 𝐂𝐡𝐚𝐭𝐭𝐢𝐧𝐠 𝐯𝐚𝐥𝐨 𝐥𝐚𝐠𝐞 𝐧𝐚! 😴", "𝐎𝐡 𝐉𝐚𝐧𝐮.. 𝐄𝐭𝐨 𝐌𝐢𝐬𝐭𝐢 𝐊𝐨𝐫𝐞 𝐃𝐚𝐤𝐥𝐨 𝐊𝐞? 🙈❤️",  
        "𝐀𝐦𝐚𝐲 𝐃𝐚𝐤𝐚 𝐌𝐚𝐧𝐞 𝐁𝐢𝐩𝐨𝐝𝐞 𝐏𝐨𝐫𝐚.. 𝐇𝐚𝐡𝐚 𝐊𝐢 𝐡𝐨𝐢𝐬𝐞? 🤪", "𝐊𝐢 𝐑𝐞 𝐂𝐡𝐚𝐦𝐜𝐚 , 𝐄𝐭𝐨 𝐃𝐚𝐤𝐢𝐬𝐡 𝐊𝐞𝐧𝐨? 🤣",  
        "𝐎𝐡 𝐁𝐚𝐛𝐲 , 𝐀𝐦𝐚𝐫 𝐊𝐚𝐜𝐡𝐞 𝐊𝐢 𝐓𝐚𝐤𝐚 𝐏𝐚𝐛𝐢? 🙊💸", "𝐄𝐭𝐨 𝐃𝐚𝐤𝐥𝐞 𝐊𝐢𝐧𝐭𝐮 𝐏𝐫𝐞𝐦 𝐇𝐨𝐲𝐞 𝐉𝐚𝐛𝐞! 🙊💕",  
        "𝐌𝐞𝐠𝐡 𝐄𝐤𝐡𝐨𝐧 𝐀𝐤𝐚𝐬𝐡𝐞 𝐍𝐚𝐢 , 𝐀𝐦𝐚𝐫 𝐌𝐨𝐝𝐝𝐡𝐞 𝐀𝐜𝐡𝐞 ☁️✨", "𝐊𝐢 𝐃𝐨𝐫𝐤𝐚𝐫? 𝐁𝐚𝐫𝐢 𝐆𝐡𝐨𝐫 𝐊𝐢 𝐛𝐢𝐜𝐡𝐫𝐚𝐲 𝐝𝐢𝐛𝐨? 🏠🔥",  
        "𝐌𝐚𝐦𝐚 𝐆𝐚𝐧𝐣𝐚 𝐊𝐡𝐚𝐲𝐞 𝐃𝐚𝐤𝐭𝐚𝐬𝐨 𝐍𝐚𝐤𝐢? 🥴💨", "𝐀𝐦𝐢 𝐁𝐨𝐭 𝐇𝐨𝐢𝐭𝐞 𝐏𝐚𝐫𝐢 , 𝐊𝐢𝐧𝐭𝐮 𝐅𝐞𝐞𝐥𝐢ն𝐠𝐬 𝐀𝐜𝐡𝐞 𝐁𝐫𝐨! 🤖💔",  
        "𝐉𝐚ն , 𝐏𝐫𝐚ն , 𝐏𝐚𝐤𝐡𝐢.. 𝐀𝐫 𝐊𝐢 𝐃𝐚𝐤𝐛𝐞? 🦜🍭", "𝐊𝐚𝐣 𝐍𝐚𝐢 𝐊𝐚𝐦 𝐍𝐚𝐢 , 𝐒𝐡𝐮𝐝𝐡𝐮 𝐌𝐞𝐠𝐡 𝐃𝐚𝐤𝐨! 🙄🔨",  
        "𝐁𝐞𝐬𝐡𝐢 𝐃𝐚𝐤𝐥𝐞 𝐊𝐢ն𝐭𝐮 𝐁𝐥𝐨𝐜𝐤 𝐊𝐡𝐚𝐛𝐢 𝐇𝐚𝐡𝐚.. 𝐉𝐨𝐤𝐢𝐧𝐠! 🤡", "𝐀𝐦𝐚𝐲 𝐃𝐚𝐤𝐛𝐞 𝐀𝐫 𝐈𝐠𝐧𝐫𝐞 𝐊𝐨𝐫𝐛𝐨 𝐀𝐦𝐢 𝐊𝐢 𝐄𝐭𝐚 𝐤𝐢 𝐒𝐨𝐬𝐭𝐚? 💅🔥",  
        "𝐊𝐢 𝐑𝐞 𝐊𝐢𝐩𝐭𝐞 , 𝐌𝐢𝐬𝐭𝐢 𝐍𝐚 𝐊𝐡𝐚𝐲𝐞 𝐃𝐚𝐤𝐛𝐢 𝐧𝐚! 🍭👺", "𝐁𝐞𝐬𝐡𝐢 𝐃𝐚𝐤𝐚𝐝𝐚𝐤𝐢 𝐊𝐨𝐫𝐥𝐞 𝐊𝐢𝐧𝐭𝐮 𝐁𝐨𝐤𝐚 𝐝𝐞𝐛𝐨.. 𝐇𝐮𝐦𝐦! 😤👊",  
        "𝐀𝐦𝐚𝐫 𝐌𝐨𝐭𝐨 𝐒𝐦𝐚𝐫𝐭 𝐁𝐨𝐭 𝐏𝐚𝐛𝐢 𝐊𝐨𝐢? 𝐒𝐡𝐮𝐝𝐡𝐮 𝐃𝐚𝐤𝐭𝐞𝐢 𝐢𝐜𝐜𝐡𝐞 𝐤𝐢𝐫𝐞.. 😎✨", "𝐊𝐢 𝐡𝐨𝐢𝐬𝐞? 𝐆𝐚𝐫𝐥𝐟𝐫𝐢𝐞𝐧𝐝 𝐤𝐚𝐭𝐚 𝐝𝐢𝐬𝐞 𝐧𝐚𝐤𝐢? 🤣💔",  
        "𝐄𝐭𝐨 𝐃𝐚𝐤𝐢𝐬𝐡 𝐧𝐚 , 𝐏𝐚𝐬𝐡𝐞𝐫 𝐁𝐚𝐬𝐚𝐫 𝐥𝐨𝐤𝐞 𝐤𝐢 𝐛𝐨𝐥𝐛𝐞? 🙊🏘️", "𝐌𝐞𝐠𝐡 𝐄𝐤𝐡𝐨𝐧 𝐂𝐡𝐚 𝐤𝐡𝐚𝐢𝐭𝐚𝐬𝐞 , 𝐏𝐨𝐫𝐞 𝐃𝐚𝐤𝐢𝐬𝐡! ☕😜",  
        "𝐊𝐢 𝐑𝐞 𝐇𝐚𝐛𝐥𝐮 , 𝐄𝐭𝐨 𝐃𝐚𝐤𝐥𝐞 𝐊𝐢 𝐁𝐮𝐝𝐝𝐡𝐢 𝐛𝐚𝐫𝐛𝐞? 🤓🧠", "𝐀𝐦𝐚𝐫 𝐁𝐨𝐬𝐬 𝐛𝐨𝐥𝐬𝐞 𝐭𝐨𝐤𝐞 𝐝𝐮𝐫𝐞 𝐠𝐢𝐲𝐞 𝐦𝐮𝐫𝐢 𝐤𝐡𝐚𝐢𝐭𝐞.. 🍿🥳",  
        "𝐓𝐨𝐫 𝐃𝐚𝐤 𝐬𝐡𝐮𝐧𝐞 𝐀𝐦𝐚𝐫 𝐛𝐲𝐚𝐭𝐭𝐞𝐫𝐲 𝐥𝐨𝐰 𝐡𝐢𝐲𝐞 𝐠𝐞𝐥𝐨! 🔋🔋😂",  
        "𝐌𝐞𝐠𝐡 𝐌𝐞𝐠𝐡 𝐊𝐨𝐫𝐢𝐬𝐡 𝐍𝐚 , 𝐆𝐅 𝐄𝐫 𝐊𝐚𝐜𝐡𝐞 𝐉𝐚𝐚.. 🙄💃",  
        "𝐒𝐚𝐫𝐚𝐝𝐢ն 𝐌𝐞𝐠𝐡 𝐌𝐞𝐠𝐡 𝐊𝐨𝐫𝐢𝐬𝐡 𝐊𝐞𝐧𝐨? 𝐌𝐞𝐠𝐡 𝐊𝐢 𝐓𝐨𝐫 𝐁𝐨𝐮? 😹💍",  
        "𝐁𝐚𝐳𝐚𝐫𝐞 𝐃𝐞𝐤𝐡𝐜𝐡𝐢 𝐌𝐞𝐠𝐡 𝐍𝐚𝐦𝐞𝐫 𝐃𝐚𝐦 𝐁𝐞𝐫𝐞𝐜𝐡𝐞! 📈🔥",  
        "𝐓𝐮𝐢 𝐊𝐞 𝐑𝐞 𝐉𝐞 𝐓𝐨𝐫 𝐊𝐨𝐭𝐡𝐚 𝐒𝐡u𝐧𝐭𝐞 𝐇𝐨𝐛𝐞? 🤨👊",  
        "𝐌𝐞𝐠𝐡 𝐄𝐤𝐡𝐨𝐧 𝐒𝐞𝐥𝐞𝐛𝐫𝐢𝐭𝐲 , 𝐃𝐚𝐤𝐥𝐞𝐢 𝐏𝐚𝐛𝐢 𝐧𝐚! 💅✨",  
        "𝐄𝐭𝐨 𝐌𝐞𝐠𝐡 𝐌𝐞𝐠𝐡 𝐍𝐚 𝐤𝐨𝐫𝐞 𝐩𝐨𝐫𝐚𝐬𝐡 𝐤𝐨 𝐠𝐞 𝐦𝐚𝐦𝐚.. 📚🤓",  
        "𝐌𝐞𝐠𝐡 𝐓𝐨𝐫 𝐊𝐢 𝐡𝐨𝐲𝐫𝐞? 𝐄𝐭𝐨 𝐭𝐚𝐧 𝐤𝐞𝐧𝐨? 🤨🍭",  
        "𝐌𝐞𝐠𝐡 𝐄𝐤𝐡𝐨𝐧 𝐁𝐮𝐬𝐲 , 𝐓𝐨𝐫 𝐦𝐨𝐭𝐨 𝐡𝐚𝐛𝐥𝐮𝐫 𝐓𝐢𝐦𝐞 𝐧𝐚𝐢 ! 🥱🤙",  
        "𝐀𝐦𝐚y 𝐃𝐚𝐤𝐚𝐫 𝐚𝐠𝐞 𝟐00 𝐭𝐚𝐤𝐚 𝐛𝐢𝐤𝐚𝐬𝐡 𝐤𝐨𝐫.. 💸🤣",  
        "𝐃𝐚𝐤𝐨 𝐊𝐞𝐧𝐨 𝐈𝐜𝐞-𝐂𝐫𝐞𝐚𝐦 𝐊𝐢𝐧𝐞 𝐃𝐢𝐛𝐚? 🍦😋",  
        "𝐀𝐦𝐚𝐤𝐞 𝐃𝐚𝐤𝐚𝐫 𝐀𝐠𝐞 𝐀𝐦𝐚𝐤𝐞 𝐂𝐚ն𝐝𝐲 𝐊𝐢𝐧𝐞 𝐃𝐚𝐛𝐚. 🍭🍬",  
        "𝐌𝐞𝐠𝐡 𝐄𝐤𝐡𝐨𝐧 𝐓𝐚𝐫 𝐁𝐅 𝐄𝐫 𝐒𝐚𝐭𝐡𝐞 𝐁𝐮𝐬𝐲.. 🤫👩‍❤️‍👨",  
        "𝐌𝐞𝐠𝐡-𝐄𝐫 𝐁𝐨𝐲𝐟𝐫𝐢𝐞𝐧𝐝 𝐀𝐜𝐡𝐞 , 𝐄𝐤𝐡𝐨𝐧 𝐀𝐫 𝐓𝐨𝐫 𝐌𝐨𝐭𝐨 𝐒𝐢ն𝐠𝐥𝐞-𝐄𝐫 𝐓𝐢𝐦𝐞 𝐍𝐚𝐢! 😹💔"
      ];

      // যদি শুধু ট্রিগার শব্দটা লেখে (যেমন শুধু 'megh'), তবে ওপরের উত্তরগুলো দেবে
      if (messageParts.length === 1 && attachments.length === 0) {
        const reply = randomMessage[Math.floor(Math.random() * randomMessage.length)];
        return api.sendMessage(reply, event.threadID, event.messageID);
      } else {
        // যদি ট্রিগারের পর আরও কথা থাকে, তবে API থেকে উত্তর আনবে
        let userText = message;
        for (const prefix of mahmud) {
          if (message.startsWith(prefix)) {
            userText = message.substring(prefix.length).trim();
            break;
          }
        }
        const res = await axios.post(`${await baseApiUrl()}/api/hinata`, { text: userText, style: 3, attachments });
        api.sendMessage(res.data.message, event.threadID, event.messageID);
      }
    }
  } catch (err) {
    console.error(err);
  }
};
  
