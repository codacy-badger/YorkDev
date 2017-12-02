
exports.run = async (client, message, level) => { // eslint-disable-line no-unused-vars
  if (!message.channel.type == 'text') return;
  if (level > 1) return;
  if (/(discord\.(gg|io|me|li)\/.+|discordapp\.com\/invite\/.+)/i.test(message.content)) {
    message.delete().then(() => {
      let count = 1;
      const spammer = `${message.guild.id}-${message.author.id}`;
      const list = client.invspam.get(spammer) || client.invspam.set(spammer, { count: 0 }).get(spammer);
      if (list) count = list.count + 1;
      if (count >= parseInt(message.settings.inviteLimit)) {
        message.member.ban({ days: 2, reason: 'Automatic ban, invite spam threshold exceeded.' }).then((g) => {
          message.channel.send(`${g.user.username} was successfully banned for invite spam`);
          client.invspam.delete(spammer);
        });
      }
      client.invspam.set(spammer, { count });
    });
    message.channel.send(`${message.author} |\`⛔\`| Your message contained a server invite link, which this server prohibits.`);
  }

};
