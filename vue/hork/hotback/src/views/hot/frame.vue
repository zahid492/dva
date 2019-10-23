<template>
    <div>
        <el-row>
            <el-col :span="24">
                <div id="sentence_search">
                    <el-form ref="form" :inline="true"
                             label-width="50px"
                             size="small"
                             class="sentence-form">

                        <el-form-item label="类型："
                                      label-width="50">
                            <el-select v-model="DataTypeName"
                                       placeholder="全部"
                                       size="small"
                                       style="width:120px"
                                       @change="(v)=>changeDataType(v, 0)"
                            >
                                <el-option
                                        v-for="(item, k) in dataTypeList"
                                        :key="item"
                                        :label="item"
                                        :value="item">
                                </el-option>
                            </el-select>
                        </el-form-item>

                        <el-form-item label="细分："
                                      label-width="50">
                            <el-select v-model="SubTypeName"
                                       placeholder="全部"
                                       size="small"
                                       style="width:120px"
                            >
                                <el-option
                                        v-for="(item, k) in divisionList"
                                        :key="item"
                                        :label="item"
                                        :value="item">
                                </el-option>
                            </el-select>
                        </el-form-item>

                        <el-form-item>
                            <el-button size="small" type="primary" @click="search">查询</el-button>
                        </el-form-item>

                        <el-form-item>
                            <el-button size="small" type="primary" @click="addItem">添加</el-button>
                        </el-form-item>
                    </el-form>
                </div>
            </el-col>
        </el-row>

        <el-row>
            <el-col :span="24">
                <vue-virtual-table
                        v-loading="loading"
                        :config="tableConfig"
                        :data="list"
                        :height="600"
                        :itemHeight="90"
                        :minWidth="900"
                        alignItems="left"
                        bordered
                        class="frame-list-table">
                    <template slot-scope="scope" slot="actionCommon">
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
                </vue-virtual-table>
                <!--                <el-table-->
                <!--                        :data="list"-->
                <!--                        :border="true"-->
                <!--                        :stripe="true"-->
                <!--                        size="mini"-->
                <!--                        style="width:100%;"-->
                <!--                >-->
                <!--     -->
                <!--                    <el-table-column-->
                <!--                            label="序号"-->
                <!--                            type="index"-->
                <!--                            width="80"-->
                <!--                            :index="indexMethod"-->
                <!--                    ></el-table-column>-->

                <!--                    <el-table-column-->
                <!--                            prop="dataTypeName"-->
                <!--                            label="类型"-->
                <!--                            width="100"-->
                <!--                    ></el-table-column>-->

                <!--                    <el-table-column-->
                <!--                            prop="subTypeName"-->
                <!--                            label="细分"-->
                <!--                            width="100"-->
                <!--                    ></el-table-column>-->


                <!--                    <el-table-column-->
                <!--                            prop="templateName"-->
                <!--                            label="模板名称"-->
                <!--                            width="200"-->
                <!--                    ></el-table-column>-->

                <!--                    <el-table-column-->
                <!--                            prop="keywords"-->
                <!--                            label="框架关键词"-->
                <!--                            width="100"-->
                <!--                    >-->
                <!--                        <template slot-scope="scope">-->
                <!--                            {{scope.row.keywords.join(", ")}}-->
                <!--                        </template>-->
                <!--                    </el-table-column>-->

                <!--                    <el-table-column-->
                <!--                            prop="name"-->
                <!--                            label="框架名称"-->
                <!--                            width="100"-->
                <!--                    ></el-table-column>-->

                <!--                    <el-table-column-->
                <!--                            prop="module"-->
                <!--                            label="模块"-->
                <!--                            width="100"-->
                <!--                    ></el-table-column>-->

                <!--                    <el-table-column-->
                <!--                            label="操作"-->
                <!--                    >-->
                <!--                        <template slot-scope="scope">-->
                <!--                            <el-button-->
                <!--                                    type="primary"-->
                <!--                                    size="mini"-->
                <!--                                    @click="openEdit(scope.row)"-->
                <!--                            >修改-->
                <!--                            </el-button>-->

                <!--                            <el-button-->
                <!--                                    type="danger"-->
                <!--                                    size="mini"-->
                <!--                                    @click="deleteItem(scope.row)"-->
                <!--                            >删除-->
                <!--                            </el-button>-->
                <!--                        </template>-->
                <!--                    </el-table-column>-->

                <!--                </el-table>-->
            </el-col>
        </el-row>

        <!--        <el-row>-->
        <!--            <el-col :span="24">-->
        <!--                &lt;!&ndash; 分页 &ndash;&gt;-->
        <!--                <div class="pagination-block">-->
        <!--                    <el-pagination-->
        <!--                            @current-change="search"-->
        <!--                            :current-page.sync="page"-->
        <!--                            :page-size="size"-->
        <!--                            layout="prev, pager, next, jumper"-->
        <!--                            :total="count">-->
        <!--                    </el-pagination>-->
        <!--                </div>-->
        <!--            </el-col>-->
        <!--        </el-row>-->

        <el-dialog
                title="框架"
                :visible.sync="addDialogVisible"
                width="40%"
                custom-class="article-category-form"
        >
            <el-form ref="addForm"
                     label-width="90px"
                     :model="form"
                     size="small">

                <el-form-item label="类型："
                              label-width="50">
                    <el-select v-model="form.DataTypeName"
                               placeholder="全部"
                               size="small"
                               style="width:120px"
                               @change="(v)=>changeDataType(v,1)"
                    >
                        <el-option
                                v-for="(item, k) in dataTypeList"
                                :key="item"
                                :label="item"
                                :value="item">
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="细分："
                              label-width="50">
                    <el-select v-model="form.SubTypeName"
                               placeholder="全部"
                               size="small"
                               style="width:120px"
                    >
                        <el-option
                                v-for="(item, k) in divisionList"
                                :key="item"
                                :label="item"
                                :value="item">
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="模板名称：" label-width="50">
                    <el-input
                            style="width:200px"
                            v-model="form.templateName"
                            placeholder=""></el-input>
                </el-form-item>

                <el-form-item label="关键词：" label-width="50">
                    <el-input
                            style="width:200px"
                            v-model="form.keywords"
                            placeholder=""></el-input>
                </el-form-item>

                <el-form-item label="模块：" label-width="50">
                    <el-checkbox-group v-model="form.modules">
                        <el-checkbox
                                name="modules"
                                v-for="item in moduleList"
                                :key="item.id"
                                :label="item.name"></el-checkbox>
                    </el-checkbox-group>
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
    import VueVirtualTable  from 'vue-virtual-table';
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
        Checkbox,
        CheckboxGroup,
        Loading

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
        Vue.use(Checkbox);
        Vue.use(CheckboxGroup);
        Vue.use(Loading);
    }


    export default {
        name: "hot-frame",
        data: function () {
            return {
                //关键字
                // 话题类型
                DataTypeName: "",
                // 细分名称
                SubTypeName: "",
                key: "",
                page: 1,
                size: 15,
                count: 0,
                list: [],
                loading: false,

                addDialogVisible: false,

                form: {
                    _id: 0,
                    // 话题类型
                    dataTypeName: "",
                    // 细分名称
                    subTypeName: "",
                    templateId: "",
                    templateName: "",
                    name: "",
                    keywords: [],
                    modules: []
                },

                isEdit: false,

                divisionList: [],
                dataTypeList: [],

                divisionFormList: [],
                moduleList: [],

                tableConfig: [{
                    prop: "index",
                    name: "序号",
                    width: 60,
                },{
                    prop: "dataTypeName",
                    name: "类型",
                    width: 100,
                }, {
                    prop: "subTypeName",
                    name: "细分",
                    width: 100,
                }, {
                    prop: "templateName",
                    name: "模板名称",
                    width: 100,
                }, {
                    prop: "kw",
                    name: "框架关键词",
                    width: 300,
                }, {
                    prop: "name",
                    name: "框架名称",
                    width: 200,
                }, {
                    prop: "md",
                    name: "模块",
                    width: 200,
                }]

            }
        },
        components: {
            'vue-virtual-table': VueVirtualTable
        },

        computed: {
            searchObj: function () {
                return {
                    page: this.page,
                    limit: this.size,
                    dataType: this.DataTypeName,
                    SubTypeName: this.SubTypeName,
                }
            }
        },
        created: function () {
            this.getDataType();
            this.getModule();
        },
        mounted: function () {

        },

        methods: {

            changeDataType(v, flag) {
                if (flag === 0) {
                    this.SubTypeName = "";
                    this.divisionList = [];
                } else {
                    this.form.subTypeName = "";
                    this.divisionFormList = [];
                }
                this.getSubDivsion(v, flag);
            },

            // 话题类型
            getDataType: function () {
                let that = this;

                service({
                    method: "get",
                    url: Api.hotnews_dataType_list,
                    params: that.searchObj
                }).then(function (res) {
                    that.count = res.count;
                    that.dataTypeList = res.data.map(v => {
                        return v.name
                    });
                })
            },

            // 细分
            getSubDivsion: function (datatype, flag) {
                let that = this;

                service({
                    method: "get",
                    url: Api.hotnews_subdivision_list,
                    params: {
                        page: 1,
                        limit: 1000,
                        dataType: datatype
                    }
                }).then(function (res) {
                    that.count = res.count;
                    if (flag === 0) {
                        that.divisionList = res.data.map(v => {
                            return v.subTypeName
                        });
                    } else {
                        that.divisionFormList = res.data.map(v => {
                            return v.subTypeName
                        });
                    }

                })
            },

            // 模块
            getModule: function () {
                let that = this;

                service({
                    method: "get",
                    url: Api.hotnews_module_list,
                    params: {
                        page: 1,
                        limit: 1000,
                    }
                }).then(function (res) {
                    that.count = res.count;
                    that.moduleList = res.data.map(x => {
                        return {id: x._id, name: x.moduleName}
                    });
                })
            },

            // 查询
            search: function () {
                let that = this;
                that.loading = true;

                service({
                    method: "get",
                    url: Api.hotnews_framework_list,
                    params: that.searchObj
                }).then(function (res) {
                    that.count = res.count;
                    that.list = res.data.map((v, i) => {
                        v.kw = v.keywords.join(", ");
                        v.md = v.modules.map(s=>{
                            return s.name
                        }).join(", ");

                        v.index = i+1;
                        return v;
                    });
                    that.loading = false;
                })
            },

            indexMethod: function (index) {
                return index + 1;
            },
            // 添加
            addItem: function () {
                this.addDialogVisible = true;
            },
            // 添加操作
            addAjaxItem: function () {
                let that = this;
                let url = "";

                if (this.isEdit) {
                    url = Api.hotnews_framework_put;
                } else {
                    url = Api.hotnews_framework_add;
                }

                let keys = that.form.keywords.replace(/，/gi, ',').replace(/,$/gi, '').split(',');

                if (keys.length > 10) {
                    keys = keys.slice(0, 9);
                }

                service({
                    method: "post",
                    url: url,
                    data: {
                        ...that.form,
                        keywords: keys
                    }
                }).then(function (res) {
                    if (that.isEdit) {
                              that.$message({
                            type:"success",
                            offset: 300,
                            message: "修改成功"
                        })

                    } else {
                              that.$message({
                            type:"success",
                            offset: 300,
                            message: "添加成功"
                        })

                    }
                    that.search();
                    that.cancelAdd();
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
                this.form = record;
            },
            // 删除
            deleteItem: function (record) {
                var that = this;

                this.$confirm("确认要删除该项吗？", "提示", {
                    type: "warning"
                }).then(function () {
                    service({
                        method: "post",
                        url: Api.hotnews_framework_del,
                        data: {
                            id: record._id
                        }
                    }).then(function () {
                              that.$message({
                            type:"success",
                            offset: 300,
                            message: "删除成功"
                        })

                        that.search();
                    }).catch(function () {
                              that.$message({
                            type:"warning",
                            offset: 300,
                            message: "删除失败"
                        })

                    })
                }).catch(function () {
                    console.log("cancel")
                })
            },


        }
    }
</script>

<style>
    .frame-list-table .item-cell-inner {
        text-align: left;
    }
</style>