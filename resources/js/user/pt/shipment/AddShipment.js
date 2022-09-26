import React from 'react';
import { FetchParticipantList, SaveShipment, FetchReadiness } from '../../../components/utils/Helpers';
import { v4 as uuidv4 } from 'uuid';
import DualListBox from 'react-dual-listbox';
import './PtShipment.css';

import ReactTooltip from 'react-tooltip';
import ShipmentForm from './ShipmentForm';

class AddShipement extends React.Component {

    constructor(props) {
        super(props);
        this.state = {

        }

    }

    render() {

        return (
            <React.Fragment>
                <ShipmentForm pageState='add' toggleView={this.props.toggleView}/>
            </React.Fragment>
        );
    }

}

export default AddShipement;