
import validator from 'validator';

// 验证范围整数
export function vInt(value, callback, msg, opt) {
    let max = Math.pow(10, 8);
    if(validator.isInt(value.toString(), {
        min: _.isPlainObject(opt)? Number(opt.min): 1,
        max: _.isPlainObject(opt)? (opt.max? Number(opt.max):max ): max,
    })){
        callback();
    }else{
        callback(new Error(msg));
    }
}