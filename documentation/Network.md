**Key Network Profile:**

Data to collect:
All hashtags used in the timeline sample
All mentions used in the timelime sample
Sample size

Preparation of data:
For each data collected, put it in a distribution array that contains an unique element of each
different element collected.
For example, if we have five times the hashtag “#eleçoes”, we put this data only once in the array
For mentions, do not count a mention if it belong to a reply

List of subindex:

- Lenght of distribution for hashtags
- Length of distribution for mentions
- Total of hashtags and mentions

Calcul of the probability:

- Count the size of hashtags distribution
- Count the size of mentions distribution
- Get the average network score by adding the number of hashtags in the sample with the number of
mentions and divided by size of the sample multiplicated by two.

Then, we divide the size of the distribution of hashtag by the total hashtag we have in the sample,
for example if we have only 5 different hashtags for a total of 50 hashtags used in the sample, we
divide 5 by 50.
We proceed the same for the mentions and we remove both score from 1.
Next, we make the average of the two score we just get and we add it the the average network score


Score = ((Total of hashtags + mentions) / (Number of data * 2)) + ((1 - (Number of different hashtags used / Total of hashtags)) + (1 - (Number of different mentions used / Total of mentions))) / 2;

More explanations:
This index calculate if the profile is spamming some hashtag or users. The most hashtags/mentions
there have, the most the score will be high, the normal ration of hashtags/mentions by tweets in
considered as two. More than this, the score will start to increase.
In the case of a spamming bot, this is commonly the same hashtags/mentions that are used, this is
also what this index do. If 50 hashtags are used in the timeline and it is 50 different hashtags,
nothing is suspicions, but if it is one hashtag used 100% of the time, it is become really suspicious.
