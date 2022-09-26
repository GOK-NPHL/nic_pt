import React from 'react';
import ReactDOM from 'react-dom';
import { v4 as uuidv4 } from 'uuid';
import Pagination from "react-js-pagination";
import { FetchLabPersonel } from '../../../components/utils/Helpers';


class ListPersonel extends React.Component {

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

        (async () => {
            let response = await FetchLabPersonel();
            this.setState({
                data: response
            });
            console.log(response);
        })();

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
                console.log(element);
                tableElem.push(<tr key={index}>
                    <th scope="row">{index + 1}</th>
                    <td>{element.lab_name}</td>
                    <td>{element.name} {element.second_name}</td>
                    <td>{element.phone_number}</td>
                    <td>{element.email}</td>
                    <td>{element.is_active ? 'Active' : 'Inactive'}</td>

                    {

                        <td>

                            <a
                                onClick={
                                    () => {
                                        window.location.assign('edit-personel/' + element.id)
                                    }
                                }
                                style={{ 'marginRight': '5px' }}
                                className="d-none d-sm-inline-block btn btn-xs btn-info shadow-sm text-white">
                                <i className="fas fa-user-edit"></i> Edit
                            </a>
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
            <div className="col-sm-12 mb-3 mt-3">
                <h3 className="float-left">Lab Personel List</h3>
                <a style={{ "color": "white" }} type="button" href="add-personel" className="btn btn-info float-right">Add Lab Personel</a>
            </div>
            <div className='col-sm-12 col-md-12'>
                <div className="form-group mb-2">
                    <input type="text"
                        onChange={(event) => {
                            let searchTerm = event.target.value.trim().toLowerCase() || '';
                            console.log(this.state.allTableElements);
                            
                            
                            let currElementsTableEl = this.state.allTableElements.filter(elemnt =>
                                {
                                    return elemnt['props']['children'][1]['props']['children'].toString().toLowerCase().trim().includes(searchTerm) ||
                                    elemnt['props']['children'][2]['props']['children'].join(' ').toLowerCase().trim().includes(searchTerm) ||
                                    elemnt['props']['children'][3]['props']['children'].toLowerCase().trim().includes(searchTerm) ||
                                    elemnt['props']['children'][4]['props']['children'].toLowerCase().trim().includes(searchTerm)
                            }
                            );
                            this.updatedSearchItem(currElementsTableEl);
                        }}
                        className="form-control" placeholder="search personel"></input>
                </div>

                <table className="table table-striped table-sm  table-hover">
                    <thead>
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">Laboratory Name</th>
                            <th scope="col">Personel Name</th>
                            <th scope="col">Cell/Mobile</th>
                            <th scope="col">Primary Email</th>
                            <th scope="col">Status</th>
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
            </React.Fragment>
        );
    }

}

export default ListPersonel;

if (document.getElementById('list_personel')) {
    ReactDOM.render(<ListPersonel />, document.getElementById('list_personel'));
}