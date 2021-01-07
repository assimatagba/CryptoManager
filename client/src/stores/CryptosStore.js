/* eslint-disable indent */
import AppStore from './AppStore';
import ActionTypes from '../constants/ActionTypes';
import AppDispatcher from '../dispatcher/AppDispatcher';

class CryptosStore extends AppStore {
    constructor() {
        super();
        this.dispatchToken = AppDispatcher.register(
            this.dispatcherCallback.bind(this)
        );

        this.currency = 'usd';
        this.selectedCrypto = {
            code: 'bitcoin',
            name: 'Bitcoin',
        };
    }

    getCurrency() {
        return this.currency;
    }

    setCurrency(curr) {
        this.currency = curr;
    }

    getSelectedCrypto() {
        return this.selectedCrypto;
    }

    setSelectedCrypto(selectedCrypto) {
        this.selectedCrypto = selectedCrypto;
    }

    handleGetAllAvailableCryptos(data) {
        this.emit(ActionTypes.GET_ALL_AVAILABLE_CRYPTOS, data);
    }

    handleEnablecrypto(data) {
        this.emit(ActionTypes.ENABLE_CRYPTO, data);
    }

    handleDisableCrypto() {
        this.emit(ActionTypes.DISABLE_CRYPTO);
    }

    handleGetRegisteredCryptos(data) {
        this.emit(ActionTypes.GET_REGISTERED_CRYPTOS, data);
    }

    handleGetCryptoByCode(code, name, data) {
        this.emit(ActionTypes.GET_CRYPTO_BY_CODE, code, name, data);
    }

    handleGetCryptoHistoryByCode(code, name, data) {
        this.emit(ActionTypes.GET_CRYPTO_HISTORY_BY_CODE, code, name, data);
    }

    handleUpdateCurrency(data) {
        this.currency = data;
        this.emit(ActionTypes.UPDATE_CURRENCY, data);
    }

    handleUpdateSelectedCrypto(data) {
        this.selectedCrypto = data;
        this.emit(ActionTypes.UPDATE_SELECTED_CRYPTO, data);
    }

    dispatcherCallback(action) {
        switch (action.type) {
            case ActionTypes.GET_ALL_AVAILABLE_CRYPTOS:
                this.handleGetAllAvailableCryptos(action.data.data);
                break;
            case ActionTypes.ENABLE_CRYPTO:
                this.handleEnablecrypto(action.data.data);
                break;
            case ActionTypes.DISABLE_CRYPTO:
                this.handleDisableCrypto();
                break;
            case ActionTypes.GET_REGISTERED_CRYPTOS:
                this.handleGetRegisteredCryptos(action.data.data);
                break;
            case ActionTypes.GET_CRYPTO_BY_CODE:
                this.handleGetCryptoByCode(
                    action.code,
                    action.name,
                    action.data
                );
                break;
            case ActionTypes.GET_CRYPTO_HISTORY_BY_CODE:
                this.handleGetCryptoHistoryByCode(
                    action.code,
                    action.name,
                    action.data
                );
                break;
            case ActionTypes.UPDATE_CURRENCY:
                this.handleUpdateCurrency(action.data);
                break;
            case ActionTypes.UPDATE_SELECTED_CRYPTO:
                this.handleUpdateSelectedCrypto(action.data);
                break;
            default:
                break;
        }
    }
}

export default new CryptosStore();
