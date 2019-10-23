const getters = {
    // token: state => state.user.token,
    // account: state => state.user.account,
    // name: state => state.user.name,
    // roleName: state => state.user.roleName,
    // statusName: state => state.user.statusName,
    // user: state => state.user,

    accounts: state => state.accounts.list,
    accountPage: state => state.accounts.page,
    accountCount: state => state.accounts.count,
    roles: state => state.accounts.roles,
    missions: state=> state.missions.list,
    missionCount: state=>state.missions.count,
    missionPage: state=>state.missions.page,
    missionTaskStatusObj: state=>state.missions.taskStatusObj,
    writers: state=>state.missions.writers,
    writersObj: state=>state.missions.writersObj,
};

export default getters;