import service from "@/utils/request";


// 采集新闻
export function crawlNews(opt){

    let params = `?ProjectId=${opt.ProjectId}&Url=${opt.Url}`;

    return service({
        url: 'news/crawl',
        method:"post",
        timeout: 20000,
        data: opt
    })
}
// 推荐新闻列表
export function getNews(opt){

    return service({
        url: 'news',
        method:"get",
        params: opt
    })
}

// 标记新闻被删除
export function setDeltedSign(opt){
    return service({
        url: 'news/'+ opt.id + "/sign",
        method:"post",
        data:opt
    })
}

// 更改新闻调性
export function updateMediaView(opt){

    return service({
        url: 'news/'+ opt.id + "/updatemediaview",
        method:"post",
    })
}

// 采集评论
export function crawlComment(opt){

    return service({
        url: 'news/'+ opt.id + "/crawlcommentcount",
        method:"post",
    })
}

// 机器推荐评论
export function getRobotComment(opt){

    return service({
        url: 'news/'+ opt.id + "/getrobotcomment",
        method:"get",
        params: opt
    })
}