<template>
    <el-row>
        <el-col :span="24">
            <div class="bottom-text">
                Privacy Policy© 2018-2019 Beijing WRIBOT Intelligent Technology Co., Ltd. Hotline: +86 10 5790 5168
            </div>
        </el-col>
    </el-row>
</template>

<script>
    import Vue from "vue";
    import {
        Row,
        Col,

    } from "element-ui";

    Vue.use(Row);
    Vue.use(Col);

    export default {
        name: "bottom"
    }
</script>

<style scoped>
    .bottom-text {
        margin: 50px 0 38px 0;
        height: 20px;
        font-size: 12px;
        font-weight: 400;
        color: rgba(150, 160, 173, 1);
        line-height: 20px;
        text-align: center;
    }
</style>