import React from 'react'
import {Button} from 'react-bootstrap';

class ServiceButton extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      'connected': 'false'
    }
    this.connectService = this.connectService.bind(this)
  }

  connectService(){
    console.log("should connect")
  }

  render () {
    return <div>
      <Button bsStyle="default" bsSize="small" onClick={() => {this.connectService()}}>
        {this.props.data.name}
      </Button>
    </div>
  }
}

export default ServiceButton