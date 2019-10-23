<template>
    <div>
        <el-row class="password">
            <!--<el-col :span="20" :offset="2">-->
                <!--<h1 class="title"> 修改密码 </h1>-->
            <!--</el-col>-->
            <el-col :span="7" :offset="8" class="password-form">
                <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
                    <el-form-item label="输入旧密码" prop="curpassword">
                        <el-input type="password" v-model="ruleForm.curpassword"></el-input>
                    </el-form-item>
                    <el-form-item label="密码" prop="newpassword">
                        <el-input type="password" v-model="ruleForm.newpassword" autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="确认密码" prop="repeatpassword">
                        <el-input type="password" v-model="ruleForm.repeatpassword" autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <!--<el-button size="medium" @click="resetForm('ruleForm')">-->
                            <!--<router-link to="/">取消</router-link>-->
                        <!--</el-button>-->
                        <el-button size="medium" type="primary" @click="submitForm('ruleForm')">确认</el-button>
                    </el-form-item>
                </el-form>
            </el-col>

        </el-row>
    </div>
</template>

<script>
    import md5 from 'md5';
    import Vue from 'vue';
    import {mapGetters} from 'vuex';
    import service from "@/service/request";
    import {
        Row,
        Col,
        Button,
        ButtonGroup,
        Form,
        FormItem,
        Input,
        InputNumber,

    } from 'element-ui';

    Vue.use(Row);
    Vue.use(Col);
    Vue.use(Button);
    Vue.use(ButtonGroup);
    Vue.use(Form);
    Vue.use(FormItem);
    Vue.use(Input);
    Vue.use(InputNumber);

    export default {
        data() {
            var validatePass = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请输入密码'));
                } else {
                    callback();
                }
            };

            var validatePass2 = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请输入确认密码'));
                } else if (value !== this.ruleForm.newpassword) {
                    callback(new Error('两次输入密码不一致!'));
                } else {
                    callback();
                }
            };

            return {
                ruleForm: {
                    username: "",
                    curpassword: '',
                    newpassword: '',
                    repeatpassword: ''
                },
                rules: {
                    curpassword: [
                        {required: true, message: "请输入密码", trigger: 'blur'}
                    ],
                    newpassword: [
                        {required: true, message: "请输入新密码", trigger: 'blur'},
                        {validator: validatePass, trigger: 'blur'}
                    ],
                    repeatpassword: [
                        {required: true, message: "请输入确认密码", trigger: 'blur'},
                        {validator: validatePass2, trigger: 'blur'}
                    ],
                }
            };
        },
        computed: {
            ...mapGetters(["oidcUser"])
        },
        mounted() {
            this.ruleForm.username = this.oidcUser.sub
        },
        methods: {
            submitForm(formName) {
                this.$refs[formName].validate(async (valid) => {
                    if (valid) {
                        try {
                            await service({
                                url: "users/updatepassword",
                                method: "post",
                                data: {
                                    "username": this.ruleForm.username,
                                    "curpassword": md5(this.ruleForm.curpassword),
                                    "newpassword": md5(this.ruleForm.newpassword)
                                }
                            });

                            this.ruleForm = {
                                curpassword:"",
                                newpassword:""
                            };

                            this.$message.success("修改密码成功");
                            // this.$router.push("/")
                        } catch (e) {
                            console.error("内部错误")
                        }
                    } else {
                        console.log('修改密码失败，请刷新重试!!');
                        return false;
                    }
                });
            },
            resetForm(formName) {
                this.$refs[formName].resetFields();
            },
        }
    }
</script>

<style lang="scss">
    .password {
        text-align: left;

        .title {
            width: 100%;
            height: 100px;
            line-height: 100px;
            font-size: 30px;
            border-bottom: 1px solid #ccc;
        }

        .password-form {
            margin-top: 80px;
        }
    }

</style>