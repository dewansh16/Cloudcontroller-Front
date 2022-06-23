// config for environment variables 
const Config = {
    PRODUCTION_API_URL: "http://20.230.234.202:7124" /* process.env.REACT_APP_PRODUCTION_API_URL */,
    DEV_API_URL: "http://20.83.211.88:7124"  /* process.env.REACT_APP_DEV_API_URL */,

    // timezone: process.env.REACT_APP_TIMEZONE,

    ROLES: {
        //  both admin and medic priviliges
        SUPER_ADMIN: ["superadmin"],
        // sysadmin priviliges only
        ADMIN: ["admin"],
        //  medics priviliges only
        MEDICS: ["doctor", "nurse"],
    }
}

export default Config;