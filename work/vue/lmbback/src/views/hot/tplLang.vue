<template>
    <div>
        <el-row>
            <el-col :span="24">
                <div id="sentence_search">
                    <el-form ref="form" :inline="true"
                             label-width="50px"
                             size="small"
                             class="sentence-form">

                        <el-form-item>
                            <el-button size="small" type="primary" @click="addItem">添加</el-button>
                        </el-form-item>
                    </el-form>
                </div>
            </el-col>
        </el-row>

        <el-row>
            <el-col :span="24">
                <el-table
                        :data="list"
                        :border="true"
                        :stripe="true"
                        size="mini"
                        style="width:100%;"
                >
                    <el-table-column
                            label="序号"
                            type="index"
                            width="80"
                            :index="indexMethod"
                    ></el-table-column>

                    <el-table-column
                            prop="name"
                            label="名称"
                            width="200"
                    ></el-table-column>

                    <el-table-column
                            prop="content"
                            label="简介"
                            width="600"
                    ></el-table-column>

                    <el-table-column
                            prop="tlProperties"
                            label="属性"
                            width="200"
                    >
                        <template slot-scope="scope">
                            <div v-for="(v, i) in scope.row.tlProperties">
                                <p v-if="v.pType!==1 && v.pType!==2">{{v.name}}</p>
                                <p v-if="v.pType===1">{{v.name + ' : ' + v.pValue}}</p>
                                <p v-if="v.pType===2">{{v.name + ' : (' + v.pMix + ' , ' + v.pMax + ')'}}</p>
                            </div>
                        </template>
                    </el-table-column>

                    <el-table-column
                            label="操作"
                    >
                        <template slot-scope="scope">
                            <el-button
                                    type="primary"
                                    size="mini"
                                    @click="openEdit(scope.row)"
                            >修改
                            </el-button>

                            <el-button
                                    type="danger"
                                    size="mini"
                                    @click="deleteItem(scope.row)"
                            >删除
                            </el-button>
                        </template>
                    </el-table-column>

                </el-table>
            </el-col>
        </el-row>

        <el-row>
            <el-col :span="24">
                <!-- 分页 -->
                <div class="pagination-block">
                    <el-pagination
                            @current-change="search"
                            :current-page.sync="page"
                            :page-size="size"
                            layout="prev, pager, next, jumper"
                            :total="count">
                    </el-pagination>
                </div>
            </el-col>
        </el-row>

        <el-dialog
                title="模板语言"
                :visible.sync="addDialogVisible"
                width="50%"
                custom-class="hot-tpllang-form"
        >
            <el-form ref="addForm"
                     label-width="95px"
                     :model="form"
                     :rules="rules"
                     size="small">

                <el-form-item label="语言名称：" prop="name">
                    <el-input
                            style="width:200px"
                            v-model="form.name"
                            placeholder=""></el-input>
                </el-form-item>

                <el-form-item label="简介：" prop="content">
                    <el-input
                            size="medium"
                            type="textarea"
                            :row="8"
                            style="width:660px; height: 180px;"
                            v-model="form.content"
                            placeholder=""></el-input>
                </el-form-item>
            </el-form>

            <el-row style="margin-bottom:15px;">
                <el-col :span="21" :offset="3">
                    <el-table
                            :data="form.tlProperties"
                            :border="true"
                            :stripe="true"
                            size="mini"
                            style="width:100%;"
                    >

                        <el-table-column
                                prop="name"
                                label="名称"
                                width="100"
                        ></el-table-column>

                        <el-table-column
                                prop="pType"
                                label="类型"
                                width="100"
                        ></el-table-column>

                        <el-table-column
                                prop="pValue"
                                label="属性值"
                                width="100"
                        ></el-table-column>

                        <el-table-column
                                prop="pMix"
                                label="最小值"
                                width="100"
                        ></el-table-column>

                        <el-table-column
                                prop="pMax"
                                label="最大值"
                                width="100"
                        ></el-table-column>

                        <el-table-column
                                label="操作"
                        >
                            <template slot-scope="scope">
                                <el-button
                                        type="danger"
                                        size="mini"
                                        @click="delProperty(scope.row)"
                                >删除
                                </el-button>
                            </template>
                        </el-table-column>

                    </el-table>
                </el-col>
            </el-row>

            <el-form ref="mpForm"
                     label-width="95px"
                     :model="mpData"
                     :rules="mprules"
                     inline
                     size="small">

                <el-form-item label="添加属性：" prop="name">
                    <el-input
                            style="width:100px"
                            v-model="mpData.name"
                            placeholder="属性名"></el-input>
                </el-form-item>
                <el-form-item label="" prop="pMix">
                    <el-input
                            style="width:70px; margin-left:10px;"
                            v-model="mpData.pMix"
                            placeholder="最小值"
                    ></el-input>
                </el-form-item>
                <el-form-item label="" prop="pMax">
                    <el-input
                            style="width:70px; margin-left:10px;"
                            v-model="mpData.pMax"
                            placeholder="最大值"
                    ></el-input>
                </el-form-item>

                <el-form-item>
                    <el-button type="primary" @click="addProperty">添加</el-button>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="cancelAdd">取 消</el-button>
                <el-button type="primary" @click="addAjaxItem">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>

    import Vue from "vue";
    import {
        Input,
        Table,
        TableColumn,
        Button,
        Dialog,
        Form,
        FormItem,
        Option,
        Select,
        Pagination,
        Row,
        Col,
        DatePicker,

    } from "element-ui";

    import {Api} from "../../utils/api";
    import service from "@/utils/request"

    {
        Vue.use(Table);
        Vue.use(TableColumn);
        Vue.use(Button);
        Vue.use(Dialog);
        Vue.use(Form);
        Vue.use(FormItem);
        Vue.use(Option);
        Vue.use(Select);
        Vue.use(Pagination);
        Vue.use(Row);
        Vue.use(Col);
        Vue.use(Input);
        Vue.use(DatePicker);
    }


    export default {
        name: "hot-tpllang",
        data: function () {
            return {
                page: 1,
                size: 10,
                count: 0,
                list: [],

                addDialogVisible: false,

                form: {
                    _id: 0,
                    name: "",
                    content: "",
                    tlProperties: []
                },
                rules:{
                    name: [
                        {required: true, message: '请输入语言名称', trigger: 'blur'},
                        {min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur'}
                    ],
                    content: [
                        {min: 1, max: 1000, message: '长度在 1 到 1000 个字符', trigger: 'blur'}
                    ],
                },
                // tlProperties
                mpData: {
                    name: "",
                    pType: "",
                    pValue: "",
                    pMix: "",
                    pMax: "",
                },
                mprules:{
                    name: [
                        {required: true, message: '请输入属性名', trigger: 'blur'},
                        {min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur'}
                    ],
                    pMix: [
                        {min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur'}
                    ],
                    pMax: [
                        {min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur'}
                    ],
                },


                tlList: [],

                isEdit: false
            }
        },

        computed: {
            searchObj: function () {
                return {
                    page: this.page,
                    limit: this.size,
                }
            }
        },
        created: function () {
        },
        mounted: function () {
            this.search();
        },

        methods: {

            // 查询
            search: function () {
                let that = this;

                service({
                    method: "get",
                    url: Api.hotnews_tpl_list,
                    params: that.searchObj
                }).then(function (res) {
                    that.count = res.count;
                    that.list = res.data.map(v => {
                        return v;
                    });
                })
            },

            indexMethod(index) {
                return index + 1 + (this.page - 1) * this.size;
            },
            // 添加
            addItem: function () {
                this.addDialogVisible = true;
            },
            // 添加操作
            addAjaxItem() {
                this.$refs['addForm'].validate((valid) => {
                    if (valid) {
                        let url = "";

                        if (this.isEdit) {
                            url = Api.hotnews_tpl_put;
                        } else {
                            url = Api.hotnews_tpl_add;
                        }
                        service({
                            method: "post",
                            url: url,
                            data: this.form
                        }).then((res) => {
                            if (this.isEdit) {
                                this.$message({
                                    type: "success",
                                    offset: 300,
                                    message: "修改成功"
                                })

                            } else {
                                this.$message({
                                    type: "success",
                                    offset: 300,
                                    message: "添加成功"
                                })

                            }
                            this.search();
                            this.cancelAdd();
                        })
                    }
                })
            },

            // 取消添加
            cancelAdd: function () {
                this.$refs["addForm"].resetFields();
                this.addDialogVisible = false;
            },
            // 修改打开
            openEdit: function (record) {
                this.isEdit = true;
                this.addItem();
                this.form = {...record};
                this.tlList = this.form.tlProperties;
            },
            // 删除
            deleteItem: function (record) {
                var that = this;

                this.$confirm("确认要删除该项吗？", "提示", {
                    type: "warning"
                }).then(function () {
                    service({
                        method: "post",
                        url: Api.hotnews_tpl_del,
                        data: '"' + record._id + '"'
                    }).then(function () {
                        that.$message({
                            type: "success",
                            offset: 300,
                            message: "删除成功"
                        })

                        that.search();
                    }).catch(function () {
                        that.$message({
                            type: "warning",
                            offset: 300,
                            message: "删除失败"
                        })

                    })
                }).catch(function () {
                    console.log("cancel")
                })
            },

            addProperty() {
                this.$refs['mpForm'].validate((valid) => {
                    if (valid) {
                        let obj = {...this.mpData};

                        if (obj.pMax === "") {
                            obj.pType = 1;
                            obj.pValue = obj.pMix;
                            obj.pMix = -1;
                            obj.pMax = -1;
                        } else {
                            obj.pType = 2;
                            obj.pValue = '-';
                            obj.pMix = Number(obj.pMix);
                            obj.pMax = Number(obj.pMax);
                        }

                        this.form.tlProperties.push(obj);
                        this.mpData = {
                            name: "",
                            pType: "",
                            pValue: "",
                            pMix: "",
                            pMax: "",
                        }
                    }else{
                        return false;
                    }
                })
            },

            delProperty(record) {
                let na = _.concat([], this.form.tlProperties);
                _.remove(na, (n) => {
                    return n.name === record.name
                });

                this.$set(this.form, "tlProperties", na);
            }

        }
    }
</script>

<style>
    .hot-tpllang-form .el-textarea__inner {
        height: 100%;
    }
</style>