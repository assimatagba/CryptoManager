import React, { Component } from 'react';
import CryptosStore from '../../stores/CryptosStore';
import ActionTypes from '../../constants/ActionTypes';
import CryptosActions from '../../actions/CryptosActions';
import currencyFormatter from 'currency-formatter';

import {
    Icon,
    Panel,
    Table,
    Grid,
    Row,
    Col,
    FlexboxGrid,
    SelectPicker,
} from 'rsuite';
const { Column, HeaderCell, Cell } = Table;

const currencies = [
    {
        label: 'USD',
        value: 'usd',
    },
    {
        label: 'EUR',
        value: 'eur',
    },
    {
        label: 'JPY',
        value: 'jpy',
    },
    {
        label: 'GBP',
        value: 'gbp',
    },
    {
        label: 'AUD',
        value: 'aud',
    },
    {
        label: 'CAD',
        value: 'cad',
    },
    {
        label: 'CHF',
        value: 'chf',
    },
    {
        label: 'CNY',
        value: 'cny',
    },
    {
        label: 'HKD',
        value: 'hkd',
    },
    {
        label: 'NZD',
        value: 'nzd',
    },
];

class CryptosCard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currency: CryptosStore.getCurrency(),
            cryptos: [],
        };

        this.onRegisteredCryptosData = this.onRegisteredCryptosData.bind(this);
        this.onCryptoByCodeData = this.onCryptoByCodeData.bind(this);
        this.onCryptoCurrencyData = this.onCryptoCurrencyData.bind(this);

        this.onCurrencyChange = this.onCurrencyChange.bind(this);
        this.onCryptoClick = this.onCryptoClick.bind(this);
    }

    componentDidMount() {
        CryptosStore.listen(
            ActionTypes.GET_REGISTERED_CRYPTOS,
            this.onRegisteredCryptosData
        );
        CryptosStore.listen(
            ActionTypes.GET_CRYPTO_BY_CODE,
            this.onCryptoByCodeData
        );
        CryptosStore.listen(
            ActionTypes.UPDATE_CURRENCY,
            this.onCryptoCurrencyData
        );

        CryptosActions.getRegisteredCryptos();
        this.timeout = setInterval(
            () => CryptosActions.getRegisteredCryptos(),
            30000
        );
    }

    componentWillUnmount() {
        CryptosStore.unlisten(
            ActionTypes.GET_REGISTERED_CRYPTOS,
            this.onRegisteredCryptosData
        );
        CryptosStore.unlisten(
            ActionTypes.GET_CRYPTO_BY_CODE,
            this.onCryptoByCodeData
        );
        CryptosStore.unlisten(
            ActionTypes.UPDATE_CURRENCY,
            this.onCryptoCurrencyData
        );

        clearInterval(this.timeout);
    }

    onRegisteredCryptosData(data) {
        data.forEach((crypto) => {
            CryptosActions.getCryptoByCode(
                crypto.code,
                crypto.name,
                this.state.currency
            );
        });
    }

    onCryptoByCodeData(code, name, data) {
        let cryptoData = {
            code: code,
            name: name,
            description: data.description,
            imageUrl: data.imageUrl,
            marketData: data.marketData,
            marketRank: data.marketRank,
        };

        let cryptos = [...this.state.cryptos];
        let cryptoIndex = cryptos.findIndex((crypto) => crypto.code === code);

        if (cryptoIndex < 0) {
            cryptos.push(cryptoData);
        } else {
            cryptos[cryptoIndex] = cryptoData;
        }

        cryptos = cryptos.sort((a, b) => a.marketRank - b.marketRank);

        this.setState({ cryptos });
    }

    onCryptoCurrencyData(data) {
        this.setState({ currency: data });
        CryptosActions.getRegisteredCryptos();
    }

    marketTrend(marketData) {
        let percentage = marketData.price_change_percentage_24h;

        if (!percentage) {
            return <span>0.0 %</span>;
        }

        if (percentage < 0.0) {
            return (
                <span className="text-red">
                    <Icon icon="angle-double-down" /> {percentage.toFixed(1)}
                    {'% '}
                </span>
            );
        } else if (percentage >= 0.0) {
            return (
                <span className="text-green">
                    <Icon icon="angle-double-up" /> {percentage.toFixed(1)}
                    {'% '}
                </span>
            );
        }
    }

    onCurrencyChange(value) {
        this.setState({ currency: value });
        CryptosActions.updateCurrency(value);
    }

    onCryptoClick(data) {
        let crypto = {
            code: data.code,
            name: data.name,
        };

        CryptosActions.updateSelectedCrypto(crypto);
    }

    render() {
        const currency = this.state.currency.toUpperCase();

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
                                    <SelectPicker
                                        data={currencies}
                                        appearance="subtle"
                                        size="sm"
                                        cleanable={false}
                                        searchable={false}
                                        value={this.state.currency}
                                        style={{
                                            minWidth: '80px',
                                        }}
                                        onChange={this.onCurrencyChange}
                                    />
                                </FlexboxGrid>
                            </Col>
                        </Row>
                    </Grid>
                }
            >
                <Table
                    virtualized
                    height={400}
                    data={this.state.cryptos}
                    shouldUpdateScroll={false}
                    onRowClick={this.onCryptoClick}
                >
                    <Column minWidth={150} flexGrow={1} fixed>
                        <HeaderCell>Asset</HeaderCell>
                        <Cell dataKey="code">
                            {(rowData) => (
                                <>
                                    <img src={rowData.imageUrl} width="25" />
                                    <span className="pl-2">{rowData.name}</span>
                                </>
                            )}
                        </Cell>
                    </Column>
                    <Column width={120} align="center">
                        <HeaderCell>Lowest price</HeaderCell>
                        <Cell>
                            {(rowData) =>
                                currencyFormatter.format(
                                    rowData.marketData.low,
                                    {
                                        code: currency,
                                        precision:
                                            rowData.marketData.low < 5 ? 6 : 2,
                                    }
                                )
                            }
                        </Cell>
                    </Column>
                    <Column width={120} align="center">
                        <HeaderCell>Highest price</HeaderCell>
                        <Cell>
                            {(rowData) => (
                                <>
                                    {currencyFormatter.format(
                                        rowData.marketData.high,
                                        {
                                            code: currency,
                                            precision:
                                                rowData.marketData.high < 5
                                                    ? 6
                                                    : 2,
                                        }
                                    )}
                                </>
                            )}
                        </Cell>
                    </Column>
                    <Column width={120} align="center">
                        <HeaderCell>Current price</HeaderCell>
                        <Cell>
                            {(rowData) =>
                                currencyFormatter.format(
                                    rowData.marketData.current,
                                    {
                                        code: currency,
                                        precision:
                                            rowData.marketData.current < 5
                                                ? 6
                                                : 2,
                                    }
                                )
                            }
                        </Cell>
                    </Column>
                    <Column width={120} align="center">
                        <HeaderCell>% 24h</HeaderCell>
                        <Cell>
                            {(rowData) => this.marketTrend(rowData.marketData)}
                        </Cell>
                    </Column>
                </Table>
            </Panel>
        );
    }
}

export default CryptosCard;
