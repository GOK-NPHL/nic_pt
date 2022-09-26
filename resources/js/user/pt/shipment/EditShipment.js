import React from 'react';
import { FetchParticipantList, SaveShipment, FetchReadiness } from '../../../components/utils/Helpers';
import { v4 as uuidv4 } from 'uuid';
import DualListBox from 'react-dual-listbox';
import './PtShipment.css';

import ReactTooltip from 'react-tooltip';
import ShipmentForm from './ShipmentForm';

class EditShipment extends React.Component {

    constructor(props) {
        super(props);
        this.state = {

        }

    }

    render() {

        return (
            <React.Fragment>
                <ShipmentForm pageState='edit' toggleView={this.props.toggleView} id={this.props.id} />
            </React.Fragment>
        );
    }

}

export default EditShipment;