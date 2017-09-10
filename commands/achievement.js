const Social = require('../base/Social.js');
const { Canvas } = require('canvas-constructor');
const snek = require('snekfetch');
const { resolve, join } = require('path');
const fsn = require('fs-nextra');
Canvas.registerFont(resolve(join(__dirname, '../assets/fonts/Minecraftia.ttf')), 'Minecraftia');
Canvas.registerFont(resolve(join(__dirname, '../assets/fonts/NotoEmoji-Regular.ttf')), 'Minecraftia');

const getAchievement = async (text, person) => {
  const plate = await fsn.readFile('./assets/images/plate_achievement.png');
  const png = person.replace(/\.gif.+/g, '.png');
  const { body } = await snek.get(png);
  return new Canvas(320, 64)
    .addImage(plate, 0, 0, 320, 64)
    .addImage(body, 16, 16, 32, 32, { type: 'round', radius: 16 })
    .restore()
    .setTextFont('12pt Minecraftia')
    .setColor('#FFFFFF')
    .addText(text, 60, 58)
    .toBuffer();
};

class Achievement extends Social {
  constructor(client) {
    super(client, {
      name: 'achievement',
      description: 'Creates a Discord Themed "Minecraft" Achievement.',
      category: 'Fun',
      usage: 'achievement',
      extended: 'Either mention a user with text to give the achievement their user avatar, or just supply text for your own achievement.',
      cost: 25,
      aliases: ['get', 'achieveget', 'achievementget'],
      botPerms: ['ATTACH_FILES']
    });
  }
  async run(message, args, level) { // eslint-disable-line no-unused-vars
    try {
      if (level < 2) {
        const payMe = await this.pay(message, message.author.id, this.help.cost);
        if (!payMe) return;  
      }
      const msg = await message.channel.send('`Achievement Getting...`');
      const person = (message.mentions.users.first() || message.author).displayAvatarURL;
      let text = args.join(' ');
      if (message.mentions.users.first()) text = text.replace(/<@!?\d+>/, '').replace(/\n/g, ' ').trim();
      if (text.length < 1) return message.reply('You must give an achievement description.');
      if (text.length > 22) return message.reply('I can only handle a maximum of 22 characters');
      const result = await getAchievement(text, person);
      await message.channel.send({ files: [{ attachment: result, name: 'achievementGet.png' }] });
      await msg.delete();
    } catch (e) {
      console.log(e);
    }
  }
}

module.exports = Achievement;