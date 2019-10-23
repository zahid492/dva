import React from 'react'
import $ from 'jquery'
import Common from './Common'

//3D字符云
export default class Cloud extends React.Component{
    
    shouldComponentUpdate(nextProps, nextState) {
         var old = this.props.data;
         var _new = nextProps.data;
         if(_new.length > 0 && old.length > 0 && (_new[0] != old[0] ||  _new[_new.length -1] != old[old.length -1]))
         {
            return true 
        }
        return false;
    }
     componentDidUpdate()
     {
        setChart(this.props.data,this.props.fun);    
     }
    componentDidMount() {       
        setChart(this.props.data,this.props.fun);                            
    } 
    render(){
        return (          
            <div style={{ position: 'relative' ,height: '100%', width: '100%'}}>
                <ul style={{display: 'none'}} id="weightTags">
                </ul>
                <div id="mainWordCloud" style={{ position: 'relative' , overflow : 'hidden', height: '100%', width: '100%' }} >
                    <div id = "div_wordCloud" ref = "chartsContainer"   style={{ position: 'relative',overflow: 'hidden',height: '100%',width:'100%' }}>
                    </div>
                    <div id="mainWordCloudData" style={{display: 'none', position: 'relative',overflow: 'hidden',height: '100%', width: '100%'}}>                               
                        <canvas id="tagcanvas" width="110" height="106" style={{position: 'absolute', left: '0px', top: '0px'}}>Anything in here will be replaced on browsers that support the canvas element</canvas>
                    </div>
                </div>
            </div>
       
        );
    }
}

function setChart(data,fun)
{          
        if(data && data.length > 15)
        {
            data = data.slice(data.length - 15, data.length- 1);
        }
        var option = Common.ForWordCloudOption(data,fun);
        $("#div_wordCloud").show();
        $("#mainWordCloudData").hide();
        var height = $("#mainWordCloud").height();
        var width = $("#mainWordCloud").width();
        $("#tagcanvas").attr("height", height);
        $("#tagcanvas").attr("width", width);
        $("#weightTags").html('');
        $("#weightTags").append(...option);
        $("#div_wordCloud").hide();
        $("#mainWordCloudData").show();
        Common.StartCloud(window.TagCanvas);
                 
} 