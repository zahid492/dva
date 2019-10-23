import service from "@/utils/request";


// 供应商列表
export function getSuppliers(opt) {

    return service({
        url: 'suppliers',
        method: "get",
        params: opt,
    })
}
// 供应商类型字典列表
export function getSuppliersDic() {

    return service({
        url: 'dictionaries/suppliers',
        method: "get",
    })
}

// 添加供应商
export function addSupplier(data) {
    return service({
        url: 'suppliers',
        method: "post",
        data,
    })
}

// 编辑供应商
export function editSupplier(data) {
    return service({
        url: 'suppliers/' + data.id + '/update',
        method: "post",
        data,
    })
}

// 启用禁用供应商
export function editSupplierStatus(data) {
    return service({
        url: 'suppliers/' + data.id + '/updatestatus',
        method: "post",
        params: data,
    })
}

// 根据id 查
export function getSupplierOne(id) {

    return service({
        url: `suppliers/${id}`,
        method: "get",
    })
}

