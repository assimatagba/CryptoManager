/* eslint-disable indent */
import AppStore from './AppStore';
import ActionTypes from '../constants/ActionTypes';
import AppDispatcher from '../dispatcher/AppDispatcher';

class UserStore extends AppStore {
    constructor() {
        super();
        this.dispatchToken = AppDispatcher.register(
            this.dispatcherCallback.bind(this)
        );
        this.me = {};
        this.profile = {};
    }

    getUserData() {
        return this.me;
    }

    getUserProfile() {
        return this.profile;
    }

    handleGetUserData(data) {
        this.me = data;
        this.emit(ActionTypes.GET_USER_DATA);
    }

    handleUpdateProfile(data) {
        this.profile = data;
        this.emit(ActionTypes.UPDATE_PROFILE, data);
    }

    handleGetUserProfile(data) {
        this.profile = data;
        this.emit(ActionTypes.GET_PROFILE, data);
    }

    handleRegisterUser(data) {
        this.emit(ActionTypes.REGISTER_USER, data);
    }

    handleRegisterUserError(data) {
        this.emit(ActionTypes.REGISTER_USER_ERROR, data);
    }

    dispatcherCallback(action) {
        switch (action.type) {
            case ActionTypes.GET_USER_DATA:
                this.handleGetUserData(action.data);
                break;
            case ActionTypes.GET_PROFILE:
                this.handleGetUserProfile(action.data.data);
                break;
            case ActionTypes.UPDATE_PROFILE:
                this.handleUpdateProfile(action.data);
                break;
            case ActionTypes.REGISTER_USER:
                this.handleRegisterUser(action.data);
                break;
            case ActionTypes.REGISTER_USER_ERROR:
                this.handleRegisterUserError(action.data);
                break;
            default:
                break;
        }
    }
}

export default new UserStore();
