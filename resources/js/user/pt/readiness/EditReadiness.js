import React from 'react';
import ReactDOM from 'react-dom';
import { SaveAdminUser, FetchParticipantList, SaveReadiness } from '../../../components/utils/Helpers';
import { v4 as uuidv4 } from 'uuid';
import DualListBox from 'react-dual-listbox';
import AddReadinessQuestion from './AddReadinessQuestion';
import ReadinessForm from './ReadinessForm';

class EditReadiness extends React.Component {

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

export default EditReadiness;

if (document.getElementById('edit_readiness')) {
    ReactDOM.render(<EditReadiness />, document.getElementById('edit_readiness'));
}