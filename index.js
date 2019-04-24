require('dotenv/config');

const Twit = require('twit');
const RedditAPI = require('reddit-wrapper-v2');
const fs = require('fs');
const request = require('request');

const T = new Twit({
  consumer_key:         process.env.TW_CONSUMER_KEY,
  consumer_secret:      process.env.TW_CONSUMER_SECRET,
  access_token:         process.env.TW_ACCESS_TOKEN,
  access_token_secret:  process.env.TW_ACCESS_TOKEN_SECRET  
});
 
const redditConn = new RedditAPI({
    username:   process.env.RE_USERNAME,
    password:   process.env.RE_PASSWORD,
    app_id:     process.env.RE_APP_ID,
    api_secret: process.env.RE_API_SECRET,
    user_agent: "Reddit-Watcher-V2",
    logs: true
});

getRedditData();

function getRedditData(){
	//using the reddit api to fetch data from r/blessedimages
	redditConn.api.get("/r/blessedimages/new.json?sort=new", {limit: 5}).then(function(response) {
	    var responseCode = response[0];
	    var responseData = response[1];
	    var imagesUrl = [];
	    responseData.data.children.forEach(function(post){
			imagesUrl.push(post.data.url);		
		});
		downloadImage(imagesUrl[1], 'testImage.jpg', function(){
			tweetImage();
		});
	}).catch(function(err) {
	    return console.error("API request failed: " + err);
	});
};

//downloading the image on the root directory(must improve :) )
function downloadImage(uri, filename, callback){
	request.head(uri, function(err, res, body){
	    console.log('content-type:', res.headers['content-type']);
	    console.log('content-length:', res.headers['content-length']);
	    request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
  	});
};

//tweeting the downloaded image
function tweetImage(){
	var b64content = fs.readFileSync('./testImage.jpg', { encoding: 'base64' })
	// Uploading media to twitter
	T.post('media/upload', { media_data: b64content }, function (err, data, response) {	  
		var mediaIdStr = data.media_id_string;
	  	var altText = "Some random picture from blessedimages subreddit";
	  	var meta_params = { media_id: mediaIdStr, alt_text: { text: altText } }

		T.post('media/metadata/create', meta_params, function (err, data, response) {
	    	if (!err) {
	      		// now we can reference the media and post a tweet (media will attach to the tweet)
	      		var params = {
	      						status: 'Se voce esta lendo essa mensagem, e existe uma imagem aleatoria nesse tweet então eu sou o mago do node.js, caso contrario eu sou um fracasso. :)',
	      						media_ids: [mediaIdStr]
	      					};
	      		T.post('statuses/update', params, function (err, data, response) {
	        		console.log(data)
	      		})
	    	}
	    })
	})
};