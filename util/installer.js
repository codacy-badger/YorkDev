/* eslint-disable quotes */

const inquirer = require("inquirer");
const Enmap = require("enmap");
const EnmapLevel = require("enmap-level");
const fs = require("fs");

let baseConfig = fs.readFileSync("./util/base.txt", "utf8");

const defaultSettings = `{
  "prefix": "-",
  "modLogChannel": "mod-log",
  "announceChannel": "announcements",
  "modRole": "Moderator",
  "adminRole": "Administrator",
  "systemNotice": "true",
  "inviteLimit": "10",
  "nmsEnabled": "false",
  "nmsRate": "7500",
  "nmsBanCount": "10"
}`;

const settings = new Enmap({provider: new EnmapLevel({name: "settings"})});

let prompts = [
  {
    type: "list", 
    name: "resetDefaults", 
    message: "Do you want to reset default settings?", 
    choices: ["Yes", "No"]
  },
  {
    type: "input",
    name: "token",
    message: "Please enter the bot token from the application page. (https://discordapp.com/developers/applications/me)"
  },
  {
    type: "input",
    name: "twitUserID",
    message: "Please enter the Twitter User ID, You can fetch the twitter user ID\"s from http://gettwitterid.com/"
  },
  {
    type: "input",
    name: "twitChanID",
    message: "Please enter the channel ID from your Discord Server."
  },
  {
    type: "input",
    name: "twitKey",
    message: "Please enter the Twitter Consumer Key, you can get one by creating an app at https://apps.twitter.com/, and use those details for the following 3 questions."
  },
  {
    type: "input",
    name: "twitSec",
    message: "Please enter the Twitter Consumer Secret."
  },
  {
    type: "input",
    name: "twitAcc",
    message: "Please enter the Twitter Access Token."
  },
  {
    type: "input",
    name: "twitAccSec",
    message: "Please enter the Twitter Access Token Secret."
  }
];

(async function() {
  console.log("Setting Up York-Dev Configuration...");
  await settings.defer;
  if (!settings.has("default")) {
    prompts = prompts.slice(1);
    console.log("First Start! Inserting default guild settings in the database...");
    await settings.setAsync("default", defaultSettings);
  }

  const answers = await inquirer.prompt(prompts);

  if (answers.resetDefaults && answers.resetDefaults === "Yes") {
    console.log("Resetting default guild settings...");
    await settings.setAsync("default", defaultSettings);
  }

  baseConfig = baseConfig
    .replace("{{token}}", `"${answers.token}"`)
    .replace("{{twitter-user-id}}", `"${answers.twitUserID}"`)
    .replace("{{twitter-channel-id}}", `"${answers.twitChanID}"`)
    .replace("{{twitter-key}}", `"${answers.twitKey}"`)
    .replace("{{twitter-secret}}", `"${answers.twitSec}"`)
    .replace("{{twitter-access}}", `"${answers.twitAcc}"`)
    .replace("{{twitter-access-secret}}", `"${answers.twitAccSec}"`);
    
  fs.writeFileSync("./config.js", baseConfig);

  console.log("REMEMBER TO NEVER SHARE YOUR TOKEN WITH ANYONE!");
  console.log("Configuration has been written, enjoy!");
  await settings.close();
}());