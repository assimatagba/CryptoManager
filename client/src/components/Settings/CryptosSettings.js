import React, { Component } from 'react';

import {
    Icon,
    Panel,
    Table,
    Grid,
    Row,
    Col,
    FlexboxGrid,
    SelectPicker,
    Toggle,
    InputGroup,
    Input,
} from 'rsuite';
const { Column, HeaderCell, Cell } = Table;

import ActionTypes from '../../constants/ActionTypes';
import CryptosStore from '../../stores/CryptosStore';
import CryptosActions from '../../actions/CryptosActions';

class CryptosSettings extends Component {
    constructor(props) {
        super(props);
        this.state = {
            searchFilter: '',
            cryptos: [],
            availableCryptos: [],
            registeredCryptos: [],
            filteredCryptos: [],
        };

        this.onCryptoChange = this.onCryptoChange.bind(this);
        this.onAllAvailableCryptos = this.onAllAvailableCryptos.bind(this);
        this.onRegisteredCryptos = this.onRegisteredCryptos.bind(this);

        this.toggleCrypto = this.toggleCrypto.bind(this);
        this.enableCrypto = this.enableCrypto.bind(this);
        this.disableCrypto = this.disableCrypto.bind(this);
        this.onSearch = this.onSearch.bind(this);
    }

    componentDidMount() {
        CryptosStore.listen(
            ActionTypes.GET_ALL_AVAILABLE_CRYPTOS,
            this.onAllAvailableCryptos
        );
        CryptosStore.listen(
            ActionTypes.GET_REGISTERED_CRYPTOS,
            this.onRegisteredCryptos
        );
        CryptosStore.listen(ActionTypes.ENABLE_CRYPTO, this.onCryptoChange);
        CryptosStore.listen(ActionTypes.DISABLE_CRYPTO, this.onCryptoChange);

        CryptosActions.getAllAvailableCryptos();
    }

    componentWillUnmount() {
        CryptosStore.unlisten(
            ActionTypes.GET_ALL_AVAILABLE_CRYPTOS,
            this.onAllAvailableCryptos
        );

        CryptosStore.unlisten(
            ActionTypes.GET_REGISTERED_CRYPTOS,
            this.onAllAvailableCryptos
        );
        CryptosStore.unlisten(ActionTypes.ENABLE_CRYPTO, this.onCryptoChange);
        CryptosStore.unlisten(ActionTypes.DISABLE_CRYPTO, this.onCryptoChange);
    }

    onCryptoChange() {
        CryptosActions.getAllAvailableCryptos();
    }

    onAllAvailableCryptos(data) {
        var CryptosWithoutToken = data.filter(
            (crypto) => !crypto.name.toLowerCase().includes('token')
        );

        this.setState({ availableCryptos: CryptosWithoutToken }, () => {
            CryptosActions.getRegisteredCryptos();
        });
    }

    onRegisteredCryptos(data) {
        var registeredCryptos = data;
        var availableCryptos = this.state.availableCryptos;

        availableCryptos.forEach((crypto) => {
            crypto.active = registeredCryptos.find(
                (enabledCrypto) => enabledCrypto.code === crypto.id
            )
                ? true
                : false;
        });

        var filteredCryptos = availableCryptos.filter((crypto) =>
            crypto.name
                .toLowerCase()
                .includes(this.state.searchFilter.toLowerCase())
        );

        filteredCryptos.sort((a, b) => b.active - a.active);

        this.setState({
            registeredCryptos,
            cryptos: availableCryptos,
            filteredCryptos: filteredCryptos,
        });
    }

    toggleCrypto(crypto) {
        if (crypto.active) {
            this.disableCrypto(crypto);
        } else {
            this.enableCrypto(crypto);
        }
    }

    enableCrypto(crypto) {
        var payload = {
            code: crypto.id,
            name: crypto.name,
        };

        CryptosActions.enableCrypto(payload);
    }

    disableCrypto(crypto) {
        CryptosActions.disableCrypto(crypto.id);
    }

    onSearch(value) {
        var filteredCryptos = this.state.cryptos.filter((crypto) =>
            crypto.name.toLowerCase().includes(value.toLowerCase())
        );

        filteredCryptos.sort((a, b) => b.active - a.active);

        this.setState({ filteredCryptos, searchFilter: value });
    }

    render() {
        return (
            <Panel
                bodyFill
                header={
                    <Grid fluid>
                        <Row>
                            <Col xs={8}>
                                <h3>CRYPTOS</h3>
                            </Col>
                            <Col xs={16}>
                                <FlexboxGrid
                                    justify="end"
                                    style={{ paddingTop: '5px' }}
                                >
                                    <InputGroup
                                        size="sm"
                                        style={{
                                            minWidth: '260px',
                                        }}
                                    >
                                        <Input
                                            placeholder="Search by name"
                                            value={this.state.searchFilter}
                                            onChange={this.onSearch}
                                        />
                                        <InputGroup.Addon>
                                            <Icon icon="search" />
                                        </InputGroup.Addon>
                                    </InputGroup>
                                </FlexboxGrid>
                            </Col>
                        </Row>
                    </Grid>
                }
            >
                <Table
                    virtualized
                    height={400}
                    data={this.state.filteredCryptos}
                >
                    <Column>
                        <HeaderCell>Symbol</HeaderCell>
                        <Cell dataKey="symbol" />
                    </Column>
                    <Column flexGrow={1}>
                        <HeaderCell>Name</HeaderCell>
                        <Cell dataKey="name" />
                    </Column>
                    <Column width={100}>
                        <HeaderCell>Active</HeaderCell>
                        <Cell>
                            {(rowData) => (
                                <Toggle
                                    checked={rowData.active}
                                    checkedChildren={<Icon icon="check" />}
                                    unCheckedChildren={<Icon icon="close" />}
                                    onChange={() => this.toggleCrypto(rowData)}
                                />
                            )}
                        </Cell>
                    </Column>
                </Table>
            </Panel>
        );
    }
}

export default CryptosSettings;
