import React from 'react'
import Page from "./components/Page.jsx";

class App extends React.Component {

    connectGitHub(){
        console.log('TBI: connect to gitHub')
    }

    connectTrello(){
        console.log('TBI: connect to trello')
    }

    connectGoogleCalendar(){
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