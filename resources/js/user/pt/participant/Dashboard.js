import React from 'react';
import ReactDOM from 'react-dom';
import Pagination from "react-js-pagination";
import { FetchUserSamples, FetchReadnessSurvey } from '../../../components/utils/Helpers';
import DashTable from './DashTable';
import ReadinessList from './ReadinessList';
import SubmitResults from './SubmitResults';


class Dashboard extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            data: {},
            selectedElement: null,
            allowedPermissions: [],
            userActionState: 'userList',
            //pending submissions
            currElementsTableEl: [],
            allTableElements: [],
            startTableData: 0,
            endeTableData: 10,
            activePage: 1,
            //submitted submissions
            currSubmittedElementsTableEl: [],
            allSubmittedTableElements: [],
            startSubmittedTableData: 0,
            endeSubmittedTableData: 10,
            activeSubmittedPage: 1,
            //
            page: 'list',
            listingName: 'Readiness Surveys',
            listing: 'readiness',
            readiness: []
        }
        this.handlePageChange = this.handlePageChange.bind(this);
        this.toggleView = this.toggleView.bind(this);

    }

    componentDidMount() {

        (async () => {
            let response = await FetchUserSamples();
            let readiness = await FetchReadnessSurvey();
            console.log("readiness")
            console.log(readiness)
            this.setState({
                data: response,
                readiness: readiness
            })
        })();

    }

    handlePageChange(pageNumber) {
        let pgNumber = pageNumber * 10 + 1;
        this.setState({
            startTableData: pgNumber - 11,
            endeTableData: pgNumber - 1,
            activePage: pageNumber
        });
    }

    handleSubmittedPageChange(pageNumber) {
        console.log(`active page is ${pageNumber}`);
        let pgNumber = pageNumber * 10 + 1;
        this.setState({
            startSubmittedTableData: pgNumber - 11,
            endeSubmittedTableData: pgNumber - 1,
            activeSubmittedPage: pageNumber
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

    updatedSubmittedSearchItem(currSubmittedElementsTableEl) {
        this.setState({
            currSubmittedElementsTableEl: currSubmittedElementsTableEl,
            activeSubmittedPage: 1,
            startSubmittedTableData: 0,
            endeSubmittedTableData: 10,
        })
    }

    toggleView(page) {

        this.setState({
            page: page,
        })


    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.page !== this.state.page) {
            (async () => {
                let response = await FetchUserSamples();
                this.setState({
                    allTableElements: [],
                    allSubmittedTableElements: [],
                    allReadinessTableElements: [],
                    currElementsTableEl: [],
                    currSubmittedElementsTableEl: [],
                    currReadinessElementsTableEl: [],
                    data: response,
                })
            })();
        }
    }

    render() {

        const imgStyle = {
            width: "100%"
        };

        const rowStle = {
            marginBottom: "5px"
        };

        let tableElem = [];
        let submittedTableElem = [];

        // results submissions table elements
        if (Object.keys(this.state.data).length != 0 && this.state.page == 'list') {
            let unsubmittedIndex = 1;
            let submittedIndex = 1;
            let index = 0;
            for (const [key, element] of Object.entries(this.state.data)) {


                let datRow = <tr key={index++}>
                    <th scope="row">{element.form_submission_id == null ? unsubmittedIndex++ : submittedIndex++}</th>
                    <td>{element.round_name}</td>
                    <td>{element.code}</td>
                    <td>{element.end_date}</td>
                    {
                        element.form_submission_id == null ? <td style={{ verticalAlign: 'middle' }} className='text-center'>

                            {Date.parse(element.end_date) > new Date() ?
                                element.is_readiness_answered == null ? <span className="alert alert-default-warning" style={{ "padding": "3px" }}>Readiness needs filling</span> :
                                    element.readiness_approval_id == null ?
                                        <span className="alert alert-default-success" style={{ "padding": "3px" }}>Pending readiness approval</span>
                                        :
                                        <span className="alert alert-default-success" style={{ "padding": "3px" }}>Ready for submission</span>
                                :
                                <span className="alert alert-default-success" style={{ "padding": "3px" }}>Past due date</span>}


                        </td> :
                            ''
                    }
                    {

                        <td className='text-center' style={{ verticalAlign: 'middle' }}>
                            {Date.parse(element.end_date) > new Date() ?
                                element.is_readiness_answered == null ? 
                                <span className="alert alert-default-warning" style={{ "padding": "3px", borderColor: 'goldenrod' }}> &nbsp; &nbsp; Fill readines first &nbsp; &nbsp; </span> : 
                                element.readiness_approval_id == null ? 
                                <span className="alert alert-default-warning" style={{ "padding": "3px", borderColor: 'goldenrod'  }}> &nbsp; &nbsp; Please wait for readiness to be approved &nbsp; &nbsp; </span> : 
                                <a href={`/submissions/${element.pt_shipements_id}/new`} className="d-none d-sm-inline-block btn btn-success shadow-sm"> &nbsp;{element.form_submission_id ? "Edit Submission" : "Submit Entry"}&nbsp; </a> : 
                                ''}

                        </td>
                    }

                </tr>;
                if (element.form_submission_id == null) {
                    tableElem.push(datRow);
                } else {
                    submittedTableElem.push(datRow);
                }

                index += 1;
            }
            if (this.state.allTableElements.length == 0 && tableElem.length != 0) {
                this.setState({
                    allTableElements: tableElem,
                    currElementsTableEl: tableElem

                })
            }

            if (this.state.allSubmittedTableElements.length == 0 && submittedTableElem.length != 0) {
                this.setState({
                    allSubmittedTableElements: submittedTableElem,
                    currSubmittedElementsTableEl: submittedTableElem
                })
            }

        }


        let viewControlButton = <div className="row">
            <div className="col-sm-12 mt-3">
                <h3 className="float-left">NIC COVID PT  {this.state.listingName}</h3>

            </div>

            <div className="col-sm-12">
                <hr />
            </div>

            {/* Readiness */}
            <div className="form-check form-check-inline mt-2">
                <input
                    onClick={() => {
                        this.setState({
                            listingName: 'Readiness Surveys',
                            listing: 'readiness',
                        })
                    }}
                    defaultChecked={this.state.listing == 'readiness'} className="form-check-input"
                    type="radio" name="inlineRadioOptions" id="inlineRadio3" value="option3" />
                <label className="form-check-label" htmlFor="inlineRadio3">View readiness</label>
            </div>

            <div className="form-check form-check-inline pl-2 mt-2">
                <input
                    onClick={() => {
                        this.setState({
                            listingName: 'Pending tests',
                            listing: 'pending',
                        })
                    }}
                    defaultChecked={this.state.listing == 'pending'} className="form-check-input"
                    type="radio" name="inlineRadioOptions" id="inlineRadio1" value="option1" />
                <label className="form-check-label" htmlFor="inlineRadio1">View pending submissions</label>
            </div>

            <div className="form-check form-check-inline pl-2 mt-2">
                <input
                    onClick={() => {
                        this.setState({
                            listingName: 'Submitted tests',
                            listing: 'submitted'
                        })
                    }}
                    defaultChecked={this.state.listing == 'submitted'}
                    className="form-check-input" type="radio"
                    name="inlineRadioOptions" id="inlineRadio2" value="option2" />
                <label className="form-check-label" htmlFor="inlineRadio2">View submitted results</label>
            </div>

        </div>

        let submittedPageContent = <div id='user_table' className='row'>

            <div className='col-sm-12 col-md-12'>

                <div className="form-group mb-2">
                    <input type="text"
                        onChange={(event) => {
                            let currSubmittedElementsTableEl = this.state.allSubmittedTableElements.filter(elemnt =>
                                elemnt['props']['children'][1]['props']['children'].toString().toLowerCase().trim().includes(event.target.value.trim().toLowerCase()) ||
                                elemnt['props']['children'][2]['props']['children'].toLowerCase().trim().includes(event.target.value.trim().toLowerCase())
                            );
                            this.updatedSubmittedSearchItem(currSubmittedElementsTableEl);
                        }}
                        className="form-control float-right w-25 mb-1" placeholder="search shipment"></input>
                </div>

                <table className="table table-striped table-sm table-bordered table-hover">
                    <thead>
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">Round</th>
                            <th scope="col">Code</th>
                            <th scope="col">End Date</th>
                            <th scope="col">Action</th>

                        </tr>
                    </thead>
                    <tbody>
                        {this.state.currSubmittedElementsTableEl.length > 0 ?
                            this.state.currSubmittedElementsTableEl.slice(this.state.startSubmittedTableData, this.state.endeSubmittedTableData) :
                            <tr>
                                <td colSpan={5}>
                                    No submissions done
                                </td>
                            </tr>
                        }
                    </tbody>

                </table>
                <br />
                <DashTable
                    activePage={this.state.activeSubmittedPage}
                    totalItemsCount={this.state.currSubmittedElementsTableEl.length}
                    onChange={this.handleSubmittedPageChange}
                />
            </div>
            {/* {(typeof window !== 'undefined' && ["localhost", "127.0.0.1"].includes(window.location.hostname)) && <div className='col-md-12 p-2 rounded text-sm text-muted' style={{ backgroundColor: '#f5fafb' }}>
                    <small>
                        <details open>
                            <summary>state.data</summary>
                            <pre style={{ whiteSpace: 'pre-wrap' }} className="text-muted">{JSON.stringify(this.state.data, null, 2)}</pre>
                        </details>
                    </small>
                </div>} */}
        </div>;

        //submission_id
        let unSubmittedContent = <div id='user_submitted_content_table' className='row'>


            <div className='col-sm-12 col-md-12'>


                <div className="form-group mb-2">
                    <input type="text"
                        onChange={(event) => {
                            let currElementsTableEl = this.state.allTableElements.filter(elemnt =>
                                elemnt['props']['children'][1]['props']['children'].toString().toLowerCase().trim().includes(event.target.value.trim().toLowerCase()) ||
                                elemnt['props']['children'][2]['props']['children'].toLowerCase().trim().includes(event.target.value.trim().toLowerCase())
                            );
                            this.updatedSearchItem(currElementsTableEl);
                        }}
                        className="form-control float-right w-25 mb-1" placeholder="search shipment"></input>
                </div>

                <table className="table table-striped table-sm  table-hover">
                    <thead>
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">Round</th>
                            <th scope="col">Code</th>
                            <th scope="col">End Date</th>
                            <th scope="col">Status</th>
                            <th scope="col">Action</th>

                        </tr>
                    </thead>
                    <tbody>
                        {
                            this.state.currElementsTableEl.length > 0 ?
                                this.state.currElementsTableEl.slice(this.state.startTableData, this.state.endeTableData) :
                                <tr>
                                    <td colSpan={6}>
                                        No pending samples to fill
                                    </td>
                                </tr>
                        }
                    </tbody>

                </table>
                <br />
                <DashTable
                    activePage={this.state.activePage}
                    totalItemsCount={this.state.currElementsTableEl.length}
                    onChange={this.handlePageChange}
                />
                {/* <Pagination
                    itemclassName="page-item"
                    linkclassName="page-link"
                    activePage={this.state.activePage}
                    itemsCountPerPage={10}
                    totalItemsCount={this.state.currElementsTableEl.length}
                    pageRangeDisplayed={5}
                    onChange={this.handlePageChange}
                /> */}
            </div>

        </div>;

        if (this.state.page == 'edit' && this.state.listing == 'pending') {
            unSubmittedContent = <SubmitResults
                selectedElementHasSubmmisions={this.state.selectedElementHasSubmmisions}
                shipment={this.state.selectedElement}
                toggleView={this.toggleView} />
        } else if (this.state.page == 'edit' && this.state.listing == 'submitted') {
            submittedPageContent = <SubmitResults
                selectedElementHasSubmmisions={this.state.selectedElementHasSubmmisions}
                shipment={this.state.selectedElement}
                toggleView={this.toggleView} />
        }

        return (
            <React.Fragment>

                {this.state.page == 'list' ? viewControlButton : ''}
                {this.state.listing == 'readiness' ? <ReadinessList page={this.state.page} data={this.state.readiness} /> : ''}
                {this.state.listing == 'pending' ? unSubmittedContent : ''}
                {this.state.listing == 'submitted' ? submittedPageContent : ''}
            </React.Fragment>
        );
    }

}


export default Dashboard;

if (document.getElementById('participant-pt-dashboard')) {
    ReactDOM.render(<Dashboard />, document.getElementById('participant-pt-dashboard'));
}