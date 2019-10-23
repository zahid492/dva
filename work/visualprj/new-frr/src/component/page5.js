var skip = Boolean(url("?skip"));
var play5Time;
// 5 按播放列表
export function playList5(id, callback, vc) {
    // 记录播放数量和位置 secondGamePlayCount， 切分每个游戏下的可播放素材
    var pobj = store.session("fivePlayList");
    if (_.isUndefined(pobj) || _.isNull(pobj)) {
        store.session("fivePlayList", playlist);
        pobj = playlist;
    }

    // 获取播放子列表
    var posGroup = pobj.posGroup;
    // 播放子列表的最后一个序号
    var pls = pobj.pl[posGroup];
    var subLastIndex = pls[pls.length - 1];

    console.log(id, "pobj", pobj)
    console.log("subLastIndex:", subLastIndex)
    // 已播放到子列表的最后最后，记录播放位置，并调到下一个游戏
    if (id === subLastIndex) {
        // 调整子列表位置
        if (posGroup === pobj.posMax) {
            pobj.posGroup = 0;
            pobj.posIndex = 0;
        } else {
            console.log("pl:", pobj.pl[posGroup + 1])
            pobj.posGroup = posGroup + 1;
            pobj.posIndex = pobj.pl[posGroup + 1][0];
        }

        store.session("fivePlayList", pobj);
        console.log("写入后准备跳转：")
        // 执行跳转
        callback();
    } else {
        // pobj.posIndex = pobj.posIndex+1;
        store.session("fivePlayList", pobj);
        if (_.isFunction(vc)) {
            console.log("下一个执行：")
            vc();
        }
    }
};

export function playTime5(cb) {
    if (config.five_checked === 0 && _.isUndefined(play5Time)) {
        console.log("计时创建", moment().format("h:mm:ss"))
        play5Time = d3.timeout(function () {
            try {
                if (player) {
                    player.destroy();
                }
            } catch (e) {
            }
            console.log("计时销毁", moment().format("h:mm:ss"))
            cb();

        }, config.five_time * 1000)
    }
};

export function go5(t, s) {
    if (skip === true) {
        console.log("下一页", s.currentIndex)
        jb.util.time2Url({
            url: '/first.html?skip=true',
            time: t.direction
        });

        window.clearInterval(t.slideInterval);
        return;
    }
}