const { default: makeWASocket, useMultiFileAuthState, DisconnectReason } = require("@whiskeysockets/baileys");
require("dotenv").config();

const BOT_NAME = process.env.BOT_NAME || "oli x bot";
const OWNER = "50946358257";

let spamTracker = {};

async function startBot() {
  const { state, saveCreds } = await useMultiFileAuthState("auth");

  const sock = makeWASocket({
    auth: state,
    printQRInTerminal: true
  });

  sock.ev.on("creds.update", saveCreds);

  sock.ev.on("connection.update", (update) => {
    const { connection, lastDisconnect } = update;

    if (connection === "close") {
      if (lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut) {
        startBot();
      }
    } else if (connection === "open") {
      console.log(`✅ ${BOT_NAME} connecté`);
    }
  });

  sock.ev.on("messages.upsert", async (m) => {
    const msg = m.messages[0];
    if (!msg.message) return;

    const from = msg.key.remoteJid;
    const sender = msg.key.participant || from;

    const text =
      msg.message.conversation ||
      msg.message.extendedTextMessage?.text;

    if (!text) return;

    const command = text.toLowerCase();
    const isOwner = sender.includes(OWNER);
    const isGroup = from.endsWith("@g.us");

    // 📊 LOG
    console.log(`📩 ${sender} : ${text}`);

    // ⏱️ ANTI-SPAM
    if (!spamTracker[sender]) spamTracker[sender] = { count: 0 };

    spamTracker[sender].count++;

    setTimeout(() => {
      spamTracker[sender].count = 0;
    }, 5000);

    if (spamTracker[sender].count > 5) {
      return sock.sendMessage(from, {
        text: "⚠️ Stop spam !"
      });
    }

    // 🔇 ANTI-LIEN
    if (command.includes("chat.whatsapp.com")) {
      await sock.sendMessage(from, {
        text: "🚫 Liens interdits !"
      });

      // kick si admin
      if (isGroup && isOwner) {
        await sock.groupParticipantsUpdate(from, [sender], "remove");
      }
    }

    // 🤖 MENU
    if (command === "!menu") {
      await sock.sendMessage(from, {
        text: `🤖 *${BOT_NAME}*

📌 Commandes :
!ping
!info
!owner
!menu

👮 Admin :
!kick @user
!restart`
      });
    }

    // 🏓
    if (command === "!ping") {
      await sock.sendMessage(from, { text: "🏓 Pong !" });
    }

    // ℹ️
    if (command === "!info") {
      await sock.sendMessage(from, {
        text: `🤖 ${BOT_NAME}\n⚡ En ligne\n🔐 Sécurisé`
      });
    }

    // 👑
    if (command === "!owner") {
      await sock.sendMessage(from, {
        text: `👑 wa.me/${OWNER}`
      });
    }

    // 👮 KICK
    if (command.startsWith("!kick")) {
      if (!isOwner) {
        return sock.sendMessage(from, {
          text: "⛔ Admin seulement"
        });
      }

      if (!isGroup) {
        return sock.sendMessage(from, {
          text: "⚠️ Groupe seulement"
        });
      }

      const mentioned = msg.message.extendedTextMessage?.contextInfo?.mentionedJid;

      if (!mentioned) {
        return sock.sendMessage(from, {
          text: "❌ Mentionne quelqu’un"
        });
      }

      await sock.groupParticipantsUpdate(from, mentioned, "remove");
    }

    // 🔐 RESTART
    if (command === "!restart") {
      if (!isOwner) return;

      await sock.sendMessage(from, { text: "♻️ Restart..." });
      process.exit();
    }

    // 🤖 RÉPONSES AUTO
    if (command.includes("bonjour")) {
      await sock.sendMessage(from, {
        text: "👋 Bonjour !"
      });
    }

    if (command.includes("ça va")) {
      await sock.sendMessage(from, {
        text: "😊 Oui et toi ?"
      });
    }
  });
}

startBot();