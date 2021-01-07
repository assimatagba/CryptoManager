import ActionTypes from '../constants/ActionTypes';
import AppDispatcher from '../dispatcher/AppDispatcher';

const UserActions = {
    getUserData() {
        var userData = JSON.parse(localStorage.getItem('userData'));
        if (userData) {
            AppDispatcher.dispatch({
                type: ActionTypes.GET_USER_DATA,
                data: userData,
            });
        }
    },

    getProfile() {
        global.api.get('users/profile', {}).then(
            (response) => {
                AppDispatcher.dispatch({
                    type: ActionTypes.GET_PROFILE,
                    data: response.data,
                });
            },
            (error) => {
                console.log(error);
            }
        );
    },

    updateProfile(data) {
        global.api.put('users/profile', data).then(
            (response) => {
                AppDispatcher.dispatch({
                    type: ActionTypes.UPDATE_PROFILE,
                    data: response.data,
                });
            },
            (error) => {
                console.log(error);
            }
        );
    },

    registerUser(data) {
        global.api.post('users/register', data).then(
            (response) => {
                AppDispatcher.dispatch({
                    type: ActionTypes.REGISTER_USER,
                    data: response.data,
                });
            },
            (error) => {
                AppDispatcher.dispatch({
                    type: ActionTypes.REGISTER_USER_ERROR,
                    data: error.response.data,
                });
                console.log(error.response.data);
            }
        );
    },
};

export default UserActions;
