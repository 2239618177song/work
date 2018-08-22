/**
 * Created by xhy on 17/7/13.
 */
/**
 * 收货地址
 */
import React from 'react';
import BaseComponent from '../../../core/BaseComponent';
import BaseForm from '../../../Component/form/Form';
import {Link} from 'react-router';

import Title from '../../../Component/titleBar/TitleBar';
import AutoFixedBottom from '../../../Component/autoFixedBottom/AutoFixedBottom';
import T from '../../../tool/tool';

class Address extends BaseForm{
    constructor(){
        super();
        this.state = {
            form:{
                mobile:'',
                name:'',
                address:'',
                remark:''
            }
        }
    }

    valid = {
        name:{
            required:true,
            emptyText:'收货人不能为空',
            valid:'',
            invalidText:'收货人格式有误'
        },
        mobile:{
            required:true,
            emptyText:'手机号码不能为空',
            valid:/^1[3-8]\d{9}$/,
            invalidText:'手机号码格式有误'
        },
        address:{
            required:true,
            emptyText:'收货地址不能为空',
            valid:'',
            invalidText:'收货地址格式有误'
        },
        remark:{
            required:false,
            emptyText:'',
            valid:'',
            invalidText:''
        }
    };

    getInitData = ()=>{
        T.ajax({
            url:'getAddress',
            load:true
        }).done((data)=>{
            this.setMyState({
                form:data
            })
        });
    };

    componentDidMount(){
        this.getInitData();
    }

    handleSubmit = (e) => {
        const $btn = e.target;

        //字段前端验证
        const validInputs = Object.keys(this.valid);

        for(let i = 0,length = validInputs.length;i < length;i++){
            const value = this.state.form[validInputs[i]];
            const validObj = this.valid[validInputs[i]];
            if(!this.validate(value,validObj))return;
        }

        T.addClass($btn,'disabled');

        T.ajax({
            method:'post',
            url:'submitAddress',
            data:this.state.form
        }).done((data)=>{
            T.showToast('收货地址添加成功');
            T.removeClass($btn,'disabled');
            setTimeout(()=>{
                T.forward('/setting/index');
            },1000);

        },()=>{
            T.removeClass($btn,'disabled');
        }).fail(() => {
            T.removeClass($btn,'disabled');
        })
    };

    render(){

        return (
            <div className="_addressSec" style={{paddingBottom:'1.4rem'}}>
                <Title title="收货地址管理"/>
                <div className="HY_form_item no_border">
                    <div className="label">姓名</div>
                    <div className="input">
                        <input type="text"
                               placeholder="请输入您的姓名"
                               name="name"
                               autoComplete="off"
                               onChange={this.handleInputChange.bind(this)}
                               value={this.state.form.name}
                               ref="name"
                               maxLength="100"
                            />

                    </div>
                </div>

                <div className="HY_form_item no_border">
                    <div className="label">手机号码</div>
                    <div className="input">
                        <input type="number"
                               placeholder="请输入您的手机号"
                               name="mobile"
                               pattern="[0-9]*"
                               autoComplete="off"
                               onChange={this.handleInputChange.bind(this)}
                               value={this.state.form.mobile}
                               maxLength="11"/>
                    </div>
                </div>

                <div className="HY_form_item no_border">
                    <div className="label">收货地址</div>
                    <div className="input">
                        <input type="text"
                               placeholder="请输入您的收货地址"
                               name="address"
                               autoComplete="off"
                               onChange={this.handleInputChange.bind(this)}
                               value={this.state.form.address}
                               maxLength="200"
                            />
                    </div>
                </div>

                <div className="HY_form_item no_border">
                    <div className="label">备注</div>
                    <div className="input">
                        <input type="text"
                               placeholder="请输入您的备注信息"
                               name="remark"
                               autoComplete="off"
                               onChange={this.handleInputChange.bind(this)}
                               value={this.state.form.remark}
                               maxLength="200"
                            />
                    </div>
                </div>

                <AutoFixedBottom>
                    <div className="btn_area">
                        <a className="btn" onClick={this.handleSubmit.bind(this)}>确认</a>
                    </div>
                </AutoFixedBottom>
            </div>
        )
    }
}

export default Address;