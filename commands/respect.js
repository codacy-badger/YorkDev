const Social = require('../base/Social.js');
const { Canvas } = require('canvas-constructor');
const snek = require('snekfetch');
const fsn = require('fs-nextra');

const giveRespect = async (person) => {
  const plate = await fsn.readFile('./assets/images/image_respects.png');
  const png = person.replace(/\.gif.+/g, '.png');
  const { body } = await snek.get(png);
  return new Canvas(720, 405)
    .addRect(0, 0, 720, 405)
    .setColor('#000000')
    .addImage(body, 110, 45, 90, 90)
    .restore()
    .addImage(plate, 0, 0, 720, 405)
    .toBuffer();
};

class Respect extends Social {
  constructor(client) {
    super(client, {
      name: 'respect',
      description: 'Pay respects to someone.',
      category: 'Fun',
      usage: 'respect [@mention|user id]',
      extended: 'You can pay respects to any user on Discord.',
      cost: 1,
      aliases: ['pressf', 'f', 'rip', 'ripme'],
      botPerms: ['SEND_MESSAGES', 'ATTACH_FILES'],
      permLevel: 'Patron'
    });
  }
  async run(message, args, level) {
    try {
      const cost = this.cmdDis(this.help.cost, level);
      const payMe = await this.cmdPay(message, message.author.id, cost, this.conf.botPerms);
      if (!payMe) return;  
      let target;
      
      if (!args[0]) target = message.author.id;
      else target = await this.verifyUser(args[0]);
      
      const msg = await message.channel.send('Paying respects...');
      const user = await this.client.fetchUser(target);
      await this.verifyUser(user);

      const result = await giveRespect(user.displayAvatarURL);
      await message.channel.send({ files: [{ attachment: result, name: 'paid-respects.png' }] });
      await msg.delete();
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Respect;