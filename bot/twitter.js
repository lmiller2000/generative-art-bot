if ( !process.env.TWITTER_CONSUMER_KEY || !process.env.TWITTER_CONSUMER_SECRET || !process.env.TWITTER_ACCESS_TOKEN || !process.env.TWITTER_ACCESS_TOKEN_SECRET ){
  console.log('please update your .env file with Twitter API keys');
  process.exit();
}

var helpers = require(__dirname + '../../helpers.js'),
    config = {
      twitter: {
        consumer_key: process.env.TWITTER_CONSUMER_KEY,
        consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
        access_token: process.env.TWITTER_ACCESS_TOKEN,
        access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
      }
    },
    Twit = require('twit'),
    T = new Twit(config.twitter);

module.exports = {
  post_image: function(text, image_base64, cb) {
   T.post('media/upload', { media_data: image_base64 }, function (err, data, response) {
      if (err){
        console.log('ERROR:\n', err);
        if (cb){
          cb(err, data);
        }
      }
      else{
        console.log('tweeting the image...');
        T.post('statuses/update', {
          status: text,
          media_ids: new Array(data.media_id_string)
        },
        function(err, data, response) {
          if (err){
            console.log('ERROR:\n', err);
            if (cb){
              cb(err, data);
            }
          }
          else{
            if (cb){
              cb(null, data);
            }
          }
        });
      }
    });
  }
};
