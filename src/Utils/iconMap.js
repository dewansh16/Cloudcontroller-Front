import Icon from "@ant-design/icons";
// import Logo from '../Assets/EMR_logo';
import PatientIcon from "../Assets/Icons/patientIcon";
import AlertIcon from "../Assets/Icons/alertIcon";
import AddIcon from "../Assets/Icons/addIcon";
import Hamburger from "../Assets/Icons/hamburger";
import ThemeIcon from "../Assets/Icons/themeIcon";
import SupportIcon from "../Assets/Icons/support";
import Logout from "../Assets/Icons/logout";
import Hero from "../Assets/Icons/heroIcon";
import Standing from "../Assets/Icons/standing";
import Sleeping from "../Assets/Icons/sleeping";
import Running from "../Assets/Icons/running";
import Sitting from "../Assets/Icons/sitting";
import LungsIcon from "../Assets/Icons/lungs";
import ThermometerIcon from "../Assets/Icons/thermometer";
import EcgIcon from "../Assets/Icons/ecg";
import MoonIcon from "../Assets/Icons/moonIcon";
import SunIcon from "../Assets/Icons/sunIcon";
import O2 from "../Assets/Icons/o2";
import Clock5 from "../Assets/Icons/clock5";
import WheelChair from "../Assets/Icons/wheelChair";
import HeaderBackArrow from "../Assets/Icons/headerBackArrow";
import Lock from "../Assets/Icons/lock";
import PauseIcon from "../Assets/Icons/pauseButton";
import PlayIcon from "../Assets/Icons/playButton";
import PillIcon from "../Assets/Icons/pillIcon";
import PillIconTwo from "../Assets/Icons/pillIconTwo";
import InjectionIcon from "../Assets/Icons/injectionIcon";
import SprayIcon from "../Assets/Icons/sprayIcon";
import AdvisorIcon from "../Assets/Icons/advisorIcon";
import UploadNote from "../Assets/Icons/uploadNote";
import GreenDotIcon from "../Assets/Icons/greenDotIcon";
import RedDotIcon from "../Assets/Icons/redDotIcon";
import LocationTag from "../Assets/Icons/locationTag";
import BloodPressure from "../Assets/Icons/bloodPressure";
import HouseIcon from "../Assets/Icons/houseIcon";

import {
  TeamOutlined,
  AppstoreAddOutlined,
  MedicineBoxOutlined,
  CompassOutlined,
  CaretLeftFilled,
  UserOutlined,
  EditOutlined,
  CustomerServiceOutlined,
  ProfileOutlined,
  ScheduleOutlined,
  SettingOutlined,
  RightOutlined,
  QuestionCircleOutlined,
  LogoutOutlined,
  CaretDownOutlined,
  CaretUpOutlined,
  MenuOutlined,
  RightCircleFilled,
  CaretRightFilled,
  SearchOutlined,
  SyncOutlined,
  CheckCircleFilled,
  ExclamationCircleOutlined,
  ExclamationCircleFilled,
  PlusOutlined,
  CloseCircleOutlined,
  ToolOutlined,
  CloseOutlined,
  FilterOutlined,
  SortAscendingOutlined,
  PhoneOutlined,
  PlusCircleFilled,
  UpOutlined,
  DeleteFilled,
  AreaChartOutlined,
  ClockCircleOutlined,
  EyeFilled,
  InfoCircleOutlined,
  ManOutlined,
  WomanOutlined,
  HomeOutlined,
  DashboardOutlined,
} from "@ant-design/icons";
import ReverseIcon from "../Assets/Icons/reverseIcon";
import EditPencil from "../Assets/Icons/editPencil";
import AdmittedForIcon from "../Assets/Icons/admittedForIcon";
import AdmittedOnIcon from "../Assets/Icons/admittedOnIcon";
import CalenderIcon from "../Assets/Icons/calenderIcon";
import PhoneIcon from "../Assets/Icons/phoneIcon";
import RadioFilledIcon from "../Assets/Icons/radioFilledIcon";
import UpDownArrowIcon from "../Assets/Icons/upDownArrowIcon";
import WeighingMachineIcon from "../Assets/Icons/weighingMachineIcon";
import MaleIcon from "../Assets/Icons/maleIcon";
import HomeIcon from "../Assets/Icons/homeIcon";
import BpIcon from "../Assets/Icons/bpIcon";

/**
 *  Please give meaningful names to the icons
 * based on their characteristics so they're easy to recognize
 */
const Icons = {
  // theme icons
  sun: ({ Style: style, ...rest }) => (
    <Icon component={SunIcon} style={style} {...rest} />
  ),
  moon: ({ Style: style, ...rest }) => (
    <Icon component={MoonIcon} style={style} {...rest} />
  ),
  themeIcon: ({ Style: style, ...rest }) => (
    <Icon component={ThemeIcon} style={style} {...rest} />
  ),

  // vital icons
  thermometerIcon: ({ Style: style, ...rest }) => (
    <Icon component={ThermometerIcon} style={style} {...rest} />
  ),
  o2: ({ Style: style, ...rest }) => (
    <Icon component={O2} style={style} {...rest} />
  ),
  ecgIcon: ({ Style: style, ...rest }) => (
    <Icon component={EcgIcon} style={style} {...rest} />
  ),
  lungsIcon: ({ Style: style, ...rest }) => (
    <Icon component={LungsIcon} style={style} {...rest} />
  ),
  bpIcon: ({ Style: style, ...rest }) => (
    <DashboardOutlined style={style} {...rest} />
  ),
  heroIcon: ({ Style: style, ...rest }) => (
    <Icon component={Hero} style={style} {...rest} />
  ),
  bloodPressure: ({ Style: style, ...rest }) => (
    <Icon component={BloodPressure} style={style} {...rest} />
  ),
  houseIcon: ({ Style: style, ...rest }) => (
    <Icon component={HouseIcon} style={style} {...rest} />
  ),

  // motion icons
  standing: ({ Style: style, ...rest }) => (
    <Icon component={Standing} style={style} {...rest} />
  ),
  sitting: ({ Style: style, ...rest }) => (
    <Icon component={Sitting} style={style} {...rest} />
  ),
  sleepingalt: ({ Style: style, ...rest }) => (
    <Icon component={Sleeping} style={style} {...rest} />
  ),
  running: ({ Style: style, ...rest }) => (
    <Icon component={Running} style={style} {...rest} />
  ),
  patientInBedIcon: ({ Style: style, ...rest }) => (
    <Icon component={PatientIcon} style={style} {...rest} />
  ),

  // menu option icons
  hamburgerIcon: ({ Style: style, ...rest }) => (
    <Icon component={Hamburger} style={style} {...rest} />
  ),
  logoutCustomIcon: ({ Style: style, ...rest }) => (
    <Icon component={Logout} style={style} {...rest} />
  ),
  LogoutOutlined: ({ Style: style, ...rest }) => (
    <LogoutOutlined style={style} {...rest} />
  ),
  supportIcon: ({ Style: style, ...rest }) => (
    <Icon component={SupportIcon} style={style} {...rest} />
  ),
  teams: ({ Style: style, ...rest }) => (
    <TeamOutlined style={style} {...rest} />
  ),
  menu: ({ Style: style, ...rest }) => (
    <AppstoreAddOutlined style={style} {...rest} />
  ),
  medicineBox: ({ Style: style, ...rest }) => (
    <MedicineBoxOutlined style={style} {...rest} />
  ),
  compass: ({ Style: style, ...rest }) => (
    <CompassOutlined style={style} {...rest} />
  ),
  user: ({ Style: style, ...rest }) => <UserOutlined style={style} {...rest} />,
  customerSupport: ({ Style: style, ...rest }) => (
    <CustomerServiceOutlined style={style} {...rest} />
  ),
  schedule: ({ Style: style, ...rest }) => (
    <ScheduleOutlined style={style} {...rest} />
  ),
  graphIcon: ({ Style: style, ...rest }) => (
    <AreaChartOutlined style={style} {...rest} />
  ),

  //  edit options
  addIcon: ({ Style: style, ...rest }) => (
    <Icon component={AddIcon} style={style} {...rest} />
  ),
  PlusOutlined: ({ Style: style, ...rest }) => (
    <PlusOutlined style={style} {...rest} />
  ),
  plusCircleFilled: (props) => <PlusCircleFilled {...props} />,
  edit: ({ Style: style, ...rest }) => <EditOutlined style={style} {...rest} />,
  deleteFilled: ({ Style: style, ...rest }) => (
    <DeleteFilled style={style} {...rest} />
  ),
  editPencil: ({ Style: style, ...rest }) => (
    <EditPencil style={style} {...rest} />
  ),

  // utility icons
  settings: ({ Style: style, ...rest }) => (
    <SettingOutlined style={style} {...rest} />
  ),
  Alert: ({ Style: style, ...rest }) => (
    <Icon component={AlertIcon} style={style} {...rest} />
  ),
  tool: ({ Style: style, ...rest }) => <ToolOutlined style={style} {...rest} />,
  checkCircleFilled: (props) => <CheckCircleFilled {...props} />,
  exclamationCircleOutlined: ({ Style: style, ...rest }) => (
    <ExclamationCircleOutlined style={style} {...rest} />
  ),
  exclamationCircleFilled: (props) => <ExclamationCircleFilled {...props} />,
  questionMarkCircled: ({ Style: style, ...rest }) => (
    <QuestionCircleOutlined style={style} {...rest} />
  ),
  sync: ({ Style: style, Spin }) => (
    <SyncOutlined style={style} rotate={Spin} />
  ),
  ledger: ({ Style: style, ...rest }) => (
    <ProfileOutlined style={style} {...rest} />
  ),
  hamburger: ({ Style: style, ...rest }) => (
    <MenuOutlined style={style} {...rest} />
  ),
  msgIcon: ({ Style: style, ...rest }) => (
    <RightCircleFilled style={style} {...rest} />
  ),
  filterIcon: ({ Style: style, ...rest }) => (
    <FilterOutlined style={style} {...rest} />
  ),
  sortIcon: ({ Style: style, ...rest }) => (
    <SortAscendingOutlined style={style} {...rest} />
  ),
  infoCircleIcon: ({ Style: style, ...rest }) => (
    <InfoCircleOutlined style={style} {...rest} />
  ),
  Clock5: ({ Style: style, ...rest }) => <Clock5 style={style} {...rest} />,
  wheelChair: ({ Style: style, ...rest }) => (
    <WheelChair style={style} {...rest} />
  ),
  lock: ({ Style: style, ...rest }) => <Lock style={style} {...rest} />,
  ClockOutlined: ({ Style: style, ...rest }) => (
    <ClockCircleOutlined style={style} {...rest} />
  ),
  searchIcon: ({ Style: style, ...rest }) => (
    <SearchOutlined style={style} {...rest} />
  ),
  closeCircleOutlined: (props) => <CloseCircleOutlined {...props} />,
  CloseCircleOutlined: ({ Style: style, ...rest }) => (
    <CloseCircleOutlined style={style} {...rest} />
  ),
  CloseOutlined: ({ Style: style, ...rest }) => (
    <CloseOutlined style={style} {...rest} />
  ),
  phoneOutlined: ({ Style: style, ...rest }) => (
    <PhoneOutlined style={style} {...rest} />
  ),
  pauseOutlined: ({ Style: style, ...rest }) => (
    <PauseIcon style={style} {...rest} />
  ),
  playFilled: ({ Style: style, ...rest }) => (
    <PlayIcon style={style} {...rest} />
  ),
  pillIcon: ({ Style: style, ...rest }) => (
    <Icon component={PillIcon} style={style} {...rest} />
  ),
  pillIconTwo: ({ Style: style, ...rest }) => (
    <Icon component={PillIconTwo} style={style} {...rest} />
  ),
  injectionIcon: ({ Style: style, ...rest }) => (
    <Icon component={InjectionIcon} style={style} {...rest} />
  ),
  sprayIcon: ({ Style: style, ...rest }) => (
    <Icon component={SprayIcon} style={style} {...rest} />
  ),
  eyeFilled: (props) => <EyeFilled {...props} />,
  advisorIcon: ({ Style: style, ...rest }) => (
    <Icon component={AdvisorIcon} style={style} {...rest} />
  ),
  uploadNote: ({ Style: style, ...rest }) => (
    <Icon component={UploadNote} style={style} {...rest} />
  ),
  locationTag: ({ Style: style, ...rest }) => (
    <LocationTag style={style} {...rest} />
  ),
  reverseIcon: ({ Style: style, ...rest }) => (
    <ReverseIcon style={style} {...rest} />
  ),

  //Dot icons
  greenDotIcon: ({ Style: style, ...rest }) => (
    <GreenDotIcon style={style} {...rest} />
  ),
  redDotIcon: ({ Style: style, ...rest }) => (
    <RedDotIcon style={style} {...rest} />
  ),

  //Patient Details Icons
  maleIcon: ({ Style: style, ...rest }) => <MaleIcon style={style} {...rest} />,
  womanOutlined: ({ Style: style, ...rest }) => (
    <WomanOutlined style={style} {...rest} />
  ),
  homeIcon: ({ Style: style, ...rest }) => <HomeIcon style={style} {...rest} />,
  admittedForIcon: ({ Style: style, ...rest }) => (
    <AdmittedForIcon style={style} {...rest} />
  ),
  admittedOnIcon: ({ Style: style, ...rest }) => (
    <AdmittedOnIcon style={style} {...rest} />
  ),
  calenderIcon: ({ Style: style, ...rest }) => (
    <CalenderIcon style={style} {...rest} />
  ),
  phoneIcon: ({ Style: style, ...rest }) => (
    <PhoneIcon style={style} {...rest} />
  ),
  radioFilledIcon: ({ Style: style, ...rest }) => (
    <RadioFilledIcon style={style} {...rest} />
  ),
  upDownArrowIcon: ({ Style: style, ...rest }) => (
    <UpDownArrowIcon style={style} {...rest} />
  ),
  weighingMachineIcon: ({ Style: style, ...rest }) => (
    <WeighingMachineIcon style={style} {...rest} />
  ),

  // arrow icons
  // TODO: rename backicon to left arrow
  rightArrowFilled: ({ Style: style, ...rest }) => (
    <CaretRightFilled style={style} {...rest} />
  ),
  leftArrowFilled: ({ Style: style, ...rest }) => (
    <CaretLeftFilled style={style} {...rest} />
  ),
  rightOutlined: ({ Style: style, ...rest }) => (
    <RightOutlined style={style} {...rest} />
  ),
  downArrowFilled: (props) => <CaretDownOutlined {...props} />,
  DownArrowFilled: ({ Style: style, ...rest }) => (
    <CaretDownOutlined style={style} {...rest} />
  ),
  headerBackArrow: ({ Style: style, ...rest }) => (
    <HeaderBackArrow style={style} {...rest} />
  ),
  upArrowFilled: ({ Style: style, ...rest }) => (
    <CaretUpOutlined style={style} {...rest} />
  ),
  UpArrowOutlined: ({ Style: style, ...rest }) => (
    <UpOutlined style={style} {...rest} />
  ),
};
export default Icons;
