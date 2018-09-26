module.exports = function(data) {
  return new Promise(resolve => {
    let count_hashtags = 0
    let count_mentions = 0
    let distribution_hashtags = new Array()
    let distribution_user_mentions = new Array()
    data.forEach(function(current) {
      count_hashtags += current.entities.hashtags.length
      count_mentions += current.entities.user_mentions.length
      current.entities.hashtags.forEach(function(hashtag) {
        if (distribution_hashtags.indexOf(hashtag.text) === -1) {
          distribution_hashtags.push(hashtag.text)
        }
      })
      current.entities.user_mentions.forEach(function(user_mention) {
        if (distribution_user_mentions.indexOf(user_mention.screen_name) === -1) {
          distribution_user_mentions.push(user_mention.screen_name)
        }
      })
    })
    let count_network = count_hashtags + count_mentions
    let average_network = (count_network / (data.length * 2))
    if (average_network > 2) {
      average_network /= 2
    }
    else if (average_network > 1) {
      average_network = 1
    }
    let score_hashtags = 1 - (distribution_hashtags.length / count_hashtags)
    let score_mentions = 1 - (distribution_user_mentions.length / count_mentions)
    let score_distrib = (score_hashtags + score_mentions) / 2
    let score_network = average_network + score_distrib
    resolve(score_network)
  })
}
