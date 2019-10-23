<template>
    <el-row>
        <el-col :span="24">
            <div class="new-name_box">
                <div class="new_name">
                    新闻标题
                </div>
                <div class="new_content">
                    <a :href="url" target="_blank">{{name}}</a>
                </div>
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
        name: "newname",
        props: ["name", "url"]
    }
</script>

<style scoped>
    .new-name_box {
        margin: 20px 0 20px 0;
        font-size: 12px;
        font-weight: 400;
        color: rgba(150, 160, 173, 1);
        text-align: left;
        position: relative;
    }

    .new_name {
        width: 150px;
        display: inline-block;
        color: #69778F;
        font-size: 20px;
        text-align: center;
        padding: 0;
        position: absolute;
        top: 50%;
        left: 0px;
        transform: translateY(-50%);

    }

    .new_content {
        display: inline-block;
        margin-left: 170px;
        font-size: 16px;
        color: #333;
        width: 80%;
    }
</style>