
function starEmbed(color, description, author, thumbnail, timestamp, footer, image = null) {
  const embed = {
    'color': color,
    'description': description,
    'author': {
      'name': author
    },
    'thumbnail': {
      'url': thumbnail
    },
    'image': {
      'url': image
    },
    'timestamp': timestamp,
    'footer': {
      'text': footer
    }
  };
  return embed;
}
function extention(reaction, attachment) {
  const imageLink = attachment.split('.');
  const typeOfImage = imageLink[imageLink.length - 1];
  const image = /(jpg|jpeg|png|gif)/gi.exec(typeOfImage);
  if (!image) return '';
  return attachment;
}

class Starboard {
  static async run(client, reaction, user) {
    
    const message = reaction.message;
    const settings = client.settings.get(message.guild.id);
    const starboard = settings.starboardChannel;

    if (!message.guild.channels.exists('name', starboard)) {
      return message.channel.send(`${user}, it appears that there no \`${starboard}\` channel.`);
    }

    const starChannel = message.guild.channels.find('name', starboard);

    if (starChannel.messages.size < 100) await starChannel.fetchMessages({ limit: 100 });
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

    const image = message.attachments.size > 0 ? await extention(reaction, message.attachments.array()[0].url) : '';
    if (image === '' && message.cleanContent.length < 1) {
      return message.channel.send(`${user}, you cannot star an empty message.`).then(() => {
        reaction.remove(user.id);
      });
    }

    try {
      const stars = starChannel.messages.find(m => m.embeds[0].footer.text.startsWith('⭐') && m.embeds[0].footer.text.endsWith(message.id));
      if (stars) {
        const star = /⭐ ([0-9]{1,3}) \| ([0-9]{17,20})/g.exec(stars.embeds[0].footer.text);
        const _star = stars.embeds[0];
        const embed = starEmbed(_star.color, _star.description, _star.author.name, _star.thumbnail.url, _star.createdTimestamp, `⭐ ${parseInt(star[1])+1} | ${message.id}`, _star.image.url);
        const starMsg = await starChannel.fetchMessage(stars.id);
        await starMsg.edit({ embed });
      }
      if (!stars) {
        if (!message.guild.channels.exists('name', starboard)) throw `It appears that you do not have a \`${starboard}\` channel.`;
        const embed = starEmbed(15844367, message.cleanContent, message.author.tag, message.author.displayAvatarURL, new Date(), `⭐ 1 | ${message.id}`, `${image}`);
        await starChannel.send({ embed });
      }
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Starboard;