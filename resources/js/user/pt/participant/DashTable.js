import React from 'react';
import Pagination from "react-js-pagination";


class DashTable extends React.Component {

    constructor(props) {
        super(props);
        this.state = {

        }

    }

    render() {

        return (
            <Pagination
                itemClass="page-item"
                linkClass="page-link"
                activePage={this.props.activePage}
                itemsCountPerPage={10}
                totalItemsCount={this.props.currElementsTableEl ? this.props.currElementsTableEl.length : 0}
                pageRangeDisplayed={5}
                onChange={this.props.handlePageChange ? this.props.handlePageChange : () => { }}
            />
        );
    }

}


export default DashTable;

