import React from 'react';
import {configure, shallow} from 'enzyme';
import Page from '../components/Page'
import ServiceButton from '../components/ServiceButton'
import Adapter from 'enzyme-adapter-react-16';

configure({adapter: new Adapter()});

describe("App", () => {
    it('Shows services buttons', () => {
        let wrapper = shallow(<Page {...props}/>)
        expect(wrapper.find(ServiceButton).length).toBe(3);
    })
})

const props = {
    services: [
        {'name': 'GitHub'},
        {'name': 'Trello'},
        {'name': 'Google Calendar'},
    ]
}