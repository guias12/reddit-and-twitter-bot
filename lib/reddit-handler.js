require('dotenv').config({ path: './credentials/credentials.env' });

const RedditAPI = require('reddit-wrapper-v2');
const imgHandler = require('./img-handler');

const redditConn = new RedditAPI({
    username:   process.env.RE_USERNAME,
    password:   process.env.RE_PASSWORD,
    app_id:     process.env.RE_APP_ID,
    api_secret: process.env.RE_API_SECRET,
    user_agent: "Reddit-Watcher-V2",
    logs: true
});

function getRedditData(){
	//using the reddit api to fetch data from r/blessedimages
	redditConn.api.get("/r/blessedimages/new.json?sort=new", { limit: 1 }).then((response) => {
	    const responseData = response[1];
	    let count = 0;
	    responseData.data.children.forEach((post) => {
	    	var imageName = `./img/image${count}.jpg`;
			imgHandler.downloadImage(post.data.url, imageName, imgHandler.tweetImage(imageName))
			count++;
		});		
	}).catch((err) => console.error("API request failed: " + err));
};

module.exports = { getRedditData };