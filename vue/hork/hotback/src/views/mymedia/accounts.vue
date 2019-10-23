<template>
    <div>
        <el-row>
            <el-col :span="24">
                <div id="sentence_search">
                    <el-form ref="form" :inline="true"
                             label-width="50px"
                             size="small"
                             class="sentence-form">
                        <el-form-item label="平台："
                                      label-width="50">
                            <el-select v-model="platform"
                                       placeholder="全部"
                                       size="small"
                                       style="width:120px"
                            >
                                <el-option
                                        v-for="(item, i) in platformList"
                                        :key="item._id"
                                        :label="item.name"
                                        :value="item.name">
                                </el-option>
                            </el-select>
                        </el-form-item>

                        <el-form-item label="启停状态："
                                      label-width="50">
                            <el-select v-model="status"
                                       placeholder="全部"
                                       size="small"
                                       style="width:120px"
                            >

                                <el-option key="-1" label="全部" :value="-1">
                                </el-option>
                                <el-option key="1" label="启用" :value="1">
                                </el-option>
                                <el-option key="0" label="停用" :value="0">
                                </el-option>
                            </el-select>
                        </el-form-item>

                        <el-form-item label="异常类别："
                                      label-width="50">
                            <el-select v-model="normal"
                                       placeholder="全部"
                                       size="small"
                                       style="width:120px"
                            >
                                <el-option key="-1" label="全部" :value="-1"></el-option>
                                <el-option key="1" label="正常" :value="1"></el-option>
                                <el-option key="0" label="异常" :value="0"></el-option>
                            </el-select>
                        </el-form-item>

                        <el-form-item label="关键字：" label-width="50">
                            <el-input
                                    style="width:120px"
                                    v-model="key"
                                    placeholder=""></el-input>
                        </el-form-item>

                        <el-form-item>
                            <el-button size="small" type="primary" @click="search">查询</el-button>
                        </el-form-item>

                        <el-form-item>
                            <el-button size="small" type="primary" @click="addOpen">添加</el-button>
                        </el-form-item>


                        <el-form-item>
                            <el-button size="small" type="primary" @click="exportTaskExcel">导出</el-button>
                        </el-form-item>
                    </el-form>
                </div>
            </el-col>
        </el-row>

        <el-row>
            <el-col :span="24">
                <el-table
                        v-loading="loading"
                        :data="list"
                        :border="true"
                        :stripe="true"
                        :row-key="rowKey"
                        size="mini"
                        style="width:100%;"
                >
                    <el-table-column
                            label="序号"
                            type="index"
                            width="50"
                            :index="indexMethod"
                    ></el-table-column>

                    <el-table-column
                            prop="name"
                            label="账号名称"
                            width="120"
                    ></el-table-column>

                    <el-table-column
                            prop="category"
                            label="分类"
                            width="80"
                    ></el-table-column>

                    <el-table-column
                            prop="platform"
                            label="平台"
                            width="100"
                    >
                    </el-table-column>

                    <el-table-column
                            prop="statusName"
                            label="启停状态"
                            width="70"
                    >
                    </el-table-column>

                    <el-table-column
                            prop="normalName"
                            label="异常状态"
                            width="70"
                    >
                    </el-table-column>

                    <el-table-column
                            prop="publishTypesStr"
                            label="发布分类"
                    >
                    </el-table-column>

                    <el-table-column
                            prop="fansCnt"
                            label="粉丝数"
                            width="70"
                    >
                    </el-table-column>

                    <el-table-column
                            prop="publishInterval"
                            label="发布间隔"
                            width="80"
                    >
                        <template slot-scope="scope">
                            {{scope.row.publishInterval===0?"-":scope.row.publishInterval+"小时"}}
                        </template>
                    </el-table-column>

                    <el-table-column
                            prop="timeRange"
                            label="发布时段"
                            width="100"
                    >
                    </el-table-column>

                    <el-table-column
                            label="操作"
                    >
                        <template slot-scope="scope">

                            <el-button type="primary" size="mini" @click="editOpen(scope.row)">编辑</el-button>
                            <el-button :type="scope.row.status===1?'':'warning'" size="mini"
                                       @click="accountStop(scope.row)">
                                {{scope.row.status===1?"停用":"启用"}}
                            </el-button>

                            <el-button type="success" size="mini"
                                       v-if="scope.row.normal!==1"
                                       @click="statusOpen(scope.row)">正常
                            </el-button>

                            <el-button :type="scope.row.enablePublish===1?'':'warning'"
                                       size="mini"
                                       @click="publishOpen(scope.row)">
                                {{scope.row.enablePublish===1?"停止":"自动"}}发布
                            </el-button>
                            <el-button size="mini" @click="cookieOpen(scope.row)" class="cookie-refresh">刷新cookie</el-button>

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

        <!--   添加     -->
        <el-dialog
                title="账号"
                :visible.sync="addAuthVisible"
                width="40%"
                custom-class="article-category-form"
        >
            <el-form ref="addForm"
                     label-width="100px"
                     :model="form"
                     size="small">

                <el-form-item label="平台："
                >
                    <el-select v-model="authPlatform"
                               placeholder="请选择平台"
                               size="small"
                               style="width:200px"
                    >
                        <el-option
                                v-for="(item, i) in authList"
                                :key="item._id"
                                :label="item.account_type"
                                :value="item.loginUrl">
                        </el-option>
                    </el-select>
                </el-form-item>

            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="cancelAuth">取 消</el-button>
                <el-button type="primary" @click="addAuthItem" id="account_add">确 定</el-button>
            </div>
        </el-dialog>

        <!--    编辑，appid 不修改    -->
        <el-dialog
                title="账号"
                :visible.sync="addDialogVisible"
                width="40%"
                custom-class="article-category-form"
        >
            <el-form ref="addForm"
                     label-width="100px"
                     :model="form"
                     size="small">

                <el-form-item label="平台："
                >
                    <el-select v-model="form.platform"
                               placeholder="全部"
                               size="small"
                               style="width:200px"
                    >
                        <el-option
                                v-for="(item, i) in platformList"
                                :key="item._id"
                                :label="item.name"
                                :value="item.name">
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="账号名称：">
                    <el-input
                            style="width:200px"
                            v-model="form.name"
                            placeholder=""></el-input>
                </el-form-item>


                <el-form-item label="账号分类："
                >
                    <el-select v-model="form.categoryId"
                               placeholder="全部"
                               size="small"
                               style="width:200px"
                               @change="getRelationArticleType"
                    >
                        <el-option
                                v-for="(item, i) in accountTypeList"
                                :key="item._id"
                                :label="item.name"
                                :value="item._id">
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="文章分类："
                >
<!--                    <el-select v-model="form.publishTypes"-->
<!--                               placeholder="全部"-->
<!--                               size="small"-->
<!--                               multiple-->
<!--                               style="width:400px"-->
<!--                    >-->
<!--                        <el-option-->
<!--                                v-for="(item, i) in articleTypeList"-->
<!--                                :key="item"-->
<!--                                :label="item"-->
<!--                                :value="item">-->
<!--                        </el-option>-->
<!--                    </el-select>-->
                    <el-input
                            style="width:400px"
                            :disabled="true"
                            v-model="form.publishTypesStr"
                            placeholder=""></el-input>

                </el-form-item>


                <el-form-item label="发布时段：">
                    <el-time-picker
                            style="width:200px"
                            size="small"
                            is-range
                            start-placeholder="开始时间"
                            end-placeholder="结束时间"
                            v-model="form.timeRange"
                            format="HH:mm"
                            value-format="HH:mm"
                    ></el-time-picker>

                </el-form-item>

                <el-form-item label="发布间隔：">

                    <el-select v-model="form.publishInterval"
                               placeholder="请选择"
                               size="small"
                               style="width:200px"
                    >
                        <el-option
                                v-for="(item) in publishIntervalList"
                                :key="item"
                                :label="item+'小时'"
                                :value="item">
                        </el-option>
                    </el-select>
                </el-form-item>

                <!--                <el-form-item label="AppID：">-->
                <!--                    <el-input-->
                <!--                            style="width:200px"-->
                <!--                            v-model="form.appId"-->
                <!--                            placeholder=""></el-input>-->
                <!--                </el-form-item>-->

                <!--                <el-form-item label="AppToken：">-->
                <!--                    <el-input-->
                <!--                            style="width:200px"-->
                <!--                            v-model="form.appToken"-->
                <!--                            placeholder=""></el-input>-->
                <!--                </el-form-item>-->

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
        TimePicker,
        Loading

    } from "element-ui";


    import {Api} from "../../utils/api";
    import service from "@/utils/request";

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
        Vue.use(TimePicker);
        Vue.use(Loading);
    }

    import Cookies from "js-cookie";

    const moment = window.moment;

    export default {
        name: "mymedia-accounts",
        data: function () {
            return {
                platform: "全部",
                //异常类别
                normal: -1,
                status: -1,
                //关键字
                key: "",
                loading: false,

                page: 1,
                size: 10,
                count: 0,

                list: [],
                //平台
                platformList: [],

                addDialogVisible: false,
                addAuthVisible: false,

                form: {
                    name: "",
                    category: "",
                    categoryId: "",
                    platform: "",
                    appId: "",
                    appToken: "",
                    publishTypes: [],
                    publishInterval: 0,
                    timeRange: [],
                    cookie: "",
                },

                publishIntervalList: _.range(1, 25),

                isEdit: false,

                accountTypeList: [],

                articleTypeList: [],
                // 平台添加url
                authPlatform: "",
                authList: [],

                timer:null,
            }
        },

        computed: {
            searchObj: function () {
                return {
                    page: this.page,
                    size: this.size,

                    platform: this.platform === "全部" ? "" : this.platform,

                    key: this.key.trim(),
                    status: this.status,
                    normal: this.normal,
                }
            }
        },
        created: function () {
            this.getplatformList();
            this.getAccountType();
            // this.getArticleType();
            this.getAuthList();
        },
        mounted: function () {
            this.search();
        },

        methods: {
            rowKey(row) {
                return row._id;
            },
            // 查询
            search() {
                this.loading = true;

                service({
                    method: "get",
                    url: Api.mymedia_account_list,
                    params: this.searchObj
                }).then((res) => {
                    if (res.data.length > 0) {
                        this.count = res.count;
                        this.list = res.data.map(v => {
                            if (v.timeStart && v.timeEnd) {
                                v.timeRange = v.timeStart + "-" + v.timeEnd;
                            } else {
                                v.timeRange = "-"
                            }

                            v.statusName = v.status === 0 ? "停用" : "启用";
                            v.normalName = v.normal === 1 ? "正常" : "异常";
                            v.enablePublishName = v.enablePublish === 1 ? "自动" : "停止";
                            v.publishTypesStr = _.isArray(v.publishTypes) ? v.publishTypes.join(", ") : "";

                            return v;
                        });
                    } else {
                        this.$message({
                            type: "info",
                            offset: 300,
                            message: "没有数据"
                        })
                    }

                    this.loading = false;

                }).catch(() => {
                    this.$message({
                        type: "info",
                        offset: 300,
                        message: "发生错误"
                    })

                })
            },

            indexMethod(index) {
                return index + 1 + (this.page - 1) * this.size;
            },

            // 取消添加
            cancelAdd: function () {
                this.$refs["addForm"].resetFields();
                this.addDialogVisible = false;
                this.form = {
                    name: "",
                    categoryId: "",
                    category: "",
                    platform: "",
                    appId: "",
                    appToken: "",
                    publishTypes: [],
                    cookie: "",
                }
            },

            getAuthList() {
                service({
                    method: "get",
                    url: Api.mymedia_auth_list,
                }).then((res) => {
                    this.authList = res.data;
                });
            },

            addOpen: function () {
                this.clearTimer();
                Cookies.set('officialcookies', 'needclear');
                this.addAuthVisible = true;
            },

            addAuthItem() {
                this.timer = setInterval(()=>{
                    let ofc = Cookies.get('officialcookies');
                    console.log("add: ",ofc);
                    if(_.isNil(ofc)){
                        window.open(this.authPlatform);
                        this.cancelAuth();
                        this.clearTimer();
                    }
                }, 500);
            },

            clearTimer(){
                clearInterval(this.timer);
                this.timer = null;
            },

            cancelAuth() {
                this.addAuthVisible = false;
                this.authPlatform = "";
                this.clearTimer();
            },

            // 刷新 cookie
            cookieOpen: function (row) {
                this.clearTimer();
                let item = this.authList.find((v) => {
                    return v.platform === row.platform;
                });

                this.timer = setInterval(()=>{
                    let ofc = Cookies.get('officialcookies');
                    console.log("cookie:", ofc)
                    if(_.isNil(ofc)){
                        window.open(item.loginUrl);
                        this.cancelAuth();
                        this.clearTimer();
                    }
                }, 500);
            },

            editAccountOpen() {
                this.addDialogVisible = true;
            },

            editOpen: function (record) {
                let day = moment().format("YYYY-MM-DD");
                let start = new Date(day + " " + record.timeStart);
                let end = new Date(day + " " + record.timeEnd);
                this.isEdit = true;
                this.editAccountOpen();

                let cindex = this.accountTypeList.findIndex((v)=>{
                    return v.name === record.category;
                });

                let categoryId;

                if(cindex!==-1){
                    categoryId = this.accountTypeList[cindex]._id;
                }else{
                    categoryId = '0';
                }
                this.form = {
                    ...record,
                    categoryId,
                    timeRange: [start, end]
                };
            },
            // 编辑操作，添加已经不需要了
            addAjaxItem() {
                if (this.form.categoryId !== "0") {
                    let index = _.findIndex(this.accountTypeList, {_id: this.form.categoryId});

                    if (index !== -1) {
                        this.form.category = this.accountTypeList[index].name;
                    }
                } else {
                    this.form.category = "";
                }

                let url = "";

                if (this.isEdit) {
                    url = Api.mymedia_account_put + "/" + this.form._id;
                } else {
                    url = Api.mymedia_account_post;
                }

                Promise.all([
                    service({
                        method: "post",
                        url: url,
                        data: {
                            ...this.form,
                        }
                    }),
                    service({
                        method: "post",
                        url: Api.mymedia_account_time + "/" + this.form._id,
                        data: {
                            startTime: this.form.timeRange[0],
                            endTime: this.form.timeRange[1],
                        }
                    }),
                    service({
                        method: "post",
                        url: Api.mymedia_account_interval + "/" + this.form._id,
                        data: Number(this.form.publishInterval)
                    }),
                ]).then((res) => {
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
                }).catch((e) => {
                    this.$message({
                        type: "warning",
                        offset: 300,
                        message: "保存失败"
                    })
                })
            },

            // 状态启停
            accountStop: function (record) {
                var that = this;
                let status = (record.status + 1) % 2;

                service({
                    method: "post",
                    url: Api.mymedia_account_putStatus + "/" + record._id,
                    data: status,

                }).then(function () {
                    that.search();
                    that.$message({
                        type: "success",
                        offset: 300,
                        message: "状态更新成功"
                    })

                }).catch(function () {
                    that.$message({
                        type: "warning",
                        offset: 300,
                        message: "状态更新失败"
                    })

                })

            },

            // 异常状态更新
            statusOpen: function (record) {
                var that = this;
                let status = (record.status + 1) % 2;

                service({
                    method: "post",
                    url: Api.mymedia_account_putNormal + "/" + record._id,

                    data: status
                }).then(function () {
                    that.search();
                    that.$message({
                        type: "success",
                        offset: 300,
                        message: "状态更新成功"
                    })

                }).catch(function () {
                    that.$message({
                        type: "warning",
                        offset: 300,
                        message: "状态更新失败"
                    })

                })
            },

            // 自动发布开关
            publishOpen: function (record) {
                var that = this;
                let status = (record.enablePublish + 1) % 2;

                service({
                    method: "post",
                    url: Api.mymedia_account_putpublish + "/" + record._id,

                    data: status
                }).then(function () {
                    that.search();
                    that.$message({
                        type: "success",
                        offset: 300,
                        message: "状态更新成功"
                    })

                }).catch(function () {
                    that.$message({
                        type: "warning",
                        offset: 300,
                        message: "状态更新失败"
                    })

                })
            },

            // 导出
            exportTaskExcel: function () {
                let qs = $.param(this.searchObj);
                let url = Api.mymedia_account_export + "?" + qs;

                window.open(url)
            },

            // 平台列表
            getplatformList: function () {
                let that = this;

                service({
                    method: "get",
                    url: Api.mymedia_platform_getlist,
                    params: {
                        page: 1,
                        size: 1000,
                    }
                }).then(function (res) {
                    that.platformList = [{"_id": "0", "name": "全部"}].concat([], res.data);
                });
            },

            // 编辑：账号分类
            getAccountType: function () {
                let that = this;

                service({
                    method: "get",
                    url: Api.relation_publish_getlist,
                    params: {
                        page: 1,
                        size: 1000,
                    }
                }).then(function (res) {
                    that.accountTypeList = [{"_id": "0", "name": "全部"}].concat([], res.data);
                });
            },

            // 编辑：文章发布分类
            getArticleType() {

                service({
                    method: "get",
                    url: Api.relation_article_getlist,
                    params: {
                        page: 1,
                        limit: 1000
                    }
                }).then((res) => {
                    this.articleTypeList = res.data;
                })
            },

            getRelationArticleType(id) {
                if (id !== "0") {
                    let index = _.findIndex(this.accountTypeList, {_id: id});

                    if (index !== -1) {
                        this.articleTypeList = this.accountTypeList[index].hotTopicTypes;
                    } else {
                        this.articleTypeList = [];
                    }
                } else {
                    this.articleTypeList = [];
                }

                this.$set(this.form, "publishTypes", this.articleTypeList);
                this.$set(this.form, "publishTypesStr", this.articleTypeList.join(", "));

                // service({
                //     method: "get",
                //     url: Api.relation_publish_getone,
                //     params: {
                //         id:item._id
                //     }
                // }).then((res) => {
                //     this.articleTypeList = res.data.hotTopicTypes;
                // })
            }


        }
    }
</script>

<style scoped>

</style>