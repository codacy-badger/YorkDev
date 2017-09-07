# York Dev
This bot serves as one of the backbones of the Idiot's Guide Community, using the communities [Guide Bot](https://github.com/An-Idiots-Guide/guidebot) as a base framework, York Dev expands on it's functionalities with common error detection with solution, fun commands, as well as a tag and example command!

[![Codacy Badge](https://api.codacy.com/project/badge/Grade/aecd644228534158bbdcc94064b3da75)](https://www.codacy.com/app/YorkAARGH/York-Dev?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=YorkAARGH/York-Dev&amp;utm_campaign=Badge_Grade)

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
OS X | `brew install pkg-config cairo pango libpng jpeg giflib`
Ubuntu | `sudo apt-get install libcairo2-dev libjpeg8-dev libpango1.0-dev libgif-dev build-essential g++`
Fedora | `sudo yum install cairo cairo-devel cairomm-devel libjpeg-turbo-devel pango pango-devel pangomm pangomm-devel giflib-devel`
Solaris | `pkgin install cairo pango pkg-config xproto renderproto kbproto xextproto`
Windows | [Instructions on their wiki](https://github.com/Automattic/node-canvas/wiki/Installation---Windows)


## Downloading

In a command prompt in your projects folder (wherever that may be) run the following:

`git clone https://github.com/YorkAARGH/York-Dev.git`

Once finished:

- In the folder from where you ran the git command, run `cd York-Dev` and then run `npm install`
- Rename `config_example.json` to `config.json`
- Edit `config.json` and enter your token and other details as indicated. It should look something like this afterwards:

```json
{
  "ownerId": ["146048938242211840","203089110397747200"],
  "token": "NO TOKEN FOR YOU",
  "defaultSettings" : {
    "prefix": "?",
    "afk": "false",
    "afkMessage": "is currently AFK, they will be back soon.",
    "social": "false",
    "modLogChannel": "mod-log",
    "modRole": "The Idiot's Staff",
    "adminRole": "Admin"
  }
}
```

## Starting the bot

To start the bot, in the command prompt, run the following command:
`node app.js`

## Inviting to a guild

To add the bot to your guild, you have to get an oauth link for it.

You can use this site to help you generate a full OAuth Link, which includes a calculator for the permissions:
[Permissions Calculator](https://finitereality.github.io/permissions-calculator/?v=0)
