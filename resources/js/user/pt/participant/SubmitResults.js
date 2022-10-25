import React from 'react';
import { SaveSubmission, UpdateSubmission, FetchSubmission, FetchCurrentParticipantDemographics } from '../../../components/utils/Helpers';
import './Results.css';
import { v4 as uuidv4 } from 'uuid';

class SubmitResults extends React.Component {


    constructor(props) {
        super(props);
        this.state = {
            message: '',
            ptLotReceivedDate: '',
            ptReconstituionDate: '',
            kitExpiryDate: '',
            testJustification: 'Periodic testing as per the protocol',
            kitReceivedDate: '',
            kitLotNo: '',
            nameOfTest: '',
            ptLotNumber: '',
            testingDate: '',
            sampleType: 'DTS',
            labId: '',
            userId: '',
            ptNegativeIntepreation: '',

            ptRecentIntepreation: '',
            ptLongtermIntepreation: '',
            isPtDone: true,

            userDemographics: [],
            otherComments: '',
            notTestedReason: 'Issue with sample',
            edittableSubmission: {},
            testerName: '',
            pt_shipements_id: '',
            samples: {},
            submissionId: '',
            test_instructions: '',
            endDate: Date.parse('1970-01-01')
        }

        this.onNameOfTestHandler = this.onNameOfTestHandler.bind(this);
        this.onPtLotReceiceDateHandler = this.onPtLotReceiceDateHandler.bind(this);
        this.onKitExpiryDateHandler = this.onKitExpiryDateHandler.bind(this);
        this.onKitReceivedDateHandler = this.onKitReceivedDateHandler.bind(this);
        this.onKitLotHandler = this.onKitLotHandler.bind(this);
        this.onTestingDateHandler = this.onTestingDateHandler.bind(this);
        this.validateTestingAndRecivedDate = this.validateTestingAndRecivedDate.bind(this);
        this.onReconstitutionDateHandler = this.onReconstitutionDateHandler.bind(this);
        this.validateTestingAndReconstituionDate = this.validateTestingAndReconstituionDate.bind(this);
        this.validateTestingAndPTLotRecivedDate = this.validateTestingAndPTLotRecivedDate.bind(this);
        this.onPtLotNumberHandler = this.onPtLotNumberHandler.bind(this);
        this.onTestJustificationHandler = this.onTestJustificationHandler.bind(this);
        this.onSampleTypeHandler = this.onSampleTypeHandler.bind(this);
        this.validateTestingDateAndCurrentDate = this.validateTestingDateAndCurrentDate.bind(this);

        this.submitForm = this.submitForm.bind(this);

        this.onNameOfTestHandler = this.onNameOfTestHandler.bind(this);
        this.otherCommentsHandler = this.otherCommentsHandler.bind(this);
        this.notTestedReasonHandler = this.notTestedReasonHandler.bind(this);

        // this.visualResultsHandler = this.visualResultsHandler.bind(this);
        this.ptInterpretation = this.ptInterpretation.bind(this);

        this.onTesternameChangeHandler = this.onTesternameChangeHandler.bind(this);
        this.isChecked = this.isChecked.bind(this);

    }

    componentDidMount() {
        (async () => {
            let edittableSubmission = null;
            let userDemographics = await FetchCurrentParticipantDemographics();
            if (this.props.selectedElementHasSubmmisions) {
                edittableSubmission = await FetchSubmission(this.props.shipment.submission_id);
            }
            let samples = {};

            if (this.props.selectedElementHasSubmmisions) {
                if (edittableSubmission['test_results'].length == 0) {
                    this.props.shipment.samples.map((sample) => {
                        samples[sample.sample_id] = {
                            // "visual": { c: 0, v: 0, lt: 0 },
                            "interpretation": null
                        }
                    });
                } else {
                    edittableSubmission['test_results'].map((sample) => {
                        samples[sample.sample_id] = {
                            // "visual": { c: sample.control_line, v: sample.verification_line, lt: sample.longterm_line },
                            "interpretation": sample.interpretation
                        }
                    });
                }
            } else {
                this.props.shipment.samples.map((sample) => {
                    samples[sample.sample_id] = {
                        // "visual": { c: 0, v: 0, lt: 0 },
                        "interpretation": null
                    }
                });
            }

            if (this.props.selectedElementHasSubmmisions) {

                this.setState({
                    ptLotReceivedDate: edittableSubmission['data']['lot_date_received'],
                    ptReconstituionDate: edittableSubmission['data']['sample_reconstituion_date'],
                    kitExpiryDate: edittableSubmission['data']['kit_expiry_date'],
                    testJustification: edittableSubmission['data']['test_justification'],
                    kitReceivedDate: edittableSubmission['data']['kit_date_received'],
                    kitLotNo: edittableSubmission['data']['kit_lot_no'],
                    testerName: edittableSubmission['data']['tester_name'],
                    nameOfTest: edittableSubmission['data']['name_of_test'],
                    ptLotNumber: edittableSubmission['data']['pt_lot_no'],
                    testingDate: edittableSubmission['data']['testing_date'],
                    sampleType: edittableSubmission['data']['sample_type'],
                    labId: edittableSubmission['data']['lab_id'],
                    userId: edittableSubmission['data']['user_id'],

                    isPtDone: edittableSubmission['data']['pt_tested'] == 1 ? true : false,

                    userDemographics: userDemographics,
                    otherComments: edittableSubmission['data']['not_test_reason'] ? edittableSubmission['data']['not_test_reason'] : '',
                    notTestedReason: edittableSubmission['data']['other_not_tested_reason'] ? edittableSubmission['data']['other_not_tested_reason'] : 'Issue with sample',
                    pt_shipements_id: this.props.shipment.pt_shipements_id,
                    submissionId: edittableSubmission['data']['id'],
                    test_instructions: edittableSubmission['data']['test_instructions'],
                    samples: samples,
                    endDate: this.props.shipment.end_date
                });

            } else {

                this.setState({
                    userDemographics: userDemographics,
                    labId: userDemographics[0].lab_id,
                    userId: userDemographics[0].user_id,
                    edittableSubmission: edittableSubmission,
                    test_instructions: this.props.shipment.test_instructions,
                    samples: samples,
                    endDate: this.props.shipment.end_date
                });

            }

        })();
    }

    componentDidUpdate(prevProps) {

    }


    submitForm() {
        //check if results filled
        if (this.state.isPtDone) {
            for (const [key, value] of Object.entries(this.state.samples)) {
                if (value['interpretation'] == null) {
                    this.setState({
                        message: "Fill in all the fields marked *"
                    })
                    $('#messageModal').modal('toggle');
                    return;
                }
            }
        }

        if (
            this.state.ptLotReceivedDate.length == 0 ||
            this.state.kitExpiryDate.length == 0 ||
            this.state.kitReceivedDate.length == 0 ||
            this.state.kitLotNo.length == 0 ||
            this.state.nameOfTest.length == 0 ||
            this.state.testerName.length == 0 ||
            this.state.ptLotNumber.length == 0 ||
            this.state.ptReconstituionDate.length == 0 ||
            this.state.testingDate.length == 0
            // ||
            // (this.state.ptNegativeIntepreation.length == 0 && this.state.isPtDone) ||
            // (this.state.ptRecentIntepreation.length == 0 && this.state.isPtDone) ||
            // (this.state.ptLongtermIntepreation.length == 0 && this.state.isPtDone)
        ) {
            this.setState({
                message: "Fill in all the fields marked *"
            })
            $('#messageModal').modal('toggle');
        } else {
            let submission = {};
            submission["ptLotReceivedDate"] = this.state.ptLotReceivedDate;
            submission["kitExpiryDate"] = this.state.kitExpiryDate;
            submission["kitReceivedDate"] = this.state.kitReceivedDate;
            submission["kitLotNo"] = this.state.kitLotNo;
            submission["ptReconstituionDate"] = this.state.ptReconstituionDate;
            submission["testingDate"] = this.state.testingDate;
            submission["ptLotNumber"] = this.state.ptLotNumber;
            submission["nameOfTest"] = this.state.nameOfTest;
            submission["testerName"] = this.state.testerName;
            submission["isPTTested"] = this.state.isPtDone;
            submission["testJustification"] = this.state.testJustification;
            submission["ptNotTestedReason"] = !this.state.isPtDone ? this.state.notTestedReason : "";
            submission["ptNotTestedOtherReason"] = !this.state.isPtDone ? this.state.otherComments : "";
            submission["labId"] = this.state.labId;
            submission["userId"] = this.state.userId;
            submission["sampleType"] = this.state.sampleType;
            submission["ptShipementId"] = this.props.shipment.pt_shipements_id;
            submission["samples"] = this.state.samples;
            submission["id"] = this.state.submissionId;


            (async () => {
                let response;
                if (this.props.selectedElementHasSubmmisions) {
                    response = await UpdateSubmission(submission);
                } else {
                    response = await SaveSubmission(submission);
                }

                this.setState({
                    message: response.data.Message,
                });
                $('#messageModal').modal('toggle');
                if (response.status == 200) {
                    this.props.toggleView("list");
                }
            })();
        }
    }

    ptInterpretation(event, sample_id) {
        console.log("sample_id");
        console.log(sample_id);
        let samples = this.state.samples;
        let interpretValue = event.target.value;
        let status = event.target.checked ? 1 : 0;

        samples[sample_id]["interpretation"] = interpretValue;

    }

    // visualResultsHandler(event, sample_id) {

    //     let samples = this.state.samples;
    //     let visualValue = event.target.value;
    //     let status = event.target.checked ? 1 : 0;

    //     let results = samples[sample_id]["visual"]; //{ c: 0, v: 0, lt: 0 };
    //     results[visualValue] = status;
    //     samples[sample_id]["visual"] = results;

    // }


    onPtLotReceiceDateHandler(event) {
        let isValid = this.validateTestingAndPTLotRecivedDate(this.state.testingDate, event.target.value);

        if (isValid) {
            this.setState({
                ptLotReceivedDate: event.target.value
            });
        }
    }

    onPtLotNumberHandler(event) {
        this.setState({
            ptLotNumber: event.target.value
        });
    }

    onTesternameChangeHandler(event) {
        this.setState({
            testerName: event.target.value
        });
    }

    onSampleTypeHandler(event) {
        this.setState({
            sampleType: event.target.value
        });
    }
    onTestJustificationHandler(event) {
        this.setState({
            testJustification: event.target.value
        });
    }

    onKitExpiryDateHandler(event) {
        this.setState({
            kitExpiryDate: event.target.value
        });
    }
    onKitReceivedDateHandler(event) {
        let isValid = this.validateTestingAndRecivedDate(this.state.testingDate, event.target.value);
        if (isValid) {
            this.setState({
                kitReceivedDate: event.target.value
            });
        }

    }
    onKitLotHandler(event) {
        this.setState({
            kitLotNo: event.target.value
        });
    }
    onTestingDateHandler(event) {
        this.setState({
            testingDate: event.target.value
        });
        this.validateTestingDateAndCurrentDate(event.target.value);
        this.validateTestingAndRecivedDate(event.target.value, this.state.kitReceivedDate);
        this.validateTestingAndPTLotRecivedDate(event.target.value, this.state.ptLotReceivedDate);
        this.validateTestingAndReconstituionDate(this.state.ptReconstituionDate, event.target.value)
    }

    onNameOfTestHandler(event) {
        this.setState({
            nameOfTest: event.target.value
        });
    }

    onReconstitutionDateHandler(event) {

        let isValid = this.validateTestingAndReconstituionDate(event.target.value, this.state.testingDate);
        if (isValid) {
            this.setState({
                ptReconstituionDate: event.target.value
            });
        }
    }

    validateTestingAndRecivedDate(testingDate, receiveData) {
        if (testingDate < receiveData && (testingDate && receiveData)) {
            this.setState({
                message: "PT lot Date received cannot be greater than testing date",
                testingDate: '',
                kitReceivedDate: ''
            })
            $('#messageModal').modal('show');
            return false;
        } else {
            return true;
        }
    }

    validateTestingDateAndCurrentDate(sampleTestingDate) {

        let today = new Date();
        let testingDate = new Date(sampleTestingDate);
        if (testingDate > today) {
            this.setState({
                message: "Testing date cannot be greater than todays date",
                testingDate: '',
            })
            $('#messageModal').modal('show');
            return false;
        } else {
            return true;
        }
    }

    validateTestingAndReconstituionDate(reconstituionDate, testingDate) {
        if (testingDate < reconstituionDate && (reconstituionDate && testingDate)) {
            this.setState({
                message: "Kit testing Date cannot be greater than reconstitution date",
                testingDate: '',
                ptReconstituionDate: ''
            })
            $('#messageModal').modal('show');
            return false;
        } else {
            return true;
        }
    }

    validateTestingAndPTLotRecivedDate(testingDate, receiveDate) {
        if (testingDate < receiveDate && (testingDate && receiveDate)) {
            this.setState({
                message: "PT lot Date received cannot be greater than testing date",
                testingDate: '',
                ptLotReceivedDate: ''
            })
            $('#messageModal').modal('show');
            return false;
        } else {
            return true;
        }
    }

    notTestedReasonHandler(event) {
        this.setState({
            notTestedReason: event.target.value
        });
    }

    otherCommentsHandler(event) {
        this.setState({
            otherComments: event.target.value
        });
    }

    isChecked(sample) {
        try {
            return this.props.selectedElementHasSubmmisions
                // &&
                // this.state.samples[sample.sample_id]["visual"]['c'] == 1
                ? true : false
        } catch (err) {
            return false;
        }

    }

    render() {
        let samplesToDisplay = [];
        if (this.props.selectedElementHasSubmmisions) {
            samplesToDisplay = this.state.samples;
        } else {
            samplesToDisplay = this.props.shipment.samples;
        }

        const labInfo = {
            backgroundColor: "#f9f9f9",
        };
        const boxLine = {
            borderTop: "1px solid grey",
            borderBottom: "1px solid grey",
            borderRight: "1px solid grey",
            paddingTop: "4px"
        }
        const boxLineLeft = boxLine;
        boxLineLeft["borderLeft"] = "1px solid grey";

        const displayInlineBlock = {
            display: "inline-block",
        }
        let today = new Date().toLocaleDateString();
        let isPtDone = this.state.isPtDone;
        return (

            <>
                <div className="row">

                    <div className="col-sm-12 float-left">
                        <h1>
                            NIC COVID PT Submission form
                            {
                                Date.parse(this.state.endDate) > new Date() ?
                                    this.props.shipment.readiness_approval_id == null ?
                                        <span style={{ "color": "red" }}> Waiting for readiness approval</span>
                                        :
                                        ''
                                    :
                                    ''
                            }
                        </h1>
                        <hr />
                    </div>
                    <div className="col-sm-12 float-left">
                        {new Date() > Date.parse(this.state.endDate) ?
                            <h3 style={{ "color": "red" }} className="col-sm-12">Past Due date. Submission disabled</h3>
                            :
                            ''}
                    </div>

                    <div className="col-sm-12 pl-4 pr-4">
                        {/* lab basic info */}
                        <div style={labInfo} className="row">
                            <div style={boxLineLeft} className="col-sm-3">
                                <strong><p>Lab code</p></strong>
                                {this.state.userDemographics.length > 0 ? this.state.userDemographics[0].mfl_code : ''}
                            </div>
                            <div style={boxLine} className="col-sm-3">
                                <strong><p>Lab Name</p></strong>
                                {this.state.userDemographics.length > 0 ? this.state.userDemographics[0].lab_name : ''}
                            </div>
                            <div style={boxLine} className="col-sm-3">
                                <strong><p>Phone No.</p></strong>
                                {this.state.userDemographics.length > 0 ? this.state.userDemographics[0].phone_number : ''}
                            </div>
                            <div style={boxLine} className="col-sm-3">
                                <strong><p>Email</p></strong>
                                {this.state.userDemographics.length > 0 ? this.state.userDemographics[0].email : ''}
                            </div>
                        </div>
                        {/* row two */}
                        <div style={labInfo} className="row mt-1">
                            <div style={boxLineLeft} className="col-sm-3">
                                <strong><p>Submitter Name</p></strong>
                                {this.state.userDemographics.length > 0 ? this.state.userDemographics[0].name : ''}
                                <span> </span>
                                {this.state.userDemographics.length > 0 ? this.state.userDemographics[0].second_name : ''}

                            </div>

                        </div>
                        {/* row two */}
                        {/* End lab basic info */}
                        <hr />
                    </div>

                    <div className="col-sm-12 mt-4 pl-4 pr-4">
                        {/* submission form  header */}
                        <div style={labInfo} className="row">
                            <div style={boxLineLeft} className="col-sm-3">
                                <p><strong>Submission Date *</strong></p>
                            </div>
                            <div style={boxLine} className="col-sm-3">
                                {today}
                            </div>

                            <div style={boxLineLeft} className="col-sm-3">
                                <p><strong>Testing Date *</strong></p>
                            </div>
                            <div style={boxLine} className="col-sm-3">
                                <input value={this.state.testingDate} onChange={() => this.onTestingDateHandler(event)} className="form-control" type="date" />
                            </div>

                        </div>
                        {/* end submission form  header */}
                    </div>

                    <div className="col-sm-12  pl-4 pr-4 mt-2">
                        {/* Test Kit Information */}
                        Test Kit Information
                        {/* end Test Kit Information */}
                    </div>

                    <div className="col-sm-12  pl-4 pr-4">
                        {/* testing dates */}
                        <div className="row">
                            <div style={boxLine} className="col-sm-3">
                                <p><strong>Name of test *</strong></p>
                            </div>
                            <div style={boxLine} className="col-sm-3">

                                <input value={this.state.nameOfTest} onChange={() => this.onNameOfTestHandler(event)} className="form-control" type="text" />
                            </div>
                            <div style={boxLine} className="col-sm-3">
                                <p><strong>RTRI Kit Lot No. *</strong></p>
                            </div>
                            <div style={boxLine} className="col-sm-3">

                                <input value={this.state.kitLotNo} onChange={() => this.onKitLotHandler(event)} className="form-control" type="text" />
                            </div>
                        </div>
                        {/* end testing dates */}
                    </div>

                    <div style={labInfo} className="col-sm-12  pl-4 pr-4">
                        {/* kit info */}
                        <div className="row">
                            <div style={boxLineLeft} className="col-sm-3">
                                <p><strong>RTRI Kit Date Received *</strong></p>
                            </div>
                            <div style={boxLine} className="col-sm-3">

                                <input value={this.state.kitReceivedDate} onChange={() => this.onKitReceivedDateHandler(event)} className="form-control" type="date" />

                            </div>
                            <div style={boxLine} className="col-sm-3">
                                <p><strong>RTRI Kit Expiry Date *</strong></p>
                            </div>
                            <div style={boxLine} className="col-sm-3">

                                <input value={this.state.kitExpiryDate} onChange={() => this.onKitExpiryDateHandler(event)} className="form-control" type="date" />
                            </div>
                        </div>
                        {/* end  kit info  */}

                    </div>

                    <div className="col-sm-12  pl-4 pr-4 mt-2">
                        {/* Test Kit Information */}
                        PT sample Information
                        {/* end Test Kit Information */}
                    </div>

                    <div className="col-sm-12  pl-4 pr-4">
                        {/* PT Lot info */}
                        <div className="row">
                            <div style={boxLine} className="col-sm-3">
                                <p><strong>PT Lot Number: *</strong></p>
                            </div>
                            <div style={boxLine} className="col-sm-3">

                                <input value={this.state.ptLotNumber} onChange={() => this.onPtLotNumberHandler(event)} className="form-control" type="text" />
                            </div>

                            <div style={boxLineLeft} className="col-sm-3">
                                <p><strong>PT Lot Date Received *</strong></p>
                            </div>
                            <div style={boxLine} className="col-sm-3">
                                <input value={this.state.ptLotReceivedDate} onChange={() => this.onPtLotReceiceDateHandler(event)} className="form-control" type="date" />
                            </div>

                        </div>

                        <div className="row">
                            <div style={boxLine} className="col-sm-3">
                                <p><strong>Date PT Samples Reconstituted:</strong></p>
                            </div>
                            <div style={boxLine} className="col-sm-3">
                                <input value={this.state.ptReconstituionDate} onChange={() => this.onReconstitutionDateHandler(event)} className="form-control" type="date" />
                            </div>

                            <div style={boxLine} className="col-sm-3">
                                <p><strong>Tester name: *</strong></p>
                            </div>
                            <div style={boxLine} className="col-sm-3">
                                <input value={this.state.testerName} onChange={() => this.onTesternameChangeHandler(event)} className="form-control" type="text" />
                            </div>

                        </div>
                        {/* end  PT Lot info  */}
                        <hr />
                    </div>


                    <div className="col-sm-12  pl-4 pr-4">
                        {/* Test justification */}
                        <div className="row">
                            <div style={boxLine} className="col-sm-3">
                                <p><strong>Jutification for PT testing: *</strong></p>
                            </div>
                            <div style={boxLine} className="col-sm-3">
                                <select
                                    value={this.state.testJustification} onChange={() => this.onTestJustificationHandler(event)}
                                    className="custom-select" aria-label="Default select example">
                                    <option selected>Periodic testing as per the protocol</option>
                                    <option>New kit lot/batch</option>
                                    <option>Change in environmental conditions</option>
                                </select>
                            </div>
                            {/* sample type */}
                            <div style={boxLine} className="col-sm-3">
                                <p><strong>Sample type:</strong></p>
                            </div>
                            <div style={boxLine} className="col-sm-3">
                                <select
                                    value={this.state.sampleType} onChange={() => this.onSampleTypeHandler(event)}
                                    className="custom-select" aria-label="Default select example">
                                    <option selected>DTS</option>
                                    <option>Plasma</option>
                                </select>
                            </div>

                        </div>
                        {/* End Test justification */}

                        <hr />
                    </div>

                    <div className="col-sm-12  pl-4 pr-4" style={{marginTop: '2.1em'}}>
                        <h5><b>Testing Instructions</b></h5>
                    </div>
                    <div className="col-sm-12  pl-4 pr-4 mb-3">
                        <div style={{width: '100%', border: '1px solid #cdc5c5', backgroundColor: '#fffbea', padding: '15px 12px', borderRadius: '5px'}}>
                            <pre style={{fontFamily: 'inherit', fontSize: '1em', whiteSpace: 'pre-wrap'}}>{this.state.test_instructions}</pre>
                        </div>
                        {/* <textarea readOnly
                            value={this.state.test_instructions}
                            className="form-control" id="test_instructions" rows="3"></textarea> */}
                    </div>

                    <div className="col-sm-12 mb-4  pl-4 pr-4">
                        {/* Test justification */}
                        <div className="form-check text-center">
                            <input
                                className="form-check-input"
                                checked={isPtDone ? false : true}
                                onChange={() => {
                                    $("#pt-test-results").toggle();
                                    $("#test-not-done-section").toggle();
                                    this.setState({
                                        isPtDone: !this.state.isPtDone
                                    })
                                }}
                                type="checkbox"
                                value="" id="ptTestDone" />
                            <label className="form-check-label" htmlFor="ptTestDone">
                                <strong>Click here if PT test was not done?</strong>
                            </label>
                        </div>
                        {/* End Test justification */}

                    </div>

                    <div id="test-not-done-section" style={{ "display": this.state.isPtDone ? "none" : "" }} className="col-sm-12 mb-4 ">
                        {/* why test not done */}
                        <form style={{ "paddingRight": "20%", "paddingLeft": "20%" }}>
                            <div className="form-group" >
                                <label htmlFor="exampleFormControlSelect1">Pick a reason</label>
                                <select value={this.state.notTestedReason} onChange={() => this.notTestedReasonHandler(event)} className="form-control" id="exampleFormControlSelect1">
                                    <option selected="selected">Issue with sample</option>
                                    <option>Issue with RTRI kit lot</option>
                                    <option>Other</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label htmlFor="exampleFormControlTextarea2">Other comments</label>
                                <textarea value={this.state.otherComments} onChange={() => this.otherCommentsHandler(event)} className="form-control" id="exampleFormControlTextarea2" rows="3"></textarea>
                            </div>
                        </form>
                        {/* End why test not done */}

                    </div>

                    <div id='pt-test-results' style={{ "display": this.state.isPtDone ? "" : "none" }} className="col-sm-12 ">

                        {/* PT Test results fields */}
                        <div className="row ml-5 mr-5">
                            <div className="col-sm-12">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>PT Sample ID</th>
                                            <th>Interpretation *</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {/*  PT - Long Term*/}

                                        {this.props.shipment.samples.map((sample) => {

                                            return <tr key={uuidv4()}>
                                                <td>{sample.sample_name}</td>
                                                <td onChange={(event) => this.ptInterpretation(event, sample.sample_id)}>
                                                    <div className="form-check form-check-inline">
                                                        <input className="form-check-input" type="radio" value="lt"
                                                            name={`interpret-radio-${sample.sample_id}`} id="result_lt"
                                                            defaultChecked={
                                                                this.props.selectedElementHasSubmmisions
                                                                    &&
                                                                    Object.keys(this.state.samples).length !== 0
                                                                    &&
                                                                    this.state.samples[sample.sample_id]["interpretation"] == 'lt'
                                                                    ? true : false
                                                            }
                                                        />
                                                        <label className="form-check-label" htmlFor="result_lt">
                                                            LT
                                                        </label>
                                                    </div>
                                                    <div className="form-check form-check-inline">
                                                        <input className="form-check-input" type="radio" value="recent"
                                                            name={`interpret-radio-${sample.sample_id}`}
                                                            id="result_recent"
                                                            defaultChecked={
                                                                this.props.selectedElementHasSubmmisions
                                                                    &&
                                                                    Object.keys(this.state.samples).length !== 0
                                                                    &&
                                                                    this.state.samples[sample.sample_id]["interpretation"] == 'recent'
                                                                    ? true : false
                                                            }
                                                        />
                                                        <label className="form-check-label" htmlFor="result_recent">
                                                            recent
                                                        </label>
                                                    </div>
                                                    <div className="form-check form-check-inline">
                                                        <input className="form-check-input" type="radio" value="neg"
                                                            name={`interpret-radio-${sample.sample_id}`}
                                                            id="result_neg"
                                                            defaultChecked={
                                                                this.props.selectedElementHasSubmmisions
                                                                    &&
                                                                    Object.keys(this.state.samples).length !== 0
                                                                    &&
                                                                    this.state.samples[sample.sample_id]["interpretation"] == 'neg'
                                                                    ? true : false
                                                            }
                                                        />
                                                        <label className="form-check-label" htmlFor="result_neg">
                                                            neg
                                                        </label>
                                                    </div>
                                                    <div className="form-check form-check-inline">
                                                        <input className="form-check-input" type="radio" value="invalid"
                                                            name={`interpret-radio-${sample.sample_id}`}
                                                            id="result_invalid"
                                                            defaultChecked={
                                                                this.props.selectedElementHasSubmmisions
                                                                    &&
                                                                    Object.keys(this.state.samples).length !== 0
                                                                    &&
                                                                    this.state.samples[sample.sample_id]["interpretation"] == 'invalid'
                                                                    ? true : false
                                                            }
                                                        />
                                                        <label className="form-check-label" htmlFor="result_invalid">
                                                            invalid
                                                        </label>
                                                    </div>
                                                </td>
                                            </tr>
                                        })
                                        }

                                        {/*  End PT - Long Term */}

                                    </tbody>


                                </table>
                            </div>

                        </div>

                        {/* End PT Test results fields */}
                        <hr />

                    </div>
                    <div className="d-flex w-100 justify-content-center">

                        {Date.parse(this.state.endDate) > new Date() && this.props.shipment.readiness_approval_id != null ?
                            <button type="button " onClick={() => this.submitForm()} className="btn btn-info float-left mx-2">Submit</button>
                            : ''
                        }
                        <button type="button" onClick={() => {
                            this.props.toggleView('list');
                        }} className="btn btn-danger float-left mx-2">Exit</button>
                    </div>
                </div>

                {/* user persist alert box */}
                <div className="modal fade" id="messageModal" tabIndex="-1" role="dialog" aria-labelledby="messageModalTitle" aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="exampleModalLongTitle">Notice!</h5>
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                <p id="returnedMessage">{this.state.message}</p>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
    }
}

export default SubmitResults;
