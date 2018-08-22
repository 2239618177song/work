/*
* Copyright 杭州异人异想网络科技有限公司  异人异想手机网贷理财wap版软件 All Rights Reserved
* @version 1.0  
*/

/**
 *
 * 列表项目
 *
 */
import React from 'react';
import BaseComponent from '../../core/BaseComponent';
import {Link} from 'react-router';
import '../../res/Component/Item.css';

/**
 * item 容器
 */
class ItemWrap extends BaseComponent{

    constructor(props){
        super(props);
    }

    render(){
        return (
            <div className="CPT_itemWrap">
                <ul>
                    {this.props.children}
                </ul>
            </div>
        )
    }
}

/**
 * item 对象
 */
class Item extends BaseComponent{
    static defaultProps = {
        label:'标题',
        description:'',
        arrow:true,
        callback:null,
        url:''
    };

    handleClick(){
        if(this.props.url !== ''){
            this.history.push(this.props.url);
            console.log(this.history);
        }else{
            this.props.callback && this.props.callback();
        }
    };


    render(){
        return (
            <li className="item" onClick={this.handleClick.bind(this)}>
                <Link>
                    <span className="label">{this.props.label}</span>
                    {
                        this.props.arrow && <span className="arrow"/>
                    }
                    <span className="description">
                        {this.props.description}
                    </span>
                </Link>
            </li>
        )
    }
}

export {
    ItemWrap,
    Item
};