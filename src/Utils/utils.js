export const ipAddress = "20.230.234.202";

export const CPT_CODE = {
    CPT_99453: 99453,
    CPT_99454: 99454,
    CPT_99457: 99457,
    CPT_99458: 99458,
    CPT_99091: 99091
}

export const getCPTPriceByCode = (cptCode) => {
    switch(cptCode){
        case CPT_CODE.CPT_99453:
            return 19;
        case CPT_CODE.CPT_99454:
            return 56;
        case CPT_CODE.CPT_99457:
            return 50;
        case CPT_CODE.CPT_99458:
            return 41;
        case CPT_CODE.CPT_99091:
            return 56;
        default:
            return 0;        
    }
}
export const CPT = "CPT";

export const isJsonString = (str) => {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}

Number.prototype.toFixedDown = function(digits) {
    var re = new RegExp("(\\d+\\.\\d{" + digits + "})(\\d)"),
        m = this.toString().match(re);
    return m ? parseFloat(m[1]) : this.valueOf();
};

export const takeDecimalNumber = (val, digits = 1) => {
    return val.toFixedDown(digits);
};
