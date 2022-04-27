import UserSettings from "../../Views/UserSettings/userSettings";
import { CgProfile } from 'react-icons/cg';
const iconStyle = {
    fontSize: "1.2em"
}

const userRoute = [
    {
        "name": "Profile",
        "path": '/usersettings',
        "component": UserSettings,
        "isPrivate": true,
        "exact": true,
        "showOnMenu": true,
        "icon": <CgProfile style={iconStyle} />
    }
]

export default userRoute;