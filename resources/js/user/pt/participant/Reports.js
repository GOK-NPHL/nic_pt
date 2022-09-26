import React from 'react';
import ReactDOM from 'react-dom';
import { FetchuserId } from '../../../components/utils/Helpers';
import { matchPath } from "react-router";
import { v4 as uuidv4 } from 'uuid';
import ReadinessQuestions from './ReadinessQuestions';
import ListShipment from '../shipment/ListShipment';


class Reports extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            userId: null
        }

    }

    componentDidMount() {

        (async () => {

            let response = await FetchuserId();

            if (response.status == 500) {
                this.setState({
                    message: response.data.Message,
                })
                // $('#readinessReponseModal').modal('toggle');
            } else {

                this.setState({
                    userId: response.user_id
                });

            }
        })();
    }



    render() {

        return (
            <React.Fragment>
                <h3>Shipments Reports</h3>
                <ListShipment
                    page='report'
                    filterEmpty={1}
                    isParticipant={true} userId={this.state.userId} isShowEditShipmentPage={false} toggleView={() => { }} isShowNewShipmentPage={false} /> :
            </React.Fragment>
        );

    }
}

export default Reports;

if (document.getElementById('user_reports')) {
    ReactDOM.render(<Reports />, document.getElementById('user_reports'));
}