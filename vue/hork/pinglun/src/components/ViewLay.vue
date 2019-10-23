<template>
    <div class="view-see-box">
        <div class="view-see">
            <div class="see-title">
                <!--provider-->
                <slot name="title-see"></slot>
            </div>

            <div class="see-list" v-if="who!='report'">

                <div v-if="type=='反向'" v-for="(cmt, index) in items.content">
                    <div class="see-require">
                        <slot name="require-see" :its="{cmt, index}"></slot>
                    </div>
                    <div class="see-content">
                        <slot name="content-see" :its="{cmt, index}"></slot>
                    </div>
                </div>

                <div v-if="type!=='反向'">
                    <div class="see-require">
                        <slot name="require-see" :its="{item:items, supplier, finisheddt:items.finisheddt}"></slot>
                    </div>
                    <div class="see-content">
                        <slot name="content-see" :its="{item:items}"></slot>
                    </div>
                </div>

                <div class="see-jietu" v-if="jietu">
                    <slot name="jietu-see"></slot>
                </div>

                <slot name="close-one"></slot>
            </div>

            <!--报告查看多项-->
            <div class="see-list" v-if="who=='report'">
                <div v-for="(item) in itemList">
                    <!--反向转用-->
                    <div v-for="(cmt, index) in items.content" v-if="type=='反向'">
                        <div class="see-require">
                            <slot name="require-see-more" :its="{item, index, cmt, finisheddt:item.finisheddt}"></slot>
                        </div>
                        <div class="see-content">
                            <slot name="content-see-more" :its="{cmt, item, index}"></slot>
                        </div>
                    </div>

                    <div v-if="type!=='反向'">
                        <div class="see-require">
                            <slot name="require-see-more" :its="{item}"></slot>
                        </div>
                        <div class="see-content">
                            <slot name="content-see-more" :its="{item}"></slot>
                        </div>
                    </div>

                    <div class="see-jietu">
                        <div class="name">截图</div>
                        <div class="see-jietu-list">
                            <slot name="jietu-see-more" :its="{pics:item.screenshoturls}"></slot>
                        </div>
                    </div>
                </div>

                <slot name="close-more"></slot>
            </div>
        </div>
        <!-- 底部 -->
        <bottom></bottom>
    </div>
</template>

<script>

    import bottom from "@/components/bottom";
    import '@/assets/scss/taskview.scss'

    export default {
        name: "ViewLay",
        props: ["type", "who", "items", "jietu", "supplier", "itemList"],

        components: {
            bottom,
        },
        methods: {}
    }
</script>

<style lang="scss" scoped>

</style>