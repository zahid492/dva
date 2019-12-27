<template>
    <el-row class="resource-box">
        <h1> 我的应用 </h1>
        <el-col :span="22" :offset="1">
            <!-- 模糊查询 -->
            <el-row class="resource-search">
                <el-col :span="5">
                    <el-input
                            placeholder="名称"
                            prefix-icon="el-icon-search"
                            v-model="Key">
                    </el-input>
                </el-col>
                <el-col :span="2" :offset="1">
                    <el-button type="primary" size="nomal" @click="getAppList">搜索</el-button>
                </el-col>
                <el-col :span="2">
                    <el-button type="primary" size="nomal" @click="editApp(0)">创建</el-button>
                </el-col>
            </el-row>
            <!-- 表格 -->
            <el-table
                    :data="appList"
                    style="width: 100%"
                    class="resource-table"
            >
                <el-table-column
                        type="index"
                        :index="tNo"
                        label="ID"
                        width="60">

                </el-table-column>
                <el-table-column
                        prop="name"
                        label="名称"
                >
                </el-table-column>
                <el-table-column
                        prop="displayname"
                        label="显示名称"
                        width="250">
                </el-table-column>
                <!--@click="setAuth(scope.row)"-->
                <el-table-column
                        prop="operation"
                        label="操作">
                    <template slot-scope="scope">
                        <div class="btn-box">
                            <div class="edit-btn" @click="editApp(1, scope.row)">编辑</div>
                            <div class="edit-btn" @click="toClient(scope.row)">客户端</div>
                            <!--<div class="del-btn" @click="resetSecret(scope.row)">重置Secret</div>-->
                            <div class="del-btn" @click="roleManage(scope.row)">角色管理</div>
                            <div class="del-btn" @click="ruleManage(scope.row)">规则管理</div>
                        </div>
                    </template>
                </el-table-column>
            </el-table>

            <!-- 分页 -->
            <el-pagination
                    background
                    @size-change="()=>getAppList()"
                    @current-change="()=>getAppList()"
                    :current-page.sync="Page"
                    :page-sizes="[10, 15, 20]"
                    :page-size.sync="Size"
                    layout="sizes, prev, pager, next"
                    :total="count">
            </el-pagination>

            <!-- 编辑/创建弹框 -->
            <el-dialog :title="(flagCM=='1'?'编辑':'新建') +'我的应用'"
                       :close-on-click-modal="false"
                       :visible.sync="dialogFormVisible">
                <el-form :model="form" :rules="rules" ref="form">

                    <el-form-item label="名称" :label-width="formLabelWidth" prop="name">
                        <el-input v-model="form.name"
                                  :disabled="flagCM=='1'"
                                  autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="显示名称" :label-width="formLabelWidth" prop="displayname">
                        <el-input v-model="form.displayname" autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="服务器地址" :label-width="formLabelWidth" prop="serveraddress">
                        <el-input v-model="form.serveraddress" autocomplete="off"></el-input>
                    </el-form-item>

                    <el-form-item label="授权重定向Url"
                                  v-if="flagCM==0"
                                  :label-width="formLabelWidth" prop="redirecturisArr">
                        <el-input v-model="form.redirecturisArr"
                                  type="textarea"
                                  placeholder="换行添加多个"
                                  :rows="3" autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="注销重定向Url"
                                  :label-width="formLabelWidth"
                                  v-if="flagCM==0"
                                  prop="postlogoutredirecturisArr">
                        <el-input v-model="form.postlogoutredirecturisArr"
                                  type="textarea"
                                  placeholder="换行添加多个"
                                  :rows="3"
                                  autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="允许跨域Url"
                                  :label-width="formLabelWidth"
                                  v-if="flagCM==0"
                                  prop="allowedcorsoriginsArr">
                        <el-input v-model="form.allowedcorsoriginsArr"
                                  type="textarea"
                                  placeholder="* 默认全部，换行添加多个"
                                  :rows="3"
                                  autocomplete="off"></el-input>

                    </el-form-item>

                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="resetApp">取 消</el-button>
                    <el-button type="primary" @click="saveApp">保 存</el-button>
                </div>
            </el-dialog>

            <el-dialog title="设置域"
                       :close-on-click-modal="false"
                       :visible.sync="dialogAuthVisible">
                <el-transfer
                        style="text-align: left; display: inline-block"
                        v-model="authSelectedList"
                        :titles="['域列表', '所选域']"
                        :button-texts="['到左边', '到右边']"
                        :props="{
                          key: 'id',
                          label: 'name'
                        }"
                        :format="{
                            noChecked: '${total}',
                            hasChecked: '${checked}/${total}'
                        }"

                        :data="authList">
                    <div slot-scope="{ option }">
                        <el-tooltip placement="right">
                            <div slot="content">{{ option.description }}</div>
                            <div>{{ option.displayname }}</div>
                        </el-tooltip>
                    </div>
                    <!-- todo -->

                    <!--<el-button class="transfer-footer" slot="left-footer" size="small">全选</el-button>-->
                    <!--<el-button class="transfer-footer" slot="right-footer" size="small">全选</el-button>-->
                </el-transfer>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="resetAuth">取 消</el-button>
                    <el-button type="primary" @click="saveAuth">保 存</el-button>
                </div>
            </el-dialog>

        </el-col>
    </el-row>

</template>

<script>
    import Vue from 'vue';
    import {mapGetters} from 'vuex';
    import {vName, vUrl, trimS, tIndex} from '@/service/utils';
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
        Tooltip,
        Transfer,
        Dropdown,
        DropdownMenu,
        DropdownItem

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
        Vue.use(Tooltip);
        Vue.use(Transfer);
        Vue.use(Dropdown);
        Vue.use(DropdownMenu);
        Vue.use(DropdownItem);
    }


    export default {
        name: 'App',
        data() {

            return {
                // 表格数据
                appList: [],
                Page: 1,
                Size: 10,
                Key: "",
                count: 0,
                formLabelWidth: '120px',
                //编辑创建
                dialogFormVisible: false,
                flagCM: 0,
                form: {
                    name: "",
                    displayname: "",
                    description: "",

                    serveraddress: "",

                    redirecturisArr: "",
                    redirecturis: [],
                    postlogoutredirecturisArr: "",
                    postlogoutredirecturis: [],
                    allowedcorsoriginsArr: "",
                    allowedcorsorigins: []
                },
                // 设置权限
                dialogAuthVisible: false,
                authSelectedList: [],
                authList: [],
                editId: -1,
                rules: {
                    name: [{required: true, message: "请输入名称", trigger: "blur"},
                        {trigger: "blur", validator: vName}],
                    serveraddress: [{required: true, message: "请输入服务器地址", trigger: "blur"},
                        {trigger: "blur", validator: vUrl}],
                    displayName: [{required: true, message: "请输入显示名称", trigger: "blur"}],
                    // redirecturisArr: [{required: true, message: "请输入重定向地址", trigger: "blur"}],
                    // postlogoutredirecturisArr: [{required: true, message: "请输入注销重定向地址", trigger: "blur"}],
                    // allowedcorsoriginsArr: [{required: true, message: "请输入跨越地址", trigger: "blur"}],
                },
            }
        },
        computed: {
            ...mapGetters(["oidcUser"])
        },
        mounted() {
            this.getAppList();
            this.getScope();
        },
        methods: {
            tNo(index) {
                return tIndex(index, this.Page, this.Size)
            },
            async getAppList() {
                try {
                    let res = await service({
                        url: 'application',
                        method: "get",
                        params: {
                            applicationuserid: this.oidcUser.sub,
                            Page: this.Page,
                            Size: this.Size,
                            Key: this.Key
                        }
                    });

                    this.count = res.count;
                    this.appList = res.data;
                } catch (e) {
                    this.$message.error(e.message);
                }
            },
            // 保存api，创建修改

            async editApp(flag, row) {
                this.flagCM = flag;
                this.dialogFormVisible = true;

                if (flag == "1") {
                    try {
                        let res = await service({
                            url: 'application/' + row.id,
                            method: "get",
                        });

                        this.flagCM = "1";

                        this.form = Object.assign({}, {
                            id: res.data.id,
                            name: res.data.name,
                            displayname: res.data.displayname,
                            description: res.data.description,
                            serveraddress: res.data.customerapiresource.serveraddress,
                        });
                    } catch (e) {
                        this.$message.error(e.message);
                    }

                } else {
                    this.form = {
                        redirecturisArr:"",
                        postlogoutredirecturisArr:"",
                        allowedcorsoriginsArr:""
                    }
                }
            },


            saveApp() {
                this.$refs["form"].validate(async valid => {
                    if (valid) {
                        this.form.createuserid = this.oidcUser.sub;

                        if (this.flagCM == "0"){
                            this.form.redirecturis = trimS(this.form.redirecturisArr);
                            this.form.postlogoutredirecturis = trimS(this.form.postlogoutredirecturisArr);
                            this.form.allowedcorsorigins = trimS(this.form.allowedcorsoriginsArr);
                        }


                        let clientPass = "";

                        try {
                            if (this.flagCM == "0") {
                                clientPass = await service({
                                    url: "application",
                                    method: "post",
                                    data: this.form
                                });

                                this.$alert('Secret：' + clientPass.data.value, '提示', {
                                    confirmButtonText: '确定',
                                });
                            }

                            if (this.flagCM == "1") {
                                clientPass = await service({
                                    url: "application/" + this.form.id + "/update",
                                    method: "post",
                                    data: this.form
                                });
                            }

                            this.resetApp();
                            this.getAppList();
                        } catch (e) {
                            console.error("内部错误")
                        }
                    } else {
                        this.$message.error("请正确填写表单");
                    }
                });
            },

            resetApp() {
                this.$refs['form'].resetFields();
                this.dialogFormVisible = false;
                this.form = {};
            },
            // 关联域 2019-07-30 移除，功能到应用客户端
            setAuth(row) {
                this.dialogAuthVisible = true;
                this.editId = row.id;
                this.authSelectedList = this.authList.map(v => {
                    if (_.includes(row.customerclient.allowedscopes, v.name)) {
                        return v.id;
                    }
                })
            },
            // 保存关联域
            async saveAuth() {
                let scopes = this.authList.filter(v => {
                    if (this.authSelectedList.includes(v.id)) {
                        return true;
                    }
                    return false;
                });

                let scopeList = [];

                if (scopes.length > 0) {
                    scopeList = scopes.map(v => {
                        return v.name;
                    });
                }

                try {
                    await service({
                        url: 'application/' + this.editId + "/setpemission",
                        method: "post",
                        data: {
                            id: this.editId,
                            allowedscopes: scopeList
                        }
                    });
                    this.$message({
                        type: 'success',
                        message: '权限设置成功!'
                    });

                    this.resetAuth();
                    this.getAppList();

                } catch (e) {
                    console.error("内部错误")
                }
            },

            resetAuth() {
                this.dialogAuthVisible = false;
                this.authSelectedList = [];
                this.editId = -1;
            },

            // 域，权限 下拉列表
            async getScope() {
                try {
                    let res = await service({
                        url: "clients/getscopes",
                        method: "get"
                    });
                    this.authList = res.data;
                } catch (e) {
                    console.error("内部错误")
                }
            },
            // 重置密码
            resetSecret(row) {
                const that = this;
                this.$confirm("请注意：重置Secret立即生效，所有使用旧Secret的接口将立即失效。为确保授权系统的正常使用，请尽快更新Secret信息。", '重置Secret', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(async () => {
                    try {
                        let res = await service({
                            url: 'application/' + row.id + "/resetsecret",
                            method: "post",
                        });
                        that.$alert('Secret生效，请妥善保管：' + res.data.value, '重置Secret', {
                            confirmButtonText: '确定',
                        });

                        this.getAppList();
                    } catch (e) {
                        this.$message.error(e.message);
                    }

                }).catch(e => {
                    console.log(e)
                })
            },
            // 角色管理
            roleManage(row) {
                this.$router.push("/app/role/" + row.id);
            },
            // 规则管理
            ruleManage(row) {
                this.$router.push("/app/rule/" + row.id);
            },

            toClient(row) {
                this.$router.push("/app/client/" + row.id);
            }

        }

    }
</script>

<style lang="scss">

    .resource-box {
        width: 100%;
        height: 100%;
        padding: 10px 10px 50px;
        // btn-box
        .btn-box {
            .edit-btn, .add-btn, .del-btn {
                width: 20%;
            }
        }

        .resource-search {
            margin: 20px 0;
        }

        .el-pagination {
            text-align: right;
            padding: 20px 0 10px;
        }

        .el-input {
            width: 100%;
        }

        .el-transfer-panel__item {
            width: 100%;
        }

        .el-transfer-panel {
            width: 236px;
        }
    }

</style>