require('dotenv/config');

var Twit = require('twit');
var RedditAPI = require('reddit-wrapper-v2');

var T = new Twit({
  consumer_key:         process.env.TW_CONSUMER_KEY,
  consumer_secret:      process.env.TW_CONSUMER_SECRET,
  access_token:         process.env.TW_ACCESS_TOKEN,
  access_token_secret:  process.env.TW_ACCESS_TOKEN_SECRET  
})
 
var redditConn = new RedditAPI({
    username: process.env.RE_USERNAME,
    password: process.env.RE_PASSWORD,
    app_id: process.env.RE_APP_ID,
    api_secret: process.env.RE_API_SECRET,
    user_agent: "Reddit-Watcher-V2",
    logs: true
});


redditConn.api.get("/api/v1/collections/subreddit_collections", {
	limit: 5,
	sr_fullname: "r/blessedimages/"
}).then(function(response) {
    let responseCode = response[0];
    let responseData = response[1]; 
    console.log("Received response (" + responseCode + "): ", responseData.json.errors);
}).catch(function(err) {
    return console.error("api request failed: " + err)
});
