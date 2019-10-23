const getters = {
    user: state => state.omgr.user || {},
    authorization: state => state.omgr.access_token || "",
    name: state => (state.omgr.user && state.omgr.user.name) || "",
    id: state => (state.omgr.user && state.omgr.user.sid) || "",
    userRole: state => (state.omgr.user && state.omgr.user.role) || "",

    token: state => state.user.token || "",
    userProject: state => state.user.project,

    isSuper: (state) => {
        if (state.omgr.user) {
            return state.omgr.user.role === "超级管理员" || _.includes(state.omgr.user.role, "超级管理员");
        }

        return false;
    },

    isM: (state) => {
        if (state.omgr.user) {
            return state.omgr.user.role === "维护员" || _.includes(state.omgr.user.role, "维护员");
        }

        return false;
    },

    isD: (state) => {
        if (state.omgr.user) {
            return state.omgr.user.role === "供应商执行员" || _.includes(state.omgr.user.role, "供应商执行员");
        }

        return false;
    },

    isC: (state) => {
        if (state.omgr.user) {
            return state.omgr.user.role === "客户" || _.includes(state.omgr.user.role, "客户");
        }

        return false;
    },

    searchForm: state => state.maintains.searchForm,
    clientSearchForm: state => state.maintains.searchClientForm,
    supplierSearchForm: state => state.suptasks.searchSupplierForm,
    userMap: state => {
        return {
            mat: "维护员",
            sup: "供应商执行员",
            client: "客户",
            report: "报告"
        }
    }
};

export default getters;