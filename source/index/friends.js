const library = require('../library');

module.exports = function (data) {
  return new Promise((resolve) => {
    let distribution_friends_offset = [];
    let distribution_friends_age = [];
    let distribution_friends_friends = [];
    let distribution_friends_followers = [];
    let distribution_friends_tweets = [];
    let friends_score = 0;
    data.users.forEach(function (current) {
      // Add news values for each distribution array if the value is not present yet
      if (current.utc_offset != null && distribution_friends_offset.indexOf(current.utc_offset) === -1) {
        distribution_friends_offset.push(current.utc_offset);
      }
      let current_age = Math.round(library.convertTwitterDateToDaysAge(current.created_at) / 100) * 100;
      if (current.created_at != null && distribution_friends_age.indexOf(current_age) === -1) {
        distribution_friends_age.push(current_age);
      }
      let current_friends = Math.round(current.friends_count / 100) * 100;
      if (current.friends_count != null && distribution_friends_friends.indexOf(current_friends) === -1) {
        distribution_friends_friends.push(current_friends);
      }
      let current_followers = Math.round(current.followers_count / 100) * 100;
      if (current.followers_count != null && distribution_friends_followers.indexOf(current_followers) === -1) {
        distribution_friends_followers.push(current_followers);
      }
      let current_statuses = Math.round(current.statuses_count / 100) * 100;
      if (current.statuses_count != null && distribution_friends_tweets.indexOf(current_statuses) === -1) {
        distribution_friends_tweets.push(current_statuses);
      }
    });
    let score_offset = distribution_friends_offset.length / 8;
    let score_age = distribution_friends_age.length / 50;
    let score_friends = distribution_friends_friends.length / 50;
    let score_followers = distribution_friends_followers.length / 75;
    let score_statuses = distribution_friends_tweets.length / 50;
    if (score_offset > 1) score_offset = 1;
    if (score_age > 1) score_age = 1;
    if (score_friends > 1) score_friends = 1;
    if (score_followers > 1) score_followers = 1;
    if (score_statuses > 1) score_statuses = 1;
    friends_score = ((score_offset * 2) + score_age + score_friends + score_followers + score_statuses) / (5 * 2);
    let weight = 1;
    resolve([friends_score, weight]);
  });
};
