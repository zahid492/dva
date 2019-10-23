<template>
    <el-row class="client-box">
        <h1>客户端管理</h1>
        <el-col :span="22" :offset="1">
            <!-- 模糊查询 -->
            <el-row class="client-search">
                <el-col :span="5">
                    <el-input placeholder="名称/显示名称" prefix-icon="el-icon-search" v-model="Key"></el-input>
                </el-col>
                <el-col :span="7" :offset="1">
                    <span>授权类型&nbsp;&nbsp;&nbsp;</span>
                    <el-select v-model="GrantTypeKey" placeholder="全部">
                        <el-option v-for="item in grantList"
                                   :key="item.code"
                                   :label="item.showname"
                                   :value="item.code"></el-option>
                    </el-select>
                </el-col>
                <el-col :span="2" :offset="1">
                    <el-button type="primary" size="nomal" @click="()=>getClient()">搜索</el-button>
                </el-col>
                <el-col :span="2">
                    <el-button type="primary" size="nomal" @click="editClient(0)">创建</el-button>
                </el-col>
            </el-row>
            <!-- 表格 -->
            <el-table :data="clientList" style="width: 100%" class="client-table">
                <el-table-column
                        type="index"
                        :index="tNo"
                        label="ID"
                        width="50"></el-table-column>
                <el-table-column prop="clientid" label="客户端Id" width="100"></el-table-column>
                <el-table-column prop="clientname" label="显示名称" width="100"></el-table-column>
                <el-table-column prop="allowedgranttypes" label="授权类型" width="150">
                    <template slot-scope="scope">
                        <div v-for="(x, i) in scope.row.allowedgranttypes" :key="i">
                            {{x.grantname}}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="重定向Url" width="350">
                    <template slot-scope="scope">
                        <div :class="{scrollBox:scope.row.redirecturis.length>4}">
                            <div v-for="(x, i) in scope.row.redirecturis" :key="i">
                                {{x}}
                            </div>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="允许域">
                    <template slot-scope="scope">
                        <div :class="{scrollBox:scope.row.allowedscopes.length>4}">
                            <div v-for="(x, i) in scope.row.allowedscopes" :key="i">
                                {{x}}
                            </div>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="operation" label="操作" width="200">
                    <template slot-scope="scope">
                        <div class="btn-box">
                            <div class="edit-btn" @click="editClient(1, scope.row)">编辑</div>
                            <div class="del-btn" @click="delClient(scope.row)">删除</div>
                            <div class="del-btn"
                                 style="width: 40%"
                                 v-if="scope.row.allowedgranttypes[0].granttype=='client_credentials'"
                                 @click="resetSecret(scope.row)">重置Secret
                            </div>
                        </div>
                    </template>
                </el-table-column>
            </el-table>

            <!-- 分页 -->
            <el-pagination
                    background
                    @size-change="()=>getClient()"
                    @current-change="()=>getClient()"
                    :current-page.sync="Page"
                    :page-sizes="[10, 15, 20]"
                    :page-size.sync="Size"
                    layout="sizes, prev, pager, next"
                    :total="count"
            ></el-pagination>
            <!-- 弹框 -->
            <el-dialog
                    :title="(flagCM=='1'?'编辑':'新建') +'客户端'"
                    @close="resetForm"
                    :close-on-click-modal="false"
                    :visible.sync="dialogFormVisible">
                <el-form :model="form" ref="form" :rules="rules">
                    <el-form-item label="客户端Id" :label-width="formLabelWidth" prop="clientid">
                        <el-input v-model="form.clientid" :disabled="flagCM=='1'"></el-input>
                    </el-form-item>
                    <el-form-item label="名称" :label-width="formLabelWidth" prop="clientname">
                        <el-input v-model="form.clientname"></el-input>
                    </el-form-item>
                    <el-form-item label="授权类型" :label-width="formLabelWidth" prop="allowedgranttypes">
                        <el-select v-model="form.allowedgranttypes"
                                   @change="changeGrantType"
                                   placeholder="请选择">
                            <el-option v-for="item in grantFormList"
                                       :key="item.code"
                                       :label="item.showname"
                                       :value="item.code"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="scope" :label-width="formLabelWidth" prop="allowedscopes">
                        <el-select v-model="form.allowedscopes" multiple placeholder="请选择">
                            <el-option v-for="item in scopeFormList"
                                       :key="item.displayname"
                                       :label="item.name"
                                       :value="item.name">
                                <span style="float: left; font-size: 12px">{{ item.name }}</span>
                                <span style="float: right; color: #999; font-size: 12px; padding:0 20px;">{{ item.displayname }}</span>

                            </el-option>
                        </el-select>
                    </el-form-item>

                    <div v-if="hasRedirectUrl || (form.allowedgranttypes!=='client_credentials')">
                        <el-form-item label="重定向Url" :label-width="formLabelWidth" prop="redirecturisArr">
                            <el-input
                                    type="textarea"
                                    :rows="3"
                                    placeholder="换行添加多个"
                                    v-model="form.redirecturisArr"></el-input>
                        </el-form-item>
                        <el-form-item label="注销重定向Url" :label-width="formLabelWidth" prop="postlogoutredirecturisArr">
                            <el-input
                                    type="textarea"
                                    :rows="3"
                                    placeholder="换行添加多个"
                                    v-model="form.postlogoutredirecturisArr"></el-input>
                        </el-form-item>
                        <el-form-item label="允许跨域Url" :label-width="formLabelWidth" prop="allowedcorsoriginsArr">
                            <el-input
                                    type="textarea"
                                    placeholder="* 默认全部，换行添加多个"
                                    :rows="3"
                                    v-model="form.allowedcorsoriginsArr"></el-input>
                        </el-form-item>
                    </div>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="resetForm">取 消</el-button>
                    <el-button type="primary" @click="saveClient">保 存</el-button>
                </div>
            </el-dialog>
        </el-col>
    </el-row>
</template>

<script>
    import Vue from "vue";
    import {mapGetters} from 'vuex';
    import {vName, trimS, tIndex} from '@/service/utils';
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
        CheckboxGroup
    } from "element-ui";


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
    export default {
        name: "Client",
        data() {

            return {
                grantList: [{showname: "全部", code: -1}],
                // 表格数据
                clientList: [],
                grantFormList: [],
                scopeFormList: [],
                Page: 1,
                Size: 10,
                Key: "",
                GrantTypeKey: -1,
                count: 0,
                editRow: undefined,

                // 弹框开关
                dialogFormVisible: false,
                form: {
                    clientid: "",
                    clientname: "",
                    allowedgranttypes: "",
                    allowedscopes: [],

                    redirecturisArr: "",
                    redirecturis: [],
                    postlogoutredirecturisArr: "",
                    postlogoutredirecturis: [],
                    allowedcorsoriginsArr: "",
                    allowedcorsorigins: []
                },
                formLabelWidth: "120px",
                //   创建编辑指示
                flagCM: 0,
                hasRedirectUrl: false,
                rules: {
                    clientid: [{required: true, message: "请输入客户id", trigger: "blur"},
                        {trigger: "blur", validator: vName}],
                    clientname: [{required: true, message: "请输入名称", trigger: "blur"}],
                    allowedgranttypes: [{required: true, message: "请选择授权类型", trigger: "blur"}],
                    allowedscopes: [{required: true, message: "请选择域", trigger: "blur"}],
                    redirecturisArr: [{required: true, message: "请输入重定向地址", trigger: "blur"}],
                    postlogoutredirecturisArr: [{required: true, message: "请输入注销重定向地址", trigger: "blur"}],
                    allowedcorsoriginsArr: [{required: true, message: "请输入跨越地址", trigger: "blur"}],
                }
            };
        },
        computed: {
            ...mapGetters(["oidcUser"])
        },
        mounted() {
            this.getScope();
            this.getClient();
            this.getGrants();
        },
        methods: {
            tNo(index) {
                return tIndex(index, this.Page, this.Size)
            },
            // 客户端列表
            async getClient() {
                try {
                    var s = this.GrantTypeKey === -1 ? "" : this.GrantTypeKey;
                    let res = await service({
                        url: "clients",
                        method: "get",
                        params: {
                            Page: this.Page,
                            Size: this.Size,
                            Key: this.Key,
                            GrantTypeKey: s,
                        }
                    });
                    this.count = res.count;
                    this.clientList = _.map(res.data, v => {
                        v.allowedscopesArr = _.map(v.allowedscopes, s => {
                            let f = _.find(this.scopeFormList, {name: s});
                            if (f) {
                                return f.displayname;
                            }
                        });
                        return v;
                    });
                } catch (e) {
                    console.error("内部错误")
                }
            },
            // 授权类型下拉列表
            async getGrants() {
                try {
                    let res = await service({
                        url: "clients/getgrants",
                        method: "get"
                    });
                    this.grantList = [].concat([{showname: "全部", code: -1}], res.data);
                    this.grantFormList = res.data;
                } catch (e) {
                    console.error("内部错误")
                }
            },
            // 域下拉列表
            async getScope() {
                try {
                    let res = await service({
                        url: "clients/" + this.oidcUser.id + "/getscopes",
                        method: "get",

                    });
                    this.scopeFormList = res.data;
                } catch (e) {
                    console.error("内部错误")
                }
            },

            // 保存创建
            saveClient() {
                this.$refs["form"].validate(async valid => {
                    if (valid) {
                        this.form.CreateUserId = this.oidcUser.sub;

                        this.form.allowedgranttype = this.form.allowedgranttypes;

                        if (this.form.allowedgranttype !== "client_credentials") {
                            this.form.redirecturis = trimS(this.form.redirecturisArr);
                            this.form.postlogoutredirecturis = trimS(this.form.postlogoutredirecturisArr);
                            this.form.allowedcorsorigins = trimS(this.form.allowedcorsoriginsArr);
                        }

                        let clientPass = "";
                        try {
                            if (this.flagCM == "0") {
                                clientPass = await service({
                                    url: "clients",
                                    method: "post",
                                    data: this.form
                                });

                            }

                            if (this.flagCM == "1") {
                                clientPass = await service({
                                    url: "clients/" + this.form.id + "/update",
                                    method: "post",
                                    data: this.form
                                });
                            }

                            if (this.form.allowedgranttypes === "client_credentials"
                                && this.flagCM == "0" ) {

                                this.$alert('密码：' + clientPass.data.value, '密码提示', {
                                    confirmButtonText: '确定',
                                });
                            }

                            this.dialogFormVisible = false;
                            this.getClient();
                        } catch (e) {
                            console.error("内部错误")
                        }
                    } else {
                        this.$message.error("请正确填写表单");
                    }
                });
            },
            // 编辑
            editClient(flag, row) {
                this.flagCM = flag;
                this.dialogFormVisible = true;


                if (flag == "1") {
                    this.editRow = row;
                    this.form = Object.assign({}, row, {
                        redirecturisArr: row.redirecturis.join("\n"),
                        postlogoutredirecturisArr: row.postlogoutredirecturis.join("\n"),
                        allowedcorsoriginsArr: row.allowedcorsorigins.join("\n"),
                        allowedgranttypes: row.allowedgranttypes[0].granttype
                    });
                }
            },
            // 删除
            delClient(row) {
                this.$confirm("删除该信息吗？", '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(async () => {
                    try {
                        await service({
                            url: 'clients/' + row.id + "/delete",
                            method: "post",
                        });
                        this.$message({
                            type: 'success',
                            message: '删除成功'
                        });
                        this.flagCM = 0;
                        this.getClient();
                    } catch (e) {
                        console.error("内部错误")
                    }

                }).catch(e => {
                    console.warn(e);
                })
            },
            // 重置表单
            resetForm() {
                this.$refs['form'].resetFields();
                this.form = {};
                this.dialogFormVisible = false;
            },
            // todo 3个重定向变可选提交时候
            changeGrantType(typecode) {
                if (typecode === "authorization_code") {
                    this.hasRedirectUrl = true;
                } else {
                    this.hasRedirectUrl = false;
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
                            url: 'clients/' + row.id + "/resetsecret",
                            method: "post",
                        });
                        that.$alert('Secret生效，请妥善保管：' + res.data.value, '重置Secret', {
                            confirmButtonText: '确定',
                        });

                    } catch (e) {
                        this.$message.error(e.message);
                    }

                }).catch(e => {
                    console.log(e)
                })
            },
        }
    }
    ;
</script>

<style lang="scss">
    .scrollBox {
        height: 120px;
        overflow-y: auto;
    }

    .client-box {
        width: 100%;
        height: 100%;
        padding: 10px 10px 50px;

        .client-search {
            margin: 20px 0;
        }

        .el-pagination {
            text-align: right;
            padding: 20px 0 10px;
        }


    }
</style>