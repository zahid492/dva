<template>
    <div class="login-wrap">
        <!-- <img src="../../assets/logo2.png" alt="" class="logo1"> -->
        <!-- <img src="../../assets/login_bg.jpg" alt="" class="login_bg"> -->
        <h1 class="login_title">修改密码</h1>
        <el-form
                
                class="password-form"
                label-position="left"
                auto-complete="on"
                label-width="80px">
            <!-- <h2>用户登录</h2> -->
            <el-form-item class="input-user">
                <el-input class="el-input" placeholder="请输入旧密码" type=""></el-input>
            </el-form-item>
            <el-form-item>
                <el-input placeholder="请输入新密码"
                         ></el-input>
            </el-form-item>
            <el-form-item>
                <el-button class="login-btn" type="primary">确认
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
        name: "ModifyPassword",
        data() {
         
            return {
                formData: {
                    oldPassword: "",
                    newPassword: ""
                },
                // loginRules: {
                //     oldPassword: [{required: true, trigger: "blur", validator: validateOldPassword}],
                //     newPassword: [{required: true, trigger: "blue", validator: validateNewPassword}]
                // },
                loading: false,
            };
        },
        mounted() {
            Message.closeAll();
        },
        methods: {
          
        }
    };
</script>

<style scope>
    .el-form-item__content {
        margin-left: 80px !important;
    }
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
