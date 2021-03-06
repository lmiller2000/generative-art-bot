var fs = require('fs'),
    Canvas = require('canvas'),
    GIFEncoder = require('gifencoder'),
    img_path_png = './.data/temp.png',
    img_path_gif = './.data/temp.gif',
    helpers = require(__dirname + '/../helpers.js');

module.exports = function(options, cb) {
  /* 
    Based on https://generativeartistry.com/tutorials/triangular-mesh/
  */
  console.log('making triangles...');
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
    encoder.setQuality(5); // image quality, 10 is default.
  }

  ctx.lineWidth = 1;
  ctx.fillStyle = `#${colors[0]}`;
  ctx.strokeStyle = `#${colors[1]}`;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  if (options.animate){
    encoder.addFrame(ctx);
  }

  var line, dot,
      odd = false, 
      lines = [],
      gap = width / helpers.get_random_int(5,12);

  for (var y = -2 * gap / 2; y <= 2 * height; y+= gap) {
    odd = !odd
    line = []
    for (var x = -2 * gap / 4; x <= 2 * width; x+= gap) {
      line.push({
        x: x + (Math.random()*.8 - .4) * gap  + (odd ? gap/2 : 0),
        y: y + (Math.random()*.8 - .4) * gap,
      })
    }
    lines.push(line)
  }

  function drawTriangle(pointA, pointB, pointC) {
    ctx.beginPath();
    ctx.moveTo(pointA.x, pointA.y);
    ctx.lineTo(pointB.x, pointB.y);
    ctx.lineTo(pointC.x, pointC.y);
    ctx.lineTo(pointA.x, pointA.y);
    ctx.closePath();
    ctx.fillStyle = '#' + helpers.random_from_array(options.colors); 
    ctx.fill();
    ctx.stroke();
  }

  var dotLine;
  odd = true;

  for (var y = 0; y < lines.length - 1; y++) {
    odd = !odd
    dotLine = []
    for (var i = 0; i < lines[y].length; i++) {
      dotLine.push(odd ? lines[y][i]   : lines[y+1][i])
      dotLine.push(odd ? lines[y+1][i] : lines[y][i])
    }
    for (var i = 0; i < dotLine.length - 2; i++) {
      drawTriangle(dotLine[i], dotLine[i+1], dotLine[i+2])
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