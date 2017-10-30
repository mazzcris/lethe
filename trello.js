var params = require('./parameters');
var TrelloClient = require("node-trello");
var TrelloFetcher = require("trello-fetcher")

const fetchTrelloURL = new TrelloFetcher({
      key: params.trelloApiKey,
      token: params.trelloApiToken
    });

function asyncFunc(e){
  return fetchTrelloURL("boards/"+e.id+"/actions");
}    
function boardFetcher(arr, final){
  return arr.reduce((promise, board) => {
    return promise
      .then((result) => {
        return asyncFunc(board).then(result => final.push(result));
      })
      .catch(console.error);
  }, Promise.resolve());
}

Trello = {
  
  getItems: function (cb) {
    var t = new TrelloClient(params.trelloApiKey, params.trelloApiToken);
    var trelloEvents=[],allActions = [];
    var username = "";
    t.get("/1/member/me", function(err, data){
      if(err) console.log(err);
      username = data.username;
      var boards = [];
      fetchTrelloURL("/member/me/boards").then(function(data){
        for(var i =0; i< data.length; i++){
          boards.push(data[i]);
        }
      }).then(()=>{
        boardFetcher(boards, allActions).then(() => {
          for(var i=0;i<allActions.length;i++){
            var board = allActions[i];
            for(var j = 0; j< board.length;j++){
              var item = board[j];
              if (item.data.listAfter !== undefined) {
                trelloEvents.push({source: 'trello', date: item.date, type: 'cardMoved', event: item});
              }
              if (item.type == "addMemberToCard" && item.member.username === username) {
                trelloEvents.push({source: 'trello', date: item.date, type: 'memberAdded', event: item});
              }
              if (item.type == "removeMemberFromCard" && item.member.username === username) {
                trelloEvents.push({source: 'trello', date: item.date, type: 'memberRemoved', event: item});
              }
            }
          }
          cb(trelloEvents);
        });
      })
      .catch(err => {
        console.log(err);
      });
      

    });

  }

}

module.exports = Trello