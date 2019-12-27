<template>
    <div>
        <img v-show="id==='句子对'" src="@/assets/rw-icon1.png" alt=""/>
        <!--同义词-->
        <img v-show="id==='同义词'" src="@/assets/rw-icon3.png" alt=""/>
        <!--审核任务-->
        <img v-show="id==='审核'" src="@/assets/rw-icon2.png" alt=""/>
        <!--评价任务-->
        <img v-show="id==='评价'" src="@/assets/rw-icon4.png" alt=""/>

        <!--改写任务-->
        <img v-show="id==='改写'" src="@/assets/rw-icon5.png" alt=""/>
    </div>
</template>

<script>
    import {missionType} from "@/utils/type";

    export default {
        name: "icon-type",
        props: ["tid", "status"],
        data: function () {
            let id = this.setId();
            return {
                id: id,
                missionType: missionType
            }
        },
        watch: {
            "tid": function (n, o) {
                if (n !== o) {
                    this.id = this.setId();
                }
            }
        },
        methods: {
            setId() {
                let id;
                switch (this.tid) {
                    case missionType.sentence:
                        if (this.status === 1 || this.status === 3) {
                            id = "句子对"
                        }

                        if (this.status === 7 || this.status === 8) {
                            id = "审核"
                        }
                        break;
                    case missionType.synonym:
                        if (this.status === 1 || this.status === 3) {
                            id = "同义词"
                        }

                        if (this.status === 7 || this.status === 8) {
                            id = "审核"
                        }
                        break;

                    case missionType.scoring:
                        id = "评价";
                        break;

                    case missionType.audit:
                        id = "审核";
                        break;

                    case missionType.rewrite:
                        id = "改写";

                        if (this.status === 7 || this.status === 8) {
                            id = "审核"
                        }
                        break;
                }

                return id;
            }
        }
    }
</script>

<style scoped>
    img {
        width: 100%;
    }
</style>