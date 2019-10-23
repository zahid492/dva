<template>
    <div class="user_box">

        <!--<el-button type="primary" class="add_btn" @click="editAccount(0, null)">添加账号</el-button>-->
        <el-dialog
                :title="accountDialogTitle"
                :visible.sync="centerDialogVisible"
                width="30%"
                @close="closeAddDialog"
                center>
            <!-- 添加写手弹框内容 -->
            <div class="add_card">
                <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="80px" class="demo-ruleForm">
                    <el-form-item label="账号ID" prop="account">
                        <el-input v-model="ruleForm.account"></el-input>
                    </el-form-item>
                    <el-form-item label="姓名" prop="name">
                        <el-input v-model="ruleForm.name"></el-input>
                    </el-form-item>
                    <el-form-item label="电话" prop="phoneNumber">
                        <el-input v-model="ruleForm.phoneNumber"></el-input>
                    </el-form-item>
                    <el-form-item label="状态" prop="disabled">
                        <el-select v-model="ruleForm.disabled" placeholder="请选择状态">
                            <el-option v-for="(v, k) in disables" :label="k" :value="v"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="角色" prop="roleId">
                        <el-select v-model="ruleForm.roleId" placeholder="请选择角色">
                            <el-option v-for="(r, i) in roles" :label="r" :value="i"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" v-if="accountDialogAct" @click="changeAccount" act="1">确定</el-button>
                        <el-button type="primary" v-else @click="addAccount"  act="0">确定</el-button>
                        <el-button @click="resetForm('ruleForm')">取消</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </el-dialog>

        <el-table
                :data="accountsData"
                border
                stripe
                style="width: 90%"
                class="user-table">
            <el-table-column prop="id" label="序号" width="70"></el-table-column>
            <el-table-column prop="account" label="账号ID"></el-table-column>
            <el-table-column prop="name" label="姓名"></el-table-column>
            <el-table-column prop="phoneNumber" label="电话"></el-table-column>
            <el-table-column prop="roleName" label="角色"></el-table-column>
            <el-table-column prop="modifyUserName" label="修改人"></el-table-column>
            <el-table-column prop="lastModifyDt" label="修改时间">
                <template slot-scope="scope">
                    <p v-if="scope.row.lastModifyDt[0]!=undefined">{{ scope.row.lastModifyDt[0] + " " +
                        scope.row.lastModifyDt[1] }}</p>
                </template>
            </el-table-column>
            <el-table-column prop="statusName" label="状态"></el-table-column>
            <el-table-column label="操作" width="200">
                <template slot-scope="scope">
                    <el-button size="small" type="warning" @click="editAccount(1, scope.row)">编辑</el-button>
                    <!--<el-button size="small" type="info" @click="resetPassword(scope.row)">重置密码</el-button>-->

                </template>

            </el-table-column>
        </el-table>
        <!-- 分页 -->
        <div class="block">
            <el-pagination
                    @current-change="handleCurrentChange"
                    :current-page.sync="page"
                    :page-size="10"
                    layout="prev, pager, next, jumper"
                    :total="accountCount">
            </el-pagination>
        </div>
    </div>
</template>

<script>
    import Vue from "vue";
    import {mapActions, mapGetters} from "vuex";

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
        Pagination
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

    export default {
        name: "UserList",
        data() {
            // 验证特殊字符
            const validateAccount = (rule, value, callback) => {
                if (value.trim().length === 0) {
                    callback(new Error("请输入写手ID"));
                } else if (value.trim().length < 6 || value.trim().length > 20) {
                    callback(new Error("请输入格式为字母 + 数字 6-20位"))
                } else {
                    let pattern = /^[a-zA-Z]+[a-zA-Z0-9]/g;

                    if (pattern.test(value)) {
                        callback()
                    } else {
                        callback(new Error("请输入格式为字母 + 数字 6-20位"))
                    }
                }
            };

            return {
                // 添加弹框
                accountDialogTitles: ["添加账号", "编辑账号"],
                accountDialogTitle: "",
                accountDialogAct: 0,
                centerDialogVisible: false,
                accountsData: [],
                page: 1,
                // 分页功能
                disables: {
                    "正常": "0",
                    "禁用": "1"

                },
                ruleForm: {
                    account: "",
                    name: "",
                    phoneNumber: "",
                    disabled: "0",
                    roleId: ""
                },

                rules: {
                    account: [
                        {trigger: "blur", validator: validateAccount},
                        // {min: 6, max: 20, message: "请输入格式为1数字+字母6-20位",trigger: "blur"}
                    ],
                    name: [
                        {required: true, message: "请输入写手姓名", trigger: "blur"},
                        {min: 2, trigger: "blur"}
                    ],
                    phoneNumber: [
                        {required: true, message: "请输入写手电话", trigger: "blur"},
                        {min: 11, max: 11, message: "请输入正确的手机号", trigger: "blur"}
                    ],
                    disabled: [{required: true, message: "请选择状态", trigger: "change"}],
                    roleId: [{required: true, message: "请选择权限", trigger: "change"}]
                },
            }
        },
        computed: {
            ...mapGetters(["accounts", "user", "accountCount", "roles"]),
        },
        mounted() {
            this.getAccounts();
            this.getRoles();
        },
        methods: {
            editAccount(act, row) {
                this.accountDialogTitle = this.accountDialogTitles[act];
                this.centerDialogVisible = true;

                if (act === 1) {
                    this.accountDialogAct = 1;
                    this.ruleForm = _.assign({}, row, {
                        roleId: _.findKey(this.roles, (o) => {
                            return o === row.roleName
                        }),
                        disabled: this.disables[row.statusName]
                    });
                } else {
                    this.accountDialogAct = 0;
                }

            },
            closeAddDialog() {
                this.$refs["ruleForm"].resetFields();
            },
            // api error
            getRoles() {
                this.GetRoles()
            },
            getAccounts() {
                this.GetAccounts({page: this.page, size: 10}).then(() => {
                    this.accountsData = this.accounts;
                })
            },

            // 添加账号的表单提交
            addAccount() {
                this.$refs["ruleForm"].validate(valid => {
                    if (valid) {

                        this.AddAccount(this.ruleForm).then(() => {
                            this.centerDialogVisible = false;
                            Message.success("添加成功");
                            this.getAccounts();
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

                        this.ChangeAccount(this.ruleForm).then(() => {
                            this.centerDialogVisible = false;
                            Message.success("编辑成功");
                            this.getAccounts();
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

            // 分页功能
            handleCurrentChange(val) {
                this.GetAccounts({page: val, size: 10}).then(() => {
                    this.accountsData = this.accounts;
                })
            },

            resetPassword(row) {
                MessageBox.confirm('是否要重置密码?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.ResetPass(row.id).then((res) => {
                        Message({
                            type: 'success',
                            message: '重置成功!'
                        });
                        this.getAccounts();
                    });


                }).catch(() => {
                    Message({
                        type: 'info',
                        message: '取消重置'
                    });
                });

            },

            ...mapActions(["GetAccounts", "AddAccount", "ChangeAccount", "GetRoles", "ResetPass"]),

        }
    };
</script>
<style>
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
        border-bottom: 1px solid #ccc;
    }

    .el-table--border th {
        border-right: 1px solid #ccc;
    }

    .el-table--border td {
        border-right: 1px solid #ccc;
    }

    .el-table--border {
        border: 1px solid #ccc;
    }

    .block {
        text-align: right;
        margin: 30px 5% 0 0;
    }

    .el-table td,
    .el-table th.is-leaf {
        border-bottom: 1px solid #ccc;
    }

    .el-table--border th {
        border-right: 1px solid #ccc;
    }

    .el-table--border td {
        border-right: 1px solid #ccc;
    }

    .el-table--border {
        border: 1px solid #ccc;
    }

    .block {
        text-align: right;
        margin: 30px 5% 0 0;
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

    .user_box {
        text-align: left;
    }
</style>