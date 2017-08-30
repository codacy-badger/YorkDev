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

module.exports = class {
  constructor(client) {
    this.client = client;

    this.conf = {
      hidden: false,
      guildOnly: true,
      aliases: ['get', 'achieveget', 'achievementget'],
      permLevel: 0
    };

    this.help = {
      name: 'achievement',
      description: 'Creates a Discord Themed "Minecraft" Achievement.',
      usage: 'achievement [user|text]',
      category: 'Fun',
      extended: 'Either mention a user with text to give the achievement their user avatar, or just supply text for your own achievement.'
    };
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars
    const msg = await message.channel.send('`Achievement Getting...`');
    const person = (message.mentions.users.first() || message.author).displayAvatarURL;
    let text = args.join(' ');
    if (message.mentions.users.first()) text = text.replace(/<@!?\d+>/, '').replace(/\n/g, ' ').trim();
    if (text.length < 1) return message.reply('You must give an achievement description.');
    if (text.length > 22) return message.reply('I can only handle a maximum of 22 characters');
    try {
      const result = await getAchievement(text, person);
      await message.channel.send({ files: [{ attachment: result, name: 'achievementGet.png' }] });
      await msg.delete();
    } catch (e) {
      console.log(e);
    }
  }
};
