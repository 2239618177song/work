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
import KeyBoard from '../../Component/keyBoard/KeyBoard';
import BaseForm from '../../Component/form/Form';

class Cash extends BaseComponent{
    constructor(){
        super();
        this.state = {
            
        }
    }

    render(){
        return (
            <div className="_a_cash_rechargeSec">
                <Title title={'提现'}
                       right={[(<Link to="/account/charge/list/cash" key={1}>明细</Link>)]}
                       backCallback={()=>{T.forward('/account/index')}}
                    />
                
                {/*银行卡信息*/}
                <OperationCash /> 
                
            </div>
        )
    }
}

class OperationCash extends BaseForm{
    constructor(props){
        super(props);
        this.state = {
            form:{//表单数据
                mobile:'15000000000',
                vCode:'',
                password:'',
                imgVCodeInput:''
            },
            payPassword: '',//支付密码
            showTips: false,//是否显示支付密码输入框,
            amount:'',
            bankInfo:null,
            usable:0,
            loaded:false,
            showBtn:true,
            freeCashCount:'--',//免费提现次数
        }
    }

    /**
     * 表单验证
     */
    valid = {
        imgVCodeInput:{
            required:true,
            emptyText:'图形验证码不能为空',
            valid:'',
            invalidText:''
        },
        mobileVCode:{
            required:true,
            emptyText:'手机验证码不能为空',
            valid:'',
            invalidText:''
        }
    };

    /**
     * 获取当前的手机号码，遮挡过的
     */
    getCurrentPhone(){
        return JSON.parse(localStorage.getItem('LR_USER')).mobile;
    }

    /**
     * 发送验证码回调函数
     * @param e
     */
    sendVCode(e){
        const $btn = e.target;
        this.handleSendVCode($btn,{
            $input:this.refs.mobile,//手机号码
            $vcode:this.refs.imgVCodeInput,//图形验证码框
            $imgVcode:this.refs.imgVCode,//图形验证码
            url:'sendMobileVCode',
            delay:120,
            keyName:'mobile',
            extraArgs:{
                type:5,
                token:this.TOKEN
            },
            successCallback:T.noop,//操作成功以后的回调
            timeoutCallback:()=>{
                let form = this.state.form;
                form.imgVCodeInput = '';
                this.setMyState({
                    form
                })
            }//超时未处理以后需要重新发送的回调
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

        //初始化验证码发送
        this.initImgVCode(this.refs.imgVCode,{
            token:this.TOKEN
        });

        this.getFreeCount();
    }

    /**
     * 控制提交
     */
    handleSubmit = (e)=>{
        let {usable, amount ,form} = this.state;

        if(usable == 0){
            T.showToast('您的可提现金额为0');
            return;
        }

        if(amount == ''){
            T.showToast('请输入提现金额');
            return;
        }

        if(amount < 2){
            T.showToast('提现金额必须大于2元');
            return;
        }

        //字段前端验证
        const validInputs = Object.keys(this.valid);

        for(let i = 0,length = validInputs.length;i < length;i++){
            const value = this.state.form[validInputs[i]];
            const validObj = this.valid[validInputs[i]];
            if(!this.validate(value,validObj))return;
        }

        if(form.vCode == ''){
            T.showToast('请输入手机验证码');
            return;
        }

        this.setMyState({
            showTips:true
        })

    };

    /**
     * 提交表单
     */
    submitOrder = (payPassword)=>{
        let $btn = this.refs.submitBtn;
        
        let {form,amount} = this.state;

        T.ajax({
            url:'umpCash',
            method:'post',
            data: {
                cardId:this.state.bankInfo.id,
                payPassword,
                cashAmount: amount,
                vCode:form.vCode,
            },
            load:true
        }).done((url)=>{
            T.addClass($btn,'disabled');
            T.showToast('恭喜您，取现申请成功~');
            setTimeout(()=>{
                T.forward('/account/charge/list/cash');
            })
        },({errmsg})=>{
            T.showToast(errmsg);
            this.setMyState({
                payPassword: ''
            })
            setTimeout(()=>{
                window.location.reload();
            },1000)
        }).fail(()=>{
            this.setMyState({
                payPassword: ''
            })
        })

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

    render(){
        let {payPassword ,amount ,bankInfo ,usable ,freeCashCount} = this.state;
        return(
            <div>
                <div className="card_info" onClick={()=>{
                    T.forward('/account/card/list')
                }}>
                    {
                        this.state.loaded ?
                            <div>
                                <div className="card_icon">
                                    <img src={require('../../res/images/bank/'+bankInfo.bankCode.substr(0,6)+'.png')} alt={bankInfo.bankName} width="100%"/>
                                </div>
                                <p className="card_name">{bankInfo.bankName}</p>
                                <p className="card_no">尾号{bankInfo.cardNo.slice(-4)}</p>
                                <span className="arrow"></span>
                            </div>
                            :
                            <InnerLoading height={'1.4rem'}/>
                    }

                </div>
                <div className="value_info">
                    可转出: <span className="main_color">{usable}</span>元
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
                <div className="HY_form_item no_border">
                    <div className="label">手机号</div>
                    <div className="input" style={{paddingLeft: '.4rem'}}>
                        <input type="text" readOnly="readOnly" value={this.getCurrentPhone()}/>
                        <input type="hidden"
                               name="mobile"
                               pattern="[0-9]*"
                               onChange={this.handleInputChange.bind(this)}
                               value={this.state.form.mobile}
                               ref="mobile"
                               maxLength="11"/>
                    </div>
                </div>

                <div className="HY_form_item no_border">
                    <div className="label">图形验证码</div>
                    <div className="input">
                         <input type="text"
                            name="imgVCodeInput"
                            placeholder="请输入图形验证码"
                            maxLength="4"
                            onChange={this.handleInputChange}
                            value={this.state.form.imgVCodeInput}
                            ref="imgVCodeInput"
                            autoComplete="off"
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
                    <a className="v_img">
                        <img src="" alt="" ref="imgVCode" onClick={this.handleChangeImgVCode.bind(this)}/>
                    </a>
                </div>

                <div className="HY_form_item no_border">
                    <div className="label">短信验证码</div>
                    <div className="input">
                        <input type="text"
                                name="vCode"
                                placeholder="请输入短信验证码"
                                pattern="[0-9]*"
                                onChange={this.handleInputChange}
                                value={this.state.form.vCode}
                                maxLength="4"
                                autoComplete="off"
                            />
                    </div>
                        <a className="v_btn" onClick={this.sendVCode.bind(this)}>
                            发送验证码
                        </a>
                </div>

                <p style={{textAlign:'right',color:'#999',padding:'0.2rem 0.3rem'}}>本月免费取现次数:{freeCashCount}次</p>
                <div className="tips_info">
                    <p className="title"style={{marginTop:'0rem'}}>提现规则</p>
                    <p>1.提现2元起提；</p>
                    <p>2.每位用户每月可享受5次免费提现，超出后提现手续费为2元/笔，手续费将从您的提现金额中扣除；</p>
                    <p>3.提现到账时间：周一至周日0:00-16:00间发起的提现，当天24:00前到账；16:00-23:59分间发起的提现，次日24：00前到账，具体到账时间视银行而定；国家法定节假日提现到账时间请以官方公告为准；</p>
                    <p>4.体验金收益需完成一次真实投资后才可提现；</p>
                    <p>5.若提现过程中遇到任何问题，请及时联系我们 400-872-9577。</p>
                </div>

                <div className="btn_area fixed" style={{display:this.state.showBtn ? 'block' : 'none'}}>
                    <a className="btn" onClick={this.handleSubmit.bind(this)} ref="submitBtn">确认</a>
                </div>
                <KeyBoard payPwd={payPassword}
                          show={this.state.showTips}
                          successCallback={this.submitOrder}
                          onClose={()=>{
                              this.setMyState({
                                  showTips: false
                              })
                          }}
                />
            </div>
        )
    }
}

export default Cash;