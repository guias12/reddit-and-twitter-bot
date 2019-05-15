require('dotenv').config({ path: './credentials/credentials.env' });

const RedditAPI = require('reddit-wrapper-v2');
const redditHandler = require('./lib/reddit-handler');
const imgHandler = require('./lib/img-handler');

imgHandler.removeExistingImages();
redditHandler.getRedditData();