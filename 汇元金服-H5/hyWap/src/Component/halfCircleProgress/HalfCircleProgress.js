/*
* Copyright 杭州异人异想网络科技有限公司  异人异想手机网贷理财wap版软件 All Rights Reserved
* @version 1.0  
*/
import React,{Component} from 'react';
import BaseComponent from '../../core/BaseComponent';
import T from '../../tool/tool';
class HalfCircleProgress extends BaseComponent{
    constructor(props){
        super();
    }
    

    static defaultProps = {
        shape:300,
        lineWidth:6,
        percent:1,
        animation:'Bounce.easeOut',
        color:'#ff6600',
        duration:2000
    };

    paint(){

        const p = this.props;
        const ctx = this.refs.canvas.getContext('2d');
        ctx.translate(p.shape+40,p.shape+30);

        //ctx.globalCompositeOperation = 'source-atop';

        const clearPic = ()=>{
            ctx.clearRect(-p.shape*2,-p.shape*2,p.shape*4,p.shape*4);
        };


        /**
         * 画背景
         */
        const drawBg = ()=>{
            ctx.beginPath();
            ctx.strokeStyle = 'rgb(90,81,76)';
            ctx.lineWidth = p.lineWidth;
            ctx.arc(0,0,p.shape-p.lineWidth/2,Math.PI,2*Math.PI);
            ctx.stroke();
        };


        /**
         * 画进度
         * @param value
         */
        const drawStep = (value)=>{
            ctx.beginPath();
            ctx.strokeStyle = p.color;
            ctx.lineWidth = p.lineWidth;
            ctx.arc(0,0,p.shape-p.lineWidth/2,Math.PI,Math.PI*value+Math.PI);
            ctx.stroke();
        };

        /**
         * 那个圆
         * @param value
         */
        const drawCircle = (value)=>{
            ctx.beginPath();
            ctx.strokeStyle = p.color;
            ctx.lineWidth = 2;
            let arc = Math.PI*value;
            let r = p.shape-p.lineWidth/2;
            let x = -r*Math.cos(arc);
            let y = -r*Math.sin(arc);
            ctx.arc(x,y,30,0,2*Math.PI);

            ctx.strokeStyle = '#FDEAA3';
            ctx.lineWidth = 2;
            ctx.arc(x,y,30,0,2*Math.PI);

            ctx.fillStyle = p.color;
            ctx.fill();
            ctx.font = "26px Microsoft Yahei";
            ctx.fillStyle = '#FDEAA3';
            let text = (value*100).toFixed(0)+'%';
            let offset = ctx.measureText(text);
            ctx.fillText(text,x-offset.width/2,y+12);
            ctx.stroke();
        };

        T.animate({
            pri: 0,
            end: p.percent,
            duration: p.duration,
            timeFunc: p.animation,
            callback: (value)=>{
                clearPic();
                drawBg();
                drawStep(value);
                drawCircle(value);
            }
        });

    }

    componentDidMount(){
        this.paint();
    }

    render(){
        return (
            <canvas ref="canvas" width={this.props.shape*2+80} height={this.props.shape+80} style={{width:'100%'}}>
                您的手机不支持canvas
            </canvas>
        )
    }
}

export default HalfCircleProgress;