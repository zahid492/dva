<template>
    <div>
        <div class="el-row">
            <div class="el-col" :span="24">
                <div id="sentence_search">
                    <el-form ref="form" :inline="true"
                             label-width="50px"
                             size="small"
                             class="sentence-form">
                        <el-form-item label="平台："
                                      label-width="50">
                            <el-select v-model="Platform"
                                       placeholder="全部"
                                       size="small"
                                       style="width:120px"
                            >
                                <el-option
                                        v-for="(item, k) in platformList"
                                        :key="item"
                                        :label="item"
                                        :value="item">
                                </el-option>
                            </el-select>
                        </el-form-item>

                        <el-form-item label="分类："
                                      label-width="50">
                            <el-select v-model="HotTopicType"
                                       placeholder="全部"
                                       size="small"
                                       style="width:120px"
                            >
                                <el-option
                                        v-for="(item, k) in articleTypeList"
                                        :key="item._id"
                                        :label="item.name"
                                        :value="item.name">
                                </el-option>
                            </el-select>
                        </el-form-item>

                        <el-form-item label="异常类别："
                                      label-width="50">
                            <el-select v-model="Status"
                                       placeholder="全部"
                                       size="small"
                                       style="width:120px"
                            >
                                <el-option key="-1" label="全部" :value="-1"></el-option>
                                <el-option key="1" label="正常" :value="1"></el-option>
                                <el-option key="0" label="异常" :value="0"></el-option>
                            </el-select>
                        </el-form-item>

                        <el-form-item label="发布时间：" label-width="50">

                            <el-date-picker
                                    style="width:280px"
                                    size="small"
                                    type="datetimerange"
                                    start-placeholder="开始时间"
                                    end-placeholder="结束时间"
                                    v-model="dateRange"
                                    format="yyyy-MM-dd"
                                    value-format="yyyy-MM-dd"
                                    :picker-options="pickerOptions"
                            ></el-date-picker>

                        </el-form-item>

                        <el-form-item label="关键字：" label-width="50">
                            <el-input
                                    style="width:120px"
                                    v-model="Key"
                                    placeholder=""></el-input>
                        </el-form-item>

                        <el-form-item>
                            <el-button size="small" type="primary" @click="search">查询</el-button>
                        </el-form-item>

                        <el-form-item>
                            <el-button size="small" type="primary" @click="exportTaskExcel">导出</el-button>
                        </el-form-item>
                    </el-form>
                </div>
            </div>
        </div>

        <el-row>
            <el-col :span="24">
                <el-table
                        v-loading="loading"
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
                            prop="title"
                            label="文章标题"
                            width="200"
                    ></el-table-column>

                    <el-table-column
                            prop="publishPlatform"
                            label="平台"
                            width="100"
                    ></el-table-column>

                    <el-table-column
                            prop="publishAccount"
                            label="账号"
                            width="100"
                    >
                    </el-table-column>

                    <el-table-column
                            prop="officialStatus"
                            label="状态"
                            width="100"
                    >
                    </el-table-column>

                    <el-table-column
                            prop="recommendCnt"
                            label="推荐次数"
                            width="100"
                    >
                    </el-table-column>

                    <el-table-column
                            prop="readCnt"
                            label="阅读数"
                            width="100"
                    >
                    </el-table-column>

                    <el-table-column
                            prop="commentCnt"
                            label="评论数"
                            width="100"
                    >
                    </el-table-column>

                    <el-table-column
                            prop="transmitCnt"
                            label="转发数"
                            width="100"
                    >
                    </el-table-column>

                    <el-table-column
                            label="操作"
                    >
                        <template slot-scope="scope">
                            <el-button type="primary" size="mini" @click="view(scope.row)">查看</el-button>
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
                            :current-page.sync="Page"
                            :page-size="Size"
                            layout="prev, pager, next, jumper"
                            :total="count">
                    </el-pagination>
                </div>
            </el-col>
        </el-row>

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
        Vue.use(Loading);
    }

    export default {
        name: "mymedia-articles",
        data: function () {
            let yesterday = moment().subtract(1, 'days').format("YYYY-MM-DD");
            return {
                // 0 按账号 1 按平台
                StatisticsType: 0,
                //平台
                platformList: [],
                Platform: "全部",
                //时间类型： 0 按日 1 按月
                DateTimeType: 0,
                dateRange: [yesterday, yesterday],
                //异常类别
                Status: -1,
                //关键字
                Key: "",

                HotTopicType: "",
                articleTypeList: [],

                Page: 1,
                Size: 10,
                count: 0,

                list: [],
                loading: false,

                pickerOptions: {},

            }
        },

        computed: {

            searchObj: function () {
                return {
                    Page: this.Page,
                    Size: this.Size,
                    StatisticsType: this.StatisticsType,
                    Platform: this.Platform === "全部" ? "" : this.Platform,
                    HotTopicType: this.HotTopicType === "全部" ? "" : this.HotTopicType,
                    DateTimeType: this.DateTimeType,
                    TimeStart: !_.isNil(this.dateRange) && this.dateRange[0] || "",
                    TimeEnd: !_.isNil(this.dateRange) && this.dateRange[1] || "",
                    Key: this.Key.trim(),
                    Status: this.Status,
                }
            }
        },
        created: function () {
            // 最大选择从昨天开始1年之前到数据
            this.pickerOptions.disabledDate = function (time) {
                let oneYearAgo = moment().subtract(1, 'days').subtract(1, 'years');
                let yesterday = moment().subtract(1, 'days');
                let curSelDate = moment(time);
                return curSelDate > yesterday || curSelDate < oneYearAgo;
            };
            this.getPlatforms();
            this.getArticleType();
        },
        mounted: function () {
            this.search();
        },

        methods: {
            // 查询
            search: function () {
                let that = this;
                this.loading = true;

                service({
                    method: "get",
                    url: Api.mymedia_article_getlist,
                    params: that.searchObj
                }).then(function (res) {
                    if (res.data.length > 0) {
                        that.count = res.count;
                        that.list = res.data;
                    } else {
                        that.$message({
                            type: "info",
                            offset: 300,
                            message: "没有数据"
                        })
                    }

                    that.loading = false;

                }).catch(function () {
                    that.$message({
                        type: "error",
                        offset: 300,
                        message: "发生错误"
                    })
                })
            },

            indexMethod(index) {
                return index + 1 + (this.Page - 1) * this.Size;
            },


            // 导出
            exportTaskExcel: function () {
                let qs = $.param({...this.searchObj, Size: this.count});
                let url = config.apiPath + Api.mymedia_article_export + "?" + qs;

                window.open(url)
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

            getArticleType: function () {
                let that = this;
                service({
                    method: "get",
                    url: Api.relation_article_getlist,
                    params: {
                        page: 1,
                        limit: 1000
                    }
                }).then(function (res) {
                    that.articleTypeList = [{"_id": "0", "name": "全部"}].concat([], res.data);
                })
            },
            getPlatforms: function () {
                let that = this;

                service({
                    method: "get",
                    url: Api.mymedia_platform_getlist,
                    params: {
                        page: 1,
                        size: 100,
                    }
                }).then(function (res) {
                    that.platformList = [{"_id": "0", "name": "全部"}].concat([], res.data);
                })
            },
        }
    }
</script>

<style scoped>

</style>