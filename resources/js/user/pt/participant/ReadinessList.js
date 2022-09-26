import React from 'react';
import { FetchUserSamples, FetchReadnessSurvey } from '../../../components/utils/Helpers';
import DashTable from './DashTable';


class ReadinessList extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            allTableElements: [],
            currElementsTableEl: [],
            startTableData: 0,
            endeTableData: 10,
            activePage: 1,
        }
        this.handlePageChange = this.handlePageChange.bind(this);

    }

    componentDidMount() {

    }


    updatedSearchItem(currElementsTableEl) {
        this.setState({
            currElementsTableEl: currElementsTableEl,
            activePage: 1,
            startTableData: 0,
            endeTableData: 10,
        })
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

    render() {

        let tableElem = [];

        // results submissions table elements
        if (Object.keys(this.props.data).length != 0 && this.props.page == 'list') {
            let index = 1;

            for (const [key, element] of Object.entries(this.props.data)) {

                let datRow = <tr key={index}>
                    <th scope="row">{index}</th>
                    <td>{element.round_name}</td>
                    <td>{element.name}</td>
                    <td>{element.start_date}</td>
                    <td>{element.end_date}</td>

                    {

                        <td>

                            {

                                element.aswered_id ?

                                    <a
                                        onClick={() => {
                                            window.location.assign('get-readiness-form/' + element.id)
                                        }}
                                        // type="button"
                                        className="btn btn-success">
                                        {
                                            Date.parse(element.end_date) > new Date() ? <i className="far fa-edit"></i>
                                                : <i className="fas fa-eye"></i>
                                        }
                                        {Date.parse(element.end_date) > new Date() ? ' Edit' : ' View only'}
                                    </a>
                                    :
                                    <a
                                        onClick={() => {
                                            window.location.assign('get-readiness-form/' + element.id)
                                        }}
                                        // type="button"
                                        className="btn btn-success">
                                        {
                                            Date.parse(element.end_date) > new Date() ? <i className="fas fa-paper-plane"></i>
                                                : <i className="fas fa-eye"></i>
                                        }
                                        {Date.parse(element.end_date) > new Date() ? ' Submit' : ' View only'}
                                    </a>

                            }

                            {/* <a
                                onClick={() => {
                                    this.setState({
                                        selectedElement: element
                                    });
                                    $('#deleteConfirmModal').modal('toggle');
                                }} className="d-none d-sm-inline-block btn btn-sm btn-danger shadow-sm">
                                <i className="fas fa-user-times"></i>
                            </a> */}

                        </td>
                    }

                </tr>;
                index++;
                tableElem.push(datRow);
            }
            if (this.state.allTableElements.length == 0 && tableElem.length != 0) {
                this.setState({
                    allTableElements: tableElem,
                    currElementsTableEl: tableElem

                })
            }

        }

        let pageContent = <div id='user_table' className='row'>

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
                        className="form-control float-right w-25 mb-1" placeholder="search readniess survey"></input>
                </div>

                <table className="table table-striped table-sm  table-hover">
                    <thead>
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">Round</th>
                            <th scope="col">Readiness Name</th>
                            <th scope="col">Start Date</th>
                            <th scope="col">End Date</th>
                            <th scope="col">Action</th>

                        </tr>
                    </thead>
                    <tbody>
                        {this.state.currElementsTableEl.length > 0 ?
                            this.state.currElementsTableEl.slice(this.state.startTableData, this.state.endeTableData) :
                            <tr>
                                <td colSpan={6}>
                                    No Readiness Found
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
            </div>

        </div>;

        return (
            <React.Fragment>
                {pageContent}
            </React.Fragment>
        );
    }

}

export default ReadinessList;
