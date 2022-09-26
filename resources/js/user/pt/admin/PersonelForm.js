import React from 'react';
import ReactDOM from 'react-dom';
import { SaveLabPersonel, FetchParticipantList, FetchLabPersonelById, UpdateLabPersonel } from '../../../components/utils/Helpers';
import { v4 as uuidv4 } from 'uuid';
import { matchPath } from "react-router";

class PersonelForm extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            submissions: [],
            isSubmitResult: false,
            dtObject: null,
            message: '',
            id: '',
            email: '',
            facility: '',
            firstName: '',
            secondName: '',
            phoneNumber: '',
            password: '',
            hasQcAccess: true,
            hasPtAccess: true,
            isActive: 1,
            participantList: [],
            pageState: 'add'
        }

        this.handleEmailChange = this.handleEmailChange.bind(this);
        this.handleFacilityChange = this.handleFacilityChange.bind(this);
        this.handleFirstNameChange = this.handleFirstNameChange.bind(this);
        this.handleSecondNameChange = this.handleSecondNameChange.bind(this);
        this.handlePhoneChange = this.handlePhoneChange.bind(this);
        this.handlePasswordChange = this.handlePasswordChange.bind(this);
        this.handleIsQcActiveChange = this.handleIsQcActiveChange.bind(this);
        this.handleIsPtActiveChange = this.handleIsPtActiveChange.bind(this);
        this.handleIsActiveChange = this.handleIsActiveChange.bind(this);
        this.validatePassword = this.validatePassword.bind(this);

    }

    componentDidMount() {

        let pathname = window.location.pathname;
        let pathObject = matchPath(pathname, {
            path: `/edit-personel/:personelId`,
        });
        let participantList = [];
        (async () => {
            participantList = await FetchParticipantList();
            this.setState({
                participantList: participantList
            });

        })();

        if (pathObject) {

            (async () => {
                let editData = await FetchLabPersonelById(pathObject.params.personelId);
                if (editData) {
                    editData = editData[0];
                }


                if (editData.status == 500) {
                    this.setState({
                        message: editData.data.Message,
                        pageState: 'edit'
                    })
                    $('#addPersonelModal').modal('toggle');
                } else {

                    this.setState({
                        participantList: participantList,
                        id: editData.id,
                        email: editData.email,
                        facility: editData.laboratory_id,
                        firstName: editData.name,
                        secondName: editData.second_name,
                        phoneNumber: editData.phone_number,
                        hasQcAccess: editData.has_qc_access == 1 ? true : false,
                        hasPtAccess: editData.has_pt_access == 1 ? true : false,
                        isActive: editData.is_active,
                        pageState: 'edit',
                    });

                    setTimeout(() => {
                        document.querySelector('#u_facility').value = editData.laboratory_id;
                    }, 4000);
                }
            })();
        }

    }

    handleIsActiveChange(isActive) {
        this.setState({
            isActive: isActive
        });
    }

    handleFacilityChange(facility) {
        this.setState({
            facility: facility
        });
    }

    handleEmailChange(email) {
        this.setState({
            email: email
        });
    }

    handleIsQcActiveChange(hasQcAccess) {
        this.setState({
            hasQcAccess: hasQcAccess
        });
    }

    handleIsPtActiveChange(hasPtAccess) {
        this.setState({
            hasPtAccess: hasPtAccess
        });
    }

    handlePhoneChange(phoneNumber) {
        this.setState({
            phoneNumber: phoneNumber
        });
    }

    handleFirstNameChange(firstName) {
        this.setState({
            firstName: firstName
        });
    }

    handleSecondNameChange(secondName) {
        this.setState({
            secondName: secondName
        });
    }

    handlePasswordChange(password) {
        this.setState({
            password: password
        });

    }

    validatePassword(password) {
        let isValid = true;
        let upperCaseLetters = /[A-Z]/g;
        if (
            password.length < 6 || !(password.match(upperCaseLetters))
        ) {

            this.setState({
                message: "Password length should not be less than 6 characters and should contain an upper case letter",
            })
            $('#addPersonelModal').modal('toggle');

            isValid = false;

        } else {

            isValid = true;
        }
        return isValid;
    }


    savePersonel() {

        if (!this.validatePassword(this.state.password) && this.state.pageState == 'add') {
            return;
        }

        if (!this.validatePassword(this.state.password) && this.state.pageState == 'edit' && (this.state.password)) {
            return;
        }
      
        if (
            this.state.facility == '' ||
            this.state.email == '' ||
            this.state.phoneNumber == '' ||
            this.state.firstName == '' ||
            this.state.secondName == '' ||
            (this.state.pageState == 'add' && this.state.password == '')

        ) {
            this.setState({
                message: "Kindly fill the required fileds marked in *"
            });
            $('#addPersonelModal').modal('toggle');
        } else {

            (async () => {

                let personel = {};
                { this.state.pageState == 'edit' ? personel['id'] = this.state.id : '' }
                personel['email'] = this.state.email;
                personel['facility'] = this.state.facility;
                personel['first_name'] = this.state.firstName;
                personel['second_name'] = this.state.secondName ? this.state.secondName : null;
                personel['phone_number'] = this.state.phoneNumber;
                personel['password'] = this.state.password;
                personel['has_qc_access'] = this.state.hasQcAccess ? 1 : 0;
                personel['has_pt_access'] = this.state.hasPtAccess ? 1 : 0;
                personel['is_active'] = this.state.isActive;

                let response;

                if (this.state.pageState == 'edit') {
                    response = await UpdateLabPersonel(personel);
                    this.setState({
                        message: response.data.Message,
                    });
                } else if (this.state.pageState == 'add') {
                    response = await SaveLabPersonel(personel);
                    if (response.status == 200) {
                        this.setState({
                            message: response.data.Message,
                            email: '',
                            facility: '',
                            firstName: '',
                            secondName: '',
                            phoneNumber: '',
                            password: '',
                            hasQcAccess: true,
                            hasPtAccess: true,
                        });
                    } else {
                        this.setState({
                            message: response.data.Message,
                        });
                    }

                }

                $('#addPersonelModal').modal('toggle');
            })();
        }


    }

    componentDidUpdate() {
        try {
            $('#u_facility').selectpicker();
            if(this.state.facility && this.state.facility != '' && this.state.facility != null){
                $('#u_facility').val(this.state.facility);
                $('#u_facility').selectpicker('refresh');
            }
        } catch (err) {

        }


    }

    render() {

        let labLists = [];
        labLists.push(<option key={uuidv4()}>-- select lab --</option>);
        this.state.participantList.map((participant) => {
            labLists.push(<option key={participant.id} value={participant.id}>{participant.lab_name}</option>);
        });

        let labSelect = <div>No Facility defined</div>;
        if (this.state.participantList.length != 0) {
            labSelect = <select
                id="u_facility"
                value={this.state.facility}
                onChange={(event) => this.handleFacilityChange(event.target.value)} type="text"
                data-dropup-auto="false"
                data-live-search="true"
                // className="selectpicker form-control dropup">
                className="form-control"
            >
                {labLists}
            </select>;
        }

        return (
            <React.Fragment>

                <div className="card" style={{ "backgroundColor": "#ecf0f1" }}>
                    <div className="card-body">
                        <h5 className="card-title">Add New Lab Personel</h5><br />
                        <hr />
                        <div>
                            <form action="#" >

                                <div className="form-row">

                                    <div className="col-md-6 mb-3">
                                        <label htmlFor="u_email" >Login (Primary email) *</label>
                                        <input
                                            value={this.state.email}
                                            onChange={(event) => this.handleEmailChange(event.target.value)} type="email"
                                            className="form-control" id="u_email" />
                                    </div>

                                    {/* add */}
                                    <div className="col-md-6 mb-3">
                                        <label htmlFor="u_facility" >Laboratory *</label>

                                        {labSelect}
                                    </div>
                                </div>


                                <div className="form-row">
                                    {/* add */}
                                    <div className="col-md-6 mb-3">
                                        <label htmlFor="u_first_name" >First Name  *</label>
                                        <input
                                            value={this.state.firstName}
                                            onChange={(event) => this.handleFirstNameChange(event.target.value)}
                                            type="text" className="form-control" id="u_first_name" />
                                    </div>



                                    <div className="col-md-6 mb-3">
                                        <label htmlFor="u_second_name" >Second Name *</label>

                                        <input
                                            value={this.state.secondName}
                                            onChange={(event) => this.handleSecondNameChange(event.target.value)}
                                            type="text" className="form-control" id="u_second_name" />
                                    </div>


                                </div>


                                <div className="form-row">

                                    <div className="col-md-6 mb-3">
                                        <label htmlFor="u_phone" >Phone Number  *</label>
                                        <input
                                            value={this.state.phoneNumber}
                                            onChange={(event) => this.handlePhoneChange(event.target.value)} type="number"
                                            className="form-control" id="u_phone" />
                                    </div>

                                    <div className="col-md-6 mb-3">
                                        <label htmlFor="u_password" >Password  *</label>
                                        <input
                                            value={this.state.password}
                                            onBlur={(event) => {
                                                if (this.state.pageState == 'edit' && event.target.value) {
                                                    this.validatePassword(event.target.value)
                                                }
                                            }}
                                            onChange={(event) => this.handlePasswordChange(event.target.value)}
                                            type="email" className="form-control" id="u_password" />
                                            {this.state.pageState == 'edit' ?
                                            <small style={{ "color": "red" }} className="form-text">Leave blank to retain previous password.</small> :
                                            ''}
                                    </div>
                                </div>

                                <div className="form-row">

                                    <div className="col-md-6 mb-3">
                                        <label htmlFor="u_active" >Active</label>
                                        <select
                                            id="u_active"
                                            value={this.state.isActive} className="custom-select"
                                            onChange={(event) => this.handleIsActiveChange(event.target.value)}
                                        >
                                            <option value={1}>True</option>
                                            <option value={0}>False</option>
                                        </select>
                                    </div>



                                </div>

                                <div className="form-row">

                                    <div className="col-md-6 mb-3">

                                        <input
                                            checked={this.state.hasQcAccess}
                                            onChange={(event) => this.handleIsQcActiveChange(event.target.checked)}
                                            type="checkbox"
                                            id="u_qc_access" />
                                        <label className="ml-3" htmlFor="u_qc_access" >Has PT Access</label>

                                    </div>

                                    {/* <div className="col-md-6 mb-3">
                                        <input
                                            checked={this.state.hasPtAccess}
                                            onChange={(event) => this.handleIsPtActiveChange(event.target.checked)}
                                            type="checkbox"
                                            id="u_pt_access" />
                                        <label className="ml-3" htmlFor="u_pt_access" > Has PT Access</label>
                                    </div> */}
                                </div>

                                <div className="form-group row">
                                    <div className="col-sm-12 text-center">
                                        <a href="#" onClick={() => this.savePersonel()} type="" className="d-inline m-2 btn btn-info m">Save</a>
                                        <a
                                            onClick={
                                                () => {
                                                    window.location.assign('/list-personel')
                                                }
                                            }
                                            className="d-inline m-2 btn btn-danger">exit</a>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>

                < div className="modal fade" id="addPersonelModal" tabIndex="-1" role="dialog" aria-labelledby="addPersonelModalTitle" aria-hidden="true" >
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

export default PersonelForm;