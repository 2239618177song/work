/*
* Copyright 杭州异人异想网络科技有限公司  异人异想手机网贷理财wap版软件 All Rights Reserved
* @version 1.0  
*/
import React,{Component} from 'react';
import BaseComponent from '../../core/BaseComponent';
import T from '../../tool/tool';
import '../../res/Component/LoadGrid.css';

/**
 * 上拉加载组件
 */
class LoadGrid extends BaseComponent{

    /**
     * 当前的页码
     * @type {number}
     */
    pageNo = 1;

    constructor(props){
        super(props);
        this.state = {
            //状态 加载中 普通 没有更多 没有数据
            state:'NORMAL',
            //数据列表
            list:[
            ],
            props:props

        }
    }

    /**
     * 获取数据列表
     * @param type 加载类型
     */
    getDataList(type='RESET'){
        const url = this.state.props.url;
        const args = JSON.parse(JSON.stringify(this.state.props.args));//额外传入的参数
        args.pageNo = this.pageNo;//加上pageNo参数
        this.changeState('LOADING');
        T.ajax({
            url:url,
            load:this.state.props.load || false,
            data:args
        }).done((data)=>{
            this.renderDataList(type,data);
            this.props.dataLoaded && this.props.dataLoaded(data);
        });
    }

    /**
     * 渲染列表及状态
     * @param type 加载类型
     * @param data 数据
     */
    renderDataList(type,data){
        let list = this.state.list;
        let loadState;
        if(type==='RESET'){//如果是置空的话
            list = data.list;
            loadState =
                data.list.length === 0 ? 'NOTHING' :
                    data.isHasNext*1 ? 'NORMAL' :
                        this.pageNo === 1? 'NOMORE' : 'NOTHING';

            this.pageNo = 2;

        }else{//如果是追加的话
            list = list.concat(data.list);
            loadState = data.list.length === 0 ? 'NOMORE' :  data.isHasNext*1 ? 'NORMAL' : 'NOMORE';

            this.pageNo++;
        }

        this.setMyState({
            list:list,
            state:loadState
        })
    }

    componentDidMount(){
        this.getDataList();
    }

    componentWillReceiveProps(props){
        //args必须是可序列化对象(判断序列化字符串相等)
        if(JSON.stringify(props.args) == JSON.stringify(this.props.args)){
            return;
        }

        this.state = {
            //状态 加载中 普通 没有更多 没有数据
            state:'NORMAL',
            //数据列表
            list:[
            ],
            props:props

        };

        this.pageNo = 1;//如果是上层组件发生数据流变化,则默认置pageNo为1

        this.getDataList();
    }

    /**
     * 改变数据列表状态
     * @param type
     */
    changeState(type){
        this.setMyState({
            state:type
        })
    }

    /**
     * 子组件事件触发反向数据流回调
     */
    handleEventEmitter(){
        this.getDataList('APPEND');
    }



    render(){
        return (
            <LoadGridWrap
                top={this.state.props.top}
                bottom={this.state.props.bottom}
                handleEventEmitter={this.handleEventEmitter.bind(this)}
                list={this.state.list}
                state={this.state.state}
                itemComponent={this.state.props.itemComponent}
            />
        );
    }
}

/**
 * 加载状态栏
 */
class LoadGridState extends BaseComponent{
    setLoadState(state){
        let result = [];
        switch(state){
            case 'LOADING':result.push(
                <div key="1" className="loading"></div>
            );break;
            case 'NORMAL':result.push(
                <div key="1">上拉查看更多</div>
            );break;
            case 'NOMORE':result.push(
                <div key="1">没有更多啦</div>
            );break;
            case 'NOTHING':result.push(
                <div key="1"  style={{textAlign:'center',paddingTop:'60px',fontSize:'0.28rem'}}>
                    <img src={require('../../res/images/zhanweitu@2x.png')} alt="" width="180"/>
                    <p style={{marginTop:'10px',fontSize:'0.28rem'}}>没有结果哦~</p>
                </div>
            );break;


        }

        return result;
    }

    render(){
        let result = this.setLoadState(this.props.state);
        return (
            <div className="LoadState">{result}</div>
        )
    }
}

/**
 * 上拉加载容器
 */
class LoadGridWrap extends BaseComponent{

    constructor(props) {
        super(props);
        this.state = {};
    }

    render(){
        const ItemCpts = this.props.itemComponent;
        const itemList = [];
        this.props.list.map((item,i)=>{
            itemList.push(
                <ItemCpts item={item} key={i} index={i}/>
            )
        });

        return(
            <div className="LoadGridWrap" ref="loadWrapDom" style={{top:this.props.top,bottom:this.props.bottom}}>
                <div className="LoadGridInner" ref="loadInnerDom">
                    {itemList}
                    <LoadGridState state={this.props.state}/>
                </div>
            </div>
        );
    }

    /**
     * 渲染数据
     */
    renderData(){
        this.props.handleEventEmitter();
    }

    /**
     * 事件回调
     */
    loadData = ()=>{
        const wrapHeight = this.refs.loadWrapDom.offsetHeight;//外容器高度
        const innerHeight = this.refs.loadInnerDom.offsetHeight;//内容器高度
        const scrollTop = this.refs.loadWrapDom.scrollTop;//滚动条距离顶部的距离
        const state  = this.props.state;//列表数据状态
        if(wrapHeight+scrollTop >= innerHeight && innerHeight > wrapHeight && state =='NORMAL'){//保证内容器高度大于外容器,且到达底部
            console.log('开始加载数据并重新渲染');
            this.renderData();
        }
    };

    /**
     * 绑定滚动事件
     */
    bindScroll(){
        this.refs.loadWrapDom.addEventListener('scroll',this.loadData);
    }

    /**
     * 解除绑定滚动事件
     */
    removeScroll(){
        this.refs.loadWrapDom.removeEventListener('scroll',this.loadData);
    }

    componentDidMount(){
        this.bindScroll();//绑定滚动事件
    }

    componentWillUnmount(){
        this.removeScroll();//解除绑定滚动事件
    }


}

export {
    LoadGrid,
    LoadGridState,
    LoadGridWrap
}