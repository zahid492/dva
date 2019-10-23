<template>
    <el-row class="role-box">
        <h1> 角色管理 </h1>
        <el-col :span="22" :offset="1">
            <!-- 模糊查询 -->
            <el-row class="role-search">
                <el-col :span="5">
                    <el-input
                            placeholder="名称/id"
                            prefix-icon="el-icon-search"
                            v-model="Key">
                    </el-input>
                </el-col>
                <el-col :span="7" :offset="1">
                    <span>api资源&nbsp;&nbsp;&nbsp;</span>

                    <el-select v-model="CustomerApiResourceId" placeholder="请选择api资源">
                        <el-option
                                v-for="item in apiResList"
                                :key="item.value"
                                :label="item.value"
                                :value="item.key">
                        </el-option>
                    </el-select>

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
                        prop="id"
                        label="ID"
                        width="80">
                </el-table-column>
                <el-table-column
                        prop="name"
                        label="名称">
                </el-table-column>
                <el-table-column
                        prop="customerapiresourcename"
                        label="api资源">
                </el-table-column>
                <el-table-column
                        prop="operation"
                        label="操作"
                        wodth="150">
                    <template slot-scope="scope">
                        <div class="btn-box">
                            <div class="edit-btn" @click="editRole(1, scope.row)">编辑</div>
                            <div class="del-btn" @click="delRole(scope.row)">删除</div>
                            <div class="del-btn" @click="relRules(scope.row)">关联规则</div>
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

            <!-- 编辑/创建弹框 -->
            <el-dialog title="编辑当前信息" :visible.sync="dialogFormVisible">
                <el-form :model="form" :rules="rules" ref="form">
                    <el-form-item label="名　　称" :label-width="formLabelWidth" prop="name">
                        <el-input v-model="form.name" autocomplete="off"></el-input>
                    </el-form-item>

                    <el-form-item label="所属api资源" :label-width="formLabelWidth" prop="customerapiresourcename">
                        <el-select v-model="form.customerapiresourcename" placeholder="">
                            <el-option
                                    v-for="item in apiResList"
                                    :key="item.value"
                                    :label="item.value"
                                    :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="resetForm">取 消</el-button>
                    <el-button type="primary" @click="saveRole">保 存</el-button>
                </div>
            </el-dialog>

            <!-- 关联项目弹框 -->
            <el-dialog
                    title="关联规则"
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
        </el-col>
    </el-row>
</template>

<script>
    import Vue from 'vue';
    import service from "@/service/request";
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
                    customerapiresourcename: ''
                },
                formLabelWidth: '120px',
                // 弹框复选
                // 关联规则弹框开关
                centerDialogVisible: false,
                // 关联树状图
                ruleList: [],
                ruleIds: [],
                editId:-1,
                defaultProps: {
                    label: 'description',
                },
                flagCM: 0,
                count: 0,
                Page: 1,
                Size: 10,
                Key: "",
                CustomerApiResourceId: "",
                apiResList: [],

                rules: {
                    customerapiresourcename: [{required: true, message: "请选择api资源", trigger: "change"}],
                    name: [{required: true, message: "请输入名称", trigger: "blur"}],
                },
            }
        },
        mounted() {
            this.getRoles();
            this.getApiResList();
        },
        methods: {
            async getRoles() {
                try {
                    let res = await service({
                        url: 'roles',
                        method: "get",
                        params: {
                            Page: this.Page,
                            Size: this.Size,
                            Key: this.Key,
                            CustomerApiResourceId: this.CustomerApiResourceId == 0 ? "" : this.CustomerApiResourceId == 0
                        }
                    });

                    this.count = res.count;
                    this.roleList = res.data;
                } catch (e) {
                    this.$message.error(e.message);
                }
            },
            // api 资源字典
            async getApiResList() {
                try {
                    let res = await service({
                        url: 'dictionaries/apiresources',
                        method: "get",
                    });

                    this.apiResList = res.data;
                } catch (e) {
                    this.$message.error(e.message);
                }
            },

            editRole(flag, row) {
                this.flagCM = flag;
                this.dialogFormVisible = true;

                if (flag == "1") {
                    this.form = row;
                }
            },
            // 保存规则，创建修改
            saveRole() {
                this.$refs["form"].validate(async valid => {
                    if (valid) {
                        try {
                            if (this.flagCM == 0) {
                                await service({
                                    url: 'roles',
                                    method: "post",
                                    data: this.form
                                });
                            }

                            if (this.flagCM == 1) {
                                await service({
                                    url: 'roles/' + this.form.id + "/update",
                                    method: "post",
                                    params: this.form
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
                this.$confirm("删除该规则吗？", '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(async () => {
                    try {
                        await service({
                            url: 'roles/' + row.id + "/delete",
                            method: "post",
                        });
                        this.$message({
                            type: 'success',
                            message: '删除成功'
                        });
                        this.flagCM = 0;
                        this.getRoles();
                    } catch (e) {
                        this.$message.error(e.message);
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
                this.getApiIdRules(row).then((res1)=>{
                    this.ruleList = res1;

                    this.getRoleRules(row).then((res2)=>{
                        this.ruleIds = res2;
                    }).catch(e=>{
                        console.error(e)
                    })

                }).catch(e=>{
                    console.error(e)
                })
            },

            leafify(list) {

                list.forEach((v) => {
                    if(!_.has(v, "id")){
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

            // 根据apiresourceid查询规则
            getApiIdRules(row) {
                return new Promise(async (resolve, reject) => {
                    try {
                        let res = await service({
                            url: 'apiresources/' + row.customerapiresourceid + "/rulesgroupbyprefix",
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

                        resolve(list);
                    } catch (e) {
                        this.$message.error(e.message);
                        reject(e);
                    }
                })

            },

            // 根据角色id查询(已关联的)规则ids
            getRoleRules(row) {
                return new Promise(async (resolve, reject) => {
                    try {
                        let res = await service({
                            url: 'roles/' + row.id + "/rules",
                            method: "get",
                        });

                        resolve(res.data);
                    } catch (e) {
                        this.$message.error(e.message);
                        reject(e)
                    }
                })

            },

            cancelRule() {
                this.centerDialogVisible = false;
                this.ruleList = [];
                this.ruleIds = [];
                this.editId = -1;
            },

            async saveRule() {

                let ids = this.$refs.ruleTree.getCheckedKeys();
                ids = ids.filter((v)=>{
                    return v<10000;
                });

                try {
                    await service({
                        url: 'roles/' + this.editId + "/configuraterules",
                        method: "post",
                        data: ids
                    });
                    this.cancelRule();
                    this.getRoles();
                } catch (e) {
                    this.$message.error(e.message);
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