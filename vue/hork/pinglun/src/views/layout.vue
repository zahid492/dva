<template>
    <div class="home">
        <Head></Head>


        <el-row>
            <el-col :span="2" v-if="!supReport">
                <side-menu></side-menu>
            </el-col>

            <el-col :span="22"
                    :pull="supReport?1:0"
                    style="padding-top:10px;">
                <router-view/>
            </el-col>
        </el-row>
    </div>
</template>

<script>
    // @ is an alias to /src
    import Vue from "vue";
    import {mapGetters, mapActions} from "vuex";
    import {
        Row,
        Col,
    } from "element-ui";

    import Head from '@/views/common/Head';
    import SideMenu from '@/views/common/SideMenu';
    import "@/assets/css/styles.css";

    Vue.use(Row);
    Vue.use(Col);

    export default {
        name: 'home',

        components: {
            Head,
            "side-menu":SideMenu
        },
        computed: {
            supReport:function(){
                // console.log(this.isD, this.isC)
                if((this.isD || this.isC) && this.$route.name=="maintain-report"){
                    return true;
                }else{
                    return false;
                }
            },
            ...mapGetters(["isD", "isC"])
        },
        created(){
            console.log("layout")
            this.RefreshLogin();
        },
        methods:{
            ...mapActions(["RefreshLogin"]),
        }
    }
</script>
