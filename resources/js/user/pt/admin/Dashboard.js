import React from 'react';
import ReactDOM from 'react-dom';
import { v4 as uuidv4 } from 'uuid';


class Dashboard extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            submissions: [],
            isSubmitResult: false,
            dtObject: null
        }
    }

    componentDidMount() {

        (async () => {
            let response = await FetchSubmissions();
        })();

    }


    render() {

        return (
            <React.Fragment>
                <div className='row mb-2'>
                    <div className='col-md-4 mb-2'>
                        <div className='card card-dark' style={{padding: '4px'}}>
                            <div className='card-header'>
                                <h4>Surveys / Checklists</h4>
                            </div>
                            <div className='card-body'>
                                <h2 className='text-bold'>0</h2>
                                <small className='float-right text-muted'>{new Date().toDateString()}</small>
                            </div>
                        </div>
                    </div>
                    <div className='col-md-4 mb-2'>
                        <div className='card card-dark' style={{padding: '4px'}}>
                            <div className='card-header'>
                                <h4>Shipments</h4>
                            </div>
                            <div className='card-body'>
                                <h2 className='text-bold'>0</h2>
                                <small className='float-right text-muted'>{new Date().toDateString()}</small>
                            </div>
                        </div>
                    </div>
                    <div className='col-md-4 mb-2'>
                        <div className='card card-dark' style={{padding: '4px'}}>
                            <div className='card-header'>
                                <h4>Participants</h4>
                            </div>
                            <div className='card-body'>
                                <h2 className='text-bold'>0</h2>
                                <small className='float-right text-muted'>{new Date().toDateString()}</small>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='row mt-2'>
                    <div className='col-md-12'>
                        <div className='card card-dark'>
                            <div className='card-header'>
                                <h4>All Submissions by month</h4>
                            </div>
                            <div className='card-body' style={{backgroundColor: '#f9f9f9'}}>
                                <div style={{ width: '100%', height: '450px', position:'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f9f9f9'}}>
                                    <img src="/bar.svg" style={{height: '100%'}}/>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }

}

export default Dashboard;

if (document.getElementById('admin_dashboard')) {
    ReactDOM.render(<Dashboard />, document.getElementById('admin_dashboard'));
}