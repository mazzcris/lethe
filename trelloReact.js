let TrelloDataSource = {
    getItems: function (cb, trelloClient) {
        let trelloEvents = [];

        trelloClient.get("/members/me/actions",
            (data) => {
                for (let i = 0; i < data.length; i++) {
                    let item = data[i];
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
            }, (err) => {
                console.log(err);
            });
    }

}

module.exports = TrelloDataSource