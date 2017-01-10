const sql = require('sqlite');
exports.run = (client, message, args) => {
  let name = args.join(' ');
  if (!name) return message.reply('You must give the tag a name.');
  sql.open('./tagsbot.sqlite').then(() => sql.get(`SELECT * FROM tags WHERE name = '${name}'`)).then(row => {
    if (row) return message.channel.sendMessage(`The tag **\`${name}\`** already exists, please choose a different name.`).then(() => null);

    message.channel.sendMessage(`Adding tag **\`${name}\`**, what would you like it to say?\n\nReply with \`cancel\` to abort the command. The command will self-abort in 30 seconds`);
    return message.channel.awaitMessages(m => m.author.id === message.author.id, {
      'errors': ['time'],
      'max': 1,
      time: 30000
    });
  }).then(resp => {
    if (!resp) return;
    resp = resp.array()[0];
    if (resp.content === 'cancel') return message.channel.sendMessage(`Aborting tag creation of \`${name}\`.`);

    return sql.run('INSERT INTO tags (name, contents) VALUES (?, ?)', [name, resp.content]).then(() => {
      return message.channel.sendMessage(`Created tag **\`${name}\`** with content:\n\`\`\`\n${resp.content}\n\`\`\``);
    }).then(response => {
      return response.delete(10000);
    });

  }).catch(console.error);
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ['at'],
  permLevel: 2
};

exports.help = {
  name: 'addtag',
  description: 'Start the process of adding a tag to the database.',
  usage: 'addtag <name>'
};
