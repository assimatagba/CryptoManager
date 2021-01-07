import ActionTypes from '../constants/ActionTypes';
import AppDispatcher from '../dispatcher/AppDispatcher';

const ArticlesActions = {
    getArticles() {
        global.api.get('articles', {}).then(
            (response) => {
                AppDispatcher.dispatch({
                    type: ActionTypes.GET_ARTICLES,
                    data: response.data,
                });
            },
            (error) => {
                console.log(error);
            }
        );
    },
};

export default ArticlesActions;
