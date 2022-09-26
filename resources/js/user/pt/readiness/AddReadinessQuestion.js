import React from 'react';

class AddReadinessQuestion extends React.Component {

    constructor(props) {
        super(props);
        this.state = {

            answerOptions: '',
            answerType: 'list',
            qustionPosition: 1,
            is_required: 0,
            qustionType: 'question',
            showErrorMessage: false,
            errorMessage: '',
            question: ''
        }

        this.qustionAnswerOptionsHandler = this.qustionAnswerOptionsHandler.bind(this);
        this.qustionAnswerTypeHandler = this.qustionAnswerTypeHandler.bind(this);
        this.qustionTypeHandler = this.qustionTypeHandler.bind(this);
        this.qnRequiredHandler = this.qnRequiredHandler.bind(this);
        this.qustionPositionHandler = this.qustionPositionHandler.bind(this);
        this.addReadinessQuestion = this.addReadinessQuestion.bind(this);
        this.questionHandler = this.questionHandler.bind(this);

    }

    componentDidMount() {

    }

    qustionAnswerOptionsHandler(answerOptions) {
        this.setState({ answerOptions: answerOptions });
    }

    qustionAnswerTypeHandler(answerType) {
        this.setState({ answerType: answerType });
    }

    qustionTypeHandler(qustionType) {
        if (qustionType == 'question') {
            this.setState({
                qustionType: qustionType,
                answerType: 'list'
            });
        } else {
            this.setState({
                qustionType: qustionType,
                answerType: ''
            });
        }

    }
    qnRequiredHandler(qnreq) {
        this.setState({
            is_required: qnreq || 0,
        });
        // if (qnreq == 'no') {
        //     this.setState({
        //         is_required: false,
        //     });
        // } else {
        //     this.setState({
        //         is_required: true,
        //     });
        // }

    }

    qustionPositionHandler(qustionPosition) {
        this.setState({ qustionPosition: qustionPosition });
    }

    questionHandler(question) {
        this.setState({ question: question });
    }

    addReadinessQuestion() {
        if (
            (this.state.answerOptions == '' && this.state.answerType == 'list') ||
            (this.state.answerType == '' && this.state.qustionType == 'question') ||
            this.state.question == '' ||
            this.state.qustionPosition == '' ||
            this.state.qustionType == '') {
            this.setState({
                showErrorMessage: true,
                errorMessage: "Kindly fill all fields marked *"
            })
        } else {
            let readiness = {};

            readiness['question'] = this.state.question;
            readiness['answer_options'] = this.state.answerOptions;
            readiness['answer_type'] = this.state.answerType;
            readiness['qustion_position'] = this.state.qustionPosition;
            readiness['qustion_type'] = this.state.qustionType;
            readiness['is_required'] = this.state.is_required || false;
            this.setState({
                answerOptions: '',
                answerType: 'list',
                qustionPosition: 1,
                qustionType: 'question',
                showErrorMessage: false,
                errorMessage: '',
                question: '',
                is_required: false
            });
            $('#addQuestionModal').modal('toggle');
            this.props.addReadinessQuestion(readiness);
        }

    }

    render() {
        return (
            <React.Fragment>

                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="addQuestionModalTitle">New Checklist Question</h5>
                        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>

                    {this.state.showErrorMessage ? <div className="alert alert-danger" role="alert">
                        {this.state.errorMessage}
                    </div> : ''}

                    <div className="modal-body">

                        <div className="form-group">
                            <label htmlFor="qst_question">Question *</label>
                            <textarea
                                onChange={(event) => this.questionHandler(event.target.value)}
                                value={this.state.question}
                                className="form-control" id="qst_question" aria-describedby="emailHelp" placeholder="Readiness question" />
                        </div>

                        {/* <div className="form-group">
                            <label htmlFor="qst_position">Position *</label>
                            <input onChange={(event) => this.qustionPositionHandler(event.target.value)} type="number"
                                min={+this.state.qustionPosition + +1} //convert to unary ie number
                                value={this.state.qustionPosition}
                                className="form-control"
                                id="qst_position"
                                placeholder="Password" />
                        </div> */}

                        <div className="form-group">
                            <label htmlFor="qst_type">Question type *</label>
                            <select onChange={(event) => this.qustionTypeHandler(event.target.value)}
                                value={this.state.qustionType} className="custom-select" id="qst_type">
                                <option value="question">Question</option>
                                <option value="comment">Comment</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label htmlFor="is_required">Is it required? *</label>
                            <select onChange={(event) => this.qnRequiredHandler(event.target.value)}
                                value={this.state.is_required} className="custom-select" id="is_required">
                                <option value="0">No</option>
                                <option value="1">Yes</option>
                            </select>
                        </div>

                        {this.state.qustionType == 'question' ?
                            <div className="form-group">
                                <label htmlFor="qst_answer">Answer type *</label>
                                <select onChange={(event) => this.qustionAnswerTypeHandler(event.target.value)}
                                    value={this.state.answerType}
                                    className="custom-select" id="qst_answer">
                                    <option value="list">List of items</option>
                                    <option value="number">Number</option>
                                </select>
                            </div> : ''
                        }

                        {this.state.answerType == 'list' && this.state.qustionType == 'question' ?
                            <div className="form-group">
                                <label htmlFor="qst_answer_options">List the answer options *</label>
                                <input onChange={(event) => this.qustionAnswerOptionsHandler(event.target.value)}
                                    value={this.state.answerOptions}
                                    type="text" className="form-control" id="qst_answer_options" aria-describedby="emailHelp" placeholder="eg yes,no " />
                            </div> : ''
                        }


                    </div>
                    <div className="modal-footer">
                        <button type="button" onClick={() => {
                            this.addReadinessQuestion();
                        }} className="btn btn-info" >Save</button>
                        <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                    </div>
                </div>

            </React.Fragment>
        );
    }

}

export default AddReadinessQuestion;
