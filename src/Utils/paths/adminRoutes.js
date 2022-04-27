import Admin from "../../Views/Admin/admin";
import PatchInventory from '../../Views/DeviceInventory/deviceInventory';
// import Ecg from './Charts/ecg';
import Connector from '../../Views/Admin/Connector/connector';
import UserInvent from '../../Views/UserInventory/userInventory';
import { MdDeviceHub } from 'react-icons/md';
import { BsBuilding } from 'react-icons/bs';
import { FaUsers } from 'react-icons/fa';
import { GrConnect } from 'react-icons/gr';
const iconStyle = {
    fontSize: "1.2em"
}


const adminRoutes = [
    {
        "id": "0019",
        "name": "Device Inventory",
        "path": "/patchInventory",
        "component": PatchInventory,
        "isPrivate": true,
        "exact": true,
        "showOnMenu": true,
        "icon": <MdDeviceHub style={iconStyle} />
    },
    {
        "id": "0025",
        "name": "Tenants",
        "path": "/admin/tenant",
        "component": Admin,
        "isPrivate": true,
        "exact": true,
        "showOnMenu": true,
        "icon": <BsBuilding style={iconStyle} />
    },
    {
        "id": "0026",
        "name": "Users",
        "path": '/user',
        "component": UserInvent,
        "isPrivate": true,
        "exact": true,
        "showOnMenu": true,
        "icon": <FaUsers style={iconStyle} />
    },
    {
        "id": "0027",
        "name": "EMR Connector",
        "path": '/connector',
        "component": Connector,
        "isPrivate": true,
        "exact": true,
        "showOnMenu": true,
        "icon": <GrConnect style={iconStyle} />,
    },


]


export default adminRoutes;