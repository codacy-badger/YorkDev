const snek = require('snekfetch');
const path = require('path');
const Canvas = require('canvas');
const Minecraftia = new Canvas.Font('Minecraftia', path.resolve(path.join(__dirname, '../assets/font_minecraftia.ttf')));
const Image = Canvas.Image;
const imgW = 320;
const imgH = 64;
const canvas = new Canvas(imgW, imgH);
const ctx = canvas.getContext('2d');
const imgPlate = new Image;
const imgAvatar = new Image;
imgPlate.src = './assets/plate_achievement.png';
const getAchievement = async (text, person) => {
  const png = person.replace(/\.gif.+/g,'.png');
  const {body} = await snek.get(png);
  ctx.addFont(Minecraftia);
  ctx.font = '12pt Minecraftia';
  ctx.drawImage(imgPlate, 0, 0);
  ctx.save();
  ctx.beginPath();
  ctx.arc(32, 32, 16, 0, Math.PI *2, false);
  ctx.clip();
  imgAvatar.onload = () => ctx.drawImage(imgAvatar, 16, 16, 32, 32);
  imgAvatar.src = body;
  ctx.restore();
  ctx.fillStyle = 'white';
  ctx.fillText(text, 60, 58);
};

exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars
  const person = (message.mentions.users.first() || client.user).displayAvatarURL;
  let text = args.join(' ');
  if (message.mentions.users.first()) text = text.replace(/<@!?\d+>/, '').replace(/\n/g, ' ').trim();
  if (text.length < 1) return message.reply('You must give an achievement description.');
  if (text.length > 22) return message.reply('I can only handle a maximum of 22 characters');
  await getAchievement(text, person);
  await message.channel.send({files: [{attachment: canvas.toBuffer(undefined, 3, canvas.PNG_FILTER_NONE), name: 'achievementGet.png'}]});
};

exports.conf = {
  hidden: false,
  aliases: ['get','achieveget', 'achievementget'],
  permLevel: 2
};

exports.help = {
  name: 'achievement',
  description: 'Creates a Discord Themed "Minecraft" Achievement.',
  usage: 'achievement [user|text]',
  category: 'Fun'
};
