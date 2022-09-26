import React from 'react';
import ReactDOM from 'react-dom';
import ParticipantForm from './ParticipantForm';


class AddLab extends React.Component {

    constructor(props) {
        super(props);

        
    }

    componentDidMount() {

    }

    render() {

        return (
            <React.Fragment>
                <ParticipantForm />
            </React.Fragment>
        );
    }

}

export default AddLab;

if (document.getElementById('add_lab')) {
    ReactDOM.render(<AddLab />, document.getElementById('add_lab'));
}