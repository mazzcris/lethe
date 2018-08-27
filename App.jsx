import React from 'react'
import Page from "./components/Page.jsx";
import Trello from 'trello'

class App extends React.Component {

    connectGitHub () {
        let that = this;
        this.props.Trello.setKey(trelloApiKey);
        this.props.Trello.authorize({
            type: 'popup',
            name: 'Sortello',
            scope: {
                read: 'true',
                write: 'true'
            },
            expiration: 'never',
            success: that.authenticationSuccess,
            error: that.authenticationFailure
        });
        authenticationSuccess()
        {
            console.log("Authenticated on Trello")
        }
        authenticationFailure()
        {
            console.log("Trello authentication failed");
        }
    }

    connectTrello () {
        console.log('TBI: connect to trello')
    }

    connectGoogleCalendar () {
        console.log('TBI: connect to googleCalendar')
    }

    render () {
        let services = [
            {'name': 'GitHub', handleConnect: this.connectGitHub},
            {'name': 'Trello', handleConnect: this.connectTrello},
            {'name': 'Google Calendar', handleConnect: this.connectGoogleCalendar},
        ]
        return <Page services={services}/>
    }
}

export default App