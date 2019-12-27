<template>
    <el-row class="rule-box">
        <h1> 规则管理 </h1>
        <el-col :span="22" :offset="1">
            <!-- 模糊查询 -->
            <el-row class="rule-search">
                <el-col :span="5">
                    <el-input
                            placeholder="Method/Url正则"
                            prefix-icon="el-icon-search"
                            v-model="Key">
                    </el-input>
                </el-col>

                <el-col :span="2" :offset="1">
                    <el-button type="primary" size="nomal" @click="()=>getRules()">搜索</el-button>
                </el-col>
                <el-col :span="2">
                    <el-button type="primary" size="nomal" @click="()=>editRule(0)">创建</el-button>
                </el-col>
            </el-row>
            <!-- 表格 -->
            <el-table
                    :data="ruleList"
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
                        prop="methods"
                        label="Method"
                        width="80">
                </el-table-column>
                <el-table-column
                        prop="urlreg"
                        label="Url正则">
                </el-table-column>

                <el-table-column
                        label="关联角色"
                        width="250">
                    <template slot-scope="scope">
                        <div v-for="x in scope.row.rolenames">
                            {{x}}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column
                        prop="operation"
                        label="操作"
                        width="150">

                    <template slot-scope="scope">
                        <div class="btn-box">
                            <div class="edit-btn" @click="editRule(1, scope.row)">编辑</div>
                            <div class="del-btn" @click="delRule(scope.row)">删除</div>
                        </div>
                    </template>


                </el-table-column>
            </el-table>

            <!-- 分页 -->
            <el-pagination
                    background
                    @size-change="()=>getRules()"
                    @current-change="()=>getRules()"
                    :current-page.sync="Page"
                    :page-sizes="[10, 15, 20]"
                    :page-size.sync="Size"
                    layout="sizes, prev, pager, next"
                    :total="count">
            </el-pagination>
            <!-- 弹框 -->
            <el-dialog :title="(flagCM=='1'?'编辑':'新建') +'规则'"
                       :close-on-click-modal="false"
                       :visible.sync="dialogFormVisible">
                <el-form :model="form" :rules="rules" ref="form">

                    <el-form-item label="Method" :label-width="formLabelWidth" prop="methods">
                        <el-select v-model="form.methods" placeholder="">
                            <el-option
                                    v-for="item in methodsList"
                                    :key="item.value"
                                    :label="item.key"
                                    :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="URL正则" :label-width="formLabelWidth" prop="urlreg">
                        <el-input v-model="form.urlreg" autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="名称" :label-width="formLabelWidth" prop="name">
                        <el-input v-model="form.name" autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="描述" :label-width="formLabelWidth" prop="description">
                        <el-input v-model="form.description" autocomplete="off"></el-input>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="resetForm">取 消</el-button>
                    <el-button type="primary" @click="saveRule">保 存</el-button>
                </div>
            </el-dialog>

        </el-col>
    </el-row>
</template>

<script>
    import Vue from 'vue';
    import {tIndex} from '@/service/utils';
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
    }

    export default {
        name: 'Rule',
        data() {
            return {
                // 表格数据
                ruleList: [],
                count: 0,
                // 所属项目
                project: "",
                projectList: [],
                // 创建编辑开关
                dialogFormVisible: false,
                form: {
                    applicationid: this.id,
                    name: '',
                    methods: 'GET',
                    urlreg: '',
                    description: '',
                },
                methodsList: [],
                // 创建编辑指示
                flagCM: 0,

                Page: 1,
                Size: 10,
                Key: "",

                formLabelWidth: '120px',

                rules: {
                    methods: [{required: true, message: "请选择Method", trigger: "change"}],
                    urlreg: [{required: true, message: "请输入正则", trigger: "blur"}],
                    name: [{required: true, message: "请输入名称", trigger: "blur"}],
                },
            }
        },
        props: ["id"],
        mounted() {
            this.getMethodsList();
            this.getRules();
        },
        methods: {
            tNo(index) {
                return tIndex(index, this.Page, this.Size)
            },
            // 规则列表
            async getRules() {
                try {
                    let res = await service({
                        url: 'applications/' + this.id + '/rules',
                        method: "get",
                        params: {
                            Page: this.Page,
                            Size: this.Size,
                            Key: this.Key
                        }
                    });

                    this.count = res.count;
                    this.ruleList = res.data;
                } catch (e) {
                    console.error("内部错误")
                }
            },
            async getRuleById(row) {
                try {
                    let res = await service({
                        url: 'applications/' + this.id + '/rules/' + row.id,
                        method: "get",
                    });

                    this.form = res.data;
                    this.dialogFormVisible = true;
                } catch (e) {
                    console.error("内部错误")
                }
            },
            // 方法字典
            async getMethodsList() {
                try {
                    let res = await service({
                        url: 'dictionaries/methods',
                        method: "get",
                    });

                    this.methodsList = res.data;
                } catch (e) {
                    console.error("内部错误")
                }
            },
            // 保存规则，创建修改
            saveRule() {
                this.$refs["form"].validate(async valid => {
                    if (valid) {
                        try {
                            this.form.applicationid = this.id;


                            if (this.flagCM == "0") {
                                let ve = await service({
                                    url: 'applications/' + this.id + '/rules/exists',
                                    method: "post",
                                    data: this.form
                                });

                                console.log(typeof ve.data, ve.data)

                                if (ve.data === false) {

                                    await service({
                                        url: 'applications/' + this.id + '/rules',
                                        method: "post",
                                        data: this.form
                                    });
                                } else {
                                    this.$message("规则已存在")
                                }

                            }

                            if (this.flagCM == "1") {
                                let ve = await service({
                                    url: 'applications/' + this.id + '/rules/' + this.form.id + '/exists',
                                    method: "post",
                                    data: this.form
                                });

                                if (ve.data == true) {
                                    await service({
                                        url: 'applications/' + this.id + '/rules/' + this.form.id,
                                        method: "post",
                                        data: this.form
                                    });
                                } else {
                                    this.$message("规则已存在")
                                }
                            }

                            this.dialogFormVisible = false;
                            this.resetForm();
                            this.getRules();
                        } catch (e) {
                            console.error("内部错误")
                        }
                    } else {
                        this.$message.error("请正确填写表单");
                    }
                });
            },

            editRule(flag, row) {
                this.flagCM = flag;

                this.dialogFormVisible = true;
                if (flag == "1") {
                    this.getRuleById(row);
                } else {
                    this.form = {
                        methods: "GET"
                    };
                }
            },

            delRule(row) {
                this.$confirm("删除该规则吗？", '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(async () => {
                    try {
                        await service({
                            url: 'applications/' + this.id + '/rules/' + row.id + "/delete",
                            method: "post",
                        });
                        this.$message({
                            type: 'success',
                            message: '删除成功'
                        });
                        this.flagCM = 0;
                        this.getRules();
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
                this.form = {};
            }
        }
    }
</script>

<style lang="scss">
    .rule-box {
        width: 100%;
        height: 100%;
        padding: 10px 10px 50px;

        .rule-search {
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