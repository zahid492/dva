<template>
    <el-form-item label="完成时间" v-if="finisheddt!==0">
        <el-select
                v-model="finished"
                @change="changeDate"
                placeholder="完成时间">
            <el-option
                    v-for="item in times"
                    :key="item.value"
                    :label="item.key"
                    :value="item.value">
            </el-option>
        </el-select>

    </el-form-item>
</template>

<script>
    export default {
        name: "complateTime",
        data() {
            let fminute = 1;

            return {
                finished: fminute*30,
                times:[
                    {
                        key:"30分钟",
                        value: fminute*30
                    },         {
                        key:"1小时",
                        value: fminute*60
                    },         {
                        key:"2小时",
                        value: fminute*60*2
                    },         {
                        key:"3小时",
                        value: fminute*60*3
                    },         {
                        key:"4小时",
                        value: fminute*60*4
                    },         {
                        key:"5小时",
                        value: fminute*60*5
                    },
                ]
            }
        },
        props: ["finisheddt"],
        mounted(){
            this.changeDate();
        },
        methods: {
            changeDate: function () {
                this.$emit("update:finisheddt", this.finished);
            },
        }
    }
</script>

<style scoped>

</style>