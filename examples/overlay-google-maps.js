/*
  Overlay images over a Google Maps map. 
*/

var helpers = require(__dirname + '/helpers.js'),
    generators = {
      overlay: require(__dirname + '/generators/overlay.js'),
    },
    mastodon = require(__dirname + '/bot/fediverse/mastodon.js'),
    twitter = require(__dirname + '/bot/twitter.js');

module.exports = function(){  
  helpers.load_image_assets(function(err, image_urls){
    var rand_lat = helpers.get_random_range(-180, 180, 3),
        rand_long = helpers.get_random_range(-180, 180, 3);
    
    /* Image source: http://clipart-library.com/clipart/49144.htm */
    var marker_img_url = 'https://cdn.glitch.com/6a3f57dc-a644-43af-b250-4bc435e6417c%2Fx-64.png';

    var treasure_lat = rand_lat,
        treasure_long =  rand_long;
    
    var markers = `icon:${marker_img_url}|${treasure_lat},${treasure_long}`;
    
    var center = `${rand_lat},${rand_long}`,
        width = 1280,
        height = 1280,
        scale = 2,
        zoom = 5,
        maptype = 'roadmap',
        style = '&style=feature:all|element:all|color:0xd4b78f|visibility:on&style=feature:all|element:geometry.stroke|color:0x0d0000|visibility:on|weight:1&style=feature:administrative|element:labels.text.fill|color:0x98290e|visibility:on&style=feature:administrative|element:labels.text.stroke|visibility:off&style=feature:administrative.province|element:all|visibility:off&style=feature:administrative.locality|element:labels.text.fill|color:0x98290e|visibility:on&style=feature:administrative.locality|element:labels.text.stroke|visibility:off&style=feature:administrative.neighborhood|element:all|visibility:on&style=feature:landscape|element:all|color:0xd4b78f|visibility:on&style=feature:poi|element:all|visibility:off&style=feature:poi.park|element:all|color:0xc4b17e|visibility:on&style=feature:road|element:labels.icon|visibility:off&style=feature:road.highway|element:geometry.stroke|visibility:off&style=feature:road.highway|element:labels.text.fill|color:0x0d0000|visibility:on&style=feature:road.highway|element:labels.text.stroke|color:0xd9be94|visibility:on&style=feature:road.highway.controlled_access|element:geometry.fill|color:0x0d0000|visibility:off|weight:2&style=feature:road.arterial|element:all|visibility:off&style=feature:road.local|element:all|visibility:off&style=feature:transit|element:all|visibility:off&style=feature:water|element:geometry|color:0xa8ac91&style=feature:water|element:labels.text.fill|color:0x98290e|visibility:on&style=feature:water|element:labels.text.stroke|visibility:off';

    /*
      Map styles
      
      You can use snazzymaps.com to create or copy a map style,
      and then http://jsfiddle.net/nyapa/s6Dyp/23/ to convert the JSON object into code that works with static Google maps.
    */

      var map_url = `https://maps.googleapis.com/maps/api/staticmap?center=${center}&zoom=${zoom}&size=${width}x${height}&scale=${scale}&maptype=${maptype}&style=${style}&markers=${markers}`;
      var map_overlay_url = 'https://cdn.glitch.com/6a3f57dc-a644-43af-b250-4bc435e6417c%2Fmap-overlay.png?1505908226351';

      var image_width = 1280,
          image_height = 1280;


    generators.overlay([
        {
          url: map_url,
          x: 0,
          y: 0,
          width: image_width,
          height: image_height,
          globalCompositeOperation: 'multiply'
          /*
            See https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/globalCompositeOperation#Types
            for possible values.
          */
        },
        {
          url: map_overlay_url,
          x: 0,
          y: 0,
          width: image_width,
          height: image_height,
          globalCompositeOperation: 'multiply'
        }   
      ], {width: image_width, height: image_height}, function(err, image){

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
