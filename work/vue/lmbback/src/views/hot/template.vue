<template>
    <div>
        <el-row>
            <el-col :span="24">
                <div id="sentence_search">
                    <el-form ref="form" :inline="true"
                             label-width="50px"
                             size="small"
                             class="sentence-form">

                        <el-form-item label="关键字：" label-width="50">
                            <el-input
                                    style="width:120px"
                                    v-model="key"
                                    placeholder=""></el-input>
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
                            prop="name"
                            label="名称"
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
                title="模板"
                :visible.sync="addDialogVisible"
                width="50%"
                custom-class="hot-tpl-form"
                :close-on-click-modal="false"
        >
            <el-form ref="addForm"
                     label-width="100px"
                     :model="form"
                     :rules="rules"
                     size="small">

                <el-form-item label="名称：" prop="name">
                    <el-input
                            style="width:200px"
                            v-model="form.name"
                            placeholder=""></el-input>
                </el-form-item>

                <el-form-item label="内容：" prop="content">
                    <el-input
                            size="medium"
                            type="textarea"
                            :row="20"
                            style="width:660px; height: 400px;"
                            v-model="form.content"
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
        name: "hot-tpl",
        data: function () {
            const tpl = '<!DOCTYPE html> \n' +
                '<html lang="en"> \n' +
                '<head> \n' +
                '<meta charset="UTF-8"> \n' +
                '<title></title> \n' +
                '</head> \n' +
                '<body> \n \n \n' +
                '</body> \n' +
                '</html> \n';
            return {
                platformList: ['新浪微博'],
                categorys: ['娱乐', '体育', '财经', '人文', '科技', '互联网', '数码', '社会', '汽车', '房产', '旅游', '时尚', '星座', '美食', '生活', '育儿', '影视', '音乐', '动漫', '搞笑', '教育', '文化', '宠物', '游戏', '家居', '摄影', '健康', '养生', '科学', '综合', '其它'],
                //关键字
                key: "",
                page: 1,
                size: 10,
                count: 0,
                list: [],

                addDialogVisible: false,

                form: {
                    _id: 0,
                    name: "",
                    content: tpl
                },
                rules: {
                    name: [
                        {required: true, message: '请输入名称', trigger: 'blur'},
                        {min: 1, max: 120, message: '长度在 1 到 120 个字符', trigger: 'blur'}

                    ],
                    content: [
                        {required: true, message: '请输入内容', trigger: 'blur'},
                    ],

                },

                isEdit: false
            }
        },

        computed: {
            searchObj: function () {
                return {
                    key: this.key.trim(),
                    page: this.page,
                    size: this.size,
                }
            }
        },
        created: function () {
        },
        mounted: function () {
            this.search();
        },

        methods: {
            searchQuery(){
                this.page=1;
                this.search();
            },
            // 查询
            search: function () {
                let that = this;

                service({
                    method: "get",
                    url: Api.hotnews_template_list,
                    params: that.searchObj
                }).then(function (res) {
                    that.count = res.count;
                    that.list = res.data.map(v => {
                        return v;
                    });
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
                this.$refs["addForm"].validate((valid) => {
                    if (valid) {
                        let url = "";

                        if (this.isEdit) {
                            url = Api.hotnews_template_put;
                        } else {
                            url = Api.hotnews_template_add;
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
            },
            // 删除
            deleteItem: function (record) {
                var that = this;

                this.$confirm("确认要删除该项吗？", "提示", {
                    type: "warning"
                }).then(function () {
                    service({
                        method: "post",
                        url: Api.hotnews_template_del,
                        data: '"' + record._id + '"'
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
    .hot-tpl-form .el-textarea__inner{
        height: 100%;
    }
</style>