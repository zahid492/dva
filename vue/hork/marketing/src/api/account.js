import service from "@/utils/request";


// 权限列表
export function roles(){
    return service({
        url: 'Dictionary/Roles',
        method:"get",
    })
}

// 写手列表
export function writers(){
    return service({
        url: 'Dictionary/WritersAccount',
        method:"get"
    })
}

// 新增用户
export function addAccount(data){
    return service({
        url: 'User/Add',
        method:"post",
        data,
    })
}

// 编辑用户
export function editAccount(data){
    return service({
        url: 'User/Update',
        method:"post",
        data,
    })
}

// 单个用户信息，编辑时候用
export function getAccount(data){
    return service({
        url: 'User/GetOne/'+ data.id,
        method:"get",
    })
}

// 用户列表
export function getAccounts(page, size){
    let data = {
        Page:page,
        Size:size
    };

    return service({
        url: 'User/Get',
        method:"post",
        data,
    })
}

// 重置密码
export function resetPass(id){

    return service({
        url: 'User/ResetPassword/' + id,
        method:"get",
    })
}

// 修改密码
export function UpdatePass(data){
    return service({
        url: 'User/UpdatePassword/'+ data.id,
        method:"post",
        data:{
            oldPassword: data.oldPassword,
            newPassword: data.newPassword
        }
    })
}
