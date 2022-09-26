import React from 'react';
import ReactDOM from 'react-dom';

class Dashboard extends React.Component {

    constructor(props) {
        super(props);
        this.state = {

        }
    }

    componentDidMount() {

    }

    render() {


        return (
            <React.Fragment>
                <div>PT access not allowed</div>
            </React.Fragment>
        );
    }

}

export default Dashboard;

if (document.getElementById('general-dashboard')) {
    ReactDOM.render(<Dashboard />, document.getElementById('general-dashboard'));
}