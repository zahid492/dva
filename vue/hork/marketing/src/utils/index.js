import fecha from 'fecha';
import {UserManager} from 'oidc-client';
// 日期转 unix
export function toDateTime(time){
    if(_.isNil(time)){
        return ""
    }
    let day = fecha.format(new Date(time), 'YYYY-MM-DD');
    let times = fecha.format(new Date(time), 'HH:mm:ss');
    return [day, times];
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
export function toDateTime1(time) {
    if (_.isNil(time)) {
        return ""
    }

    let day = moment.unix(time);
    let dt = moment(day).format('YYYY-MM-DD HH:mm:ss');

    return dt;
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

export const processSilentSignInCallback = () => {
    new UserManager().signinSilentCallback()
};