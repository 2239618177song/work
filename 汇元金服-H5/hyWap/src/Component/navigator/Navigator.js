/*
* Copyright 杭州异人异想网络科技有限公司  异人异想手机网贷理财wap版软件 All Rights Reserved
* @version 1.0  
*/

/**
 *
 * 底部导航栏
 *
 */
import React from 'react';
import BaseComponent from '../../core/BaseComponent';
import {Link} from 'react-router';
import '../../res/Component/Navigator.css';

class Navigator extends BaseComponent{

    constructor(props){
        super(props);
    }
    
    static defaultProps = {
        index:1,
        navList:[
            {
                url:'/', className:'icon-home', text:'首页'
            },{
                url:'/invest/list', className:'icon-invest', text:'投资'
            },{
                url:'/activity', className:'icon-activity', text:'活动'
            },{
                url:'/account/index', className:'icon-account', text:'账户'
            }
        ]
    };


    render(){
        const navs = [];
        this.props.navList.map((nav,i)=>{
            navs.push(
                <Link to={nav.url}
                      key={i}
                      className={i === this.props.index*1?'item active':'item'}>
                    <span className={"icon "+nav.className}/>
                    <p>{nav.text}</p>
                </Link>);
            return true;
        });

        return (
            <div className="HY_navigator">
                {navs}
            </div>
        )
    }
}

export default Navigator;