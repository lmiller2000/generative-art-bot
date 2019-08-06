![Generative art!](https://botwiki.org/wp-content/uploads/2018/09/generative-art-bot-glitch-example-02.png)

# Generative art bot starter project

This starter project lets you make fun generative art bots on Mastodon and Twitter!

Here's how to use it:

1. Update `.env` with your api keys:
  - [instructions for Twitter bots](https://botwiki.org/tutorials/how-to-create-a-twitter-app/)
  - [instructions for Mastodon bots](https://botwiki.org/resource/tutorial/how-to-make-a-mastodon-botsin-space-app-bot/)
2. Check out the `examples` folder for some example code you can use inside `bot.js`.
3. Set up a free service ([Uptime Robot](https://uptimerobot.com/), [cron-job.org](https://cron-job.org/en/), or [others](https://www.google.com/search?q=free+web+cron)) to wake up your bot every [25+ minutes](https://support.glitch.com/t/a-simple-twitter-bot-template/747/16) and tweet. Use `https://PROJECT_NAME.glitch.me/BOT_ENDPOINT` as a URL to which to send the HTTP request.

To test your bot, you can remove the code that handles posting to Twitter/Mastodon, and view your generated image at [https://PROJECT-NAME.glitch.me/image](https://generative-art-bot.glitch.me/image) and [https://PROJECT-NAME.glitch.me/gif](https://generative-art-bot.glitch.me/gif) if you enable the `animate` option.

You can also update modules inside the `generators` folder to get some more interesting results. Generative art is an exploration process! Start by changing around the code, then learn more about using the canvas element on the [node-canvas Github page](https://github.com/Automattic/node-canvas) (check out some [examples](https://github.com/Automattic/node-canvas/tree/master/examples) as well).

There are more [tutorials](https://botwiki.org/tutorials/twitterbots/#tutorials-nodejs) and [open source  bots](https://botwiki.org/bot/?opensource=true) on [Botwiki](https://botwiki.org) for your inspiration.

And be sure to join the [Botmakers](https://botmakers.org/) online hangout to share what you made, and [submit your bot to Botwiki](https://botwiki.org/submit-your-bot) :-)

# Support Botwiki

- [patreon.com/botwiki](https://patreon.com/botwiki)
- [botwiki.org/about/support-us](https://botwiki.org/about/support-us)

🙇


**Powered by [Glitch](https://glitch.com)**

\ ゜o゜)ノ
