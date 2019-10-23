<template>

    <el-form-item :label="labelTxt" class="urgent-box">
        <div class="urgent" :class="{active0:quality===0}" @click="actPt">
            <img src="@/assets/urgent.png" alt="" class="urgent-icon">
            <span>{{text11}}</span>
        </div>
        <div class="urgent" :class="{active1:quality===1}" @click="actGj">
            <img src="@/assets/urgent.png" alt="" class="urgent-icon">
            <span>{{text22}}</span>
        </div>
    </el-form-item>
</template>

<script>
    import Vue from "vue";
    import {
        FormItem,
    } from "element-ui";

    Vue.use(FormItem);

    export default {
        name: "Zhiliang",
        data() {
            return {
                labelTxt: this.label ? this.label : "账号质量",
                text11: !_.isNil(this.text1) ? this.text1 : "普通",
                text22: !_.isNil(this.text2) ? this.text2 : "高级",
            }
        },
        props: ["quality", "label", "text1", "text2"],
        methods: {
            actPt() {
                this.$emit("update:quality", 0)
            },
            actGj() {
                this.$emit("update:quality", 1)
            }
        }
    }
</script>

<style scoped>
    .urgent {
        width: 150px;
        height: 46px;
        font-size: 16px;
        color: #333C48;
        float: left;
        text-align: center;
        border: 1px solid rgba(202, 207, 231, 1);
        border-radius: 4px;
        margin-right: 49px;
    }

    .urgent:nth-last-child(1) {
        margin-right: 0px;
    }

    .urgent-box .active1 {
        background: #E10601;
        border: 1px solid #E10601;
        color: #fff;
        position: relative;
    }

    .urgent-box .active0 {
        background: #6967ce;
        border: 1px solid #6967ce;
        color: #fff;
        position: relative;
    }

    .urgent-icon {
        display: none;
    }


    .active0 .urgent-icon, .active1 .urgent-icon {
        position: absolute;
        right: 0;
        bottom: 0;
        display: block;
    }
</style>