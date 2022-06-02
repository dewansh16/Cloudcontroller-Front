export const CPT_CODE = {
    CPT_99453: 99453,
    CPT_99454: 99454,
    CPT_99457: 99457,
    CPT_99458: 99458,
    CPT_99091: 99091
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

export const takeDecimalNumber = (val, digits = 10) => {
    return Math.round(val * digits) / digits;
};