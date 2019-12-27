<template>
    <el-row class="role-box">
        <h1> 角色管理 </h1>
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
                    <el-button type="primary" size="nomal" @click="getRoles">搜索</el-button>
                </el-col>
                <el-col :span="2">
                    <el-button type="primary" size="nomal" @click="editRole(0)">创建</el-button>
                </el-col>
            </el-row>
            <!-- 表格 -->
            <el-table
                    :data="roleList"
                    style="width: 100%"
                    class="client-table"
            >
                <el-table-column
                        type="index"
                        :index="tNo"
                        label="ID"
                        width="80">
                </el-table-column>
                <el-table-column
                        label="名称">

                    <template slot-scope="scope">
                        <div>
                            {{scope.row.name}}{{scope.row.isdefault==1?"[默认]":""}}
                        </div>
                    </template>
                </el-table-column>

                <el-table-column
                        prop="operation"
                        label="操作"
                        wodth="150">
                    <template slot-scope="scope">
                        <div class="btn-box">
                            <div class="edit-btn" @click="defaultSet(scope.row)" v-if="scope.row.isdefault!=1">设置默认
                            </div>
                            <div class="edit-btn" @click="editRole(1, scope.row)">编辑</div>
                            <div class="del-btn" @click="delRole(scope.row)" v-if="scope.row.isdefault!=1">删除</div>
                            <div class="del-btn" @click="relRules(scope.row)">关联规则</div>
                            <div class="del-btn" @click="relUsers(scope.row)">关联用户</div>
                        </div>
                    </template>

                </el-table-column>
            </el-table>

            <!-- 分页 -->
            <el-pagination
                    background
                    @size-change="()=>getRoles()"
                    @current-change="()=>getRoles()"
                    :current-page.sync="Page"
                    :page-sizes="[10, 15, 20]"
                    :page-size.sync="Size"
                    layout="sizes, prev, pager, next"
                    :total="count">
            </el-pagination>

            <!-- 编辑/创建 角色弹框 -->
            <el-dialog :title="(flagCM=='1'?'编辑':'新建') +'角色'"
                       :close-on-click-modal="false"
                       :visible.sync="dialogFormVisible">
                <el-form :model="form" :rules="rules" ref="form">
                    <el-form-item label="名称" :label-width="formLabelWidth" prop="name">
                        <el-input v-model="form.name" autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item :label-width="formLabelWidth" prop="isdefault">
                        <el-checkbox v-model="form.isdefault" :true-label="1" :false-label="0">设为默认角色</el-checkbox>
                    </el-form-item>

                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="resetForm">取 消</el-button>
                    <el-button type="primary" @click="saveRole">保 存</el-button>
                </div>
            </el-dialog>

            <!-- 关联规则弹框 -->
            <el-dialog
                    title="关联规则"
                    :close-on-click-modal="false"
                    :visible.sync="centerDialogVisible"
                    width="30%"
                    center>
                <el-tree
                        ref="ruleTree"
                        :data="ruleList"
                        show-checkbox
                        node-key="id"
                        :default-expanded-keys="ruleIds"
                        :default-checked-keys="ruleIds"
                        :props="defaultProps">
                </el-tree>

                <span slot="footer" class="dialog-footer">
                <el-button @click="cancelRule">取 消</el-button>
                <el-button type="primary" @click="saveRule">保 存</el-button>
            </span>
            </el-dialog>

            <!-- 关联用户弹框 -->
            <el-dialog
                    title="关联用户"
                    :close-on-click-modal="false"
                    :visible.sync="userDialogVisible"
                    width="30%"
                    center>
                <el-row>
                    <el-col :span="18">
                        <el-select v-model="userSelected"
                                   multiple
                                   filterable
                                   remote
                                   :remote-method="getUsers"
                                   @change="addUser"
                                   @remove-tag="delUser"
                                   placeholder="请选择用户">
                            <el-option
                                    v-for="item in userList"
                                    :key="item.id"
                                    :label="item.name || item.username"
                                    :value="item.id">
                            </el-option>
                        </el-select>
                    </el-col>

                </el-row>


                <span slot="footer" class="dialog-footer">
                <el-button @click="cancelUser">关闭</el-button>
            </span>
            </el-dialog>
        </el-col>
    </el-row>
</template>

<script>
    import Vue from 'vue';
    import service from "@/service/request";
    import {tIndex} from '@/service/utils';
    import random from "random";
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
    } from 'element-ui';

    {
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
    }

    export default {
        name: 'Role',
        data() {
            return {
                // 表格数据
                roleList: [],
                // 操作弹框
                // 弹框开关
                dialogFormVisible: false,
                form: {
                    name: '',
                    isdefault: 0
                },
                formLabelWidth: '120px',
                // 关联规则弹框开关
                centerDialogVisible: false,

                // 关联树状图
                ruleList: [],
                ruleIds: [],
                editId: -1,
                defaultProps: {
                    label: 'description',
                },

                // 关联用户弹框
                userDialogVisible: false,
                // 用户列表
                userSelected: [],
                userList: [],
                userIds: [],
                roleId: -1,

                flagCM: 0,
                count: 0,
                Page: 1,
                Size: 10,
                Key: "",

                rules: {
                    name: [{required: true, message: "请输入名称", trigger: "blur"}],
                },
            }
        },
        props: ["id"],
        mounted() {
            this.getRoles();
        },
        methods: {
            tNo(index) {
                return tIndex(index, this.Page, this.Size)
            },
            async getRoles() {
                try {
                    let res = await service({
                        url: 'applications/' + this.id + '/roles',
                        method: "get",
                        params: {
                            Page: this.Page,
                            Size: this.Size,
                            Key: this.Key,
                        }
                    });

                    this.count = res.count;
                    this.roleList = res.data;
                } catch (e) {
                    console.error("内部错误")
                }
            },

            editRole(flag, row) {
                this.flagCM = flag;
                this.dialogFormVisible = true;

                if (flag == "1") {
                    this.form = row;
                } else {
                    this.form = {}
                }
            },

            // 保存规则，创建修改
            saveRole() {
                this.$refs["form"].validate(async valid => {
                    if (valid) {
                        try {
                            this.form.applicationid = this.id;

                            if (this.flagCM == 0) {
                                await service({
                                    url: 'applications/' + this.id + '/roles',
                                    method: "post",
                                    data: this.form
                                });
                            }

                            if (this.flagCM == 1) {
                                await service({
                                    url: 'applications/' + this.id + '/roles/' + this.form.id + "/update",
                                    method: "post",
                                    data: this.form
                                });
                            }

                            this.dialogFormVisible = false;
                            this.getRoles();
                        } catch (e) {
                            this.$message.error(e.message);
                        }
                    } else {
                        this.$message.error("请正确填写表单");
                    }
                });

            },

            delRole(row) {
                this.$confirm("删除该角色吗？", '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(async () => {
                    try {
                        await service({
                            url: 'applications/' + this.id + '/roles/' + row.id + "/delete",
                            method: "post",
                        });
                        this.$message({
                            type: 'success',
                            message: '删除成功'
                        });
                        this.flagCM = 0;
                        this.getRoles();
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

            // 关联规则
            relRules(row) {
                this.centerDialogVisible = true;
                this.editId = row.id;
                this.ruleList = [];
                this.ruleIds = [];

                this.getAppRules(row);
            },

            leafify(list) {

                list.forEach((v) => {
                    if (!_.has(v, "id")) {
                        v.id = v.key;
                    }

                    if (_.isArray(v.value)) {
                        v.children = v.value;

                        this.leafify(v.children);
                    } else {
                        return false;
                    }
                });

                return list;
            },

            // 根据id查询规则
            async getAppRules(row) {
                try {
                    let res = await service({
                        url: 'applications/' + this.id + "/rules/rulesgroupbyprefix",
                        method: "get",
                    });

                    let list = this.leafify(res.data.map((v) => {
                        if (typeof v.key === "string") {
                            v.id = random.integer(10000, 20000)
                        } else {
                            v.id = v.key;
                        }

                        return v;
                    }));

                    this.ruleList = list;

                    this.getRoleRules(row)
                } catch (e) {
                    console.error("内部错误")

                }
            },

            // 根据角色id查询(已关联的)规则ids
            async getRoleRules(row) {
                try {
                    let res = await service({
                        url: 'applications/' + this.id + '/roles/' + row.id + "/rules",
                        method: "get",
                    });
                    this.ruleIds = res.data;
                } catch (e) {
                    console.error("内部错误")
                }
            },

            cancelRule() {
                this.centerDialogVisible = false;
                this.ruleList = [];
                this.ruleIds = [];
                this.editId = -1;
            },

            async saveRule() {

                let ids = this.$refs.ruleTree.getCheckedKeys();
                ids = ids.filter((v) => {
                    return v < 10000;
                });

                try {
                    await service({
                        url: 'applications/' + this.id + '/roles/' + this.editId + "/configuraterules",
                        method: "post",
                        data: ids
                    });
                    this.cancelRule();
                    this.getRoles();
                } catch (e) {
                    console.error("内部错误")
                }
            },


            //关联用户
            relUsers(row) {
                this.userDialogVisible = true;
                this.roleId = row.id;
                this.getUsers();
                this.getUserIds(this.roleId);
            },

            // 添加关联
            async addUser(key) {
                console.log(key)

                if (this.userIds.length < key.length) {
                    let lid = key[key.length - 1];
                    let lIndex = _.findIndex(this.userIds, {id: lid});

                    if (lIndex === -1) {
                        try {
                            await service({
                                url: 'applications/' + this.id + "/roles/" + this.roleId + "/adduserrole",
                                method: "post",
                                data: {
                                    userid: key[key.length - 1]
                                }
                            });
                            this.getUserIds(this.roleId);
                            this.$message.success("添加成功");
                        } catch (e) {
                            console.error("内部错误")
                        }
                    }
                }

            },
            // 删除关联
            async delUser(key) {
                console.log("delUser:", key)
                try {
                    await service({
                        url: 'applications/' + this.id + "/roles/" + this.roleId + "/deleteuserrole",
                        method: "post",
                        data: {
                            userid: key
                        }
                    });
                    this.getUserIds(this.roleId);
                    this.$message.success("删除成功");
                } catch (e) {
                    console.error("内部错误")
                }
            },

            // 获取用户列表
            async getUsers(key) {
                if (key === undefined) {
                    key = ""
                }

                try {
                    let res = await service({
                        url: 'users/usersbylikename',
                        method: "get",
                        params: {
                            UserName: key
                        }
                    });

                    this.userList = res.data;
                } catch (e) {
                    console.error("内部错误")
                }

            },

            // 根据角色id查询(已关联的)用户ids
            async getUserIds(rid) {

                try {
                    let res = await service({
                        url: 'applications/' + this.id + "/roles/" + rid + "/users",
                        method: "get",
                    });

                    this.userIds = res.data;
                    this.userSelected = _.map(res.data, (v) => {
                        return v.id;
                    });
                } catch (e) {
                    console.error("内部错误")
                }

            },

            cancelUser() {
                this.userDialogVisible = false;
                this.userList = [];
                this.userIds = [];
                this.userSelected = [];
                this.roleId = -1;
            },

            async defaultSet(row) {
                try {
                    await service({
                        url: 'applications/' + this.id + "/roles/" + row.id + "/setdefault",
                        method: "post",
                    });
                    this.getRoles();
                    this.$message.success("设置成功");
                } catch (e) {
                    console.error("内部错误")
                }
            }

        }
    }
</script>

<style lang="scss">
    .role-box {
        width: 100%;
        height: 100%;
        padding: 10px 10px 50px;
        // btn-box
        .btn-box {
            .edit-btn, .add-btn, .del-btn {
                width: 20%;
            }
        }

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
    }

</style>