import styled from 'styled-components';
import { Button, Input, Modal } from 'antd';

const primaryButtonStyle = {
    border: "1px solid  #1479FF",
    marginRight: "10px",
    background: "white",
    color: "#0A74FF",
    zIndex: "2",
    minHeight: "2.7em",
    minWidth: "12em",
    fontSize: "18px"
}

const secondaryButtonStyle = (props) => {
    return {
        border: props.border || "1px solid  #1479FF",
        margin: props.margin || "1em",
        background: props.background || "white",
        color: props.color || "#0A74FF",
        zIndex: props.zIndex || "1",
        minHeight: props.minHeight || "1.7em",
        minWidth: props.minWidth || "6em",
        fontSize: props.fontSize || "",
        fontWeight: props.fontWeight || "600"
    }
}
const primaryButtonWithNoOutlineStyle = {
    border: "None",
    marginRight: "10px",
    background: "white",
    color: "#0A74FF",
    zIndex: "2",
    minHeight: "2.7em",
    minWidth: "fit-content",
    fontSize: "18px",
    boxShadow: "0px 0px 20px 5px rgba(20, 121, 255, 0.1)"
}

const primaryButtonShadowedStyle = {
    background: "#FFFFFF",
    boxShadow: "0px 0px 20px 5px rgba(20, 121, 255, 0.1)",
    color: "#0A74FF",
    fontWeight: "regular",
    outline: "None",
    border: "None",
    fontSize: "18px",
    height: "2.7em",
    width: "6em"
}

const MainDivStyle = {
    border: "8% dashed #0A74FF",
    padding: "3%",
    backgroundColor: " #FFFFFF",
}

const InputStyled = styled(Input)`
color: rgb(71, 71, 71);
font-weight: 500;
padding-left: 20px;
font-size: 16px;
height: 48px;
line-height: 20px;
box-shadow: 0px 4px 20px rgb(40 40 40 / 5%);
border: 1px solid #d9d9d9;
border-radius: 6px !important;
`

const PrimaryBtn = styled(Button)`
background: #FBFBFB ;
    border: 1px solid #FF9052 !important;
    box-sizing: border-box ;
    font-weight: 500 ;
    font-size: 15px ;
    line-height: 20px ;
    color: #FF9053!important;
    border-radius: 6px ;
    width: fit-content;
    padding: 0px 24px;
    height: 50px ;
    :hover{
        transform: translateY(-5px);
        box-shadow: 0px 10px 10px #ffe6d8;
        transition: 0.3s ease-in-out all;
    background: #FF9052 ;
    color: #FBFBFB !important;
    }
`

const PrimaryOutlineBtn = styled(Button)`
background: #FBFBFB ;
    border: 2px solid rgba(255, 117, 41, 0.3) !important ;
    box-sizing: border-box ;
    font-weight: 500 ;
    font-size: 15px ;
    line-height: 20px ;
    color: #FF9053 !important;
    border-radius: 6px ;
    width: 118px ;
    padding: 0px ;
    height: 50px ;
    :hover{
        border:  2px solid #FF7529; ;
        font-weight: 600 ;
        color: #FBFBFB ;
    }
`

const SecondaryBtn = styled(Button)`
background: #FBFBFB ;
box-sizing: border-box ;
font-weight: 400 ;
font-size: 15px ;
line-height: 20px ;
color: #474747 ;
border-radius: 6px ;
width: 118px ;
padding: 0px ;
height: 50px ;
:hover {
    background: #E7E7E7 ;
    color: #474747;
}
`
const StyledModal = styled(Modal)`
.ant-modal-mask {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 1000;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.45);
    backdrop-filter: blur(4px) !important;
}
`
const BackBtn = styled(Button)`
z-index: 100;
position: absolute;
top: 0px;
left: 0px;
font-size: 24px;
color: black;
border-radius: 0px 6px 6px 0px;
height: 64px;
width: 64px;
:hover{
    background: rgb(157, 221, 244);
}
`




export {
    primaryButtonStyle,
    primaryButtonWithNoOutlineStyle,
    primaryButtonShadowedStyle, MainDivStyle,
    secondaryButtonStyle, InputStyled,
    PrimaryBtn, SecondaryBtn, BackBtn,
    StyledModal, PrimaryOutlineBtn
}