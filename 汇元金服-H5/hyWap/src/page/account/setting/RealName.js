/**
 * Created by xhy on 17/7/13.
 */
/**
 * 实名认证
 */
import React from 'react';
import BaseForm from  '../../../Component/form/Form';
import {Link} from 'react-router';

import Title from '../../../Component/titleBar/TitleBar';
import AutoFixedBottom from '../../../Component/autoFixedBottom/AutoFixedBottom';
import T from '../../../tool/tool';

class RealName extends BaseForm{
    constructor(){
        super();
        this.state = {
            form:{
                realName:'',
                identifyCard:''
            }

        }
    }

    /**
     * 表单验证
     * @type {{mobile: {}}}
     */
    valid = {
        realName:{
            required:true,
            emptyText:'真实姓名不能为空',
            valid:/^.{2,}$/,
            invalidText:'真实姓名格式有误'
        },
        identifyCard:{
            required:true,
            emptyText:'身份证号码不能为空',
            valid:/^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/,
            invalidText:'身份证号码格式有误'
        }
    };

    /**
     * 表单提交
     * @type {boolean}
     */
    handleSubmit = (e)=>{
        e.preventDefault();

        //字段前端验证
        const validInputs = Object.keys(this.valid);

        for(let i = 0,length = validInputs.length;i < length;i++){
            const value = this.state.form[validInputs[i]];
            const validObj = this.valid[validInputs[i]];
            if(!this.validate(value,validObj))return;
        }

        T.ajax({
            method:'post',
            url:'bindIdentify',
            load:true,
            data:this.state.form
        }).done((result)=>{
            T.showToast('恭喜您，实名认证成功！');
            T.forward('/setting/index');
        }).fail();
    };

    render(){
        return (
            <div className="_realNameSec">
                <Title title="实名认证"/>
                <div className="HY_form_item no_border">
                    <div className="label">姓名</div>
                    <div className="input">
                        <input type="text"
                               placeholder="请输入您的真实姓名"
                               name="realName"
                               autoComplete="off"
                               onChange={this.handleInputChange.bind(this)}
                               value={this.state.form.realName}
                               maxLength="20"
                            />
                    </div>
                </div>

                <div className="HY_form_item no_border">
                    <div className="label">身份证</div>
                    <div className="input">
                        <input type="text"
                               placeholder="请输入您的身份证号"
                               name="identifyCard"
                               autoComplete="off"
                               onChange={this.handleInputChange.bind(this)}
                               value={this.state.form.identifyCard}
                               maxLength="18"
                            />
                    </div>
                </div>

                <div className="tips">
                    注意：实名认证后的身份信息不可更改
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

export default RealName;