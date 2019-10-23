import service from "@/utils/request";


// 权限列表，管理员创建用户时候用
export function roles() {
    return service({
        url: 'roles/get',
        method: "post",
        data:{
            page:1,
            size:1000
        }
    })
}

// 权限字典，管理员创建用户时候用
export function rolesDic() {
    return service({
        url: 'dictionaries/roles',
        method: "get",
    })
}

// 单个某人权限
export function oneRoles(id) {
    return service({
        url: 'roles/getone/' + id,
        method: "get"
    })
}

// 修改某人权限
export function updateRoles(data) {
    return service({
        url: 'roles/update/',
        method: "post",
        data
    })
}

// 新增用户
export function addAccount(data) {
    return service({
        url: 'users',
        method: "post",
        data,
    })
}

// 编辑用户
export function editAccount(data) {
    return service({
        url: 'users/' + data.id,
        method: "post",
        data,
    })
}

// 单个用户启用禁用
export function disbaleAccount(data) {
    return service({
        url: 'users/' + data.id + "/enableordisable",
        method: "post",
        data:data
    })
}

// 单个用户信息，编辑时候用
export function  getAccount(id) {
    return service({
        url: 'users/' + id,
        method: "get",
    })
}

// 用户列表
export function getAccounts(opt) {

    return service({
        url: 'users',
        method: "get",
        params: opt,
    })
}