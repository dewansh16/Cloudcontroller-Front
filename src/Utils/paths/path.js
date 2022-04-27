
import Homepage from '../../homepage';
import Dashboard from '../../Views/dashboard';

const routes = [
    {
        "id": "0010",
        "name": "Landing",
        "path": '/',
        "component": Homepage,
        "isPrivate": false,
        "exact": true,
    },
    {
        "id": "0020",
        "name": "Dashboard",
        "path": '/dashboard',
        "component": Dashboard,
        "isPrivate": true,
        "exact": false,
    },
]
export default routes;