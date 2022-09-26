import React from 'react';
import ReactDOM from 'react-dom';
import { SaveAdminUser, FetchParticipantList, SaveReadiness } from '../../../components/utils/Helpers';
import { v4 as uuidv4 } from 'uuid';
import DualListBox from 'react-dual-listbox';
import AddReadinessQuestion from './AddReadinessQuestion';
import ReadinessForm from './ReadinessForm';

class AddReadiness extends React.Component {

    constructor(props) {
        super(props);
        this.state = {

        }

    }

    render() {


        return (
            <React.Fragment>
                <ReadinessForm />
            </React.Fragment>
        );
    }

}

export default AddReadiness;

if (document.getElementById('add_readiness')) {
    ReactDOM.render(<AddReadiness />, document.getElementById('add_readiness'));
}