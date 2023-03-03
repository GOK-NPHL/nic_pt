import React from 'react';
import ReactDOM from 'react-dom';
import { FetchReadnessSurveyById } from '../../../components/utils/Helpers';
import { matchPath } from "react-router";
import { v4 as uuidv4 } from 'uuid';


class ReadinessQuestions extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            message: '',
            id: '',
            name: '',
            startDate: '',
            endDate: '',
            readinessQuestions: [],
            readinessItems: [],
            questionIds: [],
            questionsAnswerMap: {},
        }

    }

    addReadinessQuestion(readiness) {

        if (readiness['qustion_type'] == 'question') {

            if (readiness['answer_type'] == 'list') {
                let id = uuidv4();
                let qstOptins = readiness['answer_options'].split(',');
                let qstElement =
                    <div key={id} className="form-group">

                        <label className="float-left text-left" htmlFor={readiness['question_id']}>{readiness['question']}</label>
                        <select
                            disabled={!this.props.isUser}
                            value={this.props.questionsAnswerMap[readiness['question_id']]}
                            onChange={(event) => this.props.questionAnswerHandler(event)}
                            className="custom-select" id={readiness['question_id']}>
                            <option hidden>--Select option--</option>
                            {qstOptins.map((option) => {
                                return <option key={uuidv4()} value={option}>{option}</option>
                            })}
                        </select>
                    </div>
                return qstElement;

            } else if (readiness['answer_type'] == 'number') {
                let id = uuidv4();
                let qstElement =
                    <div key={id} className="form-group">

                        <label className="float-left text-left" htmlFor={readiness['question_id']}>{readiness['question']}</label>
                        <input
                            readOnly={!this.props.isUser}
                            value={this.props.questionsAnswerMap[readiness['question_id']]}
                            onChange={
                                (event) => {
                                    console.log(this.props.questionsAnswerMap[readiness['question_id']]);
                                    this.props.questionAnswerHandler(event)
                                }}
                            type="number" className="form-control"
                            id={readiness['question_id']}
                            aria-describedby="qst_answer"
                        />
                    </div>

                return qstElement;
            }

        } else if (readiness['qustion_type'] == 'comment') {
            let id = uuidv4();
            let qstElement =
                <div key={uuidv4()} className="form-group">

                    <label className="float-left text-left" htmlFor={readiness['question_id']}>{readiness['question']}</label>
                    <textarea
                        readOnly={!this.props.isUser}
                        className="form-control"
                        onBlur={(event) => {
                            let key = readiness['question_id'];
                            this.props.questionAnswerHandler(event)
                        }}
                        name={readiness['question_id']}
                        defaultValue={this.props.questionsAnswerMap[readiness['question_id']]}
                        id={readiness['question_id']} aria-describedby="qst_answer" placeholder="Enter your comment" >

                    </textarea>
                </div>
            return qstElement;
        }

    }

    render() {
        let qstnsElem = [];
        this.props.readinessItems.map((questionItem) => {
            let qstElement = this.addReadinessQuestion(questionItem);
            qstnsElem.push(qstElement);
        });

        return (
            <React.Fragment>

                <div className="card">
                    <div className="card-body">
                        {qstnsElem}
                    </div>
                </div>

            </React.Fragment>
        );

    }
}

export default ReadinessQuestions;