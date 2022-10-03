import React from 'react';
import ReactDOM from 'react-dom';
import { v4 as uuidv4 } from 'uuid';
import Pagination from "react-js-pagination";
import { FetchShipments } from '../../../components/utils/Helpers';


class ListShipment extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            data: [],
            currElementsTableEl: [],
            allTableElements: [],
            selectedElement: null,
            allowedPermissions: [],
            userActionState: 'userList',
            startTableData: 0,
            endeTableData: 10,
            activePage: 1,
        }
        this.handlePageChange = this.handlePageChange.bind(this)
    }

    componentDidMount() {
        this.fetchListing();
    }

    fetchListing() {
        (async () => {
            let response = await FetchShipments(this.props.userId, this.props.filterEmpty);
            this.setState({
                data: response
            });
        })();
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.currentPage !== this.props.currentPage) {
            this.fetchListing(this.props.userId);
        }

        if (prevProps.userId !== this.props.userId) {
            this.fetchListing(this.props.userId);
        }
    }

    handlePageChange(pageNumber) {
        console.log(`active page is ${pageNumber}`);
        let pgNumber = pageNumber * 10 + 1;
        this.setState({
            startTableData: pgNumber - 11,
            endeTableData: pgNumber - 1,
            activePage: pageNumber
        });
    }

    updatedSearchItem(currElementsTableEl) {
        this.setState({
            currElementsTableEl: currElementsTableEl,
            activePage: 1,
            startTableData: 0,
            endeTableData: 10,
        })
    }

    render() {
        const imgStyle = {
            width: "100%"
        };

        const rowStle = {
            marginBottom: "5px"
        };

        let tableElem = [];

        if (this.state.data.length > 0) {

            this.state.data.map((element, index) => {
                tableElem.push(<tr key={index}>
                    <th scope="row">{index + 1}</th>
                    <td>{element.round_name}</td>
                    <td>{element.shipment_code}</td>
                    <td>{element.pass_mark}</td>
                    {this.props.isParticipant == true ? null : <td>{element.participant_count}</td>}
                    <td>{new Date(element.last_update).toLocaleString('en-GB')}</td>
                    {

                        <td>
                            {
                                this.props.isParticipant ?
                                    <a
                                        onClick={() => {
                                            window.location.assign('/get-participant-shipment-response-performance/' + element.id)
                                        }}
                                        data-toggle="tooltip" data-placement="top" title="View performance report"
                                        style={{ 'marginRight': '5px' }}
                                        className="d-none d-sm-inline-block btn btn-sm btn-info shadow-sm text-white">
                                        <i className="fas fa-file-pdf"></i> Performance
                                    </a>
                                    :
                                    <a
                                        onClick={() => {
                                            this.props.page != 'report' ?
                                                window.location.assign('get-shipment-responses/' + element.id) :
                                                window.location.assign('get-shipment-report-responses/' + element.id)
                                        }}
                                        style={{ 'marginRight': '5px' }}
                                        data-toggle="tooltip" data-placement="top" title="View shipment responses"
                                        className="d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm text-white">
                                        <i className="fas fa-file"></i> View
                                    </a>
                            }
                            {
                                this.props.page != 'report' ?
                                    <a href="#"
                                        onClick={
                                            () => {
                                                console.log(element);
                                                this.props.toggleView('edit', element.id);
                                            }
                                        }
                                        className="d-none d-sm-inline-block btn btn-sm btn-info shadow-sm text-white">
                                        <i className="fas fa-edit"></i> Edit
                                    </a> : ''
                            }


                        </td>
                    }

                </tr>
                );
            });
            if (this.state.allTableElements.length == 0) {
                this.setState({
                    allTableElements: tableElem,
                    currElementsTableEl: tableElem
                })
            }

        }


        let pageContent = <div id='user_table' className='row'>
            {this.props.isShowNewShipmentPage ? <div className="col-sm-12 mb-3 mt-3"><h3 className="float-left">All Shipments</h3> </div> : ''}
            <div className='col-sm-12 col-md-12'>
                <div className="form-group mb-2">
                    <input type="text"
                        onChange={(event) => {
                            console.log(this.state.allTableElements);
                            let currElementsTableEl = this.state.allTableElements.filter(elemnt =>
                                elemnt['props']['children'][1]['props']['children'].toLowerCase().trim().includes(event.target.value.trim().toLowerCase()) ||
                                elemnt['props']['children'][2]['props']['children'].toLowerCase().trim().includes(event.target.value.trim().toLowerCase())
                            );
                            this.updatedSearchItem(currElementsTableEl);
                        }}
                        className="form-control" placeholder="search shipment"></input>
                </div>

                <table className="table table-striped table-sm  table-hover">
                    <thead>
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">Round Name</th>
                            <th scope="col">Shipment Code</th>
                            <th scope="col">Pass Mark</th>
                            {this.props.isParticipant==true ? null : <th scope="col">Participant Count</th>}
                            <th scope="col">Last Update</th>
                            <th scope="col">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.currElementsTableEl.slice(this.state.startTableData, this.state.endeTableData)}
                    </tbody>

                </table>
                <br />
                <Pagination
                    itemClass="page-item"
                    linkClass="page-link"
                    activePage={this.state.activePage}
                    itemsCountPerPage={10}
                    totalItemsCount={this.state.currElementsTableEl.length}
                    pageRangeDisplayed={5}
                    onChange={this.handlePageChange.bind(this)}
                />
            </div>
        </div>;

        return (
            <React.Fragment>
                {this.props.isShowEditShipmentPage ? <hr /> : ""}
                {this.props.isShowEditShipmentPage ? <h3>All Shipments</h3> : ""}
                {pageContent}
            </React.Fragment>
        );
    }

}

export default ListShipment;