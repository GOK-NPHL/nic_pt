import React from 'react';
import ReactDOM from 'react-dom';
import { v4 as uuidv4 } from 'uuid';
import Pagination from "react-js-pagination";
import { FetchShipmentResponses } from '../../../components/utils/Helpers';
import { matchPath } from "react-router";
import ShipmentResponses from './ShipmentResponses';

class ListShipmentResponse extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            // data: [],
            // shipmentId: null
        }
        // this.handlePageChange = this.handlePageChange.bind(this)
    }

    componentDidMount() {

        // let pathname = window.location.pathname;

        // let pathObject = matchPath(pathname, {
        //     path: `/get-shipment-responses/:shipmentId`,
        // });

        // if (this.props.page == 'report') {
        //     pathObject = matchPath(pathname, {
        //         path: `/get-shipment-report-responses/:shipmentId`,
        //     });

        // }

        // if (pathObject) {
        //     this.setState({
        //         data: response,
        //         shipmentId: pathObject.params.shipmentId
        //     });
        // }

    }


    render() {
        return (
            <React.Fragment>
                <ShipmentResponses page={'report'} userId={this.props.userId} />
            </React.Fragment>
        );
    }

}

export default ListShipmentResponse;

if (document.getElementById('list_shipment_response')) {
    ReactDOM.render(<ListShipmentResponse />, document.getElementById('list_shipment_response'));
}