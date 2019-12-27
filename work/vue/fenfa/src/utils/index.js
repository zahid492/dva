// unix to 日期
export function toDay(time) {
    if (_.isNil(time)) {
        return ""
    }

    let day = moment.unix(time);
    let dt = moment(day).format('YYYY-MM-DD');

    return dt;
}

// unix to 日期
export function toDateTime(time) {
    if (_.isNil(time)) {
        return ""
    }

    let day = moment.unix(time);
    let dt = moment(day).format('YYYY-MM-DD HH:mm:ss');

    return dt;
}