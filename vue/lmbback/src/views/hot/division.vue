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
                            <el-select v-model="dataType"
                                       placeholder="全部"
                                       size="small"
                                       style="width:120px"
                            >
                                <el-option
                                        v-for="(item, k) in dataTypeList"
                                        :key="item"
                                        :label="item"
                                        :value="item">
                                </el-option>
                            </el-select>
                        </el-form-item>

                        <el-form-item>
                            <el-button size="small" type="primary" @click="searchQuery">查询</el-button>
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
                            prop="dataTypeName"
                            label="类型"
                            width="200"
                    ></el-table-column>

                    <el-table-column
                            prop="subTypeName"
                            label="细分"
                            width="300"
                    ></el-table-column>

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
                title="细分"
                :visible.sync="addDialogVisible"
                :close-on-click-modal="false"
                width="40%"
                custom-class="article-category-form"
        >
            <el-form ref="addForm"
                     label-width="100px"
                     :model="form"
                     :rules="rules"
                     size="small">


                <el-form-item label="类型：" prop="dataTypeName"
                >
                    <el-select v-model="form.dataTypeName"
                               placeholder="请选择"
                               size="small"
                               style="width:120px"
                    >
                        <el-option
                                v-for="(item, k) in dataTypeList"
                                :key="item"
                                :label="item"
                                :value="item">
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="细分：" prop="subTypeName">
                    <el-input
                            style="width:200px"
                            v-model="form.subTypeName"
                            placeholder=""></el-input>
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
        name: "hot-division",
        data: function () {
            const validType = (rule, value, callback) => {
                if (value.length === 0) {
                    callback(new Error("请选择分类"))
                } else {
                    callback();
                }
            };

            return {

                //关键字
                dataType: "",
                page: 1,
                size: 10,
                count: 0,
                list: [],

                addDialogVisible: false,

                form: {
                    dataTypeName: "",
                    subTypeName: "",
                },
                rules: {

                    dataTypeName: [
                        {required: true, message: '请选择细分', trigger: 'blur'},

                    ],
                    subTypeName: [
                        {validator:validType, trigger: 'blur'},


                    ],

                },
                isEdit: false,

                dataTypeList: []
            }
        },

        computed: {
            searchObj: function () {
                return {
                    dataType: this.dataType === '全部' ? "" : this.dataType,
                    page: this.page,
                    limit: this.size,
                }
            }
        },
        created: function () {
            this.getDataType();
        },
        mounted: function () {
            this.search();
        },

        methods: {
            // 话题类型
            getDataType: function () {
                let that = this;

                service({
                    method: "get",
                    url: Api.hotnews_dataType_list,
                    params: that.searchObj
                }).then(function (res) {
                    that.count = res.count;
                    that.dataTypeList = _.concat(["全部"], res.data.map(v => {
                        return v.name
                    }));
                })
            },
            searchQuery() {
                this.page = 1;
                this.search();
            },
            // 查询
            search: function () {
                let that = this;

                service({
                    method: "get",
                    url: Api.hotnews_subdivision_list,
                    params: that.searchObj
                }).then(function (res) {
                    that.count = res.count;
                    that.list = res.data.map(v => {
                        v.addDateTimeV = moment(v.addDateTime).format("YYYY-MM-DD HH:mm:ss");
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
            addAjaxItem: function () {
                this.$refs['addForm'].validate((valid) => {
                    if (valid) {
                        let url = "";

                        if (this.isEdit) {
                            url = Api.hotnews_subdivision_put + "?id=" + this.form._id;
                        } else {
                            url = Api.hotnews_subdivision_add;
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
                    } else {
                        return false;
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
            },
            // 删除
            deleteItem: function (record) {
                var that = this;

                this.$confirm("确认要删除该项吗？", "提示", {
                    type: "warning"
                }).then(function () {
                    service({
                        method: "post",
                        url: Api.hotnews_subdivision_del,
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


        }
    }
</script>

<style scoped>

</style>