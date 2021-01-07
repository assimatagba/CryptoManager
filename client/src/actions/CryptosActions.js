import ActionTypes from '../constants/ActionTypes';
import AppDispatcher from '../dispatcher/AppDispatcher';

const CryptosActions = {
    getAllAvailableCryptos() {
        global.api.get('cryptos/all/codes', {}).then(
            (response) => {
                AppDispatcher.dispatch({
                    type: ActionTypes.GET_ALL_AVAILABLE_CRYPTOS,
                    data: response.data,
                });
            },
            (error) => {
                console.log(error);
            }
        );
    },

    enableCrypto(crypto) {
        global.api.post('cryptos', crypto).then(
            (response) => {
                AppDispatcher.dispatch({
                    type: ActionTypes.ENABLE_CRYPTO,
                    data: response.data,
                });
            },
            (error) => {
                console.log(error);
            }
        );
    },

    disableCrypto(crypto) {
        global.api.delete(`cryptos/${crypto}`, {}).then(
            (response) => {
                AppDispatcher.dispatch({
                    type: ActionTypes.DISABLE_CRYPTO,
                    data: response.data,
                });
            },
            (error) => {
                console.log(error);
            }
        );
    },

    getRegisteredCryptos() {
        global.api.get('cryptos/all/registered', {}).then(
            (response) => {
                AppDispatcher.dispatch({
                    type: ActionTypes.GET_REGISTERED_CRYPTOS,
                    data: response.data,
                });
            },
            (error) => {
                console.log(error);
            }
        );
    },

    getCryptoByCode(code, name, currency = 'eur') {
        global.api.get('cryptos/' + code, { params: { cur: currency } }).then(
            (response) => {
                AppDispatcher.dispatch({
                    type: ActionTypes.GET_CRYPTO_BY_CODE,
                    code: code,
                    name: name,
                    data: response.data.data,
                });
            },
            (error) => {
                console.log(error);
            }
        );
    },

    getCryptoHistoryByCode(code, name, type, currency = 'eur') {
        global.api
            .get('cryptos/' + code + '/history/' + type, {
                params: { cur: currency },
            })
            .then(
                (response) => {
                    AppDispatcher.dispatch({
                        type: ActionTypes.GET_CRYPTO_HISTORY_BY_CODE,
                        code: code,
                        name: name,
                        data: response.data,
                    });
                },
                (error) => {
                    console.log(error);
                }
            );
    },

    updateCurrency(currency) {
        AppDispatcher.dispatch({
            type: ActionTypes.UPDATE_CURRENCY,
            data: currency,
        });
    },

    updateSelectedCrypto(crypto) {
        AppDispatcher.dispatch({
            type: ActionTypes.UPDATE_SELECTED_CRYPTO,
            data: crypto,
        });
    },
};

export default CryptosActions;
