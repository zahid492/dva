<template>
    <div>
        <!-- 完成任务的弹框 -->
        <!--<van-popup v-model="finishedTask" :close-on-click-overlay="false">-->
            <!--<div class="tanimg">-->
                <!--<img src="@/assets/tan1.png" alt="">-->
            <!--</div>-->
            <!--<div class="btn start-btn ok-btn" @click="$emit('overTask')">恭喜你完成任务！</div>-->
        <!--</van-popup>-->
        <!-- 继续做的弹框 -->
        <van-popup v-model="exitTask" :close-on-click-overlay="false">
            <div class="tanimg">
                <img src="@/assets/tan2.png" alt="">
            </div>
            <p class="text">
                还没做完就退出？
            </p>
            <div class="btn start-btn" @click="$emit('notExit')">一鼓作气接着做</div>
            <div class="btn start-btn end-btn" @click="yes">不做了</div>
        </van-popup>
    </div>
    
</template>

<script>
    export default {
        name: "over-task",
        props:["exitTask"],
        methods:{
            yes(){
                this.$emit('yesExit')
            }
        }
    }
</script>

<style scoped>

</style>