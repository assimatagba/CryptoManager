import React, { Component } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import oAuth from './oAuth';
import UserStore from './stores/UserStore';
import UserActions from './actions/UserActions';
import ActionTypes from './constants/ActionTypes';
import { Routes, ProtectedRoute } from './routes';

class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: true,
        };

        this.onUserData = this.onUserData.bind(this);
        this.recoverSession = this.recoverSession.bind(this);
    }

    componentDidMount() {
        UserStore.listen(ActionTypes.GET_USER_DATA, this.onUserData);

        this.recoverSession();
    }

    componentWillUnmount() {
        UserStore.unlisten(ActionTypes.GET_USER_DATA, this.onUserData);
    }

    onUserData() {
        const data = UserStore.getUserData();

        localStorage.setItem('userData', JSON.stringify(data));
        this.setState({
            loading: false,
        });
    }

    recoverSession() {
        const loggedIn = oAuth.isLogged();

        if (loggedIn) {
            UserActions.getUserData();
        } else {
            this.setState({ loading: false });
        }
    }

    render() {
        return (
            <div className="App" style={{ height: '100vh' }}>
                {!this.state.loading && (
                    <Router>
                        <Switch>
                            {Routes.map((route, index) =>
                                !route.protected ? (
                                    <Route
                                        key={index}
                                        path={route.path}
                                        exact={route.exact}
                                        render={(props) => (
                                            <route.component {...props} />
                                        )}
                                    />
                                ) : (
                                    <ProtectedRoute
                                        key={index}
                                        path={route.path}
                                        exact={route.exact}
                                        component={route.component}
                                    />
                                )
                            )}
                        </Switch>
                    </Router>
                )}
            </div>
        );
    }
}
export default App;
