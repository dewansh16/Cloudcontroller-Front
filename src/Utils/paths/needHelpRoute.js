import NeedHelp from "../../Views/NeedHelp/NeedHelp";
import GuidePage from "../../Views/GuidePage/GuidePage";
import { BiSupport } from 'react-icons/bi'
import { GiBookmark } from 'react-icons/gi'
const iconStyle = {
    fontSize: "1.2em"
}

const needHelpRoute = [
    {
        "name": "Support",
        "path": '/needhelp',
        "component": NeedHelp,
        "isPrivate": true,
        "exact": true,
        "showOnMenu": true,
        "icon": <BiSupport style={iconStyle} />
    },
    {
        "name": "Guide",
        "path": '/guide',
        "component": GuidePage,
        "isPrivate": true,
        "exact": true,
        "showOnMenu": true,
        "icon": <GiBookmark style={iconStyle} />
    },
]

export default needHelpRoute;