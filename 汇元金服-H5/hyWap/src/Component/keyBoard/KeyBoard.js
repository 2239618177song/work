/**
 * Created by xhy on 17/9/12.
 */
import React from 'react';
import BaseComponent from '../../core/BaseComponent';
import '../../res/Component/KeyBoard.css';

class KeyBoard extends BaseComponent{
    static defaultProps = {
        showTips: false,
        payPwd:'',
        callback: (data)=>{

        },
        successCallback: (data)=>{

        },
        onClose: ()=>{

        }
    }

    constructor(props){
        super(props);
        let {payPwd, show} = props;
        payPwd = payPwd.split('');
        this.state = {
            payPwd,
            show
        }
    }

    componentWillReceiveProps(nextProps){
        let {payPwd, show} = nextProps;
        payPwd = payPwd.split('');
        this.state = {
            payPwd,
            show
        }
    }

    /**
     * 关闭键盘
     */
    closeKeyBoard = ()=>{
        this.props.onClose();
    }

    /**
     * 按钮的点击
     * @param e
     */
    handleClick = (e)=>{
        let $this = e.target;
        let {payPwd} = this.state;
        //if(payPwd.length <= 0 || payPwd.length >= 6)return;
        if($this.tagName.toLowerCase() === 'a'){
            if($this.className.indexOf('backspace') !== -1){//删除按钮
                if(payPwd.length){
                    payPwd = this.state.payPwd.slice(0,-1)
                }else{
                    return;
                }
                // payPwd.length && (payPwd = this.state.payPwd.slice(0,-1));

            }else{//数字按钮
                if(payPwd.length < 6){
                    payPwd.push($this.dataset.num*1);
                }else{
                    return;
                }
            }

            this.setMyState({
                payPwd
            });

            if(payPwd.length === 6){
                this.props.successCallback(payPwd.join(''));
            }else{
                this.props.callback(payPwd.join(''));
            }
        }
    }

    render(){

        let {show, payPwd} = this.state;
        return (
            <div id="quickInvestPsw" className={show?'show':''}>
                <div className="mask"> </div>
                <div className="wrap">
                    <div className="title">
                        <a className="close" onClick={this.closeKeyBoard}/>
                        请输入您的支付密码
                    </div>
                    <div className="inputWrap">
                        {
                            payPwd.map((v,i)=> <span key={i} data-key={v}>●</span>)
                        }
                    </div>
                    <input type="hidden" name="payPwd" id="payPwd"/>
                    <div className="lrKeyboard" id="lrKeyboard" onClick={this.handleClick}>
                        <table>
                            <tbody>
                            <tr>
                                <td><a href="javascript:void(0)" data-num="1">1</a></td>
                                <td><a href="javascript:void(0)" data-num="2">2</a></td>
                                <td><a href="javascript:void(0)" data-num="3">3</a></td>
                            </tr>
                            <tr>
                                <td><a href="javascript:void(0)" data-num="4">4</a></td>
                                <td><a href="javascript:void(0)" data-num="5">5</a></td>
                                <td><a href="javascript:void(0)" data-num="6">6</a></td>
                            </tr>
                            <tr>
                                <td><a href="javascript:void(0)" data-num="7">7</a></td>
                                <td><a href="javascript:void(0)" data-num="8">8</a></td>
                                <td><a href="javascript:void(0)" data-num="9">9</a></td>
                            </tr>
                            <tr>
                                <td className="disabled"></td>
                                <td><a href="javascript:void(0)" data-num="0">0</a></td>
                                <td><a href="javascript:void(0)" className="backspace"></a></td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        )
    }
}

export default KeyBoard;