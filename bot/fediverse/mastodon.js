var fs = require('fs'),
    Mastodon = require('mastodon'),
    M;

try {
  M = new Mastodon({
    'access_token': process.env.MASTODON_ACCESS_TOKEN,
    'api_url': process.env.MASTODON_API || 'https://mastodon.social/api/v1/'
  });
  // console.log('ready to toot...');
} catch(err) {
  console.error(err);
  console.error('please update your .env file with your Mastodon access token')
}

module.exports = {
  M: M,
  toot: function(status, cb){
    if (!M){
      console.error('please update your .env file')
      return false;
    }
    if (status.length > 500){
      console.error(`status too long: ${status}`);
      return false;
    }

    console.log('tooting...');
    M.post('statuses', { status: status }, function(err, data, response) {
      console.log(`posted status: ${status}`);
      if (cb){
        cb(err, data);
      }
    });
  },
  reply: function(status, response, cb){
    if (!M){
      console.error('please update your .env file')
      return false;
    }
    if (response.length > 500){
      console.error(`status too long: ${response}`);
      return false;
    }

    console.log('responding...');

    M.post('statuses', { 
      in_reply_to_id: status.id,
      spoiler_text: status.spoiler_text,
      visibility: status.visibility,
      status: response
    }, function(err, data, response) {
      if (cb){
        cb(err, data);
      }
    });
  },
  get_notifications: function(cb){
    M.get('notifications', function(err, notifications){
      if (cb){
        cb(err, notifications);
      }
    });  
  },
  dismiss_notification: function(notification, cb){
    if (notification && notification.id){
      M.post('notifications/dismiss', {
        id: notification.id
      }).then(function(err, data, response){
        if (cb){
          cb(err, data);
        }
      }).catch(function(err){
        console.log(err);
      });
    }
  },
  post_image: function(text, img_file, cb) {
    M.post('media', { 
      file: fs.createReadStream(img_file)
    }, function (err, data, response) {
      if (err){
        console.log('ERROR:\n', err);
        if (cb){
          cb(err, data);
        }
      }
      else{
        // console.log(data);
        console.log('tooting the image...');
        M.post('statuses', {
          status: text,
          // media_ids: new Array(data.media_id_string)
          media_ids: new Array(data.id)
        },
        function(err, data, response) {
          if (err){
            console.log('ERROR:\n', err);
            if (cb){
              cb(err, data);
            }
          }
          else{
            if (cb){
              cb(null, data);
            }
          }
        });
      }
    });
  }  
}
