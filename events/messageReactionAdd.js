module.exports = async (r, user) => {
  let message = r.message;
  let perm = message.client.elevation(message);
  let validEmojis = ['📌', '📍'];
  if (validEmojis.includes(r.emoji.name)) {
    if (perm > 0) {
      message.pin();
    } else {
      try {
        await user.send(`Here is the message you pinned:\n${message.cleanContent}`);
      } catch (e) {
        if (e.response.body.message === 'Cannot send messages to this user') {
          await message.channel.send(`I cannot send you that message ${user}, as it appears you have **Direct Messages's** disabled.`);
        } else {
          console.log(e);
        }
      }

    }
  }
};
