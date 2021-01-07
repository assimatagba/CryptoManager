/* eslint-disable prettier/prettier */
/* eslint-disable indent */
import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import oAuth from '../oAuth';

// eslint-disable-next-line react/prop-types
const ProtectedRoute = ({ component: Comp, ...rest }) => (
    <Route
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...rest}
        render={(props) => (oAuth.isLogged() ? (
            // eslint-disable-next-line react/jsx-props-no-spreading
            <Comp {...props} />
            ) : (
                <Redirect
                    to={{
                        pathname: '/',
                        // eslint-disable-next-line react/prop-types
                        state: { from: props.location },
                    }}
                />
            ))
        }
    />
);

export default ProtectedRoute;
