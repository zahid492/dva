<template>
    <el-row class="role-box">
        <h1> 用户管理 </h1>
        <el-col :span="22" :offset="1">
            <!-- 模糊查询 -->
            <el-row class="role-search">
                <el-col :span="5">
                    <el-input
                            placeholder="名称"
                            prefix-icon="el-icon-search"
                            v-model="Key">
                    </el-input>
                </el-col>
                <el-col :span="2" :offset="1">
                    <el-button type="primary" size="nomal" @click="getUsers">搜索</el-button>
                </el-col>
                <el-col :span="2">
                    <el-button type="primary" size="nomal" @click="editUser(0)">创建</el-button>
                </el-col>

            </el-row>
            <!-- 表格 -->
            <el-table
                    :data="userList"
                    style="width: 100%"
                    class="client-table">
                <el-table-column
                        type="index"
                        :index="tNo"
                        label="ID"
                        width="80">
                </el-table-column>
                <el-table-column
                        prop="username"
                        label="用户名"
                        width="200">
                </el-table-column>
                <el-table-column
                        prop="name"
                        label="名称">
                </el-table-column>
                <el-table-column
                        label="状态"
                        width="100"
                >
                    <template slot-scope="scope">
                        <div :class="{'status-color2': true, 'status-color1':scope.row.isactive}">
                            {{scope.row.active}}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column
                        prop="operation"
                        label="操作"
                        width="350">
                    <template slot-scope="scope">
                        <div class="btn-box">
                            <div class="edit-btn" @click="editUser(1, scope.row)">编辑</div>
                            <div class="del-btn" @click="delUser(scope.row)">删除</div>
                            <div class="del-btn" @click="resetPassword(scope.row)">重置密码</div>
                            <div class="del-btn" @click="activeUser(scope.row)">{{scope.row.isactive?"禁用":"启用"}}</div>
                        </div>
                    </template>
                </el-table-column>
            </el-table>

            <!-- 分页 -->
            <el-pagination
                    background
                    @size-change="()=>getUsers()"
                    @current-change="()=>getUsers()"
                    :current-page.sync="Page"
                    :page-sizes="[10, 15, 20]"
                    :page-size.sync="Size"
                    layout="sizes, prev, pager, next"
                    :total="count">
            </el-pagination>

            <!-- 编辑/创建弹框 -->
            <el-dialog :title="(flagCM=='1'?'编辑':'新建') +'用户'"
                       :close-on-click-modal="false"
                       :visible.sync="dialogFormVisible">
                <el-form :model="form" :rules="rules" ref="form">

                    <el-form-item label="用户名" :label-width="formLabelWidth" prop="username">
                        <el-input v-model="form.username" autocomplete="off" :disabled="flagCM===1"></el-input>
                    </el-form-item>
                    <el-form-item label="姓名" :label-width="formLabelWidth" prop="name">
                        <el-input v-model="form.name" autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="手机号" :label-width="formLabelWidth" prop="phone">
                        <el-input v-model="form.phone" autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="邮箱" :label-width="formLabelWidth" prop="email">
                        <el-input v-model="form.email" autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="QQ" :label-width="formLabelWidth" prop="qq">
                        <el-input v-model="form.qq" autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="性别" :label-width="formLabelWidth" prop="sex">
                        <el-radio v-model="form.sex" label="男">男</el-radio>
                        <el-radio v-model="form.sex" label="女">女</el-radio>
                    </el-form-item>
                    <el-form-item label="公司" :label-width="formLabelWidth" prop="company">
                        <el-input v-model="form.company" autocomplete="off"></el-input>
                    </el-form-item>

                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="resetForm">取 消</el-button>
                    <el-button type="primary" @click="saveUser">保 存</el-button>
                </div>
            </el-dialog>


        </el-col>
    </el-row>
</template>

<script>
    import Vue from 'vue';
    import {tIndex, vQQ} from '@/service/utils';
    import service from "@/service/request";
    import {
        Row,
        Col,
        Table,
        TableColumn,
        Input,
        InputNumber,
        Pagination,
        Dialog,
        Form,
        FormItem,
        Switch,
        Select,
        Option,
        OptionGroup,
        Button,
        ButtonGroup,
        Checkbox,
        CheckboxButton,
        CheckboxGroup,
        Tree,
        Radio
    } from 'element-ui';

    Vue.use(Row);
    Vue.use(Col);
    Vue.use(Table);
    Vue.use(TableColumn);
    Vue.use(Input);
    Vue.use(InputNumber);
    Vue.use(Pagination);
    Vue.use(Dialog);
    Vue.use(Form);
    Vue.use(FormItem);
    Vue.use(Switch);
    Vue.use(Select);
    Vue.use(Option);
    Vue.use(OptionGroup);
    Vue.use(Button);
    Vue.use(ButtonGroup);
    Vue.use(Checkbox);
    Vue.use(CheckboxButton);
    Vue.use(CheckboxGroup);
    Vue.use(Tree);
    Vue.use(Radio);
    export default {
        name: 'Role',
        data() {
            const validateEmail = (rule, value, callback) => {
                if (value == null || value.length < 3 || !(/@\w+\./.test(value.trim()))) {
                    callback(new Error("请输入正确邮箱地址"))
                } else {
                    callback()
                }
            };
            return {
                // 表格数据
                userList: [],
                // 操作弹框
                gridData: [],
                // 弹框开关
                dialogFormVisible: false,
                form: {
                    id: 0,
                    "username": "",
                    "name": "",
                    qq: "",
                    "phone": "",
                    "email": "",
                    "sex": "男",
                    "company": ""
                },
                formLabelWidth: '120px',
                // 弹框复选
                editId: -1,
                flagCM: 0,

                Page: 1,
                Size: 10,
                Key: "",
                count: 0,
                rules: {
                    username: [{required: true, message: "请输入用户名", trigger: "blur"}],
                    email: [{required: true, trigger: "blur", validator: validateEmail}],
                    name: [{required: true, message: "请输入名称", trigger: "blur"}],
                    qq: [{required: true, trigger: "blur", validator: vQQ}],
                    sex: [{required: true, message: "请选择性别", trigger: "blur"}],
                    phone: [
                        {required: true, message: "请输入手机号", trigger: "blur"},
                        {min: 11, max: 11, message: "请输入正确的手机号", trigger: "blur"}
                    ],
                },
            }
        },
        mounted() {
            this.getUsers();
        },
        methods: {
            tNo(index) {
                return tIndex(index, this.Page, this.Size)
            },
            // 用户列表
            async getUsers() {
                try {
                    let res = await service({
                        url: 'users',
                        method: "get",
                        params: {
                            Page: this.Page,
                            Size: this.Size,
                            Key: this.Key
                        }
                    });

                    this.count = res.count;
                    this.userList = _.map(res.data, (v) => {
                        if (v.isactive) {
                            v.active = "正常";
                        } else {
                            v.active = "禁用"
                        }
                        return v;
                    });
                } catch (e) {
                    console.error("内部错误")
                }
            },
            // 保存规则，创建修改
            saveUser() {
                this.$refs["form"].validate(async valid => {
                    if (valid) {
                        try {
                            if (this.flagCM == "0") {
                                await service({
                                    url: 'users',
                                    method: "post",
                                    data: this.form
                                });
                            }

                            if (this.flagCM == "1") {
                                await service({
                                    url: 'users/' + this.form.id + "/update",
                                    method: "post",
                                    data: this.form
                                });
                            }

                            this.dialogFormVisible = false;
                            this.getUsers();

                        } catch (e) {
                            console.error("内部错误")
                        }
                    } else {
                        this.$message.error("请正确填写表单");
                    }
                });

            },

            async editUser(flag, row) {
                this.flagCM = flag;
                this.dialogFormVisible = true;

                if (flag == "1") {
                    try {
                        let res = await service({
                            url: 'users/' + row.id,
                            method: "get",
                        });

                        this.form = res.data;
                    } catch (e) {
                        console.error("内部错误")
                    }
                }else{
                    this.form = {
                        "username": "",
                        "name": "",
                        "qq": "",
                        "phone": "",
                        "email": "",
                        "sex": "男",
                        "company": ""
                    }
                }
            },

            delUser(row) {
                this.$confirm("删除该用户吗？", '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(async () => {
                    try {
                        await service({
                            url: 'users/' + row.id + "/delete",
                            method: "post",
                        });
                        this.$message({
                            type: 'success',
                            message: '删除成功'
                        });
                        this.flagCM = 0;
                        this.getUsers();
                    } catch (e) {
                        console.error("内部错误")
                    }

                }).catch((err) => {
                    console.log(err)
                })
            },

            resetForm() {
                this.$refs["form"].resetFields();
                this.dialogFormVisible = false;
            },

            resetPassword(row) {
                this.$confirm("是否确认重置密码？", '重置密码', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(async () => {
                    try {
                        let pass = await service({
                            url: 'users/resetpassword',
                            method: "post",
                            data: {
                                userid: row.id
                            }
                        });

                        this.$alert('请妥善保管以下密码：' + pass.data, '重置密码', {
                            confirmButtonText: '确定',
                        });

                    } catch (e) {
                        console.error("内部错误")
                    }

                }).catch((err) => {
                    console.log(err)
                })
            },

            async activeUser(row) {
                let enable = true;
                if (row.isactive) {
                    enable = false;
                }
                let pass = await service({
                    url: 'users/updateuseractive',
                    method: "post",
                    data: {
                        userid: row.id,
                        enable: enable,
                    }
                });

                this.getUsers();

                this.$message(pass.message);
            }

        }
    }
</script>

<style lang="scss">
    .role-box {
        width: 100%;
        height: 100%;
        padding: 10px 10px 50px;

        .role-search {
            margin: 20px 0;
        }

        .el-pagination {
            text-align: right;
            padding: 20px 0 10px;
        }

        .el-input {
            width: 100%;
        }

        .status-color2 {
            color: rgb(229, 67, 53);
        }

        .status-color1 {
            color: rgb(45, 187, 82);
        }
    }

</style>