const Canvas = require('canvas-constructor');
const achievement = new Canvas(320, 64);
const snek = require('snekfetch');
const { resolve, join} = require('path');
const fsn = require('fs-nextra');

const getAchievement = async (text, person) => {
  const plate = await fsn.readFile('./assets/plate_achievement.png');
  const png = person.replace(/\.gif.+/g,'.png');
  const {body} = await snek.get(png);
  achievement.addImage(plate, 0, 0, 320, 64)
    .addImage(body, 16, 16, 32, 32, {type:'round', radius: 16})
    .restore()
    .addTextFont(resolve(join(__dirname, '../assets/font_minecraftia.ttf')), 'Minecraftia')
    .setTextFont('12pt Minecraftia')
    .setColor('#FFFFFF')
    .addText(text, 60, 58);
};

exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars
  const person = (message.mentions.users.first() || client.user).displayAvatarURL;
  let text = args.join(' ');
  if (message.mentions.users.first()) text = text.replace(/<@!?\d+>/, '').replace(/\n/g, ' ').trim();
  if (text.length < 1) return message.reply('You must give an achievement description.');
  if (text.length > 22) return message.reply('I can only handle a maximum of 22 characters');
  await getAchievement(text, person);
  await message.channel.send({files: [{attachment: achievement.toBuffer(undefined, 3, Canvas.PNG_FILTER_NONE), name: 'achievementGet.png'}]});
};

exports.conf = {
  hidden: false,
  guildOnly: false,
  aliases: ['get','achieveget', 'achievementget'],
  permLevel: 2
};

exports.help = {
  name: 'achievement',
  description: 'Creates a Discord Themed "Minecraft" Achievement.',
  usage: 'achievement [user|text]',
  category: 'Fun',
  extended: 'Either mention a user with text to give the achievement their user avatar, or just supply text for your own achievement.'
};
