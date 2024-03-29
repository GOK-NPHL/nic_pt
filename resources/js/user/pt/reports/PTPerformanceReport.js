import React from 'react';
import ReactDOM from 'react-dom';
import { v4 as uuidv4 } from 'uuid';
import { FetchShipmentResponsesReport, FetchAdminParams } from '../../../components/utils/Helpers';
// import ReactToPrint from "react-to-print";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

import { matchPath } from "react-router";


class PTPerformanceReport extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            rptCode: '',
            shipmentDate: '',
            specimenReceiptDate: '',
            kitLotNumber: '',
            labName: '',
            resultSubmissionDate: '',
            testingDate: '',
            kitExpiration: '',
            phoneNo: '',
            userName: '',
            userParams: {},
            adminParams: {},
            results: [],
            passMark: 100,
        }


    }

    componentDidMount() {
        // alert("pdf docuemnts 1")
        let pathname = window.location.pathname;
        let isPart = 0;
        let pathObject = matchPath(pathname, {
            path: `/get-shipment-response-performance/:submissionId`,
        });

        if (!pathObject) {
            pathObject = matchPath(pathname, {
                path: `/get-participant-shipment-response-performance/:submissionId`,
            });
            isPart = 1;
        }

        if (pathObject) {
            (async () => {

                let response = await FetchShipmentResponsesReport(pathObject.params.submissionId, isPart);

                if (response.status == 500) {
                    this.setState({
                        message: response.data.Message,
                    })
                    $('#readinessReponseReportModal').modal('toggle');
                } else {
                    this.setState({
                        data: response,
                        results: response['results'].sort((a,b)=>a?.sample_name>b?.sample_name),
                        rptCode: response['metadata'][0].code,
                        shipmentDate: response['metadata'][0].shipment_date,
                        specimenReceiptDate: response['metadata'][0].panel_receipt_date,
                        passMark: response['metadata'][0].pass_mark ? response['metadata'][0].pass_mark : 100,
                        kitLotNumber: response['metadata'][0].pt_lot_no,
                        labName: response['metadata'][0].lab_name,
                        resultSubmissionDate: response['metadata'][0].update_submission_date,
                        testingDate: response['metadata'][0].reporting_date,
                        kitExpiration: response['metadata'][0].kit_expiry_date,
                        phoneNo: response['metadata'][0].phone_number,
                        userName: response['metadata'][0]?.fname + ' ' + response['metadata'][0]?.sname,
                    });

                }
            })();
        }

        (async () => {
            let response = await FetchAdminParams();
            this.setState({
                adminParams: response,
                // userName: (response?.user?.name || '')//+' '+(response?.user?.surname || ''),
            })
        })();
    }


    render() {
        const imgStyle = {
            width: "80px"
        };
        let tdtyle = {
            textAlign: 'left',
            verticalAlign: 'middle'
        }
        let paragraphStyle = {
            lineHeight: '17px',
            textAlign: 'left',
            marginBottom: '0px'
        }
        let borderLeft = {
            borderLeft: '1px solid #999'
        }
        let borderRight = {
            borderRight: '1px solid #999'
        }
        let totalTableLength = 8;

        let results = [];
        let isPassOverallScore = true;
        let passedScore = 0;
        let totalSamples = 0;
        this.state.results.map((data) => {
            let isPass = false;
            ///////// SCORING ///////////
            if (
                (data.result_interpretation == data.reference_result)
                // match negative and not detected
                || (data.result_interpretation.toLowerCase().includes('negative') && data.reference_result.toLowerCase().includes('not detected'))
                // match positive and detected
                || (data.result_interpretation.toLowerCase().includes('positive') && (data.reference_result.toLowerCase().includes('detected') && !data.reference_result.toLowerCase().includes('not')))
            ) {
                isPass = true;
                passedScore += 1;
            } else {
                isPassOverallScore = false;
            }
            // console.log('scoring', data.sample_name, '('+data.result_interpretation+' == '+data.reference_result+')', ' result: ', isPass);
            ///////// SCORING ///////////
            results.push(<tr className='' key={uuidv4()} style={{ textTransform: 'uppercase' }}>
                <td style={tdtyle}>{data.sample_name}</td>
                <td style={{ verticalAlign: 'middle', textTransform: 'uppercase' }}>{
                    data.result_interpretation ?
                        data.result_interpretation :
                        'No Result'
                }</td>
                <td style={{ verticalAlign: 'middle' }}>{data.reference_result}</td>
                <td style={{ verticalAlign: 'middle' }}>{isPass ? 'ACCEPTABLE' : 'UNACCEPATBE'}</td>
            </tr>);
            totalSamples += 1;
        })

        let pass_mark = this.state.passMark || 100;

        let overallScore = (passedScore / totalSamples) * 100 || 0;
        let overallPerformance = 'UNACCEPTABLE';
        if (overallScore >= parseInt(pass_mark)) {
            overallPerformance = 'ACCEPTABLE';
        }

        return (
            <React.Fragment>
                <div className='container'>
                    <div className='row' style={{ padding: '16px 4px' }}>
                        <div className='col-md-12 py-3'>
                            {/* <ReactToPrint
                                documentTitle={"SARS-CoV2 PT Report"}
                                trigger={() => <button className='btn btn-primary float-right'>Download report</button>}
                                content={() => this.componentRef}
                            /> */}
                            <button className='btn btn-primary float-right' onClick={() => {
                                // pdf download of #printableArea with some margin
                                var element = document.getElementById('printableArea');
                                html2canvas(element).then((canvas) => {
                                    var imgData = canvas.toDataURL('image/png');
                                    var pdf = new jsPDF('p', 'pt', 'a4', true);//'p', 'mm', 'a4');
                                    var width = pdf.internal.pageSize.getWidth();
                                    var height = pdf.internal.pageSize.getHeight();
                                    pdf.addImage(imgData, 'PNG', 1, 1, width, height, '', 'FAST');
                                    pdf.save("SARS-CoV2 PROFICIENCY TESTING SCHEME REPORT.pdf");
                                });

                            }}>Download report</button>
                        </div>
                        <div className='col-md-12 w-100'>

                            <table className="table table-condensed" id="printableArea" style={{ verticalAlign: 'middle' }}
                                ref={el => (this.componentRef = el)}>
                                <tbody >
                                    <tr >
                                        <td colSpan={totalTableLength} style={{ textAlign: 'center' }}>
                                            <img style={imgStyle} src={this.props.chart1}></img>
                                        </td>
                                    </tr>
                                    <tr style={{ "fontWeight": "bold" }} >
                                        <td style={{ "lineHeight": "8px", padding: '8px', textAlign: 'center' }} colSpan={totalTableLength}>
                                            <p>MINISTRY OF HEALTH</p>
                                            <p>NATIONAL PUBLIC HEALTH LABORATORIES</p>
                                            <p>KENYA EXTERNAL QUALITY ASSESSMENT SCHEME (KNEQAS)</p>
                                            <p>NATIONAL INFLUENZA CENTRE</p>
                                            <p style={{ "fontWeight": "normal" }}>P.O Box 20750 - 00202 NAIROBI Email: nphlpt@nphl.go.ke Help Desk: helpdesk.nphl.go.ke</p>
                                            <h4><b>SARS-CoV2 PROFICIENCY TESTING SCHEME REPORT</b></h4>
                                        </td>
                                    </tr>
                                    <tr style={{ "marginTop": "5px" }}>
                                        <td style={tdtyle}>
                                            <div><strong>Code:</strong> &nbsp;{this.state.rptCode}</div>
                                            <div><strong>Shipment Date:</strong> &nbsp; {this.state.shipmentDate}</div>
                                            <div><strong>Specimen Receipt Date:</strong> &nbsp; {this.state.specimenReceiptDate}</div>
                                        </td>
                                        <td style={tdtyle}>
                                            <div><strong>Lab Name:</strong> &nbsp; {this.state.labName}</div>
                                            <div><strong>Result Submission Date:</strong> &nbsp; {this.state.resultSubmissionDate}</div>
                                        </td>
                                        <td style={tdtyle}>
                                            {true && <div style={{ textTransform: 'capitalize' }}><strong>Laboratory personnel testing:</strong> &nbsp; {this.state.userName}</div>}
                                            <div><strong>Phone No:</strong> &nbsp; {this.state.phoneNo}</div>
                                            <div><strong>Testing Date:</strong> &nbsp; {this.state.testingDate}</div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td colSpan={totalTableLength}>
                                            <table className='table table-bordered'>
                                                <thead>
                                                    <tr style={{ "fontWeight": "bold" }} className=''>
                                                        <th style={{ verticalAlign: 'middle', textAlign: 'center' }} rowSpan={2} >SAMPLE </th>
                                                        <th style={{ verticalAlign: 'middle', textAlign: 'center' }} colSpan={2}> ANALYSIS </th>
                                                        <th style={{ verticalAlign: 'middle', textAlign: 'center' }} rowSpan={2}>PERFORMANCE</th>
                                                    </tr>

                                                    <tr style={{ "fontWeight": "bold" }} className=''>
                                                        <th style={{ verticalAlign: 'middle', textAlign: 'center' }}>Interpretation</th>
                                                        <th style={{ verticalAlign: 'middle', textAlign: 'center' }}>Expected</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {results}
                                                </tbody>
                                            </table>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style={paragraphStyle} colSpan={totalTableLength}>
                                            <strong>Expert comment:</strong> Thank you for participating in KNEQAS SARS-CoV2 PT.
                                            Your overall performance: Your EQA performance is <strong>
                                                {overallScore}&#37; {overallPerformance}
                                            </strong>. The
                                            expected performance outcome was {this.state?.passMark || 100}% whereby, each sample has an equal score.

                                        </td>
                                    </tr>
                                    <tr>
                                        <td style={paragraphStyle} colSpan={totalTableLength}>
                                            <p><strong>Testing scheme information:</strong></p>

                                            <ol className="report">
                                                <li>SARS-CoV2 PT is a qualitative scheme.</li>
                                                <li>The panel samples come as dried samples.</li>
                                                <li>The PT samples have been fully characterised for the assigned qualitative SARS-CoV2 status.</li>
                                                <li>The reference values are used to grade the participants.</li>
                                                <li>The panel samples have been tested for stability and are stable.</li>
                                                <li>Homogeneity was done using systematic random sampling and the results were the same as the expected results.</li>
                                                <li>Participants performance report is confidential and will only be shared with the<br /> responsible quality assurance officers for the participating laboratories and for any purpose of corrective interventions.</li>
                                                <li>Subcontracted services: PT panel distribution and return of results.</li>
                                                <li>The schemes final report with summaries of overall performance analysis are indicated below</li>
                                            </ol>
                                        </td>
                                    </tr>

                                    <tr>
                                        <td colSpan={totalTableLength}>
                                            <hr />
                                        </td>
                                    </tr>

                                    <tr style={paragraphStyle} >
                                        <td colSpan={4} style={{ "textAlign": "left", "marginBottom": "0px" }} >
                                            <strong>Documentation of Report Review:</strong>&nbsp;
                                            We the undersigned, have read and reviewed the above SARS-CoV2 performance evaluation report. If the final score is less than {this.state?.passMark || 100}% we have downloaded the root cause analysis and corrective actions forms from ePT, completed, and attached them to this report. Performance report and any attachments must be filed and retained as documentation.
                                        </td>
                                    </tr>

                                    <tr>
                                        <td colSpan={totalTableLength}>
                                            <hr />
                                        </td>
                                    </tr>

                                    <tr>
                                        <td colSpan={3}>
                                            <table className='table table-bordered' style={{ verticalAlign: 'middle' }}>
                                                <tbody>
                                                    <tr>
                                                        <td className='text-left '>
                                                            <p style={{ margin: 0, padding: '2px 7px' }}>
                                                                Irene Nachiro<br />
                                                                Associate Coordinator, KNEQAS<br />
                                                                Department of Laboratory Services - NPHL<br />
                                                                P.O. Box 20750-00200<br />
                                                                Nairobi, Kenya<br />
                                                                <br />
                                                            </p>
                                                        </td>
                                                        <td className='text-left '>
                                                            <p style={{ margin: 0, padding: '2px 7px' }}>
                                                                Charity Maina<br />
                                                                KNEQAS Manager<br />
                                                                Department of Laboratory Services - NPHL<br />
                                                                P.O. Box 20750-00200<br />
                                                                Nairobi, Kenya<br />
                                                            </p>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </td>
                                    </tr>

                                    <tr>
                                        <td colSpan={totalTableLength}>
                                            <hr />
                                        </td>
                                    </tr>
                                    <tr style={paragraphStyle}>
                                        <td>
                                            Final Report Authorized By: &nbsp; <b><i>C.M.</i></b>
                                        </td>
                                        <td>
                                            Date: &nbsp;
                                            <span style={{ "fontWeight": "bold" }}>{this.state.testingDate ? new Date(this.state.testingDate).toLocaleDateString() : new Date().toLocaleDateString()}</span>
                                        </td>
                                    </tr>
                                    <tr style={paragraphStyle}>
                                        <td >
                                            Final Results Released By: &nbsp; &nbsp; <b><i>I.N.</i></b>
                                        </td>
                                        <td >
                                            Date: &nbsp;
                                            <span style={{ "fontWeight": "bold" }}>{this.state.testingDate ? new Date(this.state.testingDate).toLocaleDateString() : new Date().toLocaleDateString()}</span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td colSpan={3} style={{ padding: '14px 0 0' }} >
                                            <div style={{ borderTop: '1px solid #ccc', padding: '3px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                <span>MOH/DLS/NPHL/KNEQAS/NIC-PT/F/01</span>
                                                <span>Version <strong>1.1.0</strong></span>
                                                <span>Effective date: <strong>{new Date().toLocaleDateString('en-GB')}</strong></span>
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                < div className="modal fade" id="readinessReponseReportModal" tabIndex="-1" role="dialog" aria-labelledby="readinessReponseReportModalTitle" aria-hidden="true" >
                    <div className="modal-dialog modal-dialog-centered" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="readinessReponseReportModalTitle">Notice!</h5>
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

export default PTPerformanceReport;

if (document.getElementById('pt_perfornance_report')) {
    // find element by id
    let domValues = [];
    let domValuesMap = {};
    const dataChart1 = document.getElementById('data-chart1');
    //const dataChart2 = document.getElementById('data-chart2');

    domValues.push(dataChart1.dataset);
    //domValues.push(dataChart2.dataset);

    domValues.forEach(element => {
        for (const property in element) {
            domValuesMap[property] = element[property];
        }
    });

    const props = Object.assign({}, domValuesMap);
    ReactDOM.render(<PTPerformanceReport {...props} />, document.getElementById('pt_perfornance_report'));
}