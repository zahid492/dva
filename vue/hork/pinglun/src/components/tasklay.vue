<template>
    <div class="maintain" :style="maintainSty">
        <el-row>
            <el-col :span="24">
                <div class="maintain-top">
                    <slot name="form"></slot>
                </div>
            </el-col>
        </el-row>
        <div class="task-list-box"
            v-loading="loading"
        >
            <el-row>
                <el-col :span="24">
                    <div class="task-top">
                        <slot name="filter"></slot>
                    </div>
                </el-col>
            </el-row>
            <!-- 任务列表折叠 -->
            <el-row>
                <el-col :span="24">
                    <div class="task-list">
                        <slot name="list"></slot>
                    </div>
                </el-col>
            </el-row>
            <!-- 分页 -->
            <el-row>
                <el-col :span="24">
                    <div class="pagination-box">
                        <div class="block">
                            <slot name="pagination"></slot>
                        </div>
                    </div>
                </el-col>
            </el-row>
        </div>
        <!-- 底部 -->
        <bottom></bottom>
    </div>
</template>


<script>
    import Vue from "vue";
    import {
        Row,
        Col,
        Loading
    } from "element-ui";

    Vue.use(Row);
    Vue.use(Col);
    Vue.use(Loading);


    import bottom from "@/components/bottom";
    import "@/assets/scss/tasklay.scss";

    export default {
        name: "tasklay",
        props:["loading"],
        components: {
            bottom
        },
        mounted(){
            // let loadingInstance = Loading.service({});
        },
        data(){
            return{
                maintainSty:{
                    "margin-left": this.$route.name==="maintain-list"?"190px":"60px",
                    "margin-right": this.$route.name==="maintain-list"?"60px":"60px",
                }
            }
        }
    }
</script>

<style lang="scss" scoped>
    $btn-color: #6967CE;
    $border-color: #E5E7F3;
    $operation-color: #0179FF;

    .maintain {
        width: 91%;
        margin-top: 100px;
        margin-bottom: 0px;
    }

    .task-top, .task-list {
        width: 96%;
        margin: 0 2% 0;
    }

    .maintain-top {
        height: 230px;
        padding: 20px 30px;
        background: #fff;
        border: 1px solid $border-color;
    }

    .task-box {
        width: 100%;
    }

    .task-list-box {
        width: 100%;
        margin-top: 20px;
        background: #fff;
        border: 1px solid rgba(229, 231, 243, 1);
    }

    // 分页
    .pagination-box {
        height: 32px;
        text-align: right;
        margin: 20px;
    }
</style>