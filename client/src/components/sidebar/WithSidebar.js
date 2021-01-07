import React from 'react';

import { Container, Navbar, Nav, Icon } from 'rsuite';
import SidebarComponent from './SidebarComponent';

export default function withSidebar(WrappedComponent) {
    function WithSidebar(props) {
        return (
            <Container className="frame">
                <SidebarComponent {...props} />
                <Container>
                    <Navbar className="navbar-mobile">
                        <Navbar.Header>
                            <div className="header-brand">
                                {/* <img src={Logo} alt="" style={{ display: 'inline-block', height: '100%', width: '100%' }} /> */}
                            </div>
                        </Navbar.Header>
                        <Navbar.Body>
                            <Nav pullRight>
                                <Nav.Item
                                    eventKey="2"
                                    icon={<Icon icon="sign-out" />}
                                    onClick={() => {
                                        localStorage.clear();
                                        props.history.push('/');
                                    }}
                                >
                                    Logout
                                </Nav.Item>
                            </Nav>
                        </Navbar.Body>
                    </Navbar>
                    <WrappedComponent {...props} />
                </Container>
            </Container>
        );
    }

    const wrappedComponentName =
        WrappedComponent.displayName || WrappedComponent.name || 'Component';

    WithSidebar.displayName = `withSidebar(${wrappedComponentName})`;
    return WithSidebar;
}
