const self = require('./app.js');
const sql = require('sqlite');
const config = require('./config.json');

const Pad = (str, l) => {
  return str + Array(l - str.length + 1).join(' ');
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
      let sendhelp = [];
      let command = args[0];
      if (command) {
        if (commands.hasOwnProperty(command)) {
          sendhelp.push(`Name: ${commands[command].name}`);
          if (commands[command].alias) {
            sendhelp.push(`Alias: ${commands[command].alias}`);
          }
          sendhelp.push(`Description: ${commands[command].description}`);
          if (commands[command].usage) {
            sendhelp.push(`Usage: ${commands[command].usage}`);
          }
          if (commands[command].permissions) {
            sendhelp.push(`Permissions: ${commands[command].permissions}`);
          }
          message.channel.sendCode('LDIF', sendhelp).catch(error => console.log(error));
        }
      } else {
        let toSend = '';
        let i = 0;
        let sortedKeys = Object.keys(commands);
        sortedKeys.sort();
        for (let key in sortedKeys) {
          if ((i % 3) == 0) {
            toSend += `\n${Pad(toTitleCase(sortedKeys[key]), 12)}`;
          } else {
            toSend += `${Pad(toTitleCase(sortedKeys[key]), 12)}`;
          }
          i++;
        }
        message.channel.sendCode('LDIF', `This is a list of commands available to you, to get more info just do ${config.prefix}help <command>\n ${toSend}`).catch(error => console.log(error));
      }
    }
  },

  reload: {
    name: 'Reload',
    description: 'This reloads all of the commands without having to reboot the bot.',
    usage: '',
    alias: 'r, rld',
    execute: function(client, message) {
      if (!message.member.roles.has(message.guild.roles.find('name', 'Staff').id)) return;
      self.reload(message);
    }
  },

  reboot: {
    name: 'Reboot',
    description: 'This will restart the bot.',
    usage: '',
    alias: '',
    execute: function(client, message) {
      if (!message.member.roles.has(message.guild.roles.find('name', 'Staff').id)) return;
      message.channel.sendMessage('Rebooting...').then(() => {
        process.exit();
      }).catch(error => console.log(error));
    }
  },

  addtag: {
    name: 'Add Tags',
    description: 'This will add a tag to the database, and it supports multiple lines as well!',
    usage: config.prefix + 'addtag <name>',
    alias: 'at',
    execute: function(client, message, args) {
      if (!message.member.roles.has(message.guild.roles.find('name', 'Staff').id)) return;
      let name = args[0];
      if (!name) return message.reply('You must give the tag a name.');
      sql.open('./tagsbot.sqlite').then(() => sql.get(`SELECT * FROM tags WHERE name = '${name}'`)).then(row => {
        if (row) return message.channel.sendMessage(`The tag **\`${name}\`** already exists, please choose a different name.`);
        message.channel.sendMessage(`Adding tag **\`${name}\`**, what would you like it to say?\n\nReply with \`cancel\` to abort the command. The command will self-abort in 30 seconds`);
        message.channel.awaitMessages(m => m.author.id === message.author.id, {
          'errors': ['time'],
          'max': 1,
          time: 30000
        })
          .then(resp => {
            resp = resp.array()[0];
            if (resp.content === 'cancel') return message.channel.sendMessage(`Aborting tag creation of \`${name}\`.`);
            message.channel.sendMessage(`Created tag **\`${name}\`** with content:\n\`\`\`\n${resp.content}\n\`\`\``)
              .then(msg => {
                sql.run('INSERT INTO tags (name, contents) VALUES (?, ?)', [name, resp.content]).then(() => {
                  message.channel.sendMessage(`A tag with the name ${name} has been added`).then(response => {
                    response.delete(5000);
                  });
                }).catch(error => console.log(error));
              });
          })
          .catch(err => message.channel.sendMessage('You failed to respond. Aborting tag creation.'));
      }).catch(error => console.log(error));
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
          message.channel.sendMessage(message_content);
        } else {
          message.channel.sendMessage(`A tag with the name **${args[0]}** could not be found.`).then(response => {
            response.delete(5000);
          });
        }
      }).catch(error => console.log(error));
    }
  },

  deltag: {
    name: 'Delete Tag',
    description: 'If you want to remove a tag this is the command for you!',
    usage: config.prefix + 'deltag <tag name>',
    alias: 'dt',
    execute: function(client, message, args) {
      if (!message.member.roles.has(message.guild.roles.find('name', 'Staff').id)) return;
      sql.open('./tagsbot.sqlite').then(() => {
        sql.run('DELETE FROM tags WHERE name = ?', args[0])
          .then(() => {
            message.channel.sendMessage(`The tag **${args[0]}** has been deleted`).then(response => {
              response.delete(5000);
            });
          })
          .catch(error => console.log(error));
      });
    }
  },

  taglist: {
    name: 'List Tags',
    description: 'Use this if you want to display all the tags that have been saved.',
    usage: config.prefix + 'taglist',
    alias: 'tags, tl',
    execute: function(client, message) {
      sql.open('./tagsbot.sqlite').then(() => sql.all('SELECT * FROM tags')).then(rows => {
        rows < 1 ? message.channel.sendMessage('There appears to be no tags saved at this time.').catch(error => console.log(error)) : message.channel.sendMessage('Tags: ' + rows.map(r => r.name).join(', ')).catch(error => console.log(error));
      }).catch(error => console.log(error));
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
