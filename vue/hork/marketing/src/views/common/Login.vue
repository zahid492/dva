<template>
    <div class="login-wrap">
        <!-- <img src="../../assets/logo2.png" alt="" class="logo1"> -->
        <img src="../../assets/login_bg.jpg" alt="" class="login_bg">
        <h1 class="login_title">任务分发管理后台系统</h1>
        <el-form
                ref="loginForm"
                :rules="loginRules"
                class="login-form"
                label-position="left"
                auto-complete="on"
                label-width="80px"
                :model="formData">
            <!-- <h2>用户登录</h2> -->
            <el-form-item class="input-user" prop="account">
                <el-input class="el-input" placeholder="用户名" v-model="formData.account"></el-input>
            </el-form-item>
            <el-form-item prop="password">
                <el-input placeholder="密码" @keyup.enter.native="handleLogin" v-model="formData.password"
                          type="password"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button :loading="loading" @click.native.prevent="handleLogin" class="login-btn" type="primary">登录
                </el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
    import {mapActions} from "vuex";
    import Vue from "vue";

    import {Form, FormItem, Input, InputNumber, Button, Message} from "element-ui";

    Vue.use(Form);
    Vue.use(FormItem);
    Vue.use(Input);
    Vue.use(InputNumber);
    Vue.use(Button);
    Vue.component(Message);

    export default {
        data() {
            const validateAccount = (rule, value, callback) => {
                if (value.trim().length <= 3 || value.trim().length > 20) {
                    callback(new Error("用户名至少3个字符，最多20个字符"))
                } else {
                    callback()
                }
            };

            const validatePassword = (rule, value, callback) => {
                if (value.length < 4) {
                    callback(new Error('密码不能小于4个字符'))
                } else {
                    callback()
                }
            };

            return {
                formData: {
                    account: "",
                    password: ""
                },
                loginRules: {
                    account: [{required: true, trigger: "blur", validator: validateAccount}],
                    password: [{required: true, trigger: "blue", validator: validatePassword}]
                },
                loading: false,
            };
        },
        mounted() {
            Message.closeAll();
        },
        methods: {
            handleLogin() {
                this.$refs.loginForm.validate(valid => {
                    if (valid) {
                        this.loading = true;
                        this.LoginByUsername(this.formData).then(
                            () => {
                                this.loading = false;
                                Message.success('登录成功！');
                                this.GetUserInfo().then(()=>{
                                    this.$router.push("/");
                                })

                            },
                            (err) => {
                                this.loading = false;
                                if(err.code===400 || err.code===401){
                                    Message.error(err)
                                }
                            }
                        );
                    }else{
                        Message.error('验证错误！');
                        return false;
                    }
                })

            },
            ...mapActions(["LoginByUsername", "GetUserInfo"])
        }
    };
</script>

<style scope>
    .login-wrap {
        background-color: rgb(221, 229, 248);
        height: 100vh;
        display: flex;
        justify-content: center;
        align-items: center;
        position: relative;
    }
    .login-form {
        width: 300px;
        padding: 20px;
        border-radius: 5px;
        background-color: rgb(221, 229, 248);
        text-align: left;
    }

    .login-form input {
        height: 50px;
        width: 300px;
        margin-top: 20px;
    }

    .input-user {
        margin-bottom: 10px;
    }

    .login-btn {
        width: 300px;
        /* margin-top: 10px; */
    }

    .login_title {
        position: absolute;
        top: 20%;
    }

    .logo1 {
        position: absolute;
        top: 14%;
    }

    .login_bg {
        width: 700px;
    }
</style>
