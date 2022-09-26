import React from 'react';
import ReactDOM from 'react-dom';
import UserForm from './UserForm';


class EditUser extends React.Component {

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

export default EditUser;

if (document.getElementById('edit_admin_user')) {
    ReactDOM.render(<EditUser />, document.getElementById('edit_admin_user'));
}