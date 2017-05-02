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
        if (!newName) return message.channel.sendMessage('You must give the tag a name.');
        try {
          let row = await sql.get(`SELECT * FROM tags WHERE name = '${newName}'`);
          if (row) return message.channel.sendMessage(`The tag **\`${newName}\`** already exists, please choose a different name.`);
          await message.reply(`Adding tag **\`${newName}\`**, what would you like it to say?\n\nRespond with \`cancel\` to cancel the command. The command will automatically be cancelled in 30 seconds.`);
          let resp = await message.channel.awaitMessages(m => m.author.id === message.author.id, {
            'errors': ['time'],
            'max': 1,
            time: 30000
          });
          if (!resp) return;
          resp = resp.array()[0];
          if (resp.content === 'cancel') return message.channel.sendMessage(`Aborting tag creation of \`${newName}\`.`);
          await sql.run('INSERT INTO tags (name, contents) VALUES (?, ?)', [newName, resp.content]);
          return message.channel.sendMessage(`Created tag **\`${newName}\`** with content:\n\`\`\`\n${resp.content}\n\`\`\``);
        } catch (error) {
          console.error(error);
        }
        break;
      }
    case 1:
      {
        try {
          const row = await sql.get(`SELECT * FROM tags WHERE name = '${newName}'`);
          if (!row) return message.channel.sendMessage(`A tag with the name **${newName}** could not be found.`);
          await sql.run('DELETE FROM tags WHERE name = ?', newName);
          await message.channel.sendMessage(`The tag **${newName}** has been deleted`);
        } catch (error) {
          console.error(error);
        }
        break;
      }
    case 2:
      {
        try {
          const rows = await sql.all('SELECT * FROM tags');
          await message.channel.sendMessage(rows < 1 ? 'There appears to be no tags saved at this time.' : '**❯ Tags: **' + rows.map(r => r.name).join(', '));
        } catch (error) {
          console.error(error);
        }
        break;
      }
    default:
      {
        try {
          let row = await sql.get('SELECT * FROM tags WHERE name = ?', name);
          await message.channel.sendMessage(row.contents);
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
  aliases: ['t'],
  permLevel: 0
};

exports.help = {
  name: 'tag',
  description: 'Displays an tag.',
  usage: 'tag <name>'
};
