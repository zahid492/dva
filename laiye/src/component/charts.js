import React from 'react'
import echarts from 'echarts' //必须
import _ from 'lodash'
export default class LineReact extends React.Component {

    constructor(props) {
        super(props)
        this.initPie = this.initPie.bind(this)
    }

    initPie() {
        const { option={} } = this.props;
        let myChart = echarts.init(this.ID);
        // var zrender = myChart.getZrender();

        //设置options
        myChart.setOption(option);
        const myoption = myChart.getOption();

        const maxIndex = _.indexOf(myoption.series[0].data, _.max(myoption.series[0].data));
        myChart.dispatchAction({
            type: 'showTip',
            // 系列的 index，在 tooltip 的 trigger 为 axis 的时候可选。
            seriesIndex: 0,
            // 数据的 index，如果不指定也可以通过 name 属性根据名称指定数据
            dataIndex: maxIndex,
        });

        console.log(myoption, maxIndex)
        window.onresize = function() {
            myChart.resize()
        }


    }

    componentDidMount() {
        this.initPie()
    }

    componentDidUpdate() {
        this.initPie()
    }

    render() {
        const { width="100%", height="300px" } = this.props
        return <div ref={ID => this.ID = ID} style={{width, height}}></div>
    }
}