import React from 'react';
import ReactDOM from 'react-dom';
import UserForm from './UserForm';


class AddUser extends React.Component {

    constructor(props) {
        super(props);
        this.state = {

        }

    }

    componentDidMount() {

    }

    render() {

        return (
            <UserForm />
        );
    }

}

export default AddUser;

if (document.getElementById('add_admin_user')) {
    ReactDOM.render(<AddUser />, document.getElementById('add_admin_user'));
}