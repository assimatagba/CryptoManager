import React, { Component } from 'react';

import { Content, Grid, Row, Col } from 'rsuite';
import withSidebar from './sidebar/WithSidebar';
import UserSettings from './Settings/UserSettings';
import CryptosSettings from './Settings/CryptosSettings';
import UserStore from '../stores/UserStore';

class Settings extends Component {
    constructor(props) {
        super(props);

        this.state = {
            user: UserStore.getUserData(),
        };
    }

    render() {
        const { user } = this.state;

        return (
            <Content className="rs-content" style={{ overflowY: 'scroll' }}>
                <Grid fluid>
                    <Row gutter={16}>
                        <Col mdOffset={6} md={12}>
                            <UserSettings />
                        </Col>
                    </Row>
                    {user && user.isAdmin && (
                        <Row gutter={16} className="mt-3">
                            <Col mdOffset={6} md={12}>
                                <CryptosSettings />
                            </Col>
                        </Row>
                    )}
                </Grid>
            </Content>
        );
    }
}

export default withSidebar(Settings);
