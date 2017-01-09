module.exports = (r, user) => {
  console.log(`${user.username} reacted with ${r.emoji} (ID: ${r.emoji.id}), the count is now ${r.count}`);
  let validEmojis = ['📌', '📍'];
  if (r.emoji.name === validEmojis[validEmojis.indexOf(r.emoji.name)]) {
    user.sendMessage(`Here is the message you pinned.\n${r.message.cleanContent}`).then(() => {
      r.message.channel.sendMessage(`${user}, I have sent you that message.`).catch(error => console.log(`ERROR: ${error.response.body.message}`));
    }).catch(error => {
      if (error.response.body.message === 'Cannot send messages to this user') {
        r.message.channel.sendMessage(`I cannot send you that message ${user}, as it appears you have **Direct Messages's** disabled.`).catch(error => console.log(error));
      } else {
        console.log(error);
      }
    });
  }
};
