var params = require('./parameters');
var TrelloClient = require("node-trello");

Trello = {
  getItems: function (cb) {
    var t = new TrelloClient(params.trelloApiKey, params.trelloApiToken);
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

}

module.exports = Trello