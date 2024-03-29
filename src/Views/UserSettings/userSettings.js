import React, { useState, useEffect } from 'react';
import userApi from '../../Apis/userApis';
import { Spin } from 'antd';
import EditUser from '../UserInventory/EditUser/editUser';
import './userSettings.css';

export default function UserSettings() {

    const [userData, setUserData] = useState(undefined);
    const [apiState, setApiState] = useState({
        isLoading: false,
        hasError: undefined
    })

    useEffect(() => {
        setApiState({ ...apiState, isLoading: true });
        userApi.getMyself().then((res) => {
            setUserData(res.data.response.users[0])
            setApiState({ ...apiState, isLoading: false });
        }).catch(err => {
            setApiState({ isLoading: false, hasError: "Unable to fetch your details.😞" });
        })
    }, [])

    if (apiState.isLoading) {
        return <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Spin />
        </div>
    } else if (apiState.hasError || userData === undefined) {
        return <div>
            {apiState.hasError}
        </div>
    } else {
        return <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{
                background: "#FFF",
                boxShadow: "0px 10px 30px 5px rgba(0 ,56 ,255,0.1)",
                borderRadius: "6px"
            }}>
                <EditUser userData={userData} title={"Your Profile"} disableEditRole />
            </div>
        </div>

    }

}
