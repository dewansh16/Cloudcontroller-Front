import Colors from "../Theme/Colors/colors";
import Icons from "../Utils/iconMap";

export const arrDataChart = [
    {
        _key: 'temp',
        name: "Temperature",
        icon: Icons.thermometerIcon({ Style: { color: Colors.purple } }),
        val: 0,
        color: Colors.purple,
        trendData: []
    },
    {
        _key: 'spo2',
        name: "SPO2",
        icon: Icons.o2({ Style: { color: Colors.green } }),
        val: 0,
        color: Colors.green,
        trendData: []
    },
    {
        _key: 'ecg_hr',
        name: "Heart Rate",
        icon:  Icons.ecgIcon({ Style: { color: Colors.darkPink } }),
        val: 0,
        color: Colors.darkPink,
        trendData: []
    },
    {
        _key: 'ecg_rr',
        name: "Respiration Rate",
        icon: Icons.lungsIcon({ Style: { color: Colors.orange } }),
        val: 0,
        color: Colors.orange,
        trendData: []
    },
    {
        _key: "blood_pressuer",
        name: "Blood Pressure",
        icon: Icons.bloodPressure({ Style: { color: Colors.darkPurple, transform: 'scale(0.75)' } }),
        val: 0,
        val_bpd: 0,
        color: Colors.darkPurple,
        trendData: []
    },
    {
        _key: 'weight',
        name: "Weight",
        icon: Icons.bpIcon({
            Style: { color: Colors.yellow, fontSize: "24px" },
        }),
        val: 0,
        color: Colors.yellow,
        trendData: []
    },
];