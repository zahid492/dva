<template>
    <div class="monitor-basic">
        <el-row>
            <el-col :span="4" :offset="2">
                <h4>规则报警</h4>
            </el-col>
            <el-col :span="18">
                <p>一个规则连续抓取失败&nbsp;<el-input
                        v-model="basic.ruleContiFail"
                        style="width: 60px"
                        size="small"
                        type="text"/>&nbsp;次发送警报</p>
                <p>当日累计抓取失败&nbsp;<el-input
                        v-model="basic.ruleTotalFail"
                        style="width: 60px"
                        size="small"
                        type="text"/>&nbsp;次发送警报</p>
            </el-col>
        </el-row>

        <el-row>
            <el-col :span="4" :offset="2">
                <h4>账号报警</h4>
            </el-col>
            <el-col :span="18">
                <p>一个账号连续提交失败&nbsp;<el-input
                        v-model="basic.accountSubContiFail"
                        style="width: 60px"
                        size="small"
                        type="text"/>&nbsp;次发送警报</p>
                <p>当日累计提交失败&nbsp;<el-input
                        v-model="basic.accountSubTotalFail"
                        style="width: 60px"
                        size="small"
                        type="text"/>&nbsp;次发送警报</p>
                <p>当日累计发布被拒&nbsp;<el-input
                        v-model="basic.accountTotalRefuse"
                        style="width: 60px"
                        size="small"
                        type="text"/>&nbsp;次发送警报</p>
                <p>累计&nbsp;<el-input
                        v-model="basic.accountSubFailHours"
                        style="width: 60px"
                        size="small"
                        type="text"/>&nbsp;小时未成功发布文章时发送警报</p>
            </el-col>
        </el-row>

        <el-row>
            <el-col :span="4" :offset="2">
                <h4>接收者</h4>
            </el-col>
            <el-col :span="18">
                <p>接收号码：<el-input
                        v-model="basic.recverMobile"
                        style="width: 400px"
                        size="small"
                        type="text"/></p>
                <p>接收邮箱：<el-input
                        v-model="basic.recverEmail"
                        style="width: 400px"
                        size="small"
                        type="text"/></p>
            </el-col>
        </el-row>

        <el-row>
            <el-col :span="10" :offset="8">
                <p>
                    <el-button size="small" type="primary" @click="setBasic">设置</el-button>
                    <el-button size="small"  @click="restart">重启</el-button>
                </p>
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
        Loading,

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
        name: "statistic-platform",
        data: function () {
            return {
                basic: {
                    "ruleContiFail": 0,
                    "ruleTotalFail": 0,
                    "accountSubContiFail": 0,
                    "accountSubTotalFail": 0,
                    "accountTotalRefuse": 0,
                    "accountSubFailHours": 0,
                    "recverEmail": '',
                    "recverMobile": '',
                }
            }
        },

        computed: {

        },

        created: function () {

        },

        mounted: function () {
            this.getBasic();
        },

        methods: {
            // 查询
            getBasic() {
                service({
                    method:"get",
                    url: Api.monitor_basic_get,
                }).then((res) => {
                    this.basic = Object.assign(res.data, {
                        "recverEmail": res.data.recverEmail.join(","),
                        "recverMobile": res.data.recverMobile.join(","),
                    });
                })
            },

            setBasic(){
                service({
                    method:"post",
                    url: Api.monitor_basic_update,
                    data: this.basic
                }).then((res) => {
                    this.$message({
                        type: "success",
                        offset: 300,
                        message: "保存成功"
                    })
                }).catch(function () {
                    this.$message({
                        type: "error",
                        offset: 300,
                        message: "保存失败"
                    })
                })
            },
            // todo:
            restart(){
                // service({
                //     method:"post",
                //     url: Api.monitor_basic_update,
                //     data: this.basic
                // }).then((res) => {
                //     this.$message({
                //         type: "success",
                //         offset: 300,
                //         message: "保存成功"
                //     })
                // }).catch(function () {
                //     this.$message({
                //         type: "error",
                //         offset: 300,
                //         message: "保存失败"
                //     })
                // })
            }

        }
    }
</script>

<style>
    .monitor-basic .el-input__inner {

    }
</style>