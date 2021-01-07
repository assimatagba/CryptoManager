/* eslint-disable indent */
import AppStore from './AppStore';
import ActionTypes from '../constants/ActionTypes';
import AppDispatcher from '../dispatcher/AppDispatcher';

class ArticlesStore extends AppStore {
    constructor() {
        super();
        this.dispatchToken = AppDispatcher.register(
            this.dispatcherCallback.bind(this)
        );
    }

    dispatcherCallback(action) {
        switch (action.type) {
            case ActionTypes.GET_ARTICLES:
                this.emit(ActionTypes.GET_ARTICLES, action.data.data);
                break;
            default:
                break;
        }
    }
}

export default new ArticlesStore();
