/*
  Various generative art experiments.
*/

var helpers = require(__dirname + '/helpers.js'),
    ColorScheme = require('color-scheme'),
    scheme = new ColorScheme,
    generators = {
      tiled_lines: require(__dirname + '/generators/tiled-lines.js'),
      circle_packing: require(__dirname + '/generators/circle-packing.js'),
      cubic_disarray: require(__dirname + '/generators/cubic-disarray.js'),
      joy_division: require(__dirname + '/generators/joy-division.js'),
      tiled_lines: require(__dirname + '/generators/tiled-lines.js'),
      triangular_mesh: require(__dirname + '/generators/triangular-mesh.js'),
      un_deux_trois: require(__dirname + '/generators/un-deux-trois.js')
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

  /*
    Use one of the generators we loaded, for example:
  */
  
  generators.circle_packing(options, function(err, image){
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
