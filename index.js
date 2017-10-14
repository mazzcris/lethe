var params = require('./parameters');
var Github = require("./github");
var Trello = require("./trello");

var prettyDate = require('./pretty_date');
var gcal = require('./gcal/plugin');


if (!params.trelloApiToken) {
  console.log(
    "You need to set your trelloApiToken in parameters.js ",
    "Please visit the following link to get your token: " +
    "https://trello.com/1/connect?key=" + params.trelloApiKey + "&expiration=never&name=Lethe&response_type=token"
  );
  return;
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

=======
function init () {
  var globalItems = [];
  Trello.getItems(function (trelloItems) {
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

function printGcalEvents()
{
  gcal.run(__dirname);
}

function printError(error) {
  console.error('ERROR:',error);
}

function printPushEvent (item) {
  console.log(prettyDate(item.created_at) + ": In " + item.repo.name.toUpperCase() +
    ", " + item.actor.display_login.toUpperCase() +
    " pushed " + item.payload.size + " commits to " + item.payload.ref.toUpperCase());
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
  console.log();
  printGcalEvents();
}


getCredentials();

init();
