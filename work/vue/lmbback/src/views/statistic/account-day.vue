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
                            <el-select v-model="PlatForm"
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

                        <el-form-item label="时间：" label-width="50">
                            <el-date-picker
                                    style="width:280px"
                                    size="small"
                                    type="datetimerange"
                                    :clearable="false"
                                    start-placeholder="开始时间"
                                    end-placeholder="结束时间"
                                    v-model="dateRange"
                                    :format.sync="formatUI"
                                    :value-format.sync="formatValue"
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
                            <el-button size="small" type="primary" @click="searchQuery">查询</el-button>
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
                            prop="date"
                            label="日期"
                            width="150"
                    ></el-table-column>

                    <el-table-column
                            prop="platForm"
                            label="平台"
                            width="150"
                    >
                    </el-table-column>

                    <el-table-column
                            prop="accountName"
                            label="账号"
                            width="200"
                    >
                    </el-table-column>

                    <el-table-column
                            prop="articleCnt"
                            label="文章数"
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
                            prop="fansCnt"
                            label="粉丝数"
                            width="100"
                    >
                    </el-table-column>

                    <el-table-column
                            prop="commentCnt"
                            label="评论数"
                            width="100"
                    >
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
        Radio,
        RadioGroup,
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
        Vue.use(Radio);
        Vue.use(RadioGroup);
        Vue.use(Loading);
    }

    export default {
        name: "statistic-ac",
        data: function () {
            let yesterday = moment().format("YYYYMMDD");
            let monthday = moment().subtract(30, 'days').format("YYYYMMDD");

            return {
                // 0 按账号 1 按平台 2 按文章
                StatisticsType:2,
                //平台
                platformList: [],
                PlatForm: "全部",
                formatValue: "yyyyMMdd",
                formatUI: "yyyy-MM-dd",
                //
                dateRange: [monthday, yesterday],

                Key:"",
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
                    Key: this.Key,
                    StatisticsType: this.StatisticsType,
                    PlatForm: this.PlatForm === "全部" ? "" : this.PlatForm,
                    TimeStart: !_.isNil(this.dateRange) && Number(this.dateRange[0]) || "",
                    TimeEnd: !_.isNil(this.dateRange) && Number(this.dateRange[1]) || "",
                }
            }
        },

        created: function () {
            let that = this;
            // 最大选择从昨天开始1年之前到数据
            this.pickerOptions.disabledDate = function (time) {
                let oneYearAgo = moment().subtract(1, 'days').subtract(2, 'month');
                let yesterday = moment().subtract(1, 'days');
                let curSelDate = moment(time);
                return curSelDate > yesterday || curSelDate < oneYearAgo;
            }
        },

        mounted: function () {
            this.getplatformList();
            this.search();
        },

        methods: {
            searchQuery() {
                if(this.searchObj.TimeStart==="" || this.searchObj.TimeEnd===""){
                    this.$message({
                        type: "warning",
                        offset: 300,
                        message: "请选择时间"
                    });
                    return;
                }
                this.Page = 1;
                this.search();
            },
            // 查询
            search: function () {
                let that = this;
                that.loading = true;

                service({
                    method: "get",
                    url: Api.statistics_article,
                    params: that.searchObj
                }).then(function (res) {
                    that.count = res.count;
                    that.list = res.data;
                    that.loading = false;
                })
            },

            indexMethod: function (index) {
                return index + 1 + (this.Page-1)*this.Size;
            },
            // 导出
            exportTaskExcel: function () {
                let qs = $.param({...this.searchObj, Size: this.count});
                let url = config.apiPath + Api.statistics_export + "?" + qs;

                window.open(url)
            },
            // 平台列表
            getplatformList() {
                service({
                    method: "get",
                    url: Api.mymedia_platform_getlist,
                    params: {
                        page: 1,
                        size: 1000,
                    }
                }).then((res) => {
                    this.platformList = [{"_id": "0", "name": "全部"}].concat([], res.data);
                });
            },
        }
    }
</script>

<style scoped>

</style>