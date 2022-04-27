import React from 'react';
import { Grid, Affix } from 'antd';
import { motion } from "framer-motion";
import { Button } from '../Button/button';
import Icons from '../../../Utils/iconMap';
import './navbar.css';
const { useBreakpoint } = Grid;

//animation config
const variants = {
    hidden: {
        y: -100,
        opacity: 0,
        display: 'none',
        transition: {
            duration: 0.4,
            easing: 'easeOut',
        }
    },
    show: {
        y: 0,
        opacity: 1,
        display: 'flex',
        transition: {
            duration: 0.4,
            easing: 'easeIn',

        }
    }
};

export default function Navbar({ startChildren, centerChildren, endChildren }) {

    const screens = useBreakpoint();
    const [isContentVisible, showBurgerContent] = React.useState(false);
    const affixStyle = { width: "100%", top: "0px" }
    if (screens.xl) {
        return <Affix style={affixStyle} >
            <div className="dashboard-nav">
                <div className="dashboard-nav-start">
                    {startChildren}
                </div>
                <div className="dashboard-nav-center">
                    {centerChildren}
                </div>
                <div className="dashboard-nav-end">
                    {endChildren}
                </div>
            </div>
        </Affix>
    } else {
        return <Affix style={affixStyle}>
            <div>
                <div className="dashboard-nav">
                    <div className="dashboard-nav-start">
                        {startChildren}
                    </div>
                    <div className="dashboard-nav-center">
                        {endChildren}
                    </div>
                    {centerChildren && <div className="hamburger">
                        <Button type="secondary" onClick={() => showBurgerContent(!isContentVisible)} >
                            {Icons.hamburgerIcon({})}
                        </Button>
                    </div>
                    }
                </div>
                <motion.div
                    className="hamburger-content"
                    initial={"hidden"}
                    animate={isContentVisible ? "show" : "hidden"}
                    exit={"hidden"}
                    variants={variants}
                >
                    {centerChildren}
                </motion.div>
            </div>
        </Affix>
    }
}