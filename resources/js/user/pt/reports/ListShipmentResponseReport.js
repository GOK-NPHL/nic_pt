import React from 'react';
import ReactDOM from 'react-dom';
import { v4 as uuidv4 } from 'uuid';
import Pagination from "react-js-pagination";
import { FetchShipmentResponses } from '../../../components/utils/Helpers';
import { matchPath } from "react-router";
import ListShipmentResponse from '../shipment/ListShipmentResponse';

class ListShipmentResponseReport extends React.Component {

    constructor(props) {
        super(props);
        this.state = {

        }
    }

    render() {

        return (
            <React.Fragment>
                <ListShipmentResponse page={'report'}/>
            </React.Fragment>
        );
    }

}

export default ListShipmentResponseReport;

if (document.getElementById('list_shipment_response_report')) {
    ReactDOM.render(<ListShipmentResponseReport />, document.getElementById('list_shipment_response_report'));
}