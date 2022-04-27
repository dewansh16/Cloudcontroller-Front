const governmentIdentity = {
    passport: new RegExp("^[A-PR-WYa-pr-wy][1-9]\\d\\s?\\d{4}[1-9]$"),
    drivingLicense: new RegExp("^(([A-Z]{2}[0-9]{2})( )|([A-Z]{2}-[0-9]{2}))((19|20)[0-9][0-9])[0-9]{7}$"),
    drivingLicenseWithoutSpace: new RegExp("^(([A-Z]{2}[0-9]{2})|([A-Z]{2}-[0-9]{2}))((19|20)[0-9][0-9])[0-9]{7}$"),
    aadhar: new RegExp("^[2-9]{1}[0-9]{3}\\s[0-9]{4}\\s[0-9]{4}$"),
    aadharWithoutSpace: new RegExp("^[2-9]{1}[0-9]{3}[0-9]{4}[0-9]{4}$"),
    panCard: new RegExp("[A-Z]{5}[0-9]{4}[A-Z]{1}")
}
// FIXME: fix this reg
const phone = new RegExp("^[0-9]{10}$")

export { governmentIdentity, phone }