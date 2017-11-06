const Social = require('../../base/Social.js');
const { Canvas } = require('canvas-constructor');
const snek = require('snekfetch');
const fsn = require('fs-nextra');

const getBeautiful = async (person) => {
  const plate = await fsn.readFile('./assets/images/plate_beautiful.png');
  const png = person.replace(/\.gif.+/g, '.png');
  const { body } = await snek.get(png);
  return new Canvas(634, 675)
    .setColor('#000000')
    .addRect(0, 0, 634, 675)
    .addImage(body, 423, 45, 168, 168)
    .addImage(body, 426, 382, 168, 168)
    .addImage(plate, 0, 0, 634, 675)
    .toBuffer();
};

class Beautiful extends Social {
  constructor(client) {
    super(client, {
      name: 'beautiful',
      description: 'Admire the beauty of another user.',
      category: 'Fun',
      usage: 'beautiful [@mention|user id]',
      extended: 'Mention another user to admire a painting of them.',
      cost: 5,
      botPerms: ['ATTACH_FILES'],
    });
  }
  async run(message, args, level) {
    try {
      let beautiful;
      if (!args[0]) beautiful = message.member;
      else beautiful = await this.verifyMember(message.guild, args[0]);
  
      const cost = this.cmdDis(this.help.cost, level);

      const payMe = await this.cmdPay(message, message.author.id, cost, this.conf.botPerms);
      if (!payMe) return;

      const msg = await message.channel.send('Gazing at the painting...');
  
      const result = await getBeautiful(beautiful.user.displayAvatarURL);
      await message.channel.send({ files: [{ attachment: result, name: 'beautiful.jpg' }] });
     
      await msg.delete();
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Beautiful;