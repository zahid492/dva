<template>
    <div class="view-see-box">

        <div class="view-see">
            <div class="see-title">
                <span>反向任务</span>
                <copyqq
                        v-if="isD"
                        :taskid="items.id"></copyqq>
                <span class="time" v-if="items.taskstatus!==1 && items.supplierfinisheddt">时间：{{items.supplierfinisheddt}}</span>
            </div>

            <div class="see-list" v-if="who!='report'">
                <!-- 新增当前新闻名称 -->
                <newname :name="items.newstitle" :url="items.newsurl" v-if="isD"/>
                <div v-for="(item, index) in items.content">
                    <div class="see-require">
                        <div class="name">
                            客户要求{{index+1}}
                        </div>
                        <div class="require-list">
                            <div class="item" v-if="!isC"><span>供应商：</span>{{supplier}}</div>
                            <div class="item"><span>反向数：</span>{{item.count}}条</div>
                            <div class="item"><span>要求完成时间：</span>{{items.finisheddt}}</div>
                        </div>
                    </div>
                    <div class="see-content pinglun-add-item">
                        <view-pl
                                :label="'反向内容'"
                                :comments.sync="item"
                                :taskstatus="items.taskstatus"
                                :maintaintasktype="items.maintaintasktype"
                                @modify="updateContent"
                        ></view-pl>
                    </div>
                </div>

                <div class="see-jietu">
                    <mupload
                            :who="who"
                            :newsmarkdeletion="items.newsmarkdeletion"
                            :id="items.id"
                            :file-list.sync="fileList"
                            @refresh="getQuicklike"
                    ></mupload>

                    <mclose
                            :taskstatus="items.taskstatus"
                            :who.sync="who"
                            @submit="submitTask"
                    ></mclose>
                </div>
            </div>

            <div class="see-list" v-if="who=='report'">
                <div v-for="(item, ki) in itemList">
                    <div v-for="(cmt, index) in item.content">
                        <div class="see-require">
                            <div class="name">客户要求{{index+1}}</div>
                            <div class="require-list">
                                <div class="item" v-if="!isC"><span>供应商：</span>{{item.supplier}}</div>
                                <div class="item"><span>反向数：</span>{{cmt.count}}条</div>
                                <div class="item"><span>要求完成时间：</span>{{item.finisheddt}}</div>
                                <div class="item" v-if="item.supplierfinisheddt"><span>实际完成时间：</span>{{item.supplierfinisheddt}}
                                </div>
                            </div>
                        </div>
                        <div class="see-content">
                            <view-pl
                                    :who="who"
                                    :label="'反向内容'"
                                    :comments="[cmt]"
                                    :taskstatus="item.taskstatus"
                                    :maintaintasktype="item.maintaintasktype"
                            ></view-pl>
                        </div>
                    </div>

                    <div class="see-jietu">
                        <div class="name">截图</div>
                        <div class="see-jietu-list">
                            <div class="item" v-for="im in item.screenshoturls">
                                <img :src="im.virtualpath" alt="">
                            </div>
                        </div>

                    </div>
                </div>

                <mclose
                        :who.sync="who"
                ></mclose>
            </div>

        </div>
        <!-- 底部 -->
        <bottom v-if="!isD"></bottom>
    </div>

</template>

<script>
    import {mapActions, mapGetters} from "vuex";
    import Vue from "vue";
    import {
        Row,
        Col,
        Form,
        FormItem,
        Input,
        InputNumber,
        Select,
        DatePicker,
        Option,
        OptionGroup,
        Collapse,
        CollapseItem,
        Pagination,
        Radio,
        RadioGroup,
        RadioButton,
        Upload

    } from "element-ui";

    Vue.use(Row);
    Vue.use(Col);
    Vue.use(Form);
    Vue.use(FormItem);
    Vue.use(Input);
    Vue.use(InputNumber);
    Vue.use(Select);
    Vue.use(DatePicker);
    Vue.use(Option);
    Vue.use(OptionGroup);
    Vue.use(Collapse);
    Vue.use(CollapseItem);
    Vue.use(Pagination);
    Vue.use(Radio);
    Vue.use(RadioGroup);
    Vue.use(RadioButton);

    Vue.use(Upload);
    import {taskAction} from "@/mixins/taskAction";
    import viewpl from "@/components/viewpl";
    import mupload from "@/components/mupload";
    import bottom from "@/components/bottom";
    import newname from "@/components/newname";
    import mclose from "@/components/mclose";
    import copyqq from "@/components/copyqq";
    import '@/assets/scss/taskview.scss'


    export default {
        name: "reverse",
        data() {
            return {
                supplier: "",
                items: {},
                itemList: [],
                fileList: [],
                supplierDic: [],
                who: ""
            }
        },
        props: ["id", "what"],
        components: {
            "view-pl": viewpl,
            bottom,
            newname,
            mupload,
            mclose,
            copyqq
        },
        mixins: [taskAction],
        computed: {
            ...mapGetters(["isSuper", "isD", "isC", "userRole", "userMap"])
        },
        mounted() {

            this.isWho();

            if (this.userMap[this.who] === this.userRole || this.isSuper || this.userMap[this.who] == "报告") {
                this.GetSuppliersDic().then((res) => {
                    this.supplierDic = res;
                    if (this.who == "report") {
                        this.getMoreReportTasks();
                    } else {
                        this.getQuicklike();
                    }
                });
            } else {
                this.$message("您的权限不够");
                this.$router.back();
            }

        },
        methods: {
            getQuicklike() {
                this.GetQuicklike(this.id).then((res) => {

                    this.items = res;

                    this.fileList = _.map(res.screenshoturls, (v) => {
                        return {
                            name: v.id,
                            url: config.host + v.virtualpath
                        }
                    });

                    let sup = _.find(this.supplierDic, {key: res.supplierid});
                    this.supplier = _.isUndefined(sup) ? "" : sup.value;
                    // qq 点过来的链接，用于供应商提交完成任务的快捷方式
                    if (this.isD) {
                        if (!_.isNil(this.$route.query.submit) && parseInt(this.items.taskstatus, 10) != 2) {
                            this.submitTask();
                        }
                    }
                }).catch(err => {
                    this.$message.error(err.message)
                })
            },
            getMoreReportTasks() {
                let ids = this.id.split(",");
                this.GetMoreReportTasks({ids}).then((res) => {
                    this.itemList = _.map(res, (v) => {
                        let sup = _.find(this.supplierDic, {key: v.supplierid});
                        v.supplier = _.isUndefined(sup) ? "" : sup.value;
                        v.screenshoturls = _.map(v.screenshoturls, (d) => {
                            d.virtualpath = config.host + d.virtualpath;
                            return d;
                        });
                        return v;
                    });

                }).catch(err => {
                    this.$message.error(err.message)
                })
            },
            updateContent(id) {
                let index = _.findIndex(this.items.content, {id: id});

                this.UpdateSupTask({
                    taskid: this.items.id,
                    id: id,
                    content: _.trim(this.items.content[index].comment)
                }).then(() => {
                    this.$message("更新成功");

                }).catch(err => {
                    this.$message(err.message)
                });
            },
            // 供应商任务提交完成
            submitTask() {
                // writecount
                this.UpdateSupTaskStatus({
                    id: this.items.id
                }).then(() => {
                    this.$message("更新任务状态成功");
                    this.getQuicklike();
                }).catch((err) => {
                    this.$message(err.message);
                })
            },
            ...mapActions(["GetQuicklike", "GetSupplierOne", "UpdateSupTaskStatus", "UpdateSupTask", "DeleteSupTask", "GetMoreReportTasks", "GetSuppliersDic"])
        }
    }
</script>

<style lang="scss" scoped>
    .see-list {
        .name {
            height: 100%;
        }
    }
</style>