<template>
    <div class="login-wrap">
        <!-- <img src="../../assets/logo2.png" alt="" class="logo1"> -->
        <!-- <img src="../../assets/login_bg.jpg" alt="" class="login_bg"> -->
        <h1 class="login_title">修改密码</h1>
        <el-form
                :model="formData"
                ref="loginForm"
                :rules="loginRules"
                class="password-form"
                label-position="left"
                auto-complete="on"
                label-width="80px">
            <el-form-item class="input-user" prop="oldPassword">
                <el-input class="el-input" placeholder="请输入旧密码"  v-model="formData.oldPassword"></el-input>
            </el-form-item>
            <el-form-item prop="newPassword">
                <el-input placeholder="请输入新密码" v-model="formData.newPassword"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button class="login-btn" type="primary" @click.native.prevent="updatePassword">确认</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>

    import {mapActions} from "vuex";
    import Vue from "vue";
    import md5 from 'md5';

    import {Form, FormItem, Input, InputNumber, Button, Message} from "element-ui";

    Vue.use(Form);
    Vue.use(FormItem);
    Vue.use(Input);
    Vue.use(InputNumber);
    Vue.use(Button);
    Vue.component(Message);

    export default {
        name: "ModifyPassword",
        data() {

            const validateOldPassword = (rule, value, callback) => {
                if (value.length < 4) {
                    callback(new Error('密码不能小于4个字符'))
                } else {
                    callback()
                }
            };

            const validateNewPassword = (rule, value, callback) => {
                if (value.length < 4) {
                    callback(new Error('密码不能小于4个字符'))
                } else {
                    callback()
                }
            };

            return {
                formData: {
                    oldPassword: "",
                    newPassword: ""
                },
                loginRules: {
                    oldPassword: [{required: true, trigger: "blur", validator: validateOldPassword}],
                    newPassword: [{required: true, trigger: "blue", validator: validateNewPassword}]
                },
                loading: false,
            };
        },
        mounted() {
            Message.closeAll();
        },
        methods: {
            updatePassword() {
                this.$refs.loginForm.validate(valid => {
                    if (valid) {
                        this.loading = true;

                        this.UpdatePass({
                            oldpasswordmd5:md5(this.formData.oldPassword),
                            newpassword: md5(this.formData.newPassword)
                        }).then(
                            () => {
                                this.loading = false;
                                Message.success('修改成功！');
                                this.$router.push("/login");
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
            ...mapActions(["UpdatePass"])
        }
    };
</script>

    <!--重复和登录页-->
<style lang="scss" scope>
    .login-wrap {
        background-color: rgb(221, 229, 248);
        height: 100vh;
        display: flex;
        justify-content: center;
        align-items: center;
        position: relative;
    }
    .password-form {
        width: 460px;
        padding: 20px;
        border-radius: 5px;
        background-color: rgb(221, 229, 248);
        text-align: left;
        box-sizing: border-box;
    }

    .password-form input {
        height: 50px;
        margin-top: 20px;
    }

    .input-user {
        margin-bottom: 10px;
    }

    .login-btn {
        width: 100%;
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
