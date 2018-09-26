module.exports = {
  getNumberOfDigit: function (string) {
    return string.replace(/[^0-9]/g, '').length;
  },

  convertTwitterDateToDaysAge: function (date) {
    let split = date.split(' ');
    let month = new Date(Date.parse(split[1] + ' 1, 2012')).getMonth();
    let day = split[2];
    let year = split[split.length - 1];
    let oneDay = 24 * 60 * 60 * 1000;
    let firstDate = new Date(year, month, day);
    let now = new Date();
    let diffDays = Math.round(Math.abs((firstDate.getTime() - now.getTime()) / (oneDay)));
    return diffDays;
  },

  similarity: function (s1, s2) {
    let longer = s1;
    let shorter = s2;
    if (s1.length < s2.length) {
      longer = s2;
      shorter = s1;
    }
    let longerLength = longer.length;
    if (longerLength === 0) {
      return 1.0;
    }
    return (longerLength - editDistance(longer, shorter)) / parseFloat(longerLength);
  },
};

function editDistance(s1, s2) {
  s1 = s1.toLowerCase();
  s2 = s2.toLowerCase();

  let costs = [];
  for (let i = 0; i <= s1.length; i++) {
    let lastValue = i;
    for (let j = 0; j <= s2.length; j++) {
      if (i === 0)
        costs[j] = j;
      else {
        if (j > 0) {
          let newValue = costs[j - 1];
          if (s1.charAt(i - 1) !== s2.charAt(j - 1))
            newValue = Math.min(Math.min(newValue, lastValue),
              costs[j]) + 1;
          costs[j - 1] = lastValue;
          lastValue = newValue;
        }
      }
    }
    if (i > 0)
      costs[s2.length] = lastValue;
  }
  return costs[s2.length];
}
