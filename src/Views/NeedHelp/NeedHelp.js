import React from 'react'
import './needHelp.css'
import { Button } from "../../Theme/Components/Button/button";
import EnvelopeIcon from '../../Assets/Icons/envelopeIcon';
import { notification } from "antd";

function copyToClipboard() {
    var input = document.body.appendChild(document.createElement("input"));
    input.value = 'support@live247.ai';
    input.focus();
    input.select();
    document.execCommand('copy');
    input.parentNode.removeChild(input);
    notification.success({
        message: 'COPIED',
        description: 'Email copied to Clipboard'
    });
}

function NeedHelp() {
    return (
        <div className="need-help" >
            <div className="need-help-container" >
                <div className="need-help-icon" >
                    <EnvelopeIcon />
                </div>
                <div className="need-help-header" >
                    support@live247.ai
                </div>
                <div className="need-help-subheader" >
                    Please Send Email to above mentioned link for any query
                </div>
                <Button onClick={() => { copyToClipboard() }} className="primary" style={{ marginTop: "50px" }} >Copy Email</Button>
            </div>
        </div>
    )
}

export default NeedHelp
