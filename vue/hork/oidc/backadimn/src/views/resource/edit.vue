<template>
    <div>
        <el-row class="resource-box">
            <el-col :span="12" :offset="1">
                <el-form :model="form" ref="form" prop="name" :rules="rules">
                    <el-form-item label="名称" :label-width="formLabelWidth" prop="name">
                        <el-input v-model="form.name" autocomplete="off"  :disabled="!!id"></el-input>
                    </el-form-item>

                    <el-form-item label="显示名称" :label-width="formLabelWidth" prop="displayname">
                        <el-input v-model="form.displayname" autocomplete="off"></el-input>
                    </el-form-item>

                    <el-form-item label="服务器地址" :label-width="formLabelWidth" prop="serveraddress">
                        <el-input v-model="form.serveraddress" autocomplete="off"></el-input>
                    </el-form-item>

                    <el-form-item label="用户声明" :label-width="formLabelWidth" prop="description">
                        <el-select v-model="form.userClaimsIds" placeholder="" multiple>
                            <el-option
                                    v-for="item in claimsList"
                                    :key="item.value"
                                    :label="item.value"
                                    :value="item.key">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
            </el-col>

            <el-col :span="14">
                <el-button type="primary" @click="editScope(0)">添加域</el-button>
            </el-col>
        </el-row>

        <el-row class="resource-box">
            <el-col :span="22" :offset="1">
                <!-- 表格 -->
                <el-table
                        v-if="form.scopes.length>0"
                        :data="form.scopes"
                        style="width: 100%"
                        class="resource-table"
                >
                    <el-table-column
                            prop="id"
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
                            width="150">
                    </el-table-column>
                    <el-table-column
                            prop="description"
                            label="描述"
                            width="150">
                    </el-table-column>
                    <el-table-column
                            label="必选"
                            width="50">
                        <template slot-scope="scope">
                            <div>
                                {{scope.row.required===1?"是":"否"}}
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column
                            label="用户声明"
                            width="100">
                        <template slot-scope="scope">
                            <div v-for="(x, i) in scope.row.scopeArr" :key="i">
                                {{x}}
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column
                            prop="operation"
                            label="操作"
                            wodth="150">
                        <template slot-scope="scope">
                            <div class="btn-box">
                                <div class="edit-btn" @click="editScope(1, scope.row)">编辑</div>
                                <div class="del-btn"
                                     v-if="form.scopes && form.scopes.length!==1"
                                     @click="delScope(scope.row)">删除</div>
                            </div>
                        </template>
                    </el-table-column>
                </el-table>

            </el-col>
        </el-row>

        <el-row>
            <el-col :span="24">
                <el-button @click="close">关闭</el-button>
                <el-button type="primary" @click="saveApi">保存</el-button>
            </el-col>
        </el-row>

        <!-- 弹框 -->
        <el-dialog :title="(flagCM=='1'?'编辑':'新建') +'域'"
                   :close-on-click-modal="false"
                   :visible.sync="dialogFormVisible">
            <el-form :model="scopeForm" ref="scopeForm" :rules="scopeRules">
                <el-form-item label="名称" :label-width="formLabelWidth" prop="name">
                    <el-input v-model="scopeForm.name" autocomplete="off"></el-input>
                </el-form-item>

                <el-form-item label="显示名称" :label-width="formLabelWidth" prop="displayname">
                    <el-input v-model="scopeForm.displayname" autocomplete="off"></el-input>
                </el-form-item>

                <el-form-item label="描述" :label-width="formLabelWidth" prop="description">
                    <el-input v-model="scopeForm.description" autocomplete="off"></el-input>
                </el-form-item>

                <el-form-item label="必选" :label-width="formLabelWidth" prop="required">
                    <el-radio v-model.number="scopeForm.required" :label="1">是</el-radio>
                    <el-radio v-model.number="scopeForm.required" :label="0">否</el-radio>
                </el-form-item>

                <el-form-item label="用户声明" :label-width="formLabelWidth" prop="claims">
                    <el-select v-model="scopeForm.scopeClaimsIds" placeholder="" multiple>
                        <el-option
                                v-for="item in claimsList"
                                :key="item.value"
                                :label="item.value"
                                :value="item.key">
                        </el-option>
                    </el-select>
                </el-form-item>

            </el-form>

            <div slot="footer" class="dialog-footer">
                <el-button @click="resetForm">取 消</el-button>
                <el-button type="primary" @click="addScope">确 定</el-button>
            </div>
        </el-dialog>
    </div>

</template>

<script>
    import Vue from 'vue';
    import {vName, vUrl} from '@/service/utils';
    import service from "@/service/request";
    import {mapGetters} from 'vuex';
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
        Radio,
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
    Vue.use(Radio);
    export default {
        name: 'Resource',
        props: ["id"],
        data() {
            return {
                // 用户声明列表
                claimsList: [],
                // 表格数据
                apiList: [],

                form: {
                    "name": "",
                    "displayname": "",
                    description: "",
                    // 服务地址
                    "serveraddress": "",
                    // 域列表，不填系统自动根据上面信息创建1个
                    "scopes": [],
                    userClaimsIds: []
                },
                // 域列表
                scopeList: [],
                // 弹框开关
                dialogFormVisible: false,
                scopeForm: {
                    "name": "",
                    "displayname": "",
                    "description": "",
                    //必选
                    "required": 1,
                    // 用户声明
                    "userclaims": [],
                    scopeClaimsIds: []
                },
                flagCM: 0,
                formLabelWidth: '120px',
                ids: 0,
                rules: {
                    name: [{required: true, message: "请输入名称", trigger: "blur"},
                        {trigger: "blur", validator: vName}],
                    displayname: [{required: true, message: "请输入显示名称", trigger: "blur"}],
                    serveraddress: [{required: true, message: "请输入服务器地址", trigger: "blur"},
                        {trigger: "blur", validator: vUrl}],
                    userClaimsIds: [{required: true, message: "请选择用户声明", trigger: "blur"}],
                },
                scopeRules: {
                    name: [{required: true, message: "请输入名称", trigger: "blur"}],
                    displayname: [{required: true, message: "请输入显示名称", trigger: "blur"}],
                    description: [{required: true, message: "请输入描述", trigger: "blur"}],
                    userclaims: [{required: true, message: "请选择用户声明", trigger: "blur"}],
                },
            }
        },
        computed: {
            ...mapGetters(["oidcUser"])
        },
        mounted() {
            this.getClaims();
            this.$nextTick(() => {
                if (!!this.id) {
                    this.getApi();
                }
            });

        },
        methods: {
            async getApi() {
                try {
                    let res = await service({
                        url: 'apiresources/' + this.id,
                        method: "get",
                    });

                    let userClaimsIds = res.data.userclaims.map(v => {
                        return v.type;
                    });

                    this.form = Object.assign({}, res.data, {
                        userClaimsIds: userClaimsIds,
                        scopes: (() => {

                            let arr = res.data.scopes.map(v => {
                                let scopeArr = v.userclaims.map(v => {
                                    let sItem = _.find(this.claimsList, (s) => {
                                        return s.key === v.type
                                    });

                                    if (sItem) {
                                        return sItem.value
                                    }

                                });

                                // console.log("scopeArr get:", scopeArr)

                                v.scopeArr = _.filter(scopeArr, (t) => {
                                    return !_.isNil(t)
                                });

                                return v;
                            });

                            return arr.filter(s => {
                                if (_.isNil(s)) {
                                    return false;
                                }

                                return true;
                            })
                        })()
                    });

                } catch (e) {
                    console.error("内部错误")
                }
            },
            async getClaims() {
                try {
                    let res = await service({
                        url: '/dictionaries/apiclaims',
                        method: "get",
                    });

                    this.claimsList = res.data;

                } catch (e) {
                    console.error("内部错误")
                }
            },
            // 保存api，创建修改
            saveApi() {
                this.form.createuserid = this.oidcUser.sub;

                this.$refs["form"].validate(async valid => {
                    if (valid) {
                        this.form.userclaims = _.map(this.form.userClaimsIds, v => {
                            return {
                                type: v
                            }
                        });

                        _.forEach(this.form.scopes, (v) => {
                            let hClaims = _.filter(this.claimsList, (f)=>{
                                if(_.includes(v.scopeArr, f.value)){
                                    return true;
                                }
                                return false;
                            });
                            v.userclaims = _.map(hClaims, s => {
                                return {
                                    type: s.key
                                }
                            });
                        });

                        try {
                            if (!this.id) {
                                await service({
                                    url: 'apiresources',
                                    method: "post",
                                    data: this.form
                                });
                            } else {
                                await service({
                                    url: 'apiresources/' + this.form.id + "/update",
                                    method: "post",
                                    data: this.form
                                });
                            }

                            this.dialogFormVisible = false;
                            this.$router.push("/resource");

                        } catch (e) {
                            console.error("内部错误")
                        }
                    } else {
                        this.$message.error("请正确填写表单");
                    }
                });

            },

            editScope(flag, row) {
                this.flagCM = flag;
                this.dialogFormVisible = true;

                const that = this;

                if (flag == 1) {
                    let scopeClaimsIds = function(){
                        if(row.userclaims.length>0){
                            return row.userclaims.map(v => {
                                let sItem = _.find(that.claimsList, (s) => {
                                    return s.key === v.type
                                });

                                if (sItem) {
                                    return sItem.key
                                }
                            });
                        }else{
                            return row.scopeArr.map(v => {
                                let sItem = _.find(that.claimsList, (s) => {
                                    return s.value === v
                                });

                                if (sItem) {
                                    return sItem.key
                                }
                            });
                        }

                    }();

                    row.scopeClaimsIds = _.filter(scopeClaimsIds, (t) => {
                        return !_.isNil(t)
                    });
                    this.scopeForm = Object.assign({}, row);
                } else {
                    this.scopeForm = {
                        required: 0
                    }
                }
            },
            // 添加编辑域
            addScope() {
                let scopeArr = (() => {
                    let arr = this.claimsList.map(v => {
                        if (_.includes(this.scopeForm.scopeClaimsIds, v.key)) {
                            return v.value
                        }
                    });

                    return arr.filter(s => {
                        if (_.isNil(s)) {
                            return false;
                        }

                        return true;
                    })
                })();
                // 编辑
                if (this.flagCM == 1) {
                    let rindex = this.form.scopes.findIndex((el) => {
                        return el.id === this.scopeForm.id;
                    });

                    if (rindex != -1) {
                        this.$set(this.form.scopes, rindex, Object.assign({}, this.scopeForm, {
                            apiresourceid: this.id,
                            scopeArr: scopeArr
                        }))

                    }

                } else {

                    this.form.scopes.push(Object.assign({
                        id: ++this.ids,
                        apiresourceid: this.id
                    }, this.scopeForm, {scopeArr: scopeArr}));
                }

                this.resetForm();
            },
            // 删除域
            delScope(row) {
                this.$confirm("删除该域吗？", '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(async () => {
                    try {
                        let rindex = this.form.scopes.findIndex((el) => {
                            return el.id === row.id;
                        });

                        if (rindex != -1) {
                            this.form.scopes.splice(rindex, 1);

                            this.$message({
                                type: 'success',
                                message: '删除成功'
                            });

                        } else {
                            this.$message.info("删除失败")
                        }

                    } catch (e) {
                        console.error("内部错误")
                    }

                }).catch((err) => {
                    console.log(err)
                })
            },

            //关闭页面
            close() {
                this.$router.push("/resource");
            },

            resetForm() {
                this.flagCM = 0;
                this.$refs["scopeForm"].resetFields();
                this.dialogFormVisible = false;
            }
        }

    }
</script>

<style lang="scss">

    .resource-box {
        width: 100%;
        height: 100%;
        padding: 10px 10px 50px;

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
    }

</style>