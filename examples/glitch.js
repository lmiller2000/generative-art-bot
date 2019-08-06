/*
  Glitch a random image from the assets folder.
*/

var helpers = require(__dirname + '/helpers.js'),
    generators = {
      glitch: require(__dirname + '/generators/glitch.js'),
    },
    mastodon = require(__dirname + '/bot/fediverse/mastodon.js'),
    twitter = require(__dirname + '/bot/twitter.js');

module.exports = function(){
   helpers.load_image_assets(function(err, urls){
    // First we need to load images from the assets folder,
    // then we can pick one randomly and apply a glitch effect to it.
     
    var status_text = helpers.random_from_array([
          'Check this out!',
          'New picture!'
        ]),
        options = {
          width: 300,
          height: 200,
          url: helpers.random_from_array(urls),
          animated: true
        };

     generators.glitch(options, function(err, image){
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
  });
}
