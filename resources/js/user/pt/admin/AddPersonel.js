import React from 'react';
import ReactDOM from 'react-dom';
import { SaveLabPersonel, FetchParticipantList } from '../../../components/utils/Helpers';
import { v4 as uuidv4 } from 'uuid';
import PersonelForm from './PersonelForm';


class AddPersonel extends React.Component {

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

export default AddPersonel;

if (document.getElementById('add_personel')) {
    ReactDOM.render(<AddPersonel />, document.getElementById('add_personel'));
}