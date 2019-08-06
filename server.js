/*
  Use the bot.js file to update your bot.
*/

var express = require('express'),
    app = express(),
    bot = require(__dirname + '/bot.js');

app.use(express.static('public'));

app.all(`/${process.env.BOT_ENDPOINT}`, function (req, res) {
  console.log('received a request...');
  res.sendStatus(200); /* Send a 200 response immediately to avoid timeouts. */
  bot(); /* Run the code inside bot.js. */
});

app.use('/image/', express.static('./.data/temp.png'));
app.use('/gif/', express.static('./.data/temp.gif'));

var listener = app.listen(process.env.PORT, function () {
  console.log(`your app is listening on port ${listener.address().port}`);
});
