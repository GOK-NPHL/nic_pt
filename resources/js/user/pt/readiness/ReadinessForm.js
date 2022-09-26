import React from 'react';
import ReactDOM from 'react-dom';
import { FetchReadinessById, FetchParticipantList, SaveReadiness, UpdateReadiness } from '../../../components/utils/Helpers';
import { v4 as uuidv4 } from 'uuid';
import DualListBox from 'react-dual-listbox';
import AddReadinessQuestion from './AddReadinessQuestion';
import { matchPath } from "react-router";

class ReadinessForm extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            submissions: [],
            message: '',
            id: '',
            name: '',
            startDate: '',
            endDate: '',
            selected: [],
            dualListptions: [],
            readinessQuestions: [],
            readinessItems: [],
            pageState: 'add',
            submitting: false,
        }

        this.handleNameChange = this.handleNameChange.bind(this);
        this.handleEndDateChange = this.handleEndDateChange.bind(this);
        this.handleStartDateChange = this.handleStartDateChange.bind(this);
        this.authoritiesOnChange = this.authoritiesOnChange.bind(this);
        this.addReadinessQuestion = this.addReadinessQuestion.bind(this);

    }

    componentDidMount() {


        let pathname = window.location.pathname;
        let pathObject = matchPath(pathname, {
            path: `/edit-readiness/:readinessId`,
        });


        (async () => {

            let partsList = await FetchParticipantList();
            if (pathObject) {
                let editData = await FetchReadinessById(pathObject.params.readinessId);
                if (editData.status == 500) {
                    this.setState({
                        message: editData.data.Message,
                        pageState: 'edit',
                    });
                    $('#addPersonelModal').modal('toggle');
                } else {

                    editData.payload.questions.map((questionItem) => {
                        this.addReadinessQuestion(questionItem);
                    });
                    this.setState({
                        id: editData.payload.readiness[0].id,
                        dualListptions: partsList,
                        name: editData.payload.readiness[0].name,
                        startDate: editData.payload.readiness[0].start_date,
                        endDate: editData.payload.readiness[0].end_date,
                        selected: editData.payload.labs,
                        pageState: 'edit',
                    });
                }
            } else {
                this.setState({
                    dualListptions: partsList,
                });
            }

        })();


    }

    handleNameChange(name) {
        this.setState({
            name: name
        });
    }

    handleStartDateChange(startDate) {

        try {
            if (this.state.endDate != null && this.state.endDate.length != 0) {
                let srtDate = Date.parse(startDate);
                let enDate = Date.parse(this.state.endDate);
                if (srtDate > enDate) {
                    this.setState({
                        message: "Start date cannot be greater than end date",
                        startDate: this.state.startDate
                    });
                    $('#addAdminUserModal').modal('toggle');
                    return;
                }
            }
        } catch (err) {

        }

        this.setState({
            startDate: startDate
        });
    }

    handleEndDateChange(endDate) {
        try {
            if (this.state.startDate != null && this.state.startDate.length != 0) {
                let srtDate = Date.parse(this.state.startDate);
                let enDate = Date.parse(endDate);
                if (srtDate > enDate) {
                    this.setState({
                        message: "Start date cannot be greater than end date",
                        startDate: this.state.endDate
                    });
                    $('#addAdminUserModal').modal('toggle');
                    return;
                }
            }
        } catch (err) {

        }

        this.setState({
            endDate: endDate
        });
    }

    authoritiesOnChange(selected) {
        this.setState({ selected: selected });
    }

    addReadinessQuestion(readiness) {

        let rdItems = this.state.readinessItems;
        rdItems.push(readiness);
        let itemIndex = rdItems.length - 1;
        readiness['delete_status'] = 0;
        if (readiness['qustion_type'] == 'question') {

            if (readiness['answer_type'] == 'list') {
                let id = uuidv4();
                let qstOptins = readiness['answer_options'].split(',');
                let qstElement =
                    <div key={id} className="card">
                    <div className="card-body">
                    <div className="form-group text-left">
                        <a href="#" onClick={
                            (event) => {
                                event.preventDefault();
                                let readinessItems = this.state.readinessItems;
                                let questions = this.state.readinessQuestions;

                                if (this.state.pageState == 'edit') { //for edit mark as one to be deleted from controller and database
                                    let qItem = readinessItems[itemIndex];
                                    qItem['delete_status'] = 1;
                                    readinessItems[itemIndex] = qItem;
                                } else {
                                    readinessItems[itemIndex] = null;
                                }

                                questions[itemIndex] = null;

                                this.setState({
                                    readinessQuestions: questions,
                                    readinessItems: readinessItems
                                })
                            }
                        }
                            className="float-right" style={{ padding: '2px', fontSize: '22px', lineHeight: 0, color: 'red', fontWeight: 'bold' }}>
                            &times;
                        </a>
                        <label className="float-left text-left" style={{ fontSize: '18px' }} htmlFor={id + "qst_answer"}>{readiness['question']}  <span style={{ color: 'red' }}>{(readiness['is_required'] && parseInt(readiness['is_required']) == 1) ? "*" : ""}</span></label>
                        <select
                            className="custom-select" id={id + "qst_answer"}>
                            {qstOptins.map((option) => {
                                return <option key={uuidv4()} value={option}>{option}</option>
                            })}
                        </select>
                    </div>
                    </div>
                    </div>
                let questions = this.state.readinessQuestions;
                questions.push(qstElement);
                this.setState({
                    readinessQuestions: questions,
                    readinessItems: rdItems
                })
            } else if (readiness['answer_type'] == 'number') {
                let id = uuidv4();
                let qstElement =
                    <div key={id} className="card">
                        <div className="card-body">
                            <div className="form-group">
                                <a href="#" onClick={
                                    (event) => {
                                        event.preventDefault();
                                        let readinessItems = this.state.readinessItems;
                                        let questions = this.state.readinessQuestions;
                                        questions[itemIndex] = null;
                                        if (this.state.pageState == 'edit') { //for edit mark as one to be deleted from controller and database
                                            let qItem = readinessItems[itemIndex];
                                            qItem['delete_status'] = 1;
                                            readinessItems[itemIndex] = qItem;
                                        } else {
                                            readinessItems[itemIndex] = null;
                                        }
                                        this.setState({

                                            readinessQuestions: questions,
                                            readinessItems: readinessItems
                                        })
                                    }
                                }
                                    className="float-right" style={{ padding: '2px', fontSize: '22px', lineHeight: 0, color: 'red', fontWeight: 'bold' }}>
                                    &times;</a>
                                <label className="float-left" htmlFor={id + "qst_answer"}>{readiness['question']} <span style={{ color: 'red' }}>{(readiness['is_required'] && parseInt(readiness['is_required']) == 1) ? "*" : ""}</span></label>
                                <input type="number" className="form-control" id={id + "qst_answer"} aria-describedby="qst_answer" placeholder="Enter your answer" />
                            </div>
                        </div>
                    </div>
                let questions = this.state.readinessQuestions;
                questions.push(qstElement);
                this.setState({
                    readinessQuestions: questions,
                    readinessItems: rdItems
                })
            }

        } else if (readiness['qustion_type'] == 'comment') {
            let id = uuidv4();
            let qstElement =
                <div className="form-group">
                    <a href="#" onClick={
                        (event) => {
                            event.preventDefault();
                            let readinessItems = this.state.readinessItems;
                            let questions = this.state.readinessQuestions;

                            questions[itemIndex] = null;

                            if (this.state.pageState == 'edit') { //for edit mark as one to be deleted from controller and database
                                let qItem = readinessItems[itemIndex];
                                qItem['delete_status'] = 1;
                                readinessItems[itemIndex] = qItem;
                            } else {
                                readinessItems[itemIndex] = null;
                            }

                            this.setState({

                                readinessQuestions: questions,
                                readinessItems: readinessItems
                            })
                        }
                    }
                        className="float-right" style={{ "color": "red" }}>Delete</a>
                    <label className="float-left" htmlFor={id + "qst_answer"}>{readiness['question']}</label>
                    <textarea className="form-control" id={id + "qst_answer"} aria-describedby="qst_answer" placeholder="Enter your comment" />
                </div>
            let questions = this.state.readinessQuestions;
            questions.push(qstElement);
            this.setState({
                readinessQuestions: questions,
                readinessItems: rdItems
            })
        }

    }

    saveReadiness() {
        this.setState({
            submitting: true
        });
        if (
            this.state.name == '' ||
            this.state.start_date == '' ||
            this.state.end_date == '' ||
            this.state.selected.length == 0 ||
            this.state.readinessQuestions.length == 0

        ) {
            this.setState({
                message: "Kindly fill all fileds marked * in the form",
                submitting: false
            })
            $('#addAdminUserModal').modal('toggle');
        } else {
            (async () => {
                let readiness = {};

                { this.state.pageState == 'edit' ? readiness['id'] = this.state.id : '' }
                readiness['name'] = this.state.name;
                readiness['start_date'] = this.state.startDate;
                readiness['end_date'] = this.state.endDate;
                readiness['participants'] = this.state.selected;
                readiness['readiness_questions'] = this.state.readinessItems;

                let response;
                if (this.state.pageState == 'edit') {
                    response = await UpdateReadiness(readiness);
                    this.setState({
                        message: response.data.Message,
                        submitting: false
                    });
                } else {
                    response = await SaveReadiness(readiness);
                    if (response.status == 200) {
                        this.setState({
                            message: response.data.Message,
                            startDate: '',
                            endDate: '',
                            name: '',
                            selected: [],
                            readinessQuestions: [],
                            readinessItems: [],
                            submitting: false
                        });
                    } else {
                        this.setState({
                            message: response.data.Message,
                            submitting: false
                        });
                    }

                }

                $('#addAdminUserModal').modal('toggle');

            })();
        }
        this.setState({
            submitting: false
        });
    }

    render() {
        let dualListValues = [];
        if (this.state.dualListptions.length != 0) {
            dualListValues = this.state.dualListptions.map((participant) => {
                let pat = {};
                pat['value'] = participant.id;
                pat['label'] = participant.lab_name;
                return pat;
            })
        }

        return (
            <React.Fragment>

                <div className="card" style={{ "backgroundColor": "#ecf0f1" }}>
                    <div className="card-body">
                        <h5 className="card-title">
                            {this.state.pageState == 'edit' ? 'Update Readiness Checklist' : 'Add Readiness Checklist'}
                        </h5><br />
                        <hr />
                        <div style={{ "margin": "0 auto", "width": "80%" }} className="text-center">

                            <div className="form-group row">
                                <label htmlFor="u_name" className="col-sm-2 col-form-label">Name/Title *</label>
                                <div className="col-sm-10">
                                    <input
                                        value={this.state.name}
                                        onChange={(event) => this.handleNameChange(event.target.value)}
                                        type="email" className="form-control" id="u_name" />
                                </div>
                            </div>
                            <div className="form-group row">
                                <label htmlFor="u_start_date" className="col-sm-2 col-form-label">Start date *</label>
                                <div className="col-sm-10">
                                    <input
                                        value={this.state.startDate}
                                        onChange={(event) => this.handleStartDateChange(event.target.value)} type="date"
                                        className="form-control" id="u_start_date" />
                                </div>
                            </div>

                            <div className="form-group row">
                                <label htmlFor="u_end_date" className="col-sm-2 col-form-label">End Date *</label>
                                <div className="col-sm-10">
                                    <input
                                        value={this.state.endDate}
                                        onChange={(event) => this.handleEndDateChange(event.target.value)} type="date"
                                        className="form-control" id="u_end_date" />
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="col-sm-2 mb-3">
                                    <label className="float-left">Assign laboratory *</label><br />
                                </div>
                                <div className="col-sm-10 mb-3">

                                    <DualListBox
                                        canFilter
                                        options={dualListValues}
                                        selected={this.state.selected}
                                        onChange={this.authoritiesOnChange}
                                    />
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="col-sm-2 mb-3">
                                    <label className="float-left">Checklist Question(s) *</label><br />
                                </div>
                                <div className="col-sm-10 mb-3">

                                    {this.state.readinessQuestions.map((rdnsQuestion) => {
                                        return (<React.Fragment key={uuidv4()}>
                                                {rdnsQuestion}
                                        </React.Fragment>)
                                    })}

                                    <button onClick={() => {
                                        $('#addQuestionModal').modal('toggle');
                                    }} type="button"
                                        className="btn btn-info float-left">Add question</button>

                                </div>

                            </div>

                            <div className="form-group row">
                                <div className="col-sm-10 mt-3">
                                    <button onClick={(ev) => {
                                        ev.preventDefault();

                                        this.setState({
                                            submitting: true
                                        });
                                        this.saveReadiness();
                                    }} type="" className="d-inline m-2 btn btn-info m" disabled={this.state.submitting}>
                                        {this.state.pageState == 'edit' ? (this.state.submitting ? 'Updating...' : 'Update Readiness') : (this.state.submitting ? 'Sending...' : 'Send Readiness')}
                                    </button>
                                    <a
                                        onClick={
                                            () => {
                                                window.location.assign('/list-readiness')
                                            }
                                        }
                                        className="d-inline m-2 btn btn-danger">Exit</a>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>

                {/* Message modal */}
                <div className="modal fade" id="addAdminUserModal" tabIndex="-1" role="dialog" aria-labelledby="addAdminUserModalTitle" aria-hidden="true" >
                    <div className="modal-dialog modal-dialog-centered" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="addAdminUserModalTitle">Notice!</h5>
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
                {/* End Message modal */}

                {/* Add quetion modal */}
                <div className="modal fade" id="addQuestionModal" tabIndex="-1" role="dialog" aria-labelledby="addQuestionModalTitle" aria-hidden="true" >
                    <div className="modal-dialog modal-dialog-centered" role="document">
                        <AddReadinessQuestion addReadinessQuestion={this.addReadinessQuestion} />
                    </div>
                </div >
                {/* End add quetion modal */}
            </React.Fragment>
        );
    }

}

export default ReadinessForm;