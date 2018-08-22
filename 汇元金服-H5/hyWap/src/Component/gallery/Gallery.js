/*
* Copyright 杭州异人异想网络科技有限公司  异人异想手机网贷理财wap版软件 All Rights Reserved
* @version 1.0  
*/
/*
* Copyright 杭州异人异想网络科技有限公司  异人异想手机网贷理财wap版软件 All Rights Reserved
* @version 1.0  
*/
import React,{Component} from 'react';
import LRBaseComponent from '../../core/BaseComponent';
import T from '../../tool/tool';
import '../../res/Component/Gallery.css';
class LRGrallery extends LRBaseComponent{
    constructor(){
        super();
    }

    render(){
        return(
            <div className="lrGrallery" style={{display: this.props.show ? 'block' : 'none'}}>
                <a className="hideBtn" onClick={this.props.handleClose}/>
                <GrallerWrap {...this.props}/>
            </div>
        )
    }
}


class GrallerWrap extends LRBaseComponent{

    constructor(props){
        super(props);
        this.state = {
            left:-this.width*(this.props.index-1),
            index:this.props.index,
            imgs:this.props.imgs || []
        }
    }

    componentWillReceiveProps(props){
        //console.log(props);
        this.setMyState({
            left:-this.width*(props.index-1),
            index:props.index,
            imgs:props.imgs || []
        })
    }

    width = window.screen.availWidth;

    moveObj = {
        cLeft:0,
        left:0
    };
    /**
     * 开始触发
     * @param e
     */
    handleTouchStart(e){
        console.log(e.touches[0]);
        let oLeft = e.touches[0].clientX;
        this.moveObj.left = oLeft;
        this.moveObj.cLeft = oLeft;
    }

    /**
     * 手指移动
     * @param e
     */
    handleTouchMove(e){
        e.preventDefault();
        let cLeft = e.targetTouches[0].clientX;
        let offset = cLeft - this.moveObj.left;//偏移量
        this.setMyState({
            left:this.state.left+offset
        });

        this.moveObj.left = cLeft;
    }

    /**
     * 滚动到指定的位置
     * @param index
     */
    slideToIndex = (index,callback)=>{
        T.animate({
            pri:this.state.left,
            end:-this.width*(index-1),
            duration:300,
            callback:(value)=>{
                this.setMyState({
                    left:value
                });
            },
            endCallback:(value)=>{
                callback(value)
            }
        });
    };

    /**
     * 手指离开
     * @param e
     */
    handleTouchEnd(e){
        let eLeft = e.changedTouches[0].clientX;
        let length = this.state.imgs.length;
        let offset = eLeft-this.moveObj.cLeft;
        if(offset < -100 && this.state.index < length){
            this.slideToIndex(this.state.index+1,(value)=>{
                this.setMyState({
                    index:this.state.index+1,
                    left:value
                });
            });
        }else if(offset > 100 && this.state.index > 1){
            this.slideToIndex(this.state.index-1,(value)=>{
                this.setMyState({
                    index:this.state.index-1,
                    left:value
                });
            });
        }else{
            this.slideToIndex(this.state.index,(value)=>{
                this.setMyState({
                    left:value
                });
            });
        }
    }

    componentDidMount(){

    }

    render(){
        let itemList = [];
        let imgs = this.props.imgs || [];

        imgs.map((v,i)=>{
            itemList.push(
                <li key={i} className="imgItem"
                    style={{width:this.width+'px'}}>
                    <img src={v} className="alignCenter"/>
                    <div className="pageNum">{i+1}/{imgs.length}</div>
                </li>
            )
        });

        return(
            <ul style={{'transform': 'translateX('+this.state.left+'px)','WebkitTransform': 'translateX('+this.state.left+'px)'}}
                onTouchStart={this.handleTouchStart.bind(this)}
                onTouchMove={this.handleTouchMove.bind(this)}
                onTouchEnd={this.handleTouchEnd.bind(this)}>
                {itemList}
            </ul>
        )
    }
}

export default LRGrallery;