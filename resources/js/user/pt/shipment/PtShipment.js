import React from 'react';
import ReactDOM from 'react-dom';
import { FetchSubmissions } from '../../../components/utils/Helpers';
import { v4 as uuidv4 } from 'uuid';
import AddShipement from './AddShipment';
import ListShipment from './ListShipment';
import EditShipment from './EditShipment';


class PtShipment extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            newShipmentButtonText: 'Add new PT shipment',
            shipmentId: null,
            currentPage: 'list'
        }
        this.toggleView = this.toggleView.bind(this);
    }

    componentDidMount() {

    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.currentPage !== this.state.currentPage) {
            return true;
        }
    }

    toggleView(page, shipmentId) {

        if (page == 'edit') {
            this.setState({
                shipmentId: shipmentId,
                currentPage: 'edit'
            })
        } else if (page == 'add') {
            this.setState({
                currentPage: 'add'
            })
        } else if (page == 'list') {
            this.setState({
                currentPage: 'list'
            })
        }

    }

    render() {

        return (
            <React.Fragment>
                <div id='user_table' className='row'>
                    <div className="col-sm-12 mb-3 mt-3">
                        {this.state.currentPage == 'add' ? <h3 className="float-left">New Shipment</h3> : ''}
                        {this.state.currentPage == 'edit' ? <h3 className="float-left">Edit Shipment</h3> : ''}
                        {this.state.currentPage == 'list'
                            ? <h3 className="float-left">All Shipments</h3> : ''}
                        <a style={{ "color": "white" }}
                            onClick={

                                () => {
                                    if (this.state.currentPage == 'edit' || this.state.currentPage == 'add') {
                                        this.toggleView('list');
                                    } else {
                                        this.toggleView('add');
                                    }
                                }
                            }
                            type="button" href="#"
                            className="btn btn-info 
                float-right">{this.state.currentPage == 'edit' || this.state.currentPage == 'add' ?
                                'Close open shipment' : 'Add new PT shipment'}</a>
                    </div>
                </div>
                {this.state.currentPage == 'add' ? <AddShipement toggleView={this.toggleView} /> : ''}
                {this.state.currentPage == 'edit' ? <EditShipment id={this.state.shipmentId} toggleView={this.toggleView} /> : ''}
                {
                    this.state.currentPage == 'list' ?
                        // <ListShipment isShowEditShipmentPage={this.state.isShowEditShipmentPage} toggleView={this.toggleView} isShowNewShipmentPage={this.state.isShowNewShipmentPage} /> 
                        <ListShipment
                            // page='report'
                            filterEmpty={0}
                            isParticipant={false} userId={'156f41ed97'} isShowEditShipmentPage={this.state.isShowEditShipmentPage}
                            toggleView={this.toggleView} isShowNewShipmentPage={this.state.isShowNewShipmentPage} />
                        :
                        ''
                }

            </React.Fragment>
        );
    }

}

export default PtShipment;

if (document.getElementById('pt_shipment')) {
    ReactDOM.render(<PtShipment />, document.getElementById('pt_shipment'));
}