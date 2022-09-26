import React from 'react';
import ReactDOM from 'react-dom';
import ParticipantForm from './ParticipantForm';


class EditLab extends React.Component {

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

export default EditLab;

if (document.getElementById('edit_lab')) {
    ReactDOM.render(<EditLab />, document.getElementById('edit_lab'));
}