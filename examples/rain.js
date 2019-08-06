/*
  Source code powering botsin.space/@rain.
*/

var helpers = require(__dirname + '/helpers.js'),
    generators = {
      rain: require(__dirname + '/generators/rain.js')
    },
    mastodon = require(__dirname + '/bot/fediverse/mastodon.js'),
    twitter = require(__dirname + '/bot/twitter.js');

module.exports = function(){  
  var status_text = helpers.random_from_array([
        'Check this out!',
        'New picture!'
      ]),
      options = {
        width: 640,
        height: 480,
      };
  
  generators.rain(options, function(err, image){

    twitter.post_image(status_text, image.data, function(err, data){
      if (err){
        console.log('oh no...', err)
      } else {
        console.log('tweet posted!');
        console.log(`https://twitter.com/${data.user.screen_name}/status/${data.id_str}`);
      }
    });

    mastodon.post_image(status_text, image.path, function(err, data){
      if (err){
        console.log('oh no...', err)
      } else {
        console.log('toot posted!');
        console.log(data.url);
      }
    });    
  });
}
