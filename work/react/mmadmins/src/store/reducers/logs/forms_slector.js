const moment = window.moment;
const _ = window._;

export const log_status_sel = (state) => state.logs.log_status_list;
export const log_source_sel = (state) => state.logs.log_source_list;
export const log_type_sel = (state) => state.logs.log_type_list;

// 获取后的数据，格式字段变更操作
export const log_list_sel = (state) => {
    const {log_status_list, log_source_list, log_type_list, log_list_obj} = state.logs;

    if (log_source_list.length > 0
        && log_status_list.length > 0
        && log_type_list.length > 0
        && !_.isEmpty(log_list_obj)
        ) {
        let ret = log_list_obj.data.map((v) => {
            v.statusName = _.find(log_status_list, {key: v.status.toString()}).value || "";
            v.sourceName = _.find(log_source_list, {key: v.source.toString()}).value || "";
            let ltp = _.find(log_type_list, {key: v.logType.toString()});
            v.typeName = ltp ? ltp.value : "";
            v.logDtFormated = moment(v.logDt).format("YYYY-MM-DD HH:mm:ss");
            return v;
        });

        return {
            data: ret,
            count: log_list_obj.count
        };

    } else {
        return {
            data: [],
            count: 0
        };
    }
};
