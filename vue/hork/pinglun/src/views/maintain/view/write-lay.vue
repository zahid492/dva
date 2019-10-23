<template>

    <div>
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

            <template #close-one>
                <mclose
                        :taskstatus="items.taskstatus"
                        :who.sync="who"
                        @submit="submitTask"
                ></mclose>
            </template>
        </view-lay>

        <div class="view-see-box">
            <div class="view-see">
                <div class="see-title">
                    <span>撰写任务</span>
                    <span class="time" v-if="items.finisheddt">时间：{{items.finisheddt}}</span>
                </div>

                <div class="see-list" v-if="who!='report'">
                    <div class="see-require">
                        <div class="name">
                            客户要求
                        </div>
                        <div class="require-list">
                            <div class="item"><span>供应商：</span>{{supplier}}</div>
                            <div class="item"><span>评论数：</span>{{items.writecount}}条</div>
                            <div class="item"><span>字数：</span>{{items.minlength}}-{{items.maxlength}}字</div>
                            <div class="item"><span>要求完成时间：</span>{{items.finisheddt}}</div>
                        </div>
                    </div>
                    <div class="see-content">
                        <div class="name">
                            评论内容
                        </div>
                        <el-form ref="ruleForm" label-width="110px" class="demo-ruleForm">

                            <el-form-item>
                                <div class="pinglun-item" v-for="(cont, index) in comments">
                                    <span class="num"> {{index + 1}}、</span>
                                    <el-input type="textarea"
                                              class="pinglun-text"
                                              v-model="comments[index].content"
                                              placeholder=""></el-input>

                                    <!--已完成的任务不能删除和修改 正确：!==2 -->
                                    <div class="pinglun-edit" v-if="items.taskstatus!==2 && who!=='client'"
                                         @click="delContent(comments[index].id)">
                                        <img src="@/assets/del-icon.png" alt="">
                                    </div>
                                    <div class="pinglun-update" v-if="items.taskstatus!==2 && who!=='client'"
                                         @click="updateContent(comments[index].id)">
                                        <img src="@/assets/edit-icon.png" alt="">
                                    </div>
                                </div>

                                <div class="pinglun-see" v-if="who=='sup'">
                                    <el-input type="textarea" style="height:105px" placeholder="请输入..."
                                              v-model="inContent"></el-input>
                                    <div class="pinglun-add" @click="addContent"><span class="icon-pinglun iconfont"></span>添加
                                    </div>
                                </div>
                            </el-form-item>
                        </el-form>

                    </div>

                    <mclose
                            :taskstatus="items.taskstatus"
                            :who.sync="who"
                            @submit="submitTask"
                    ></mclose>
                </div>

                <div class="see-list" v-if="who=='report'">
                    <div v-for="(item, ki) in itemList">
                        <div class="see-require">
                            <div class="name">
                                客户要求
                            </div>
                            <div class="require-list">
                                <div class="item"><span>供应商：</span>{{item.supplier}}</div>
                                <div class="item"><span>评论数：</span>{{item.writecount}}条</div>
                                <div class="item"><span>字数：</span>{{item.minlength}}-{{item.maxlength}}字</div>
                                <div class="item"><span>要求完成时间：</span>{{item.finisheddt}}</div>
                            </div>
                        </div>
                        <div class="see-content">
                            <div class="name">
                                评论内容
                            </div>
                            <el-form ref="ruleForm" label-width="110px" class="demo-ruleForm">

                                <el-form-item>
                                    <div class="pinglun-item" v-for="(cmt, index) in item.comments">
                                        <span class="num"> {{index + 1}}、</span>
                                        <el-input type="textarea"
                                                  class="pinglun-text"
                                                  readonly
                                                  v-model="cmt.content"
                                                  placeholder=""></el-input>
                                    </div>
                                </el-form-item>
                            </el-form>
                        </div>
                    </div>
                    <mclose
                            :who.sync="who"
                    ></mclose>
                </div>
            </div>
            <!-- 底部 -->
            <bottom></bottom>
        </div>
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
    import mclose from "@/components/mclose";
    import '@/assets/scss/taskview.scss'


    export default {
        name: "write",
        data() {

            return {
                items: {},
                supplier: "",
                itemList: [],
                supplierDic: [],
                who: "",
                // 供应商任务列表撰写内容，添加修改删除
                comments: [],
                inContent: "",
            };
        },
        props: ["id", "what"],
        components: {
            "view-lay": ViewLay,
            mclose
        },
        computed: {
            ...mapGetters(["user", "isSuper"])
        },
        mixins: [taskAction],
        mounted() {

            this.isWho();
            this.GetSuppliersDic().then((res) => {
                this.supplierDic = res;

                if (this.who == "report") {
                    this.getMoreReportTasks();
                } else {
                    this.getWrite();
                }
            });

        },
        methods: {

            getWrite() {
                this.GetWrite(this.id).then((res) => {
                    this.items = res;
                    this.comments = res.comments;
                    // 根据id 查供应商
                    let sup = _.find(this.supplierDic, {key: res.supplierid});
                    this.supplier = _.isUndefined(sup) ? "" : sup.value;
                })
            },

            getMoreReportTasks() {
                let ids = this.id.split(",");
                this.GetMoreReportTasks({ids}).then((res) => {
                    this.itemList = _.map(res, (v) => {
                        let sup = _.find(this.supplierDic, {key: v.supplierid});
                        v.supplier = _.isUndefined(sup) ? "" : sup.value;
                        return v;
                    });
                })
            },

            // 添加撰写任务
            addContent() {
                if (this.inContent.length < Number(this.items.minlength) || this.inContent.length > Number(this.items.maxlength)) {
                    this.$message(`字数不合格：应输入 ${this.items.minlength}-${this.items.maxlength} 字`);

                    return;
                }

                if (this.items.comments.length >= this.items.writecount) {
                    this.$message("超出评论数，不能再添加")
                    return;
                }


                this.AddSupTask({
                    taskid: this.items.id,
                    content: this.inContent
                }).then(() => {

                    this.getWrite();

                    this.inContent = "";
                    this.$message("添加成功")
                }).catch(err => {
                    this.$message(err.message)
                });
            },

            // 删除撰写任务
            delContent(id) {

                let index = _.findIndex(this.comments, {id: id});

                this.DeleteSupTask({
                    taskid: this.items.id,
                    id: id
                }).then(() => {
                    this.comments.splice(index, 1);
                    this.$message("删除成功")
                }).catch(err => {
                    this.$message("删除失败")
                });
            },

            // 更新撰写任务
            updateContent(id) {
                let index = _.findIndex(this.comments, {id: id});

                this.UpdateSupTask({
                    taskid: this.items.id,
                    id: id,
                    content: this.comments[index].content
                }).then(() => {
                    this.$message("更新成功")
                }).catch(err => {
                    this.$message("更新失败")
                });
            },

            // 供应商任务提交完成
            submitTask() {
                // writecount
                this.UpdateSupTaskStatus({
                    id: this.items.id
                }).then(() => {
                    this.$message("更新任务状态成功");
                    this.getWrite();
                }).catch((err) => {
                    this.$message(err.message);
                })
            },

            ...mapActions(["GetWrite", "GetSupplierOne", "AddSupTask", "DeleteSupTask", "UpdateSupTask", "UpdateSupTaskStatus", "GetMoreReportTasks", "GetSuppliersDic"])
        }
    }
</script>

<style lang="scss">
    .pinglun-see textarea {
        width: 100%;
        height: 100%;

        .el-textarea__inner {
            resize: none !important;
            min-height: 105px !important;
            height: 100% !important;
            padding: 16px 30px 20px 40px !important;
        }
    }

    .pinglun-text {
        .el-textarea__inner {
            height: 80px !important;
            background: none;
            border: none !important;
            resize: none !important;
        }
    }

    .see-content .el-form-item__content {
        margin-left: 170px !important;
    }

</style>

<style lang="scss" scoped>
    .see-list {
        width: 100%;
        text-align: left;
        .name {
            height: 125px;

        }
    }

    .see-pinglun {
        float: left;
    }


</style>