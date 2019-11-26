 
    /**
     * 
     * @param {*} img     图片实体
     * @param {*} width   预备展示的宽度
     * @param {*} height  预备展示的高度
     */
    exports.ScaleImg = (img, width, height) => {
         
        var rw = 0;
        var rh = 0;
        if (typeof img.naturalWidth === "undefined") {　　 // IE 6/7/8
            　　
            var i = new Image();　　
            i.src = img.src;　　
            rw = i.width;
            rh = i.height;
        } else {　　 // HTML5 browsers
            rw = img.naturalWidth;
            rh = img.naturalHeight;
        }

        /* if (!width) {
            width = img.width;
        }
        if (!height) {
            height = img.height;
        } */
        //展示图片的比例
        var showRatio = width / height;
        //实际图片的比例
        var imgRatio = rw / rh;
    
        if(imgRatio > 1)
        {
             if(rw > width)
            {
                if(showRatio > imgRatio)
                {
                    rh = height;
                    rw = width;
                }else
                {
                    rw = width;
                    rh = width / imgRatio;
                }
            } 
             
        }else{
            if(rh > height)
            {
                rh = height;
                rw = imgRatio * height;
            }
        }

 

        img.style.width = rw + 'px';
        img.style.height = rh + 'px';
    }
 
    exports.StartCloud = function (TagCanvas, _index) {
        TagCanvas.interval = 20;
        TagCanvas.textFont = 'Microsoft Yahei';
        TagCanvas.textColour = null;
        TagCanvas.textHeight = 18;
        TagCanvas.outlineMethod = 'block';
        TagCanvas.outlineRadius = 10;
        TagCanvas.outlineColour = '#e4ecec';
        TagCanvas.outlineThickness = 1;
        TagCanvas.maxSpeed = 0.03;
        TagCanvas.minSpeed = 0;
        TagCanvas.minBrightness = 0.4;
        TagCanvas.depth = 0.92;
        TagCanvas.pulsateTo = 0.2;
        TagCanvas.pulsateTime = 0.5;
        TagCanvas.initial = [0.05, -0.1];
        TagCanvas.decel = 0.98;
        TagCanvas.reverse = true;
        TagCanvas.hideTags = true;
        TagCanvas.shadow = '#000';
        TagCanvas.shadowBlur = 0;
        TagCanvas.weight = false; //控制是否使用控件颜色
        TagCanvas.weightFrom = 'data-weight';
        TagCanvas.fadeIn = 800;
        TagCanvas.weightMode = 'colour';
        TagCanvas.wheelZoom = false;
        //TagCanvas.zoom = 0.8;
        TagCanvas.imageScale = null;
        //TagCanvas.offsetY = 10;
        TagCanvas.freezeActive = true;
        
        TagCanvas.Start('tagcanvas', 'weightTags');
 
    }

    exports.ForWordCloudOption = function (data,fun) {   
            var arrR = [];        
            if (data && data.length > 0) {
 
                data.forEach((item,i)=> {
                    
                        var colorIndex = parseInt((window.Colors.length - 1) * Math.random(),10);
                        var oLi = document.createElement('li');
                        var oA = document.createElement('a');
                        oA.href = 'javascript:;';
                        oA.dataWeight = 10;
                        if(fun)
                        {
                             oLi.onclick = fun.bind(null,item)
                        }
                        oA.style.color = window.Colors[colorIndex];
                        oA.innerHTML = item.title;
                        oLi.appendChild(oA);

                        arrR.push(oLi);
                   
                });
                

            }

            return arrR;

    }

    exports.CheckUrl = (url) => {
        var regStr = 'http(s)?://\\S.*';
        var reg = new RegExp(regStr);
        if (!reg.test(url)) {
            return false;
        }
        return true;
    }

    exports.addEvent = (obj,type,handle) =>{
        try{  // Chrome、FireFox、Opera、Safari、IE9.0及其以上版本
            obj.addEventListener(type,handle,false);
        }catch(e){
            try{  // IE8.0及其以下版本
                obj.attachEvent('on' + type,handle);
            }catch(e){  // 早期浏览器
                obj['on' + type] = handle;
            }
        }
    }
