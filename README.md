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

- In the folder from where you ran the git command, run `cd York-Dev` and then run `npm install`, this will install all required packages, then it will run the installer.

- You will be prompted to supply a number of access tokens and keys for various platforms, please follow the on screen instructions to complete the installation.

>***NOTE:*** A config file will be created for you.

## Starting the bot

To start the bot, in the command prompt, run the following command:
`node app.js`

## Inviting to a guild

To add the bot to your guild, you have to get an OAuth link for it.

You can use this site to help you generate a full OAuth Link, which includes a calculator for the permissions:
[Permissions Calculator](https://finitereality.github.io/permissions-calculator/?v=0)

Discord now has his own permissions calculator and OAuth generator. Click [here for the OAuth generator](https://discordapp.com/developers/tools/oauth2-url-generator). Click on bot and you can select perms for the bot!
