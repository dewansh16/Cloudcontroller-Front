const arrayDeviceSelect = [
    {
        label: "Gateway Sensor (EV-04)",
        value: "gateway"
    },
    {
        label: "Temperature Sensor",
        value: "temperature"
    },
    {
        label: "SpO2 (CheckMe)",
        value: "spo2"
    },
    {
        label: "ECG Sensor",
        value: "ecg"
    },
    {
        label: "Digital Scale",
        value: "digital"
    },
    {
        label: "BP Sensor",
        value: "bps"
    },
]

const toProperName = (itemType) => {
    switch (itemType) {
        case "temperature":
            return "Temperature Sensor";
        case "ecg":
            return "ECG Sensor";
        case "spo2":
            return "SpO2 Sensor";
        case "gateway":
            return "Gateway Sensor";
        case "digital":
            return "Digital Scale";
        case "alphamed":
            return "Alphamed";
        case "ihealth":
            return "iHealth";
        default:
            return null;
    }
};

export { arrayDeviceSelect, toProperName };