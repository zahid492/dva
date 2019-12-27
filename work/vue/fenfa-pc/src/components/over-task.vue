<template>
    <div>
        <!-- 继续做的弹框 -->
        <el-dialog
                :close-on-click-modal="false"
                :modal-append-to-body="true"
                :visible.sync="exitTask"
        >
            <div class="tanimg">
                <img src="@/assets/tan2.png" alt="">
            </div>
            <p class="text">
                还没做完就退出？
            </p>
            <div class="btn start-btn" @click="$emit('notExit')">一鼓作气接着做</div>
            <div class="btn start-btn end-btn" @click="yes">不做了</div>
        </el-dialog>
    </div>

</template>

<script>
    export default {
        name: "over-task",
        props: ["exitTask"],
        methods: {
            yes() {
                this.$emit('yesExit')
            }
        }
    }
</script>

<style scoped>

</style>