import AddPatient from "../../Views/AddPatient/addPatient";
import PatientDashboard from "../../Views/Dashboard/patientDashboard";
import IcuViewPage from "../../Views/PatientIcu/IcuViewPage";
import PatientDetails from "../../Views/PatientDetails/patientDetails";
import Icons from "../iconMap";
import PatientReport from "../../Views/Components/PatientReport/PatientReport.component.jsx";
import Tenants from "../../Views/Components/Tenants/Tenants.Components";
import Alerts from "../../Views/Components/Alerts/Alerts.components";
import AllAlerts from "../../Views/Components/AllAlerts/AllAlerts.Components.jsx";
import EMR from "../../Views/EMR/EMR";
import MedicineReminderPage from "../../Views/MedicineReminder/MedicineReminderPage";
import GraphVisualizer from "../../Views/GraphVisualizer/GraphVisualizer";
import BillingModule from "../../Views/BillingModule/BillingModule";
import AuditPage from "../../Views/AuditPage/AuditPage";
import PatientJourney from "../../Views/PatientJourney/patientJourney";
import BillingSummary from "../../Views/BillingModule/BillingSummary";
import Logger from "../../Views/logger";
import UploadLogger from "../../Views/UploadLogger";

import { FaPlusSquare } from "react-icons/fa";
import { MdAddAlert } from "react-icons/md";
import { GrAnnounce } from "react-icons/gr";
import { AiOutlineAudit } from "react-icons/ai";

const iconStyle = {
    fontSize: "1.2em",
};

const patientRoutes = [
    {
        id: "0022",
        name: "Dashboard",
        path: "/patient/list",
        component: PatientDashboard,
        isPrivate: true,
        exact: true,
        showOnMenu: true,
        icon: Icons.ledger({ Style: iconStyle }),
    },
    {
        id: "0023",
        name: "Add patient",
        path: "/patient/add",
        component: AddPatient,
        isPrivate: true,
        exact: true,
        showOnMenu: true,
        icon: Icons.schedule({ Style: iconStyle }),
    },
    {
        id: "00230",
        name: "Edit patient",
        path: "/patient/edit/:pid",
        component: AddPatient,
        isPrivate: true,
        exact: true,
        showOnMenu: false,
        icon: Icons.schedule({ Style: iconStyle }),
    },
    {
        id: "0024",
        name: "ICU",
        path: "/patient/icu",
        component: IcuViewPage,
        isPrivate: true,
        exact: true,
        showOnMenu: true,
        icon: <FaPlusSquare style={iconStyle} />,
    },
    {
        id: "00250",
        name: "Medicine Reminder",
        path: "/patient/medicinereminder",
        component: MedicineReminderPage,
        isPrivate: true,
        exact: true,
        showOnMenu: true,
        icon: <GrAnnounce style={iconStyle} />,
    },
    {
        id: "00340",
        name: "Graph Visualizer",
        path: "/patient/:pid/graphvisualizer",
        component: GraphVisualizer,
        isPrivate: true,
        exact: true,
        showOnMenu: false,
        icon: Icons.graphIcon({ Style: iconStyle }),
    },
    {
        id: "215",
        name: "Billing Module",
        path: "/patient/:pid/billingmodule",
        component: BillingModule,
        isPrivate: true,
        exact: true,
        showOnMenu: false,
        icon: Icons.graphIcon({ Style: iconStyle }),
    },
    {
        id: "0027",
        name: "Patient Details",
        path: "/patient/details/:pid",
        component: PatientDetails,
        isPrivate: true,
        exact: true,
        showOnMenu: false,
        icon: Icons.customerSupport({ Style: iconStyle }),
    },
    {
        id: "0029",
        name: "Patient Report",
        path: "/patient/details/:pid/report",
        component: PatientReport,
        isPrivate: true,
        exact: true,
        showOnMenu: false,
        icon: "",
    },
    {
        id: "0030",
        name: "Tenant",
        path: "/patient/tenants",
        component: Tenants,
        isPrivate: true,
        exact: true,
        showOnMenu: false,
        icon: "",
    },
    {
        id: "0031",
        name: "Alerts",
        path: "/patient/:pid/alerts",
        component: Alerts,
        isPrivate: true,
        exact: true,
        showOnMenu: false,
    },
    {
        id: "0032",
        name: "Alerts",
        path: "/patient/allAlerts",
        component: AllAlerts,
        isPrivate: true,
        exact: true,
        showOnMenu: true,
        icon: <MdAddAlert style={iconStyle} />,
    },
    {
        id: "0033",
        name: "EMR",
        path: "/patient/EMR/:pid",
        component: EMR,
        isPrivate: true,
        exact: true,
        showOnMenu: false,
        icon: Icons.customerSupport({ Style: iconStyle }),
    },
    {
        id: "00034",
        name: "Audit",
        path: "/audit",
        component: AuditPage,
        isPrivate: true,
        exact: true,
        showOnMenu: true,
        icon: <AiOutlineAudit style={iconStyle} />,
    },
    {
        id: "00035",
        name: "Billing Summary",
        path: "/bliing-summary",
        component: BillingSummary,
        isPrivate: true,
        exact: true,
        showOnMenu: true,
        icon: <AiOutlineAudit style={iconStyle} />,
    },
    {
        id: "00036",
        name: "Logger",
        path: "/logger",
        component: Logger,
        isPrivate: true,
        exact: true,
        showOnMenu: true,
        icon: <AiOutlineAudit style={iconStyle} />,
    },
    {
        id: "00037",
        name: "Upload Logger",
        path: "/upload-logger",
        component: UploadLogger,
        isPrivate: true,
        exact: true,
        showOnMenu: true,
        icon: <AiOutlineAudit style={iconStyle} />,
    },
];

export default patientRoutes;
