import React from 'react';
import ReactDOM from 'react-dom';
import { v4 as uuidv4 } from 'uuid';
import Pagination from "react-js-pagination";
import { FetchReadiness, FetchReadinessResponses, exportToExcel } from '../../../components/utils/Helpers';
import { matchPath } from "react-router";


class ReadinessResponse extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            data: [],
            data_f: [],
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
            path: `/get-readiness-response/:readinessId`,
        });

        if (pathObject) {
            (async () => {

                let response = await FetchReadinessResponses(pathObject.params.readinessId);

                if (response.status == 500) {
                    this.setState({
                        message: response.data.Message,
                    })
                    $('#readinessReponseModal').modal('toggle');
                } else {

                    this.setState({
                        data: response,
                        data_f: response,
                    });

                }
            })();
        }

    }

    handlePageChange(pageNumber) {
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

        if (Object.values(this.state.data_f).length > 0) {
            Object.values(this.state.data_f).map((element, index) => {
                tableElem.push(<tr key={index} style={{ fontSize: '16px' }}>
                    <th scope="row">{index + 1}</th>
                    <td>
                        <p style={{ marginLeft: '3px', marginRight: '3px' }}>{element.name}</p>
                    </td>
                    <td>
                        {element.lab_name}
                    </td>
                    <td>{element.created_at ? new Date(element.created_at).toLocaleString('en-GB') : '-'}</td>
                    <td>{element.updated_at ? new Date(element.updated_at).toLocaleString('en-GB') : '-'}</td>
                    <td>
                        {element.fname == null && element.sname == null ?
                            <span className='badge badge-danger' style={{ fontWeight: 500, backgroundColor: '#fc4545' }}>Not Responded</span> :
                            <span style={{ textTransform: 'capitalize' }}>{element.fname} {element.sname}</span>
                        }
                    </td>
                    <td>
                        {element.fname == null && element.sname == null ?
                            <span>N/A</span>
                            :
                            element.approved_id == null ?
                                <span className='badge badge-warning' style={{ fontWeight: 500 }}>Pending Approval</span>
                                :
                                <span className='badge badge-success' style={{ fontWeight: 500 }}>Approved</span>
                        }

                    </td>

                    {
                        //lab_id   id
                        <td>

                            {
                                element.readiness_id == null ? <span style={{ marginLeft: '6px', marginRight: '16px' }}>&nbsp;&nbsp;&nbsp;&nbsp;</span> :
                                    <>

                                        <a
                                            onClick={() => {
                                                window.location.assign('/get-admin-readiness-form/' + element.id + '/' + element.lab_id)
                                            }}
                                            data-toggle="tooltip" data-placement="top" title="View readiness responses"
                                            className="btn btn-sm btn-primary shadow-sm text-white" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                            <i className="fas fa-file mr-2"></i> View
                                        </a>
                                    </>
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
        }else{
            tableElem.push(<tr key={uuidv4()} style={{ fontSize: '16px' }}>
                <td colSpan="7" style={{ textAlign: 'center' }}>
                    No readiness responses found
                </td>
            </tr>);
        }
            

        let pageContent = <div id='user_table' className='row'>
            <div className="row w-full mb-3 mt-3">
                <div className='col-md-8'>
                    <h3 className="float-left">Readiness response list</h3>
                </div>
                <div className='col-md-4' style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                    <button type="button" className="btn btn-success btn-sm mx-1" onClick={() => {
                        if (this.state.data && Object.values(this.state.data).length > 0) {
                            let final_data = Object.values(this.state.data).map(element => {
                                return {
                                    'checklist name': element.name,
                                    'participant name': element.lab_name,
                                    'date responded': element.created_at,
                                    'date responded': element.updated_at,
                                    'responded by': `${element.fname || ''} ${element.sname || ''}`,
                                    'approved': element.approved_id == null ? 'Not Approved' : 'Approved',
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
                    <div>
                        <button type="button"
                            className="btn btn-secondary btn-outline btn-xs float-right"
                            onClick={() => {
                                window.location.assign('/list-readiness')
                            }}>
                            ← Back
                        </button>
                    </div>
                </div>
            </div>
            <div className='col-sm-12 col-md-12'>
                <div className="form-group mb-2">
                    <input type="text"
                        onChange={(event) => {
                            // console.log(this.state.allTableElements);
                            let currElementsTableEl = this.state.allTableElements.filter(elemnt => {
                                return elemnt['props']['children'][1]['props']['children']['props']['children'].toString().toLowerCase().trim().includes(event.target.value.trim().toLowerCase()) ||
                                    elemnt['props']['children'][2]['props']['children'].toLowerCase().trim().includes(event.target.value.trim().toLowerCase())
                            });
                            this.updatedSearchItem(currElementsTableEl);
                        }}
                        className="form-control" placeholder="search reponse" />
                </div>

                <table className="table table-striped table-sm table-hoverz">
                    <thead>
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">Name/Title</th>
                            <th scope="col">Participant name</th>
                            <th scope="col">Date responded</th>
                            <th scope="col">Date updated</th>
                            <th scope="col">Responded by</th>
                            <th scope="col">Approval status</th>
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

export default ReadinessResponse;

if (document.getElementById('readiness_responses')) {
    ReactDOM.render(<ReadinessResponse />, document.getElementById('readiness_responses'));
}