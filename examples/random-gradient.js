/*
  Generate a random color gradient.
*/

var helpers = require(__dirname + '/helpers.js'),
    ColorScheme = require('color-scheme'),
    scheme = new ColorScheme,
    generators = {
      gradient: require(__dirname + '/generators/gradient.js')
    },
    mastodon = require(__dirname + '/bot/fediverse/mastodon.js'),
    twitter = require(__dirname + '/bot/twitter.js');

module.exports = function(){
  /*
    Use https://github.com/c0bra/color-scheme-js to generate a color scheme. 
  */  
      
  scheme.from_hex(helpers.get_random_hex().replace('#',''))
        .scheme('contrast');
  
  var status_text = helpers.random_from_array([
        'Check this out!',
        'New picture!'
      ]),
      options = {
        width: 1200,
        height: 500,
        colors: scheme.colors(), // or you could pass specific colors, for example: ['000', 'fff']
        // animate: true // If using this option, set width and height to something around 300-400.
      };
  
  generators.gradient(options, function(err, image){

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
