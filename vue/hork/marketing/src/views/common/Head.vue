<template>

    <el-row class="top-bar">
        <el-col :span="20" style="height: 30px;">
            <!--<img src="../../assets/mia-2-logo.png" alt="" class="logo">-->
            <h2 class="title">任务分发管理系统</h2>
        </el-col>
        <el-col :span="4">

            <el-dropdown
                    @command="handleCommand"
            >
                    <span class="el-dropdown-link user-msg grid-content"
                          style="white-space: nowrap;">
                            {{oidcUser && oidcUser.name}}
                        <i class="el-icon-arrow-down el-icon--right"></i>
                    </span>
                <el-dropdown-menu slot="dropdown">
                    <!--<el-dropdown-item><router-link to="/mpassword">修改密码</router-link></el-dropdown-item>-->
                    <el-dropdown-item command="loginOut">退出登录</el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>

        </el-col>
    </el-row>

</template>
<script>
    import Vue from "vue";
    import {mapGetters, mapActions} from "vuex";
    import store from "@/store/index";

    import {
        Row,
        Col,
        Dialog,
        Dropdown,
        DropdownMenu,
        DropdownItem,
        Button,
        Form,
        FormItem
    } from "element-ui";

    Vue.use(Row);
    Vue.use(Col);
    Vue.use(Dialog);
    Vue.use(Button);
    Vue.use(Form);
    Vue.use(FormItem);

    Vue.use(Dropdown);
    Vue.use(DropdownMenu);
    Vue.use(DropdownItem);


    export default {

        name: "Head",
        computed: {
            ...mapGetters(["oidcUser"])
        },
        methods: {
            handleCommand(cmd) {
                if (cmd === "loginOut") {
                    store.dispatch("signOutOidc");
                }

            },

            // editPassword() {
            //     var url = "/UserInfo/UpdatePassword?newPassword=" + this.form.newPassword;
            //     var data = this.form;
            //     var _self = this;
            //     service.post(url).catch(function (err, a, b, c) {
            //         _self.$alert(err.response.data, "出错啦", {
            //             confirmButtonText: "确定"
            //         });
            //     });
            // },
            // ...mapActions(["LoginOut"])
        },

        mounted() {

        }
    };
</script>
<style scoped>

    .top-bar {
        padding: 10px 0;
        background: rgb(167, 190, 209);
    }

    .user-msg {
        display: block;
        white-space: nowrap;
        width: 50px;
        height: 50px;
        border-radius: 25px;
        /* background: pink; */
        text-align: center;
        line-height: 50px;
        overflow: hidden;
        cursor: pointer;
    }

    .logo {
        height: 40px;
        margin-left: 5%;
    }
</style>
