PDF To Markdown Converter
Debug View
Result View

**Key Temporal Profile:**

Data to collect:
The date of all tweets posted in the timeline sample
Age of the profile

Preparation of data:
Put all date of posted tweet in an array

List of subindex:

- Delay between two tweets
- Ratio tweets by day

Calcul of the probability:

- Substract all date of a created tweet to the date of the tweet created previously. Put this diff in an
array if it is not already present
- Divide the number of total tweets by the number of day the profile was created and multiplicate it
by x0,025 to not make this score impact a lot the final

Then to get the temporal score, we add 2 to the length of the diff array and divide the result by the
size of the sample. The result is removed from 1. Finally the tweets ratio score is added to get the
final score.

Score = (1 - (Size of the diff array + 2) / Number of data) + Ratio tweets by day * 0,025

More explanations:
A bot can be scheduled to send tweet every X seconds, minute or hours. This index is here for get
this.
In case of the tweets do not looks so scheduled, we also get the ratio of tweets by day since the
profile creation, a number too high is suspicious



This is a offline tool, your data stays locally and is not send to any server!
Feedback & Bug Reports
