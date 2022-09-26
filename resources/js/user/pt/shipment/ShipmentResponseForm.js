import React from 'react';
import ReactDOM from 'react-dom';
import { v4 as uuidv4 } from 'uuid';
import Pagination from "react-js-pagination";
import { FetchSampleResponseResultById } from '../../../components/utils/Helpers';
import { matchPath } from "react-router";
import SubmitResults from '../participant/SubmitResults';

class ShipmentResponseForm extends React.Component {

    constructor(props) {
        super(props);
        this.state = {

        }
    }

    componentDidMount() {
        let pathname = window.location.pathname;
        let pathObject = matchPath(pathname, {
            path: `/get-shipment-response-form/:submissionId`,
        });

        if (pathObject) {
            (async () => {

                let response = await FetchSampleResponseResultById(pathObject.params.submissionId);

                if (response.status == 500) {
                    this.setState({
                        message: response.data.Message,
                    })
                    $('#readinessReponseModal').modal('toggle');
                } else {
                    let submission = null;
                    for (const [key, element] of Object.entries(response)) {
                        submission = element;
                    }
                    this.setState({
                        data: submission
                    });

                }
            })();
        }

    }

    render() {
        console.log(this.state.data)
        return (
            <React.Fragment>
                {this.state.data ? <SubmitResults
                    selectedElementHasSubmmisions={true}
                    shipment={this.state.data}
                    toggleView={() => { }}
                    isAdmin={true}
                /> : ''
                }
            </React.Fragment>
        );
    }

}

export default ShipmentResponseForm;

if (document.getElementById('shipment_response_form')) {
    ReactDOM.render(<ShipmentResponseForm />, document.getElementById('shipment_response_form'));
}