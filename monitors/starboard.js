const cache = new Map();
const { RichEmbed } = require('discord.js');
class Starboard {
  static async run(client, reaction, user) {
    const message = reaction.message;
    const settings = client.settings.get(message.guild.id);
    const starboard = settings.starboardChannel;
    if (message.channel.type !== 'text' || reaction.emoji.name !== '⭐') return;
    if (message.author.id === user.id) {
      return message.channel.send(`${user}, you cannot star your own messages.`).then(() => {
        reaction.remove(user.id);
      });
    }

    if (message.author.bot) {
      return message.channel.send(`${user}, you cannot star bot messages.`).then(() => {
        reaction.remove(user.id);
      });
    }

    if (message.cleanContent === '' && this.getFile(message) === '') {
      return message.channel.send(`${user}, you cannot star an empty message.`).then(() => {
        reaction.remove(user.id);
      });
    }

    if (!message.guild.channels.exists('name', starboard)) {
      return message.channel.send(` ${user}, it appears that there no \`${starboard}\` channel.`);
    }

    const star = this.getStar(client, message);
    if (star.users.has(user.id)) return;
    const amount = star.users.add(user.id).size;
    const embed = star.embed.setFooter(`⭐ ${amount} | ${message.id}`);
    if (star.message) return star.message.edit({ embed: star.embed });
    return message.guild.channels.find('name', starboard).send({ embed }).then(message => {
      star.message = message;
    });
  }

  static getStar(client, message) {
    return cache.get(`${message.channel.id}-${message.id}`) || this.createStar(client, message);
  }

  static createStar(client, message) {
    const embed = new RichEmbed()
      .setColor(15844367)
      .setAuthor(message.author.tag)
      .setThumbnail(message.author.displayAvatarURL)
      .setDescription(message.cleanContent)
      .setTimestamp();
    const file = this.getFile(message);

    if (file !== null) embed.setImage(file);
    cache.set(`${message.channel.id}-${message.id}`, { embed, users: new Set(), message: null });
    setTimeout(() => cache.delete(`${message.channel.id}-${message.id}`), client.options.messageCacheLifetime * 1000);
    return cache.get(`${message.channel.id}-${message.id}`);
  }
  static getFile(message) {
    if (message.attachments.size === 0) return '';
    const attachment = message.attachments.first();
    return /\.(jpg|jpeg|png|gif)$/.test(attachment.url) ? attachment.url : '';
  }
}
module.exports = Starboard;