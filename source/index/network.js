module.exports = function (data) {
  return new Promise((resolve) => {
    let count_hashtags = 0;
    let count_mentions = 0;
    let distribution_hashtags = [];
    let distribution_user_mentions = [];
    data.forEach(function (current) {
      // Add the count of hashtags and mentions for each tweets to the total
      count_hashtags += current.entities.hashtags.length;
      count_mentions += current.entities.user_mentions.length;
      // Add news values for each distribution array if the value is not present yet
      current.entities.hashtags.forEach(function (hashtag) {
        if (distribution_hashtags.indexOf(hashtag.text) === -1) {
          distribution_hashtags.push(hashtag.text);
        }
      });
      current.entities.user_mentions.forEach(function (user_mention) {
        if (current.in_reply_to_screen_name !== user_mention.screen_name && distribution_user_mentions.indexOf(user_mention.screen_name) === -1) {
          distribution_user_mentions.push(user_mention.screen_name);
        }
        // If the current mention is actually in a reply, remove it from the count
        else if (current.in_reply_to_screen_name === user_mention.screen_name) {
          count_mentions--;
        }
      });
    });
    let count_network = count_hashtags + count_mentions;
    let average_network = (count_network / (data.length * 2));
    if (average_network > 2) {
      average_network /= 2;
    } else if (average_network > 1) {
      average_network = 1;
    }
    let score_hashtags = 1 - (distribution_hashtags.length / count_hashtags);
    let score_mentions = 1 - (distribution_user_mentions.length / count_mentions);
    let score_distrib = (score_hashtags + score_mentions) / 2;
    let score_network = average_network + score_distrib;
    let weight = 1;
    if (score_network === 0) {
      weight += 1;
    }
    resolve([score_network, weight]);
  });
};
