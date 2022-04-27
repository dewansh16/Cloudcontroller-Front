import React from 'react'
import './footer.Report.components.css'

const Footer = (props) => {
    // console.log(props.endDate);

    function to12HourFormat(dates) {
        var date = new Date(dates);
        var hours = date.getHours();
        var minutes = date.getMinutes();

        // Check whether AM or PM
        var newformat = hours >= 12 ? 'p.m' : 'a.m';

        // Find current hour in AM-PM Format
        hours = hours % 12;

        // To display "0" as "12"
        hours = hours ? hours : 12;
        minutes = minutes < 10 ? '0' + minutes : minutes;
        return (hours + ':' + minutes + ' ' + newformat)
    }

    const monthNames = [
        "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
    ];

    const toNormalDate = (date) => {
        const date1 = new Date(date);
        const date2 = `${date1.getDate()}  ${monthNames[date1.getMonth()]} ${date1.getFullYear()}`;
        return (date2);
    }

    return (
        <div className='footer-data'>
            <div className='footer-text'>
                <div className='footer-uppertext'>
                    <p>Electronically signed by <b>MB Hospital</b> at {toNormalDate(props.endDate)} {to12HourFormat(props.endDate)} , Report Generated on {toNormalDate(props.endDate)} {to12HourFormat(props.endDate)}</p>
                </div>
            </div>
            <div className='page-no'>
                <span>{props.pageNo === undefined ? 1 : props.pageNo + 1}</span>/{props.totalPages}
            </div>
        </div>
    )
}

export default Footer;