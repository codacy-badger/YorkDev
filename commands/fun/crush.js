const Social = require('../../base/Social.js');
const { Canvas } = require('canvas-constructor');
const snek = require('snekfetch');
const fsn = require('fs-nextra');

const getCrushped = async (crusher, crush) => {
  const pngCrusher = crusher.replace(/\.gif.+/g, '.png');
  const pngCrush = crush.replace(/\.gif.+/g, '.png');
  const [ plate, Crusher, Crush ] = await Promise.all([
    fsn.readFile('./assets/images/plate_crush.png'),
    snek.get(pngCrusher),
    snek.get(pngCrush),
  ]);
  return new Canvas(600, 873)
    .rotate(-0.09)
    .addImage(Crush.body, 109, 454, 417, 417)
    .resetTransformation()
    .addImage(plate, 0, 0, 600, 873)
    .addImage(Crusher.body, 407, 44, 131, 131, { type: 'round', radius: 66 })
    .restore()
    .toBuffer();
};

class Crush extends Social {
  constructor(client) {
    super(client, {
      name: 'crush',
      description: '',
      category: 'Fun',
      usage: 'crush [@mention|userid]',
      extended: '',
      cost: 1,
      cooldown: 10,
      botPerms: ['ATTACH_FILES'],
      permLevel: 'Patron'
    });
  }
  async run(message, args, level) {
    try {
      const crush = await this.verifyUser(args[0] ? args[0] : message.author.id);
      const crusher = message.author;
      const cost = this.cmdDis(this.help.cost, level);
      const payMe = await this.cmdPay(message, message.author.id, cost, this.conf.botPerms);
      if (!payMe) return;  
      const msg = await message.channel.send(`Gazing at ${crush.username}...`);

      const result = await getCrushped(crusher.displayAvatarURL, crush.displayAvatarURL);
      await message.channel.send({ files: [{ attachment: result, name: 'crush.png' }] });
      await msg.delete();
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Crush;