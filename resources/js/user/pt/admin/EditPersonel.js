import React from 'react';
import ReactDOM from 'react-dom';
import { SaveLabPersonel, FetchParticipantList } from '../../../components/utils/Helpers';
import { v4 as uuidv4 } from 'uuid';
import PersonelForm from './PersonelForm';


class EditPersonel extends React.Component {

    constructor(props) {
        super(props);

    }

    componentDidMount() {

    }

    render() {

        return (
            <React.Fragment>
                <PersonelForm />
            </React.Fragment>
        );
    }

}

export default EditPersonel;

if (document.getElementById('edit_personel')) {
    ReactDOM.render(<EditPersonel />, document.getElementById('edit_personel'));
}