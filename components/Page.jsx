import React from 'react'
import ServiceButton from "./ServiceButton";
import {ButtonToolbar} from 'react-bootstrap'
import TrelloEvent from './TrelloEvent'

class Page extends React.Component {

    cleanDate (d) {
        return d.substr(0, 4) + d.substr(5, 2) + d.substr(8, 2);
    }

    render () {

        let component = this;

        let items = this.props.items.sort(function (itemA, itemB) {
            if (component.cleanDate(itemA.date) > component.cleanDate(itemB.date)) {
                return -1
            }
            return 1
        })

        let buttons = this.props.services.map((service, index) =>
            <ServiceButton key={index} service={service} handleConnect={service.handleConnect}
                           handleDisconnect={service.handleDisconnect}/>
        );
        return <div>
            <ButtonToolbar className={"button-toolbar"}>
                {buttons}
            </ButtonToolbar>
            {items.map((item,index) => (
                <TrelloEvent key={index} item={item}/>
            ))}
        </div>
    }
}

export default Page