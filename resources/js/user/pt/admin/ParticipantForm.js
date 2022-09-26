import React from 'react';
import { SaveParticipant, FetchParticipant, EditParticipant, FetchCounties } from '../../../components/utils/Helpers';
import { v4 as uuidv4 } from 'uuid';
import { matchPath } from "react-router";

class ParticipantForm extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            submissions: [],
            isSubmitResult: false,
            dtObject: null,
            message: '',
            id: '',
            instituteName: '',
            email: '',
            isActive: true,
            institution_name: '',
            mflCode: '',
            phoneNumber: '',
            facilityLevel: '',
            county: '',
            labName: '',
            pageState: 'add',
            counties: []
        }

        this.handleEmailChange = this.handleEmailChange.bind(this);
        this.handleNameChange = this.handleNameChange.bind(this);
        this.handleIsActiveChange = this.handleIsActiveChange.bind(this);
        this.handlePhoneChange = this.handlePhoneChange.bind(this);

        this.handleCountyChange = this.handleCountyChange.bind(this);
        this.handleFacilityLevelChange = this.handleFacilityLevelChange.bind(this);
        this.handleMflCodeChange = this.handleMflCodeChange.bind(this);
        this.handleLabNameChange = this.handleLabNameChange.bind(this);

    }

    componentDidMount() {

        let pathname = window.location.pathname;
        let pathObject = matchPath(pathname, {
            path: `/edit-lab/:labId`,
        });

        if (pathObject) {

            (async () => {
                let editData = await FetchParticipant(pathObject.params.labId);
                let counties = await FetchCounties();
                if (editData.status == 500) {
                    this.setState({
                        message: editData.data.Message,
                        pageState: 'edit'
                    })
                    $('#addLabModal').modal('toggle');
                } else {

                    this.setState({
                        id: editData.id,
                        instituteName: editData.institute_name,
                        mflCode: editData.mfl_code,
                        phoneNumber: editData.phone_number,
                        facilityLevel: editData.facility_level,
                        county: editData.county,
                        labName: editData.lab_name,
                        email: editData.email,
                        pageState: 'edit',
                        isActive: editData.is_active,
                        counties: counties
                    });
                }
            })();
        } else {

            (async () => {
                let counties = await FetchCounties();
                this.setState({
                    counties: counties
                });
            })();

        }
    }

    handleNameChange(instituteName) {
        this.setState({
            instituteName: instituteName
        });
    }

    handleEmailChange(email) {
        this.setState({
            email: email
        });
    }

    handleIsActiveChange(isActive) {
        this.setState({
            isActive: isActive
        });
    }

    handlePhoneChange(phoneNumber) {
        this.setState({
            phoneNumber: phoneNumber
        });
    }

    handleMflCodeChange(mflCode) {
        this.setState({
            mflCode: mflCode
        });
    }
    handleFacilityLevelChange(facilityLevel) {
        this.setState({
            facilityLevel: facilityLevel
        });
    }
    handleCountyChange(county) {
        this.setState({
            county: county
        });
    }

    handleLabNameChange(labName) {
        this.setState({
            labName: labName
        });
    }

    saveLab() {

        if (
            this.state.instituteName == '' ||
            this.state.email == '' ||
            this.state.phoneNumber == '' ||
            this.state.mflCode == '' ||
            this.state.facilityLevel == '' ||
            this.state.county == '' ||
            this.state.labName == ''

        ) {

            this.setState({
                message: "Kindly fill all fileds in the form and that they have the right values"
            });
            $('#addLabModal').modal('toggle');
        } else {
            (async () => {
                let lab = {};
                { this.state.pageState == 'edit' ? lab['id'] = this.state.id : '' }
                lab['institute_name'] = this.state.instituteName;
                lab['email'] = this.state.email;
                lab['phone_number'] = this.state.phoneNumber;
                lab['is_active'] = this.state.isActive;
                lab['mfl_code'] = this.state.mflCode;
                lab['facility_level'] = this.state.facilityLevel;
                lab['county'] = this.state.county;
                lab['lab_name'] = this.state.labName;

                let response;
                if (this.state.pageState == 'edit') {
                    response = await EditParticipant(lab);
                    this.setState({
                        message: response.data.Message,
                    });
                } else if (this.state.pageState == 'add') {
                    response = await SaveParticipant(lab);
                    if (response.status == 200) {
                        this.setState({
                            message: response.data.Message,
                            instituteName: '',
                            phoneNumber: '',
                            isActive: true,
                            email: '',
                            mflCode: '',
                            facilityLevel: '',
                            county: '',
                            labName: ''
                        });
                    } else {
                        this.setState({
                            message: response.data.Message,
                        });
                    }
                }

                $('#addLabModal').modal('toggle');
            })();
        }

    }

    render() {
        
        return (
            <React.Fragment>

                <div className="card" style={{ "backgroundColor": "#ecf0f1" }}>
                    <div className="card-body">
                        <h5 className="card-title">Add New Participant</h5><br />
                        <hr />
                        <div>
                            <form action="#" >

                                <div className="form-row">

                                    <div className="col-md-6 mb-3">
                                        <label htmlFor="u_name" >Facility/Institute Name *</label>
                                        <input
                                            value={this.state.instituteName}
                                            onChange={(event) => this.handleNameChange(event.target.value)} type="text"
                                            className="form-control" id="u_name" />
                                    </div>

                                    {/* add */}
                                    <div className="col-md-6 mb-3">
                                        <label htmlFor="u_mail" >MFL Code *</label>
                                        <input
                                            value={this.state.mflCode}
                                            onChange={(event) => this.handleMflCodeChange(event.target.value)}
                                            type="number" className="form-control" id="u_mfl" />
                                    </div>
                                </div>


                                <div className="form-row">
                                    {/* add */}
                                    <div className="col-md-6 mb-3">
                                        <label htmlFor="u_facility_level" >Facility Level *</label>
                                        <input
                                            value={this.state.facilityLevel}
                                            onChange={(event) => this.handleFacilityLevelChange(event.target.value)}
                                            type="number" className="form-control" id="u_facility_level" />
                                    </div>



                                    <div className="col-md-6 mb-3">
                                        <label htmlFor="u_lab_name" >Lab Name *</label>
                                        <input
                                            value={this.state.labName}
                                            onChange={(event) => this.handleLabNameChange(event.target.value)}
                                            type="text" className="form-control" id="u_lab_name" />
                                    </div>


                                </div>


                                <div className="form-row">

                                    <div className="col-md-6 mb-3">
                                        <label htmlFor="u_mail" >Email *</label>
                                        <input
                                            value={this.state.email}
                                            onChange={(event) => this.handleEmailChange(event.target.value)}
                                            type="email" className="form-control" id="u_mail" />
                                    </div>

                                    <div className="col-md-6 mb-3">
                                        <label htmlFor="u_phone" >Phone No. *</label>
                                        <input
                                            value={this.state.phoneNumber}
                                            onChange={(event) => this.handlePhoneChange(event.target.value)} type="number"
                                            className="form-control" id="u_phone" />
                                    </div>


                                </div>

                                <div className="form-row">

                                    <div className="col-md-6 mb-3">
                                        <label htmlFor="u_is_county" >County</label>
                                        <select
                                            id="u_is_county"
                                            value={this.state.county} className="custom-select"
                                            onChange={(event) => this.handleCountyChange(event.target.value)}
                                        >
                                            <option selected>Open this select menu</option>

                                            {
                                                this.state.counties.length>0 ?
                                                    this.state.counties.map((county) => {
                                                        return <option key={uuidv4()} value={county.id}>{county.name}</option>
                                                    }) : ''
                                            }

                                        </select>

                                    </div>

                                    <div className="col-md-6 mb-3">
                                        <label htmlFor="u_is_active" >Active</label>
                                        <select
                                            id="u_is_active"
                                            value={this.state.isActive} className="custom-select"
                                            onChange={(event) => this.handleIsActiveChange(event.target.value)}
                                        >
                                            <option value={1}>True</option>
                                            <option value={0}>False</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="form-group row">
                                    <div className="col-sm-12 text-center">
                                        <a href="#" onClick={() => this.saveLab()} type="" className="d-inline m-2 btn btn-info m">Save</a>
                                        <a
                                            onClick={
                                                () => {
                                                    window.location.assign('/list-lab')
                                                }
                                            }
                                            className="d-inline m-2 btn btn-danger">Exit</a>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>

                < div className="modal fade" id="addLabModal" tabIndex="-1" role="dialog" aria-labelledby="addLabModalTitle" aria-hidden="true" >
                    <div className="modal-dialog modal-dialog-centered" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="addLabModalTitle">Notice!</h5>
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

export default ParticipantForm;
