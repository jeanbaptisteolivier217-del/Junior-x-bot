module.exports = {
  botName: "junior x bot",

  // ⚠️ Numéro admin en format international sans + ni espace
  ownerNumber: "50946358257",

  // Préfixe des commandes
  prefix: "!",

  // Mode du bot : "public" = tout le monde peut utiliser, "private" = toi seulement
  mode: "public",

  // ⚡ Sécurité
  security: {
    antiLink: true,
    antiSpam: true,
    maxSpam: 5,         // messages max avant avertissement
    antiBadWords: true
  },

  // 👮 Admin
  admin: {
    onlyOwnerCommands: true,  // certaines commandes réservées à toi
    autoKickSpam: false,
    autoKickLink: false
  },

  // 💬 Messages personnalisés
  messages: {
    welcome: "👋 Bienvenue dans le groupe !",
    goodbye: "👋 Au revoir !",
    spam: "⚠️ Stop spam !",
    link: "🚫 Liens interdits !",
    badword: "⚠️ Langage interdit !",
    adminOnly: "⛔ Commande réservée à l'admin",
    groupOnly: "⚠️ Groupe seulement"
  }
};