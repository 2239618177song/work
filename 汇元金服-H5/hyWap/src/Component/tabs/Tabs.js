/*
* Copyright 杭州异人异想网络科技有限公司  异人异想手机网贷理财wap版软件 All Rights Reserved
* @version 1.0  
*/

/**
 *
 * 选项卡切换
 *
 */
import React from 'react';
import BaseComponent from '../../core/BaseComponent';
import '../../res/Component/Tabs.css';

class Tabs extends BaseComponent{

    constructor(props){
        super(props);
        this.state = {
            index:props.index === undefined ? 0 : props.index
        }
    }

    static defaultProps = {
        list:[
        ]
    };

    /**
     * 控制tab项的点击
     * @param index
     */
    handleItemClick(index,item){
        if(index !== this.state.index){
            this.props.list[index][1](index,item);
            this.setMyState({
                index:index
            });
        }
    }

    render(){
        const width = (1/this.props.list.length).toFixed(5)*100+'%';
        let tabList = this.props.list.map((item,i)=>{
            return (
                <a key={i}
                   className={i === this.state.index ? "tabItem active" : "tabItem"}
                   style={{
                     width:width
                   }}
                   onClick={()=>{
                    this.handleItemClick(i,item[0]);
                   }}>
                    {item[0]}
                </a>
            )
        });
        return (
            <div className="CPT_tabs">
                {tabList}
            </div>
        )
    }
}

export default Tabs;