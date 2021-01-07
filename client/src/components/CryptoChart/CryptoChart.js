import React, { Component } from 'react';
import CryptosStore from '../../stores/CryptosStore';
import ActionTypes from '../../constants/ActionTypes';
import CryptosActions from '../../actions/CryptosActions';
import currencyFormatter from 'currency-formatter';

import {
    Grid,
    Col,
    Row,
    FlexboxGrid,
    Panel,
    ButtonGroup,
    Button,
    ButtonToolbar,
} from 'rsuite';

import Chart from 'react-apexcharts';

class CryptoChart extends Component {
    constructor(props) {
        super(props);
        this.state = {
            type: 'minute',
            currency: CryptosStore.getCurrency(),
            crypto: CryptosStore.getSelectedCrypto(),
            series: [],
            options: {
                chart: {
                    type: 'area',
                    zoom: {
                        autoScaleYaxis: true,
                    },
                    foreColor: '#676383',
                    toolbar: {
                        show: false,
                    },
                },
                dataLabels: {
                    enabled: false,
                },
                markers: {
                    size: 0,
                    style: 'hollow',
                },
                xaxis: {
                    type: 'datetime',
                    labels: {
                        datetimeUTC: false,
                        format: 'dd MMM yyyy HH:mm',
                    },
                },
                tooltip: {
                    theme: 'dark',
                    x: {
                        format: 'dd MMM yyyy HH:mm',
                    },
                },
                colors: ['#4274f8'],
                fill: {
                    type: 'gradient',
                    gradient: {
                        shade: 'dark',
                        shadeIntensity: 0,
                        opacityFrom: 0.6,
                        opacityTo: 0.3,
                        stops: [0, 100],
                    },
                },
                grid: {
                    show: true,
                    borderColor: '#676383',
                    strokeDashArray: 4,
                    position: 'back',
                },
                yaxis: {
                    opposite: true,
                    labels: {
                        show: true,
                        align: 'right',
                        formatter: (val) => {
                            return currencyFormatter.format(val, {
                                code: this.state.currency.toUpperCase(),
                                precision: val < 5 ? 6 : 2,
                            });
                        },
                    },
                },
                stroke: {
                    curve: 'smooth',
                    width: 1,
                },
            },
        };

        this.onCryptoChartData = this.onCryptoChartData.bind(this);
        this.onCryptoCurrencyData = this.onCryptoCurrencyData.bind(this);
        this.onCryptoUpdateData = this.onCryptoUpdateData.bind(this);

        this.onChartTypeChange = this.onChartTypeChange.bind(this);
        this.getChartData = this.getChartData.bind(this);
    }

    componentDidMount() {
        CryptosStore.listen(
            ActionTypes.GET_CRYPTO_HISTORY_BY_CODE,
            this.onCryptoChartData
        );
        CryptosStore.listen(
            ActionTypes.UPDATE_CURRENCY,
            this.onCryptoCurrencyData
        );
        CryptosStore.listen(
            ActionTypes.UPDATE_SELECTED_CRYPTO,
            this.onCryptoUpdateData
        );

        this.getChartData();
    }

    componentWillUnmount() {
        CryptosStore.unlisten(
            ActionTypes.GET_CRYPTO_HISTORY_BY_CODE,
            this.onCryptoChartData
        );
        CryptosStore.unlisten(
            ActionTypes.UPDATE_CURRENCY,
            this.onCryptoCurrencyData
        );
        CryptosStore.unlisten(
            ActionTypes.UPDATE_SELECTED_CRYPTO,
            this.onCryptoUpdateData
        );
    }

    getChartData() {
        CryptosActions.getCryptoHistoryByCode(
            this.state.crypto.code,
            this.state.crypto.name,
            this.state.type,
            this.state.currency
        );
    }

    onCryptoCurrencyData(data) {
        this.setState({ currency: data }, () => {
            this.getChartData();
        });
    }

    onCryptoChartData(code, name, data) {
        var prices = data.prices;

        prices.forEach((price) => {
            price[0] = price[0] * 1000; // we convert unix timestamp to JS timestamp
        });

        this.setState({
            series: [{ name: 'Price', data: prices }],
        });
    }

    onCryptoUpdateData(crypto) {
        this.setState({ crypto: crypto }, () => {
            this.getChartData();
        });
    }

    onChartTypeChange(type) {
        this.setState({ type: type }, () => {
            this.getChartData();
        });
    }

    render() {
        const { crypto, type } = this.state;

        return (
            <Panel
                bodyFill
                header={
                    <Grid fluid>
                        <Row>
                            <Col xs={8}>
                                <h3>{crypto.name}</h3>
                            </Col>
                            <Col xs={16}>
                                <FlexboxGrid
                                    justify="end"
                                    style={{ paddingTop: '5px' }}
                                >
                                    <ButtonToolbar>
                                        <ButtonGroup size="sm">
                                            <Button
                                                onClick={() =>
                                                    this.onChartTypeChange(
                                                        'minute'
                                                    )
                                                }
                                                active={
                                                    type === 'minute'
                                                        ? true
                                                        : false
                                                }
                                            >
                                                2h
                                            </Button>
                                            <Button
                                                onClick={() =>
                                                    this.onChartTypeChange(
                                                        'hourly'
                                                    )
                                                }
                                                active={
                                                    type === 'hourly'
                                                        ? true
                                                        : false
                                                }
                                            >
                                                48h
                                            </Button>
                                            <Button
                                                onClick={() =>
                                                    this.onChartTypeChange(
                                                        'daily'
                                                    )
                                                }
                                                active={
                                                    type === 'daily'
                                                        ? true
                                                        : false
                                                }
                                            >
                                                60d
                                            </Button>
                                            <Button
                                                onClick={() =>
                                                    this.onChartTypeChange(
                                                        'weekly'
                                                    )
                                                }
                                                active={
                                                    type === 'weekly'
                                                        ? true
                                                        : false
                                                }
                                            >
                                                60w
                                            </Button>
                                        </ButtonGroup>
                                    </ButtonToolbar>
                                </FlexboxGrid>
                            </Col>
                        </Row>
                    </Grid>
                }
            >
                <div id="chart-timeline">
                    <Chart
                        options={this.state.options}
                        series={this.state.series}
                        type="area"
                        height={385}
                    />
                </div>
            </Panel>
        );
    }
}

export default CryptoChart;
