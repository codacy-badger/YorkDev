const Moderation = require('../../base/Moderation.js');

class Reason extends Moderation {
  constructor(client) {
    super(client, {
      name: 'reason',
      description: 'Updates a case log with a new reason.',
      usage: 'reason <case number> <reason>',
      extented: 'This will allow a member of staff to update a mod-log case reason.',
      botPerms: ['EMBED_LINKS']
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars
    const caseNumber  =  args.shift();
    const newReason   =  args.join(' ');
    const settings    =  message.settings;
    const channel     =  message.guild.channels.exists('name', settings.modLogChannel);
    if (!channel) return message.reply(`Cannot find the \`${settings.modLogChannel}\` channel.`);
    const modlog      =  message.guild.channels.find('name', settings.modLogChannel);
    const messages    =  await modlog.fetchMessages({limit: 100});
    const caseLog     =  await messages.find(m => m.embeds[0] && m.embeds[0].footer && m.embeds[0].footer.text === `Case ${caseNumber}`);
    const logMsg      =  await modlog.fetchMessage(caseLog.id);
    const logEmbed    =  logMsg.embeds[0];
    const parts = logEmbed.description.split('\n**Reason:** ');
    const updatedReason = [parts[0], parts[1] = '\n**Reason:** ' + newReason].join(' ');
    const embed = await this.caseEmbed(logEmbed.color, updatedReason, logEmbed.author.name, logEmbed.createdAt, logEmbed.footer.text);
    await logMsg.edit({embed});
    await message.channel.send(`Case ${caseNumber} successfully updated with the new reason: \`${newReason}\``);
  }
}    

module.exports = Reason;