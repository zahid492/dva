import validator from "validator";


// str 分隔; 转数组
export function trimSplitSpace(str) {
    let rstr = _.replace(str, /[\n\s]/, "");

    if (rstr.length > 0) {
        return _.filter(rstr.split(config.txtSeparator), (v) => v != "");
    }

    return [];
}

export function isUrl(str) {
    if (validator.isURL(strl)) {
        return true;
    }
    return false;
}

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

// unix to 日期
export function toShortDay(time) {
    if (_.isNil(time)) {
        return ""
    }

    let day = moment.unix(time);
    let dt = moment(day).format('MM-DD');

    return dt;
}

// unix to 日期
export function toShortDayTime(time) {
    if (_.isNil(time)) {
        return ""
    }

    let day = moment.unix(time);
    let dt = moment(day).format('MM-DD  HH:mm');

    return dt;
}

// 分钟数转 月日小时
export function mm2time(mm) {
// 分钟转 天 小时 分钟 数
    let hourcount = 60;
    let daycount = hourcount * 24;
    let monthcount = daycount * 30;

    let zhen = _.isInteger(mm / 60);

    if (mm == 0) {
        return "0分钟"
    }
    let lastMonth = _.floor(mm / monthcount);
    let lastDay = _.floor((mm % monthcount) / daycount);

    if (mm > monthcount) {
        if (lastMonth > 0) {
            if (lastDay > 0) {
                return lastMonth + "个月" + lastDay + "天"
            }
            return _.floor(mm / monthcount) + "个月"
        } else {
            return lastDay + "天"
        }
    }

    if (mm > daycount) {
        let lDay = _.floor(mm / daycount);
        let lHour = _.floor((mm % daycount) / hourcount);
        if (lDay > 0) {
            if (lHour > 0) {
                return lDay + "天" + lHour + "小时"
            }
            return lDay + "天";
        } else {
            return lHour + "小时"
        }
    }


    let lastMin = mm % hourcount;
    let lHou = _.floor(mm / hourcount);
    if (lHou > 0) {
        if (lastMin > 0) {
            return lHou + "小时" + lastMin + "分钟"
        }
        return lHou + "小时"
    } else {
        return lastMin + "分钟"
    }
}

// 汉字单位
export function num2wan(mm) {
    let wan = 100 * 100;
    let yi = wan * wan;

    if (mm > yi) {
        return _.floor(mm / yi) + "亿" + _.floor((mm % yi) / wan) + "万";
    }

    if (mm > wan) {
        return _.floor(mm / wan) + "万"
    }

    return mm;
}

// 移除收尾空格和换行
export function trimSN(txt){
    return _.trim(_.trim(txt, "\n"))
}


export const parseJwt = (token) => {
    try {
        let base64Url = token.split('.')[1];
        let base64 = base64Url.replace('-', '+').replace('_', '/');
        return JSON.parse(window.atob(base64));
    } catch (error) {
        return {}
    }
};