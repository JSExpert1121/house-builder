
import React from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';

class ProposalsCompare extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            busy: false
        }
    }

    render() {

        return (
            <div>Hello Compare!</div>
        )
    }
}

export default ProposalsCompare;
