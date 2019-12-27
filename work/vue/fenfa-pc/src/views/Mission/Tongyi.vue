<template>
    <div class="tongyi-box" >
         <el-row >
            <el-row>
                <el-col :span="20" :offset="2" class="tongyi-title">
                    <div>同义词{{position}}/{{allCount}}</div>
                </el-col>
            </el-row>
              <el-col :span="20" :offset="2" class="tongyi-content">
                <el-row class="ci-box">
                    <el-col :span="12" class="ci">
                         <span> {{s1}}</span>
                    </el-col>
                    <el-col :span="12" class="ci">
                         <span> {{s2}}</span>
                    </el-col>
                </el-row>
                    <el-col :span="24">
                          <div class="btn-box3">
                              <div v-loading="loading" class="loading_box" v-show="loading">正在提交...</div>
                                <button class="correct"
                                :disabled="sub"
                                @click="getNext('正确')">
                                    <div class="icon">
                                        <img src="@/assets/yes11.png" alt="" v-show="tag==='正确'"/>
                                        <img src="@/assets/yes1.png" alt="" v-show="tag!=='正确'"/>

                                    </div>
                                    <p class="text">正确</p>

                                </button>
                                <button class="mistake"
                                :disabled="sub"
                                @click="getNext('错误')">
                                    <div class="icon">
                                        <img src="@/assets/no11.png" alt="" v-show="tag==='错误'"/>
                                        <img src="@/assets/no1.png" alt=""  v-show="tag!=='错误'" />
                                    </div>
                                    <p class="text">错误</p>
                                </button>
                                <button class="mistake"
                                :disabled="sub"
                                @click="getNext('不确定')">
                                    <div class="icon">
                                        <img src="@/assets/sha11.png" alt="" v-show="tag==='不确定'">
                                        <img src="@/assets/sha1.png" alt=""  v-show="tag!=='不确定'">
                                    </div>
                                    <p class="text">不确定</p>
                                </button>

                            </div>
                            <button class="prev-box"
                            :disabled="sub"
                            @click="getPrev" v-if="!isFirst">上一个</button>
                    </el-col>

            </el-col>

         </el-row>


    </div>
</template>

<script>
    import Vue from "vue";
    import {mapActions, mapGetters} from "vuex";
    import {Col, Row, Loading} from "element-ui";
    Vue.use(Col);
    Vue.use(Row);
    Vue.use(Loading);


    import "@/scss/common.scss";

    export default {
        name: "Tongyi",
        props: ["rid"],
        data() {
            return {
                exitTask:false,
                position: 0,
                allCount: 0,
                id: 0,
                s1: "",
                s2: "",
                isFirst: true,
                isLast: false,
                tag: "",
                over: false,
                fullscreenLoading: false,
                sub: false,
                loading:false,
            }
        },

        beforeRouteLeave(to, from, next) {
            console.log(to, from)
            if (!this.over) {

                this.$confirm("没做完就退出吗？", '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    closeOnHashChange:false,
                    type: 'warning'
                }).then(() => {
                    next()
                }).catch(() => {
                    next(false)
                });
            }else{
                next()
            }
        },
        computed: {
            ...mapGetters(["acceptedTasks"]),
        },
        mounted() {
            this.getInit()
        },

        methods: {

            getInit() {
                this.saveAndGet({
                    "target": 0,
                    "taskId": this.rid,
                    "data": {
                        "id": this.id,
                        childSentence: "",
                        "tag": "",
                    }
                }).then(res => {
                    this.id = res.id;
                    res.synonym = res.synonym.split(",");
                    this.s1 = res.synonym[0];
                    this.s2 = res.synonym[1];
                    this.isFirst = res.isFirst;
                    this.isLast = res.isLast;
                    this.position = res.position;
                    this.allCount = res.allCount;
                    this.tag = res.tag;
                }, err => {

                    this.$message("获取数据出错，请重试")
                })
            },
            getNext(tag) {
                this.sub = true;
                this.loading = true;
                this.tag = tag;
                _.delay(()=>{
                    this.saveAndGet({
                        "target": 0,
                        "taskId": this.rid,
                        "data": {
                            "id": this.id,
                            childSentence: tag,
                            "tag": tag,
                        }
                    }).then(res => {
                        this.sub = false;
                        this.loading = false;
                        if(!_.isNull(res)) {
                            this.id = res.id;
                            res.synonym = res.synonym.split(",");
                            this.s1 = res.synonym[0];
                            this.s2 = res.synonym[1];
                            this.isFirst = res.isFirst;
                            this.isLast = res.isLast;
                            this.position = res.position;
                            this.allCount = res.allCount;
                            this.tag = res.tag;

                            if(res.tag && res.isLast){
                                this.sub = true;
                                this.loading = true;
                                this.submitTask({taskId: this.rid}).then(()=>{
                                    this.sub = false;
                                    this.loading = false;
                                    this.$message.success("恭喜完成任务");
                                    this.over = true;
                                    this.$router.push("/home")
                                })
                            }
                        }
                    }, err => {
                        this.sub = false;
                        this.loading = false;
                        this.$message("保存出错，请重试")
                    })
                }, 400)

            },
            getPrev() {
                this.sub = true;
                this.loading = true;
                this.saveAndGet({
                    "target": -1,
                    "taskId": this.rid,
                    "data": {
                        "id": this.id,
                        childSentence: "",
                        "tag": "",
                    }
                }).then(res => {
                    this.sub = false;
                    this.loading = false;
                    this.id = res.id;
                    res.synonym = res.synonym.split(",");
                    this.s1 = res.synonym[0];
                    this.s2 = res.synonym[1];
                    this.isFirst = res.isFirst;
                    this.isLast = res.isLast;
                    this.position = res.position;
                    this.allCount = res.allCount;
                    this.tag = res.tag;
                }, err => {
                     this.sub = false;
                    this.loading = false;
                    this.$message("保存出错，请重试")
                })
            },
            ...mapActions(["saveAndGet", "submitTask"])
        }
    }
</script>
<style>
      .el-loading-mask.is-fullscreen .el-loading-spinner .circular {
        height: 0;
    }
</style>
<style lang="scss" scoped>
.tongyi-top {
    background: none !important;
}
.van-hairline--bottom:after {
    border: none !important;
}
.tongyi-box {
    width: 100%;
}
.tongyi-title {
    height: 100px;
    line-height: 100px;
    text-align: left;
    font-size: 30px;
    color: rgba(75, 78, 95, 1);
}

.tongyi-content {
    height: 80vh;
    background: rgba(255, 255, 255, 1);
    box-shadow: 0px 10px 20px 0px rgba(54, 107, 213, 0.1);
    border-radius: 6px;
}
    .ci-box {
        height: 60%;
        width: 80%;
        margin-left: 10%;
        padding-top: 40px;

        .ci {
            color: #4B4E5F;
            font-size: 30px;
            position: relative;
            width:40%;
            margin: 0 5%;
            height:260px;
            background:rgba(255,255,255,1);
            border:1px solid rgba(230,230,230,1);
            span {
                display: block;
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50% ,-50%);
            }

        }

        .ci1 {
            border-bottom: 1px solid #DDDDDD;
        }
    }

    .btn-box3 {
        width: 50%;
        padding: 0 20px;
        height: 100px;
        margin: 0px 25% 15px;

        .correct, .mistake {
            width: 20%;
            height: 100%;
            margin: 0 6%;
            background: rgba(255, 255, 255, 1);
            box-shadow: 0px 4px 20px 0px rgba(37, 48, 98, 0.15);
            border-radius: 10px;
            font-size: 16px;
            color: #525254;
            float: left;
        }

        .w5 {
            width: 5%;
            height: 100%;
            float: left;
            display: inline-block;
        }

        .icon {
            width: 56px;
            height: 56px;
            margin: 8px auto 3px;

            img {
                width: 100%;
            }
        }

        .text {
            float: left;
            text-align: center;
            width: 100%;
            font-size: 14px;
            color: #525254;
        }

    }

    .prev-box {
        font-size: 16px;
        color: #525254;
        font-weight: 400;
        height: 30px;
        line-height: 30px;
        margin-top: 10px;
    }

</style>