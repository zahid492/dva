<template>
    <div>
         <el-form-item :label="txt">
            <el-select
                    :disabled="disable"
                    v-model="supplier"
                    @change="changeSupplier"
                    placeholder="机器推荐供应商">
                <el-option
                        v-for="item in supplierDic"
                        :key="item.key"
                        :label="item.value"
                        :value="item.key">
                </el-option>
            </el-select>

        </el-form-item>

        <el-form-item label="重要" class="urgent-box">
            <div class="urgent" :class="{active0:isurgent===0}" @click="actNoJiaji">
                <img src="@/assets/urgent.png" alt="" class="urgent-icon">
                <span>普通</span>
            </div>
            <div class="urgent" :class="{active1:isurgent===1}" @click="actJiaji">
                <img src="@/assets/urgent.png" alt="" class="urgent-icon">
                <span>重要</span>
            </div>
        </el-form-item>
    </div>

</template>

<script>
    import Vue from "vue";
    import {
        FormItem,
    } from "element-ui";

    Vue.use(FormItem);


    export default {
        name: "Jiaji",
        data() {
            return {
                supplier: this.supplierid,
                txt: this.supplierTxt?this.supplierTxt:"供应商"
            }
        },
        props: ["isurgent", "supplierid", "supplierDic", "supplierTxt", "disable"],

        methods: {

            changeSupplier(v) {
                this.$emit("update:supplierid", v)
            },
            actJiaji() {
                this.$emit("update:isurgent", 1)
            },
            actNoJiaji() {
                this.$emit("update:isurgent", 0)
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