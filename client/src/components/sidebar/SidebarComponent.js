import React, { useState } from 'react';
import { Sidebar, Icon, Sidenav, Navbar, Nav, DOMHelper } from 'rsuite';
import oAuth from '../../oAuth';

const { getHeight } = DOMHelper;

const NavToggle = ({ expand, onChange }) => (
    <Navbar appearance="subtle" className="nav-toggle">
        <Navbar.Body>
            <Nav pullRight>
                <Nav.Item
                    onClick={onChange}
                    style={{ width: 56, textAlign: 'center' }}
                >
                    <Icon icon={expand ? 'angle-left' : 'angle-right'} />
                </Nav.Item>
            </Nav>
        </Navbar.Body>
    </Navbar>
);

const SidebarComponent = ({ history }) => {
    const [expand, setExpand] = useState(false);

    return (
        <div>
            <Sidebar width={expand ? 260 : 56} collapsible>
                <Sidenav
                    expanded={expand}
                    defaultOpenKeys={['1']}
                    activeKey={['1']}
                    appearance="subtle"
                >
                    <Sidenav.Body
                        style={{
                            overflow: 'auto',
                        }}
                    >
                        <Nav>
                            <Nav.Item
                                eventKey="1"
                                active
                                icon={<Icon icon="dashboard" />}
                                onClick={() => {
                                    history.push('/dashboard');
                                }}
                            >
                                Dashboard
                            </Nav.Item>
                            {oAuth.isLogged() && (
                                <>
                                    <Nav.Item
                                        eventKey="2"
                                        icon={<Icon icon="cogs" />}
                                        onClick={() => {
                                            history.push('/settings');
                                        }}
                                    >
                                        Settings
                                    </Nav.Item>
                                    <Nav.Item
                                        eventKey="3"
                                        icon={<Icon icon="sign-out" />}
                                        onClick={() => {
                                            localStorage.clear();
                                            history.push('/');
                                        }}
                                    >
                                        Logout
                                    </Nav.Item>
                                </>
                            )}
                        </Nav>
                    </Sidenav.Body>
                </Sidenav>
                <NavToggle
                    expand={expand}
                    onChange={() => setExpand(!expand)}
                />
            </Sidebar>
        </div>
    );
};

export default SidebarComponent;
