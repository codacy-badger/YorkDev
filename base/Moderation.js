const Command = require('./Command.js');
const { RichEmbed } = require('discord.js');
const embed = new RichEmbed();

class Moderation extends Command {
  
  constructor(client, options) {
    super(client, Object.assign(options, {
      category: 'Moderation',
      guildOnly: true,
      permLevel: 2
    }));

    this.actions = {
      w: { color: 0xFFFF00, display: 'Warn'    },
      m: { color: 0xFF9900, display: 'Mute'    },
      k: { color: 0xFF3300, display: 'Kick'    },
      s: { color: 0xFF2F00, display: 'Softban' },
      b: { color: 0xFF0000, display: 'Ban'     },
      u: { color: 0x006699, display: 'Unban'   },
      l: { color: 0x7289DA, display: 'Lockdown'}
    };
    
  }

  modCheck(message, args, level) {

    const user = args.join(' ') || message.mentions.users.first();
    const match = /(?:<@!?)?([0-9]{17,20})>?/gi.exec(user);
    if (!match) return '|`❌`| That is not a valid user id.';

    const id = match[1];
    const target = message.guild.member(id);

    if (message.author.id === id) return '|`🛑`| You cannot moderate yourself.';
    if (!target.bannable) return '|`❗`| This member cannot be banned.';
    if (!target.kickable) return '|`❗`| This member cannot be kicked.';

    const author = message.mentions.users.first() || this.client.users.get(id);
    const member = message.mentions.members.first() || target;
    const msg = { author:author, member:member, guild: message.guild };

    if (level <= this.client.permlevel(msg)) return '|`🛑`| You cannot perform that action on someone of equal, or a higher permission level.';

    console.log(message.cleanContent);
  }

  embedSan(embed) {
    embed.message ? delete embed.message : null;
    embed.footer ? delete embed.footer.embed : null;
    embed.provider ? delete embed.provider.embed : null;
    embed.thumbnail ? delete embed.thumbnail.embed : null;
    embed.image ? delete embed.image.embed : null;
    embed.author ? delete embed.author.embed : null;
    embed.fields ? embed.fields.forEach(f => {delete f.embed;}) : null;
    return embed;
  }
  
  async caseNumber(client, modlog) {
    const messages = await modlog.fetchMessages({limit: 5});
    const log = messages.filter(m => m.author.id === client.user.id
      && m.embeds[0]
      && m.embeds[0].type === 'rich'
      && m.embeds[0].footer
      && m.embeds[0].footer.text.startsWith('Case')
    ).first();
    if (!log) return 1;
    const thisCase = /Case\s(\d+)/.exec(log.embeds[0].footer.text);
    return thisCase ? parseInt(thisCase[1]) + 1 : 1;
  }
  
  async buildModLog(client, guild, action, target, mod, reason) {
    const settings = client.settings.get(guild.id);
    const caseNumber = await this.caseNumber(client, guild.channels.find('name', settings.modLogChannel));
    const thisAction = this.actions[action];

    if (reason.length < 1) reason = `Awaiting moderator's input. Use ${settings.prefix}reason ${caseNumber} <reason>.`;

    embed.setColor(thisAction.color)
      .setAuthor(`${mod.tag} (${mod.id})`)
      .setDescription(`**Action:** ${thisAction.display}\n**Target:** ${target.user.tag} (${target.id})\n**Reason:** ${reason}`)
      .setTimestamp()
      .setFooter(`Case ${caseNumber}`);
    return guild.channels.find('name', settings.modLogChannel).send({embed});
  }
  
}



module.exports = Moderation;