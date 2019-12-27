<template>

    <div class="shenhex-box">
        <el-row>
            <el-col :span="20" :offset="2" class="shenhex-title">
                <div class="fl">撰写句子对</div>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="22" :offset="1" class="shenhex-content">
                <el-row>
                    <el-col :span="20" :offset="1" class="shenhex-sou">
                        <el-select v-model="childTaskAudit"
                                   @change="loadMore"
                                   filterable placeholder="请选择">
                            <el-option
                                    v-for="item in childTaskAudits"
                                    :key="item.key"
                                    :label="item.key"
                                    :value="item.value">
                            </el-option>
                        </el-select>
                    </el-col>
                    <el-col :span="2" class="shenhex-num">
                        <p>数量：{{xcount}}</p>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="22" :offset="1">
                        <el-table
                                :data="das"
                                style="width: 100%">
                            <el-table-column
                                    prop="mainSentence"
                                    label="原句">
                            </el-table-column>
                            <el-table-column
                                    prop="childSentence"
                                    label="改写">
                            </el-table-column>
                            <el-table-column
                                    prop="editDistanceSimilarityV"
                                    label="相似度">
                            </el-table-column>

                            <el-table-column
                                    prop="auditorTag"
                                    label="审核"
                                    width="200">
                            </el-table-column>
                        </el-table>
                    </el-col>
                </el-row>
            </el-col>
        </el-row>
    </div>

</template>

<script>
    import Vue from "vue";
    import {mapActions, mapGetters} from "vuex";
    import {
        Col,
        Row,
        Select,
        Option,
        OptionGroup,
        Button,
        ButtonGroup,
        Table,
        TableColumn,
    } from "element-ui";

    Vue.use(Col);
    Vue.use(Row);
    Vue.use(Select);
    Vue.use(Option);
    Vue.use(OptionGroup);
    Vue.use(Button);
    Vue.use(ButtonGroup);
    Vue.use(Table);
    Vue.use(TableColumn);
    // 句子对详情
    export default {
        name: "Juzix",
        props: ["jid"],
        data() {
            return {
                childTaskAudit: "",
                childTaskAudits:[{
                    key:"全部",
                    value:""
                },{
                    key:"正确",
                    value:"正确"
                },{
                    key:"错误",
                    value:"错误"
                },{
                    key:"-",
                    value:"-"
                }],
                das: [],
                xcount:0
            }
        },
        mounted() {
            this.loadMore();
        },
        methods: {
            loadMore() {
                // taskType: 1: 句子对 2：同义词 4：评价
                this.getTaskDetail({
                    "taskId": this.jid,
                    "childTaskAudit": this.childTaskAudit,
                    // "taskType": 1
                }).then((res) => {
                    this.xcount = res.count;
                    this.das = _.map(res.data, (v)=>{
                        v.auditorTag = _.isNil(v.auditorTag)?"-":v.auditorTag;

                        v.editDistanceSimilarityV = (v.editDistanceSimilarity*100).toFixed(0) + "%";
                        return v;
                    });

                }, () => {

                });
            },
            ...mapActions(["getTaskDetail"])
        }
    }
</script>
<style lang="scss">
    .el-table thead tr th {
        background: #F2F3F8 !important;
    }

    .shenhex-sou {
        .el-select {
            margin-top: 20px;

            .el-input__inner {
                border-radius: 30px !important;
            }
        }
    }
</style>
<style lang="scss" scoped>
    .shenhex-box {
        width: 100%;

        .shenhex-title {
            height: 100px;
            line-height: 100px;
            text-align: left;
            font-size: 22px;
            color: rgba(75, 78, 95, 1);

            .el-button {
                font-size: 16px;
                margin-top: 34px;
                background: linear-gradient(0deg, #FF9B02, #FFC801);
                font-size: 16px;
                border: #FFC801;
                color: #fff !important;
            }
        }

        .shenhex-content {
            background: rgba(255, 255, 255, 1);
            box-shadow: 0px 10px 20px 0px rgba(54, 107, 213, 0.1);
            border-radius: 6px;
            padding-bottom: 50px;
        }

        .shenhex-sou {
            height: 80px;
            text-align: left;

            .el-select {
                margin-top: 20px;

                .el-input__inner {
                    border-radius: 30px !important;
                }
            }
        }

        .shenhex-num {
            line-height: 80px;

            p {
                font-size: 16px;
                color: rgba(75, 78, 95, 1);
            }
        }

        .a {
            color: #FF9B02;
            font-weight: bold;
        }

        .b {
            color: #2DB652;
            font-weight: bold;
        }
    }
</style>