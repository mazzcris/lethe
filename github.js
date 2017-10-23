var GitHubApi = require("github");
var params = require('./parameters');
var Promise = require('bluebird');

Github = {
  getItems: function (cb) {
    var github = new GitHubApi({
      debug: false,
      Promise: Promise,
      timeout: 5000,
      host: 'api.github.com',
      protocol: "https"
    });

    var pushEvents = {}
    var allEvents = []

    // oauth
    github.authenticate({
      type: "oauth",
      token: params.gitHubToken
    });
    github.activity.getEventsForUser({
      username: params.githubUsername,
      page: 0,
      per_page: 50
    }, function (err, res) {

      if (err) {

        if (err.code == 401) {
          printError('Wrong username or password for github account');
          return;
        }

        printError(error.message);
        return;
      }

      for (var i = 0; i < res.data.length; i++) {
        var item = res.data[i];
        switch (item.type) {
          case "PushEvent": {
            aggregatePushEvent(item);
            break;
          }
          case "PullRequestEvent": {
            aggregatePullEvent(item)
            break;
          }
          default: //console.warn('Unimplemented event type: ' + item.type)
        }
      }

      var groupedPushEvents = Object.keys(pushEvents)
      groupedPushEvents.forEach(function (eventKey) {
        allEvents.push(pushEvents[eventKey])
      })

      allEvents.sort(function (eventA, eventB) {
        return eventB.event.id - eventA.event.id
      })

      var githubEvents = [];
      allEvents.forEach(function (item) {

        switch (item.event.type) {
          case "PushEvent": {
            githubEvents.push({source: 'github', date: item.event.created_at, type: 'pushEvent', event: item});
            break;
          }
          case "PullRequestEvent": {
            githubEvents.push({source: 'github', date: item.event.created_at, type: 'pullRequest', event: item});
            break;
          }
        }
      });
      cb(githubEvents);
    });

    function aggregatePullEvent (event) {
      allEvents.push({event: event})
    }

    function aggregatePushEvent (event) {
      var eventCreatedAt = getDateWithoutTime(event.created_at);
      var eventRepoId = event.repo.id;
      var eventActorId = event.actor.id;
      var eventRef = event.payload.ref.toUpperCase();

      var eventKey = eventCreatedAt + '::' + eventRepoId + '::' + eventActorId + '::' + eventRef;

      var payloadSize = event.payload.size;

      var previousEvent = pushEvents[eventKey]

      if (previousEvent) {
        payloadSize = payloadSize + previousEvent.count
      }

      pushEvents[eventKey] = {event: event, count: payloadSize}
    }
  }
}

function getDateWithoutTime (dateTimeStr) {
  var dateTime = new Date(dateTimeStr)
  var year = dateTime.getFullYear() + "";
  var month = (dateTime.getMonth() + 1) + "";
  var day = dateTime.getDate();
  if (day < 10) {
    day = "0" + day
  } else {
    day = day + ""
  }
  return year + "-" + month + "-" + day;
}

function printError (error) {
  console.error('ERROR:', error);
}

module.exports = Github
