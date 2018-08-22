/*
* Copyright 杭州异人异想网络科技有限公司  异人异想手机网贷理财wap版软件 All Rights Reserved
* @version 1.0  
*/
import React from 'react';
import BaseComponent from '../../core/BaseComponent';
import {Link} from 'react-router';

import '../../res/css/account/index.css';
import Nav from '../../Component/navigator/Navigator';
import T from '../../tool/tool';

class Index extends BaseComponent{
    constructor(){
        super();
        //let userInfo = this.getAccountInfo();
        this.state = {
            delay:false,//处理点透问题
            info:{
            }

        };

    }

    setDelay(){
        setTimeout(()=>{
            this.setMyState({
                delay:true
            })
        },300);
    }

    /**
     * 获取账户信息
     */
    getAccountInfo(){
        T.ajax({
            url:'getUserInfo',
            load:true
        }).done((data)=>{
            /*进入第一个页面的时候把账户信息存入本地缓存*/
            //console.log(data);
            //localStorage.setItem('LR_ACCOUNT',JSON.stringify(data.accountObj));
            this.setMyState({
                info:data
            });

            //let {usable,collect,welfareNumber,collectInterestYes} = data;
            //
            //let userInfo = this.state;
            //userInfo.usable = usable;
            //userInfo.collect = collect;
            //userInfo.yesterdayIncome = collectInterestYes;
            //this.setMyState({
            //    userInfo,
            //    bankName :data.accountBank ? data.accountBank.bankName : '暂未绑定银行卡',
            //    welfareNumber
            //
            //});
        });
    }

    /**
     * 获取消息数目
     */
    getMsgNum(){
        T.ajax({
            url:'messageNumberAjax'
        }).done((data)=>{
            this.setMyState({
                msgNum : data*1
            })
        });
    }


    /**
     * 充值提现银行卡前提判断
     */
    handleClickToJump = (e)=>{
        //debugger;
        let link = e.currentTarget.dataset.href;
        let isRealNameState = this.state.info.realNameState;
        if(isRealNameState*1 === 1){
            this.forward(link);
        }else{
            T.Alert('您还未实名认证,请先进行实名认证',()=>{
                this.forward('/setting/realName')
            });
        }
    };

    handleClickToCash = (e)=>{
        //debugger;
        let link = e.currentTarget.dataset.href;
        let isRealNameState = this.state.info.realNameState;
        let isPayPassword = this.state.info.isPayPassword;
        if(isPayPassword*1 === 0 && isRealNameState*1 === 1){
            this.forward(link);
        }else if(isPayPassword*1 !== 0 ){
            T.Alert('您还未设置支付密码,请先去设置',()=>{
                this.forward('/setting/payPwd/set')
            });
        }else if(isRealNameState*1 !== 1){
            T.Alert('您还未实名认证,请先进行实名认证',()=>{
                this.forward('/setting/realName')
            });
        }

    };

    componentDidMount(){
        this.getAccountInfo();
        //this.getMsgNum();
        this.setDelay();
    }

    render(){
        let {info} = this.state;
        return(
            <div className="_a_indexSec">
                <div className="user_info">
                    {
                        this.state.delay ?
                            <Link to="/account/msg" className={`icon icon-msg ${info.msgNum > 0 ? 'active' : ''}`}></Link>
                            :
                            ''
                    }

                    <Link to="/setting/index" className="icon icon-setting"></Link>
                    <div className="user_avatar">
                        <img src={info.avatar || require('../../res/images/default_hesd@2x.png')} alt=""/>
                        <p className="user_name">{info.userName}</p>
                    </div>
                </div>
                {/*用户信息*/}
                <div className="account_info">
                    <div className="yesterday_income">
                        <p className="title">昨日收益 ( 元 )</p>
                        <p className="value">{info.collectInterestYes}</p>
                    </div>

                    <div className="detail_info">
                        <div className="item">
                            <p className="title">
                                <span className="icon icon-money"></span>
                                待收金额(元)
                            </p>
                            <p className="value">
                                {info.collect}
                            </p>
                        </div>

                        <div className="item">
                            <p className="title">
                                <span className="icon icon-money"></span>
                                账户余额(元)
                            </p>
                            <p className="value">
                                {info.usable}
                            </p>
                        </div>
                    </div>

                    <div className="sub_type">
                        <Link className="item" data-href="/account/cash" onClick={this.handleClickToCash.bind(this)}>
                            <span className="icon icon-tixian"></span><i>提现</i>
                        </Link>
                        <Link className="item" data-href="/account/recharge" onClick={this.handleClickToJump.bind(this)}>
                            <span className="icon icon-chongzhi"></span><i>充值</i>
                        </Link>
                        <Link className="item" to="/account/asset">
                            <span className="icon icon-mingxi"></span><i>明细</i>
                        </Link>
                    </div>
                </div>
                {/*账户信息*/}

                <div className="op_list">
                    {/*<Link className="l_item" data-href="/account/card/list" onClick={this.handleClickToJump.bind(this)}>
                        <div className="title">
                            <span className="icon icon-card"></span>
                            银行卡
                        </div>
                        <div className="description">
                            <span className="main_color">{state.bankName}</span>
                        </div>
                        <div className="arrow"></div>
                    </Link>*/}
                    <Link className="l_item" to="/account/welfare">
                        <div className="title">
                            <span className="icon icon-welfare"></span>
                            我的券包
                        </div>
                        <div className="description">
                            <span className="main_color">{info.welfareNumber}张</span>
                        </div>
                        <div className="arrow"></div>
                    </Link>
                </div>

                <div className="op_list">
                    <Link className="l_item" to="/account/capital">
                        <div className="title">
                            <span className="icon icon-captialRecord"></span>
                            资金记录
                        </div>
                        <div className="arrow"></div>
                    </Link>
                    <Link className="l_item" to="/account/invest">
                        <div className="title">
                            <span className="icon icon-investRecord"></span>
                            投资记录
                        </div>
                        <div className="arrow"></div>
                    </Link>
                    <Link className="l_item" to="/account/calendar">
                        <div className="title">
                            <span className="icon icon-calendar"></span>
                            回款日历
                        </div>
                        <div className="arrow"></div>
                    </Link>
                </div>
                <Nav index="3"/>
            </div>
        )
    }
}

export default Index;