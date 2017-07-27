exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars
  try {
    const commandUnloads = client.commands.filter(c => !!c.db).array();
    for (const c of commandUnloads) {
      await c.db.close();
    }
    await client.destroy();
    process.exit();
  } catch (e) {
    console.log(e);
  }
};

exports.conf = {
  hidden: false,
  aliases: ['restart'],
  permLevel: 10
};

exports.help = {
  name: 'reboot',
  description: 'This reboots the bot.',
  usage: 'reboot',
  category: 'System'
};
