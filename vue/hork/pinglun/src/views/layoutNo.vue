<template>
    <div class="home">
        <Head></Head>

        <el-row>

            <el-col :span="22" :offset="1" style="padding-top:10px;">
                <router-view/>
            </el-col>
        </el-row>
    </div>
</template>

<script>
    // @ is an alias to /src
    import Vue from "vue";
    import {
        Row,
        Col,
    } from "element-ui";

    import Head from '@/views/common/Head';
    import "@/assets/css/styles.css";

    Vue.use(Row);
    Vue.use(Col);

    export default {
        name: 'home',

        components: {
            Head,
        },

    }
</script>


