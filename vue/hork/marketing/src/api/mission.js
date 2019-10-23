import service from "@/utils/request";

// 任务列表
export function missionList(d){
    let data = {
        "field": d.field,
        "order": d.order,
        "taskStatus": d.taskStatus|| 0,
        "submitStartTimeStamp": d.submitStartTimeStamp,
        "submitEndTimeStamp": d.submitEndTimeStamp,
        "keyWord": d.keyWord,
        "page": d.page,
        "size": d.size
    };

    return service({
        url: 'DistributionTask/Get',
        method:"post",
        data,
    })
}

// 查看拒稿原因
export function refuseMsg(d){
    return service({
        url: 'DistributionTask/GetRefuseMsg',
        method:"get",
        params: {
            tId: d
        },
    })
}

// 分配写手
export function disWriter(d){

    return service({
        url: 'DistributionTask/DistributionWriter?tId=' + d.tId + "&writerId=" + d.writerId,
        method:"post",
    })
}

// 关闭任务
export function closeMission(d){

    return service({
        url: 'DistributionTask/CloseTask/' + "?tId=" + d,
        method:"post",

    })
}

// 任务状态字典
export function getTaskStatusObj(d){

    return service({
        url: 'Dictionary/TaskStatus',
        method:"get",
    })
}
 

// 获取详情
export function taskGroup(d){

    return service({
        url: 'TaskGroup/' + d.id,
        method:"get",
        params: d,
    })
}
