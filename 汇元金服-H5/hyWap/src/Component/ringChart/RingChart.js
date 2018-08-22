/**
 * Created by xhy-pc on 2016/12/29.
 */
import React,{Component} from 'react';

class LRRingChart extends Component{

    constructor(props){
        super(props);
    }

    /*static defaultProps = {
        data:[
            {color: '#e44043', value: 355.20},
            {color: '#54d6ff', value: 222.00},
            {color: '#ff9756', value: 177.60},
            {color: '#00b872', value: 133.20}
        ]
    };*/

    componentWillReceiveProps(nextProps){
        this.drawRingChart('chart',nextProps.data);
    }


    drawRingChart(id,opt,rect,lineWidth) {
        rect = rect || 400;
        lineWidth = lineWidth || 55;
        var r = rect / 2 - lineWidth;
        var x = rect / 2;
        var y = rect / 2;

        var ctx = this.refs[id].getContext('2d');
        ctx.beginPath();
        ctx.lineWidth = lineWidth;

        var getPercent = function (arr) {
            var
                sum = 0;
            arr.map(function (v, i) {
                sum += v.value * 1;
            });

            if(sum){
                arr.map( (v, i) => {
                    /*v.value = (v.value/sum).toFixed(2);*/
                    v.value = (v.value / sum);
                });
            }else{
                let length = arr.length;
                arr.map((v,i)=>{
                    v.value = 1/length;
                });
            }

            return arr;
        };

        //console.log(getPercent(opt));
        var drawChart = function (arr) {
            var angle = 0,
                PI = Math.PI * 2;
            for (var i = 0; i < arr.length; i++) {
                var start = angle,
                    end = angle + PI * arr[i].value,
                    color = arr[i].color;
                drawAngle(start, end, color);
                angle = end;
            }
        };

        var drawAngle = function (start, end, color) {
            ctx.beginPath();
            ctx.strokeStyle = color;
            ctx.arc(x, y, r, start, end);
            ctx.stroke();

        };

        drawChart(getPercent(opt));
    }

    componentDidMount(){
        this.drawRingChart('chart',this.props.data);
    }

    render(){
        return(
            <canvas ref="chart" width="400" height="400" className="scaleIn" style={{width:'200px',height:'200px',marginTop:'0.5rem'}}>
                您的手机暂不支持canvas
            </canvas>
        )
    }
}

export default LRRingChart;