const sentiment = require('multilang-sentiment');

module.exports = function (data) {
  return new Promise((resolve) => {
    let sentimentSum = 0
    data.forEach(function(current) {
      let lang = current.lang;
      let text = current.text;
      if (lang === 'und') {
        lang = null
      }
      let res = sentiment(text);
      sentimentSum += Math.abs(res.comparative);
    })
    let score_sentiment = 1 - (sentimentSum / (data.length * 2));
    let weight = 1;
    if (score_sentiment < 0.25) {
      weight = 0.5;
    }
    resolve([score_sentiment, weight]);
  });
};
