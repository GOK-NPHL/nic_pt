import React from 'react';
import ReactDOM from 'react-dom';
import { UpdateOwnBio, FetchCurrentParticipantDemographics } from '../../../components/utils/Helpers';
import { v4 as uuidv4 } from 'uuid';
import Pagination from "react-js-pagination";

class Demographics extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            userDemographics: [],
            firstName: '',
            secondName: '',
            email: '',
            phoneNumber: '',
            password: '',
            passwordConfirm: '',
            id: ''

        }

        this.handleEmailChange = this.handleEmailChange.bind(this);
        this.handleFirstNameChange = this.handleFirstNameChange.bind(this);
        this.handleSecondNameChange = this.handleSecondNameChange.bind(this);
        this.handlePhoneChange = this.handlePhoneChange.bind(this);
        this.handlePasswordChange = this.handlePasswordChange.bind(this);
        this.updatePersonel = this.updatePersonel.bind(this);
    }

    componentDidMount() {

        (async () => {
            let userDemographics = await FetchCurrentParticipantDemographics();
            this.setState({
                userDemographics: userDemographics,
                id: userDemographics[0].user_id,
                firstName: userDemographics[0].name,
                secondName: userDemographics[0].second_name,
                email: userDemographics[0].email,
                phoneNumber: userDemographics[0].user_phone_number,
            })
        })();

    }

    handleEmailChange(email) {
        this.setState({
            email: email
        });
    }

    handlePhoneChange(phoneNumber) {
        console.log(phoneNumber)
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

    handlePasswordChange(password, position) {
        if (position == 1) {
            this.setState({
                password: password
            });
        } else {
            this.setState({
                passwordConfirm: password
            });
        }
    }

    updatePersonel() {

        if (this.state.password != this.state.passwordConfirm) {
            this.setState({
                message: "password 1 does not match password 2",
            });
            $('#editPersonelModal').modal('toggle');
        } else {
            (async () => {

                let personel = {};
                personel['id'] = this.state.id;
                personel['email'] = this.state.email;
                personel['first_name'] = this.state.firstName;
                personel['second_name'] = this.state.secondName ? this.state.secondName : null;
                personel['phone_number'] = this.state.phoneNumber;
                personel['password'] = this.state.password;

                let response;

                response = await UpdateOwnBio(personel);
                this.setState({
                    message: response.data.Message,
                });
                $('#editPersonelModal').modal('toggle');

            })();
        }

    }

    componentDidUpdate(prevProps, prevState) {
        // if (
        //     ((prevState.isSubmitResult != this.state.isSubmitResult))
        // ) {

        //     this.fetchSubmissions();
        // }
    }

    render() {

        return (
            <React.Fragment>

                <div style={{ "margin": "0 auto", "width": "60%" }} >
                    <h3 className="mb-5">Personal details</h3>

                    <div className="form-group row">
                        <label htmlFor="exampleInputEmail1" className="col-sm-3 col-form-label">Email address *</label>
                        <div className="col-sm-9">
                            <input type="email" className="form-control"
                                value={this.state.email}
                                onChange={() => this.handleEmailChange(event.target.value)}
                                id="exampleInputEmail1" aria-describedby="emailHelp"
                                placeholder="Enter email" />
                        </div>
                    </div>

                    <div className="form-group row">
                        <label htmlFor="name1" className="col-sm-3 col-form-label">First name *</label>
                        <div className="col-sm-9">
                            <input type="email" className="form-control" id="name1"
                                value={this.state.firstName}
                                onChange={() => this.handleFirstNameChange(event.target.value)}
                                aria-describedby="nameHelp" placeholder="Enter first name" />
                        </div>
                    </div>

                    <div className="form-group row">
                        <label htmlFor="name2" className="col-sm-3 col-form-label">Second name *</label>
                        <div className="col-sm-9">
                            <input type="text" className="form-control"
                                value={this.state.secondName}
                                onChange={() => this.handleSecondNameChange(event.target.value)}
                                id="name2" aria-describedby="nameHelp"
                                placeholder="Enter second name" />
                        </div>

                    </div>

                    <div className="form-group row">
                        <label htmlFor="phoneNumber" className="col-sm-3 col-form-label">Phone no: *</label>
                        <div className="col-sm-9">
                            <input type="text" className="form-control" id="phoneNumber"
                                value={this.state.phoneNumber}
                                onChange={() => this.handlePhoneChange(event.target.value)}
                                aria-describedby="phoneNumberHelp" placeholder="Enter phone no." />
                        </div>
                    </div>

                    <div className="form-group row">
                        <label htmlFor="exampleInputPassword1" className="col-sm-3 col-form-label">Password</label>
                        <div className="col-sm-9">
                            <input type="password" className="form-control"
                                value={this.state.password}
                                onChange={() => this.handlePasswordChange(event.target.value, 1)}
                                id="exampleInputPassword1" placeholder="Password" />
                            <small style={{ "color": "red" }} className="form-text">Leave blank to retain previous password.</small>
                        </div>
                    </div>

                    <div className="form-group row">
                        <label htmlFor="exampleInputPassword2" className="col-sm-3 col-form-label">Confirm password</label>
                        <div className="col-sm-9">
                            <input type="password" className="form-control"
                                value={this.state.passwordConfirm}
                                onChange={() => this.handlePasswordChange(event.target.value, 2)}
                                id="exampleInputPassword2" placeholder="Confirm password" />
                            <small style={{ "color": "red" }} className="form-text">Leave blank to retain previous password.</small>
                        </div>

                    </div>

                    <button onClick={() => this.updatePersonel()} type="submit" className="btn btn-primary">Update</button>
                </div>

                < div className="modal fade" id="editPersonelModal" tabIndex="-1" role="dialog" aria-labelledby="editPersonelModalTitle" aria-hidden="true" >
                    <div className="modal-dialog modal-dialog-centered" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="editPersonelModalTitle">Notice!</h5>
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

export default Demographics;

if (document.getElementById('participant_demo')) {
    ReactDOM.render(<Demographics />, document.getElementById('participant_demo'));
}