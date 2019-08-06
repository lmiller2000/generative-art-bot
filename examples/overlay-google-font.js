/*
  This example shows how to use Google Fonts when overlaying text on canvas.
  First, see scripts/get-google-fonts.js on how to download a font from Google Fonts.

  After that, look below for fontFileName.

*/

var helpers = require(__dirname + '/helpers.js'),
    generators = {
      overlay: require(__dirname + '/generators/overlay.js'),
    },
    mastodon = require(__dirname + '/bot/fediverse/mastodon.js'),
    twitter = require(__dirname + '/bot/twitter.js');

module.exports = function(){  
  helpers.load_image_assets(function(err, image_urls){
    var image_width = 1184,
        image_height = 506;

    generators.overlay([
        {
          url: helpers.random_from_array(image_urls),
          x: 0,
          y: 0,
          width: image_width,
          height: image_height
        },
        {
          url: helpers.random_from_array(image_urls),
          x: image_width/2-(image_width/4),
          y: image_height/2-(image_height/4),
          width: image_width/2,
          height: image_height/2
        },
        {
          url: helpers.random_from_array(image_urls),
          x: image_width/2-(image_width/8),
          y: image_height/2-(image_height/8),
          width: image_width/4,
          height: image_height/4
        },
        {
          text: 'SPACE',
          fontSize: 42, // size in pixels, for example: 42px
          fontFileName: 'Monoton-400-1.ttf',
          fontFamily: 'Monoton',
          style: '#fff', //*color, for example #fff
          // Use either position or specify x and y, for example:
          // x: image_width/2-(image_width/16),
          // y: image_height/2-(image_height/16),  
          position: 'center center'
          // Possible values for position:
          //   'top left'
          //   'top center'
          //   'top right'
          //   'center left'
          //   'center center'
          //   'center right'
          //   'bottom left '
          //   'bottom center'
          //   'bottom right'
        }    
      ], {width: 1184, height: 506}, function(err, image){

        var status_text = helpers.random_from_array([
              'Check this out!',
              'New picture!'
            ]);
      
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
