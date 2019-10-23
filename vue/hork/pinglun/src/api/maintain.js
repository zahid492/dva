// 维护任务
import service from "@/utils/request";
// 维护项目查询列表
export function getMaintains(data) {
    return service({
        url: 'maintaintasks/',
        method: "get",
        params: data
    })
}

// 占比状态字典
export function getProportionStatus() {
    return service({
        url: 'dictionaries/proportionstatus',
        method: "get",
    })
}

// 任务状态字典
export function getMaintainStatusDic() {
    return service({
        url: 'dictionaries/maintaintaskstatus',
        method: "get",
    })
}

// 集团字典
export function getCompanies() {
    return service({
        url: 'dictionaries/companies',
        method: "get",
    })
}

// 创建撰写维护任务
export function addWrite(data) {
    return service({
        url: 'maintaintasks/addwrite',
        method: "post",
        data,
    })
}

// 获取撰写维护任务
export function getWrite(id) {
    return service({
        url: `maintaintasks/${id}/write`,
        method: "get",
    })
}

// 创建发布维护任务
export function addPublishLike(data) {
    return service({
        url: 'maintaintasks/addpublishlike',
        method: "post",
        data,
    })
}

// 创建发布点赞维护任务
export function addPublish(data) {
    return service({
        url: 'maintaintasks/addpublish',
        method: "post",
        data,
    })
}

export function getPublish(id) {
    return service({
        url: `maintaintasks/${id}/publish`,
        method: "get",
    })
}
// 创建点赞任务
export function addLike(data) {
    return service({
        url: 'maintaintasks/addlike',
        method: "post",
        data,
    })
}


export function getLike(id) {
    return service({
        url: `maintaintasks/${id}/like`,
        method: "get",
    })
}
// 创建反向任务
export function addQuicklike(data) {
    return service({
        url: 'maintaintasks/addquicklike',
        method: "post",
        data,
    })
}

export function getQuicklike(id) {
    return service({
        url: `maintaintasks/${id}/quicklike`,
        method: "get",
    })
}

// 设置维护任务的重要状态
export function setStatus(data) {
    return service({
        url: 'maintaintasks/setstatus',
        method: "post",
        data,
    })
}

// 获取统计日报
export function getReport(data) {
    return service({
        url: `reports`,
        method: "get",
        params: data
    })
}

// 通知客户和供应商
export function informMsg(data) {
    return service({
        url: 'reports/informed',
        method: "post",
        data,
    })
}

// 导出统计报告的 excel
export function exportExcel(data) {
    return service({
        url: 'reports/export',
        method: "get",
        params:data,
    })
}

//获取 指定新闻下 已经撰写但是尚未发布的评论
export function getWriteComment(data) {
    return service({
        url: 'comment/getwritecommentwhatnonepublishbynewsid',
        method: "get",
        params: data
    })
}

// 客户端查询效果列表
export function getClientTasks(data) {
    return service({
        url: 'customermaintain/list',
        method: "get",
        params: data
    })
}

// 获取 指定项目下 指定新闻 的 指定任务类型 的所有评论
export function getProjectComments(data) {
    return service({
        url: 'comment',
        method: "get",
        params: data
    })
}

// 获取过个维护任务，根据ids，用于统计报告查看
export function getMoreReportTasks(data) {
    return service({
        url: 'maintaintasks/getmore',
        method: "get",
        params: data
    })
}

// 当反向，点赞，发布任务时，触发手动截图
export function handleScreenShot(data) {
    return service({
        url: 'queues/enqueuetaskscreenshot',
        method: "post",
        data,
    })
}
// 删除任务
export function deleteTask(data) {
    return service({
        url: 'maintaintasks/deletemore',
        method: "get",
        params:data,
    })
}
