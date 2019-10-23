<template>
    <div>

        <!-- 申请悬浮 -->
        <a @click="menu(0, 'contact')" class="xuanfu-box"><img src="../assets/mianfei.png" alt="" class="xuanfu"></a>
        <!-- 头部导航 -->
        <el-row class="topbar" ref="topbar">
            <el-col :span="8" :offset="1">
                <img src="../assets/mb-img/logo-mb.png" alt="" class="mb-logo">
            </el-col>
            <el-col :span="4" :offset="11" @click="menu(1)">
                <img src="../assets/mb-img/menu-mb.png" alt="" @click="menu(1)" class="mb-menu"
                     :style="displayDiv(!menuDisplay)">
                <img src="../assets/mb-img/gb-mb.png" alt="" @click="menu(0)" class="mb-gb"
                     :style="displayDiv(menuDisplay)">
            </el-col>
        </el-row>
        <!-- 隐藏导航 -->
        <el-row class="navlist" :style="displayDiv(menuDisplay)">
            <el-col :span="24"><a @click="menu(0, 'main')" class="item">首页</a></el-col>
            <el-col :span="24"><a @click="menu(0, 'mbjn')" class="item">技能</a></el-col>
            <el-col :span="24"><a @click="menu(0, 'anli')" class="item">案例</a></el-col>
            <el-col :span="24"><a @click="menu(0, 'contact')" class="item">联系我们</a></el-col>
            <!-- 遮罩 -->
            <!-- <div class="nav-zhezhao" @click="menu(0)"></div> -->
        </el-row>

        <div id="swrapper" class="mb" ref="wrapper" @click.capture="menu(0)">
            <div id="scroller">
                <!-- 首页icon -->
                <div class="shouping" id="main">
                    <div class="space-box90"></div>
                    <el-row class="title-box">
                        <el-col :span="24" :offset="4">
                            <img src="../assets/mb-img/top-title.png" alt="" class="top-title">
                        </el-col>
                    </el-row>
                    <!-- 球动画 -->
                    <el-row class="qiu-box">
                        <el-col :span="24">
                            <img src="../assets/mb-img/yuan1.png" alt="" class="yuan1">
                            <img src="../assets/mb-img/yuan2.png" alt="" class="yuan2">
                            <!-- <img src="../assets/mb-img/yuan3.png" alt="" class="yuan4"> -->
                            <!-- <img src="../assets/mb-img/robot.png" alt="" class="robot-mb"> -->
                            <div class="yuan3"></div>
                            <div class="sp-btn">
                                <a href="http://www.iqiyi.com/w_19rzkw9679.html" @click.prevent="playVideo"
                                   class="text">观看妙笔视频<i><img
                                        src="../assets/mb-img/jiantou.png" alt="" class="jiantou"></i> </a>
                            </div>
                        </el-col>
                    </el-row>
                    <!-- 4个icon -->
                    <el-row class="icon-text">
                        <el-col :span="24" class="icon-box">
                            <el-col :span="5" :offset="6">
                                <a class="text" @click="main1('mbjn')">
                                    <img src="../assets/mb-img/znxz.png" alt="" class="icon_gn znxz-icon">
                                </a>
                            </el-col>
                            <el-col :span="5" :offset="3">
                                <a class="text" @click="main2('item1')">
                                    <img src="../assets/mb-img/mbqp.png" alt="" class="icon_gn mbqp-icon">
                                </a>
                            </el-col>
                        </el-col>
                        <el-col :span="24" class="text-box">
                            <el-col :span="6" :offset="5">
                                <a class="text" @click="main1('mbjn')">智能写作 <i><img
                                        src="../assets/mb-img/jiantou2.png"
                                        alt="" class="jiantou2"></i> </a>
                            </el-col>
                            <el-col :span="6" :offset="3">
                                <a class="text" @click="main2('item1')">秒变千篇 <i><img
                                        src="../assets/mb-img/jiantou2.png"
                                        alt="" class="jiantou2"></i> </a>
                            </el-col>
                        </el-col>
                        <el-col :span="24" class="icon-box">
                            <el-col :span="5" :offset="6">
                                <a class="text" @click="main3('item2')">
                                    <img src="../assets/mb-img/jscb.png" alt="" class="icon_gn znxz-icon">
                                </a>
                            </el-col>
                            <el-col :span="5" :offset="3">
                                <a class="text" @click="main4('item3')">
                                    <img src="../assets/mb-img/xwlj.png" alt="" class="icon_gn mbqp-icon">
                                </a>
                            </el-col>
                        </el-col>
                        <el-col :span="24" class="text-box">
                            <el-col :span="6" :offset="5">
                                <a class="text" @click="main3('item2')">智能SEO <i><img
                                        src="../assets/mb-img/jiantou2.png"
                                        alt="" class="jiantou2"></i> </a>
                            </el-col>
                            <el-col :span="6" :offset="3">
                                <a class="text" @click="main4('item3')">新闻理解 <i><img
                                        src="../assets/mb-img/jiantou2.png"
                                        alt="" class="jiantou2"></i> </a>
                            </el-col>
                        </el-col>
                    </el-row>
                </div>
                <!--  妙笔技能 -->
                <div class="jineng" id="mbjn">
                    <p class="mbjn">秒笔技能</p>
                    <img src="../assets/mb-img/writing.png" alt="" class="writing">
                    <img src="../assets/mb-img/line-b.png" alt="" class="line-h">
                    <ul class="jn-list">
                        <li class="item" id="item1">
                            <span class="jineng1" @click="icon1">智能写作</span>
                            <span class="jineng11" @click="jineng11">智能写作</span>
                            <span class="up-down">
              <img src="../assets/mb-img/up.png" alt="" class="up-mb up-mb1">
              <img src="../assets/mb-img/down.png" alt="" class="down-mb down-mb1">
            </span>
                        </li>
                        <li class="item item1">
                            <div class="jn1">
                                <span class="jn_icon"><img src="../assets/mb-img/xz-icon1.png" alt=""
                                                           class="icon1"></span>
                                <span class="jn_title"><img src="../assets/mb-img/title1.png" alt=""
                                                            class="title1"></span>
                            </div>
                            <div class="jn1">
                                <span class="jn_icon"><img src="../assets/mb-img/xz-icon2.png" alt=""
                                                           class="icon1"></span>
                                <span class="jn_title"><img src="../assets/mb-img/title2.png" alt=""
                                                            class="title1"></span>
                            </div>
                            <div class="jn1">
                                <span class="jn_icon"><img src="../assets/mb-img/xz-icon3.png" alt=""
                                                           class="icon1"></span>
                                <span class="jn_title"><img src="../assets/mb-img/title3.png" alt=""
                                                            class="title1"></span>
                            </div>
                            <div class="jn1">
                                <span class="jn_icon"><img src="../assets/mb-img/xz-icon4.png" alt=""
                                                           class="icon1"></span>
                                <span class="jn_title"><img src="../assets/mb-img/title4.png" alt=""
                                                            class="title1"></span>
                            </div>
                        </li>
                        <li class="item" id="item2">
                            <span class="jineng2" @click="icon2">秒变千篇</span>
                            <span class="jineng22" @click="jineng22">秒变千篇</span>
                            <span class="up-down">
              <img src="../assets/mb-img/up.png" alt="" class="up-mb up-mb2">
            <img src="../assets/mb-img/down.png" alt="" class="down-mb down-mb2">
            </span>
                        </li>
                        <li class="item item2">
                            <div class="jn1">
                                <span class="jn_icon"><img src="../assets/mb-img/mb-icon1.png" alt=""
                                                           class="icon1"></span>
                                <span class="jn_title"><img src="../assets/mb-img/title5.png" alt=""
                                                            class="title1"></span>
                            </div>
                            <div class="jn1">
                                <span class="jn_icon"><img src="../assets/mb-img/mb-icon2.png" alt=""
                                                           class="icon1"></span>
                                <span class="jn_title"><img src="../assets/mb-img/title6.png" alt=""
                                                            class="title1"></span>
                            </div>
                            <div class="jn1">
                                <span class="jn_icon"><img src="../assets/mb-img/mb-icon3.png" alt=""
                                                           class="icon1"></span>
                                <span class="jn_title"><img src="../assets/mb-img/title7.png" alt=""
                                                            class="title1"></span>
                            </div>
                            <div class="jn1">
                                <span class="jn_icon"><img src="../assets/mb-img/mb-icon4.png" alt=""
                                                           class="icon1"></span>
                                <span class="jn_title"><img src="../assets/mb-img/title8.png" alt=""
                                                            class="title1"></span>
                            </div>
                        </li>
                        <li class="item" id="item3">
                            <span class="jineng3" @click="icon3">智能SEO</span>
                            <span class="jineng33" @click="jineng33">智能SEO</span>
                            <span class="up-down">
              <img src="../assets/mb-img/up.png" alt="" class="up-mb up-mb3">
              <img src="../assets/mb-img/down.png" alt="" class="down-mb down-mb3">
            </span>
                        </li>
                        <li class="item item3">
                            <div class="jn1">
                                <span class="jn_icon"><img src="../assets/mb-img/js-icon1.png" alt=""
                                                           class="icon1"></span>
                                <span class="jn_title"><img src="../assets/mb-img/title9.png" alt=""
                                                            class="title1"></span>
                            </div>
                            <div class="jn1">
                                <span class="jn_icon"><img src="../assets/mb-img/js-icon2.png" alt=""
                                                           class="icon1"></span>
                                <span class="jn_title"><img src="../assets/mb-img/title10.png" alt=""
                                                            class="title1"></span>
                            </div>
                            <div class="jn1">
                                <span class="jn_icon"><img src="../assets/mb-img/js-icon3.png" alt=""
                                                           class="icon1"></span>
                                <span class="jn_title"><img src="../assets/mb-img/title11.png" alt=""
                                                            class="title1"></span>
                            </div>
                            <div class="jn1">
                                <span class="jn_icon"><img src="../assets/mb-img/js-icon4.png" alt=""
                                                           class="icon1"></span>
                                <span class="jn_title"><img src="../assets/mb-img/title12.png" alt=""
                                                            class="title1"></span>
                            </div>
                        </li>
                        <li class="item" id="item4">
                            <span class="jineng4" @click="icon4">新闻理解</span>
                            <span class="jineng44" @click="jineng44">新闻理解</span>
                            <span class="up-down">
              <img src="../assets/mb-img/up.png" alt="" class="up-mb up-mb4">
              <img src="../assets/mb-img/down.png" alt="" class="down-mb down-mb4">
              </span>
                        </li>
                        <li class="item item4">
                            <div class="jn1">
                                <span class="jn_icon"><img src="../assets/mb-img/xw-icon1.png" alt=""
                                                           class="icon1"></span>
                                <span class="jn_title"><img src="../assets/mb-img/title13.png" alt=""
                                                            class="title1"></span>
                            </div>
                            <div class="jn1">
                                <span class="jn_icon"><img src="../assets/mb-img/xw-icon2.png" alt=""
                                                           class="icon1"></span>
                                <span class="jn_title"><img src="../assets/mb-img/title14.png" alt=""
                                                            class="title1"></span>
                            </div>
                            <div class="jn1">
                                <span class="jn_icon"><img src="../assets/mb-img/xw-icon3.png" alt=""
                                                           class="icon1"></span>
                                <span class="jn_title"><img src="../assets/mb-img/title15.png" alt=""
                                                            class="title1"></span>
                            </div>
                            <div class="jn1">
                                <span class="jn_icon"><img src="../assets/mb-img/xw-icon4.png" alt=""
                                                           class="icon1"></span>
                                <span class="jn_title"><img src="../assets/mb-img/title16.png" alt=""
                                                            class="title1"></span>
                            </div>
                        </li>
                    </ul>
                </div>
                <!-- 妙笔改写方案 -->
                <div class="gaixie" id="anli">
                    <p class="mbjn">秒笔改写案例</p>
                    <img src="../assets/mb-img/customer.png" alt="" class="writing">
                    <img src="../assets/mb-img/line-h.png" alt="" class="line-h">
                    <div class="fangan-box">
                        <!-- Swiper -->
                        <div class="swiper-container">
                            <div class="swiper-wrapper">
                                <div class="swiper-slide">
                                    <img src="../assets/mb-img/lunbo1.png" alt="">
                                    <p class="text">一汽-大众探歌首月销量破3千，<br/>网友：圈住年轻人的心最重要！</p>
                                    <!-- <p class="text2">
                                        2018年还没过完，SUV市场已呈现整体增长放缓的趋势，尤其是紧凑级SUV市场，在各厂家新品密集投放的攻势下，早已成为竞争最为激烈的红海市场，而优胜劣汰的趋势也愈发明显。
                                    </p> -->
                                    <a href="http://mini.eastday.com/a/180914104745665.html" class="btn">查看完整文章</a>
                                </div>
                                <div class="swiper-slide">
                                    <img src="../assets/mb-img/lunbo2.png" alt="">
                                    <p class="text">大名鼎鼎的金鸡百花电影节联手碧桂园来佛山了！</p>
                                    <!-- <p class="text2">
                                        今年度你看过的最戳心的电影是什么？ 今年度最令你惊喜的电影情节是什么？今年度谁又担得起演员二字俘获你芳心？一千个人心中有一千个哈姆雷特，而今年的影后、影帝又将花落谁家？
                                    </p> -->
                                    <a href="http://dy.163.com/v2/article/detail/DVRGBBPS0517NQVR.html"
                                       class="btn">查看完整文章</a>
                                </div>
                                <div class="swiper-slide">
                                    <img src="../assets/mb-img/lunbo3.png" alt="">
                                    <p class="text">事实证明：七匹狼依旧是那只猛狼，2018上半年营收14亿</p>
                                    <!-- <p class="text2">
                                        众所周知,2000年七匹狼开创性推出格子茄克,成为红遍大江南北的“茄克之王”,并在此后连续16年中国茄克市场占有率第一。
                                    </p> -->
                                    <a href="https://finance.china.com/hyzx/20000618/20181024/25289704.html"
                                       class="btn">查看完整文章</a>
                                </div>
                            </div>
                            <!-- Add Pagination -->
                            <div class="swiper-pagination"></div>
                        </div>


                    </div>
                </div>
                <!-- 联合实验室 -->
                <!-- <div class="shiyan">
                    <p class="mbjn">联合实验室</p>
                    <img src="../assets/mb-img/united.png" alt="" class="writing">
                    <img src="../assets/mb-img/line-h.png" alt="" class="line-h">
                    <div class="shiyan-box">
                        <img src="../assets/mb-img/shiyan1.png" alt="" class="shiyan1">
                        <img src="../assets/mb-img/shiyan2.png" alt="" class="shiyan2">
                    </div>
                    <p class="shiyan-text">语言计算与智能写作联合实验室</p>

                </div> -->
                <!-- 首席科学顾问 -->
                <div class="guwen">
                    <p class="mbjn">首席科学顾问</p>
                    <img src="../assets/mb-img/advisor.png" alt="" class="writing">
                    <img src="../assets/mb-img/line-h.png" alt="" class="line-h">
                    <div class="guwen-box">
                        <img src="../assets/team2.png" alt="" class="guwen1">
                    </div>
                    <p class="guwen-text1">万小军</p>
                    <p class="guwen-text2">北京大学计算机科学技术研究所教授，博士生导师</p>
                </div>
                <!-- 战略合作伙伴 -->
                <!-- <div class="zhan">
                    <p class="mbjn">战略合作伙伴</p>
                    <img src="../assets/mb-img/cooperative.png" alt="" class="writing">
                    <img src="../assets/mb-img/line-h.png" alt="" class="line-h">
                    <div class="zhan-box">
                        <img src="../assets/mb-img/hb1.png" alt="" class="zhan1">
                    </div>
                    <div class="zhan-box">
                        <img src="../assets/mb-img/hb2.png" alt="" class="zhan1">
                    </div>
                    <div class="zhan-box">
                        <img src="../assets/mb-img/hb3.png" alt="" class="zhan1">
                    </div>

                </div> -->
                <!-- 服务客户 -->
                <div class="fuwu">
                    <p class="mbjn">服务客户</p>
                    <img src="../assets/mb-img/clients.png" alt="" class="writing">
                    <img src="../assets/mb-img/line-h.png" alt="" class="line-h">
                    <div class="fuwu-box">
                        <el-row>
                            <el-col :span="6" :offset="2">
                                <img src="../assets/mb-img/fuwu1.png" alt="" class="fuwu1">
                            </el-col>
                            <el-col :span="6" :offset="1">
                                <img src="../assets/mb-img/fuwu2.png" alt="" class="fuwu1">
                            </el-col>
                            <el-col :span="6" :offset="1">
                                <img src="../assets/mb-img/fuwu3.png" alt="" class="fuwu1">
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="6" :offset="2">
                                <img src="../assets/mb-img/fuwu4.png" alt="" class="fuwu1">
                            </el-col>
                            <el-col :span="6" :offset="1">
                                <img src="../assets/mb-img/fuwu5.png" alt="" class="fuwu1">
                            </el-col>
                            <el-col :span="6" :offset="1">
                                <img src="../assets/mb-img/fuwu6.png" alt="" class="fuwu1">
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="6" :offset="2">
                                <img src="../assets/mb-img/fuwu7.png" alt="" class="fuwu1">
                            </el-col>
                            <el-col :span="6" :offset="1">
                                <img src="../assets/mb-img/fuwu8.png" alt="" class="fuwu1">
                            </el-col>
                            <el-col :span="6" :offset="1">
                                <img src="../assets/mb-img/fuwu9.png" alt="" class="fuwu1">
                            </el-col>
                        </el-row>
                    </div>

                </div>
                <div class="contact" id="contact">
                    <div class="contact-title">
                        <img src="../assets/contact_title.png" alt="">
                    </div>
                    <p class="text">联系我们体验秒变千篇的妙笔机器人</p>
                    <p class="tel1">Tel: 010-62570248&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Email:
                        wribot@aimiaobi.com</p>
                    <div class="from-box">
                        <img src="../assets/mb-img/sanjiao.png" alt="" class="sanjiao">
                        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px"
                                 class="demo-ruleForm">
                            <el-form-item prop="name" class="input_box">
                                <el-input v-model="ruleForm.name" placeholder="您的姓名"></el-input>
                            </el-form-item>

                            <el-form-item prop="tel">
                                <el-input v-model="ruleForm.tel" placeholder="您的电话" class="tel ignore"
                                          id="phone"></el-input>
                            </el-form-item>

                            <el-form-item prop="email">
                                <el-input v-model="ruleForm.email" placeholder="您的邮箱"></el-input>
                            </el-form-item>

                            <el-form-item prop="company" class="input_box">
                                <el-input v-model="ruleForm.company" placeholder="公司名称"></el-input>
                            </el-form-item>

                            <el-form-item prop="desc">
                                <el-input type="textarea" v-model="ruleForm.desc" placeholder="您的需求"></el-input>
                            </el-form-item>

                            <el-form-item style="text-align: right;">
                                <el-button type="primary" class="ignore shenqing-mb" @click="contactUs('ruleForm')">申请体验
                                </el-button>
                                <!-- <el-button @click="resetForm('ruleForm')">重置</el-button> -->
                            </el-form-item>
                        </el-form>

                    </div>

                    <div class="contact-bg">
                        <img src="../assets/mb-img/contact-bg.png" alt="" class="contact-bg">
                    </div>
                    <p class="end">Copyright © 2018-2019</p>
                    <p class="end">BeiJing Wribot Intelligent Technology Co.,Ltd</p>
                    <p class="end">京ICP备13007721号-1</p>
                </div>

                <el-dialog
                        :visible.sync="mediaDialog"
                        @opened="openMedia"
                        @close="closeDialog"
                        width="100%"
                        append-to-body
                        center
                >
                    <div id="box"></div>
                </el-dialog>
            </div>

        </div>

    </div>

</template>

<script>
    import Vue from "vue";
    import axios from 'axios';
    import store2 from 'store2';
    // import {wxshare} from "@/config/wechat";
    import BScroll from 'better-scroll'
    import * as config from '@/config/config';
    import {postData} from "@/utils/index";
    import 'element-ui/lib/theme-chalk/index.css';
    import {
        Row,
        Col,
        Dialog,
        Form,
        FormItem,
        Input,
        Button
    } from "element-ui";

    import {Toast} from 'mint-ui';

    // import * as ResizeController from "properjs-resizecontroller";

    Vue.use(Row);
    Vue.use(Col);
    Vue.use(Dialog);
    Vue.use(Form);
    Vue.use(FormItem);
    Vue.use(Input);
    Vue.use(Button);

    export default {

        data() {
            return {
                player: null,
                stalled:null,
                mediaDialog: false,
                menuDisplay: false,
                myScroll: null,
                // 联系我们表单验证
                ruleForm: {
                    name: '',
                    tel: '',
                    email: '',
                    company: '',
                    desc: ''
                },
                rules: {
                    name: [
                        {required: true, message: '请输入姓名', trigger: 'blur'},
                        {min: 2, message: '请输入姓名', trigger: 'blur'}
                    ],
                    tel: [
                        {required: true, message: '请输入正确的手机号', trigger: 'blur'},
                        {min: 11, max: 11, message: '请输入正确的手机号', trigger: 'blur'}
                    ],
                    email: [
                        {required: true, message: '请输入邮箱地址', trigger: 'blur'},
                        {type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change']}
                    ],
                    company: [
                        {required: true, message: '请输入公司名称', trigger: 'blur'},
                    ],
                    desc: [
                        {required: true, message: '请填写您的需求', trigger: 'blur'}
                    ]
                }
            }
        },
        computed: {},
        mounted() {
            this.$nextTick(() => {
                // 轮播图
                var swiper = new Swiper('.swiper-container', {
                    effect: 'coverflow',
                    grabCursor: true,
                    centeredSlides: true,
                    slidesPerView: 'auto',
                    coverflowEffect: {
                        rotate: 50,
                        stretch: 0,
                        depth: 100,
                        modifier: 1,
                        slideShadows: true,
                    },
                    pagination: {
                        el: '.swiper-pagination',
                    },
                });

                if (/Android/gi.test(navigator.userAgent)) {
                    window.addEventListener('resize', function () {
                        if (document.activeElement.tagName == 'INPUT' || document.activeElement.tagName == 'TEXTAREA') {
                            window.setTimeout(function () {
                                document.activeElement.scrollIntoViewIfNeeded();
                            }, 0);
                        }
                    })
                }

                // try {
                //     wxshare();
                // } catch (err) {
                //     console.log(err)
                // }
                this.myScroll = new BScroll(this.$refs.wrapper, {
                    click: true,
                    tap: true,
                    probeType: 3,
                    scrollbar: {
                        fade: true,
                        interactive: true
                    },
                    mouseWheel: {
                        speed: 20,
                        invert: false,
                        easeTime: 300
                    }
                });

                this.myScroll.on("scroll", this.onScroll)
            });
        },

        beforeDestroy() {

        },
        methods: {
            onScroll(e, p) {
                if (this.menuDisplay) {
                    this.menuDisplay = false;
                }
                if (e.y <= -2300) {
                    $(".xuanfu-box").hide();
                } else {
                    $(".xuanfu-box").show();
                }
            },
            playerCtr: function () {

                try {
                    this.player.on("stalled", () => {
                        console.log("stalled");
                        this.stalled = setTimeout(function () {
                            // this.player.ready(() => {
                                this.player.play();
                                this.player.muted(false);
                            // });
                        }, 1000);
                    });

                    this.player.on("error", () => {
                        console.log("error");
                        location.reload(true);
                    });

                    this.player.on("suspend", _.setTimeout(() => {
                        console.log("suspend");
                        try {
                            this.player.play();
                            this.player.muted(false);
                        } catch (e) {
                            console.log(e)
                        }
                    }, 1000));
                } catch (e) {
                    console.log(e)
                }
            },
            openMedia: function () {
                // var resizer = new ResizeController();
                $("#box").append('<video class="video-js" id="pc-video" playsinline autoplay="true" controls="true" x5-video-player-type="h5"><source src="fifa.mp4" type="video/mp4"/></video>');

                this.player = videojs('pc-video', {
                    controls: true,
                    autoplay: 'play',
                    preload: 'auto'
                });

                this.player.ready(() => {
                    this.player.play();
                    this.player.muted(false);
                    this.playerCtr();
                });

                // 横
                // resizer.on('orientationchange', () => {
                //     console.log("landscape")
                //
                //     this.player.ready(() => {
                //         this.player.play();
                //         this.playerCtr();
                //     });
                // });

            },

            playVideo: function () {
                this.mediaDialog = true;
            },
            closeDialog: function () {
                clearTimeout(this.stalled);
                this.stalled = null;
                this.player.pause();
                this.player.muted(true);
                this.player.dispose();
                this.mediaDialog = false;
            },
            getToken({commit}) {
                return new Promise(async (resolve, reject) => {
                    try {
                        const response = await axios.get(config.getTokenApi);
                        store2.set("token", response.data.data);
                        resolve();
                    } catch (e) {
                        console.log(e)
                        reject();
                    }
                });
            },
            displayDiv(value) {
                return {
                    display: value ? "block" : "none"
                }
            },
            contactUs() {
                this.$refs["ruleForm"].validate((valid) => {
                    let that = this;

                    if (valid) {
                        postData({
                            url: conf.apiHost + "/UserInfo/Add",
                            data: this.ruleForm,
                            msg: "提交成功",
                            query: '&remark=miaobi-mb&templateId=5c7cc119a0ccd15120588235'
                        }).then(() => {
                            this.ruleForm = {};
                        }, (err) => {
                            console.log(err);
                        })
                    } else {
                        Toast("验证失败")
                    }

                });

            },

            // 导航菜单的关闭
            menu(v, id) {
                if (v === 1) {
                    this.menuDisplay = true;
                } else if (id) {
                    this.menuDisplay = false;
                    this.$nextTick(()=>{
                        this.myScroll.scrollToElement("#" + id);
                        this.myScroll.refresh();
                    });

                } else{
                    this.menuDisplay = false;
                }
            },

            main1(id) {
                console.log("main1")
                this.menu(0, id);
                this.icon1();
            },
            main2(id) {
                console.log("main2")
                this.menu(0, id);
                this.icon2();
            },
            main3(id) {
                this.menu(0, id);
                this.icon3();
            },
            main4(id) {
                this.menu(0, id);
                this.icon4();
            },

            icon1() {
                $('.up-mb1').css({
                    "display": "block"
                });
                $('.up-mb2').css({
                    "display": "none"
                });
                $('.up-mb3').css({
                    "display": "none"
                });
                $('.up-mb4').css({
                    "display": "none"
                });
                $('.down-mb1').css({
                    "display": "none"
                });
                $('.down-mb2').css({
                    "display": "block"
                });
                $('.down-mb3').css({
                    "display": "block"
                });
                $('.down-mb4').css({
                    "display": "block"
                });
                $('.item1').css({
                    "display": "block"
                });
                $('.jineng1').css({
                    "display": "none"
                });
                $('.jineng2').css({
                    "display": "block"
                });
                $('.jineng3').css({
                    "display": "block"
                });
                $('.jineng4').css({
                    "display": "block"
                });
                $('.jineng11').css({
                    "display": "block"
                });
                $('.jineng22').css({
                    "display": "none"
                });
                $('.jineng33').css({
                    "display": "none"
                });
                $('.jineng44').css({
                    "display": "none"
                });
                $('.item4').css({
                    "display": "none"
                });
                $('.item2').css({
                    "display": "none"
                });
                $('.item3').css({
                    "display": "none"
                });


            },
            jineng11() {
                $('.up-mb1').css({
                    "display": "none"
                });
                $('.down-mb1').css({
                    "display": "block"
                });
                $('.item1').css({
                    "display": "none"
                });
                $('.jineng1').css({
                    "display": "block"
                });
                $('.jineng11').css({
                    "display": "none"
                });
            },

            icon2() {
                $('.up-mb1').css({
                    "display": "none"
                });
                $('.up-mb2').css({
                    "display": "block"
                });
                $('.up-mb3').css({
                    "display": "none"
                });
                $('.up-mb4').css({
                    "display": "none"
                });
                $('.down-mb1').css({
                    "display": "block"
                });
                $('.down-mb2').css({
                    "display": "none"
                });
                $('.down-mb3').css({
                    "display": "block"
                });
                $('.down-mb4').css({
                    "display": "block"
                });
                $('.item2').css({
                    "display": "block"
                });
                $('.jineng1').css({
                    "display": "block"
                });
                $('.jineng2').css({
                    "display": "none"
                });
                $('.jineng3').css({
                    "display": "block"
                });
                $('.jineng1').css({
                    "display": "block"
                });
                $('.jineng2').css({
                    "display": "none"
                });
                $('.jineng3').css({
                    "display": "block"
                });
                $('.jineng4').css({
                    "display": "block"
                });
                $('.jineng11').css({
                    "display": "none"
                });
                $('.jineng22').css({
                    "display": "block"
                });
                $('.jineng33').css({
                    "display": "none"
                });
                $('.jineng44').css({
                    "display": "none"
                });
                $('.item1').css({
                    "display": "none"
                });
                $('.item4').css({
                    "display": "none"
                });
                $('.item3').css({
                    "display": "none"
                });
            },
            jineng22() {
                $('.up-mb2').css({
                    "display": "none"
                });
                $('.down-mb2').css({
                    "display": "block"
                });
                $('.item2').css({
                    "display": "none"
                });
                $('.jineng2').css({
                    "display": "block"
                });
                $('.jineng22').css({
                    "display": "none"
                });
            },

            icon3() {
                $('.up-mb1').css({
                    "display": "none"
                });
                $('.up-mb2').css({
                    "display": "none"
                });
                $('.up-mb3').css({
                    "display": "block"
                });
                $('.up-mb4').css({
                    "display": "none"
                });
                $('.down-mb1').css({
                    "display": "block"
                });
                $('.down-mb2').css({
                    "display": "block"
                });
                $('.down-mb3').css({
                    "display": "none"
                });
                $('.down-mb4').css({
                    "display": "block"
                });
                $('.item3').css({
                    "display": "block"
                });
                $('.jineng1').css({
                    "display": "block"
                });
                $('.jineng2').css({
                    "display": "block"
                });
                $('.jineng3').css({
                    "display": "none"
                });
                $('.jineng4').css({
                    "display": "block"
                });
                $('.jineng11').css({
                    "display": "none"
                });
                $('.jineng22').css({
                    "display": "none"
                });
                $('.jineng33').css({
                    "display": "block"
                });
                $('.jineng44').css({
                    "display": "none"
                });
                $('.item1').css({
                    "display": "none"
                });
                $('.item2').css({
                    "display": "none"
                });
                $('.item4').css({
                    "display": "none"
                });
            },
            jineng33() {
                $('.up-mb3').css({
                    "display": "none"
                });
                $('.down-mb3').css({
                    "display": "block"
                });
                $('.item3').css({
                    "display": "none"
                });
                $('.jineng3').css({
                    "display": "block"
                });
                $('.jineng33').css({
                    "display": "none"
                });
            },

            icon4() {
                $('.up-mb1').css({
                    "display": "none"
                });
                $('.up-mb2').css({
                    "display": "none"
                });
                $('.up-mb3').css({
                    "display": "none"
                });
                $('.up-mb4').css({
                    "display": "block"
                });
                $('.down-mb1').css({
                    "display": "block"
                });
                $('.down-mb2').css({
                    "display": "block"
                });
                $('.down-mb3').css({
                    "display": "block"
                });
                $('.down-mb4').css({
                    "display": "none"
                });
                $('.item4').css({
                    "display": "block"
                });
                $('.jineng1').css({
                    "display": "block"
                });
                $('.jineng2').css({
                    "display": "block"
                });
                $('.jineng3').css({
                    "display": "block"
                });
                $('.jineng4').css({
                    "display": "none"
                });
                $('.jineng11').css({
                    "display": "none"
                });
                $('.jineng22').css({
                    "display": "none"
                });
                $('.jineng33').css({
                    "display": "none"
                });
                $('.jineng44').css({
                    "display": "block"
                });
                $('.item1').css({
                    "display": "none"
                });
                $('.item2').css({
                    "display": "none"
                });
                $('.item3').css({
                    "display": "none"
                });
            },
            jineng44() {
                $('.up-mb4').css({
                    "display": "none"
                });
                $('.down-mb4').css({
                    "display": "block"
                });
                $('.item4').css({
                    "display": "none"
                });
                $('.jineng4').css({
                    "display": "block"
                });
                $('.jineng44').css({
                    "display": "none"
                });
            },
        }
    }
</script>
<style>
    .el-dialog {
        -webkit-box-shadow: none;
        box-shadow: none;
    }
    .video-js .vjs-big-play-button{
        display:none;
    }

    #swrapper {
        width: 100%;
        overflow: hidden;
    }

    #scroller {
        -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
        width: 100%;
        transform: translateZ(0);
        user-select: none;
        text-size-adjust: none;
    }

    * {
        -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
    }

    input[type="text"] {
        -webkit-appearance: none;
    }

    textarea {
        -webkit-appearance: none;
    }

    div, p, span {
        box-sizing: border-box;
    }
</style>

<style lang="scss" scoped>


    .mb {
        height: 100vh;
        overflow: scroll;
    }

    // 悬浮
    .xuanfu-box {
        display: block;
        height: 75px;
        width: 62px;
        position: fixed;
        top: 70%;
        right: 0px;
        z-index: 500;

        img {
            width: 62px;
            position: absolute;
            top: 0;
            right: 0;

        }
    }

    // 头部导航
    .topbar {
        height: 50px;
        width: 100vw;
        background: linear-gradient(72deg, rgba(0, 129, 255, 1) 0%, rgba(50, 101, 249, 1) 100%);
        position: fixed;
        left: 0;
        top: 0;
        z-index: 600;

        .mb-logo {
            height: 34px;
            margin-top: 8px;
        }

        .mb-menu {
            width: 64px;
            height: 45px;
            margin-top: 3px;
        }

        .mb-gb {
            width: 60px;
            height: 45px;
            margin-top: 3px;
            display: none;
        }

    }

    // 隐藏导航
    .navlist {
        position: fixed;
        top: 50px;
        z-index: 556;
        width: 100%;
        height: 315px;
        text-align: center;
        background: #fff;
        box-shadow: 0px 7px 22px 3px #ccc;
        padding: 15px;
        box-sizing: border-box;
        display: none;

        .item {
            display: block;
            height: 100%;
            width: 100%;
            line-height: 70px;
            color: #4d4d4d;
            font-size: 18px;
        }

        .item11 {
            height: 70px;
            line-height: 70px;
            color: #1B72FB;
        }
    }

    // 遮罩
    .nav-zhezhao {
        width: 100%;
        height: 100%;
        // background: pink;
        position: fixed;
        top: 364px;
        left: 0;
        z-index: 560;
    }

    // 首页
    .shouping {
        border-top: 1px solid transparent;
        width: 100vw;
        height: 640px;
        background: #fff;
        overflow: hidden;
        .space-box90{
            height:90px;
        }
        .title-box {
            height: 55px;
            line-height:55px;
            /*margin-top: 90px;*/
        }

        .top-title {
            width: 216px;
            height:55px;
            animation: duihua 3s linear infinite;
        }

        // 球动画
        .qiu-box {
            width: 80%;
            height: 222px;
            margin-left: 10%;
            position: relative;

            .yuan1 {
                width: 100%;
                position: absolute;
                top: 0;
                left: 0;
                z-index: 25;
            }

            .yuan4 {
                width: 100%;
                position: absolute;
                top: 0;
                left: 0;
                z-index: 15;
                animation: qiu 2s linear infinite;
            }

            .yuan2 {
                width: 232px;
                height: 232px;
                position: absolute;
                top: 50%;
                left: 50%;
                margin-top: -114px;
                margin-left: -116px;
                z-index: 9;
                animation: fengche 5s linear alternate;
            }

            .yuan3 {
                width: 203px;
                height: 203px;
                border-radius: 102px;
                border: 1px dotted #000;
                position: absolute;
                top: 50%;
                left: 50%;
                margin-top: -101px;
                margin-left: -101px;
            }

            .robot-mb {
                width: 100px;
                height: 132px;
                position: absolute;
                top: 50%;
                left: 50%;
                margin-top: -89px;
                margin-left: -43px;
                z-index: 999;
            }

            // 查看妙笔视频按钮
            .sp-btn {
                width: 110px;
                height: 33px;
                border-radius: 18px;
                background: rgba(255, 255, 255, 1);
                border: 1px solid rgba(0, 0, 0, 1);
                text-align: center;
                position: absolute;
                bottom: 0px;
                left: 50%;
                z-index: 30;
                margin-left: -55px;

                .text {
                    height: 100%;
                    width: 100%;
                    display: block;
                    font-size: 14px;
                    font-family: MicrosoftYaHei;
                    font-weight: 400;
                    color: rgba(0, 0, 0, 1);
                    line-height: 33px;

                    .jiantou {
                        width: 6px;
                        height: 10px;
                        margin-left: 2px;

                    }
                }
            }
        }

        @keyframes fengche {
            from {
                transform: rotate(360deg);
            }

            to {
                transform: rotate(0deg);
            }
        }
        @keyframes qiu {
            0% {
                transform: rotate(0deg);
            }

            50% {
                transform: rotate(-10deg);
            }

            100% {
                transform: rotate(0deg);
            }
        }
        @keyframes duihua {
            0% {
                transform: rotate(0deg);
            }

            50% {
                transform: rotate(-5deg);
            }

            100% {
                transform: rotate(0deg);
            }
        }
        // 4个icon
        .icon-text {
            .icon-box {
                margin-top: 20px;

                .icon_gn {
                    width: 60px;
                    height: 60px;

                    .text {
                        width: 90px;
                        height: 20px;
                        line-height: 20px;
                        font-size: 18px;
                        font-weight: 400;
                        color: rgba(26, 26, 26, 1);
                    }
                }
            }

            .text-box {
                margin-top: 8px;
            }

            .jiantou2 {
                width: 9px;
                height: 13px;

            }
        }
    }

    // 妙笔技能
    .jineng {
        width: 100vw;
        background: #1B72FB;
        border-top: 1px solid #1B72FB;
        text-align: center;
        padding-bottom: 72px;
        overflow: hidden;

        .jn-list {
            width: 70%;
            margin: 25px 15% 0;

            .item {
                height: 59px;
                border-bottom: 1px dotted #fff;
                // text-align: center;
                font-size: 22px;
                line-height: 59px;
                color: #fff;
                position: relative;

                .up-mb, .down-mb {
                    width: 12px;
                    height: 7px;
                    float: left;
                }

                .up-mb {
                    display: none;
                }

                .jineng11, .jineng22, .jineng33, .jineng44 {
                    display: none;
                }

                .up-down {
                    display: inline-block;
                    height: 7px;
                    width: 12px;
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    margin-top: -3px;
                    margin-left: 54px;
                }
            }

            .item1, .item2, .item3, .item4 {
                height: 376px;
                display: none;

                .jn1 {
                    height: 65px;
                    width: 90%;
                    margin-left: 5%;
                    text-align: left;
                    margin-top: 23px;
                    line-height: 65px;
                    position: relative;

                    .jn_icon {
                        display: inline-block;
                        width: 65px;
                        height: 65px;
                        border: 1px dotted #fff;
                        border-radius: 35px;
                        position: relative;

                        .icon1 {
                            width: 60px;
                            position: absolute;
                            left: 50%;
                            top: 50%;
                            transform: translate(-50%, -50%);
                        }
                    }

                    .jn_title {
                        display: inline-block;
                        height: 36px;
                        position: absolute;
                        left: 78px;

                        .title1 {
                            height: 36px;
                            vertical-align: middle;
                        }
                    }
                }
            }
        }
    }

    // 标题样式
    .mbjn {
        width: 100%;
        font-size: 24px;
        font-weight: 400;
        color: #fff;
        margin-top: 88px;
    }

    .writing {
        height: 17px;
        margin: 10px auto 0;

    }

    .line-h {
        width: 272px;
        margin-top: -20px;
    }

    // 妙笔改写方案
    .gaixie, .fuwu, .zhan, .guwen, .shiyan {
        text-align: center;

        .mbjn {
            color: #1B72FB;
        }
    }

    .gaixie {
        border-top: 1px solid transparent;
    }

    // 轮播图样式
    .fangan-box {
        .swiper-container {
            width: 100%;
            padding-top: 50px;
            padding-bottom: 50px;
        }

        .swiper-slide {
            background-position: center;
            background-size: cover;
            width: 300px;
            height: 550px;
            height: 430px;
            text-align: left;
            border-radius: 8px !important;
            overflow: hidden;

            img {
                width: 100%;
                border-radius: 8px;
            }

            .text {
                width: 100%;
                padding-left: 6%;
                font-size: 18px;
                font-weight: bold;
                text-align: left;
                margin-top: 20px;
                margin-bottom: 20px;
                color: rgba(51, 51, 51, 1);
            }

            .text2 {
                width: 100%;
                padding-left: 6%;
                padding-right: 6%;
                box-sizing: border-box;
                font-size: 14px;
                text-align: left;
                margin-top: 25px;
                margin-bottom: 25px;
                font-weight: 400;
                color: rgba(77, 77, 77, 1);
            }

            .btn {
                border: 1px solid rgba(27, 114, 251, 1);
                padding: 5px 10px;
                border-radius: 34px;
                text-align: left;
                margin-left: 6%;
                font-size: 12px;
                font-weight: 400;
                color: #1B72FB;

            }
        }

    }

    // 联合实验室
    .shiyan {
        text-align: center;

        .writing {
            width: 165px;
            height: 16px;
            margin: 0 auto;
        }

        .shiyan-box {
            width: 200px;
            height: 90px;
            margin: 40px auto 0;

            .shiyan1, .shiyan2 {
                width: 90px;
                height: 90px;
            }

            .shiyan2 {
                margin-left: 20px;
            }
        }

        .shiyan-text {
            width: 100%;
            text-align: center;
            font-size: 14px;
            color: #1A1A1A;
            margin-top: 26px;
            font-weight: 400;
        }
    }

    // 首席科学顾问
    .guwen {
        text-align: center;
        margin-top: 70px;

        .writing {
            width: 163px;
            height: 16px;
            margin: 0 auto;
        }

        .guwen-box {
            width: 90px;
            height: 90px;
            margin: 40px auto 0;

            .guwen1 {
                width: 100%;
            }
        }

        .guwen-text1, .guwen-text2 {
            width: 100%;
            text-align: center;
            font-size: 16px;
            font-weight: 400;
            color: rgba(26, 26, 26, 1);
            margin-top: 20px;
        }

        .guwen-text2 {
            font-size: 14px;
        }
    }

    // 战略合作伙伴
    .zhan {
        text-align: center;
        background: rgba(19, 123, 248, 0.1);
        padding-bottom: 50px;
        border-top: 1px solid transparent;
        margin-top: 65px;

        .writing {
            width: 190px;
            height: 16px;
            margin: 0 auto;
        }

        .mbjn {
            margin-top: 38px;
        }

        .zhan-box {
            .zhan1 {
                width: 115px;
                height: 115px;
                margin-top: 40px;
            }
        }
    }

    // 服务客户
    .fuwu {
        text-align: center;
        border-top: 1px solid transparent;
        background: #fff;

        .writing {
            width: 190px;
            height: 14px;
            margin: 0 auto;
        }

        .fuwu-box {
            margin-top: 20px;
            padding-bottom: 50px;

            .fuwu1 {
                width: 100%;
            }
        }
    }

    // 联系我们
    .contact {
        width: 100%;
        background: #1B72FB;
        background-size: 100%;
        padding: 70px 0 50px 0;
        box-sizing: border-box;
        overflow: hidden;
        position: relative;
        z-index: 550;

        .contact-title {
            width: 150px;
            height: 22px;
            margin-left: 30px;

            img {
                width: 100%;
            }
        }

        .text {
            font-size: 14px;
            color: #fff;
            margin-top: 5px;
            margin-left: 30px;
        }

        .tel1, .end {
            font-size: 12px;
            color: #fff;
            margin-top: 5px;
            margin-left: 30px;

        }

        .from-box {
            width: 80%;
            height: 410px;
            margin-left: 10%;
            background: #fff;
            margin-top: 20px;
            border-radius: 8px;
            position: relative;
            box-sizing: border-box;
            padding: 20px;

            .sanjiao {
                width: 34px;
                position: absolute;
                bottom: -20px;
                left: 150px;
            }
        }

        .contact-bg {
            width: 100%;

        }

        .el-form-item:nth-child(1), .el-form-item:nth-child(2) {
            width: 100% !important;
        }

        .el-input__inner {
            border: none !important;
            outline: medium !important;
        }

        .shenqing-mb {
            height: 34px;
            line-height: 7px;
            border-radius: 30px;
            background: linear-gradient(72deg, rgba(0, 129, 255, 1) 0%, rgba(50, 101, 249, 1) 100%);
        }
    }
</style>


<style>
    .el-form-item__content {
        margin-left: 0 !important;
    }

    textarea {
        resize: none !important;
    }

    /* 视频 */
    .el-dialog {
        background: transparent;
    }

    .el-dialog__close {
        color: #fff !important;
        font-size: 22px !important;
    }

    /* 轮播分页选中样式 */
    .swiper-pagination-bullet-active {
        width: 20px !important;
        border-radius: 5px !important;
    }

    :-webkit-full-screen video {
        width: 100%;
        height: 100%;
    }

    :-moz-full-screen video {
        width: 100%;
        height: 100%;
    }

    .swiper-pagination-bullets {
        bottom: 28px !important;
    }

    @media screen and (orientation: portrait) {
        /*竖屏 css*/
        .video-js {
            width: 100%;
            height: 200px;
        }
    }

    @media screen and (orientation: landscape) {
        /*横屏 css*/
        .video-js {
            width: 100%;
            height: 200px;
        }
    }


</style>
