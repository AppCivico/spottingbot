const library = require('../library')

module.exports = function(data) {
  return new Promise(resolve => {
    let creationArray = new Array()
    let delayTwoTweets = new Array()
    data.forEach(function(current) {
      let date = new Date(current.created_at + 'Z')
      creationArray.push(date)
    })
    for (let i = 0; i < creationArray.length - 1; i++) {
      let diff = creationArray[i].getTime() - creationArray[i + 1].getTime()
      if (delayTwoTweets.indexOf(diff) === -1) {
        delayTwoTweets.push(diff)
      }
    }
    let age = library.convertTwitterDateToDaysAge(data[0].user.created_at)
    let number_of_tweets = data[0].user.statuses_count
    let ratio_tweets_day = number_of_tweets / age
    let ratioTweetScore = ratio_tweets_day * 0.10;
    let temporal_score = ((1 - (delayTwoTweets.length + 2) / creationArray.length) + ratioTweetScore)
    resolve(temporal_score)
  })
}
