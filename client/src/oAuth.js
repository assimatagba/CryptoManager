import axios from 'axios';
import Config from './config.json';

global.api = axios.create({
    baseURL: Config.api_url,
    timeout: 10000,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

class oAuth {
    constructor() {
        this.login = this.login.bind(this);
        this.isLogged = this.isLogged.bind(this);
    }

    async login(username, password) {
        var result = await global.api
            .post('users/login', {
                email: username,
                password: password,
            })
            .then((response) => {
                if (response.data) return response.data;
                else return null;
            })
            .catch((error) => {
                return null;
            });
        if (result !== null && result.data && result.data.token) {
            localStorage.setItem('userData', JSON.stringify(result.data));
            global.api.defaults.headers['Authorization'] =
                'Bearer ' + result.data.token;
        }
        return result;
    }

    isLogged() {
        var userData = JSON.parse(localStorage.getItem('userData'));
        if (userData) {
            global.api.defaults.headers[
                'Authorization'
            ] = `Bearer ${userData.token}`;
            return true;
        }
        return false;
    }
}

export default new oAuth();
