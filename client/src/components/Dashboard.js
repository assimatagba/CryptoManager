import React, { Component } from 'react';

import { Content, Grid, Row, Col } from 'rsuite';
import withSidebar from './sidebar/WithSidebar';
import CryptosCard from './CryptosCard/CryptosCard';
import CryptoChart from './CryptoChart/CryptoChart';
import ArticlesPanel from './Article/ArticlesPanel';

class Dashboard extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Content className="rs-content" style={{ overflowY: 'scroll' }}>
                <Grid fluid>
                    <Row gutter={16}>
                        <Col xs={24} md={12} lg={12} className="mb-3">
                            <CryptosCard />
                        </Col>
                        <Col xs={24} md={12} lg={12} className="mb-3">
                            <CryptoChart />
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col xs={24} md={12} lg={12} className="mb-3">
                            <ArticlesPanel />
                        </Col>
                    </Row>
                </Grid>
            </Content>
        );
    }
}

export default withSidebar(Dashboard);
