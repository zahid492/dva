<template>
    <van-list
            :offset="300"
            :loading="loading"
            :finished="finished"
            finished-text="没有更多了"
            error.sync="error"
            error-text="请求失败，点击重新加载"
            @load="loadData"
    >
        <div class="rw-list">
            <div class="item" v-for="item in list" :key="item.id">
                <p class="text1">{{item.title}}</p>
                <div class="text2">
                    <span class="danhao fl">单号：{{item.number}}</span>
                    <span class="num fl">数量：{{item.count}}</span>

                    <!--<span class="danhao fl">剩余时间：{{item.restTime}}</span>-->
                    <span class="num fr">{{item.statusName}}</span>
                </div>
            </div>
        </div>

    </van-list>
</template>

<script>
    import Vue from "vue";
    import {List} from "vant";

    Vue.use(List);

    export default {
        name: "fcell",
        props: ["list", "page", "finished", "loading", "error"],
        methods: {
            loadData() {
                console.log("emit")
                this.$emit("loadData")
            }
        }
    }
</script>
<style>
    .van-list__error-text, .van-list__finished-text, .van-list__loading-text, .van-list__loading {
        clear: both;
    }
</style>

<style lang="scss" scoped>

    .rw-list {
        width: 100%;

        .item {
            height: 90px;
            width: 100%;
            padding: 20px 0 10px;
            border-bottom: 1px solid #DDDDDD;

            .text1 {
                width: 100%;
                font-size: 16px;
                color: #3F4046;
                font-weight: 400;
                white-space: nowrap;
                text-overflow: ellipsis;
                overflow: hidden;
                text-align: left;
            }

            .text2 {
                height: 20px;
                color: #8C8B90;
                font-size: 12px;
                margin-top: 5px;

                .num {
                    margin-left: 10px;
                }
            }
        }
    }
</style>