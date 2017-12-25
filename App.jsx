import React from 'react'
import ServiceButton from "./components/ServiceButton.jsx";
import {ButtonToolbar} from 'react-bootstrap'

class App extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      'buttons': [
        {'name': 'GitHub'},
        {'name': 'Trello'},
        {'name': 'Google Calendar'},
      ]
    }
  }

  render () {
    let buttons = this.state.buttons.map((button, index) =>
      <ServiceButton key={index} data={button}></ServiceButton>
    );
    return <div>
      <ButtonToolbar className={"button-toolbar"}>
        {buttons}
      </ButtonToolbar>
    </div>
  }
}

export default App