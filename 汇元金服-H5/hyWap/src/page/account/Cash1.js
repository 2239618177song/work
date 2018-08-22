/**
 * Created by xhy on 17/7/13.
 */
/**
 * 提现
 */
import React from 'react';
import BaseComponent from '../../core/BaseComponent';
import {Link} from 'react-router';

import Title from '../../Component/titleBar/TitleBar';
import '../../res/css/account/cash_recharge.css';
import T from '../../tool/tool';
import InnerLoading from '../../Component/innerLoading/InnerLoading';
import AutoFixedBottom from '../../Component/autoFixedBottom/AutoFixedBottom';

class Cash extends BaseComponent{
    constructor(){
        super();
        this.state = {
            loaded:false,
            bankInfo:null,
            usable:0,
            amount:'',
            showBtn:true,
            freeCashCount:'--'
        }
    }

    flag = true;
    /**
     * 获取银行卡信息
     */
    getBankCardInfo(flag){
        T.ajax({
            url:'getAccountInfo'
        }).done((data)=>{
            if(!data.accountBank){//如果没绑卡
                T.Confirm('请先绑定银行卡',['确定','取消'],[()=>{
                    T.forward('/account/card/op/add');
                },()=>{
                    setTimeout(()=>{
                        T.forward('/account/index');
                    },100);

                }]);
                return;
            }
            if(flag){
                this.setMyState({
                    bankInfo:data.accountBank,
                    loaded:true,
                    usable:data.accountObj.usable
                })
            }else{
                this.setMyState({
                    loaded:true,
                    usable:data.accountObj.usable
                })
            }

        });
    }

    /**
     * 获取可免费提现次数
     */
    getFreeCount(){
        T.ajax({
            url:'getFreeCashCount'
        }).done((data)=>{
            this.setMyState({
                freeCashCount:data*1
            });

        });
    }

    /**
     * 控制提现金额的输入
     */
    handleAmountChange(e){
        let amount = e.target.value+'';
        if(!/^\d+\.?\d{0,2}$/.test(amount) && amount != ''){//输入控制,只能输入整数或者两位小数
            return;
        }

        if(amount*1 > this.state.usable){//提现金额不能大于余额
            amount = this.state.usable*1;
        }

        this.setMyState({
            amount
        })

    }

    /**
     * 控制提交
     */
    handleSubmit = (e)=>{
        let $btn = e.target;

        if(this.state.usable == 0){
            T.showToast('您的可提现金额为0');
            return;
        }

        if(!this.flag)return;

        T.ajax({
            url:'umpCash',
            method:'post',
            data:{
                cashAmount:this.state.amount,
                cardId:this.state.bankInfo.id
            },
            load:true
        }).done((url)=>{
            T.addClass($btn,'disabled');
            window.location.href = decodeURIComponent(url);
        })

    };

    componentDidMount(){
        let id = T.getQueryField('id');
        let bankName = T.getQueryField('bankName');
        let cardNo = T.getQueryField('cardNo');
        let bankCode = T.getQueryField('bankCode');

        if(!T.getQueryField('id')){
            this.getBankCardInfo(true);
        }else{
            this.setMyState({
                bankInfo:{
                    id,
                    bankName,bankCode,cardNo
                },
                loaded:true
            });
            this.getBankCardInfo(false);
        }

        this.getFreeCount();

    }

    render(){
        let {bankInfo,amount} = this.state;
        //debugger;
        return (
            <div className="_a_cash_rechargeSec">
                <Title title={'提现'}
                       right={[(<Link to="/account/charge/list/cash" key={1}>明细</Link>)]}
                       backCallback={()=>{T.forward('/account/index')}}
                    />
                <div className="card_info" onClick={()=>{
                    T.forward('/account/card/list')
                }}>
                    {
                        this.state.loaded ?
                            <div>
                                <div className="card_icon">
                                    <img src={require('../../res/images/bank/'+bankInfo.bankCode+'.png')} alt={bankInfo.bankName} width="100%"/>
                                </div>
                                <p className="card_name">{bankInfo.bankName}</p>
                                <p className="card_no">尾号{bankInfo.cardNo.slice(-4)}</p>
                                <span className="arrow"></span>
                            </div>
                            :
                            <InnerLoading height={'1.4rem'}/>
                    }

                </div>
                {/*银行卡信息*/}

                <div className="value_info">
                    可转出: <span className="main_color">{this.state.usable}</span>元
                </div>

                <div className="HY_form_item no_border">
                    <div className="label">金额</div>
                    <div className="input">
                        <input type="text"
                               placeholder="请输入提现金额"
                               onChange={this.handleAmountChange.bind(this)}
                               value={amount}
                               onFocus={()=>{
                                   this.setMyState({
                                    showBtn:false
                                   })
                               }}
                               onBlur={()=>{
                                   this.setMyState({
                                   showBtn:true
                                   })
                               }}
                            />
                    </div>
                </div>

                <p style={{textAlign:'right',color:'#999',padding:'0.2rem 0.3rem'}}>本月免费取现次数:{this.state.freeCashCount}次</p>
                <div className="tips_info">
                    <p className="title">手续费</p>
                    <p>取现手续费单笔为千分之2;</p>
                    <p>每月前5笔取现手续费完全由平台垫付，超过5笔手续费由用户自行支付;</p>
                    <p>用户操作取现将使用一次免费取现，如跳转至乾多多未操作或放弃取现以及取现失败，1小时后免费取现次数将返还;</p>

                    <p className="title">提现金额及到账时间</p>
                    <p>单笔提现金额最高为500万，最低为100元;</p>
                    <p>周一到周五:</p>
                    <p>9:00-16:00内发起的提现，2个小时后到账;</p>
                    <p>6:00-22:30内发起的提现，若金额不超过5万元，2个小时后到账，如金额超过5万元，则第二天到账;</p>
                    <p>周六周日:</p>
                    <p>9:00-22:30内发起的提现，若金额不超过5万元，2小时后到账，若金额超过5万元，则第二天到账;</p>
                    <p>其余时间段发起的提现，均为第二天到账。</p>

                </div>

                <div className="btn_area fixed" style={{display:this.state.showBtn ? 'block' : 'none'}}>
                    <a className="btn" onClick={this.handleSubmit.bind(this)}>确认</a>
                </div>

            </div>
        )
    }
}

export default Cash;