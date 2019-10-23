import service from "@/utils/request";


// 项目列表
export function getProjects(opt) {
    return service({
        url: 'projects',
        method: "get",
        params: opt,
    })
}

// id 查项目
export function getProjectById(id) {
    return service({
        url: 'projects/' + id,
        method: "get",
    })
}
// 项目字典列表，用户管理用
export function getProjectsDic(data) {
    return service({
        url: 'dictionaries/projects',
        method: "get",
    })
}

// 添加项目
export function addProject(data) {
    return service({
        url: 'projects',
        method: "post",
        data,
    })
}

// 编辑项目
export function editProject(data) {
    return service({
        url: 'projects/' + data.id + '/update',
        method: "post",
        data,
    })
}

// 启用禁用项目
export function editProjectStatus(data) {
    return service({
        url: 'projects/' + data.id + '/updatestatus',
        method: "post",
        params: data,
    })
}

