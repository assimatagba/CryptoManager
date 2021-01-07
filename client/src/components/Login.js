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
} from 'rsuite';

import oAuth from '../oAuth';
import UserStore from '../stores/UserStore';
import UserActions from '../actions/UserActions';
import ActionTypes from '../constants/ActionTypes';

const { StringType } = Schema.Types;

const model = Schema.Model({
    email: StringType().isRequired('This field is required.'),
    password: StringType().isRequired('This field is required.'),
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

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            formValue: {
                email: '',
                password: '',
            },
            formError: {},
            loggedIn: false,
            loading: false,
        };

        this.loginHandler = this.loginHandler.bind(this);
        this.onUserData = this.onUserData.bind(this);
        this.recoverSession = this.recoverSession.bind(this);
        this.recoverUserData = this.recoverUserData.bind(this);
    }

    componentDidMount() {
        UserStore.listen(ActionTypes.GET_USER_DATA, this.onUserData);

        this.recoverUserData();
        this.recoverSession();
    }

    componentWillUnmount() {
        UserStore.unlisten(ActionTypes.GET_USER_DATA, this.onUserData);
    }

    recoverSession() {
        const loggedIn = oAuth.isLogged();

        if (loggedIn) {
            UserActions.getUserData();
            UserActions.getProfile();
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

    loginHandler() {
        const { formValue } = this.state;
        if (!this.form.check()) {
            return;
        } else {
            this.setState({ loading: true });
            this.forceUpdate();
            oAuth.login(formValue.email, formValue.password).then((result) => {
                if (result != null) {
                    UserActions.getUserData();
                    UserActions.getProfile();
                } else {
                    Alert.error('Invalid email or password.');
                    this.setState({
                        loggedIn: false,
                        loginError: true,
                        loading: false,
                    });
                }
            });
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
                            <Panel header={<h3>Login</h3>} bordered>
                                <Form
                                    fluid
                                    ref={(ref) => (this.form = ref)}
                                    onChange={(formValue) => {
                                        this.setState({ formValue });
                                    }}
                                    onSubmit={this.loginHandler}
                                    formValue={formValue}
                                    model={model}
                                >
                                    <TextField name="email" label="Email" />
                                    <TextField
                                        name="password"
                                        label="Password"
                                        type="password"
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
                                                onClick={this.loginHandler}
                                                loading={
                                                    this.state.loading
                                                        ? true
                                                        : false
                                                }
                                            >
                                                Sign in
                                            </Button>
                                        </ButtonToolbar>
                                    </FormGroup>
                                </Form>
                            </Panel>
                            <Button
                                appearance="link"
                                onClick={() =>
                                    this.props.history.push('register')
                                }
                            >
                                Register
                            </Button>
                        </FlexboxGrid.Item>
                    </FlexboxGrid>
                </Content>
            </Container>
        );
    }
}

export default Login;
