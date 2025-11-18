const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ban")
    .setDescription("Ban a user and DM them the reason.")
    .addUserOption(option =>
      option
        .setName("user")
        .setDescription("User to ban")
        .setRequired(true)
    )
    .addStringOption(option =>
      option
        .setName("reason")
        .setDescription("Reason for ban")
        .setRequired(true)
    )
    .setDefaultMemberPermissions(
      PermissionFlagsBits.BanMembers |
      PermissionFlagsBits.KickMembers |
      PermissionFlagsBits.ModerateMembers
    ),

  async execute(interaction) {
    const target = interaction.options.getUser("user");
    const reason = interaction.options.getString("reason");

    // DM the user
    try {
      await target.send(`You have been banned from **dead chat**.\nReason: ${reason}`);
    } catch (err) {
      console.log("Couldn't DM the user, they probably have DMs closed.");
    }

    // Ban the user
    const member = interaction.guild.members.cache.get(target.id);
    if (!member) return interaction.reply({ content: "Bro isn't even in the server 💀", ephemeral: true });

    try {
      await member.ban({ reason });
      await interaction.reply(`🚫 **${target.tag}** has been banned.\nReason: ${reason}`);
    } catch (err) {
      console.error(err);
      await interaction.reply({ content: "Couldn't ban them, something scuffed out.", ephemeral: true });
    }
  }
};
