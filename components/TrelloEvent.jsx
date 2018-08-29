import React from 'react'
import {Alert} from 'react-bootstrap'

class TrelloEvent extends React.Component {
    constructor (props) {
        super(props)
    }

    render () {
        let event = this.props.item.event

        if (this.props.item.type === "cardMoved") {
            return <div>
                <Alert>In&nbsp;{event.data.board.name.toUpperCase()}
                    &nbsp;you moved the card&nbsp;{event.data.card.name.toUpperCase()}
                    &nbsp;from&nbsp;{event.data.listBefore.name.toUpperCase()}
                    &nbsp;to&nbsp;{event.data.listAfter.name.toUpperCase()}
                </Alert>
            </div>
        }

        if (this.props.item.type === "memberAdded") {
            return <div>
                <Alert>In {event.data.board.name.toUpperCase()}
                 &nbsp;{event.member.username.toUpperCase()}&nbsp;joined the card&nbsp;{event.data.card.name.toUpperCase()}
                </Alert>
            </div>
        }

        if (this.props.item.type === "memberRemoved") {
            return <div>
                <Alert>In&nbsp;{event.data.board.name.toUpperCase()}&nbsp;
                    {event.member.username.toUpperCase()}&nbsp;left the card&nbsp;{event.data.card.name.toUpperCase()}
                </Alert>
            </div>
        }

        return <div>
            <Alert>Unimplemented event type: {this.props.item.type}</Alert>
        </div>
    }
}

export default TrelloEvent