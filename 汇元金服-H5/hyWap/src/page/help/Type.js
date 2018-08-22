/**
 * Created by xhy on 17/7/13.
 */
/**
 * 帮助中心-分类
 */
import React from 'react';
import BaseComponent from '../../core/BaseComponent';
import {Link} from 'react-router';

import Title from '../../Component/titleBar/TitleBar';
import T from '../../tool/tool';

class Type extends BaseComponent{
    constructor(){
        super();
        this.state = {
            list:[],
            title:T.getQueryField('type') || '帮助中心'
        }
    }

    /**
     * 获取信息
     */
    getListData = ()=>{
        T.ajax({
            url:'getFaqList',
            load:true,
            data:{
                type : this.props.params.id
            }
        }).done((data)=>{
            this.setMyState({
                list: data.list.map((item,i)=>{
                    item.open = false;
                    return item;
                })
            })
        });
    };

    /**
     * 开关
     * @param index
     */
    toggle = (index)=>{
        let {list} = this.state;
        list[index].open = !list[index].open;
        this.setMyState({
            list
        })
    };

    componentDidMount(){
        this.getListData();
    }

    render(){
        return (
            <div className="_helpSec" style={{marginTop:this.ifApp ? '-1rem' : '0' }}>
                {
                    this.ifApp ? '' : <Title title={this.state.title}/>
                }
                <div className="op_list">
                    {
                        this.state.list.map((item,i)=>{
                            console.log(item.open ? "open" : "");
                            return (
                                <div key={i} className="qa_item" onClick={()=>{this.toggle(i)}}>
                                    <Link className={`l_item ${item.open ? "open" : "close"}`}>
                                        <div className="title">
                                            {item.problem}
                                        </div>
                                        <div className="arrow"></div>
                                    </Link>
                                    <div className={`content ${item.open ? "show" : ""}`} dangerouslySetInnerHTML={{__html:item.answer}}>

                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
        )
    }
}

export default Type;