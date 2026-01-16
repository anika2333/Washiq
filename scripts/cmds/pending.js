const axios = require("axios");

/**
 * SAFE FANCY FONT CONVERTER
 */
function fancySafe(text) {
  const map = {
    'a': '𝐚', 'b': '𝐛', 'c': '𝐜', 'd': '𝐝', 'e': '𝐞', 'f': '𝐟', 'g': '𝐠', 'h': '𝐡', 'i': '𝐢', 'j': '𝐣', 'k': '𝐤', 'l': '𝐥', 'm': '𝐦', 'n': '𝐧', 'o': '𝐨', 'p': '𝐩', 'q': '𝐪', 'r': '𝐫', 's': '𝐬', 't': '𝐭', 'u': '𝐮', 'v': '𝐯', 'w': '𝐰', 'x': '𝐱', 'y': '𝐲', 'z': '𝐳',
    'A': '𝐀', 'B': '𝐁', 'C': '𝐂', 'D': '𝐃', 'E': '𝐄', 'F': '𝐅', 'G': '𝐆', 'H': '𝐇', 'I': '𝐈', 'J': '𝐉', 'K': '𝐊', 'L': '𝐋', 'M': '𝐌', 'N': '𝐍', 'O': '𝐎', 'P': '𝐏', 'Q': '𝐐', 'R': '𝐑', 'S': '𝐒', 'T': '𝐓', 'U': '𝐔', 'V': '𝐕', 'W': '𝐖', 'X': '𝐗', 'Y': '𝐘', 'Z': '𝐙',
    '0': '𝟎', '1': '𝟏', '2': '𝟐', '3': '𝟑', '4': '𝟒', '5': '𝟓', '6': '𝟔', '7': '𝟕', '8': '𝟖', '9': '𝟗'
  };
  return String(text).split('').map(char => map[char] || char).join('');
}

module.exports = {
  config: {
    name: "pending",
    version: "1.1",
    author: "S A I M / Washik",
    countDown: 5,
    role: 2, // Admin only
    shortDescription: "Approve pending threads",
    category: "Admin"
  },

  langs: {
    en: {
      invaildNumber: "%1 is not a valid number",
      cancelSuccess: "Refused %1 thread!",
      approveSuccess: "Approved successfully %1 threads!",
      cantGetPendingList: "Can't get the pending list!",
      returnListPending: "»「PENDING」«❮ Total: %1 ❯\n\n%2",
      returnListClean: "「PENDING」No threads in pending list."
    }
  },

  onReply: async function ({ api, event, Reply, getLang, commandName }) {
    if (String(event.senderID) !== String(Reply.author)) return;
    const { body, threadID, messageID } = event;
    let count = 0;

    if (body.toLowerCase().startsWith("c") || body.toLowerCase().startsWith("cancel")) {
      const index = body.replace(/c|cancel/g, "").trim().split(/\s+/);
      for (const i of index) {
        if (isNaN(i) || i <= 0 || i > Reply.pending.length) return api.sendMessage(getLang("invaildNumber", i), threadID, messageID);
        api.removeUserFromGroup(api.getCurrentUserID(), Reply.pending[i - 1].threadID);
        count++;
      }
      return api.sendMessage(getLang("cancelSuccess", count), threadID, messageID);
    } else {
      const index = body.split(/\s+/);
      for (const i of index) {
        if (isNaN(i) || i <= 0 || i > Reply.pending.length) return api.sendMessage(getLang("invaildNumber", i), threadID, messageID);

        const targetThread = Reply.pending[i - 1].threadID;
        const threadInfo = await api.getThreadInfo(targetThread);
        const time = new Date().toLocaleString('en-BD', { timeZone: 'Asia/Dhaka' });

        const approvalMsg = 
`〘 ${fancySafe("Approval Successful")} 〙
──────────────────
┃        🎀 ${fancySafe("Approved by Washik")} 🎀
┃
╠══✦〘 ${fancySafe("GC Information")} 〙✦══╣
┃ 🏷️ ${fancySafe("Name")}: ${threadInfo.threadName || "Unnamed Group"}
┃ 🆔 ${fancySafe("ID")}: ${targetThread}
┃ 👥 ${fancySafe("Members")}: ${fancySafe(threadInfo.participantIDs.length)}
┃ ⏰ ${fancySafe("Joined")}: ${fancySafe(time)}
┃ 💡 ${fancySafe("Tip")}: ${fancySafe("Type /help for all commands")}
╚════════════════════╝`;

        api.sendMessage(approvalMsg, targetThread);
        count++;
      }
      return api.sendMessage(getLang("approveSuccess", count), threadID, messageID);
    }
  },

  onStart: async function ({ api, event, getLang, commandName }) {
    try {
      const spam = await api.getThreadList(100, null, ["OTHER"]) || [];
      const pending = await api.getThreadList(100, null, ["PENDING"]) || [];
      const list = [...spam, ...pending].filter(group => group.isGroup);

      let msg = "", index = 1;
      for (const item of list) msg += `${index++}/ ${item.name} (${item.threadID})\n`;

      if (list.length !== 0) {
        return api.sendMessage(getLang("returnListPending", list.length, msg), event.threadID, (err, info) => {
          global.GoatBot.onReply.set(info.messageID, {
            commandName,
            messageID: info.messageID,
            author: event.senderID,
            pending: list
          });
        }, event.messageID);
      } else {
        return api.sendMessage(getLang("returnListClean"), event.threadID, event.messageID);
      }
    } catch (e) {
      return api.sendMessage(getLang("cantGetPendingList"), event.threadID, event.messageID);
    }
  }
};

