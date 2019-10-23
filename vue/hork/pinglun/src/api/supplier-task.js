import service from "@/utils/request";


//供应商任务列表
export function getSupTasks(opt) {

    return service({
        url: 'suppliertasks',
        method: "get",
        params: opt,
    })
}

// 更新供应商任务状态
export function updateSupTaskStatus(data) {
    return service({
        url: 'maintaintasks/' + data.id + '/updatestatus',
        method: "post",
        params: data,
    })
}

// 上传截图
export function addScreenShot(id) {
    return service({
        url: 'maintaintasks/' + id + "/screenshot/upload",
        method: "post"
    })
}

// 删除截图
export function delScreenShot(opt) {
    return service({
        url: 'maintaintasks/' + opt.taskid + "/screenshot/"+ opt.id +"/delete",
        method: "post"
    })
}

// 添加撰写任务内容
export function addSupTask(data) {
    return service({
        url: 'maintaintasks/'+ data.taskid +'/comments/',
        method: "post",
        data,
    })
}

// 更新撰写任务内容
export function updateSupTask(data) {
    return service({
        url: 'maintaintasks/'+ data.taskid +'/comments/' + data.id + '/update',
        method: "post",
        data,
    })
}

// 删除撰写任务内容
export function deleteSupTask(data) {
    return service({
        url: 'maintaintasks/'+ data.taskid +'/comments/' + data.id + '/delete',
        method: "post",
        data,
    })
}

// 查询供应商QQ消息
export function getSupQQMsg(opt) {

    return service({
        url: 'suppliertasks/' + opt.taskId + '/message',
        method: "get",

    })
}


