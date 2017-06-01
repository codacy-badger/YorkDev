exports.run = async(client, message, args) => {
  const permission = client.elevation(message);
  let name = args.join(' ');
  let newName = name.split(' ').slice(1).join(' ').toLowerCase();
  let flag = ['-add', '-edit', '-del', '-list'];
  let a = flag.indexOf(args[0]);
  switch (a) {
    case 0:
      {
        if (permission < 2) return;
        if (!newName) return message.channel.send('You must give the tag a name.');
        try {
          let row = await client.sql.get(`SELECT * FROM tags WHERE name = '${newName}'`);
          if (row) return message.channel.send(`The tag **\`${newName}\`** already exists, please choose a different name.`);
          await message.reply(`Adding tag **\`${newName}\`**, what would you like it to say?\n\nRespond with \`cancel\` to cancel the command. The command will automatically be cancelled in 30 seconds.`);
          let resp = await message.channel.awaitMessages(m => m.author.id === message.author.id, {
            'errors': ['time'],
            'max': 1,
            time: 30000
          });
          if (!resp) return;
          resp = resp.array()[0];
          if (resp.content === 'cancel') return message.channel.send(`Aborting tag creation of \`${newName}\`.`);
          await client.sql.run('INSERT INTO tags (name, contents) VALUES (?, ?)', [newName, resp.content]);
          return message.channel.send(`Created tag **\`${newName}\`** with content:\n\`\`\`\n${resp.content}\n\`\`\``);
        } catch (error) {
          console.error(error);
        }
        break;
      }
    case 1:
      {
        if (permission < 2) return;
        try {
          if (!newName) return message.reply('You must name an existing tag to edit..');
          let row = await client.sql.get(`SELECT * FROM tags WHERE name = '${newName}'`);
          if (!row) return message.channel.send(`A tag by the name **${newName}** could not be found.`);
          await message.channel.send(`Editing **\`${newName}\`** tag, what would you like it to be?\n\nReply with \`cancel\` to abort the command. The command will self-abort in 30 seconds`);
          let resp = await message.channel.awaitMessages(m => m.author.id === message.author.id, {
            'errors': ['time'],
            'max': 1,
            time: 30000
          });
          if (!resp) return;
          resp = resp.array()[0];
          if (resp.content === 'cancel') return message.channel.send(`Aborting update of \`${newName}\` tag.`);
          let nRow = await client.sql.get(`SELECT * FROM tags WHERE name = '${newName}'`);
          if (nRow) await client.sql.run(`UPDATE tags SET contents = "${resp.content}" WHERE id = ${nRow['id']}`);
          return await message.channel.send(`Updated **\`${newName}\`** tag with content:\n\`\`\`js\n${resp.content}\n\`\`\``);
        } catch (error) {
          console.log(error);
        }
        break;
      }
    case 2:
      {
        if (permission < 2) return;
        try {
          const row = await client.sql.get(`SELECT * FROM tags WHERE name = '${newName}'`);
          if (!row) return message.channel.send(`A tag with the name **${newName}** could not be found.`);
          await client.sql.run('DELETE FROM tags WHERE name = ?', newName);
          await message.channel.send(`The tag **${newName}** has been deleted`);
        } catch (error) {
          console.error(error);
        }
        break;
      }
    case 3: {
      try {
        const rows = await client.sql.all('SELECT * FROM tags');
        await message.channel.send(rows < 1 ? 'There appears to be no tags saved at this time.' : '**❯ Tags: **' + rows.map(r => r.name).join(', '));
      } catch (error) {
        console.error(error);
      }
      break;
    }
    default:
      {
        try {
          let row = await client.sql.get('SELECT * FROM tags WHERE name = ?', name);
          await message.channel.send(row.contents);
        } catch (error) {
          console.error(error);
          if (!newName) return message.channel.send('You must name a tag to display.');
          await message.reply(`A tag by the name **${name}** could not be found.`);
        }
        break;
      }
  }
};

exports.conf = {
  aliases: ['t'],
  permLevel: 0
};

exports.help = {
  name: 'tag',
  description: 'Displays an tag.',
  usage: 'tag [-add|-edit|-del|-list] [name]',
  category: 'Tags'
};
