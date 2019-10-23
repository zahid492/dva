<template>
    <div class="view-see-box">
        <div class="view-see">
            <div class="see-title">
                <span>撰写任务</span>
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
                        <div class="item"><span>评论数：</span>{{items.writecount}}条</div>
                        <div class="item"><span>字数：</span>{{items.minlength}}-{{items.maxlength}}字</div>
                        <div class="item"><span>要求完成时间：</span>{{items.finisheddt}}</div>
                    </div>
                </div>
                <div class="see-content">
                    <div class="name">
                        评论内容
                    </div>
                    <el-form ref="ruleForm" label-width="110px"
                             class="demo-ruleForm"
                             :class="{'pinglun-add-item':items.taskstatus==2}"
                    >

                        <el-form-item>
                            <div class="pinglun-item" v-for="(cont, index) in items.comments">
                                <span class="num"> {{index + 1}}、</span>
                                <el-input type="textarea"
                                          :readonly="items.taskstatus==2 || (who=='client' || who=='mat')"
                                          class="pinglun-text"
                                          v-model="items.comments[index].content"
                                          placeholder=""></el-input>

                                <!--已完成的任务不能删除和修改 正确：!==2 -->
                                <div class="pinglun-edit"
                                     v-if="items.taskstatus!==2 && (who!=='client' && who!=='mat')"
                                     @click="delContent(items.comments[index].id)">
                                    <img src="@/assets/del-icon.png" alt="">
                                </div>
                                <div class="pinglun-update"
                                     v-if="items.taskstatus!==2 && (who!=='client' && who!=='mat')"
                                     @click="updateContent(items.comments[index].id)">
                                    <img src="@/assets/edit-icon.png" alt="">
                                </div>
                            </div>

                            <div class="pinglun-see pinglun-add-box"
                                 v-if="who=='sup'">
                                <el-input type="textarea" style="height:105px" placeholder="请输入..."
                                          v-model="inContent"></el-input>
                                <div class="pinglun-add" @click="addContents"><span
                                        class="icon-pinglun iconfont"></span>添加
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
                <!-- 新增当前新闻名称 -->
                <div v-for="(item, ki) in itemList">
                    <div class="see-require">
                        <div class="name">
                            客户要求
                        </div>
                        <div class="require-list">
                            <div class="item" v-if="!isC"><span>供应商：</span>{{item.supplier}}</div>
                            <div class="item"><span>评论数：</span>{{item.writecount}}条</div>
                            <div class="item"><span>字数：</span>{{item.minlength}}-{{item.maxlength}}字</div>
                            <div class="item"><span>要求完成时间：</span>{{item.finisheddt}}</div>
                            <div class="item" v-if="item.supplierfinisheddt"><span>实际完成时间：</span>{{item.supplierfinisheddt}}
                            </div>
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
        <bottom v-if="!isD"></bottom>
    </div>

</template>

<script>

    import {mapActions, mapGetters} from "vuex";
    import Vue from "vue";
    import {
        Button,
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

    Vue.use(Button);
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

    import copyqq from "@/components/copyqq";
    import {taskAction} from "@/mixins/taskAction";
    import bottom from "@/components/bottom";
    import newname from "@/components/newname";
    import mclose from "@/components/mclose";
    import {trimSN} from "@/utils/index"
    import '@/assets/scss/taskview.scss'

    import concatSeries from 'async/concatSeries';
    import mapSeries from 'async/mapSeries';

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
            bottom,
            newname,
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
                        this.getWrite();
                    }
                });
            } else {
                this.$message("您的权限不够");
                this.$router.back();
            }

        },
        methods: {
            copyMsg(){
                let msg = "撰写数量："+ this.items.writecount + "\n" +
                    "新闻标题："+ this.items.newstitle + "\n" +
                    "新闻链接："+ this.items.newsurl + "\n";
                copy(msg);
            },

            getWrite() {
                this.GetWrite(this.id).then((res) => {
                    this.items = res;
                    this.items.comments = res.comments;
                    // 根据id 查供应商
                    let sup = _.find(this.supplierDic, {key: res.supplierid});
                    this.supplier = _.isUndefined(sup) ? "" : sup.value;
                    // qq 点过来的链接，用于供应商提交完成任务的快捷方式
                    if(this.userRole==="供应商执行员"){
                        if(!_.isNil(this.$route.query.submit) && parseInt(this.items.taskstatus,10)!=2){
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
                        return v;
                    });
                }).catch(err => {
                    this.$message.error(err.message)
                })
            },

            addContents() {

                let acs = _.map(_.filter(this.inContent.split("\n"), (v) => {
                    return trimSN(v).length > 0;
                }), (v) => {
                    return trimSN(v)
                });

                let scs = _.filter(acs, (v) => {
                    return !(v.length < Number(this.items.minlength) || v.length > Number(this.items.maxlength))
                });

                let rests = _.filter(acs, (v) => {
                    return v.length < Number(this.items.minlength) || v.length > Number(this.items.maxlength)
                });

                if (rests.length > 0) {
                    _.delay(() => this.$message(`剩下的内容字数不合格：应输入 ${this.items.minlength}-${this.items.maxlength} 字`), 2000);
                }

                this.inContent = rests.join("\n");

                if (scs.length > 0) {
                    mapSeries(scs, this.addContent, function (err, res) {
                        // todo err.length>0
                    });
                }
            },

            // 添加撰写任务
            addContent(cont, callback) {
                // 可多条评论一起添加，换行分隔。
                const that = this;
                this.$nextTick(()=>{
                    if (this.items.comments.length >= parseInt(this.items.writecount, 10)) {
                        this.$message("超出评论数，不能再添加")

                    }else{
                        this.AddSupTask({
                            taskid: this.items.id,
                            content: cont
                        }).then(() => {
                            this.$message("添加成功");
                            that.getWrite();
                            callback(null, cont)

                        }).catch(err => {
                            this.$message(err.message)
                            callback(cont)
                        });
                    }
                })

            },

            // 删除撰写任务
            delContent(id) {

                let index = _.findIndex(this.items.comments, {id: id});

                this.DeleteSupTask({
                    taskid: this.items.id,
                    id: id
                }).then(() => {
                    this.items.comments.splice(index, 1);
                    this.$message("删除成功")
                }).catch(err => {
                    this.$message("删除失败")
                });
            },

            // 更新撰写任务
            updateContent(id) {
                let index = _.findIndex(this.items.comments, {id: id});

                this.UpdateSupTask({
                    taskid: this.items.id,
                    id: id,
                    content: _.trim(this.items.comments[index].content)
                }).then(() => {
                    this.$message("更新成功")
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