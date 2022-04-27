import React from "react";
import Icons from "../../../Utils/iconMap";
import { Cascader } from "antd";
import locationApi from "../../../Apis/locationApi";
import { UserStore } from "../../../Stores/userStore";

export default function WardSelector({
    wardDetails,
    setWardDetails,
    locationUuid,
    setLocationUuid,
    searchOptions,
}) {
    const [locations, setLocations] = React.useState([]);
    // const [processedLocationData, setProcessedLocationData] = React.useState([]);
    const [options, setOptions] = React.useState([]);
    const [apiState, setApiState] = React.useState({
        isLoading: false,
        hasError: undefined,
    });

    const onChange = (value, selectedOptions) => {
        setWardDetails({
        text: selectedOptions.map((o) => o.label).join(" > "),
        });
        let selectedLocation = locations.find(
        (location) =>
            parseInt(location.building) === value[0] &&
            parseInt(location.floor) === value[1] &&
            parseInt(location.ward) === value[2]
        );
        setLocationUuid({
        ...searchOptions,
        locationUuid: selectedLocation.location_uuid,
        });
    };

    const removeSelectedValue = () => {
        setWardDetails({
        text: null,
        });
        setLocationUuid({ ...searchOptions, locationUuid: null });
    };

    React.useEffect(() => {
        let isMounted = true;

        setApiState({ isLoading: true });
        const { tenant } = UserStore.getUser();
        const user = JSON.parse(localStorage.getItem("user"));

        if (!!user?.userName) {
            locationApi
                .getLocationData(tenant, 10)
                .then((res) => {
                    let facility_map = res.data.response?.facilities[0]?.facility_map;
                    let buildings = Object.keys(facility_map.buildings);
                    let floors;
                    let wards;
                    let payload = [];

                    buildings.map((thisBuilding, buildIndex) => {
                        floors = Object.keys(facility_map.buildings[thisBuilding].floors);
                        let building_tag = facility_map.buildings[thisBuilding].tag;
                        payload[buildIndex] = {
                            label: building_tag ? building_tag : `building ${buildIndex + 1}`,
                            value: buildIndex + 1,
                            children: [],
                        };

                        floors.map((thisFloor, floorIndex) => {
                            wards = Object.keys(
                                facility_map.buildings[thisBuilding].floors[thisFloor].wards
                            );

                            let floor_tag =
                            facility_map.buildings[thisBuilding].floors[thisFloor].tag;
                            payload[buildIndex].children[floorIndex] = {
                            label: floor_tag ? floor_tag : `floor ${floorIndex + 1}`,
                            value: floorIndex + 1,
                            children: wards.map((ward, wardIndex) => {
                                    let wardTag =
                                    facility_map.buildings[thisBuilding].floors[thisFloor].wards[
                                        ward
                                    ].tag;
                                    return {
                                        label: wardTag ? wardTag : ward.replaceAll("_", " "),
                                        value: wardIndex + 1,
                                    };
                                }),
                            };
                        });
                    });

                    if (isMounted) {
                        setOptions(payload);
                        setLocations(res.data.response?.locations);
                        setApiState({ isLoading: false });
                    }
                })
                .catch((err) => {
                    if (isMounted) {
                        setApiState({ isLoading: false, hasError: err });
                    }
                });
        }

        return () => {
            isMounted = false;
        };
    }, []);

    return (
        <>
            <Cascader options={options} onChange={onChange} value={wardDetails.text}>
                {/* eslint-disable-next-line */}
                <a
                    href="#"
                    style={{
                        color: "black",
                        border: "1px solid rgba(255, 117, 41, 0.8)",
                        padding: "1em",
                        borderRadius: "8px",
                        fontWeight: "500",
                    }}
                >
                {wardDetails.text !== null ? (
                    <span style={{ display: "inline-flex" }}>
                        {wardDetails.text}
                        <div
                            onClick={removeSelectedValue}
                            style={{ cursor: "pointer", marginLeft: "1rem" }}
                        >
                            <Icons.closeCircleOutlined />
                        </div>
                    </span>
                ) : (
                    <span>
                        Select Location{" "}
                        <Icons.DownArrowFilled style={{ marginLeft: "1rem" }} />
                    </span>
                )}
                </a>
            </Cascader>
        </>
    );
}
