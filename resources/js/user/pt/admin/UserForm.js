import React from 'react';
import { SaveAdminUser, UpdateAdminUser, FetchAdminUser } from '../../../components/utils/Helpers';
import { v4 as uuidv4 } from 'uuid';
import { matchPath } from "react-router";

class UserForm extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            submissions: [],
            isSubmitResult: false,
            dtObject: null,
            message: '',
            id: '',
            name: '',
            email: '',
            phoneNumber: '',
            password: '',
            pageState: 'add',
            pageHeading: 'Add New Manager'
        }

        this.handleEmailChange = this.handleEmailChange.bind(this);
        this.handleNameChange = this.handleNameChange.bind(this);
        this.handlePasswordChange = this.handlePasswordChange.bind(this);
        this.handlePhoneChange = this.handlePhoneChange.bind(this);
        this.validatePassword = this.validatePassword.bind(this);
    }

    componentDidMount() {
        let pathname = window.location.pathname;
        let pathObject = matchPath(pathname, {
            path: `/edit-admin-user/:userId`,
        });
        if (pathObject) {

            (async () => {
                let userBio = await FetchAdminUser(pathObject.params.userId);
                if (userBio.status == 500) {
                    this.setState({
                        message: userBio.data.Message,
                        pageState: 'edit',
                        pageHeading: "Edit Manager"
                    })
                    $('#addAdminUserModal').modal('toggle');
                } else {

                    this.setState({
                        id: userBio.id,
                        name: userBio.name,
                        email: userBio.email,
                        phoneNumber: userBio.phone_number,
                        pageState: 'edit',
                        pageHeading: "Edit Manager"
                    });
                }

            })();

        }

    }

    validatePassword(password) {
        console.log(password);
        let isValid = true;
        let upperCaseLetters = /[A-Z]/g;
        if (
            password.length < 6 || !(password.match(upperCaseLetters))
        ) {

            this.setState({
                message: "Password length should not be less than 6 characters and should contain an upper case letter",
            })
            $('#addAdminUserModal').modal('toggle');

            isValid = false;

        } else {

            isValid = true;
        }
        return isValid;
    }

    handleNameChange(name) {
        this.setState({
            name: name
        });
    }

    handleEmailChange(email) {
        this.setState({
            email: email
        });
    }

    handlePasswordChange(password) {
        this.setState({
            password: password
        });
    }

    handlePhoneChange(phoneNumber) {
        this.setState({
            phoneNumber: phoneNumber
        });
    }

    // componentDidUpdate(prevProps, prevState) {
    //     if (
    //         prevState.email != this.state.email ||
    //         prevState.phoneNumber != this.state.phoneNumber ||
    //         prevState.name != this.state.name ||
    //         prevState.password != this.state.password
    //     ) {
    //         return false;
    //     } else {
    //         return true;
    //     }
    // }
    saveUser() {

        if (!this.validatePassword(this.state.password) && this.state.pageState == 'add') {
            return;
        }

        if (!this.validatePassword(this.state.password) && this.state.pageState == 'edit' && (this.state.password)) {
            return;
        }

        if (
            this.state.name == '' ||
            this.state.email == '' ||
            this.state.phoneNumber == '' ||
            (this.state.pageState == 'add' && this.state.password == '')
        ) {
            this.setState({
                message: "Kindly fill all fileds in the form"
            })
            $('#addAdminUserModal').modal('toggle');
        } else {
            (async () => {
                let user = {};
                { this.state.pageState == 'edit' ? user['id'] = this.state.id : '' }
                user['name'] = this.state.name
                user['email'] = this.state.email
                user['phone_number'] = this.state.phoneNumber
                user['password'] = this.state.password
                let response;
                if (this.state.pageState == 'edit') {
                    response = await UpdateAdminUser(user);
                    this.setState({
                        message: response.data.Message,
                    });
                } else if (this.state.pageState == 'add') {
                    response = await SaveAdminUser(user);
                    if (response.status == 200) {
                        this.setState({
                            message: response.data.Message,
                            name: '',
                            phoneNumber: '',
                            password: '',
                            email: ''
                        });
                    } else {
                        this.setState({
                            message: response.data.Message,
                        });
                    }

                }

                $('#addAdminUserModal').modal('toggle');

            })();
        }

    }

    render() {

        return (
            <React.Fragment>

                <div className="card" style={{ "backgroundColor": "#ecf0f1" }}>
                    <div className="card-body">
                        <h5 className="card-title">{this.state.pageHeading}</h5><br />
                        <hr />
                        <div style={{ "margin": "0 auto", "width": "60%" }} className="text-center">
                            <form action="#" >
                                <div className="form-group row">
                                    <label htmlFor="u_mail" className="col-sm-2 col-form-label">Email *</label>
                                    <div className="col-sm-10">
                                        <input
                                            value={this.state.email}
                                            onChange={(event) => this.handleEmailChange(event.target.value)}
                                            type="email" className="form-control" id="u_mail" />
                                    </div>
                                </div>
                                <div className="form-group row">
                                    <label htmlFor="u_name" className="col-sm-2 col-form-label">Name *</label>
                                    <div className="col-sm-10">
                                        <input
                                            value={this.state.name}
                                            onChange={(event) => this.handleNameChange(event.target.value)} type="text"
                                            className="form-control" id="u_name" />
                                    </div>
                                </div>

                                <div className="form-group row">
                                    <label htmlFor="u_phone" className="col-sm-2 col-form-label">Phone No. *</label>
                                    <div className="col-sm-10">
                                        <input
                                            value={this.state.phoneNumber}
                                            onChange={(event) => this.handlePhoneChange(event.target.value)} type="text"
                                            className="form-control" id="u_phone" />
                                    </div>
                                </div>

                                <div className="form-group row">
                                    <label htmlFor="u_password" className="col-sm-2 col-form-label">Password *</label>
                                    <div className="col-sm-10">
                                        <input
                                            value={this.state.password}
                                            onBlur={(event) => {
                                                if (this.state.pageState == 'edit' && event.target.value) {
                                                    this.validatePassword(event.target.value)
                                                }
                                            }}
                                            onChange={(event) => this.handlePasswordChange(event.target.value)}
                                            type="text" className="form-control" id="u_password" />
                                        {this.state.pageState == 'edit' ?
                                            <small style={{ "color": "red" }} className="form-text">Leave blank to retain previous password.</small> :
                                            ''}
                                    </div>
                                </div>


                                <div className="form-group row">
                                    <div className="col-sm-10">
                                        <a onClick={() => this.saveUser()} type="" className="d-inline m-2 btn btn-info m">
                                            {this.state.pageState == 'add' ? 'Add' : 'Update'}
                                        </a>
                                        <a
                                            onClick={
                                                () => {
                                                    window.location.assign('/list-admin-user')
                                                }
                                            }
                                            className="d-inline m-2 btn btn-danger">exit</a>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>

                < div className="modal fade" id="addAdminUserModal" tabIndex="-1" role="dialog" aria-labelledby="addAdminUserModalTitle" aria-hidden="true" >
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

            </React.Fragment>
        );
    }

}

export default UserForm;
