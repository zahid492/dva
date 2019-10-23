<template>
    <!--http://localhost:8081/admin/#/sub/view-publish/64-->

    <view-lay
            :type="'发布'"
            :who.sync="who"
            :jietu="true"
            :items.sync="items"
            :supplier="supplier"
            :itemList="itemList"
    >
        <template #title-see="{finisheddt}">
            <span>发布任务</span>
            <span class="time" v-if="finisheddt">时间：{{finisheddt}}</span>
        </template>

        <template #require-see="{its}">
            <div class="name">
                客户要求
            </div>
            <div class="require-list">
                <div class="item"><span>供应商：</span>{{its.supplier}}</div>
                <div class="item"><span>评论数：</span>{{its.item.commentcount}}条</div>
                <div class="item"><span>跟评数：</span>{{its.item.withcommentcount}}字</div>
                <div class="item"><span>要求：</span>{{its.item.remark}}</div>
            </div>
        </template>

        <template #content-see="{its}">
            <div class="name">
                评论内容
            </div>
            <div class="see-pinglun" v-for="(im, index) in its.item.content">
                <div class="pinglun-item">
                    <span class="num"> {{index+1}}、</span>
                    <div class="text">{{im.comment}}</div>
                </div>
            </div>
        </template>

        <template #jietu-see>
            <mupload
                    :id="items.id"
                    :file-list.sync="fileList"
                    @refresh="getPublish"
            ></mupload>
        </template>

        <template #close-one>
            <mclose
                    :taskstatus="items.taskstatus"
                    :who.sync="who"
                    @submit="submitTask"
            ></mclose>
        </template>

        <!--报告多项查看-->

        <template #require-see-more="{its}">
            <div class="name">
                客户要求
            </div>
            <div class="require-list">
                <div class="item"><span>供应商：</span>{{its.item.supplier}}</div>
                <div class="item"><span>评论数：</span>{{its.item.commentcount}}条</div>
                <div class="item"><span>跟评数：</span>{{its.item.withcommentcount}}字</div>
                <div class="item"><span>要求：</span>{{its.item.remark}}</div>
            </div>
        </template>

        <template #content-see-more="{its}">
            <div class="name">评论内容</div>
            <div class="see-pinglun">
                <div class="pinglun-item" v-for="(cmt, index) in its.item.content">
                    <span class="num"> {{index+1}}、</span>
                    <div class="text">{{cmt.comment}}</div>
                </div>
            </div>
        </template>

        <template #jietu-see-more="{its}">
            <div class="item" v-for="im in its.pics">
                <img :src="im.virtualpath" alt="">
            </div>
        </template>

        <template #close-more>
            <mclose :who.sync="who"></mclose>
        </template>
    </view-lay>


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

    import {taskAction} from "@/mixins/taskAction";
    import ViewLay from "@/components/ViewLay";
    import mupload from "@/components/mupload";
    import mclose from "@/components/mclose";

    import '@/assets/scss/taskview.scss'

    export default {
        name: "publish",
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
            "view-lay": ViewLay,
            mupload,
            mclose
        },
        computed: {},
        mixins: [taskAction],
        mounted() {

            this.isWho();
            this.GetSuppliersDic().then((res) => {
                this.supplierDic = res;
                if (this.who == "report") {
                    this.getMoreReportTasks();
                } else {
                    this.getPublish();
                }
            });

        },
        methods: {
            getPublish() {
                this.GetPublish(this.id).then((res) => {

                    this.$nextTick(function(){
                        this.items = res;
                        this.fileList = _.map(res.screenshoturls, (v) => {
                            return {
                                id: v.id,
                                url: config.host + v.virtualpath
                            }
                        });

                        let sup = _.find(this.supplierDic, {key: res.supplierid});
                        this.supplier = _.isUndefined(sup) ? "" : sup.value;
                    })

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

                })
            },

            // 供应商任务提交完成
            submitTask() {
                // writecount
                this.UpdateSupTaskStatus({
                    id: this.items.id
                }).then(() => {
                    this.$message("更新任务状态成功");
                    this.getPublish();
                }).catch((err) => {
                    this.$message(err.message);
                })
            },
            ...mapActions(["GetPublish", "GetSupplierOne", "UpdateSupTaskStatus", "UpdateSupTask", "DeleteSupTask", "GetMoreReportTasks", "GetSuppliersDic"])
        }
    }
</script>

<style lang="scss" scoped>
    .see-list {
        .name {
            height: 125px;
        }
    }
</style>