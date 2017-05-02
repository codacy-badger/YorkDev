const config = require('../config.json');
const sql = require('sqlite');
sql.open('./tagsbot.sqlite');
exports.run = async(client, message, args) => {
  let name = args.join(' ');
  let newName = name.split(' ').slice(1).join(' ');
  let flag = ['-add', '-del', '-list'];
  let a = flag.indexOf(args[0]);
  switch (a) {
    case 0:
      {
        if (!newName) return message.channel.sendMessage('You must give the example a name.');
        try {
          let row = await sql.get(`SELECT * FROM examples WHERE name = '${newName}'`);
          if (row) return message.channel.sendMessage(`An example by **\`${newName}\`** already exists, please choose a different name.`);
          await message.reply(`Adding example **\`${newName}\`**, what would you like it to be?\n\nReply with \`cancel\` to abort the command. The command will self-abort in 30 seconds`);
          let resp = await message.channel.awaitMessages(m => m.author.id === message.author.id, {
            'errors': ['time'],
            'max': 1,
            time: 30000
          });
          if (!resp) return;
          resp = resp.array()[0];
          if (resp.content === 'cancel') return message.channel.sendMessage(`Aborting \`${newName}\` example creation.`);
          let post = await client.channels.get(config.exampleChannel).sendMessage(`**EXAMPLE:** ${newName}\n\`\`\`js\n${resp.content}\n\`\`\``);
          await sql.run('INSERT INTO examples (name, contents, msgId) VALUES (?, ?, ?)', [newName, resp.content, post.id]);
          return message.channel.sendMessage(`Created example **\`${newName}\`** with content:\n\`\`\`\n${resp.content}\n\`\`\``);
        } catch (error) {
          console.error(error);
        }
        break;
      }
    case 1:
      {
        try {
          console.log(newName);
          const row = await sql.get('SELECT * FROM examples WHERE name = ?', newName);
          if (!row) return message.channel.sendMessage(`An example with the name **${newName}** could not be found.`);
          await client.channels.get(config.exampleChannel).fetchMessage(row.msgId).then(msg => msg.delete());
          await sql.run('DELETE FROM examples WHERE name = ?', newName);
          return message.channel.sendMessage(`The **${newName}** example has been deleted`);
        } catch (error) {
          console.error(error);
        }
        break;
      }
    case 2:
      {
        try {
          const rows = await sql.all('SELECT * FROM examples');
          return await message.channel.sendMessage(rows < 1 ? 'There appears to be no examples saved at this time.' : '**❯ Examples: **' + rows.map(r => r.name).join(', '));
        } catch (error) {
          console.error(error);
        }
        break;
      }
    default:
      {
        try {
          let row = await sql.get('SELECT * FROM examples WHERE name = ?', name);
          await message.channel.sendCode('js', row.contents);
        } catch (error) {
          console.error(error);
          await message.reply(`An example by the name **${name}** could not be found.`);
        }
        break;
      }
  }
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ['examp'],
  permLevel: 0
};

exports.help = {
  name: 'example',
  description: 'Displays an example.',
  usage: 'example <name>'
};
