import React from 'react'
import {Button} from 'react-bootstrap';

class ServiceButton extends React.Component {
  constructor (props) {
    super(props)
  }

  render () {
    return <div>
      <Button bsStyle="default" bsSize="small" onClick={() => {this.props.handleConnect()}}>
        {this.props.service.name}
      </Button>
    </div>
  }
}

export default ServiceButton