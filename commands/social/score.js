const Social = require('../../base/Social.js');
const { Canvas } = require('canvas-constructor');
const snek = require('snekfetch');
const { resolve, join } = require('path');
const fsn = require('fs-nextra');
Canvas.registerFont(resolve(join(__dirname, '../../assets/fonts/FiraCode-Bold.ttf')), 'FiraCode');

const getProfile = async (user, person, points, level) => {
  const plate = await fsn.readFile('./assets/images/image_profile.png');
  const png = person.replace(/\.(gif|jpg|png|jpeg)\?size=2048/g, '.png?size=64');
  const { body } = await snek.get(png);
  const size = new Canvas(270, 90)
    .setTextFont('12pt FiraCode')
    .measureText(user);
  const newSize = size.width < 180 ? 270 : 90 + size.width + 10;
  return new Canvas(newSize, 90)
    .setColor('#FFFFFF')
    .addRect(0, 0, newSize, 90)
    .setColor('#383838')
    .addRect(12, 15, 64, 64)
    .setColor('#000000')
    .setTextFont('12pt FiraCode')
    .addImage(body, 14, 17, 62, 62)
    .restore()
    .addImage(plate, 0, 0, 270, 90)
    .addText(user, 90, 29)
    .addText(level, 172, 51)
    .addText(points, 172, 72)
    .toBuffer();
};

class Score extends Social {
  constructor(client) {
    super(client, {
      name: 'score',
      description: 'Displays your current level and points.',
      usage: 'score',
      category: 'Social',
      cost: 0,
      aliases: ['points', 'level', 'bal', 'balance'],
      botPerms: []
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars
    let target;
    if (!args[0]) target = message.author.id;
    else target = await this.verifySocialUser(args[0]);

    const user = await this.client.fetchUser(target);
    await this.verifyUser(user);

    const score = this.client.points.get(`${message.guild.id}-${target}`) || this.client.points.set(`${message.guild.id}-${target}`, { points: 0, level: 0, user: target,guild: message.guild.id, daily: 1504120109 }).get(`${message.guild.id}-${target}`);
    const pLevel = this.ding(message.guild.id, score);
    const result = await getProfile(user.tag, user.displayAvatarURL, score.points, pLevel);
    await message.channel.send({ files: [{ attachment: result, name: 'profile.png' }] });
  }
}

module.exports = Score;