// 模拟 token 获取从 localstorage/cookie 中，store 中获取到的 token 也保存在本地存储中
import store2 from 'store2';

// 记住密码
const repass = store2.session("rempass");

export function getToken() {
    if(repass){
        return store2.get("token")
    }else{
        return store2.session("token");
    }

}

export function setToken(token) {
    if(repass){
        return store2.set("token", token);
    }else{
        return store2.session("token", token);
    }
}

export function removeToken() {
    if(repass){
        return store2.remove("token");
    }else{
        return store2.session.remove("token");
    }
}

export function getName() {
    if(repass){
        return store2.get("name")
    }else{
        return store2.session("name");
    }
}

export function setName(name) {
    if(repass){
        return store2.set("name", name);
    }else{
        return store2.session("name", name);
    }
}

export function getRole() {
    if(repass){
        return store2.get("role")
    }else{
        return store2.session("role");
    }
}

export function setRole(role) {
    if(repass){
        return store2.set("role", role);
    }else{
        return store2.session("role", role);
    }
}

export function getId() {
    if(repass){
        return store2.get("id")
    }else{
        return store2.session("id");
    }
}

export function setId(id) {
    if(repass){
        return store2.set("id", id);
    }else{
        return store2.session("id", id);
    }
}

export function getAccount() {
    if(repass){
        return store2.get("account")
    }else{
        return store2.session("account");
    }
}

export function setAccount(account) {
    if(repass){
        return store2.set("account", account);
    }else{
        return store2.session("account", account);
    }
}


