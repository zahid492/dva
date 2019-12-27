
// home 图标及任务类型
export const missionType = {
    // status!==7
    sentence: 1,
    // status!==7
    synonym: 2,
    // status:7 审核任务是根据状态来区分
    audit: -2,
    // 评价任务无状态
    scoring: 6,
    // status!==7 改写任务
    rewrite: 7
};

// 我的任务列表路径id
export const pathId = {
    sentence: 1,
    synonym: 2,
    audit: -2,
    scoring: 6,
    rewrite: 7
};