import React from 'react';
import ReactDOM from 'react-dom';
import { FetchReadnessSurveyById, FetchReadnessSurveyByIdAndLab, SaveSuveyAnswers,ApproveReadinessAnswer } from '../../../components/utils/Helpers';
import { matchPath } from "react-router";
import { v4 as uuidv4 } from 'uuid';
import ReadinessQuestions from './ReadinessQuestions';


class Readiness extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            message: '',
            id: '',
            lab_id: '',
            name: '',
            startDate: '',
            endDate: '1970-01-01',
            readinessItems: { 'questions': [], 'answers': [] },
            questionsAnswerMap: {},
            showSaveButton: false,
            isUser: null
        }

        this.questionAnswerHandler = this.questionAnswerHandler.bind(this);
        this.saveAnswers = this.saveAnswers.bind(this);
        this.approveReadinessResponse = this.approveReadinessResponse.bind(this);

    }

    componentDidMount() {

        let pathname = window.location.pathname;
        let isUser = true;
        //check which url is accessing this component, user of admin?
        let pathObject = matchPath(pathname, {
            path: `/get-readiness-form/:readinessId`,

        });

        if (!pathObject) {
            isUser = false;
            pathObject = matchPath(pathname, {
                path: `/get-admin-readiness-form/:readinessId/:labId`,

            });
        }

        (async () => {
            let readinessItems = null;
            if (isUser) {
                readinessItems = await FetchReadnessSurveyById(pathObject.params.readinessId);
            } else {
                readinessItems = await FetchReadnessSurveyByIdAndLab(pathObject.params.readinessId, pathObject.params.labId);
            }

            if (readinessItems.status == 500) {
                this.setState({
                    message: readinessItems.data.Message,
                });
                $('#readinessFormModal').modal('toggle');
            } else {
                let readinessId = null;

                let startDate = null; "2021-09-29"
                let endDate = null;
                let name = null;

                let questionsAnswerMap = {};

                let qstns = readinessItems.questions;
                qstns.map((questionItem) => {
                    let answer = '';

                    readinessItems.answers.map((answr) => {
                        if (questionItem.question_id == answr['question_id']) {
                            answer = answr['answer'];
                        }
                    });

                    questionsAnswerMap[questionItem.question_id] = answer;
                });

                readinessId = qstns[0].id;
                startDate = qstns[0].start_date;
                endDate = qstns[0].end_date;
                name = qstns[0].name;

                this.setState({
                    id: readinessId,
                    name: name,
                    lab_id: qstns[0].lab_id,
                    startDate: startDate,
                    endDate: endDate,
                    showSaveButton: Date.parse(endDate) > new Date() && isUser,
                    questionsAnswerMap: questionsAnswerMap,
                    readinessItems: readinessItems,
                    isUser: isUser,
                });
            }

        })();

    }

    questionAnswerHandler(event) {
        let questionsAnswerMap = this.state.questionsAnswerMap;
        questionsAnswerMap[event.target.id] = event.target.value;
        this.setState({
            questionsAnswerMap: questionsAnswerMap,
        })
    }

    saveAnswers() {

        for (const [key, element] of Object.entries(this.state.questionsAnswerMap)) {

            if (element == '' || element == null) {
                this.setState({
                    message: "Please answer all questions"
                })
                return;
            }
        }

        let ansqwers = {
            readiness_id: this.state.id,
            lab_id: this.state.lab_id,
            questionsAnswerMap: this.state.questionsAnswerMap,
        };

        (async () => {

            let response = await SaveSuveyAnswers(ansqwers);
            let showSaveButton = false;
            if (response.status == 500) {
                showSaveButton = true;
            }
            this.setState({
                message: response.data.Message,
                showSaveButton: showSaveButton
            });
            $('#readinessFormModal').modal('toggle');
        })();

    }

    approveReadinessResponse() {
        (async () => {
            let response = await ApproveReadinessAnswer(this.state.id, this.state.lab_id);
            this.setState({
                message: response.data.Message,
            });
            $('#readinessFormModal').modal('toggle');
        })();
    }

    render() {

        return (
            <React.Fragment>

                <div className="card" style={{ "backgroundColor": "#ecf0f1" }}>
                    <div className="card-body">
                        <h5 className="card-title">
                            Readiness Checklist Survey Form
                        </h5><br />
                        <hr />
                        <div style={{ "margin": "0 auto", "width": "80%" }} className="text-center">
                            {this.state.isUser ?
                                <div className="form-group row">
                                    {new Date() > Date.parse(this.state.endDate) ?
                                        <label style={{ "color": "red" }} className="col-sm-12">Past Due date. Submission diabled</label>
                                        :
                                        ''}
                                </div> :
                                ''
                            }

                            <div className="form-group row">
                                <label htmlFor="u_name" className="col-sm-2 col-form-label">Name/Title</label>
                                <div className="col-sm-10">
                                    <input
                                        value={this.state.name}
                                        readOnly
                                        type="email" className="form-control" id="u_name" />
                                </div>
                            </div>
                            <div className="form-group row">
                                <label htmlFor="u_start_date" className="col-sm-2 col-form-label">Start date</label>
                                <div className="col-sm-10">
                                    <input
                                        value={this.state.startDate}
                                        readOnly
                                        type="date"
                                        className="form-control" id="u_start_date" />
                                </div>
                            </div>

                            <div className="form-group row">
                                <label htmlFor="u_end_date" className="col-sm-2 col-form-label">End Date</label>
                                <div className="col-sm-10">
                                    <input
                                        value={this.state.endDate}
                                        readOnly
                                        type="date"
                                        className="form-control" id="u_end_date" />
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="col-sm-2 mb-3">
                                    <label className="float-left">Checklist Question(s) *</label><br />
                                </div>
                                <div className="col-sm-10 mb-3">

                                    <ReadinessQuestions
                                        isUser={this.state.isUser}
                                        questionsAnswerMap={this.state.questionsAnswerMap}
                                        readinessItems={this.state.readinessItems.questions}
                                        questionAnswerHandler={this.questionAnswerHandler}

                                    />

                                </div>

                            </div>

                            <div className="form-group row">
                                <div className="col-sm-10 mt-3">
                                    {this.state.showSaveButton ?

                                        this.state.readinessItems.answers.length > 0 ?
                                            <a onClick={() => this.saveAnswers()} type="" className="d-inline m-2 btn btn-info m">
                                                Update
                                            </a> :
                                            <a onClick={() => this.saveAnswers()} type="" className="d-inline m-2 btn btn-info m">
                                                Save
                                            </a>
                                        :
                                        ''
                                    }
                                    {!this.state.isUser ?

                                        <a
                                            onClick={() => this.approveReadinessResponse()}
                                            type="" className="d-inline m-2 btn btn-primary m">
                                            Approve
                                        </a>
                                        :
                                        ''
                                    }
                                    <a
                                        onClick={
                                            () => {
                                                let route = '/participant-pt-home';
                                                if (!this.state.isUser) {
                                                    route = '/get-readiness-response/' + this.state.id;
                                                }
                                                window.location.assign(route)
                                            }
                                        }
                                        className={this.state.isUser ? "d-inline m-2 btn btn-danger" : "d-inline m-2 btn btn-secondary"}

                                    >Exit</a>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>

                < div className="modal fade" id="readinessFormModal" tabIndex="-1" role="dialog" aria-labelledby="readinessModalTitle" aria-hidden="true" >
                    <div className="modal-dialog modal-dialog-centered" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="addPersonelModalTitle">Notice!</h5>
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

export default Readiness;

if (document.getElementById('readiness')) {
    ReactDOM.render(<Readiness />, document.getElementById('readiness'));
}