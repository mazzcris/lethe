import React from 'react'
import Page from "./components/Page.jsx";
import TrelloDataSource from "./trelloReact.js"

class App extends React.Component {
    constructor (props) {
        super(props)
        this.state = {
            trelloIsAuthenticated: this.trelloIsAuthenticated(),
            items: []
        }
        this.trelloLogout = this.trelloLogout.bind(this);
        this.trelloIsAuthenticated = this.trelloIsAuthenticated.bind(this);
        this.connectTrello = this.connectTrello.bind(this);
        this.printTrelloData = this.printTrelloData.bind(this);
    }

    connectTrello () {
        Trello.setKey(trelloApiKey);
        Trello.authorize({
            type: 'popup',
            name: 'Lethe',
            scope: {
                read: 'true',
                write: 'true'
            },
            expiration: 'never',
            success: () => {
                this.setState({
                    trelloIsAuthenticated: this.trelloIsAuthenticated()
                })
                this.printTrelloData()
                console.log("Authenticated on Trello")
            },
            error: () => {
                console.log("Trello authentication failed");
            }
        });
    }

    printTrelloData () {
        TrelloDataSource.getItems((items) => {
            this.setState({items: items})
        }, Trello);
    }

    connectGitHub () {
        console.log('TBI: connect to Github')
    }

    connectGoogleCalendar () {
        console.log('TBI: connect to googleCalendar')
    }

    trelloIsAuthenticated () {
        return localStorage.getItem('trello_token') !== undefined && localStorage.getItem('trello_token') !== null
    }

    gitHubIsAuthenticated () {
        return false;
    }

    googleCalendarIsAuthenticated () {
        return false;
    }

    trelloLogout () {
        console.log("TRELLO LOGOUT");
        localStorage.removeItem('sortelloTrelloDevApiKey');
        localStorage.removeItem('trello_token');
        this.setState({
            trelloIsAuthenticated: this.trelloIsAuthenticated()
        })
    }

    gitHubLogout () {
        return false;
    }

    googleCalendarLogout () {
        return false;
    }



    // printAllItems (items) {
    //     items.sort(function (itemA, itemB) {
    //         if (cleanDate(itemA.date) > cleanDate(itemB.date)) {
    //             return -1
    //         }
    //         return 1
    //     })
    //
    //     var prevDay;
    //     items.forEach(function (item) {
    //         if (prevDay !== item.date.substr(0, 10)) {
    //             console.log();
    //             console.log("\x1b[39m", "## " + prettyDate(item.date) + " ##");
    //             prevDay = item.date.substr(0, 10);
    //         }
    //         if (item.source === "trello") {
    //             switch (item.type) {
    //                 case "cardMoved": {
    //                     printCardMoved(item.event)
    //                     break;
    //                 }
    //                 case "memberAdded": {
    //                     printMemberAdded(item.event)
    //                     break;
    //                 }
    //                 case "memberRemoved": {
    //                     printMemberRemoved(item.event)
    //                     break;
    //                 }
    //                 default: //console.warn('Unimplemented event type: ' + item.type)
    //             }
    //         }
    // if (item.source === "github") {
    //     switch (item.type) {
    //         case "pushEvent": {
    //             printPushEvent(item)
    //             break;
    //         }
    //         case "pullRequest": {
    //             printPullRequestEvent(item.event)
    //             break;
    //         }
    //         default: //console.warn('Unimplemented event type: ' + item.type)
    //     }
    // }
    // if (item.source === "gcalendar") {
    //     printGoogleCalendarEvent(item.event)
    // }
    // });
    // }

    render () {
        let services = [
            {
                'name': 'GitHub',
                handleConnect: this.connectGitHub,
                'serviceIsAuthenticated': this.gitHubIsAuthenticated(),
                handleDisconnect: this.gitHubLogout
            },
            {
                'name': 'Trello',
                handleConnect: this.connectTrello,
                'serviceIsAuthenticated': this.state.trelloIsAuthenticated,
                handleDisconnect: this.trelloLogout
            },
            {
                'name': 'Google Calendar',
                handleConnect: this.connectGoogleCalendar,
                'serviceIsAuthenticated': this.googleCalendarIsAuthenticated(),
                handleDisconnect: this.googleCalendarLogout
            },
        ]


        return <Page services={services} items={this.state.items}/>
    }
}

export default App