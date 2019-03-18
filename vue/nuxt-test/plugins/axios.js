
export default function (app) {
  let axios = app.$axios;
  // 基本配置
  axios.defaults.timeout = 10000;
  console.log("axios: ", app)
  // axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'

  // 请求回调
  axios.onRequest(config => {
    if(app.store.getters["user/token"]){
      config.headers["accessToken"] = app.store.getters["user/token"];
    }
    return config
    console.log("axios req: ", config)
  });

  // 返回回调
  axios.onResponse(res => {
    console.log("axios res: ", res)
  });

  // 错误回调
  axios.onError(error => {
    console.error("axios res: ", error)
  });
}
