import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';

import {
    Container,
    Content,
    Panel,
    FlexboxGrid,
    Form,
    FormGroup,
    ControlLabel,
    FormControl,
    ButtonToolbar,
    Button,
    Col,
    Alert,
    Schema,
    Message,
} from 'rsuite';

import oAuth from '../oAuth';
import UserStore from '../stores/UserStore';
import UserActions from '../actions/UserActions';
import ActionTypes from '../constants/ActionTypes';

const { StringType } = Schema.Types;

const model = Schema.Model({
    username: StringType()
        .isRequired('This field is required.')
        .minLength(3, 'The username cannot be less than 3 characters'),
    password: StringType()
        .isRequired('This field required')
        .minLength(6, 'The password cannot be less than 6 characters')
        .maxLength(30, 'The password cannot be greater than 30 characters'),
    passwordConfirm: StringType().addRule((value, data) => {
        if (value !== data.password) {
            return false;
        }
        return true;
    }, "The password doesn't match"),
    email: StringType().isEmail('Please enter a valid email'),
});

class TextField extends React.PureComponent {
    render() {
        const { name, label, accepter, ...props } = this.props;
        return (
            <FormGroup>
                <ControlLabel>{label}</ControlLabel>
                <FormControl name={name} accepter={accepter} {...props} />
            </FormGroup>
        );
    }
}

class Register extends Component {
    constructor(props) {
        super(props);
        this.state = {
            formValue: {
                username: '',
                password: '',
                passwordConfirm: '',
                email: '',
            },
            formError: {},
            loggedIn: false,
            loading: false,
            errorMessage: '',
            successMessage: '',
        };

        this.registerHandler = this.registerHandler.bind(this);
        this.onUserData = this.onUserData.bind(this);
        this.recoverSession = this.recoverSession.bind(this);
        this.recoverUserData = this.recoverUserData.bind(this);
        this.onRegisterData = this.onRegisterData.bind(this);
        this.onRegisterErrorData = this.onRegisterErrorData.bind(this);
    }

    componentDidMount() {
        UserStore.listen(ActionTypes.GET_USER_DATA, this.onUserData);
        UserStore.listen(ActionTypes.REGISTER_USER, this.onRegisterData);
        UserStore.listen(
            ActionTypes.REGISTER_USER_ERROR,
            this.onRegisterErrorData
        );

        this.recoverUserData();
        this.recoverSession();
    }

    componentWillUnmount() {
        UserStore.unlisten(ActionTypes.GET_USER_DATA, this.onUserData);
        UserStore.unlisten(ActionTypes.REGISTER_USER, this.onRegisterData);
        UserStore.unlisten(
            ActionTypes.REGISTER_USER_ERROR,
            this.onRegisterErrorData
        );
    }

    recoverSession() {
        const loggedIn = oAuth.isLogged();

        if (loggedIn) {
            UserActions.getUserData();
        }

        this.setState({ loggedIn });
    }

    recoverUserData() {
        var userData = JSON.parse(localStorage.getItem('userData'));

        if (userData) {
            this.setState({ userData });
        }
    }

    onUserData() {
        let data = UserStore.getUserData();

        this.setState(
            {
                userData: data,
                loggedIn: true,
            },
            () => Alert.success('Welcome ' + this.state.userData.username)
        );
    }

    onRegisterData(data) {
        this.setState({
            loading: false,
            successMessage:
                'You have been registered successfully, you can now login with your credentials.',
        });
    }

    onRegisterErrorData(data) {
        var errorMessage = 'An error occured. The email is already used.';

        this.setState({
            loading: false,
            errorMessage: errorMessage,
        });
    }

    registerHandler() {
        const { formValue } = this.state;
        if (!this.form.check()) {
            return;
        } else {
            this.setState({ loading: true });
            this.forceUpdate();

            var userData = {
                username: formValue.username,
                password: formValue.password,
                email: formValue.email,
            };

            UserActions.registerUser(userData);
        }
    }

    render() {
        const { formValue } = this.state;

        if (this.state.loggedIn) {
            return <Redirect to="/dashboard" />;
        }

        return (
            <Container>
                <Content>
                    <FlexboxGrid
                        justify="center"
                        align="middle"
                        style={{ height: '100vh' }}
                    >
                        <FlexboxGrid.Item
                            componentClass={Col}
                            colspan={24}
                            xs={24}
                            sm={16}
                            md={12}
                            lg={8}
                        >
                            {this.state.errorMessage !== '' && (
                                <Message
                                    closable
                                    type="error"
                                    description={this.state.errorMessage}
                                    className="mb-3"
                                />
                            )}
                            {this.state.successMessage !== '' && (
                                <Message
                                    closable
                                    type="success"
                                    description={this.state.successMessage}
                                    className="mb-3"
                                />
                            )}
                            <Panel header={<h3>Register</h3>} bordered>
                                <Form
                                    fluid
                                    ref={(ref) => (this.form = ref)}
                                    onChange={(formValue) => {
                                        this.setState({ formValue });
                                    }}
                                    onSubmit={this.registerHandler}
                                    formValue={formValue}
                                    model={model}
                                >
                                    <TextField
                                        name="username"
                                        label="Username"
                                    />
                                    <TextField
                                        name="password"
                                        label="Password"
                                        type="password"
                                    />
                                    <TextField
                                        name="passwordConfirm"
                                        label="Password confirmation"
                                        type="password"
                                    />
                                    <TextField
                                        name="email"
                                        label="Email"
                                        type="text"
                                    />
                                    <FormGroup>
                                        <ButtonToolbar
                                            className="d-flex"
                                            style={{
                                                justifyContent: 'flex-end',
                                                display: 'flex',
                                            }}
                                        >
                                            <Button
                                                appearance="primary"
                                                onClick={this.registerHandler}
                                                loading={
                                                    this.state.loading
                                                        ? true
                                                        : false
                                                }
                                            >
                                                Register
                                            </Button>
                                        </ButtonToolbar>
                                    </FormGroup>
                                </Form>
                            </Panel>
                            <Button
                                appearance="link"
                                onClick={() => this.props.history.push('/')}
                            >
                                Login
                            </Button>
                        </FlexboxGrid.Item>
                    </FlexboxGrid>
                </Content>
            </Container>
        );
    }
}

export default Register;
