const getters = {
    token: state => state.user.token,
    wxinfo: state => state.user.wxinfo,
    userinfo: state => state.user.userinfo,
    role: state => state.user.role,

    acceptedTasks: state=>state.missions.acceptedTasks,
    toBeAcceptedTasks: state=>state.missions.toBeAcceptedTasks,

    sentenceFinished: state=>state.missions.sentenceFinished,
    sentenceFinishedPage: state=>state.missions.sentenceFinishedPage,
    sentenceTaskCount: state=>state.missions.sentenceTaskCount,
    sentenceIsOver: state=>state.missions.sentenceIsOver,

    synonymFinished: state=>state.missions.synonymFinished,
    synonymFinishedPage: state=>state.missions.synonymFinishedPage,
    synonymTaskCount: state=>state.missions.synonymTaskCount,
    synonymIsOver: state=>state.missions.synonymIsOver,

    auditFinished: state=>state.missions.auditFinished,
    auditFinishedPage: state=>state.missions.auditFinishedPage,
    auditTaskCount: state=>state.missions.auditTaskCount,
    auditIsOver: state=>state.missions.auditIsOver,

    scoringFinished: state=>state.missions.scoringFinished,
    scoringFinishedPage: state=>state.missions.scoringFinishedPage,
    scoringTaskCount: state=>state.missions.scoringTaskCount,
    scoringIsOver: state=>state.missions.scoringIsOver,

    rewriteFinished: state=>state.missions.rewriteFinished,
    rewriteFinishedPage: state=>state.missions.rewriteFinishedPage,
    rewriteTaskCount: state=>state.missions.rewriteTaskCount,
    rewriteIsOver: state=>state.missions.rewriteIsOver,

};

export default getters;