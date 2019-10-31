const _ = window._;

export const account_list_sel = (state) => {
    if (!_.isEmpty(state.MediaAccount)) {
        return {
            data: state.MediaAccount.account_list_obj.data,
            count: state.MediaAccount.account_list_obj.count
        };
    } else {
        return {
            data: [],
            count: 0
        }
    }
};

export const platform_list_sel = (state) => {
    if (!_.isEmpty(state.MediaAccount)) {
        return state.MediaAccount.platform_list
    }else{
        return []
    }
};

export const publish_type_sel = (state) => {
    if (!_.isEmpty(state.MediaAccount)) {
        return state.MediaAccount.publish_type_list;
    }else{
        return []
    }
};
