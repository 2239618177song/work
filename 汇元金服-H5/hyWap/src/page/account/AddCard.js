/**
 * Created by xhy on 17/7/13.
 */
/**
 * 我的银行卡
 */
import React from 'react';
import BaseComponent from '../../core/BaseComponent';
import {Link} from 'react-router';

import Title from '../../Component/titleBar/TitleBar';
import '../../res/css/account/card.css';
import T from '../../tool/tool';
import CitySelect  from '../../Component/citySelect/CitySelect';
import bankList  from '../../tool/bankList';
import AutoFixedBottom from '../../Component/autoFixedBottom/AutoFixedBottom';

class AddCard extends BaseComponent{
    constructor(props){
        super(props);
        let LR_USER = JSON.parse(localStorage.getItem('LR_USER'));
        this.state = {
            cardNo:'',
            area:null,
            bank:null,

            title:this.props.params.type == 'add' ? '添加银行卡' : '修改银行卡',
            realName:'--',
            show:false
        }
    }

    /**
     * 获取真实姓名
     */
    setRealRealName(){
        T.ajax({
            url:'getUserInfo'
        }).done((data)=>{
            this.setMyState({
                realName:data.realName
            })
        });
    }

    componentDidMount(){
        this.setRealRealName();
    }


    static defaultProps = {
        type:T.getQueryField('type')*1
    };

    /**
     * 值的变化
     */
    handleValueChange(value){
        this.setMyState({
            cardNo:value.slice(0,20)
        })
    }

    /**
     * 控制表单的提交
     * @param e
     */
    handleSubmit(e){
        let $btn = e.target;
        let url = this.props.params.type== 'add' ? 'bindCard' : 'replaceCard';
        let {cardNo,area,bank} = this.state;

        if(cardNo == ''){
            T.showToast('银行卡号不能为空');
            return;
        }

        if(!/\d{16,20}/.test(cardNo)){
            T.showToast('银行卡号格式有误！');
            return;
        }

        if(bank == null){
            T.showToast('请选择开户行');
            return;
        }

        if(area == null){
            T.showToast('请选择所在地区');
            return;
        }

        let data = {
            cardNo,
            province:area.province.code,
            city:area.city.code,
            bankCode:bank.bankCode,
            bankName:bank.bankName,
            code:bank.code
        };

        T.addClass($btn,'disabled');

        T.ajax({
            url:url,
            data,
            method:'post',
            load:true
        }).done((data)=>{

            T.Alert('绑定成功',()=>{
                T.forward('/account/card/list')
            });

        },()=>{
            T.removeClass($btn,'disabled');
        }).fail(()=>{
            T.removeClass($btn,'disabled');
        });
    }

    /**
     * 控制地区选择器的开关
     */
    handleClick(){
        this.setMyState({
            show:!this.state.show
        })
    }

    /**
     * 关闭地区选择器
     */
    handleCancel(){
        this.setMyState({
            show:false
        })
    }

    /**
     * 开户行选择控制
     */
    handleBankSelect = (e)=>{
        let value = e.target.value;
        if(value == ''){
            this.setMyState({
                bank:null
            })
        }else{
            let bankInfo = value.split('-');
            this.setMyState({
                bank:{
                    bankCode:bankInfo[0],
                    code:bankInfo[1],
                    bankName:bankInfo[2]
                }
            })
        }
    };

    render(){
        return (
            <div className="_cardSec" style={{paddingBottom:'1.4rem'}}>
                <Title title={this.state.title}/>
                <div className="top_tips">
                    请绑定持卡人本人的银行卡
                </div>
                <div className="HY_form">
                    <div className="HY_form_item">
                        <div className="label">持卡人</div>
                        <div className="input">
                            <input type="text" value={this.state.realName} readOnly/>
                        </div>
                    </div>
                    <div className="HY_form_item">
                        <div className="label">卡号</div>
                        <div className="input">
                            <input type="number"
                                   placeholder="银行卡号"
                                   value={this.state.cardNo}
                                   name="cardNo"
                                   pattern="[0-9]*"
                                   onChange={(e)=>{
                                    this.handleValueChange(e.target.value);
                                   }}
                                   maxLength="10"/>
                        </div>
                    </div>
                </div>

                <div className="HY_form">
                    <div className="HY_form_item">
                        <div className="label">开户行</div>
                        <div className="input">
                            <select onChange={this.handleBankSelect.bind(this)}>
                                <option value="">请选择开户行</option>
                                {bankList.map((item,i)=>{
                                    return <option key={i} value={item.bankCode+'-'+item.code+'-'+item.bankName}>{item.bankName}</option>
                                })}
                            </select>
                        </div>
                    </div>
                </div>

                <div className="HY_form">
                    <div className="HY_form_item">
                        <div className="label">地区</div>
                        <div className="input">
                            <input type="text" onClick={this.handleClick.bind(this)} readOnly value={
                                this.state.area ?
                                this.state.area.province.name+'-'+this.state.area.city.name
                                :
                                '请选择地区'
                            }/>
                        </div>
                    </div>
                </div>

                { /*<div className="warm_tips">
                    <div className="title main_color">
                        温馨提醒
                    </div>
                    <div className="content">
                        目前支持持的银行:农行,招行...
                    </div>
                </div>*/}

                <CitySelect
                    show={this.state.show}
                    handleCancel={this.handleCancel.bind(this)}
                    selectCallback={(area)=>{
                                this.setMyState({
                                    area
                                });
                            }}
                />
                <AutoFixedBottom>
                    <div className="btn_area">
                        <a href="javascript:void(0)" className="btn" onClick={this.handleSubmit.bind(this)}>确认</a>
                    </div>
                </AutoFixedBottom>
            </div>
        )
    }
}

export default AddCard;