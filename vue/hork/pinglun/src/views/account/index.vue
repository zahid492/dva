<template>
    <div class="user_box">
        <div class="user-manage">
            <el-row>
                <el-col :span="24">
                    <div class="task-top">
                        <p class="title">用户管理</p>

                        <!--<el-button class="search add_btn"-->
                                   <!--type="primary"-->
                                   <!--v-if="isSuper"-->
                                   <!--@click="editAccount(0, null)">-->
                            <!--<span class="icon-fabu2 iconfont"></span>创建-->
                        <!--</el-button>-->


                        <search
                                placeholder="全表关键字模糊搜索"
                                :search-txt.sync="key"
                                @keysearch="getAccounts(1)"
                        ></search>

                    </div>
                </el-col>
            </el-row>
            <!-- 创建 -->
            <el-dialog
                    :title="accountDialogTitle"
                    :visible.sync="centerDialogVisible"
                    width="30%"
                    @close="closeAddDialog"
                    center>
                <div class="add_card">
                    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="80px" class="demo-ruleForm">
                        <el-form-item label="用户名" prop="name">
                            <!-- account -> name 20190808 -->
                            <el-input v-model="ruleForm.name" :disabled="accountDialogAct===1"></el-input>
                        </el-form-item>
                        <!--<el-form-item label="密码" prop="password" v-if="accountDialogAct!=1 || isSuper">-->
                            <!--<el-input v-model="ruleForm.passwordpassword" type="password"></el-input>-->
                        <!--</el-form-item>-->
                        <el-form-item label="手机号" prop="phonenumber">
                            <el-input v-model="ruleForm.phonenumber"
                                      disabled
                            ></el-input>
                        </el-form-item>
                        <el-form-item label="角色" prop="roleid">
                            <el-select v-model="ruleForm.roleid"
                                       disabled
                                       @change="changeRole"
                                       placeholder="请选择角色">
                                <el-option v-for="r in roles"
                                           :key="r.key"
                                           :label="r.value"
                                           :value="r.key"></el-option>
                            </el-select>
                        </el-form-item>

                        <!---->
                        <el-form-item
                                label="QQ号"
                                prop="wechatname"
                                v-if="ruleForm.rolename=='维护员'"
                        >
                            <el-input type="number" v-model="ruleForm.wechatname"></el-input>
                        </el-form-item>
                        <!--:required="ruleForm.rolename=='供应商执行员'"-->
                        <!--:show-message="false"-->
                        <el-form-item
                                label="供应商"
                                key="供应商"
                                v-if="ruleForm.rolename=='供应商执行员'"
                                prop="supplierid"
                        >
                            <el-select
                                    v-model="ruleForm.supplierid"
                                    placeholder="供应商">
                                <el-option
                                        v-for="item in supplierDic"
                                        :key="item.key"
                                        :label="item.value"
                                        :value="item.key">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <!--:required="ruleForm.rolename!=='供应商执行员'"-->
                        <el-form-item
                                key="负责项目"
                                label="负责项目"
                                prop="projectids"
                                v-if="ruleForm.rolename!=='供应商执行员'">
                            <el-select
                                    multiple
                                    v-model="ruleForm.projectids"
                                    placeholder="负责项目">
                                <el-option
                                        v-for="item in projects"
                                        :key="item.key"
                                        :label="item.value"
                                        :value="item.key">
                                </el-option>
                            </el-select>

                        </el-form-item>

                        <el-form-item>
                            <el-button class="affirm-btn" type="primary" v-if="accountDialogAct" @click="changeAccount"
                                       act="1">确定
                            </el-button>
                            <el-button class="affirm-btn" type="primary" v-else @click="addAccount" act="0">确定
                            </el-button>
                            <el-button class="quxiao-btn" @click="resetForm('ruleForm')">取消</el-button>
                        </el-form-item>
                    </el-form>
                </div>
            </el-dialog>
            <!-- 列表-->
            <div class="table-box" >
                <el-table
                        :data="accountsData"
                        style="width: 90%"
                        class="user-table">
                    <el-table-column prop="id" label="" width="70"></el-table-column>
                    <el-table-column prop="name" label="用户名"></el-table-column>
                    <el-table-column prop="phonenumber" label="手机号"></el-table-column>
                    <el-table-column prop="rolename" label="角色"></el-table-column>
                    <el-table-column prop="createdt" label="创建日期"></el-table-column>
                    <el-table-column prop="modifydatetime" label="修改时间"></el-table-column>
                    <el-table-column prop="modifyusername" label="操作者"></el-table-column>
                    <el-table-column label="操作" width="200" v-if="isSuper">
                        <template slot-scope="scope">
                            <div class="edit-btn" @click="editAccount(1, scope.row)">修改</div>
                            <!--<div class="disabled-btn" @click="disableAccount(scope.row)">-->
                                <!--{{scope.row.enabled==1?"禁用":"启用"}}-->
                            <!--</div>-->

                        </template>

                    </el-table-column>
                </el-table>
            </div>

            <!-- 分页 -->
            <el-row>
                <el-col :span="24">
                    <div class="pagination-box">
                        <div class="block">
                            <el-pagination
                                    background
                                    @size-change="()=>getAccounts()"
                                    @current-change="()=>getAccounts()"
                                    :current-page.sync="page"
                                    :page-sizes="[10, 15, 20]"
                                    :page-size.sync="size"
                                    layout="sizes, prev, pager, next"
                                    :total="count">
                            </el-pagination>
                        </div>
                    </div>
                </el-col>
            </el-row>
        </div>
        <!-- 底部 -->
        <bottom></bottom>
    </div>
</template>

<script>
    import Vue from "vue";
    import {mapActions, mapGetters} from "vuex";
    import md5 from "md5";

    import {
        Message,
        MessageBox,
        Table,
        TableColumn,
        Button,
        ButtonGroup,
        Dialog,
        Form,
        FormItem,
        Radio,
        RadioGroup,
        RadioButton,
        Checkbox,
        CheckboxButton,
        CheckboxGroup,
        Option,
        Select,
        Pagination,
        Loading
    } from "element-ui";

    Vue.use(Table);
    Vue.use(TableColumn);
    Vue.use(Button);
    Vue.use(ButtonGroup);
    Vue.use(Dialog);
    Vue.use(Form);
    Vue.use(FormItem);
    Vue.use(Radio);
    Vue.use(RadioGroup);
    Vue.use(RadioButton);
    Vue.use(Checkbox);
    Vue.use(CheckboxButton);
    Vue.use(CheckboxGroup);
    Vue.use(Option);
    Vue.use(Select);
    Vue.use(Pagination);
    Vue.use(Loading);

    import bottom from "@/components/bottom";
    import search from "@/components/search";

    export default {
        name: "UserList",
        data() {
            // 验证特殊字符
            const validateAccount = (rule, value, callback) => {
                if (value.trim().length === 0) {
                    callback(new Error("请输入用户名"));
                } else if (value.trim().length < 3 || value.trim().length > 20) {
                    callback(new Error("请输入格式为字母 + 数字下划线 4-20位"))
                } else {
                    let pattern = /^[a-zA-Z]+[a-zA-Z0-9_]/g;

                    if (pattern.test(value)) {
                        callback()
                    } else {
                        callback(new Error("请输入格式为字母 + 数字 4-12位"))
                    }
                }
            };

            return {
                loading:false,
                // 添加弹框
                accountDialogTitles: ["添加账号", "编辑账号"],
                accountDialogTitle: "",
                accountDialogAct: 0,
                centerDialogVisible: false,

                accountsData: [],
                key: "",
                page: 1,
                size: 10,
                count: 0,

                roles: [],
                supplierDic: [],
                projects: [],

                ruleForm: {
                    account: "",
                    // password: "",
                    // passwordmd5: "",
                    phonenumber: "",
                    roleid: "",
                    rolename: "",
                    wechatname: "",
                    projectids: [],
                    supplierid: "",
                },

                rules: {
                    account: [
                        {required: true, message: "请输入用户名", trigger: "blur"},
                        {trigger: "blur", validator: validateAccount},
                    ],
                    // password: [
                    //     {required: true, message: "请输入密码", trigger: "blur"},
                    //     {min: 4, max: 15, message: "密码长度 4-15位", trigger: "blur"}
                    // ],
                    phonenumber: [
                        {required: true, message: "请输入手机号", trigger: "blur"},
                        {min: 11, max: 11, message: "请输入正确的手机号", trigger: "blur"}
                    ],
                    roleid: [{required: true, message: "请选择角色", trigger: "change"}],
                    projectids: [{required: true, message: "请选择项目", trigger: "change"}],
                    supplierid: [{required: true, message: "请选择供应商", trigger: "change"}],
                    wechatname: [{required: true, message: "请输入QQ号", trigger: "change"}],

                },
            }
        },
        computed: {
            ...mapGetters(["user", "isSuper"]),
        },
        components: {
            bottom,
            search
        },
        mounted() {
            this.getAccounts();
            this.getRoles();
            this.getProjects();
            this.getSuppliers();
        },
        methods: {
            // 添加编辑
            editAccount(act, row) {
                this.accountDialogTitle = this.accountDialogTitles[act];
                this.centerDialogVisible = true;

                if (act === 1) {
                    this.accountDialogAct = 1;
                    this.GetAccount(row.id).then(res => {
                        // 返回的供应商id 为0

                        this.ruleForm = _.assign({}, row, res, {rolename: row.rolename, password: "zx9xz0df23"});
                    }).catch(err => {
                        this.$message(err.message)
                    });

                } else {
                    this.ruleForm = {
                        account: "",
                        // password: "",
                        // passwordmd5: "",
                        phonenumber: "",
                        roleid: "",

                        wechatname: "",
                        projectids: [],
                        supplierid: "",
                    };

                    this.accountDialogAct = 0;
                }

            },

            // 添加编辑对话框
            closeAddDialog() {
                this.$refs["ruleForm"].resetFields();
            },
            // 角色
            getRoles() {
                this.GetRoles().then((res) => {
                    this.roles = res;
                })
            },
            // 项目 // 0通用 1撰写 2发布 3点赞 4反向
            getProjects() {
                this.GetProjectsDic(0).then((res) => {
                    this.projects = res;
                })
            },
            // 供应商 // 0通用 1撰写 2发布 3点赞 4反向
            getSuppliers() {
                this.GetSuppliersDic(0).then((res) => {
                    this.supplierDic = res;
                })
            },
            // 用户
            getAccounts(ser) {
                if(ser){
                    this.page = 1;
                }
                this.loading = true;
                this.GetAccounts({Page: this.page, Size: this.size, Key: this.key}).then((res) => {
                    this.accountsData = res.data;
                    this.count = res.count;
                    this.loading = false;
                }).catch(e=>{
                    this.loading = false;
                })
            },

            // 添加账号的表单提交
            addAccount() {
                if (this.ruleForm.rolename !== '供应商执行员' && this.ruleForm.projectids.length == 0) {
                    this.$message("请选择项目");
                    return;
                }

                this.$refs["ruleForm"].validate(valid => {
                    if (valid) {
                        // this.ruleForm.passwordmd5 = md5(this.ruleForm.password);
                        this.AddAccount(this.ruleForm).then(() => {
                            this.centerDialogVisible = false;
                            Message.success("添加成功");
                            this.getAccounts();
                        }).catch((err) => {
                            Message.success(err.message);
                        });

                    } else {
                        Message.error("操作失败");
                        return false;

                    }
                });
            },

            changeAccount() {
                this.$refs["ruleForm"].validate(valid => {
                    if (valid) {

                        // if(this.isSuper){
                        //     if(this.ruleForm.password != "zx9xz0df23"){
                        //         this.ruleForm.passwordmd5 = md5(this.ruleForm.password);
                        //     }
                        // }

                        let opt = _.assign({}, this.ruleForm, {supplierid: this.ruleForm.supplierid == 0 ? "" : this.ruleForm.supplierid});

                        this.ChangeAccount(opt).then(() => {
                            this.centerDialogVisible = false;
                            this.RefreshLogin();
                            Message.success("编辑成功");
                            this.getAccounts();
                        }).catch((err) => {
                            Message.success("编辑失败");
                        });


                    } else {
                        Message.error("操作失败");
                        return false;

                    }
                });
            },

            resetForm() {
                this.$refs["ruleForm"].resetFields();
                this.centerDialogVisible = false;
            },

            disableAccount(row) {
                this.DisbaleAccount({
                    id: row.id,
                    isDisabled: row.enabled == 1 ? 1 : 0,
                }).then(() => {
                    this.$message("状态改变成功");
                    this.getAccounts();
                }).catch((err) => {
                    Message.success("状态改变失败");
                });
            },

            changeRole(v) {

                this.ruleForm.rolename = _.find(this.roles, {key: v}).value;
                this.ruleForm.projectids = [];
                if (this.ruleForm.rolename == "供应商执行员") {
                    this.ruleForm.wechatname = "";
                } else {
                    this.ruleForm.supplierid = "";
                }
            },

            ...mapActions(["GetAccounts", "DisbaleAccount", "AddAccount", "ChangeAccount", "GetRoles", "GetProjectsDic", "GetSuppliersDic", "GetAccount", "RefreshLogin"]),

        }
    };
</script>


<style lang="scss">
    // 底部文字
    .bottom-text {
        margin: 50px 0 38px 0;
        height: 20px;
        font-size: 12px;
        font-weight: 400;
        color: rgba(150, 160, 173, 1);
        line-height: 20px;
        text-align: center;
    }

    // 定义的全局变量
    $btn-color: #6967CE;
    $border-color: #E5E7F3;
    $operation-color: #0179FF;
    .user_box {
        width: 91%;
        text-align: left;
        margin: 100px 20px 0 190px;

        .el-input {
            width: 80%;
        }

        .mine .tab {
            height: 100px;
            line-height: 100px;
            /* background: ; */
            padding-left: 5%;
        }

        .tab_list {
            width: 100%;
            text-align: left;
        }

        .tab_list .item {
            font-size: 24px;
            font-weight: bold;
            float: left;
            margin-right: 30px;
            cursor: pointer;
        }

        .tab_list .item:hover {
            color: rgb(22, 132, 216);
        }

        .active {
            color: rgb(22, 132, 216);
        }

        .el-table td,
        .el-table th.is-leaf {
            border-bottom: 1px solid #EBEEF5;
        }

        .el-table--border th {
            border-right: 1px solid #EBEEF5;
        }

        .el-table--border td {
            border-right: 1px solid #EBEEF5;
        }

        .el-table--border {
            border: 1px solid #EBEEF5;
        }

        .block {
            text-align: right;
            margin: 30px -5px 48px 0;
        }

        .el-table td, .el-table th {
            padding: 5px 0 !important;
        }

        .el-table--striped .el-table__body tr.el-table__row--striped td {
            /* background: rgba(235, 241, 243, 0.945); */
            background: #f9fafb;
        }

        .el-table--enable-row-hover .el-table__body tr:hover > td {
            background-color: #e0e5f1;
        }

        .user-table {
            width: 80%;
            margin: 0 auto;
        }

        .add_btn {
            margin: 0 0 30px 5%;
        }

        .el-pagination.is-background .el-pager li:not(.disabled).active {
            background-color: $btn-color;
        }

    }

    .user_box .user-table {
        width: 100% !important;
    }

    .user_box .el-table tr {
        height: 66px !important;
    }

    .user_box .el-table thead tr:first-child {
        height: 50px !important;
    }

    .user-manage {
        width: 100%;
        background: #fff;
        padding: 0 30px 0;
        border: 1px solid #E5E7F3;
        border-radius: 4px;

        .el-dialog {
            border-top: 1px solid transparent;

            .affirm-btn, .quxiao-btn {
                width: 120px;
                height: 40px;
                border: 1px solid rgba(105, 103, 206, 1);
                background: rgba(105, 103, 206, 1);
                border-radius: 4px;
                color: #fff;
            }

            .quxiao-btn {
                color: rgba(105, 103, 206, 1);
                background: #fff;
            }
        }

        .el-dialog__header {
            margin: 20px 20px 10px;
            border-bottom: 1px solid #6967CE;
            padding-bottom: 10px !important;
        }

        .task-top {
            height: 100px;
            position: relative;
            border-bottom: 2px solid #CACFE7;

            .title {
                color: #2C343D;
                font-size: 20px;
                width: 83px;
                line-height: 100px;
                float: left;
            }

            .el-input {
                float: right;
                width: 220px;
                margin-top: 37px;
            }

            .search {
                width: 150px;
                height: 36px;
                background-color: $btn-color;
                border-radius: 4px;
                font-size: 14px;
                color: #fff;
                border: none;
                float: right;
                margin: 37px 0 0 20px;
            }
        }

        .edit-btn, .disabled-btn {
            float: left;
            margin-right: 20px;
            font-size: 14px;
            cursor: pointer;
        }

        .edit-btn, .open-btn {
            color: #0179FF;
        }

        .disabled-btn {
            color: #D35847;
        }

    }
</style>