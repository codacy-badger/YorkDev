# York Dev

This bot serves as one of the backbones of the Idiot's Guide Community, using the community's [Guide Bot](https://github.com/An-Idiots-Guide/guidebot) as a base framework, York Dev expands on its functionalities with common error detection with solution, fun commands, as well as a tag and example command!

[![Codacy Badge](https://api.codacy.com/project/badge/Grade/74ebb8bd0ea246deb09ef8dcbb8bfe83)](https://www.codacy.com/app/YorkAARGH/York-Dev?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=YorkAARGH/York-Dev&amp;utm_campaign=Badge_Grade)

## Requirements

- `git` command line ([Windows](https://git-scm.com/download/win)|[Linux](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)|[MacOS](https://git-scm.com/download/mac)) installed
- `node` [Version 8.0.0 or higher](https://nodejs.org)
- `Cario` York Dev uses [canvas](https://www.npmjs.com/package/canvas), you will need to install all prerequisites for your operating system.

You also need your bot's token. This is obtained by creating an application in
the Developer section of discordapp.com. Check the [first section of this page](https://anidiots.guide/getting-started/the-long-version.html)
for more info.

## Installing Canvas Dependencies

OS | Command
----- | -----
OS X | `sudo brew install pkg-config cairo pango libpng jpeg giflib`
Ubuntu | `sudo apt-get install libcairo2-dev libjpeg8-dev libpango1.0-dev libgif-dev build-essential g++`
Fedora | `sudo yum install cairo cairo-devel cairomm-devel libjpeg-turbo-devel pango pango-devel pangomm pangomm-devel giflib-devel`
Solaris | `pkgin install cairo pango pkg-config xproto renderproto kbproto xextproto`
Windows | [Instructions on their wiki](https://github.com/Automattic/node-canvas/wiki/Installation---Windows)

## Downloading

In a command prompt in your project's folder (wherever that may be) run the following:

`git clone https://github.com/YorkAARGH/York-Dev.git`

Once finished:

- In the folder from where you ran the git command, run `cd York-Dev` and then run `npm install`
- Rename `config.js.example` to `config.js`
- Edit `config.js` and enter your token and other details as indicated. It should look something like this afterwards:

```js
const config = {
  // Bot Owner, level 10 by default. You no longer need to supply the owner ID, as the bot
  // will pull this information directly from it's application page.

  // Bot Admins, level 9 by default. Array of user ID strings.
  'admins': [],

  // Bot Support, level 8 by default. Array of user ID strings
  'support': [],

  // Your Bot's Token. Available on https://discordapp.com/developers/applications/me
  'token': 'mfa.VkO_2G4Qv3T--NO--lWetW_tjND--TOKEN--QFTm6YGtzq9PH--4U--tG0',

  'twitterUser': 'your-twitter-id', // Taken from http://gettwitterid.com/
  'twitChannel': 'your-channel-id', // Twitter Feed Channel

  // Make an app at https://apps.twitter.com/, and use those details here.
  'twitter':  {
    'consumer_key': '...',
    'consumer_secret': '...',
    'access_token': '...',
    'access_token_secret': '...'
  },


  'dashboard' : {
    'oauthSecret': 'your oauth secret from the app page',
    'callbackURL': 'http://localhost:3030/callback',
    'sessionSecret': 'enterasecrethere',
    'domain': 'localhost',
    'port': 3030
  },

  'botSettings' : {
    'afk': false,
    'afkMessage': 'is currently AFK, they will be back soon.',
    'botSupport': 'support-guild-id' // This is a guild ID for the support functionality.
  },

  // Default per-server settings. New guilds have these settings. 
  'defaultSettings' : {
    'prefix': '-',
    'modLogChannel': 'mod-log',
    'announceChannel': 'announcements',
    'patronRole': 'Patrons',
    'modRole': 'Moderator',
    'adminRole': 'Administrator',
    'levelNotice': 'false',
    'systemNotice': 'true',
    'inviteLimit': '10',
    'nmsEnabled': 'false',
    'nmsRate': '7500',
    'nmsBanCount': '10',
    'scoreTime': '5',
    'dailyTime': '24',
    'pointsReward': '250',
    'minPoints': '1',
    'maxPoints': '50',
    'costMulti': '10',
    'customEmoji': 'false',
    'gEmojiID': 'replace-this',
    'uEmoji': ''
  },

  // PERMISSION LEVEL DEFINITIONS.

  permLevels: [
    // This is the lowest permisison level, this is for non-roled users.
    { level: 0,
      name: 'User', 
      // Don't bother checking, just return true which allows them to execute any command their
      // level allows them to.
      check: () => true
    },

    // This is your patron permission level, the patron level should be below the staff roles.
    { level: 1,
      // This is the name of the role.
      name: 'Patron',
      // The following lines check the guild the message came from for the roles.
      // Then it checks if the member that authored the message has the role.
      // If they do return true, which will allow them to execute the command in question.
      // If they don't then return false, which will prevent them from executing the command.
      check: (message) => {
        try {
          const patronRole = message.guild.roles.find(r => r.name.toLowerCase() === message.settings.patronRole.toLowerCase());
          if (patronRole && message.member.roles.has(patronRole.id)) return true;
        } catch (e) {
          return false;
        }
      }
    },

    // This is your permission level, the staff levels should always be above the rest of the roles.
    { level: 2,
      // This is the name of the role.
      name: 'Moderator',
      // The following lines check the guild the message came from for the roles.
      // Then it checks if the member that authored the message has the role.
      // If they do return true, which will allow them to execute the command in question.
      // If they don't then return false, which will prevent them from executing the command.
      check: (message) => {
        try {
          const modRole = message.guild.roles.find(r => r.name.toLowerCase() === message.settings.modRole.toLowerCase());
          if (modRole && message.member.roles.has(modRole.id)) return true;
        } catch (e) {
          return false;
        }
      }
    },

    { level: 3,
      name: 'Administrator', 
      check: (message) => {
        try {
          const adminRole = message.guild.roles.find(r => r.name.toLowerCase() === message.settings.adminRole.toLowerCase());
          return (adminRole && message.member.roles.has(adminRole.id));
        } catch (e) {
          return false;
        }
      }
    },
    // This is the server owner.
    { level: 4,
      name: 'Server Owner', 
      // Simple check, if the guild owner id matches the message author's ID, then it will return true.
      // Otherwise it will return false.
      check: (message) => message.channel.type === 'text' ? (message.guild.owner.user.id === message.author.id ? true : false) : false
    },

    // Bot Support is a special inbetween level that has the equivalent of server owner access
    // to any server they joins, in order to help troubleshoot the bot on behalf of owners.
    { level: 8,
      name: 'Bot Support',
      // The check is by reading if an ID is part of this array. Yes, this means you need to
      // change this and reboot the bot to add a support user. Make it better yourself!
      check: (message) => config.support.includes(message.author.id)
    },

    // Bot Admin has some limited access like rebooting the bot or reloading commands.
    { level: 9,
      name: 'Bot Admin',
      check: (message) => config.admins.includes(message.author.id)
    },

    // This is the bot owner, this should be the highest permission level available.
    // The reason this should be the highest level is because of dangerous commands such as eval
    // or exec (if the owner has that).
    { level: 10,
      name: 'Bot Owner', 
      // Another simple check, compares the message author id to the one stored in the config file.
      check: (message) => message.client.appInfo.owner.id === message.author.id
    }
  ]
};

module.exports = config;
```

## Starting the bot

To start the bot, in the command prompt, run the following command:
`node app.js`

## Inviting to a guild

To add the bot to your guild, you have to get an OAuth link for it.

You can use this site to help you generate a full OAuth Link, which includes a calculator for the permissions:
[Permissions Calculator](https://finitereality.github.io/permissions-calculator/?v=0)

Discord now has his own permissions calculator and OAuth generator. Click [here for the OAuth generator](https://discordapp.com/developers/tools/oauth2-url-generator). Click on bot and you can select perms for the bot!
