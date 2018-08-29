var params = require('./parameters.js');
var Github = require("./github.js");
var Trello = require("./trello.js");

var GoogleCalendar = require('./gcal/plugin');

var prettyDate = require('./pretty_date');

if (!params.trelloApiToken) {
  console.log(
    "You need to set your trelloApiToken in parameters.js ",
    "Please visit the following link to get your token: " +
    "https://trello.com/1/connect?key=" + params.trelloApiKey + "&expiration=never&name=Lethe&response_type=token"
  );
  return;
}


function printPushEvent (groupedEvent) {
  var item = groupedEvent;
  console.log("\x1b[39m", "|", "\x1b[33m", "In " + item.event.event.repo.name.toUpperCase() +
    ", " + item.event.event.actor.display_login.toUpperCase() +
    " pushed " + groupedEvent.event.count + " commits to " + item.event.event.payload.ref.toUpperCase());
}

function printPullRequestEvent (item) {
  if (item.event.payload.action == "closed" && item.event.payload.pull_request.merged == true) {
    console.log("\x1b[39m", "|", "\x1b[33m", "In " + item.event.repo.name.toUpperCase() +
      ", " + item.event.actor.display_login.toUpperCase() +
      " merged pull-request  " + item.event.payload.pull_request.title.toUpperCase());
  }
}

function printMemberAdded (item) {
  console.log("\x1b[39m", "|", "\x1b[36m", "In " + item.data.board.name.toUpperCase() +
    ", " + item.member.username.toUpperCase() +
    " joined the card " + item.data.card.name.toUpperCase());
}

function printMemberRemoved (item) {
  console.log("\x1b[39m", "|", "\x1b[36m", "In " + item.data.board.name.toUpperCase() +
    ", " + item.member.username.toUpperCase() +
    " left the card " + item.data.card.name.toUpperCase());
}

function printCardMoved (item) {
  console.log("\x1b[39m", "|", "\x1b[36m", "In " + item.data.board.name.toUpperCase() +
    " you moved the card " + item.data.card.name.toUpperCase() +
    " from " + item.data.listBefore.name.toUpperCase() +
    " to " + item.data.listAfter.name.toUpperCase());
}

function printGoogleCalendarEvent(item)
{
  var start = item.start.dateTime;
  var end = item.end.dateTime;
  
  var output = "\x1b[39m | \x1b[32m In GOOGLE CALENDAR, " + item.summary.toUpperCase();
  if (item.start.dateTime) {
    output += " from " + item.start.dateTime.substr(11,5)
  }
  if (item.end.dateTime) {
    output += " to " + item.end.dateTime.substr(11,5)
  }
  if (item.organizer) {
    output += " with " + item.organizer.displayName + ' (' + item.organizer.email +  ')'
  }
  
  console.log(output);
}

function init () {
  var globalItems = [];

  Trello.getItems(function (trelloItems) {
    globalItems = globalItems.concat(trelloItems);

    Github.getItems(function (githubItems) {
      globalItems = globalItems.concat(githubItems)

      GoogleCalendar.getItems(function (calendarItems) {
        globalItems = globalItems.concat(calendarItems)

        printAllItems(globalItems);
      });
    });
  });
}

function cleanDate (d) {
  return d.substr(0, 4) + d.substr(5, 2) + d.substr(8, 2);
}

function printAllItems (items) {
  items.sort(function (itemA, itemB) {
    if (cleanDate(itemA.date) > cleanDate(itemB.date)) {
      return -1
    }
    return 1
  })

  var prevDay;
  items.forEach(function (item) {
    if (prevDay !== item.date.substr(0, 10)) {
      console.log();
      console.log("\x1b[39m", "## " + prettyDate(item.date) + " ##");
      prevDay = item.date.substr(0, 10);
    }
    if (item.source === "trello") {
      switch (item.type) {
        case "cardMoved": {
          printCardMoved(item.event)
          break;
        }
        case "memberAdded": {
          printMemberAdded(item.event)
          break;
        }
        case "memberRemoved": {
          printMemberRemoved(item.event)
          break;
        }
        default: //console.warn('Unimplemented event type: ' + item.type)
      }
    }
    if (item.source === "github") {
      switch (item.type) {
        case "pushEvent": {
          printPushEvent(item)
          break;
        }
        case "pullRequest": {
          printPullRequestEvent(item.event)
          break;
        }
        default: //console.warn('Unimplemented event type: ' + item.type)
      }
    }
    if (item.source === "gcalendar") {
      printGoogleCalendarEvent(item.event)
    }
  });
}

init();
