# CascoBaySewerBot

A Twitter notification bot for likely sewer overflow (CSO) events in Portland, Maine, based on weather and historical reports. A [@pressherald](https://www.pressherald.com) project by [@c_milneil](https://twitter.com/c_milneil).

The interesting stuff is contained in the bot.js file. There, the tweetConditions() function downloads current weather reports from the Weather Underground API, and, if conditions warrant, call the status() function to compose a tweet.


### Configuration

These files are currently deployed as a Node.js app on Heroku. To adapt this code, you'll need to adjust the config.js file to include your own Twitter API and Weather Underground API keys.
