var params = require('./parameters');
var Github = require("./github");

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

function getTrelloItems (cb) {
  var trelloEvents = [];

  t.get("/1/members/me/actions", function (err, data) {
    if (err) console.log(err);
    for (var i = 0; i < data.length; i++) {
      var item = data[i];
      if (item.data.listAfter !== undefined) {
        trelloEvents.push({source: 'trello', date: item.date, type: 'cardMoved', event: item});
      }
      if (item.type == "addMemberToCard") {
        trelloEvents.push({source: 'trello', date: item.date, type: 'memberAdded', event: item});
      }
      if (item.type == "removeMemberFromCard") {
        trelloEvents.push({source: 'trello', date: item.date, type: 'memberRemoved', event: item});
      }
    }
    cb(trelloEvents);
  });
}

function prettyDate (date) {
  var months = ["January", "February", "March", "April", "May", "Jun",
    "July", "August", "September", "October", "November", "December"
  ];

  return months[parseInt(date.substr(5, 2) - 1)].toUpperCase() + " " + date.substr(8, 2);
}

function printPushEvent (groupedEvent) {
  var item = groupedEvent;
  console.log("\x1b[39m", "|", "\x1b[33m","In " + item.event.event.repo.name.toUpperCase() +
    ", " + item.event.event.actor.display_login.toUpperCase() +
    " pushed " + groupedEvent.event.count + " commits to " + item.event.event.payload.ref.toUpperCase());
}

function printPullRequestEvent (item) {
  if (item.event.payload.action == "closed" && item.event.payload.pull_request.merged == true) {
    console.log("\x1b[39m", "|", "\x1b[33m","In " + item.event.repo.name.toUpperCase() +
      ", " + item.event.actor.display_login.toUpperCase() +
      " merged pull-request  " + item.event.payload.pull_request.title.toUpperCase());
  }
}

function printMemberAdded (item) {
  console.log("\x1b[39m", "|", "\x1b[34m","In " + item.data.board.name.toUpperCase() +
    ", " + item.member.username.toUpperCase() +
    " joined the card " + item.data.card.name.toUpperCase());
}

function printMemberRemoved (item) {
  console.log("\x1b[39m", "|", "\x1b[34m","In " + item.data.board.name.toUpperCase() +
    ", " + item.member.username.toUpperCase() +
    " left the card " + item.data.card.name.toUpperCase());
}

function printCardMoved (item) {
  console.log("\x1b[39m", "|", "\x1b[34m","In " + item.data.board.name.toUpperCase() +
    " you moved the card " + item.data.card.name.toUpperCase() +
    " from " + item.data.listBefore.name.toUpperCase() +
    " to " + item.data.listAfter.name.toUpperCase());
}

function init () {
  var globalItems = [];
  getTrelloItems(function (trelloItems) {
    globalItems = globalItems.concat(trelloItems);

    Github.getItems(function (githubItems) {
      globalItems = globalItems.concat(githubItems)
      printAllItems(globalItems);
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
  });
}

init();
