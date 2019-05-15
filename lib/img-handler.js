require('dotenv').config({ path: './credentials/credentials.env' });

const Twit = require('twit');
const fs = require('fs');
const request = require('request');


console.log( process.env.TW_CONSUMER_KEY);
const T = new Twit({
  consumer_key:         process.env.TW_CONSUMER_KEY,
  consumer_secret:      process.env.TW_CONSUMER_SECRET,
  access_token:         process.env.TW_ACCESS_TOKEN,
  access_token_secret:  process.env.TW_ACCESS_TOKEN_SECRET  
});

function removeExistingImages(){
    try{
		let filePath;
        for(let iterator = 0; iterator < 2 ; iterator++){
            filePath = `./img/image'${iterator}.jpg`; 
            fs.unlinkSync(filePath);
        }
    } catch(e){
        console.log(e);
    }
};

//downloading the image on the /img directory
function downloadImage(uri, imageName, callback){
	request.head(uri, (err, res, body) => {
	    console.log('content-type:', res.headers['content-type']);
	    console.log('content-length:', res.headers['content-length']);
	    console.log(imageName);
	    request(uri).pipe(fs.createWriteStream(imageName)).on('close', callback);
  	});
};

//tweeting the downloaded image
function tweetImage(imageName){
    const randomImageCode = Math.floor(1000 + Math.random() * 9000);
	const textStatus = `blessed image${randomImageCode}`;
	const b64content = fs.readFileSync(imageName, { encoding: 'base64' })
	// Uploading media to twitter
	T.post('media/upload', { media_data: b64content }, (err, data, response) => {	  
		const mediaIdStr = data.media_id_string;
	  	const meta_params = { media_id: mediaIdStr}
		T.post('media/metadata/create', meta_params, (err, data, response) => {
	    	if (!err) {
	      		// now we can reference the media and post a tweet (media will attach to the tweet)
	      		const params = { status: textStatus, media_ids: [mediaIdStr] };
	      		T.post('statuses/update', params, (err, data, response) => {
	        		console.log(data)
	      		})
	    	}
	    })
	})
};

module.exports = {
    removeExistingImages,
    downloadImage,
    tweetImage,
};