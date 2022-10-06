import React from 'react'
import ReactDOM from 'react-dom';
import { FetchUserSamples, FetchReadnessSurvey, SubmitPT, GetSubmission } from '../../../components/utils/Helpers';

function SubmissionForm() {
    const [samples, setSamples] = React.useState([]);
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
            setShipID(shipId);
            if (shipId) {
                FetchUserSamples(shipId).then((data) => {
                    if (data.status && data.status !== 200) {
                        setStatus({
                            type: 'danger',
                            message: data['Message'] || data?.data['Message'] || 'Something went wrong. Please try again later.'
                        });
                    } else {
                        if (data && (!data?.readiness_approval_id || data?.readiness_approval_id == null)) {
                            setStatus({
                                type: 'warning',
                                message: 'Please check that the readiness checklist has been filled & approved.'
                            });
                        } else {
                            if (data && data?.form_submission_id && data?.form_submission_id != null) {
                                setData(data);
                                setSamples(Array.from(data.samples, s => { return { id: s.sample_id, name: s.sample_name } }));
                                GetSubmission(data?.form_submission_id).then((rsp) => {
                                    // edit mode
                                    setFormResults({
                                        ...rsp.data.result,
                                        form_submission_id: data?.form_submission_id
                                    });
                                });
                                setLoading(false);
                            } else {
                                setData(data);
                                setSamples(Array.from(data.samples, s => { return { id: s.sample_id, name: s.sample_name } }));
                                setFormResults({ ...formResults, submission_deadline_date: data.end_date, dispatch_date: data.start_date });
                                setLoading(false);
                            }
                        }
                    }
                    setLoading(false);
                });
            } else {
                // FetchUserSamples().then((data) => {
                //     setData(data);
                //     setLoading(false);
                // });
            }

            /// autoselect
            $('#assay_2_dropdown').selectpicker();
        }
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
            <a className='btn btn-link' href='/participant-home'
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
                            <h3 className='card-title text-center w-100'>{data?.round_name || ""} Submission Form {data?.form_submission_id == null ? " - New" : " - Edit"}</h3>
                        </div>
                        <div className='card-body'>
                            <div className='row'>
                                {(status && status.type && status.message) &&
                                    <div className={'alert alert-default-' + (status.type || 'default') + ' w-100 rounded'}>
                                        {status.message}
                                    </div>}
                            </div>
                            <div className='row'>
                                <form className='w-100' onSubmit={ev => {
                                    ev.preventDefault()

                                    // if (loading) return
                                    setLoading(true)
                                    const formData = new FormData(ev.target)
                                    const data = {}
                                    for (const [key, value] of formData.entries()) {
                                        data[key] = value
                                    }
                                    // console.log(data)

                                    let payload = {
                                        'pt_shipment_id': data['shipment_id'],
                                        'panel_receipt_date': data['panel_recpt_date'],
                                        'reporting_date': data['reporting_date'],
                                        'tested_by': data['tested_by'],
                                        'submitted_by': data['reported_by'],
                                        'result': data
                                    }

                                    // get the interpretations and map them to the samples in a different object in the payload
                                    let interpretations = {}
                                    for (const [key, value] of formData.entries()) {
                                        if (key.endsWith('_interpretation') || key.endsWith('_interpretation_other')) {
                                            const sampleId = key.split('_')[1]
                                            if (!interpretations[sampleId]) interpretations[sampleId] = {}
                                            // check if other interpretation is selected
                                            if (data['smpl_' + sampleId + '_interpretation_other'] && data['smpl_' + sampleId + '_interpretation_other'] != '') {
                                                interpretations[sampleId]['interpretation'] = data['smpl_' + sampleId + '_interpretation_other']
                                            } else {
                                                interpretations[sampleId]['interpretation'] = value
                                            }
                                        }
                                    }
                                    payload['interpretations'] = interpretations

                                    SubmitPT(payload, data?.shipment_id, data?.form_submission_id == null ? "new" : "update", data?.form_submission_id).then(rspnse => {
                                        console.log(rspnse)
                                        if (rspnse.status == 200) {
                                            setStatus({ type: 'success', message: 'Submission successful. \n' + (rspnse?.message || '') })
                                        } else {
                                            setStatus({ type: 'danger', message: 'Submission failed. \n' + (rspnse?.message || '') })
                                        }
                                        setLoading(false)
                                    })

                                }}>
                                    <div className='row'>
                                        <div className='col-md-12'>

                                            <div role="tabpanel">
                                                <ul className="nav nav-tabs" role="tablist" id="tab_list">
                                                    <li role="presentation" className="nav-item active">
                                                        <a className="nav-link active" href="#primary_info" aria-controls="primary_info" role="tab" data-toggle="tab">Primary Information</a>
                                                    </li>
                                                    <li role="presentation" className="nav-item">
                                                        <a className="nav-link" href="#detection_methods" aria-controls="detection_methods" role="tab" data-toggle="tab">Detection Methods</a>
                                                    </li>
                                                    <li role="presentation" className="nav-item">
                                                        <a className="nav-link" href="#results" aria-controls="results" role="tab" data-toggle="tab">Results</a>
                                                    </li>
                                                    <li role="presentation" className="nav-item">
                                                        <a className="nav-link" href="#sample_prep" aria-controls="sample_prep" role="tab" data-toggle="tab">Sample Preparation</a>
                                                    </li>
                                                    <li role="presentation" className="nav-item">
                                                        <a className="nav-link" href="#molecular_detection" aria-controls="molecular_detection" role="tab" data-toggle="tab">Molecular Detection</a>
                                                    </li>
                                                </ul>

                                                <div className="tab-content">
                                                    <div role="tabpanel" className="tab-pane active" id="primary_info">
                                                        <div className="row">
                                                            <div className="col-md-12">
                                                                <h4 className='mt-3 mb-2 text-center'>Test Instructions</h4>
                                                                <div className='alert alert-default-warning'>
                                                                    <p>{data?.test_instructions || ''}</p>
                                                                    {/* Hidden inputs */}
                                                                    <input type='hidden' name='form_submission_id' value={data?.form_submission_id || ''} />
                                                                    <input type='hidden' name='shipment_id' value={data?.pt_shipements_id || ''} />
                                                                    <input type='hidden' name='readiness_id' value={data?.readiness_id || ''} />
                                                                    <input type='hidden' name='readiness_approval_id' value={data?.readiness_approval_id || ''} />
                                                                    <input type='hidden' name='end_date' value={data?.end_date || ''} />
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <hr />
                                                        <div className="row">
                                                            <div className="col-md-12">
                                                                <h3 className='mt-2 mb-1 text-center'>Primary Information</h3>
                                                            </div>
                                                        </div>
                                                        <hr />
                                                        <div className="row">
                                                            <div className="col-md-6">
                                                                <div className="form-group">
                                                                    <label>Deadline</label><br style={{ lineHeight: '0' }} />
                                                                    <span className='well rounded form-control w-100' style={{ border: '1px solid #ced4da', cursor: 'not-allowed' }}>{formResults['submission_deadline_date'] || data?.end_date}</span>
                                                                </div>
                                                            </div>
                                                            <div className="col-md-6">
                                                                <div className="form-group">
                                                                    <label>Date of dispatch</label>
                                                                    <input type="date"
                                                                        onChange={(ev) => {
                                                                            handleInputChange(ev)
                                                                        }}
                                                                        className="form-control" name="dispatch_date" defaultValue={formResults['dispatch_date'] || ''} />
                                                                </div>
                                                            </div>
                                                            <div className="col-md-6">
                                                                <div className="form-group">
                                                                    <label>Date of panel receipt</label>
                                                                    <input type="date"
                                                                        onChange={(ev) => {
                                                                            handleInputChange(ev)
                                                                        }}
                                                                        className="form-control" name="panel_recpt_date" defaultValue={formResults['panel_recpt_date'] || ''} />
                                                                </div>
                                                            </div>
                                                            <div className="col-md-6">
                                                                <div className="form-group">
                                                                    <label>Reporting date</label>
                                                                    <input type="date"
                                                                        onChange={(ev) => {
                                                                            handleInputChange(ev)
                                                                        }}
                                                                        className="form-control" name="reporting_date" defaultValue={formResults['reporting_date'] || new Date().toLocaleDateString().split('/').reverse().join('-')} />
                                                                </div>
                                                            </div>
                                                            <div className="col-md-6">
                                                                <div className="form-group">
                                                                    <label>Test performed by</label>
                                                                    <input type="text"
                                                                        onChange={(ev) => {
                                                                            handleInputChange(ev)
                                                                        }}
                                                                        className="form-control" name="tested_by" defaultValue={formResults['tested_by'] || ''} placeholder='Tester Name' />
                                                                </div>
                                                            </div>
                                                            <div className="col-md-6">
                                                                <div className="form-group">
                                                                    <label>Results reported by</label>
                                                                    <input type="text"
                                                                        onChange={(ev) => {
                                                                            handleInputChange(ev)
                                                                        }}
                                                                        className="form-control" name="reported_by" defaultValue={formResults['reported_by'] || ''} placeholder='Reporter Name' />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div role="tabpanel" className="tab-pane" id="detection_methods">
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
                                                                                return <tr key={method.id + "__" + mx}>
                                                                                    <td style={{ verticalAlign: 'middle', display: 'flex', flexDirection: 'column', padding: '3px 0px' }}>
                                                                                        <small style={{ textAlign: 'center', margin: '3px 0', padding: '4px', borderTop: '1px solid #ccb', fontWeight: 'bold', backgroundColor: 'wheat' }}>{method.name}</small>
                                                                                        {new Array(3).fill(0).map((z, i) => (
                                                                                            <>
                                                                                                {/* <small style={{ textAlign: 'center', margin: '2px 0', padding: '4px', borderBottom: '1px solid #ccb' }} key={"dm_" + mx + "_spl_" + i}>{formResults['mthd_' + method.id + '_target_' + (i + 1) + '_gn_trgt_other'] ? formResults['mthd_' + method.id + '_target_' + (i + 1) + '_gn_trgt_other'] : (formResults['mthd_' + method.id + '_target_' + (i + 1) + '_gn_trgt'] || "Gene target " + (i + 1))}</small> */}
                                                                                                <select
                                                                                                    onChange={(ev) => {
                                                                                                        handleInputChange(ev)
                                                                                                    }}
                                                                                                    value={formResults['mthd_' + method.id + '_target_' + (i + 1) + '_gn_trgt'] || ''}
                                                                                                    className='form-control mb-1 mt-1' style={{ height: 'auto', padding: '1px 2px', }} name={'mthd_' + method.id + '_target_' + (i + 1) + '_gn_trgt'}>
                                                                                                    <option value=''>Gene target {i + 1}</option>
                                                                                                    {dataDictionary['gene_option']?.map((item, index) => (
                                                                                                        <option key={item.id + "_" + index} value={item.name.trim()}>{item.name.trim()}</option>
                                                                                                    ))}
                                                                                                </select>
                                                                                                {(formResults && formResults['mthd_' + method.id + '_target_' + (i + 1) + '_gn_trgt'] && formResults['mthd_' + method.id + '_target_' + (i + 1) + '_gn_trgt'] == dataDictionary['gene_option'].find(r => r.id == "other_gene_option").name) &&
                                                                                                    <input type="text" onChange={(ev) => {
                                                                                                        handleInputChange(ev)
                                                                                                    }} className='form-control' style={{ height: 'auto', padding: '1px 2px', }} name={'mthd_' + method.id + '_target_' + (i + 1) + '_gn_trgt_other'} value={formResults['mthd_' + method.id + '_target_' + (i + 1) + '_gn_trgt_other']} />}
                                                                                            </>
                                                                                        ))}
                                                                                    </td>
                                                                                    <td style={{ verticalAlign: 'middle' }}>
                                                                                        <select onChange={(ev) => {
                                                                                            handleInputChange(ev)
                                                                                        }} className='form-control' style={{ height: 'auto', padding: '1px 2px', fontSize: '0.85em' }} name={`detection_method_${mx + 1}_conventional_realtime`} value={formResults[`detection_method_${mx + 1}_conventional_realtime`] || ''}>
                                                                                            <option value=''>Select</option>
                                                                                            {dataDictionary['conventional_real-time-options']?.map((item, index) => (
                                                                                                <option key={item.id + "_" + index} value={item.name.trim()}>{item.name.trim()}</option>
                                                                                            ))}
                                                                                        </select>
                                                                                    </td>
                                                                                    <td style={{ verticalAlign: 'middle' }}>
                                                                                        <select onChange={(ev) => {
                                                                                            handleInputChange(ev)
                                                                                        }} className='form-control' style={{ height: 'auto', padding: '1px 2px', fontSize: '0.85em' }} name={`detection_method_${mx + 1}_inhouse_commercial`} value={formResults[`detection_method_${mx + 1}_inhouse_commercial`] || ''}>
                                                                                            <option value=''>Select</option>
                                                                                            {dataDictionary['in-house_commercial-options']?.map((item, index) => (
                                                                                                <option key={item.id + "_" + index} value={item.name.trim()}>{item.name.trim()}</option>
                                                                                            ))}
                                                                                        </select>
                                                                                    </td>
                                                                                    <td style={{ verticalAlign: 'middle' }}>
                                                                                        <select onChange={(ev) => {
                                                                                            handleInputChange(ev)
                                                                                        }} className='form-control' style={{ height: 'auto', padding: '1px 2px', fontSize: '0.85em', maxWidth: '320px' }} name={`detection_method_${(mx + 1)}_assay_1`} value={formResults[`detection_method_${(mx + 1)}_assay_1`] || ''}>
                                                                                            <option value=''>Select</option>
                                                                                            {dataDictionary['assay-options']?.map((item, index) => (
                                                                                                <option key={item.id + "_" + index} value={item.name.trim()}>{item.name.trim()}</option>
                                                                                            ))}
                                                                                        </select>
                                                                                        <br />
                                                                                        <select onChange={(ev) => {
                                                                                            handleInputChange(ev)
                                                                                        }} className='form-control autocomplete' id="assay_2_dropdown" data-live-search="true" style={{ height: 'auto', padding: '1px 2px', fontSize: '0.85em', maxWidth: '320px' }} name={`detection_method_${(mx + 1)}_assay_2`} value={formResults[`detection_method_${(mx + 1)}_assay_2`] || ''}>
                                                                                            <option value=''>Select</option>
                                                                                            {dataDictionary['assay-options-2']?.map((item, index) => (
                                                                                                <option key={item.id + "_" + index} value={item.name.trim()}>{item.name.trim()}</option>
                                                                                            ))}
                                                                                        </select>
                                                                                    </td>
                                                                                    <td style={{ verticalAlign: 'middle' }}>
                                                                                        <select onChange={(ev) => {
                                                                                            handleInputChange(ev)
                                                                                        }} className='form-control' style={{ height: 'auto', padding: '1px 2px', fontSize: '0.85em' }} name={`detection_method_${mx + 1}_algorithm`} value={formResults[`detection_method_${mx + 1}_algorithm`] || ''}>
                                                                                            <option value=''>Select</option>
                                                                                            {dataDictionary['algorithm_options']?.map((item, index) => (
                                                                                                <option key={item.id + "_" + index} value={item.name.trim()}>{item.name.trim()}</option>
                                                                                            ))}
                                                                                        </select>
                                                                                        {(formResults && formResults[`detection_method_${mx + 1}_algorithm`] && formResults[`detection_method_${mx + 1}_algorithm`] == dataDictionary['algorithm_options'].find(r => r.id == "others").name) &&
                                                                                            <input type="text" onChange={(ev) => {
                                                                                                handleInputChange(ev)
                                                                                            }} className='form-control' style={{ height: 'auto', padding: '1px 2px', fontSize: '0.85em' }} name={`detection_method_${mx + 1}_algorithm_other`} value={formResults[`detection_method_${mx + 1}_algorithm_other`] || ''} />}
                                                                                    </td>
                                                                                    <td style={{ verticalAlign: 'middle' }}>
                                                                                        <select onChange={(ev) => {
                                                                                            handleInputChange(ev)
                                                                                        }} className='form-control' style={{ height: 'auto', padding: '1px 2px', fontSize: '0.85em' }} name={`detection_method_${mx + 1}_machine_brand`} value={formResults[`detection_method_${mx + 1}_machine_brand`] || ''}>
                                                                                            <option value=''>Select</option>
                                                                                            {dataDictionary['brand_options']?.map((item, index) => (
                                                                                                <option key={item.id + "_" + index} value={item.name.trim()}>{item.name.trim()}</option>
                                                                                            ))}
                                                                                        </select>
                                                                                        {(formResults && formResults[`detection_method_${mx + 1}_machine_brand`] && formResults[`detection_method_${mx + 1}_machine_brand`] == dataDictionary['brand_options'].find(r => r.id == "others").name) &&
                                                                                            <input type="text" onChange={(ev) => {
                                                                                                handleInputChange(ev)
                                                                                            }} className='form-control' style={{ height: 'auto', padding: '1px 2px', fontSize: '0.85em' }} name={`detection_method_${mx + 1}_machine_brand_other`} value={formResults[`detection_method_${mx + 1}_machine_brand_other`] || ''} />}
                                                                                    </td>
                                                                                    <td style={{ verticalAlign: 'middle' }}>
                                                                                        <textarea onChange={(ev) => {
                                                                                            handleInputChange(ev)
                                                                                        }} className='form-control' style={{ height: 'auto', padding: '1px 2px', fontSize: '0.85em' }} name={`detection_method_${mx + 1}_remarks`} value={formResults[`detection_method_${mx + 1}_remarks`]} rows={3}></textarea>
                                                                                    </td>
                                                                                </tr>
                                                                            })}
                                                                            <tr>
                                                                                <td style={{ verticalAlign: 'middle', textAlign: 'center' }}>
                                                                                    <small>Remarks</small>
                                                                                </td>
                                                                                <td colSpan={6} className='text-center'>
                                                                                    <textarea onChange={(ev) => {
                                                                                        handleInputChange(ev)
                                                                                    }} className='form-control' style={{ height: 'auto', padding: '1px 2px', fontSize: '0.85em' }} name={`detection_method_overall_remarks`} value={formResults[`detection_method_overall_remarks`] || ''} rows={3}></textarea>
                                                                                </td>
                                                                            </tr>
                                                                        </tbody>
                                                                    </table>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div role="tabpanel" className="tab-pane" id="results">
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
                                                                                [Please fill in Ct values (for real-time PCR), POS/ NEG (for conventional PCR) or leave blank if not tested]
                                                                            </th>
                                                                            <th style={{ verticalAlign: 'middle' }} rowSpan={3}>INTERPRETATION</th>
                                                                            <th style={{ verticalAlign: 'middle' }} rowSpan={3}>REMARKS/NOTES</th>
                                                                        </tr>
                                                                        <tr className="font-light">
                                                                            {methods.map((method, xm) => (
                                                                                <th style={{ verticalAlign: 'middle' }} key={method.id + "_" + xm} colSpan={3}>{method.name}</th>
                                                                            ))}
                                                                        </tr>
                                                                        <tr className="font-light">
                                                                            {methods.map((method, mx) => {
                                                                                return new Array(3).fill(0).map((z, i) => (
                                                                                    <th style={{ verticalAlign: 'middle' }} key={`${method.id}___${i}`}>
                                                                                        <span style={{ textAlign: 'center', margin: '2px 0', padding: '4px', }} key={"dm_" + mx + "_spl_" + i}>{formResults['mthd_' + method.id + '_target_' + (i + 1) + '_gn_trgt_other'] ? formResults['mthd_' + method.id + '_target_' + (i + 1) + '_gn_trgt_other'] : (formResults['mthd_' + method.id + '_target_' + (i + 1) + '_gn_trgt'] || "Gene target " + (i + 1))}</span>
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
                                                                                            <input value={formResults[`smpl_${sample.id}_mthd_${method.id}_trgt_${i + 1}_result`] || ''} onChange={(ev) => {
                                                                                                handleInputChange(ev)
                                                                                            }} type="text" className="form-control" style={{ height: 'auto', padding: '1px 2px' }} name={`smpl_${sample.id}_mthd_${method.id}_trgt_${i + 1}_result`} />
                                                                                        </td>
                                                                                    ))
                                                                                })}
                                                                                <td style={{ verticalAlign: 'middle' }}>
                                                                                    <select value={formResults[`smpl_${sample.id}_interpretation`] || ''} className="form-control" style={{ height: 'auto', padding: '1px 2px', fontSize: '0.85em' }} name={`smpl_${sample.id}_interpretation`} onChange={(ev) => {
                                                                                        handleInputChange(ev)
                                                                                    }}>
                                                                                        <option value=''>Select</option>
                                                                                        {dataDictionary['interpretation_options']?.map((item, index) => (
                                                                                            <option key={item.id + "_" + index} value={item.name.trim()}>{item.name.trim()}</option>
                                                                                        ))}
                                                                                    </select>
                                                                                    {(formResults && formResults[`smpl_${sample.id}_interpretation`] && formResults[`smpl_${sample.id}_interpretation`] == dataDictionary['interpretation_options'].find(r => r.id == "others").name) &&
                                                                                        <input type="text" onChange={(ev) => {
                                                                                            handleInputChange(ev)
                                                                                        }} className='form-control' style={{ height: 'auto', padding: '1px 2px', fontSize: '0.85em' }} name={`smpl_${sample.id}_interpretation_other`} value={formResults[`smpl_${sample.id}_interpretation_other`]} />}
                                                                                </td>
                                                                                <td style={{ verticalAlign: 'middle' }}>
                                                                                    <textarea rows={1} onInput={(ev) => {
                                                                                        handleInputChange(ev)
                                                                                    }} className="form-control" value={formResults[`smpl_${sample.id}_remarks`]} style={{ height: 'auto', padding: '1px 2px' }} name={`smpl_${sample.id}_remarks`} />
                                                                                </td>
                                                                            </tr>)
                                                                        )}
                                                                    </tbody>
                                                                </table>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div role="tabpanel" className="tab-pane" id="sample_prep">
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
                                                                            <input onChange={(ev) => {
                                                                                handleInputChange(ev)
                                                                            }} type="radio" value={true} name="heat_sample_inactivation" checked={formResults['heat_sample_inactivation'] == 'true' || formResults['heat_sample_inactivation'] == true} style={{ width: '16px', height: '16px' }} />
                                                                            <span className='ml-1'>Yes</span>
                                                                        </span>
                                                                        &nbsp; &nbsp;
                                                                        <span style={{ display: 'flex', alignItems: 'center' }}>
                                                                            <input onChange={(ev) => {
                                                                                handleInputChange(ev)
                                                                            }} type="radio" value={false} name="heat_sample_inactivation" checked={formResults['heat_sample_inactivation'] == 'false' || formResults['heat_sample_inactivation'] == false} style={{ width: '16px', height: '16px' }} />
                                                                            <span className='ml-1'>No</span>
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            {(formResults && formResults['heat_sample_inactivation'] && formResults['heat_sample_inactivation'] == 'true') && <><div className="col-md-4">
                                                                <div className="form-group">
                                                                    <label>Temperature</label>
                                                                    <input type="number" onChange={(ev) => {
                                                                        handleInputChange(ev)
                                                                    }} className="form-control" name="inactivation_temp" value={formResults['inactivation_temp'] || ''} placeholder='0' />
                                                                </div>
                                                            </div>
                                                                <div className="col-md-4">
                                                                    <div className="form-group">
                                                                        <label>Duration (minutes)</label>
                                                                        <input type="number" onChange={(ev) => {
                                                                            handleInputChange(ev)
                                                                        }} className="form-control" name="inactivation_duration" value={formResults['inactivation_duration'] || ''} placeholder='0' />
                                                                    </div>
                                                                </div>
                                                                <div className="col-md-4">
                                                                    <div className="form-group">
                                                                        <label>Method</label>
                                                                        <select
                                                                            onChange={(ev) => {
                                                                                handleInputChange(ev)
                                                                            }}
                                                                            value={formResults['heat)inactivation_method'] || ''}
                                                                            className='form-control' name='heat_inactivation_method'>
                                                                            <option value=''>Select</option>
                                                                            {dataDictionary?.heat_inactivation_method_options?.map((item, index) => (
                                                                                <option key={item.id + "_" + index} value={item.name.trim()}>{item.name.trim()}</option>
                                                                            ))}
                                                                        </select>
                                                                    </div>
                                                                </div></>}
                                                        </div>
                                                    </div>
                                                    <div role="tabpanel" className="tab-pane" id="molecular_detection">
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
                                                                    <select
                                                                        onChange={(ev) => {
                                                                            handleInputChange(ev)
                                                                        }}
                                                                        value={formResults['concerns_molecular_detection_launch'] || ''}
                                                                        className='form-control' name='concerns_molecular_detection_launch'>
                                                                        <option value=''>Select</option>
                                                                        {dataDictionary['molecularconcerns-options']?.map((item, index) => (
                                                                            <option key={item.id + "_" + index} value={item.name.trim()}>{item.name.trim()}</option>
                                                                        ))}
                                                                    </select>
                                                                </div>
                                                            </div>
                                                            <div className="col-md-12">
                                                                <div className="form-group">
                                                                    <label>Additional comments/remarks?</label>
                                                                    <textarea
                                                                        onInput={(ev) => {
                                                                            handleInputChange(ev)
                                                                        }}
                                                                        onChange={(ev) => {
                                                                            handleInputChange(ev)
                                                                        }}
                                                                        value={formResults['concerns_molecular_detection_launch_remarks'] || ''}
                                                                        className='form-control' name='concerns_molecular_detection_launch_remarks' rows={3}></textarea>
                                                                </div>
                                                            </div>
                                                            <div className="col-md-12">
                                                                <div className="form-group">
                                                                    <label>(b) What are the sources of the specimens for testing in your laboratory?</label>
                                                                    <select
                                                                        onChange={(ev) => {
                                                                            handleInputChange(ev)
                                                                        }}
                                                                        value={formResults['specimen_sources'] || ''}
                                                                        className='form-control' name='specimen_sources'>
                                                                        <option value=''>Select</option>
                                                                        {dataDictionary['specimen_sources-options']?.map((item, index) => (
                                                                            <option key={item.id + "_" + index} value={item.name.trim()}>{item.name.trim()}</option>
                                                                        ))}
                                                                    </select>
                                                                </div>
                                                            </div>
                                                            <div className="col-md-12">
                                                                <div className="form-group">
                                                                    <label>Additional comments/remarks?</label>
                                                                    <textarea
                                                                        onInput={(ev) => {
                                                                            handleInputChange(ev)
                                                                        }}
                                                                        onChange={(ev) => {
                                                                            handleInputChange(ev)
                                                                        }}
                                                                        value={formResults['specimen_sources_remarks'] || ''}
                                                                        className='form-control' name='specimen_sources_remarks' rows={3}></textarea>
                                                                </div>
                                                            </div>
                                                            <div className="col-md-12">
                                                                <div className="form-group">
                                                                    <label>(c) Are you testing all specimens coming in?</label>
                                                                    <select
                                                                        onChange={(ev) => {
                                                                            handleInputChange(ev)
                                                                        }}
                                                                        value={formResults['testing_all_specimens'] || ''}
                                                                        className='form-control' name='testing_all_specimens'>
                                                                        <option value=''>Select</option>
                                                                        {dataDictionary['yes_no_options']?.map((item, index) => (
                                                                            <option key={item.id + "_" + index} value={item.name.trim()}>{item.name.trim()}</option>
                                                                        ))}
                                                                    </select>
                                                                </div>
                                                            </div>
                                                            <div className="col-md-12">
                                                                <div className="form-group">
                                                                    <label>(c) If No, what is the criteria of prioritization of specimens for testing?</label>
                                                                    <textarea
                                                                        onInput={(ev) => {
                                                                            handleInputChange(ev)
                                                                        }}
                                                                        onChange={(ev) => {
                                                                            handleInputChange(ev)
                                                                        }}
                                                                        value={formResults['specimen_testing_criteria'] || ''}
                                                                        className='form-control' name='specimen_testing_criteria' rows={2}></textarea>
                                                                </div>
                                                            </div>
                                                            <div className="col-md-12">
                                                                <div className="form-group">
                                                                    <label>Additional comments/remarks?</label>
                                                                    <textarea
                                                                        onInput={(ev) => {
                                                                            handleInputChange(ev)
                                                                        }}
                                                                        onChange={(ev) => {
                                                                            handleInputChange(ev)
                                                                        }}
                                                                        value={formResults['testing_all_specimens_criteria_remarks'] || ''}
                                                                        className='form-control' name='testing_all_specimens_criteria_remarks' rows={3}></textarea>
                                                                </div>
                                                            </div>
                                                            <div className="col-md-12">
                                                                <div className="form-group">
                                                                    <label>(d) What are the common type of specimens accepted for the molecular detection of SARS-CoV-2 in your laboratory?</label>
                                                                    <select
                                                                        onChange={(ev) => {
                                                                            handleInputChange(ev)
                                                                        }}
                                                                        value={formResults['common_specimen_options'] || ''}
                                                                        className='form-control' name='common_specimen_options'>
                                                                        <option value=''>Select</option>
                                                                        {dataDictionary['common-specimen-options']?.map((item, index) => (
                                                                            <option key={item.id + "_" + index} value={item.name.trim()}>{item.name.trim()}</option>
                                                                        ))}
                                                                    </select>
                                                                </div>
                                                            </div>
                                                            <div className="col-md-12">
                                                                <div className="form-group">
                                                                    <label>Additional comments/remarks?</label>
                                                                    <textarea
                                                                        onInput={(ev) => {
                                                                            handleInputChange(ev)
                                                                        }}
                                                                        onChange={(ev) => {
                                                                            handleInputChange(ev)
                                                                        }}
                                                                        value={formResults['common_specimen_options_remarks'] || ''}
                                                                        className='form-control' name='common_specimen_options_remarks' rows={3}></textarea>
                                                                </div>
                                                            </div>
                                                            <div className="col-md-12">
                                                                <div className="form-group">
                                                                    <label>(e) What is the usual daily sample load/ current maximum daily testing capacity for SARS-CoV-2 in your laboratory?</label>
                                                                    <div className='row px-3'>
                                                                        <div className='col-md-5'>
                                                                            <label>Daily sample load</label>
                                                                            <select
                                                                                onChange={(ev) => {
                                                                                    handleInputChange(ev)
                                                                                }}
                                                                                value={formResults['daily_sample_load'] || ''}
                                                                                className='form-control' name='daily_sample_load'>
                                                                                <option value=''>Select</option>
                                                                                {dataDictionary['daily-sample-load-options']?.map((item, index) => (
                                                                                    <option key={item.id + "_" + index} value={item.name.trim()}>{item.name.trim()}</option>
                                                                                ))}
                                                                            </select>
                                                                        </div>
                                                                        <div className='col-md-5'>
                                                                            <label>Maximum daily testing capacity</label>
                                                                            <select
                                                                                onChange={(ev) => {
                                                                                    handleInputChange(ev)
                                                                                }}
                                                                                value={formResults['maximum_daily_capacity'] || ''}
                                                                                className='form-control' name='maximum_daily_capacity'>
                                                                                <option value=''>Select</option>
                                                                                {dataDictionary['daily-sample-load-options']?.map((item, index) => (
                                                                                    <option key={item.id + "_" + index} value={item.name.trim()}>{item.name.trim()}</option>
                                                                                ))}
                                                                            </select>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="col-md-12">
                                                                <div className="form-group">
                                                                    <label>Additional comments/remarks?</label>
                                                                    <textarea
                                                                        onInput={(ev) => {
                                                                            handleInputChange(ev)
                                                                        }}
                                                                        onChange={(ev) => {
                                                                            handleInputChange(ev)
                                                                        }}
                                                                        value={formResults['sample_load_test_capacity_remarks'] || ''}
                                                                        className='form-control' name='sample_load_test_capacity_remarks' rows={3}></textarea>
                                                                </div>
                                                            </div>
                                                            <div className="col-md-12">
                                                                <div className="form-group">
                                                                    <label>(f) What is the usual turnaround time for the molecular detection of SARS-CoV-2 in your laboratory?</label>
                                                                    <select
                                                                        onChange={(ev) => {
                                                                            handleInputChange(ev)
                                                                        }}
                                                                        value={formResults['turnaround_time'] || ''}
                                                                        className='form-control' name='turnaround_time'>
                                                                        <option value=''>Select</option>
                                                                        {dataDictionary['tat-options']?.map((item, index) => (
                                                                            <option key={item.id + "_" + index} value={item.name.trim()}>{item.name.trim()}</option>
                                                                        ))}
                                                                    </select>
                                                                </div>
                                                            </div>
                                                            <div className="col-md-12">
                                                                <div className="form-group">
                                                                    <label>Additional comments/remarks?</label>
                                                                    <textarea
                                                                        onInput={(ev) => {
                                                                            handleInputChange(ev)
                                                                        }}
                                                                        onChange={(ev) => {
                                                                            handleInputChange(ev)
                                                                        }}
                                                                        value={formResults['turnaround_time_remarks'] || ''}
                                                                        className='form-control' name='turnaround_time_remarks' rows={3}></textarea>
                                                                </div>
                                                            </div>
                                                            <div className="col-md-12">
                                                                <div className="form-group">
                                                                    <label>(g) BSL requirement if any in your country?</label>
                                                                    <div className='row px-3'>
                                                                        <div className='col-md-5'>
                                                                            <label>For PCR</label>
                                                                            <select
                                                                                onChange={(ev) => {
                                                                                    handleInputChange(ev)
                                                                                }}
                                                                                value={formResults['bsl_pcr'] || ''}
                                                                                className='form-control' name='bsl_pcr'>
                                                                                <option value=''>Select</option>
                                                                                {dataDictionary['bsl-pcr-options']?.map((item, index) => (
                                                                                    <option key={item.id + "_" + index} value={item.name.trim()}>{item.name.trim()}</option>
                                                                                ))}
                                                                            </select>
                                                                        </div>
                                                                        <div className='col-md-5'>
                                                                            <label>For virus isolation</label>
                                                                            <select
                                                                                onChange={(ev) => {
                                                                                    handleInputChange(ev)
                                                                                }}
                                                                                value={formResults['bsl_virus_isolation'] || ''}
                                                                                className='form-control' name='bsl_virus_isolation'>
                                                                                <option value=''>Select</option>
                                                                                {dataDictionary['bsl-pcr-options']?.map((item, index) => (
                                                                                    <option key={item.id + "_" + index} value={item.name.trim()}>{item.name.trim()}</option>
                                                                                ))}
                                                                            </select>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="col-md-12">
                                                                <div className="form-group">
                                                                    <label>Additional comments/remarks?</label>
                                                                    <textarea
                                                                        onInput={(ev) => {
                                                                            handleInputChange(ev)
                                                                        }}
                                                                        onChange={(ev) => {
                                                                            handleInputChange(ev)
                                                                        }}
                                                                        value={formResults['bsl_requirements_remarks'] || ''}
                                                                        className='form-control' name='bsl_requirements_remarks' rows={3}></textarea>
                                                                </div>
                                                            </div>
                                                            <div className="col-md-12">
                                                                <div className="form-group">
                                                                    <label>(h) Which type(s) of quality control(s) is/are included in the molecular detection of SARS-CoV-2 in your laboratory?</label>
                                                                    <select
                                                                        onChange={(ev) => {
                                                                            handleInputChange(ev)
                                                                        }}
                                                                        value={formResults['quality_ctrl'] || ''}
                                                                        className='form-control' name='quality_ctrl'>
                                                                        <option value=''>Select</option>
                                                                        {dataDictionary['qc-options']?.map((item, index) => (
                                                                            <option key={item.id + "_" + index} value={item.name.trim()}>{item.name.trim()}</option>
                                                                        ))}
                                                                    </select>
                                                                </div>
                                                            </div>
                                                            <div className="col-md-12">
                                                                <div className="form-group">
                                                                    <label>Additional comments/remarks?</label>
                                                                    <textarea
                                                                        onInput={(ev) => {
                                                                            handleInputChange(ev)
                                                                        }}
                                                                        onChange={(ev) => {
                                                                            handleInputChange(ev)
                                                                        }}
                                                                        value={formResults['quality_ctrl_remarks'] || ''}
                                                                        className='form-control' name='quality_ctrl_remarks' rows={3}></textarea>
                                                                </div>
                                                            </div>
                                                            <div className="col-md-12">
                                                                <div className="form-group">
                                                                    <label>(h) Has the detection method(s) been validated against other common respiratory pathogens?</label>
                                                                    <select
                                                                        onChange={(ev) => {
                                                                            handleInputChange(ev)
                                                                        }}
                                                                        value={formResults['method_validation'] || ''}
                                                                        className='form-control' name='method_validation'>
                                                                        <option value=''>Select</option>
                                                                        {dataDictionary['respiratory-options']?.map((item, index) => (
                                                                            <option key={item.id + "_" + index} value={item.name.trim()}>{item.name.trim()}</option>
                                                                        ))}
                                                                    </select>
                                                                </div>
                                                            </div>
                                                            <div className="col-md-12">
                                                                <div className="form-group">
                                                                    <label>Additional comments/remarks?</label>
                                                                    <textarea
                                                                        onInput={(ev) => {
                                                                            handleInputChange(ev)
                                                                        }}
                                                                        onChange={(ev) => {
                                                                            handleInputChange(ev)
                                                                        }}
                                                                        value={formResults['method_validation_remarks'] || ''}
                                                                        className='form-control' name='method_validation_remarks' rows={3}></textarea>
                                                                </div>
                                                            </div>
                                                            <div className="col-md-12" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                                <button type="submit" className="btn btn-primary"> &nbsp; Submit &nbsp; </button>
                                                                <button type="reset" className="btn btn-link float-right">Reset</button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                </form>
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

export default SubmissionForm

if (document.getElementById('submission_form')) {
    ReactDOM.render(<SubmissionForm />, document.getElementById('submission_form'));
}