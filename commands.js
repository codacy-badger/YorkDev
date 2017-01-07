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
  'tags': 'taglist',
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
    execute: function(client, message, args) {
      let sendhelp;
      let command = args[0];
      if (command) {
        if (!commands.hasOwnProperty(command)) return;
        sendhelp = [];
                                            sendhelp.push(`Name: ${commands[command].name}`);
        if (commands[command].alias)        sendhelp.push(`Alias: ${commands[command].alias}`);
                                            sendhelp.push(`Description: ${commands[command].description}`);
        if (commands[command].usage)        sendhelp.push(`Usage: ${commands[command].usage}`);
        if (commands[command].permissions)  sendhelp.push(`Permissions: ${commands[command].permissions}`);
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
    execute: function(client, message, args) {
      if (!message.member.roles.exists('name', 'Staff')) return;
      let name = args[0];
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
        if(!resp) return;
        resp = resp.array()[0];

        if (resp.content === 'cancel') return message.channel.sendMessage(`Aborting tag creation of \`${name}\`.`);
        return message.channel.sendMessage(`Created tag **\`${name}\`** with content:\n\`\`\`\n${resp.content}\n\`\`\``).then(() => {
          return sql.run('INSERT INTO tags (name, contents) VALUES (?, ?)', [name, resp.content]);
        }).then(() => {
          return message.channel.sendMessage(`A tag with the name ${name} has been added`);
        }).then(response => {
          return response.delete(5000);
        });
      }).catch(console.error);
    }
  },

  tag: {
    name: 'Tag',
    description: 'This is how you use the tags you create.',
    usage: config.prefix + 'tag <tag name>',
    alias: 't',
    execute: function(client, message, args) {
      sql.open('./tagsbot.sqlite').then(() => sql.get('SELECT * FROM tags WHERE name = ?', args[0])).then(row => {
        if (row) {
          let message_content = message.mentions.users.array().length === 1 ? `${message.mentions.users.array()[0]} ${row.contents}` : row.contents;
          return message.channel.sendMessage(message_content);
        } else {
          return message.channel.sendMessage(`A tag with the name **${args[0]}** could not be found.`).then(response => {
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
    execute: function(client, message, args) {
      if (!message.member.roles.exists('name', 'Staff')) return;
      sql.open('./tagsbot.sqlite').then(() => {
        return sql.run('DELETE FROM tags WHERE name = ?', args[0]);
      }).then(() => {
        return message.channel.sendMessage(`The tag **${args[0]}** has been deleted`)
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
    execute: function(client, message) {
      sql.open('./tagsbot.sqlite').then(() => sql.all('SELECT * FROM tags')).then(rows => {
        return message.channel.sendMessage(rows < 1 ? 'There appears to be no tags saved at this time.' : 'Tags: ' + rows.map(r => r.name).join(', '));
      }).catch(console.error);
    }
  },

};

const toTitleCase = (str) => {
  return str.replace(/\w\S*/g, function(txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
};

exports.toTitleCase = toTitleCase;
exports.aliases = aliases;
exports.commands = commands;
