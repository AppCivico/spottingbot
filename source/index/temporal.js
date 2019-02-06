const library = require('../library');

module.exports = function (data) {
  return new Promise((resolve) => {
    let creationArray = [];
    let delayTwoTweets = [];
    // Put the date of each tweets in array
    data.forEach(function (current) {
      let date = new Date(current.created_at + 'Z');
      creationArray.push(date);
    });
    // Calculate the difference time between each tweet
    for (let i = 0; i < creationArray.length - 1; i++) {
      let diff = creationArray[i].getTime() - creationArray[i + 1].getTime();
      // If the difference time is not already in the array, put it
      if (delayTwoTweets.indexOf(diff) === -1) {
        delayTwoTweets.push(diff);
        // The shorter this array is, the more tweets are posted in a very regular way
      }
    }
    let age = library.convertTwitterDateToDaysAge(data[0].user.created_at);
    let number_of_tweets = data[0].user.statuses_count;
    let ratio_tweets_day = number_of_tweets / age;
    let ratioTweetScore = ratio_tweets_day * 0.015;
    let temporal_score = ((1 - (delayTwoTweets.length + 2) / creationArray.length) + ratioTweetScore);
    if (temporal_score < 0) {
      temporal_score = 0;
    }
    let weight = 1;
    if (temporal_score === 0) {
      weight += 1;
    }
    resolve([temporal_score, weight]);
  });
};
