var params = require('./parameters');
var GitHubApi = require("github");
var Promise = require('bluebird');
var githubUsername = null;
var githubPassword = null;

if (!params.trelloApiToken) {
  console.log(
    "You need to set your trelloApiToken in parameters.js ",
    "Please visit the following link to get your token: " +
    "https://trello.com/1/connect?key=" + params.trelloApiKey + "&expiration=never&name=Lethe&response_type=token"
  );
  return;
}
var Trello = require("node-trello");
var t = new Trello(params.trelloApiKey, params.trelloApiToken);

function printTrelloEvents () {
  t.get("/1/members/me/actions", function (err, data) {
    if (err) console.log(err);
    var prevDate = "0000-00-00";
    for (var i = 0; i < data.length; i++) {
      var item = data[i];
      var currDate = item.date;
      if (item.data.listAfter !== undefined) {
        printCardMoved(item, prevDate, currDate);
        addEmptyLineIfNewDay(prevDate, currDate);
        prevDate = currDate;
      }
      if (item.type == "addMemberToCard") {
        printMemberAdded(item, prevDate, currDate);
        addEmptyLineIfNewDay(prevDate, currDate);
        prevDate = currDate;
      }
      if (item.type == "removeMemberFromCard") {
        printMemberRemoved(item, prevDate, currDate);
        addEmptyLineIfNewDay(prevDate, currDate);
        prevDate = currDate;
      }
    }
  });
}

function printMemberAdded (item) {
  console.log(prettyDate(item.date) + ": In " + item.data.board.name.toUpperCase() +
    ", " + item.member.username.toUpperCase() +
    " joined the card " + item.data.card.name.toUpperCase());
}

function printMemberRemoved (item) {
  console.log(prettyDate(item.date) + ": In " + item.data.board.name.toUpperCase() +
    ", " + item.member.username.toUpperCase() +
    " left the card " + item.data.card.name.toUpperCase());
}

function printCardMoved (item) {
  console.log(prettyDate(item.date) + ": In " + item.data.board.name.toUpperCase() +
    " you moved the card " + item.data.card.name.toUpperCase() +
    " from " + item.data.listBefore.name.toUpperCase() +
    " to " + item.data.listAfter.name.toUpperCase());
}

function prettyDate (date) {
  var months = ["jan", "feb", "mar", "apr", "may", "jun",
    "jul", "aug", "sep", "oct", "nov", "dec"
  ];

  return date.substr(8, 2) + months[parseInt(date.substr(5, 2) - 1)];
}

function getDateWithoutTime (dateTimeStr) {
  var dateTime = new Date(dateTimeStr)
  var year = dateTime.getFullYear()+"";
  var month = (dateTime.getMonth()+1)+"";
  var day = dateTime.getDate();
  if(day < 10) {
    day = "0"+day
  } else {
    day = day + ""
  }
  return year + "-" + month + "-" + day;
}

function addEmptyLineIfNewDay (prevDate, currDate) {
  if (prevDate.substr(8, 2) != currDate.substr(8, 2)) {
    console.log();
  }
}


function printGithubEvents () {

  var github = new GitHubApi({
    debug: false,
    Promise: Promise,
    timeout: 5000,
    host: 'api.github.com',
    protocol: "https"
  });

  var pushEvents = {}
  var allEvents = []

  github.authenticate({
    type: "basic",
    username: githubUsername,
    password: githubPassword
  });
  github.activity.getEventsForUser({
    username: githubUsername,
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
      switch(item.type) {
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
    groupedPushEvents.forEach(function(eventKey) {
      allEvents.push(pushEvents[eventKey])
    })

    allEvents.sort(function(eventA, eventB) {
      return eventB.event.id - eventA.event.id
    })

    allEvents.forEach(function(item) {
      switch(item.event.type) {
        case "PushEvent": {
          printPushEvent(item);
          break;
        }
        case "PullRequestEvent": {
          printPullRequestEvent(item.event)
          break;
        }
      }
    })
  });

  function aggregatePullEvent(event) {
    allEvents.push({ event: event })
  }

  function aggregatePushEvent(event) {
    var eventCreatedAt = getDateWithoutTime(event.created_at);
    var eventRepoId = event.repo.id;
    var eventActorId = event.actor.id;
    var eventRef = event.payload.ref.toUpperCase();

    var eventKey = eventCreatedAt + '::' + eventRepoId + '::' + eventActorId + '::' + eventRef;

    var payloadSize = event.payload.size;

    var previousEvent = pushEvents[eventKey]

    if(previousEvent) {
      payloadSize = payloadSize + previousEvent.count
    }

    pushEvents[eventKey] = { event: event, count: payloadSize }
  }
}

function printError(error) {
  console.error('ERROR:',error);
}

function printPushEvent (groupedEvent) {
  var item = groupedEvent.event;
  console.log(prettyDate(item.created_at) + ": In " + item.repo.name.toUpperCase() +
    ", " + item.actor.display_login.toUpperCase() +
    " pushed " + groupedEvent.count + " commits to " + item.payload.ref.toUpperCase());
}

function printPullRequestEvent (item) {
  if (item.payload.action == "closed" && item.payload.pull_request.merged == true) {
    console.log(prettyDate(item.payload.pull_request.merged_at) + ": In " + item.repo.name.toUpperCase() +
      ", " + item.actor.display_login.toUpperCase() +
      " merged pull-request  " + item.payload.pull_request.title.toUpperCase());
  }
}

function getCredentials () {

  var readlineSync = require('readline-sync');

  githubUsername = readlineSync.question('Github Username: ');
  githubPassword = readlineSync.question('Github Password: ', {
    hideEchoBack: true
  });
  printTrelloEvents();
  console.log();
  printGithubEvents();
}


getCredentials();

