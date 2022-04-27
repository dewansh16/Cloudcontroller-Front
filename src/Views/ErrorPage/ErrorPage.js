import React from 'react';
import { useHistory } from 'react-router-dom';
import { Button } from "../../Theme/Components/Button/button";
import { ArrowLeftOutlined } from '@ant-design/icons'
import './errorPage.css'

function ErrorPage(error) {
    const history = useHistory();
    return (
        <div className="need-error" >
            <div className="need-error-container" >
                <div className="need-error-number" >
                    404
                </div>
                <div className="need-error-header" >
                    Oops. Something went wrong...
                </div>
                <div className="need-error-subheader" >
                    The page you are looking for could not be found :(
                </div>
                <Button onClick={() => history.goBack()} className="primary"><ArrowLeftOutlined /> GO BACK</Button>
            </div>
        </div>
    )
}

export default ErrorPage
