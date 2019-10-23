<template>
    <div class="login-wrap">
        <div class="pl-login">
            <div class="w">
                <div class="pl-login-img">
                    <img src="@/assets/pl-login.png" alt="">
                </div>
                <div class="pl-login-img">
                    <!-- <img src="../../assets/logo.png" alt="" class="pl-logo"> -->
                    <div class="pl-logo-from">
                        <div class="pl-from-top">
                            <div class="title">
                                <img src="@/assets/logo.png" alt="" class="logo">
                                <p class="logo-title">评论维护平台</p>
                            </div>
                        </div>
                        <div class="pl-from-box">
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
                                    <el-input placeholder="密码" @keyup.enter.native="handleLogin"
                                              v-model="formData.password"
                                              type="password"></el-input>
                                </el-form-item>
                                <!--<p class="forget" @click="dialogVisible = true">重置密码</p>-->
                                <el-form-item>
                                    <el-button :loading="loading" @click.native.prevent="handleLogin" class="login-btn"
                                               type="primary">登录
                                    </el-button>
                                </el-form-item>
                            </el-form>
                        </div>

                    </div>
                </div>
            </div>

            <el-dialog
                    title="提示"
                    :visible.sync="dialogVisible"
                    width="30%"
            >
                <span>是否重置密码变更为手机号？</span>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="dialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="resetPassword">确 定</el-button>
                </div>
            </el-dialog>
        </div>
    </div>
</template>

<script>
    import {mapActions} from "vuex";
    import Vue from "vue";
    import md5 from 'md5';

    import {Form, FormItem, Input, InputNumber, Button, Message, Dialog} from "element-ui";

    Vue.use(Form);
    Vue.use(FormItem);
    Vue.use(Input);
    Vue.use(InputNumber);
    Vue.use(Button);
    Vue.component(Message);
    Vue.component(Dialog);

    export default {
        data() {
            const validateAccount = (rule, value, callback) => {
                if (value.trim().length < 3 || value.trim().length > 20) {
                    callback(new Error("用户名至少3个字符，最多20个字符"))
                } else {
                    callback()
                }
            };

            const validatePassword = (rule, value, callback) => {
                if (value.length < 3) {
                    callback(new Error('密码不能小于3个字符'))
                } else {
                    callback()
                }
            };

            return {
                dialogVisible: false,
                formData: {
                    account: "",
                    password: ""
                },
                loginRules: {
                    account: [{required: true, trigger: "blur", validator: validateAccount}],
                    password: [{required: true, trigger: "blue", validator: validatePassword}]
                },
                loading: false,
                centerDialogVisible: false
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

                        this.LoginByUsername({
                            account: this.formData.account,
                            password: md5(this.formData.password)
                        }).then(
                            (res) => {
                                this.loading = false;
                                Message.success('登录成功！');

                                let role = res.rolename;

                                if (role === "维护员") {
                                    this.$router.push("/")
                                }

                                if (role === "供应商执行员") {
                                    this.$router.push("/sub/distributor")
                                }

                                if (role === "客户") {
                                    this.$router.push("/sub/client")
                                }

                                if (role === "超级管理员") {
                                    this.$router.push("/")
                                }

                            },
                            (err) => {
                                this.loading = false;
                                if (err.code === 400 || err.code === 401) {
                                    Message.error(err);
                                    this.LoginOut().then(()=>{
                                        this.$router.push("/login")
                                    }).catch(()=>{
                                        this.$router.push("/login")
                                    });
                                }
                            }
                        );
                    } else {
                        Message.error('验证错误！');
                        return false;
                    }
                })
            },

            // 重置操作
            reset() {
                this.dialogVisible = true;
            },

            resetPassword() {
                this.ResetPass().then(() => {
                    this.dialogVisible = false;
                    Message.success('重置成功！');
                }).catch(() => {
                    this.dialogVisible = false;
                    Message.info('重置失败！');
                })
            },
            ...mapActions(["LoginByUsername", "ResetPass", "LoginOut"])
        }
    };
</script>

<style lang="scss">

    .login-wrap {
        background-color: #e8f2fc;
        height: 100vh;
        display: flex;
        justify-content: center;
        align-items: center;
        position: relative;

        .el-form-item__content {
            margin-left: 0 !important;
        }

        .el-dialog__title, .el-dialog__headerbtn .el-dialog__close {
            color: #fff !important;
            opacity: 0.9;
        }

        .el-dialog {
            width: 430px !important;
            border-radius: 4px !important;
            overflow: hidden;
        }

        .el-dialog__body {
            p {
                text-align: center;
            }
        }

        .el-dialog__header {
            background: linear-gradient(90deg, rgba(0, 129, 255, 1) 0%, rgba(50, 101, 249, 1) 100%);
        }
    }

    .forget {
        width: 298px;
        text-align: right;
        height: 30px;
        line-height: 30px;
        font-size: 12px;
        font-weight: 400;
        cursor: pointer;
        color: rgba(1, 121, 255, 1);
    }

</style>

<style lang="scss" scope>


    .login-form {
        width: 300px;
        padding: 20px;
        border-radius: 5px;
        text-align: left;
    }

    .login-form input {
        height: 50px;
        width: 298px;
        margin-top: 20px;
    }

    .input-user {
        margin-bottom: 10px;
    }

    .login-btn {
        width: 300px;
        text-align: center;
        width: 100%;
        height: 48px;
        color: #fff;
        font-size: 18px;
        font-weight: 400;
        background: linear-gradient(90deg, rgba(0, 129, 255, 1) 0%, rgba(50, 101, 249, 1) 100%);
        border-radius: 4px;
        margin-top: 20px;
    }

    .login_title {
        position: absolute;
        top: 20%;
    }

    .logo1 {
        position: absolute;
        top: 14%;
    }

    .pl-login .w {
        width: 1200px;
        height: 550px;
        position: absolute;
        top: 50%;
        left: 50%;
        margin-top: -275px;
        margin-left: -600px;

    }

    .pl-login-img {
        width: 50%;
        height: 100%;
        float: left;
        text-align: center;
        padding: 30px;
        // border-bottom: 1px solid rgba(128,128,128,0.2);
    }

    .pl-login-img:first-child img {
        width: 100%;
        margin-top: 30px;
    }

    .pl-logo {
        width: 116px;
        margin-bottom: 20px;
    }

    .pl-login-img:first-child .text {
        font-size: 36px;
        color: #5F6978;
        font-weight: 400;
        opacity: 0.6;
    }

    .pl-logo-from {
        width: 80%;
        margin: 50px 0 0 30px;
        background: #fff;
        border-radius: 6px;
        overflow: hidden;
        text-align: left;
        border: 1px solid #3265f9;
    }

    .pl-from-top {
        width: 100%;
        height: 80px;
        line-height: 80px;
        text-align: center;
        background: linear-gradient(90deg, rgba(0, 129, 255, 1) 0%, rgba(50, 101, 249, 1) 100%);
        font-size: 20px;
        font-weight: 400;
        color: #fff;

        .logo {
            height: 45px;
            width: 66px;
            float: left;
            margin: 18px 0 0 80px;
        }

        .logo-title {
            font-size: 28px;
            font-weight: normal;
            color: rgba(255, 255, 255, 1);
            float: left;
            margin: 0 0 0 22px;
        }
    }

    .pl-logo-from .input {
        width: 100%;
        height: 48px;
        margin: 20px 0;
        border: 1px solid #DDDDDD;
        border-radius: 4px;
        padding: 0 20px;
    }

    .pl-from-box {
        width: 100%;
        padding: 0 10%;
    }

</style>

<style>

</style>
