import React from 'react'
import ServiceButton from "./ServiceButton";
import {ButtonToolbar} from 'react-bootstrap'

class Page extends React.Component {
    render () {
        let buttons = this.props.buttons.map((button, index) =>
            <ServiceButton key={index} data={button} />
        );
        return <div>
            <ButtonToolbar className={"button-toolbar"}>
                {buttons}
            </ButtonToolbar>
        </div>
    }
}

export default Page