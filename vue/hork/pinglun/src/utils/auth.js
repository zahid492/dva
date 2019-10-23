// 2019-08-04 废弃

// 模拟 token 获取从 localstorage/cookie 中，store 中获取到的 token 也保存在本地存储中
import store2 from 'store2';

let pluser = store2.get("pluser");

export function getToken() {
    return pluser !== null ? pluser.user.token : "";
}

export function removePluser() {
    return store2.remove("pluser");
}

export function getRole() {
    return pluser !== null ? store2.get("pluser").user.role : ""
}

export function getProject() {
    return pluser !== null ? store2.get("pluser").user.project : ""
}

export function getName(name) {
    return pluser !== null ? store2.get("name") : ""
}

export function setName(name) {
    return pluser !== null ? store2.set("name", name) : ""
}




