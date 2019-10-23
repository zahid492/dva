<template>
    <div class="view-see-box">
        <div class="view-see">
            <div class="see-title">
                <span>点赞任务</span>
                <copyqq
                        v-if="isD"
                        :taskid="items.id"></copyqq>
                <span class="time" v-if="items.taskstatus!==1 && items.supplierfinisheddt">时间：{{items.supplierfinisheddt}}</span>
            </div>

            <div class="see-list" v-if="who!='report'">
                <!-- 新增当前新闻名称 -->
                <newname :name="items.newstitle" :url="items.newsurl" v-if="isD"/>
                <div class="see-require">
                    <div class="name">
                        客户要求
                    </div>
                    <div class="require-list">
                        <div class="item" v-if="!isC"><span>供应商：</span>{{supplier}}</div>
                        <div class="item"><span>点赞数：</span>{{items.likecount}}</div>
                        <div class="item"><span>要求完成时间：</span>{{items.finisheddt}}</div>
                        <div class="item"><span>要求：</span>{{items.ismachinelike?"机器赞":"人工赞"}} {{items.remark}}</div>
                    </div>
                </div>
                <div class="see-content">
                    <div style="min-height:125px">
                        <view-pl
                                :label="'点赞内容'"
                                :comments.sync="items.content"
                                :taskstatus="items.taskstatus"
                                :maintaintasktype="items.maintaintasktype"
                                @modify="updateContent"
                        ></view-pl>
                        <!--<vieweditor-->
                        <!--v-if="items.content"-->
                        <!--:comments.sync="items.content[0].comment"-->
                        <!--&gt;</vieweditor>-->
                    </div>
                </div>

                <div class="see-jietu">
                    <mupload
                            :who="who"
                            :newsmarkdeletion="items.newsmarkdeletion"
                            :id="items.id"
                            :file-list.sync="fileList"
                            @refresh="getLike"
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
                    <div class="see-require">
                        <div class="name">
                            客户要求
                        </div>
                        <div class="require-list">
                            <div class="item" v-if="!isC"><span>供应商：</span>{{item.supplier}}</div>
                            <div class="item"><span>点赞数：</span>{{item.likecount}}</div>
                            <div class="item"><span>要求完成时间：</span>{{item.finisheddt}}</div>
                            <div class="item" v-if="item.supplierfinisheddt"><span>实际完成时间：</span>{{item.supplierfinisheddt}}
                            </div>
                            <div class="item"><span>要求：</span>{{item.remark}}</div>
                        </div>
                    </div>
                    <div class="see-content">
                        <view-pl
                                :who="who"
                                :label="'点赞内容'"
                                :comments.sync="item.content"
                                :taskstatus="item.taskstatus"
                                :maintaintasktype="item.maintaintasktype"
                        ></view-pl>

                        <div class="see-jietu">
                            <div class="name">截图</div>
                            <div class="see-jietu-list">
                                <div class="item" v-for="im in item.screenshoturls">
                                    <img :src="im.virtualpath" alt="">
                                </div>
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
        Upload,
        Button

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
    Vue.use(Button);

    import {taskAction} from "@/mixins/taskAction";
    import viewpl from "@/components/viewpl";
    import bottom from "@/components/bottom";
    import newname from "@/components/newname";
    import mupload from "@/components/mupload";
    import mclose from "@/components/mclose";
    import copyqq from "@/components/copyqq";

    // import vieweditor from "@/components/vieweditor";

    import '@/assets/scss/taskview.scss'

    export default {
        name: "like",
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
            copyqq,
        },
        computed: {
            ...mapGetters(["isSuper", "userRole", "isD", "isC", "userMap"])
        },
        mixins: [taskAction],
        mounted() {
            this.isWho();
            if (this.userMap[this.who] === this.userRole || this.isSuper || this.userMap[this.who] == "报告") {
                this.GetSuppliersDic().then((res) => {
                    this.supplierDic = res;
                    if (this.who == "report") {
                        this.getMoreReportTasks();
                    } else {
                        this.getLike();
                    }
                });
            } else {
                this.$message("您的权限不够");
                this.$router.back();
            }

        },
        methods: {
            getLike() {
                this.GetLike(this.id).then((res) => {
                    this.items = res;
                    console.log(this.items)

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
            // todo  维护员：发布 点赞 反向，可更新评论，后机器自动抓取截图
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
                    this.getLike();
                }).catch((err) => {
                    this.$message(err.message);
                })
            },
            ...mapActions(["GetLike", "GetSupplierOne", "UpdateSupTaskStatus", "UpdateSupTask", "DeleteSupTask", "GetMoreReportTasks", "GetSuppliersDic"])
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