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
import InnerLoading from '../../Component/innerLoading/InnerLoading';
import bankList from '../../tool/bankList';

class CardList extends BaseComponent{
    constructor(){
        super();
        this.state = {
            show:false,
            load:1,
            cardInfo:null,
            tipsText:'',
            limit:null,
            //accountObj:JSON.parse(localStorage.getItem('LR_ACCOUNT'))
        }
    }

    /**
     * 获取卡信息
     */
    getBankCard(){
        T.ajax({
            url:'myBankCard'
        }).done((data)=>{
            if(data.length === 0){//如果是一个数组，表示没有绑卡
                this.setMyState({
                    load:0,
                    cardInfo:null,//表示没绑卡
                    tipsText:'只能使用一张卡进行投资及提现！',
                    limit:null
                });
            }else{
                this.getBankLimit(data);
            }
        });
    }

    /**
     * 获取限额信息
     * @param cardInfo
     */
    getBankLimit(cardInfo){
        T.ajax({
            url:'getBankQuota',
            data:{
                bankCode:cardInfo.bankCode
            }
        }).done((limitData)=>{
            this.setMyState({
                load:0,
                cardInfo:cardInfo,
                tipsText:'点击可修改绑定银行卡',
                limit:limitData
            });
        });
    }

    /**
     * 显示弹窗
     */
    showTips = ()=>{
        this.setMyState({
            show:true
        })
    };

    /**
     * 关闭弹窗
     */
    closeTips = ()=>{
        this.setMyState({
            show:false
        })
    };

    componentDidMount(){
        this.getBankCard();
        T.checkRealname(()=>{
            T.Alert('您还未实名认证,请先去实名认证',()=>{
                this.forward('/setting/realName');
            })
        });
    }

    /**
     * 控制银行卡点击
     */
    handleClick = (e)=>{
        //let accountObj = this.state.accountObj;
        //console.log(accountObj);
        //if(accountObj && accountObj.dueinCapital >= 0){//存在在途资金
        //    this.showTips();
        //}else{
        //    this.forward('/center/card/op/replace');
        //}
        this.forward('/account/card/op/replace');
        //
    };

    render(){
        let state = this.state;
        let panelState;
        if(state.load){
            panelState = <InnerLoading height={'3rem'}/>;
        }else{
            if(state.cardInfo){
                let colorMapper = {};
                bankList.map((item)=>{
                   colorMapper[item.bankCode] = item.bg;
                });

                panelState =
                    (
                        <div>
                            <section className="bindCardSec hasBind">
                                <a className="item"
                                   style={{backgroundColor: colorMapper[state.cardInfo.bankCode]}}
                                   onClick={this.handleClick}
                                    >
                                    <div className="leftIcon">
                                        <img src={require("../../res/images/bank/"+(state.cardInfo.bankCode || 'ic_bankcard')+".png")} alt=""/>
                                    </div>
                                    <div className="rightInfo">
                                        <p className="bankName">{state.cardInfo.bankName}</p>
                                        <p className="cardType">储蓄卡</p>
                                        <p className="cardNo">
                                            {state.cardInfo.cardNo}
                                        </p>
                                    </div>
                                </a>
                            </section>

                            <CardLimit text={state.tipsText} quota={state.limit}/>

                            <ChangeTips show={state.show} closeTips={this.closeTips.bind(this)}/>
                        </div>
                    )
            }else{
                panelState = (
                    <div>
                        <section className="bindCardSec">
                            <Link to="/account/card/op/add"  className="item notBind" >
                                <p className="tips">添加银行卡</p>
                            </Link>
                        </section>
                        <p className="_tips">
                            {state.tipsText}
                        </p>

                    </div>
                )
            }
        }
        return (
            <div className="_cardSec">
                <Title title={'我的银行卡'}/>
                {panelState}
            </div>
        )
    }
}

class ChangeTips extends BaseComponent{
    render(){
        return(
            <div id="tips" style={{display:this.props.show ? 'block' : 'none'}}>
                <div className="content scaleIn">
                    <header>
                        {/*<img src="/views/styles/images/bankcard_bg_img_tips@2x.png" alt=""/>*/}
                        <h2>温馨提示</h2>
                    </header>
                    <div className="innerWrap">
                        <p>为了您的资金安全，联动优势要求用户充值取现同卡进出，您的账户暂时存在在途资金，可以参考以下两个方法进行处理：</p>
                        <p>1、不存在待收资金，余额不为0的情况下，请将余额全部提出后再次操作更换银行卡；</p>
                        <p>2、联系客服提供相关材料进行换卡服务。</p>
                    </div>

                    <a href="javascript:void(0)" className="btn" onClick={this.props.closeTips}>确定</a>
                </div>
            </div>
        )
    }
}

class CardLimit extends BaseComponent{
    render(){
        let items = [];
        if(this.props.quota !== null){
            items.push(
                <section key="1" className="item_list">
                    <div className="item">
                        <p className="title">单笔限额</p>
                        <p className="description">{this.props.quota.single}</p>
                    </div>

                    <div className="item">
                        <p className="title">单日限额</p>
                        <p className="description">{this.props.quota.day}</p>
                    </div>
                </section>
            )
        }
        return(
            <div>
                <p className="_tips">
                    {this.props.text}
                </p>
                {items}
            </div>
        )
    }
}

export default CardList;