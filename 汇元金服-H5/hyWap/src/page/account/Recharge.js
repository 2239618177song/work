/**
 * Created by xhy on 17/7/13.
 */
/**
 * 充值
 */
import React from 'react';
import BaseComponent from '../../core/BaseComponent';
import {Link} from 'react-router';

import Title from '../../Component/titleBar/TitleBar';
import '../../res/css/account/cash_recharge.css';
import AutoFixedBottom from '../../Component/autoFixedBottom/AutoFixedBottom';
import T from '../../tool/tool';
import config from '../../tool/config';

class Recharge extends BaseComponent{
    constructor(){
        super();
        this.state = {
            amount:''
        }
    }
    /**
     * 控制提交按钮
     */
    handleSubmit = ()=>{
        let {amount} = this.state;
        if(amount == ''){
            T.showToast('请输入充值金额!');
            return;
        }
        if(!/^\d+$/.test(amount)){
            T.showToast('输入的金额有误!');
            return;
        }

        if(amount*1 < 20)
        {
            T.showToast('最小充值金额为20元!');
            return;
        }
        T.ajax({
            url:'umpRecharge',
            data:{
                amount
            },
            method:'post',
            load:true
        }).done((data)=>{
			this.requestThirdPart(data.url,data);
//         window.location.href = decodeURIComponent(data);
        });
    };
	
	 /**
     * 对象转为拼接字符串
     */
    getSearch(obj) {
        var search = '';
        if(typeof obj === 'object'){//如果需要传递额外参数
            var args = [];
            for(var key in obj){
                args.push(key+'='+obj[key]);
            }
            search += args.join('&');
        }else{
            search += '';
        }

        if(search.length === 1){
            search = '';
        }

        return search;
    }
	
	/**
     * 请求第三方充值接口
     */
    requestThirdPart(url,data){
        let queryStr = this.getSearch(data);
        console.log(queryStr);
        window.location.href = decodeURIComponent(config.activityIp+'/payJump?'+queryStr);
    }

    /**
     * 控制金额输入
     */
    handleAmountChange = (e)=>{
        let amount = e.target.value;
        this.setMyState({
            amount
        })

    };

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

    componentDidMount(){
        this.getBankCardInfo();
    }

    render(){
        return (
            <div className="_a_cash_rechargeSec">
                <Title title={'充值'} right={[(<Link to="/account/charge/list/recharge" key={1}>明细</Link>)]}/>

                <div className="HY_form_item no_border" style={{marginTop:'0.2rem'}}>
                    <div className="label">金额</div>
                    <div className="input">
                        <input
                            type="number"
                            placeholder="请输入充值金额"
                            pattern="[0-9]*"
                            maxLength="8"
                            value={this.state.amount}
                            onChange={this.handleAmountChange.bind(this)}
                            />
                    </div>
                </div>

                {/*<div className="select_type">
                    <a href="" className="type wangyin"></a>
                    <a href="" className="type quick"></a>
                </div>*/}

                <AutoFixedBottom>
                    <div className="btn_area">
                        <a className="btn" onClick={this.handleSubmit.bind(this)}>确定</a>
                    </div>
                </AutoFixedBottom>
            </div>
        )
    }
}

export default Recharge;