const axios = require("axios");

module.exports = {
  config: {
    name: "i",
    version: "1.3",
    author: "RAFI",
    countDown: 5,
    role: 0,
    longDescription: {
      en: "Generate multiple AI images from text.",
    },
    category: "AI-IMAGE",
    guide: {
      en: "Example: {pn} cute girl | 4 (will generate 4 images)",
    },
  },

  onStart: async function ({ api, args, message, event }) {
    const text = args.join(" ");
    if (!text) return message.reply("⚠️ Please provide a prompt.");

    let prompt, quantity;
    if (text.includes("|")) {
      [prompt, quantity] = text.split("|").map(str => str.trim());
      quantity = parseInt(quantity);
      if (isNaN(quantity) || quantity < 1 || quantity > 10) {
        return message.reply("⚠️ Quantity must be a number between 1 and 10.");
      }
    } else {
      prompt = text;
      quantity = 4;
    }

    // ⏳ Start loading
    api.setMessageReaction("⏳", event.messageID, () => {}, true);

    try {
      const ratio = "1:1";
      const imageUrls = [];

      for (let i = 0; i < quantity; i++) {
        const res = await axios.get(`https://www.ai4chat.co/api/image/generate`, {
          params: { prompt, aspect_ratio: ratio }
        });
        if (res.data?.image_link) imageUrls.push(res.data.image_link);
      }

      const imageStreams = await Promise.all(
        imageUrls.map(url => global.utils.getStreamFromURL(url))
      );

      // ✅ Done loading
      api.setMessageReaction("✅", event.messageID, () => {}, true);

      return message.reply({ attachment: imageStreams });

    } catch (error) {
      console.error("Image generation error:", error.message || error);
      api.setMessageReaction("❌", event.messageID, () => {}, true);
      return message.reply("❌ Failed to generate images.");
    }
  },
};
