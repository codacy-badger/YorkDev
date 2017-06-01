module.exports = async (r, user) => {
  let message = r.message;
  // let perm = message.client.elevation(message);
  let validEmojis = ['📌', '📍'];
  if (validEmojis.includes(r.emoji.name)) {
    // if (perm > 0) {
    //   message.pin();
    // } else {
    try {
      await user.send(`Here is the message you pinned:\n${message.cleanContent}`);
    } catch (e) {
      if (e.message === 'Cannot send messages to this user') {
        await message.channel.send(`I cannot send you that message ${user}, as it appears you have **Direct Messages's** disabled.`);
      } else {
        console.log(e);
      }
    }
  }
  // }

  // let validEmojisIDs = ['264720926703222786', '264720920222892032'];
  // console.log(`${user.username} reacted with ${r.emoji} (ID: ${r.emoji.id}), the count is now ${r.count}`);
  // if (validEmojisIDs.includes(r.emoji.id)) {
  //   message.client.vote.set(user.id, {
  //     msgId: r.message.id,
  //     timestamp: Date.now(),
  //     vote: r.emoji.id
  //   });
  // } else {
  //   // Remove any other invalid emojis from the vote
  // }
};
