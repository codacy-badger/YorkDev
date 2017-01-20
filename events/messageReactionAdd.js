module.exports = async (r, user) => {
  let message = r.message;
  let validEmojis = ['📌', '📍'];
  if (validEmojis.includes(r.emoji.name)) {
    if (message.author.id === user.id) return message.reply('You cannot pin your own messages.');
    user.sendMessage(`Here is the message you pinned.\n${r.message.cleanContent}`)
    // .then(() => {
    //   r.message.channel.sendMessage(`${user}, I have sent you that message.`).catch(error => console.log(`ERROR: ${error.response.body.message}`));
    // })
    .catch(error => {
      if (error.response.body.message === 'Cannot send messages to this user') {
        message.channel.sendMessage(`I cannot send you that message ${user}, as it appears you have **Direct Messages's** disabled.`).catch(error => console.log(error));
      } else {
        console.log(error);
      }
    });
  }
};
