/**
 * Created by xhy on 17/7/13.
 */
/**
 * 支付页面
 */
import React from 'react';
import BaseComponent from "../../core/BaseComponent";
import '../../res/css/invest/invest.css';
import {Link} from 'react-router';

import Title from '../../Component/titleBar/TitleBar';
import BannerTitle from '../../Component/bannerTitle/BannerTitle';
import T from '../../tool/tool';
import InnerLoading from '../../Component/innerLoading/InnerLoading';
import InputDelay from '../../Component/inputDelay/InputDelay';


class InvestPay extends BaseComponent{

    constructor(props){
        super(props);
        this.state = {
            loaded:false,//加载状态
            expectIncome:'0.0',//预期收益
            couponInfo: {//券包使用信息
                red: null,
                rate: null
            },
            amount:'',//申购金额(初始化为空字符串)
            checked:true,//是否确认确认协议
            btnArea:{//按钮状态相关
                valid:false,
                btnText:'实际支付0.0元'
            },


            project:null,//标信息
            account:null,//账户对象
            canUseRed:0,//是否可以使用红包
            canUseInterest:0//是否可以使用加息券

        };
    }

    /**
     * 控制确认协议
     */
    handleProtocolChecked(){
        let checked = this.state.checked;
        this.setMyState({
            checked:!checked
        });
    }

    /**
     * 获取协议数据
     */
    getProtocolData(){
        let amount = this.props.amount;
        let pid = this.props.pid;

        amount = amount || 0;

        T.ajax({
            url:'protocol',
            load:true,
            data:{
                pid:pid,
                amount:amount
            }
        }).done((data)=>{
            data = data.replace(/<html>[\s\S]+<body>/gm,'').replace(/<\/body>[\s\S]+<\/html>/gm,'');
            //this.setLRState({
            //    show:true,
            //    content:data
            //});
        })
    }

    /**
     * 获取初始化数据
     */
    getInitData(){
        const pid = this.props.params.id;
        T.ajax({
            url:'invest',
            method:'post',
            data:{
                pid: pid
            }
        }).done((data)=>{
            this.setMyState({
                project:data.project,//标信息
                account:data.account,//账户对象
                loaded:true,//是否加载完成
                canUseRed:data.redEnvelopeRate*1,//是否可以使用红包
                canUseInterest:data.canIncreaseInterest*1//是否可以使用加息券
            });
        });
    }

    /**
     * 计算利息
     * @param amount
     */
    calcuateIncome(amount){
        T.ajax({
            url:'',
            data:{
                amount
            }
        })
    }

    /**
     * 延迟change回调方式
     */
    handleDelayChange = (value)=>{
        console.log('计算利息');
    };

    /**
     * 正常change回调方式
     */
    handleNormalChange = (value) =>{
        value = value.slice(0,8);
        this.setMyState({
            amount:value
        })
    };


    componentDidMount(){
        this.getInitData();
    }

    render(){
        let {loaded,project,account,expectIncome} = this.state;
        if(!loaded){
            T.showLoading();
            return(
                <div></div>
            );

        }

        T.hideLoading();

        return(
            <div className="_investPaySec">
                <Title title="支付" transparent={true}/>
                <BannerTitle height="5rem">
                    <div className="pro_info">
                        <div className="title">
                            {project.name}
                        </div>
                        <div className="rate">
                            {project.yearRate}%
                            {/*<span className="add_rate">
                                +1%
                            </span>*/}

                            <p className="title">年化收益率</p>
                        </div>

                        <div className="other_info">
                            <div className="item">
                                <p className="value">{project.cycle}</p>
                                <p className="title">项目期限({[,'天','周','月','季','年'][project.cycleType*1]})</p>
                            </div>

                            <div className="item">
                                <p className="value">{project.surplus}</p>
                                <p className="title">剩余可投(元)</p>
                            </div>
                        </div>
                    </div>
                </BannerTitle>

                <div className="list_info">
                    <div className="item">
                        <div className="label">可用余额:</div>
                        <div className="input">
                            <span className="main_color">{account.usable}元</span>
                        </div>
                        <div className="btn_area">
                            <Link to="/account/recharge" className="btn">充值</Link>
                        </div>
                    </div>

                    <div className="item">
                        <div className="label">预期收益:</div>
                        <div className="input">
                            <span className="main_color">{expectIncome}元</span>
                        </div>
                    </div>

                    <div className="item">
                        <div className="label">预期收益天数:</div>
                        <div className="input">
                            <span className="main_color">{project.remainDays}天</span>
                        </div>
                    </div>

                    <div className="item special">
                        <div className="label">购买金额:</div>
                        <div className="input">
                            <InputDelay type="number"
                                        placeholder={`${project.minInvest}元起购`}
                                        value={this.state.amount}
                                        maxLength={8}
                                        pattern={'[0-9]*'}
                                        normalChange={this.handleNormalChange}
                                        onDelayChange={this.handleDelayChange}
                                />
                        </div>
                        <div className="btn_area">
                            <Link to="/account/recharge" className="btn">全投</Link>
                        </div>
                    </div>
                </div>

                <div className="welfare_list">
                    <div className="item">
                        <div className="title">
                            <span className="icon icon-red"></span>
                            折扣红包
                        </div>

                        <div className="description">
                            50元红包
                        </div>

                        <div className="arrow"></div>

                        <div className="info main_color">金额不足,满5000元可使用</div>
                    </div>

                    <div className="item">
                        <div className="title">
                            <span className="icon icon-rate"></span>
                            加息券
                        </div>

                        <div className="description">
                            未选择
                        </div>

                        <div className="arrow"></div>

                        <div className="info">
                            介绍加息券的使用规则
                        </div>
                    </div>
                </div>


                <section className="checkProtocol">
                    <span>
                        <input type="checkbox" id="checkProtocol" checked={this.state.checked}
                               onChange={this.handleProtocolChecked.bind(this)}/>
                        <label htmlFor="checkProtocol" className="fakeCheckbox">
                            我同意《<a href="javascript:void(0)"
                                   className="main_red"
                                   id="previewProtocol"
                                   onClick={this.getProtocolData.bind(this)}>相关服务协议</a>》
                        </label>
                    </span>
                </section>

                <div className="btn_area">
                    <a className="btn">实际支付3000元</a>
                </div>
            </div>
        )
    }
}

export default  InvestPay;