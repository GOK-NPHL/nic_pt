import React from 'react';
import ReactDOM from 'react-dom';
import { v4 as uuidv4 } from 'uuid';
import Pagination from "react-js-pagination";
import { exportToExcel, FetchShipmentResponses } from '../../../components/utils/Helpers';
import { matchPath } from "react-router";

class ShipmentResponses extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            data: [],
            message: '',
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
        let pathname = window.location.pathname;

        let pathObject = matchPath(pathname, {
            path: `/get-shipment-responses/:shipmentId`,
        });

        // if (this.props.page == 'report') {
        if (!pathObject || pathObject == null) {
            pathObject = matchPath(pathname, {
                path: `/get-shipment-report-responses/:shipmentId`,
            });
        }

        if (pathObject) {
            (async () => {

                let response = await FetchShipmentResponses(pathObject.params.shipmentId, this.props.userId);

                if (response.status == 500) {
                    this.setState({
                        message: response.data.Message,
                    })
                    $('#readinessReponseModal').modal('toggle');
                } else {
                    this.setState({
                        data: response
                    });

                }
            })();
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
                    <td>{element.name}</td>
                    <td>{element.code}</td>
                    <td>{element.lab_name}</td>
                    <td>{element.created_at}</td>
                    <td>{element.updated_at}</td>
                    <td> {<span>{element.fname} {element.sname}</span>} </td>

                    {
                        //lab_id   id
                        <td>

                            {
                                this.props.page == 'report' ?
                                    <>
                                        <a
                                            onClick={() => {
                                                window.location.assign('/view-shipment-response/' + element.id + '/' + element.ptsubmission_id)
                                            }}
                                            data-toggle="tooltip" data-placement="top" title="View submission"
                                            className="d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm text-white">
                                            <i className="fas fa-file"></i> View entry
                                        </a> &nbsp;
                                        <a
                                            onClick={() => {
                                                window.location.assign('/get-shipment-response-performance/' + element.ptsubmission_id)
                                            }}
                                            data-toggle="tooltip" data-placement="top" title="View performance report"
                                            className="d-none d-sm-inline-block btn btn-sm btn-info shadow-sm text-white">
                                            <i className="fas fa-file-pdf"></i> Performance
                                        </a> &nbsp;
                                    </>
                                    :
                                    <a
                                        onClick={() => {
                                            window.location.assign('/get-shipment-response-form/' + element.ptsubmission_id)
                                        }}
                                        data-toggle="tooltip" data-placement="top" title="View responses"
                                        className="d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm">
                                        <i className="fas fa-eye"></i>
                                    </a>
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
        } else {
            tableElem.push(<tr key={1}>
                <th scope="row">{1}</th>
                <td colSpan={7}>No submissions done</td>
            </tr>)

        }



        let pageContent = <div id='user_table' className='row'>
            <div className="col-sm-12 row">
                <div className="col-sm-4 mb-3 mt-3">
                    <h3 className="float-left">Shipment response list</h3>
                </div>
                <div className="col-sm-4 mb-3 mt-3">
                    <button type="button" className="btn btn-success btn-sm mx-1" onClick={() => {
                        if (this.state.data && Object.values(this.state.data).length > 0) {
                            let final_data = Object.values(this.state.data).map(element => {
                                return {
                                    'round name': element.name,
                                    'participant name': element.lab_name,
                                    'date responded': element.created_at,
                                    'respondent name': `${element.fname || ''} ${element.sname || ''}`,
                                    'email': `${element.email || ''}`
                                }
                            })
                            exportToExcel(final_data, 'Readiness response list');
                        } else {
                            console.error('No data to export');
                            alert('No data to export')
                        }
                    }}>
                        <i className='fa fa-download'></i>&nbsp;
                        Excel/CSV
                    </button>
                </div>
                <div className="col-sm-4 mb-3 mt-3">
                    <button style={{ "color": "white" }} type="button"
                        className="btn btn-success float-right"
                        onClick={() => {
                            this.props.page == 'report' ?
                                window.location.assign('/pt-shipment-report-list') :
                                window.location.assign('/pt-shipment')
                        }}>
                        ← back
                    </button>
                </div>
            </div>
            <div className='col-sm-12 col-md-12'>
                <div className="form-group mb-2">
                    <input type="text"
                        onChange={(event) => {
                            let currElementsTableEl = this.state.allTableElements.filter(elemnt =>
                                elemnt['props']['children'][1]['props']['children'].toString().toLowerCase().trim().includes(event.target.value.trim().toLowerCase()) ||
                                elemnt['props']['children'][2]['props']['children'].toLowerCase().trim().includes(event.target.value.trim().toLowerCase()) ||
                                elemnt['props']['children'][3]['props']['children'].toLowerCase().trim().includes(event.target.value.trim().toLowerCase())
                            );
                            this.updatedSearchItem(currElementsTableEl);
                        }}
                        className="form-control" placeholder="search reponse"></input>
                </div>

                <table className="table table-striped table-sm  table-hover">
                    <thead>
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">Round name</th>
                            <th scope="col">Shipment code</th>
                            <th scope="col">Participant name</th>
                            <th scope="col">Date responded</th>
                            <th scope="col">Date updated</th>
                            <th scope="col">Responded by</th>
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
                {pageContent}

                < div className="modal fade" id="readinessReponseModal" tabIndex="-1" role="dialog" aria-labelledby="readinessReponseModalTitle" aria-hidden="true" >
                    <div className="modal-dialog modal-dialog-centered" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="readinessReponseModalTitle">Notice!</h5>
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                {
                                    this.state.message ? this.state.message : ''
                                }
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                            </div>
                        </div>
                    </div>
                </div >
            </React.Fragment>
        );
    }

}

export default ShipmentResponses;
