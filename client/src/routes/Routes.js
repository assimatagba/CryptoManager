import Login from '../components/Login';
import Dashboard from '../components/Dashboard';
import Settings from '../components/Settings';
import Register from '../components/Register';

const Routes = [
    {
        path: '/',
        exact: true,
        protected: false,
        component: Login,
    },
    {
        path: '/register',
        exact: true,
        protected: false,
        component: Register,
    },
    {
        path: '/dashboard',
        exact: true,
        protected: false,
        component: Dashboard,
    },
    {
        path: '/settings',
        exact: true,
        protected: true,
        component: Settings,
    },
];

export default Routes;
