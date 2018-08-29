import React from 'react'
import {Button} from 'react-bootstrap';

class ServiceButton extends React.Component {
    constructor (props) {
        super(props)
    }

    buttonAction () {
        if (this.props.service.serviceIsAuthenticated) {
            if (window.confirm("Logout from " + this.props.service.name + "?")) {
                return this.props.handleDisconnect()
            }
        }

        return this.props.handleConnect()
    }

    render () {
        let buttonClass = this.props.service.serviceIsAuthenticated ? "btn btn-success" : "btn btn-default"

        return <div>
            <Button className={buttonClass} onClick={() => {
                this.buttonAction()
            }}>
                {this.props.service.name}
            </Button>
        </div>
    }
}

export default ServiceButton