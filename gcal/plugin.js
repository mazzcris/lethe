var fs = require('fs');
var readline = require('readline');
var google = require('googleapis');
var googleAuth = require('google-auth-library');
var prettyDate = require('../pretty_date');

var params = require('../parameters');

GoogleCalendar = {
  // If modifying these scopes, delete your previously saved credentials
  // at ~/.credentials/parameters.js
  SCOPES: ['https://www.googleapis.com/auth/calendar.readonly'],


  getItems: function(cb)
  {
    // Load client secrets from a local file.
    fs.readFile('config/gcal_client_secret.json', function processClientSecrets(err, content) {
      if (err) {
        console.error('Error loading client secret file: ' + err);
        return;
      }
      // Authorize a client with the loaded credentials, then call the
      // Google Calendar API.
      this.authorize(JSON.parse(content), function(auth) {
        this.listLastTwoWeeksEvents(auth, cb)
      }.bind(this));
    }.bind(this));
  },

  /**
   * Create an OAuth2 client with the given credentials, and then execute the
   * given callback function.
   *
   * @param {Object} credentials The authorization client credentials.
   * @param {function} callback The callback to call with the authorized client.
   */
  authorize: function(credentials, callback) {
    var clientSecret = credentials.installed.client_secret;
    var clientId = credentials.installed.client_id;
    var redirectUrl = credentials.installed.redirect_uris[0];
    var auth = new googleAuth();
    var oauth2Client = new auth.OAuth2(clientId, clientSecret, redirectUrl);

    if (!params.googleCalendarToken) {
      this.getNewToken(oauth2Client, callback);
    } else {
      oauth2Client.credentials = params.googleCalendarToken;
      callback(oauth2Client);
    }
  },

  /**
   * Get and store new token after prompting for user authorization, and then
   * execute the given callback with the authorized OAuth2 client.
   *
   * @param {google.auth.OAuth2} oauth2Client The OAuth2 client to get token for.
   * @param {getEventsCallback} callback The callback to call with the authorized
   *     client.
   */
  getNewToken: function(oauth2Client, callback) {
    let that = this;
    var authUrl = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: this.SCOPES
    });
    console.log('Authorize this app by visiting this url: ', authUrl);
    var rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    rl.question('Enter the code from that page here: ', function(code) {
      rl.close();
      oauth2Client.getToken(code, function(err, token) {
        if (err) {
          console.error('Error while trying to retrieve access token', err);
          return;
        }
        oauth2Client.credentials = token;
        that.storeToken(token);
        callback(oauth2Client);
      });
    });
  },

  /**
   * Store token to disk be used in later program executions.
   *
   * @param {Object} token The token to store to disk.
   */
  storeToken: function(token) {
    fs.appendFile('parameters.js', '\nexports.googleCalendarToken = '+JSON.stringify(token), function (err) {
      if (err) throw err;
      console.log('Token stored to parameters.js file!');
    });
  },

  removeTokenFromParams: function() {
      var fileName = 'parameters.js'
      var strToRemove =  'googleCalendarToken'

      fs.readFile(fileName, 'utf8', function(err, data){
          let splitArray = data.split('\n');
          splitArray.splice(splitArray.indexOf(strToRemove), 1);
          let result = splitArray.join('\n');
          fs.writeFile(fileName, result)
      })
  },

  /**
   * Lists the next 10 events on the user's primary calendar.
   *
   * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
   */
  listLastTwoWeeksEvents: function(auth, cb) {
    var plugin = this;
    var calendar = google.calendar('v3');
    var firstEventDate = new Date();
    firstEventDate.setDate(firstEventDate.getDate() - 15);
    calendar.events.list({
      auth: auth,
      calendarId: 'primary',
      timeMin: firstEventDate.toISOString(),
      timeMax: (new Date()).toISOString(),
      maxResults: 20,
      singleEvents: true,
      orderBy: 'startTime'
    }, function(err, response) {
      if (err) {
        plugin.removeTokenFromParams()
        console.log('The API returned an error: ' + err);
        return;
      }
      var events = response.items;
      var gcalEvents = [];
      if (events.length) {
        for (var i = 0; i < events.length; i++) {
          var event = events[i];
          var start = event.start.dateTime || event.start.date;
          gcalEvents.push({source: 'gcalendar', date: start, type: 'event', event: event});
        }
      }

      cb(gcalEvents);
    });
  }
}

module.exports = GoogleCalendar