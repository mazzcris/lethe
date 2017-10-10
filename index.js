var params = require('./parameters');

if (!params.trelloApiToken) {
  console.log(
    "You need to set your trelloApiToken in parameters.js ",
    "Please visit the following link to get your token: " +
    "https://trello.com/1/connect?key=" + params.trelloApiKey + "&expiration=never&name=Wormhole&response_type=token"
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

function addEmptyLineIfNewDay (prevDate, currDate) {
  if (prevDate.substr(8, 2) != currDate.substr(8, 2)) {
    console.log();
  }
}


function printGithubEvents(){
  console.log("TBI");
}


printTrelloEvents();
printGithubEvents();
