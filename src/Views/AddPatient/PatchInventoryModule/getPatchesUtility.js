import React from "react";
import { notification, Image, Row, Col } from "antd";

import patchApi from "../../../Apis/patchApis";
import patchImage from "../../../Assets/Images/patchImage.png";
import sp02Image from "../../../Assets/Images/spo2.jpg";
import temp1 from "../../../Assets/Images/temp1.png";
import watch from "../../../Assets/Images/watch.jpg";
import bpSensor from "../../../Assets/Images/BP-sensor.png";
import digitalScale from "../../../Assets/Images/DigitalScale.png";

const getImageSrc = (type, width) => {
    switch (type) {
        case "spo2":
            return <Image width={width} src={sp02Image} preview={false} />;
        case "temperature":
            return <Image width={width} src={temp1} preview={false} />;
        case "gateway":
            return <Image width={150} src={watch} preview={false} />;
        case "ecg":
            return <Image width={width} src={patchImage} preview={false} />;
        case "alphamed":
            return <Image width={width} src={bpSensor} preview={false} />;
        case "ihealth":
            return <Image width={width} src={bpSensor} preview={false} />;
        case "digital":
            return <Image width={width} src={digitalScale} preview={false} />;
        case "bundle":
            return (
                <>
                    <Col span={12}>
                        <Image width="145px" src={sp02Image} preview={false} />
                    </Col>
                    <Col span={12}>
                        <Image width="175px" src={temp1} preview={false} />
                    </Col>
                    <Col span={12}>
                        <Image width="175px" src={patchImage} preview={false} />
                    </Col>
                    <Col span={12}>
                        <Image
                            width="75px"
                            src={watch}
                            preview={false}
                            style={{ marginLeft: "1em" }}
                        />
                    </Col>
                </>
            );
        default:
            return null;
    }
};

const GetPatchesBasedOnTheType = (type, patchSerial) => {
    const [isLoadingPatches, setLoadingPatches] = React.useState(false);
    const [patchList, setPatchList] = React.useState(null);

    React.useEffect(() => {
        setLoadingPatches(true);
        patchApi
            .getPatchInventory(type, -1, 10, 0, patchSerial)
            .then((res) => {
                setLoadingPatches(false);
                setPatchList(res.data.response.patches);
            })
            .catch((err) => {
                setLoadingPatches(false);
                if (err.response !== undefined) {
                    notification.error({
                        message: "Error",
                        description: `${err.response.data.result}`,
                    });
                }
            });
    }, [type]);

    return { patchList, isLoadingPatches };
};

export { GetPatchesBasedOnTheType, getImageSrc };
