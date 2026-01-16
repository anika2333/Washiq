const axios = require("axios");

// ===== USER-BASED ON/OFF =====
const activeUsers = new Set();

// ===== BOT INFO =====
const BOT_INFO = {
  botName: "Raha AI",
  creator: "Washiq Adnan",
  role: "Creator & Developer"
};

const HEADER = "🎀˚₊· ͟͟͞͞➳❥ 𝐑𝐚𝐡𝐚 𝐀𝐈 ࿐🎀\n\n";

module.exports = {
  config: {
    name: "raha",
    aliases: ["rahaai"],
    version: "FINAL",
    author: BOT_INFO.creator,
    role: 0,
    shortDescription: "Personal AI Chat",
    longDescription: "Raha AI talks only with users who turn it ON",
    category: "ai",
    guide: {
      en: "/raha on | /raha off"
    }
  },

  // ===== COMMAND HANDLER =====
  onStart: async function ({ message, args, event }) {
    const uid = event.senderID;
    const cmd = (args[0] || "").toLowerCase();

    if (cmd === "on") {
      activeUsers.add(uid);
      return message.reply(
        `${HEADER}✅ Raha AI is now **ON**.\nI’ll talk only with you.`
      );
    }

    if (cmd === "off") {
      activeUsers.delete(uid);
      return message.reply(
        `${HEADER}🚫 Raha AI is now **OFF** for you.`
      );
    }

    return message.reply(
      `${HEADER}Use:\n/raha on\n/raha off`
    );
  },

  // ===== AUTO CHAT =====
  onChat: async function ({ message, event }) {
    const uid = event.senderID;

    // Only talk to enabled user
    if (!activeUsers.has(uid)) return;

    // Ignore commands
    if (!event.body || event.body.startsWith("/")) return;

    const text = event.body.trim();
    const lower = text.toLowerCase();

    // ===== CREATOR / OWNER INFO (HARD LOCK) =====
    const creatorTriggers = [
      "developer",
      "creator",
      "owner",
      "who made you",
      "who created you",
      "your developer",
      "your creator",
      "ডেভেলপার",
      "কে বানাইছে",
      "কে বানাইসে",
      "তোর ডেভেলপার কে",
      "তোমার ডেভেলপার কে",
      "কে বানাইছে তোকে"
    ];

    if (creatorTriggers.some(k => lower.includes(k))) {
      return message.reply(
        `${HEADER}` +
        `🤖 Name: ${BOT_INFO.botName}\n` +
        `👤 ${BOT_INFO.role}: ${BOT_INFO.creator}\n\n` +
        `I was personally created and maintained by ${BOT_INFO.creator}.`
      );
    }

    // ===== QUICK FRIENDLY CHAT =====
    const quickReplies = {
      "hi": "Hey 👋 How’s it going?",
      "hello": "Hello 😊 What’s up?",
      "hey": "Hey 😄",
      "ki koro": "আমি তো তোমার সাথেই কথা বলছি 😄 তুমি কী করছো?",
      "কি করো": "আমি তো তোমার সাথেই কথা বলছি 😄 তুমি কী করছো?",
      "what are you doing": "Talking with you 😌 What about you?",
      "how are you": "I’m doing great 😊 How about you?",
      "কেমন আছো": "ভালো আছি 😊 তুমি কেমন?"
    };

    if (quickReplies[lower]) {
      return message.reply(HEADER + quickReplies[lower]);
    }

    // ===== LANGUAGE DETECT =====
    const hasBangla = /[\u0980-\u09FF]/.test(text);
    const langRule = hasBangla
      ? "Reply in Bengali."
      : "Reply in the same language as the user.";

    // ===== AI PROMPT =====
    const prompt = `
You are Raha AI, a friendly human-like chatbot.

Rules:
- ${langRule}
- Match the user's tone.
- Keep replies short and natural.
- Do NOT explain word meanings unless asked.
- No links, no references.
- Your creator and developer is ${BOT_INFO.creator}.

User: ${text}
`;

    try {
      const apiUrl =
        "https://betadash-api-swordslush-production.up.railway.app/you?chat=" +
        encodeURIComponent(prompt);

      const res = await axios.get(apiUrl);
      if (!res.data || !res.data.response) return;

      return message.reply(HEADER + res.data.response.trim());
    } catch (err) {
      console.error("Raha AI Error:", err.message);
    }
  }
};
