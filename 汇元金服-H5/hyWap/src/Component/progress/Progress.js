/*
* Copyright 杭州异人异想网络科技有限公司  异人异想手机网贷理财wap版软件 All Rights Reserved
* @version 1.0  
*/
import React from 'react';
import BaseComponent from '../../core/BaseComponent';
import T from '../../tool/tool';
import deepEqual from 'deep-equal';


class Progress extends BaseComponent{
    constructor(props){
        super();
        this.state = props;
    }

    static defaultProps = {
        shape:300,
        lineWidth:10,
        percent:0.9,
        animation:'Bounce.easeOut',
        color:'#e0472b',
        duration:300
    };

    paint(){

        const p = this.state;
        const ctx = this.refs.canvas.getContext('2d');
        //ctx.globalCompositeOperation = 'source-atop';

        ctx.beginPath();

        ctx.lineWidth = 1;
        ctx.strokeStyle = '#ccc';
        ctx.arc(p.shape,p.shape,p.shape-p.lineWidth/2-11,0,2*Math.PI);
        ctx.stroke();

        ctx.beginPath();
        ctx.strokeStyle = '#ddd';
        ctx.lineWidth = p.lineWidth;
        ctx.arc(p.shape,p.shape,p.shape-p.lineWidth/2,0,2*Math.PI);
        ctx.stroke();


        const drawByStep = (value)=>{
            ctx.beginPath();
            ctx.strokeStyle = p.color;
            ctx.lineWidth = p.lineWidth;
            ctx.arc(p.shape,p.shape,p.shape-p.lineWidth/2,-Math.PI/2,2*Math.PI*value-Math.PI/2);
            ctx.stroke();
        };

        T.animate({
            pri: 0,
            end: p.percent,
            duration: p.duration,
            timeFunc: p.animation,
            callback: (value)=>{
                drawByStep(value);
            }
        });

    }



    componentDidMount(){
        this.paint();
    }

    componentWillReceiveProps(props){
        if(!deepEqual(props,this.props)){
            this.setMyState(props);
            setTimeout(()=>{
                this.paint();
            });
        }

    }

    //shouldComponentUpdate(a,b){
    //    console.log(a,b);
    //    console.log(deepEqual(a,b));
    //    return !deepEqual(a,b);
    //}

    render(){
      return (
          <canvas ref="canvas" width={this.state.shape*2} height={this.state.shape*2} style={{width:this.state.shape+'px'}}>
              您的手机不支持canvas
          </canvas>
      )
    }
}

export default Progress;