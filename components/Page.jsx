import React from 'react'
import ServiceButton from "./ServiceButton";
import {ButtonToolbar} from 'react-bootstrap'

class Page extends React.Component {



    render () {
        let buttons = this.props.services.map((service, index) =>
            <ServiceButton key={index} service={service} handleConnect={service.handleConnect}  />
        );
        return <div>
            <ButtonToolbar className={"button-toolbar"}>
                {buttons}
            </ButtonToolbar>
        </div>
    }
}

export default Page