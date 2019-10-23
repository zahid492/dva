import axios from 'axios';
import * as config from '@/config/config';
import store2 from 'store2';
import {Toast} from 'mint-ui';

export function wxshare() {
    const appid = config.appid;
    const wxurl = config.wxurl;
    $("#wxlogo").remove();
    let wxImg = '<img id="wxlogo" src="" alt="" style="display: none; left: -1000px; top:0;">';
    $("body").prepend($(wxImg));

    $("#wxlogo").attr("src", wxurl + "img/wxx.jpg");
    try {
        const wxlink = location.href.split('#')[0].toString();

        axios.get('http://api.ijiebao.com/wechat/jsapi/signature', {
            params: {
                url: wxlink,
                appid: appid
            }
        }).then(function (wxd) {
            const adata = wxd.data.data;

            wx.config({
                debug: false,
                appId: appid,
                timestamp: adata.timestamp,
                nonceStr: adata.noncestr,
                signature: adata.signature,
                jsApiList: [
                    'onMenuShareTimeline', 'onMenuShareAppMessage'
                    // "updateAppMessageShareData", "updateTimelineShareData"
                ]
            });


            wx.ready(function () {
                const link = location.href.split('#')[0].toString();
                const token = store2.get("token");
                // 朋友圈
                wx.onMenuShareTimeline({
                    title: "蓝标妙笔机器人-智能撰稿，秒变千篇",
                    link: link,
                    imgUrl: wxurl + "img/wxx.jpg",
                    success: function () {
                        axios.post(config.shareApi + token)
                        .then(function (response) {
                            if(response.data.code === 200) {
                                // Toast('您已成功分享至朋友圈，免费获得一次改稿机会');
                            }
                        }).catch(function (error) {
                            console.log(error);
                        });
                    },
                    complete: function(r){
                        Toast('您已成功分享至朋友圈，免费获得一次改稿机会');
                    }
                });

                // 朋友
                wx.onMenuShareAppMessage({
                    title: "蓝标妙笔机器人-智能撰稿，秒变千篇",
                    desc: "纵然千人千面 , 奈何七十二变。妙笔，您聪明、可靠、成本低的撰稿神助手。敬请体验~",
                    link: link,
                    imgUrl: wxurl + "img/wxx.jpg",
                    success: function () {
                        axios.post(config.shareApi + token)
                        .then(function (response) {
                            if(response.data.code === 200) {
                                // Toast('您已成功分享至朋友圈，免费获得一次改稿机会');
                            }
                        }).catch(function (error) {
                            console.log(error);
                        });
                    },
                    complete: function(r){
                        Toast('分享成功');
                    }
                });

            });
        });

    } catch (e) {
        console.log(e)
    }
}