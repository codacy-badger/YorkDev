const Command = require('../../base/Command.js');
const ms = require('ms');

function regCheck(reminder) {
  const remind = /([0-9]{1,3}) (seconds|second|minutes|minute|hours|hour|days|day|weeks|week|months|month|years|year)/g.exec(reminder);
  if (!remind) return false;
  const time = remind[0];
  const input = remind.input
    .replace(/\b(in|me|to)\b/g, '')
    .replace(remind[0], '')
    .replace(/ +/, '');
  if (input.length === 0) return false;
  return `${input}#${time}`;
}

class Reminder extends Command {
  constructor(client) {
    super(client, {
      name: 'reminder',
      description: 'Remind yourself with this command.',
      category: 'Utilities',
      usage: 'reminder [me] <reminder message>',
      extended: 'Need to be reminded to take the trash out? This command can help!',
      aliases: ['remember', 'remind'],
      botPerms: ['SEND_MESSAGES']
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars
    try {
      const blah = await regCheck(args.join(' '));
      if (!blah) throw '|`❌`| Invalid Command usage, you must supply a reminder message and duration e.g; `Do the laundry in 20 minutes`.';
      this.client.reminders.set(`${message.author.id}-${message.createdTimestamp + ms(blah.split('#')[1])}`, {
        id: message.author.id,
        reminder: blah.split('#')[0],
        reminderTimestamp: message.createdTimestamp + ms(blah.split('#')[1])
      });
      
      message.channel.send(`I will remind you to \`${blah.split('#')[0]}\`, ${blah.split('#')[1]} from now.`);

      // setTimeout(async () => {
      //   message.author.send(`Here is your reminder: ${blah.split('#')[0]}`);
      //   const reminder = this.client.reminders.find('id', `${message.author.id}-${message.guild.id}`);
      //   this.client.reminders.delete(`${message.author.id}-${reminder.reminderTimestamp}`);
      // }, ms(blah.split('#')[1]));
  
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Reminder;
