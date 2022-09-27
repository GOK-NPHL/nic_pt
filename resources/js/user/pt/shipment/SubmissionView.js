import React from 'react'
import ReactDOM from 'react-dom';
import { FetchUserSamples, FetchSamplesByShipment, GetSubmission } from '../../../components/utils/Helpers';

function SubmissionView() {
    const [samples, setSamples] = React.useState([
    ]);
    const [formResults, setFormResults] = React.useState({});
    const [shipId, setShipID] = React.useState('');
    const [loading, setLoading] = React.useState(true);
    const [status, setStatus] = React.useState({});
    const [data, setData] = React.useState(null);








    React.useEffect(() => {
        setLoading(true);
        // get the ship id from the url using matchPath
        if (typeof window !== 'undefined') {
            const shipId = window.location.pathname.split('/')[2];
            const subId = window.location.pathname.split('/')[3];
            setShipID(shipId);
            if (shipId && subId) {
                FetchSamplesByShipment(shipId).then(spls => {
                    setSamples(spls);
                    GetSubmission(subId).then(sub => {
                        setData(sub.data);
                        setFormResults({
                            ...sub?.data?.result,
                            form_submission_id: sub?.data?.form_submission_id
                        });
                        setLoading(false);
                    });
                });
            } else {
                setStatus({
                    type: 'danger',
                    message: data['Message'] || data?.data['Message'] || 'Something went wrong. Please try again later.'
                });
            }
        } else {
            setStatus({
                type: 'danger',
                message: data['Message'] || data?.data['Message'] || 'Something went wrong. Please try again later.'
            });
        }

        /// autoselect
        $('#assay_2_dropdown').selectpicker();
    }, []);

    const handleInputChange = (event) => {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
        // if (name.includes('sample')) {
        //     const sampleId = name.split('_')[1];
        //     const sample = samples.find(sample => sample.id == sampleId);
        //     sample[name.split('_')[2]] = value;
        // }
        setFormResults({ ...formResults, [name]: value });
    }

    const methods = [
        { id: 1, name: 'Method 1' },
        { id: 2, name: 'Method 2' },
        { id: 3, name: 'Method 3' }
    ];

    const dataDictionary = require('../../../components/utils/dictionary.json');

    if (loading) return <div style={{ width: '100%', minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className='alert alert-default-info py-1' style={{ borderRadius: '40px' }}>
            Loading...
        </div>
    </div>
    if (status && status.type && status.message) return <div style={{ width: '100%', minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <div className={'alert alert-default-' + (status.type || 'default') + ' py-1'} style={{ borderRadius: '40px' }}>
            {status.message}
        </div>
        <div>
            <a className='btn btn-link' href='/admin-home'
            // onClick={ev => {
            //     ev.preventDefault()
            //     if (typeof window !== 'undefined') window.history.back()
            // }}
            >&larr; Go back</a>
            {/* <a className='btn btn-link' href='/'> Go home</a> */}
        </div>
    </div>
    return (
        <div className='container-fluid'>
            <div className='row'>
                <div className='col-md-12'>
                    <div className='card'>
                        <div className='card-header'>
                            <h3 className='card-title text-center w-100'>
                                <a href='#' className='btn btn-link float-left' onClick={ev=>{
                                    ev.preventDefault();
                                    if(typeof window !== 'undefined') window.history.back();
                                }}>&larr; Go back</a>
                                {data?.round_name || ""} Submission Results {data?.submitted_by ? ' for '+data?.submitted_by : ""}
                                </h3>
                        </div>
                        <div className='card-body w-100'>
                            <div className='row'>
                                {(status && status.type && status.message) &&
                                    <div className={'alert alert-default-' + (status.type || 'default') + ' w-100 rounded'}>
                                        {status.message}
                                    </div>}
                            </div>
                            <div className='row'>
                                <div className='row'>
                                    <div className='col-md-12'>

                                        <div role="tabpanel">

                                            <div className="tab-content">
                                                <div role="tabpanelz" className="tab-panez active" id="primary_info">
                                                    <div className="row">
                                                        <div className="col-md-12">
                                                            <h3 className='mt-2 mb-1 text-center'>Primary Information</h3>
                                                        </div>
                                                    </div>
                                                    <hr />
                                                    <div className="row">
                                                        {/* <div className="col-md-6">
                                                            <div className="form-group">
                                                                <label>Deadline</label><br style={{ lineHeight: '0' }} />
                                                                <span className='well rounded form-control w-100' style={{ border: '1px solid #ced4da', cursor: 'not-allowed' }}>{formResults['submission_deadline_date'] || data?.end_date}</span>
                                                            </div>
                                                        </div> */}
                                                        <div className="col-md-4">
                                                            <div className="form-group">
                                                                <label>Date of dispatch</label>
                                                                <input readOnly type="date"

                                                                    className="form-control" name="dispatch_date" defaultValue={formResults['dispatch_date'] || ''} />
                                                            </div>
                                                        </div>
                                                        <div className="col-md-4">
                                                            <div className="form-group">
                                                                <label>Date of panel receipt</label>
                                                                <input readOnly type="date"

                                                                    className="form-control" name="panel_recpt_date" defaultValue={formResults['panel_recpt_date'] || ''} />
                                                            </div>
                                                        </div>
                                                        <div className="col-md-4">
                                                            <div className="form-group">
                                                                <label>Reporting date</label>
                                                                <input readOnly type="date"

                                                                    className="form-control" name="reporting_date" defaultValue={formResults['reporting_date'] || new Date().toLocaleDateString().split('/').reverse().join('-')} />
                                                            </div>
                                                        </div>
                                                        <div className="col-md-6">
                                                            <div className="form-group">
                                                                <label>Test performed by</label>
                                                                <input readOnly type="text"

                                                                    className="form-control" name="tested_by" defaultValue={formResults['tested_by'] || ''} placeholder='Tester Name' />
                                                            </div>
                                                        </div>
                                                        <div className="col-md-6">
                                                            <div className="form-group">
                                                                <label>Results reported by</label>
                                                                <input readOnly type="text"

                                                                    className="form-control" name="reported_by" defaultValue={formResults['reported_by'] || ''} placeholder='Reporter Name' />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div role="tabpanelz" className="tab-panez w-100" id="results">
                                                    <div className="row">
                                                        <div className="col-md-12">
                                                            <h3 className='mt-2 mb-1 text-center'>Results</h3>
                                                        </div>
                                                    </div>
                                                    <div className='row'>
                                                        <div className='table-responsive'>
                                                            <table className="table table-sm align-middle table-bordered">
                                                                <thead className="text-center">
                                                                    <tr className="font-light">
                                                                        <th style={{ verticalAlign: 'middle' }} rowSpan={3}>&nbsp;&nbsp;SAMPLE&nbsp;&nbsp;</th>
                                                                        <th style={{ verticalAlign: 'middle' }} colSpan={
                                                                            methods.reduce((acc, curr) => acc + 3, 0)
                                                                        }>
                                                                            {/* METHODS */}
                                                                            Individual RT-PCR Results<br style={{ lineHeight: 0 }} />
                                                                            {/* [Please fill in Ct values (for real-time PCR), POS/ NEG (for conventional PCR) or leave blank if not tested] */}
                                                                        </th>
                                                                        <th style={{ verticalAlign: 'middle' }} rowSpan={3}>INTERPRETATION</th>
                                                                        <th style={{ verticalAlign: 'middle' }} rowSpan={3}>REMARKS/NOTES</th>
                                                                    </tr>
                                                                    <tr className="font-light">
                                                                        {methods.map(method => (
                                                                            <th style={{ verticalAlign: 'middle' }} key={method.id} colSpan={3}>{method.name}</th>
                                                                        ))}
                                                                    </tr>
                                                                    <tr className="font-light">
                                                                        {methods.map((method, mx) => {
                                                                            return new Array(3).fill(0).map((z, i) => (
                                                                                <th style={{ verticalAlign: 'middle' }} key={`${method.id}_${i}`}>
                                                                                    {/* Target {i + 1} */}
                                                                                    <input readOnly value={formResults['mthd_' + method.id + '_target_' + (i + 1) + '_gn_trgt'] || ''} className='form-control' style={{ height: 'auto', padding: '1px 2px', fontSize: '0.85em' }} name={'mthd_' + method.id + '_target_' + (i + 1) + '_gn_trgt'} />
                                                                                    {(formResults && formResults['mthd_' + method.id + '_target_' + (i + 1) + '_gn_trgt'] && formResults['mthd_' + method.id + '_target_' + (i + 1) + '_gn_trgt'] == dataDictionary['gene_option'].find(r => r.id == "other_gene_option").name) &&
                                                                                        <input readOnly type="text" className='form-control' style={{ height: 'auto', padding: '1px 2px', fontSize: '0.85em' }} name={'mthd_' + method.id + '_target_' + (i + 1) + '_gn_trgt_other'} value={formResults['mthd_' + method.id + '_target_' + (i + 1) + '_gn_trgt_other']} />}
                                                                                </th>
                                                                            ))
                                                                        })}
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    {samples.map(sample => (
                                                                        <tr key={sample.id}>
                                                                            <td style={{ verticalAlign: 'middle', fontSize: '0.85em' }}>{sample.name}</td>
                                                                            {methods.map(method => {
                                                                                return new Array(3).fill(0).map((z, i) => (
                                                                                    <td key={`${sample.id}_${method.id}_${i}`} style={{ verticalAlign: 'middle' }}>
                                                                                        <input readOnly value={formResults[`smpl_${sample.id}_mthd_${method.id}_trgt_${i + 1}_result`] || ''} type="text" className="form-control" style={{ height: 'auto', padding: '1px 2px' }} name={`smpl_${sample.id}_mthd_${method.id}_trgt_${i + 1}_result`} />
                                                                                    </td>
                                                                                ))
                                                                            })}
                                                                            <td style={{ verticalAlign: 'middle' }}>
                                                                                <input readOnly value={formResults[`smpl_${sample.id}_interpretation`] || ''} className="form-control" style={{ height: 'auto', padding: '1px 2px', fontSize: '0.85em' }} name={`smpl_${sample.id}_interpretation`}
                                                                                />
                                                                                {(formResults && formResults[`smpl_${sample.id}_interpretation`] && formResults[`smpl_${sample.id}_interpretation`] == dataDictionary['interpretation_options'].find(r => r.id == "others").name) &&
                                                                                    <input readOnly type="text" className='form-control' style={{ height: 'auto', padding: '1px 2px', fontSize: '0.85em' }} name={`smpl_${sample.id}_interpretation_other`} value={formResults[`smpl_${sample.id}_interpretation_other`]} />}
                                                                            </td>
                                                                            <td style={{ verticalAlign: 'middle' }}>
                                                                                <textarea readOnly rows={1} className="form-control" value={formResults[`smpl_${sample.id}_remarks`]} style={{ height: 'auto', padding: '1px 2px' }} name={`smpl_${sample.id}_remarks`} />
                                                                            </td>
                                                                        </tr>)
                                                                    )}
                                                                </tbody>
                                                            </table>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div role="tabpanelz" className="tab-panez w-100" id="sample_prep">
                                                    <div className="row">
                                                        <div className="col-md-12">
                                                            <h3 className='mt-2 mb-1 text-center'>Sample Preparation</h3>
                                                        </div>
                                                    </div>
                                                    <hr />
                                                    <div className="row">
                                                        <div className="col-md-12">
                                                            <div className="form-group">
                                                                <label>Heat inactivation of samples?</label>
                                                                <div style={{ display: 'flex', alignItems: 'center', gap: '9px' }}>
                                                                    <span style={{ display: 'flex', alignItems: 'center' }}>
                                                                        <input readOnly type="radio" value={true} name="heat_sample_inactivation" checked={formResults['heat_sample_inactivation'] == 'true' || formResults['heat_sample_inactivation'] == true} style={{ width: '16px', height: '16px' }} />
                                                                        <span className='ml-1'>Yes</span>
                                                                    </span>
                                                                    &nbsp; &nbsp;
                                                                    <span style={{ display: 'flex', alignItems: 'center' }}>
                                                                        <input readOnly type="radio" value={false} name="heat_sample_inactivation" checked={formResults['heat_sample_inactivation'] == 'false' || formResults['heat_sample_inactivation'] == false} style={{ width: '16px', height: '16px' }} />
                                                                        <span className='ml-1'>No</span>
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        {(formResults && formResults['heat_sample_inactivation'] && formResults['heat_sample_inactivation'] == 'true') && <><div className="col-md-4">
                                                            <div className="form-group">
                                                                <label>Temperature</label>
                                                                <input readOnly type="number" className="form-control" name="inactivation_temp" value={formResults['inactivation_temp'] || ''} placeholder='0' />
                                                            </div>
                                                        </div>
                                                            <div className="col-md-4">
                                                                <div className="form-group">
                                                                    <label>Duration (minutes)</label>
                                                                    <input readOnly type="number" className="form-control" name="inactivation_duration" value={formResults['inactivation_duration'] || ''} placeholder='0' />
                                                                </div>
                                                            </div>
                                                            <div className="col-md-4">
                                                                <div className="form-group">
                                                                    <label>Method</label>
                                                                    <input readOnly

                                                                        value={formResults['heat)inactivation_method'] || ''}
                                                                        className='form-control' name='heat_inactivation_method'
                                                                    />
                                                                </div>
                                                            </div></>}
                                                    </div>
                                                </div>
                                                <div role="tabpanelz" className="tab-panez w-100" id="detection_methods">
                                                    <div className="row">
                                                        <div className="col-md-12">
                                                            <h3 className='mt-2 mb-1 text-center'>Detection Methods</h3>
                                                        </div>
                                                    </div>
                                                    <hr />
                                                    <div className="row">
                                                        <div className="col-md-12">
                                                            <div className="table-responsive">
                                                                <table className="table table-bordered table-striped table-sm">
                                                                    <thead>
                                                                        <tr>
                                                                            <th style={{ verticalAlign: 'middle', maxWidth: '220px' }}>Method | Target gene(s)</th>
                                                                            <th style={{ verticalAlign: 'middle' }}>Conventional / Real-time</th>
                                                                            <th style={{ verticalAlign: 'middle' }}>In-house / Commercial</th>
                                                                            <th style={{ verticalAlign: 'middle' }}>Assay</th>
                                                                            <th style={{ verticalAlign: 'middle' }}>Algorithm</th>
                                                                            <th style={{ verticalAlign: 'middle' }}>Machine brand / model name</th>
                                                                            <th style={{ verticalAlign: 'middle' }}>Remarks</th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody>
                                                                        {/* <td colSpan={7} className='text-center'>No data available</td> */}
                                                                        {methods.map((method, mx) => {
                                                                            return <tr key={mx}>
                                                                                <td style={{ verticalAlign: 'middle', display: 'flex', flexDirection: 'column', padding: '3px 0px' }}>
                                                                                    <small style={{ textAlign: 'center', margin: '3px 0', padding: '4px', borderTop: '1px solid #ccb', fontWeight: 'bold', backgroundColor: 'wheat' }}>{method.name}</small>
                                                                                    {new Array(3).fill(0).map((z, i) => (
                                                                                        <small style={{ textAlign: 'center', margin: '2px 0', padding: '4px', borderBottom: '1px solid #ccb' }} key={"dm_" + mx + "_spl_" + i}>{formResults['mthd_' + method.id + '_target_' + (i + 1) + '_gn_trgt_other'] ? formResults['mthd_' + method.id + '_target_' + (i + 1) + '_gn_trgt_other'] : (formResults['mthd_' + method.id + '_target_' + (i + 1) + '_gn_trgt'] || "Gene target " + (i + 1))}</small>
                                                                                    ))}
                                                                                </td>
                                                                                <td style={{ verticalAlign: 'middle' }}>
                                                                                    <input readOnly className='form-control' style={{ height: 'auto', padding: '1px 2px', fontSize: '0.85em' }} name={`detection_method_${mx + 1}_conventional_realtime`} value={formResults[`detection_method_${mx + 1}_conventional_realtime`] || ''}
                                                                                    />
                                                                                </td>
                                                                                <td style={{ verticalAlign: 'middle' }}>
                                                                                    <input readOnly className='form-control' style={{ height: 'auto', padding: '1px 2px', fontSize: '0.85em' }} name={`detection_method_${mx + 1}_inhouse_commercial`} value={formResults[`detection_method_${mx + 1}_inhouse_commercial`] || ''}
                                                                                    />
                                                                                </td>
                                                                                <td style={{ verticalAlign: 'middle' }}>
                                                                                    <input readOnly className='form-control' style={{ height: 'auto', padding: '1px 2px', fontSize: '0.85em', maxWidth: '320px' }} name={`detection_method_${(mx + 1)}_assay_1`} value={formResults[`detection_method_${(mx + 1)}_assay_1`] || ''}
                                                                                    />
                                                                                    <br />
                                                                                    <input readOnly className='form-control autocomplete' id="assay_2_dropdown" data-live-search="true" style={{ height: 'auto', padding: '1px 2px', fontSize: '0.85em', maxWidth: '320px' }} name={`detection_method_${(mx + 1)}_assay_2`} value={formResults[`detection_method_${(mx + 1)}_assay_2`] || ''}
                                                                                    />
                                                                                </td>
                                                                                <td style={{ verticalAlign: 'middle' }}>
                                                                                    <input readOnly className='form-control' style={{ height: 'auto', padding: '1px 2px', fontSize: '0.85em' }} name={`detection_method_${mx + 1}_algorithm`} value={formResults[`detection_method_${mx + 1}_algorithm`] || ''}
                                                                                    />
                                                                                    {(formResults && formResults[`detection_method_${mx + 1}_algorithm`] && formResults[`detection_method_${mx + 1}_algorithm`] == dataDictionary['algorithm_options'].find(r => r.id == "others").name) &&
                                                                                        <input readOnly type="text" className='form-control' style={{ height: 'auto', padding: '1px 2px', fontSize: '0.85em' }} name={`detection_method_${mx + 1}_algorithm_other`} value={formResults[`detection_method_${mx + 1}_algorithm_other`] || ''} />}
                                                                                </td>
                                                                                <td style={{ verticalAlign: 'middle' }}>
                                                                                    <input readOnly className='form-control' style={{ height: 'auto', padding: '1px 2px', fontSize: '0.85em' }} name={`detection_method_${mx + 1}_machine_brand`} value={formResults[`detection_method_${mx + 1}_machine_brand`] || ''}
                                                                                    />
                                                                                    {(formResults && formResults[`detection_method_${mx + 1}_machine_brand`] && formResults[`detection_method_${mx + 1}_machine_brand`] == dataDictionary['brand_options'].find(r => r.id == "others").name) &&
                                                                                        <input readOnly type="text" className='form-control' style={{ height: 'auto', padding: '1px 2px', fontSize: '0.85em' }} name={`detection_method_${mx + 1}_machine_brand_other`} value={formResults[`detection_method_${mx + 1}_machine_brand_other`] || ''} />}
                                                                                </td>
                                                                                <td style={{ verticalAlign: 'middle' }}>
                                                                                    <textarea readOnly className='form-control' style={{ height: 'auto', padding: '1px 2px', fontSize: '0.85em' }} name={`detection_method_${mx + 1}_remarks`} value={formResults[`detection_method_${mx + 1}_remarks`]} rows={3}></textarea>
                                                                                </td>
                                                                            </tr>
                                                                        })}
                                                                        <tr>
                                                                            <td style={{ verticalAlign: 'middle', textAlign: 'center' }}>
                                                                                <small>Remarks</small>
                                                                            </td>
                                                                            <td colSpan={6} className='text-center'>
                                                                                <textarea readOnly className='form-control' style={{ height: 'auto', padding: '1px 2px', fontSize: '0.85em' }} name={`detection_method_overall_remarks`} value={formResults[`detection_method_overall_remarks`] || ''} rows={3}></textarea>
                                                                            </td>
                                                                        </tr>
                                                                    </tbody>
                                                                </table>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div role="tabpanelz" className="tab-panez w-100" id="molecular_detection">
                                                    <div className="row">
                                                        <div className="col-md-12">
                                                            <h3 className='mt-2 mb-1 text-center'>Implementation of Molecular Detection (Questionnaire)</h3>
                                                        </div>
                                                    </div>
                                                    <hr />
                                                    <div className="row">
                                                        <div className="col-md-12">
                                                            <div className="form-group">
                                                                <label>(a) Major concern(s) in launching/ implementing the molecular detection of SARS-CoV-2?</label>
                                                                <input readOnly value={formResults['concerns_molecular_detection_launch'] || ''}
                                                                    className='form-control' name='concerns_molecular_detection_launch'
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="col-md-12">
                                                            <div className="form-group">
                                                                <label>Additional comments/remarks?</label>
                                                                <textarea readOnly value={formResults['concerns_molecular_detection_launch_remarks'] || ''}
                                                                    className='form-control' name='concerns_molecular_detection_launch_remarks' rows={3}></textarea>
                                                            </div>
                                                        </div>
                                                        <div className="col-md-12">
                                                            <div className="form-group">
                                                                <label>(b) What are the sources of the specimens for testing in your laboratory?</label>
                                                                <input readOnly value={formResults['specimen_sources'] || ''}
                                                                    className='form-control' name='specimen_sources'
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="col-md-12">
                                                            <div className="form-group">
                                                                <label>Additional comments/remarks?</label>
                                                                <textarea readOnly value={formResults['specimen_sources_remarks'] || ''}
                                                                    className='form-control' name='specimen_sources_remarks' rows={3}></textarea>
                                                            </div>
                                                        </div>
                                                        <div className="col-md-12">
                                                            <div className="form-group">
                                                                <label>(c) Are you testing all specimens coming in?</label>
                                                                <input readOnly value={formResults['testing_all_specimens'] || ''}
                                                                    className='form-control' name='testing_all_specimens'
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="col-md-12">
                                                            <div className="form-group">
                                                                <label>(c) If No, what is the criteria of prioritization of specimens for testing?</label>
                                                                <textarea readOnly value={formResults['specimen_testing_criteria'] || ''}
                                                                    className='form-control' name='specimen_testing_criteria' rows={2}></textarea>
                                                            </div>
                                                        </div>
                                                        <div className="col-md-12">
                                                            <div className="form-group">
                                                                <label>Additional comments/remarks?</label>
                                                                <textarea readOnly value={formResults['testing_all_specimens_criteria_remarks'] || ''}
                                                                    className='form-control' name='testing_all_specimens_criteria_remarks' rows={3}></textarea>
                                                            </div>
                                                        </div>
                                                        <div className="col-md-12">
                                                            <div className="form-group">
                                                                <label>(d) What are the common type of specimens accepted for the molecular detection of SARS-CoV-2 in your laboratory?</label>
                                                                <input readOnly value={formResults['common_specimen_options'] || ''}
                                                                    className='form-control' name='common_specimen_options'
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="col-md-12">
                                                            <div className="form-group">
                                                                <label>Additional comments/remarks?</label>
                                                                <textarea readOnly value={formResults['common_specimen_options_remarks'] || ''}
                                                                    className='form-control' name='common_specimen_options_remarks' rows={3}></textarea>
                                                            </div>
                                                        </div>
                                                        <div className="col-md-12">
                                                            <div className="form-group">
                                                                <label>(e) What is the usual daily sample load/ current maximum daily testing capacity for SARS-CoV-2 in your laboratory?</label>
                                                                <div className='row px-3'>
                                                                    <div className='col-md-5'>
                                                                        <label>Daily sample load</label>
                                                                        <input readOnly value={formResults['daily_sample_load'] || ''}
                                                                            className='form-control' name='daily_sample_load'
                                                                        />
                                                                    </div>
                                                                    <div className='col-md-5'>
                                                                        <label>Maximum daily testing capacity</label>
                                                                        <input readOnly value={formResults['maximum_daily_capacity'] || ''}
                                                                            className='form-control' name='maximum_daily_capacity'
                                                                        />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="col-md-12">
                                                            <div className="form-group">
                                                                <label>Additional comments/remarks?</label>
                                                                <textarea readOnly value={formResults['sample_load_test_capacity_remarks'] || ''}
                                                                    className='form-control' name='sample_load_test_capacity_remarks' rows={3}></textarea>
                                                            </div>
                                                        </div>
                                                        <div className="col-md-12">
                                                            <div className="form-group">
                                                                <label>(f) What is the usual turnaround time for the molecular detection of SARS-CoV-2 in your laboratory?</label>
                                                                <input readOnly value={formResults['turnaround_time'] || ''}
                                                                    className='form-control' name='turnaround_time'
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="col-md-12">
                                                            <div className="form-group">
                                                                <label>Additional comments/remarks?</label>
                                                                <textarea readOnly value={formResults['turnaround_time_remarks'] || ''}
                                                                    className='form-control' name='turnaround_time_remarks' rows={3}></textarea>
                                                            </div>
                                                        </div>
                                                        <div className="col-md-12">
                                                            <div className="form-group">
                                                                <label>(g) BSL requirement if any in your country?</label>
                                                                <div className='row px-3'>
                                                                    <div className='col-md-5'>
                                                                        <label>For PCR</label>
                                                                        <input readOnly value={formResults['bsl_pcr'] || ''}
                                                                            className='form-control' name='bsl_pcr'
                                                                        />
                                                                    </div>
                                                                    <div className='col-md-5'>
                                                                        <label>For virus isolation</label>
                                                                        <input readOnly value={formResults['bsl_virus_isolation'] || ''}
                                                                            className='form-control' name='bsl_virus_isolation'
                                                                        />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="col-md-12">
                                                            <div className="form-group">
                                                                <label>Additional comments/remarks?</label>
                                                                <textarea readOnly value={formResults['bsl_requirements_remarks'] || ''}
                                                                    className='form-control' name='bsl_requirements_remarks' rows={3}></textarea>
                                                            </div>
                                                        </div>
                                                        <div className="col-md-12">
                                                            <div className="form-group">
                                                                <label>(h) Which type(s) of quality control(s) is/are included in the molecular detection of SARS-CoV-2 in your laboratory?</label>
                                                                <input readOnly value={formResults['quality_ctrl'] || ''}
                                                                    className='form-control' name='quality_ctrl'
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="col-md-12">
                                                            <div className="form-group">
                                                                <label>Additional comments/remarks?</label>
                                                                <textarea readOnly value={formResults['quality_ctrl_remarks'] || ''}
                                                                    className='form-control' name='quality_ctrl_remarks' rows={3}></textarea>
                                                            </div>
                                                        </div>
                                                        <div className="col-md-12">
                                                            <div className="form-group">
                                                                <label>(h) Has the detection method(s) been validated against other common respiratory pathogens?</label>
                                                                <input readOnly value={formResults['method_validation'] || ''}
                                                                    className='form-control' name='method_validation'
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="col-md-12">
                                                            <div className="form-group">
                                                                <label>Additional comments/remarks?</label>
                                                                <textarea readOnly value={formResults['method_validation_remarks'] || ''}
                                                                    className='form-control' name='method_validation_remarks' rows={3}></textarea>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* {(typeof window !== 'undefined' && ["localhost", "127.0.0.1"].includes(window.location.hostname)) && <div className='col-md-12 p-2 rounded text-sm text-muted' style={{ backgroundColor: '#f5fafb' }}>
                    <small>
                        <details open>
                            <summary>Data</summary>
                            <pre style={{ whiteSpace: 'pre-wrap' }} className="text-muted">{JSON.stringify(data, null, 2)}</pre>
                        </details>
                        <details>
                            <summary>FormResults</summary>
                            <pre style={{ whiteSpace: 'pre-wrap' }} className="text-muted">{JSON.stringify(formResults, null, 2)}</pre>
                        </details>
                    </small>
                </div>} */}
            </div>
        </div >
    )
}

export default SubmissionView

if (document.getElementById('pt_response_view')) {
    ReactDOM.render(<SubmissionView />, document.getElementById('pt_response_view'));
}