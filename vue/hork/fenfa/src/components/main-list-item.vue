<template>
    <div class="renwu" @click="acceptT(item.id, item.type)">
        <div class="icon">
            <slot name="icon" :type.sync="item.type" :status.sync="item.status"></slot>
        </div>
        <div class="content">
            <div class="title" title="item.title">{{item.title}}</div>
            <div class="num_day">
                 <span class="fl">数量：{{item.count}}个</span>
            </div>
            <div class="num_day">

                <span class="fl">剩余：{{item.restTime}}</span>
                <span class="fr go-text">{{item.typeName}}</span>
            </div>
        </div>
        <div class="go">
            <img src="../assets/go1.png" alt="">
        </div>
    </div>
</template>

<script>

    export default {
        name: "main-item",
        props: ["item"],
        methods:{
            // 接受任务
            acceptT(id, type){
                this.$emit("accept", {id, type})
            }
        }
    }
</script>

<style lang="scss">

    .renwu {
        width: 100%;
        height: 70px;

        .icon {
            height: 70px;
            width: 70px;
            float: left;

            img {
                width: 100%;
            }
        }

        .content {
            width: 220px;
            height: 70px;
            float: left;
            margin-left: 15px;

            .title {
                width: 100%;
                font-size: 16px;
                color: #3F4046;
                white-space: nowrap;
                text-overflow: ellipsis;
                overflow: hidden;
            }

            .tijiao {
                font-size: 14px;
                color: #FF9F02;
                margin-top: 8px;
                text-align: left;
            }
            .go-text {
                margin: 0;
                font-size: 12px;
                color: #FF9F02;
            }

            .num_day {
                width: 100%;
                font-size: 12px;
                margin-top: 5px;
                color: #8C8B90;
            }
        }

        .icon {
            width: 61px;
        }

        .content {
            width: 161px;
        }

        .num_day {
            height: 16px;
            margin-top: 4px;
        }

        .go {
            width: 44px;
            margin-top: 24px;
            float: left;
            margin-left: 13px;

            img {
                width: 27px;
                height: 27px;
            }
        }

        .go-text {
            font-size: 14px;
            color: #FF9F02;
            margin-top: 16px;
        }
    }
</style>