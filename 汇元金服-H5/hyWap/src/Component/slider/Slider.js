/*
* Copyright 杭州异人异想网络科技有限公司  异人异想手机网贷理财wap版软件 All Rights Reserved
* @version 1.0  
*/
import React,{Component} from 'react';
import {Link} from 'react-router';
import '../../res/Component/Slider.css';
import BaseComponent from "../../core/BaseComponent";
import T from '../../tool/tool';

class Slider extends BaseComponent{
    render(){
        return(
            <div className="LRSlider">
                <SliderWrap {...this.props}/>
            </div>
        )
    }
}


class SliderWrap extends BaseComponent{
    constructor(props){
        super(props);

        let psObj = this.getPositionArr(1);
        this.state = {
            index:1,//当前第几张
            position:psObj.position,//总的排序
            visiblePosition:psObj.visiblePosition//可见的排序
        };
    }

    static defaultProps = {
        time:5000
    };

    componentWillReceiveProps(props){
        //console.log(props);
        this.props = props;
        this.getPositionArr(1,true);
        this.openAutoPlay();
    }

    /**
     * 屏幕宽度
     * @type {Number}
     */
    width = window.screen.availWidth;

    /**
     * 组件全局定时器
     */
    timer;

    /**
     * 移动对象
     * @type {{left: number, offset: number}}
     */
    moveObj = {
        oLeft:0,//初始化left
        oLeftCache:0,//缓存初始化left
        offset:0,//偏移量
        eLeft:0,//结束时的位置left
        offsetCache:0//缓存全局偏移量
    };

    /**
     * 获取列表位置
     * @param index
     */
    getPositionArr(index,ifSet){
        //debugger;
        let psArr = [];
        let ps = this.props.imgList;
        let currentArr = [];
        let mapper = [{left:0,top:-10000},{left:-this.width,top:0},{left:0,top:0},{left:this.width,top:0}];
        if(index === 1){
            currentArr = [ps.length,1,2];
        }else if(index === ps.length){
            currentArr = [ps.length-1,ps.length,1];
        }else{
            currentArr = [index-1,index,index+1];
        }

        ps.map((v,i)=>{
            let obj = v;
            if(currentArr.indexOf(i+1) === -1){
                obj.style = mapper[0];
            }else{
                obj.style = mapper[currentArr.indexOf(i+1)+1];
            }
            psArr.push(obj);
        });

        ifSet&&this.setMyState({
            index:index,
            position:psArr,
            visiblePosition:currentArr
        });

        return {
            position:psArr,
            visiblePosition:currentArr
        };
    }

    /**
     * 开始触发
     * @param e
     */
    handleTouchStart(e){
        let oLeft = e.touches[0].clientX;
        this.moveObj.oLeft = this.moveObj.oLeftCache = oLeft;
        this.closeAutoPlay();
    }

    /**
     * 设置位置
     * @param offset
     */
    setPostion(){
        let state = this.state;
        state.position.map((v,i)=>{
            let obj = v;
            if(state.visiblePosition.indexOf(i+1) !== -1){
                obj.style.left = obj.style.left+this.moveObj.offset;
                state.position[i] = obj;
            }
        });

        this.setMyState(state);
    }

    /**
     * 手指移动
     * @param e
     */
    handleTouchMove(e){
        e.preventDefault();
        let cLeft = e.targetTouches[0].clientX;
        this.moveObj.offset = cLeft-this.moveObj.oLeft;
        this.setPostion();
        this.moveObj.oLeft = cLeft;
    }

    /**
     * 手指离开
     * @param e
     */
    handleTouchEnd(e){
        let eLeft = e.changedTouches[0].clientX;
        this.moveObj.offsetCache = eLeft-this.moveObj.oLeftCache;
        if(this.moveObj.offsetCache > 100){
            this.slideToIndex(2);
        }else if(this.moveObj.offsetCache < -100){
            this.slideToIndex(1);
        }else{
            this.slideToIndex(3);
        }
        this.moveObj.offsetCache = 0;
        this.openAutoPlay();
    }

    /**
     * 滑动到指定的index
     * @param index
     * @param type 1=>向右 2=>向左 3=>原点
     */
    slideToIndex(type){
        let end = 0;
        if(type === 1){
            end = -this.width;
        }else if(type === 2){
            end = this.width;
        }else{
            end = 0;
        }

        let state = this.state;

        T.animate({
            pri:this.moveObj.offsetCache,
            end:end,
            duration:200,
            callback:(value)=>{
                this.state.visiblePosition.map((v,i)=>{
                    state.position[v-1].style.left = value+(i-1)*this.width;
                });

                this.setMyState(state);
            },
            endCallback:()=>{
                let index  = this.state.index;
                if(type === 3){
                    return;
                }

                if(type === 1){
                    index = index === this.state.position.length ? 1 : index+1;
                }else{
                    index = index === 1 ? this.state.position.length : index-1;
                }
                this.getPositionArr(index,true);
            }
        });
    }

    /**
     * 自动轮播
     */
    openAutoPlay(){
        this.closeAutoPlay();
        this.timer = setInterval(()=>{
            this.slideToIndex(1)
        },this.props.time);
    }

    /**
     * 关闭自动播放
     */
    closeAutoPlay(){
        clearInterval(this.timer);
    }

    componentDidMount(){
        if(this.props.imgList.length){
            this.openAutoPlay();
        }

    }

    componentWillUnmount(){
        this.closeAutoPlay();
    }

    render(){
        let imgList = this.state.position;

        if(!this.props.imgList.length){
            return (
                <div className="sliderWrap">

                </div>
            );
        }
        let listArr = [];
        let ctrlArr = [];
        imgList.map((imgItem,i)=>{
            listArr.push(
                <li key={i} style={{'transform':'translateX('+imgItem.style.left+'px)','WebkitTransform':'translateX('+imgItem.style.left+'px)',top:imgItem.style.top+'px'}}>
                    <a href={imgItem.url}>
                        <img src={imgItem.path} alt={imgItem.alt}/>
                    </a>
                </li>
            );

            ctrlArr.push(
                <a key={i} className={this.state.index === (i+1) ? "actived":""}/>
            );
        });
        return(
            <div className="sliderWrap">
                <ul onTouchStart={this.handleTouchStart.bind(this)}
                    onTouchMove={this.handleTouchMove.bind(this)}
                    onTouchEnd={this.handleTouchEnd.bind(this)}>
                    {listArr}
                </ul>
                <aside className="dot_ctrl _dotCtrl">
                    {ctrlArr}
                </aside>
            </div>
        )
    }
}

export default Slider;