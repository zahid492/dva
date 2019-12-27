<template>
    <div class="renwu">
        <div class="icon">
            <slot name="icon" :type.sync="item.type" :status.sync="item.status"></slot>
        </div>
        <div class="content">
            <div class="title" title="item.title">{{item.title}}</div>
            <div class="num_day num-daypc">
                 <span class="fl active_color">{{item.typeName}}</span>
                 <span class="fl">数量：{{item.count}}个</span>
                 <span class="fl">剩余：{{item.restTime}}</span>
            </div>


        </div>
        <div class="go">
            <el-button class="go-text" size="medium" round  @click="acceptT(item.id, item.type)">接受</el-button>
        </div>
    </div>
</template>

<script>
    import Vue from "vue";
    import { Button } from "element-ui";
    Vue.use(Button);
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
    .active_color {
        color: #FF9F02;
    }
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

            .tijiao, .go-text {
                font-size: 14px;
                color: #FF9F02;
                margin-top: 8px;
                text-align: left;
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
            height: 100%;
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
            border: 1px solid #FF9F02;
        }
        .go-text:hover {
            color: #fff !important;
            background:linear-gradient(0deg,rgba(255,155,2,1) 0%,rgba(255,200,1,1) 88%);
        }
        .num-daypc {
            margin-top: 20px !important;
            span {
                margin-right: 30px;
            }
        }
    }

</style>