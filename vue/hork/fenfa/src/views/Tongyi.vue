<template>
    <div class="tongyi-box" >
        <van-nav-bar
                :title="`同义词${position}/${allCount}`"
                class="tongyi-top"
                :fixed="false"
                :z-index="1000"
                left-text=""
                left-arrow
                @click-left="toPrevPage"
        >
        </van-nav-bar>
        <div class="ci-box">
            <div class="ci ci1"> <span> {{s1}}</span> </div>
            <div class="ci"> <span> {{s2}}</span> </div>
        </div>
        <div class="btn-box3">
            <button class="correct" @click="getNext('正确')">
                <div class="icon">
                    <img src="../assets/yes11.png" alt="" v-show="tag==='正确'"/>
                    <img src="../assets/yes1.png" alt="" v-show="tag!=='正确'"/>

                </div>
                <p class="text">正确</p>

            </button>
            <div class="w5"></div>
            <button class="mistake" @click="getNext('错误')">
                <div class="icon">
                    <img src="../assets/no11.png" alt="" v-show="tag==='错误'"/>
                    <img src="../assets/no1.png" alt=""  v-show="tag!=='错误'" />
                </div>
                <p class="text">错误</p>
            </button>
            <div class="w5"></div>
            <button class="mistake" @click="getNext('不确定')">
                <div class="icon">
                    <img src="../assets/sha11.png" alt="" v-show="tag==='不确定'">
                    <img src="../assets/sha1.png" alt=""  v-show="tag!=='不确定'">
                </div>
                <p class="text">不确定</p>
            </button>

        </div>
        <button class="prev-box" @click="getPrev" v-if="!isFirst">上一个</button>

        <over-task
                :exit-task.sync="exitTask"
                @notExit="notExit"
                @yesExit="yesExit"
        ></over-task>
    </div>
</template>

<script>
    import Vue from "vue"
    import {mapActions, mapGetters} from "vuex";
    import {Toast, NavBar, Popup, Icon} from 'vant';
    import {exitPopupMixin} from '@/mixin/exitPopup';
    import overTask from "@/components/over-task.vue";

    import "@/scss/common.scss";

    Vue.use(NavBar);
    Vue.use(Toast);
    Vue.use(Popup);
    Vue.use(Icon);

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
                tag: ""
            }
        },
        mixins:[exitPopupMixin],
        components:{
            "over-task": overTask
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
                        "tag": "",
                        childSentence: "",
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
                    Toast("获取数据出错，请重试")
                })
            },
            getNext(tag) {
                this.tag = tag;
                _.delay(()=>{
                    this.saveAndGet({
                        "target": 0,
                        "taskId": this.rid,
                        "data": {
                            "id": this.id,
                            "tag": tag,
                            childSentence: tag,
                        }
                    }).then(res => {

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
                                this.submitTask({taskId: this.rid}).then(()=>{
                                    Toast("恭喜完成任务");
                                    this.$router.push("/home")
                                })
                            }
                        }
                    }, err => {
                        Toast("保存出错，请重试")
                    })
                }, 400)

            },
            getPrev() {
                this.saveAndGet({
                    "target": -1,
                    "taskId": this.rid,
                    "data": {
                        "id": this.id,
                        "tag": "",
                        childSentence: "",
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
                    Toast("出错，请重试")
                })
            },
            ...mapActions(["saveAndGet", "submitTask"])
        }
    }
</script>

<style lang="scss" scoped>
.tongyi-top {
    background: none !important;
}
.van-hairline--bottom:after {
    border: none !important;
}
.tongyi-box {
    width: 100vw;
    height: 100vh;
}
    .ci-box {
        height: 60%;
        width: 80%;
        margin-left: 10%;

        .ci {
            height: 50%;
            color: #4B4E5F;
            font-size: 30px;
            position: relative;
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
        width: 100%;
        padding: 0 20px;
        height: 100px;
        margin: 0px 0 15px;

        .correct, .mistake {
            width: 30%;
            height: 100%;
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