import React from 'react'
import Page from "./components/Page.jsx";

class App extends React.Component {
    render () {
        let buttons = [
            {'name': 'GitHub'},
            {'name': 'Trello'},
            {'name': 'Google Calendar'},
        ]
        return <Page buttons={buttons}/>
    }
}

export default App