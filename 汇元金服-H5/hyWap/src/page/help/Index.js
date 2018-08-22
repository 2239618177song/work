/**
 * Created by xhy on 17/7/13.
 */
/**
 * 帮助中心
 */
import React from 'react';
import BaseComponent from '../../core/BaseComponent';
import {Link} from 'react-router';

import Title from '../../Component/titleBar/TitleBar';
import T from '../../tool/tool';

class Index extends BaseComponent{

    constructor(props){
        super(props);
        this.state = {
            list:[

            ]
        }
    }

    componentDidMount(){
        T.ajax({
            url:'getFaqType',
            load:true,
            method:'get'
        }).done((data)=>{
            this.setMyState({
                list: data
            })
        })
    }

    render(){
        let list = this.state.list;
        return (
            <div className="_helpSec">
                {
                    this.ifApp ? '' : <Title title={'帮助中心'}/>
                }

                <div className="op_list" style={{marginTop:this.ifApp ? '-0.8rem' : '0'}}>
                    {
                        list.map((item,i)=>{
                            return (
                                <Link key={i} className="l_item" to={`/setting/help/type/${item.id}?type=${item.name}`}>
                                    <div className="title">
                                        {item.name}
                                    </div>
                                    <div className="arrow"></div>
                                </Link>
                            )
                        })
                    }
                </div>
            </div>
        )
    }
}

export default Index;