const sql = require('sqlite');
const config = require('../config.json');
exports.run = (client, message, args) => {
  let name = args.join(' ');
  if (!name) return message.reply('You must give the example a name.');
  sql.open('./tagsbot.sqlite').then(() => sql.get(`SELECT * FROM examples WHERE name = '${name}'`)).then(row => {
    if (row) return message.channel.sendMessage(`An example called **\`${name}\`** already exists, please choose a different name.`).then(() => null);

    message.channel.sendMessage(`Adding **\`${name}\`** example, what would you like it to be?\n\nReply with \`cancel\` to abort the command. The command will self-abort in 30 seconds`);
    return message.channel.awaitMessages(m => m.author.id === message.author.id, {
      'errors': ['time'],
      'max': 1,
      time: 30000
    });
  }).then(resp => {
    if (!resp) return;
    resp = resp.array()[0];

    if (resp.content === 'cancel') return message.channel.sendMessage(`Aborting example creation of \`${name}\`.`);

    return sql.run('INSERT INTO examples (name, contents, msgId) VALUES (?, ?, ?)', [name, resp.content, 'notset']).then(() => {
      return message.channel.sendMessage(`Created **\`${name}\`** example with content:\n\`\`\`js\n${resp.content}\n\`\`\``);
    }).then(() => {
      return client.channels.get(config.examplesChannel).sendMessage(`**EXAMPLE:** ${name}\n\`\`\`js\n${resp.content}\n\`\`\``).then(message => {
        sql.run(`UPDATE examples SET msgId = ${message.id} WHERE msgId = 'notset'`).catch(console.error);
      });
    }).catch(console.error);
  }).catch(console.error);
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ['addex', 'addexample'],
  permLevel: 2
};

exports.help = {
  name: 'exampleadd',
  description: 'Adds an example to the examples channel.',
  usage: 'exampleadd <name>'
};
