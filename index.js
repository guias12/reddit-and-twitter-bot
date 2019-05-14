require('dotenv').config({ path: './credentials/credentials.env' });

const Twit = require('twit');
const RedditAPI = require('reddit-wrapper-v2');
const redditHandler = require('./lib/reddit-handler');
const imgHandler = require('./lib/img-handler');

imgHandler.removeExistingImages();
redditHandler.getRedditData();