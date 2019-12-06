import moment from 'moment';

function formatDate(v) {
    if (v) {
        try {
            let d = moment(v);
            d.utcOffset(0);
            d.hour(0);
            d.minutes(0);
            d.seconds(0);
            d.millisecond(0);
            // d = d.zone(0).format();
            console.log(">>>>>> new date", d);
            return d;
        } catch (e) {
            console.log('date parsing error ', e);
        }
    }
    return v;
}

export default formatDate;