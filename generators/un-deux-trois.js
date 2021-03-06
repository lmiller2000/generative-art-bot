var fs = require('fs'),
    Canvas = require('canvas'),
    GIFEncoder = require('gifencoder'),
    img_path_png = './.data/temp.png',
    img_path_gif = './.data/temp.gif',
    helpers = require(__dirname + '/../helpers.js');

module.exports = function(options, cb) {
  /* 
    Based on https://generativeartistry.com/tutorials/un-deux-trois/
  */

  console.log('un, duex, trois...');

  var width = options.width || 1184,
      height = options.height || 506,
      colors = options.colors || ['000', 'fff'],
      canvas = Canvas.createCanvas(width, height),
      ctx = canvas.getContext('2d');

  if (options.animate){
    var encoder = new GIFEncoder(width, height);
    encoder.createReadStream().pipe(fs.createWriteStream(img_path_gif));

    encoder.start();
    encoder.setRepeat(-1);   // 0 for repeat, -1 for no-repeat
    encoder.setDelay(100);   // frame delay in milliseconds
    encoder.setQuality(10); // image quality, 10 is default.
  }

  ctx.lineWidth = helpers.get_random_int(1,4);
  ctx.fillStyle = `#${colors[0]}`;
  ctx.strokeStyle = `#${colors[1]}`;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.lineCap = 'round';

  if (options.animate){
    encoder.addFrame(ctx);
  }

  var step = helpers.get_random_int(15,25);
  var aThirdOfHeight = height/3;

  function draw(x, y, width, height, positions) {
    ctx.save();
    ctx.translate(x + width/2, y + height/2)
    ctx.rotate(Math.random() * 5);
    ctx.translate(-width/2, -height/2)

    for(var i = 0; i <= positions.length; i++) {
      ctx.beginPath();
      ctx.moveTo(positions[i] * width, 0);
      ctx.lineTo(positions[i] * width, height);
      ctx.stroke();
    }

    ctx.restore();
  }

  for( var y = step; y < width - step; y += step) {
    for( var x = step; x < width - step; x+= step ) {
      if( y < aThirdOfHeight) {
        draw(x, y, step, step, [0.5]);   
      } else if ( y < aThirdOfHeight * 2) {
        draw(x, y, step, step, [0.2, 0.8]);      
      } else {
        draw(x, y, step, step, [0.1, 0.5, 0.9]);      
      }
      if (options.animate){
        encoder.addFrame(ctx);
      }        
    }
  }

  if (options.animate){
    encoder.setDelay(2000);
    encoder.addFrame(ctx);
    encoder.finish();
    helpers.load_image(`https://${process.env.PROJECT_DOMAIN}.glitch.me/gif`,
    function(err, img_data_gif){
      if (cb){
        cb(null, {
          path: img_path_gif,
          data: img_data_gif
        });          
      }
    });     
  }
  else{
    const out = fs.createWriteStream(img_path_png);
    const stream = canvas.createPNGStream();
    stream.pipe(out);

    out.on('finish', function(){
      if (cb){
        cb(null, {
          path: img_path_png,
          data: canvas.toBuffer().toString('base64')
        });
      }
    });
  }
}
