exports.run = async(client, message, args) => {
  const permission = client.elevation(message);
  let name = args.join(' ');
  let newName = name.split(' ').slice(1).join(' ');
  let flag = ['-add', '-edit', '-del', '-list'];
  let a = flag.indexOf(args[0]);
  switch (a) {
    case 0:
      {
        if (permission < 2) return;
        if (!newName) return message.channel.send('You must give the example a name.');
        try {
          let row = await client.sql.get(`SELECT * FROM examples WHERE name = '${newName}'`);
          if (row) return message.channel.send(`The example **\`${newName}\`** already exists, please choose a different name.`);
          await message.reply(`Adding example **\`${newName}\`**, what would you like it to say?\n\nRespond with \`cancel\` to cancel the command. The command will automatically be cancelled in 30 seconds.`);
          let resp = await message.channel.awaitMessages(m => m.author.id === message.author.id, {
            'errors': ['time'],
            'max': 1,
            time: 30000
          });
          if (!resp) return;
          resp = resp.array()[0];
          if (resp.content === 'cancel') return message.channel.send(`Aborting example creation of \`${newName}\`.`);
          await client.sql.run('INSERT INTO examples (name, contents) VALUES (?, ?)', [newName, resp.content]);
          return message.channel.send(`Created example **\`${newName}\`** with content:\n\`\`\`\n${resp.content}\n\`\`\``);
        } catch (error) {
          console.error(error);
        }
        break;
      }
    case 1:
      {
        if (permission < 2) return;
        try {
          if (!newName) return message.reply('You must name an existing example to edit..');
          let row = await client.sql.get(`SELECT * FROM examples WHERE name = '${newName}'`);
          if (!row) return message.channel.send(`An example by the name **${newName}** could not be found.`);
          await message.channel.send(`Editing **\`${newName}\`** example, what would you like it to be?\n\nReply with \`cancel\` to abort the command. The command will self-abort in 30 seconds`);
          let resp = await message.channel.awaitMessages(m => m.author.id === message.author.id, {
            'errors': ['time'],
            'max': 1,
            time: 30000
          });
          if (!resp) return;
          resp = resp.array()[0];
          if (resp.content === 'cancel') return message.channel.send(`Aborting update of \`${newName}\` example.`);
          let nRow = await client.sql.get(`SELECT * FROM examples WHERE name = '${newName}'`);
          if (nRow) await client.sql.run(`UPDATE examples SET contents = "${resp.content}" WHERE id = ${nRow['id']}`);
          return await message.channel.send(`Updated **\`${newName}\`** example with content:\n\`\`\`js\n${resp.content}\n\`\`\``);
        } catch (error) {
          console.log(error);
        }
        break;
      }
    case 2:
      {
        if (permission < 2) return;
        try {
          const row = await client.sql.get(`SELECT * FROM examples WHERE name = '${newName}'`);
          if (!row) return message.channel.send(`An example with the name **${newName}** could not be found.`);
          await client.sql.run('DELETE FROM examples WHERE name = ?', newName);
          await message.channel.send(`The example **${newName}** has been deleted`);
        } catch (error) {
          console.error(error);
        }
        break;
      }
    case 3: {
      try {
        const rows = await client.sql.all('SELECT * FROM examples');
        await message.channel.send(rows < 1 ? 'There appears to be no examples saved at this time.' : '**❯ examples: **' + rows.map(r => r.name).join(', '));
      } catch (error) {
        console.error(error);
      }
      break;
    }
    default:
      {
        try {
          let row = await client.sql.get('SELECT * FROM examples WHERE name = ?', name);
          await message.channel.send(row.contents, {code:'js'});
        } catch (error) {
          console.error(error);
          if (!newName) return message.channel.send('You must name an example to display.');
          await message.reply(`An example by the name **${name}** could not be found.`);
        }
        break;
      }
  }
};

exports.conf = {
  aliases: [],
  permLevel: 0
};

exports.help = {
  name: 'example',
  description: 'Displays an example.',
  usage: 'example [-add|-edit|-del|-list] [name]',
  category: 'examples'
};
