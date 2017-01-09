const self = require('./app.js');
const sql = require('sqlite');
const config = require('./config.json');

const Pad = (str, l) => {
  return str + ' '.repeat(l - str.length + 1);
};

const aliases = {
  'h': 'help',
  't': 'tag',
  'r': 'reload',
  'tl': 'taglist',
  'at': 'addtag',
  'dt': 'deltag',
  'rld': 'reload',
  'aex': 'addexample',
  'dex': 'delexample',
  'tags': 'taglist',
  'addex': 'addexample',
  'delex': 'delexample',
  'examples': 'examplelist'
};

var commands = {

  // cmdname: {
  // 	name: '',
  // 	description: '',
  // 	usage: '',
  // 	alias: '',
  // 	execute: function(client, message){
  //
  // 	}
  // },

  help: {
    name: 'Help',
    description: 'This will bring up information about the commands you want help with.',
    usage: config.prefix + 'help <command>',
    alias: 'h',
    permissions: ['SEND_MESSAGES'],
    execute: function(client, message, args) {
      let sendhelp;
      let command = args.join(' ');
      if (command) {
        if (!commands.hasOwnProperty(command)) return;
        sendhelp = [];
        sendhelp.push(`Name: ${commands[command].name}`);
        if (commands[command].alias) sendhelp.push(`Alias: ${commands[command].alias}`);
        sendhelp.push(`Description: ${commands[command].description}`);
        if (commands[command].usage) sendhelp.push(`Usage: ${commands[command].usage}`);
        if (commands[command].permissions) sendhelp.push(`Permissions: ${commands[command].permissions}`);
      } else {
        sendhelp = `This is a list of commands available to you, to get more info just do ${config.prefix}help <command>\n`;
        let i = 0;
        let sortedKeys = Object.keys(commands);
        sortedKeys.sort();
        for (let key in sortedKeys) {
          if ((i % 3) === 0) {
            sendhelp += `\n${Pad(toTitleCase(sortedKeys[key]), 12)}`;
          } else {
            sendhelp += `${Pad(toTitleCase(sortedKeys[key]), 12)}`;
          }
          i++;
        }
      }
      message.channel.sendCode('LDIF', sendhelp).catch(console.error);
    }
  },

  reload: {
    name: 'Reload',
    description: 'This reloads all of the commands without having to reboot the bot.',
    usage: '',
    alias: 'r, rld',
    execute: function(client, message) {
      if (!message.member.roles.exists('name', 'Staff')) return;
      self.reload(message);
    }
  },

  reboot: {
    name: 'Reboot',
    description: 'This will restart the bot.',
    usage: '',
    alias: '',
    execute: function(client, message) {
      if (!message.member.roles.exists('name', 'Staff')) return;
      message.channel.sendMessage('Rebooting...').then(() => {
        process.exit();
      }).catch(console.error);
    }
  },

  addtag: {
    name: 'Add Tags',
    description: 'This will add a tag to the database, and it supports multiple lines as well!',
    usage: config.prefix + 'addtag <name>',
    alias: 'at',
    permissions: ['SEND_MESSAGES'],
    execute: function(client, message, args) {
      if (!message.member.roles.exists('name', 'Staff')) return;
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
    }
  },

  tag: {
    name: 'Tag',
    description: 'This is how you use the tags you create.',
    usage: config.prefix + 'tag <tag name>',
    alias: 't',
    permissions: ['SEND_MESSAGES'],
    execute: function(client, message, args) {
      sql.open('./tagsbot.sqlite').then(() => sql.get('SELECT * FROM tags WHERE name = ?', args.join(' '))).then(row => {
        if (row) {
          let message_content = message.mentions.users.array().length === 1 ? `${message.mentions.users.array()[0]} ${row.contents}` : row.contents;
          return message.channel.sendMessage(message_content);
        } else {
          return message.channel.sendMessage(`A tag with the name **${args.join(' ')}** could not be found.`).then(response => {
            return response.delete(5000);
          });
        }
      }).catch(console.error);
    }
  },

  deltag: {
    name: 'Delete Tag',
    description: 'If you want to remove a tag this is the command for you!',
    usage: config.prefix + 'deltag <tag name>',
    alias: 'dt',
    permissions: ['SEND_MESSAGES'],
    execute: function(client, message, args) {
      if (!message.member.roles.exists('name', 'Staff')) return;
      sql.open('./tagsbot.sqlite').then(() => {
        return sql.run('DELETE FROM tags WHERE name = ?', args.join(' '));
      }).then(() => {
        return message.channel.sendMessage(`The tag **${args.join(' ')}** has been deleted`);
      }).then(response => {
        return response.delete(5000);
      }).catch(console.error);
    }
  },

  taglist: {
    name: 'List Tags',
    description: 'Use this if you want to display all the tags that have been saved.',
    usage: config.prefix + 'taglist',
    alias: 'tags, tl',
    permissions: ['SEND_MESSAGES'],
    execute: function(client, message) {
      sql.open('./tagsbot.sqlite').then(() => sql.all('SELECT * FROM tags')).then(rows => {
        return message.channel.sendMessage(rows < 1 ? 'There appears to be no tags saved at this time.' : '**❯ Tags: **' + rows.map(r => r.name).join(', '));
      }).catch(console.error);
    }
  },

  addexample: {
    name: 'Add Example',
    description: 'This will add a tag to the database, and it supports multiple lines as well!',
    usage: config.prefix + 'addexample <name>',
    alias: 'aex, addex',
    permissions: ['SEND_MESSAGES'],
    execute: function(client, message, args) {
      if (!message.member.roles.exists('name', 'Staff')) return;
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
    }
  },

  delexample: {
    name: 'Delete Example',
    description: 'Use this command when you want to remove an example.',
    usage: config.prefix + 'delexample <name>',
    alias: 'dex, delex',
    permissions: ['SEND_MESSAGES'],
    execute: function(client, message, args) {
      let name = args.join(' ');
      if (!message.member.roles.exists('name', 'Staff')) return;
      sql.open('./tagsbot.sqlite').then(() => sql.get('SELECT * FROM examples WHERE name = ?', name)).then(row => {
        client.channels.get(config.examplesChannel).fetchMessage(row.msgId).then(msg => msg.delete()).then(() => {
          return sql.run('DELETE FROM examples WHERE name = ?', name);
        }).then(() => {
          return message.channel.sendMessage(`The **${name}** example has been deleted`);
        }).then(response => {
          return response.delete(5000);
        }).catch(console.error);
      });
    }
  },

  examplelist: {
    name: 'List Examples',
    description: 'Use this if you want to display all the tags that have been saved.',
    usage: config.prefix + 'examplelist',
    alias: 'examples',
    permissions: ['SEND_MESSAGES'],
    execute: function(client, message) {
      sql.open('./tagsbot.sqlite').then(() => sql.all('SELECT * FROM examples')).then(rows => {
        return message.channel.sendMessage(rows < 1 ? 'There appears to be no tags saved at this time.' : '**❯ Examples: **' + rows.map(r => r.name).join(', '));
      }).catch(console.error);
    }
  }
};

const toTitleCase = (str) => {
  return str.replace(/\w\S*/g, function(txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
};

exports.toTitleCase = toTitleCase;
exports.aliases = aliases;
exports.commands = commands;
