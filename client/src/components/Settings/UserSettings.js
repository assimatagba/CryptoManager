import React, { Component } from 'react';

import {
    Panel,
    Form,
    FormGroup,
    FormControl,
    ControlLabel,
    HelpBlock,
    Notification,
    ButtonToolbar,
    Button,
    Schema,
} from 'rsuite';
import UserStore from '../../stores/UserStore';
import ActionTypes from '../../constants/ActionTypes';
import UserActions from '../../actions/UserActions';

const { StringType, NumberType } = Schema.Types;

const model = Schema.Model({
    username: StringType()
        .isRequired('This field is required.')
        .minLength(3, 'The username cannot be less than 3 characters'),
    email: StringType()
        .isEmail('Please enter a valid email address.')
        .isRequired('This field is required.'),
    password: StringType(),
    verifyPassword: StringType().addRule((value, data) => {
        if (value !== data.password) {
            return false;
        }
        return true;
    }, 'The two passwords do not match'),
});

class TextField extends React.PureComponent {
    render() {
        const { name, label, accepter, ...props } = this.props;
        return (
            <FormGroup>
                <ControlLabel>{label} </ControlLabel>
                <FormControl name={name} accepter={accepter} {...props} />
            </FormGroup>
        );
    }
}

class UserSettings extends Component {
    constructor(props) {
        super(props);
        this.state = {
            formValue: {
                username: '',
                email: '',
                password: '',
                verifyPassword: '',
            },
            formError: {},
            userProfile: {},
        };

        this.onUserProfile = this.onUserProfile.bind(this);
        this.onProfileUpdate = this.onProfileUpdate.bind(this);

        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        UserStore.listen(ActionTypes.GET_PROFILE, this.onUserProfile);
        UserStore.listen(ActionTypes.UPDATE_PROFILE, this.onProfileUpdate);
        UserActions.getProfile();
    }

    componentWillUnmount() {
        UserStore.unlisten(ActionTypes.GET_PROFILE, this.onUserProfile);
        UserStore.unlisten(ActionTypes.UPDATE_PROFILE, this.onProfileUpdate);
    }

    onUserProfile(data) {
        this.setState({ userProfile: data });

        this.setState({
            formValue: {
                username: data.username,
                email: data.email,
                password: '',
                verifyPassword: '',
            },
        });
    }

    onProfileUpdate(data) {
        this.setState({ userProfile: data });

        this.setState({
            formValue: {
                username: data.username,
                email: data.email,
                password: '',
                verifyPassword: '',
            },
        });

        Notification.success({
            title: 'User profile',
            duration: 5000,
            description: <p>Your profile has been updated !</p>,
        });
    }

    handleSubmit() {
        const { formValue } = this.state;
        if (!this.form.check()) {
            return;
        }

        var payload = {
            username: formValue.username,
            email: formValue.email,
        };

        if (formValue.password !== '') {
            payload.password = formValue.password;
        }

        UserActions.updateProfile(payload);
    }

    render() {
        const { formError, formValue } = this.state;

        return (
            <Panel header={<h3>USER SETTINGS</h3>}>
                <Form
                    ref={(ref) => (this.form = ref)}
                    layout="horizontal"
                    onChange={(formValue) => {
                        this.setState({ formValue });
                    }}
                    onCheck={(formError) => {
                        this.setState({ formError });
                    }}
                    formValue={formValue}
                    model={model}
                >
                    <TextField name="username" label="Username" />
                    <TextField name="email" label="Email" />
                    <TextField
                        name="password"
                        label="New password"
                        type="password"
                    />

                    <TextField
                        name="verifyPassword"
                        label="Verify password"
                        type="password"
                    />
                    <ButtonToolbar>
                        <Button
                            appearance="primary"
                            onClick={this.handleSubmit}
                        >
                            Update my profile
                        </Button>
                    </ButtonToolbar>
                </Form>
            </Panel>
        );
    }
}

export default UserSettings;
