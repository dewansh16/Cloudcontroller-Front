import React, { useState } from "react";
import { motion, useCycle } from "framer-motion";
import { Link, withRouter, useRouteMatch } from "react-router-dom";
import { Image } from "antd";
import Icons from "../../Utils/iconMap";
import ClientLogo from "../../Assets/Images/MB_logo.svg";
import adminRoutes from "../../Utils/paths/adminRoutes";
import patientRoutes from "../../Utils/paths/patientRoutes";
import needHelpRoute from "../../Utils/paths/needHelpRoute";
import userRoutes from '../../Utils/paths/userRoutes';
import userApi from "../../Apis/userApis";
import Config from "../../Lib/config";
import { UserStore } from "../../Stores/userStore";
import { GrUserSettings } from 'react-icons/gr';
import { GrUserAdmin } from "react-icons/gr";
import { MenuFoldOutlined, MenuUnfoldOutlined, QuestionCircleOutlined } from "@ant-design/icons";
import PowerIcon from "../../Theme/Icons/icons/powerButton";
import "./sideDrawer.css";
import { buildNumber } from "../../Utils/buildNumber";

function MenuItem({
    url,
    Name,
    Icon,
    subMenu,
    iconStyle,
    menuArrowStyle,
    isMenuOpen,
    active,
    setActive,
    setSubMenuActive,
    subMenuActive,
    setSideBarOpen,
    toggleOpen
}) {
    const [subActive, setSubActive] = useState("/patient/list");
    const [subMenuOpen, setSubMenuOpen] = useState([]);

    const subMenuAnimationConfig = {
        hidden: {
            height: 0,
        },
        show: {
            height: "auto",
            transition: {
                duration: 0.2,
                delayChildren: 0.1,
                staggerChildren: 0.1,
            },
        },
    };
    const subMenuItemsAnimationConfig = {
        hidden: {
            opacity: 0,
            y: -10,
        },
        show: {
            opacity: 1,
            y: 0,
        },
    };
    const [isExpanded, setExpand] = useState(false);

    React.useEffect(() => { }, [isExpanded]);

    return (
        <li style={{ position: "relative" }}>
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-around",
                    alignItems: "center",
                    height: "3.2rem",
                    cursor: "pointer",
                    transition: "all",
                    transitionDuration: "0.8s",
                    borderLeft:
                        subMenuActive === Name ? "3px solid #FF7529" : "3px solid white",
                    background:
                        subMenuActive === Name
                            ? "linear-gradient(90deg, rgba(255, 117, 41, 0.11) 35%, rgba(255, 117, 41, 0) 90%)"
                            : null,
                }}
                onClick={() => {
                    setExpand(!isExpanded);
                }}
            >
                {Icon}
                <span className="menu-item-name noselect">{Name}</span>
                <Icons.UpArrowOutlined
                    Style={menuArrowStyle}
                    rotate={isExpanded ? 180 : 90}
                />
            </div>
            {subMenu && subMenu.length > 0 ? (
                <motion.ul
                    className={`subMenu`}
                    variants={subMenuAnimationConfig}
                    animate={isExpanded && isMenuOpen ? "show" : "hidden"}
                >
                    {subMenu.map((item, index) => {
                        if (item?.showOnMenu) {
                            return (
                                <React.Fragment key={`${index}-${item.path}`}>
                                    {item?.haveSubMenu ? (
                                        <div
                                            className={`submenu-list ${active === item.path ? "sidedrawer-active" : ""}`}
                                            onClick={() => {
                                                let newArr =[...subMenuOpen];
                                                if (!newArr?.includes(item.path)) {
                                                    newArr.push(item.path);
                                                } else {
                                                    newArr = newArr.filter(sub => sub !== item.path)
                                                }
                                                setSubMenuOpen(newArr)
                                            }}
                                        >
                                            <motion.li variants={subMenuItemsAnimationConfig}>
                                                {item.icon}
                                                {item.name}
                                                <Icons.UpArrowOutlined
                                                    Style={{
                                                        display: "flex",
                                                        alignItems: "center",
                                                        fontSize: "0.85em"
                                                    }}
                                                    rotate={subMenuOpen?.includes(item.path) ? 180 : 90}
                                                />
                                            </motion.li>
                                        </div>
                                    ) : (
                                        <>
                                            {(!!item?.pathParent) ? (
                                                <>
                                                    {(subMenuOpen?.includes(item.pathParent)) && (
                                                        <Link
                                                            to={`${url}${item.path}`}
                                                            key={item.path}
                                                            className={`
                                                                submenu-list 
                                                                ${subActive === item.path ? "sidedrawer-active" : ""}
                                                            `}
                                                            onClick={() => {
                                                                setActive(item?.pathParent);
                                                                setSubMenuActive(Name);
                                                                setSideBarOpen(false);
                                                                toggleOpen(true);
                                                                setSubActive(item?.path);
                                                            }}
                                                        >
                                                            <motion.li variants={subMenuItemsAnimationConfig} style={{ paddingLeft: "1.5rem" }}>
                                                                {item.icon}
                                                                {item.name}
                                                            </motion.li>
                                                        </Link>
                                                    )}
                                                </>
                                            ) : (
                                                <Link
                                                    to={`${url}${item.path}`}
                                                    key={item.path}
                                                    className={`
                                                        submenu-list 
                                                        ${active === item.path ? "sidedrawer-active" : ""}
                                                        ${!!item?.pathParent && active !== item?.pathParent ? "hide" : ""}
                                                    `}
                                                    onClick={() => {
                                                        setActive(!!item?.pathParent ? item?.pathParent : item?.path);
                                                        setSubMenuActive(Name);
                                                        setSideBarOpen(false);
                                                        toggleOpen(true);
                                                        setSubActive("");
                                                    }}
                                                >
                                                    <motion.li variants={subMenuItemsAnimationConfig}>
                                                        {item.icon}
                                                        {item.name}
                                                    </motion.li>
                                                </Link>
                                            )}
                                        </>
                                    )}
                                </React.Fragment>
                            )
                        }
                    })}
                </motion.ul>
            ) : null}
        </li>
    );
}

function SideDrawer(props) {
    let { url } = useRouteMatch();
    const user = UserStore.getUser();
    const [active, setActive] = useState(user?.role?.toLowerCase() === "admin" ? "/patchInventory" : "patient");
    const [isOpen, toggleOpen] = useCycle(false, true);
    const [sideBarOpen, setSideBarOpen] = useState(false);
    const [subMenuActive, setSubMenuActive] = useState(user?.role?.toLowerCase() === "admin" ? "Admin" : "Patient");
    const [logoutColor, setLogoutColor] = useState("#EB1348");


    const { ROLES } = Config;
    const iconStyle = {
        fontSize: "1.4em",
        textAlign: "center",
    };

    const menuArrowStyle = {
        fontSize: "1em",
    };

    const menuConfig = [
        {
            name: "Settings",
            icon: <GrUserSettings style={iconStyle} />,
            subMenu: userRoutes,
        },
        {
            name: "Help",
            icon: <QuestionCircleOutlined style={iconStyle} />,
            subMenu: needHelpRoute,
        },
    ];

    if (ROLES.ADMIN.includes(user?.role?.toLowerCase()) || ROLES.SUPER_ADMIN.includes(user?.role?.toLowerCase())) {
        menuConfig.unshift(
            {
                name: "Admin",
                icon: <GrUserAdmin style={iconStyle} />,
                subMenu: adminRoutes,
            },
        )
    } if (ROLES.MEDICS.includes(user?.role?.toLowerCase()) || ROLES.SUPER_ADMIN.includes(user?.role?.toLowerCase())) {
        menuConfig.unshift({
            name: "Patient",
            icon: Icons.teams({ Style: iconStyle }),
            subMenu: patientRoutes,
        })

    }
    const logout = () => {
        localStorage.clear();
        UserStore.forgetUser();
        props.history.push("/");

        // userApi
        //     .logout()
        //     .then((res) => {
        //         localStorage.clear();
        //         UserStore.forgetUser();
        //         props.history.push("/");
        //     })
        //     .catch((err) => {
        //         console.error(err);
        //         //TODO: delete this once the above issue is resolved
        //         localStorage.clear();
        //         UserStore.forgetUser();
        //         props.history.push("/");
        //     });
        // Auth.logout(props);
    };
    //FIXME:add a global icon style
    const handleMenuClick = () => {
        if (!sideBarOpen) {
            setSideBarOpen(true);
            toggleOpen(true);
        }
    };

    return (
        <div
            style={{
                position: "relative",
                width: "68px",
                height: "100vh",
                boxSizing: "border-box",
                left: "0",
                top: "0",
            }}
        >
            <motion.div
                className="sidebar"
                onClick={handleMenuClick}
                style={{
                    width: isOpen ? "240px" : "68px",
                    zIndex: isOpen ? "336" : "1",
                    boxShadow: "0px 25px 25px -5px rgba(119, 119, 119, 0.5)"
                }}
            >
                <div
                    className="logo-details"
                    style={{ display: "flex", alignItems: "center", height: "4.8rem" }}
                >
                    {!isOpen ? (
                        <MenuUnfoldOutlined
                            style={{ fontSize: "25px", marginLeft: "10%", marginRight: "5%" }}
                        />
                    ) : (
                        <MenuFoldOutlined
                            onClick={() => {
                                setSideBarOpen(false);
                                toggleOpen(false);
                            }}
                            style={{ fontSize: "25px", marginLeft: "10%", marginRight: "5%" }}
                        />
                    )}
                    <div style={{ padding: "0.5rem" }}>
                        <Image
                            preview={false}
                            style={{ width: "3.2rem" }}
                            src={ClientLogo}
                        />
                    </div>
                    <span
                        className="logo_name"
                        style={{
                            fontSize: "0.9rem",
                            fontWeight: "600",
                            letterSpacing: "1px",
                            marginLeft: "4%",
                        }}
                    >
                        Healthcare
                    </span>
                </div>
                <ul className="nav-links">
                    {menuConfig.map((menuItem) => (
                        <MenuItem
                            key={menuItem.name}
                            url={url}
                            Name={menuItem.name}
                            Icon={menuItem.icon}
                            subMenu={menuItem.subMenu}
                            iconStyle={iconStyle}
                            menuArrowStyle={menuArrowStyle}
                            isMenuOpen={isOpen}
                            active={active}
                            setActive={setActive}
                            setSubMenuActive={setSubMenuActive}
                            subMenuActive={subMenuActive}
                            setSideBarOpen={setSideBarOpen}
                            toggleOpen={toggleOpen}
                        />
                    ))}
                </ul>


                <div style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    height: "115px"
                }}>
                    <div>
                        <div className={`build-nb ${!isOpen ? 'number-hide' : ''}`}>
                            {"Build: "}
                            <span className='number'>{buildNumber}</span>
                        </div>
                    </div>

                    <div
                        className="logout-icon-container"
                        onClick={logout}
                        onMouseEnter={() => setLogoutColor("white")}
                        onMouseLeave={() => setLogoutColor("#EB1348")}
                    >
                        <div className="logout-icon">
                            <PowerIcon props={{ size: 16, color: logoutColor }} />
                        </div>
                        {isOpen && (
                            <div>
                                <span className="logout-text">Logout</span>
                            </div>
                        )}
                    </div>
                </div>
            </motion.div>
        </div>
    );
}

export default withRouter(SideDrawer);

