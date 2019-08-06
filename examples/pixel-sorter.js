/*
  Generate images in the style of botwiki.org/bot/crookedcosmos.

  Based on https://github.com/dustinbarnes/pixel-sorting.
*/

var helpers = require(__dirname + '/helpers.js'),
    generators = {
      pixel_sorter: require(__dirname + '/generators/pixel-sorter.js')
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

  helpers.load_image_assets(function(err, image_urls){
    var image_url = helpers.random_from_array(image_urls);

    helpers.load_image(image_url, function(err, img_data){
      generators.pixel_sorter(img_data, function(err, image){

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
  });      
};
