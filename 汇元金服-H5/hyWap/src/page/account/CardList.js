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
            list:null,
            select:null
        }
    }
    /**
     * 获取卡列表
     */
    getCardList = ()=>{
      T.ajax({
          url:'myBankCard'
      }).done((data)=>{
          this.setMyState({
              list:data
          })
      });
    };

    /**
     * 移除银行卡
     * @param id
     */
    deleteCard(id){
        if(this.state.list.length <= 1){
            T.showToast('你的账户中至少保留一张银行卡');
            return;
        }

        T.ajax({
            url:'removeCard',
            method:'post',
            load:true,
            data:{
                id
            }
        }).done(()=>{
            let list = this.state.list.filter((item)=>{
                return item.id !== id;
            });

            this.setMyState({
                list
            })
        });
    }

    componentDidMount(){
        this.getCardList();
    }



    render(){
        let {list} = this.state;
        if(!list){
            return (
                <div className="_cardSec">
                    <Title title={'我的银行卡'} backCallback={()=>{T.forward('/account/cash')}}/>
                    <div className="list">
                        <InnerLoading height={'3rem'}/>
                    </div>

                </div>
            )
        }

        return(
            <div className="_cardSec">
                <Title title={'我的银行卡'}/>
                <div className="list">
                    {   
                        list.map((bankInfo,i)=>{
                            return (
                                <SlideItem key={i} length={list.length} bankInfo={bankInfo} deleteCard={this.deleteCard.bind(this)}/>
                            )
                        })
                    }
                </div>
                {/*<Link className="add_card" to="/account/card/op/add">
                    +
                </Link>*/}
            </div>
        )
    }
}

class SlideItem extends BaseComponent{
    constructor(props){
        super(props);
        this.state = {
            offset:0,
            bankInfo:props.bankInfo,
            length:props.length
        }
    }

    componentWillReceiveProps(props){
        this.setMyState({
            bankInfo:props.bankInfo,
            length:props.length
        })
    }

    o_left;

    /**
     * 锁住屏幕
     * @returns {boolean}
     */
    lockWindow(e){
        e.preventDefault();
    }


    /**
     * touchStart
     */
    handleTouchStart = (e)=>{
        this.o_left = e.touches[0].clientX;
        document.body.addEventListener('touchmove',this.lockWindow);
    };

    /**
     * touchMove
     */
    handleTouchMove = (e)=>{
        let cLeft = e.targetTouches[0].clientX;
        let offset = cLeft - this.o_left;
        let cOffset = this.state.offset+offset;
        if(cOffset > 0){
            cOffset = 0;
        }else if(cOffset < -100){
            cOffset = -100
        }

        this.setMyState({
            offset:cOffset
        });

        this.o_left = cLeft;
    };

    /**
     * touchEnd
     */
    handleTouchEnd = (e)=>{
        let eLeft = e.changedTouches[0].clientX;
        document.body.removeEventListener('touchmove',this.lockWindow);
        let offset = eLeft - this.o_left;
        let cOffset = this.state.offset+offset;
        if(cOffset < -50){
            T.animate({
                pri: cOffset,
                end: -100,
                duration: 100,
                timeFunc: 'Bounce.easeInOut',
                callback: (offset)=>{
                    this.setMyState({
                        offset
                    })
                }
            })
        }else {
            T.animate({
                pri: cOffset,
                end: 0,
                duration: 100,
                timeFunc: 'Bounce.easeInOut',
                callback: (offset)=>{
                    this.setMyState({
                        offset
                    })
                }
            })
        }

    };

    render(){
        let {bankInfo,length} = this.state;
        return (
            <div className="slide_item">
                {
                    length <= 1 ?
                        <div className="card_info"
                             onClick={()=>{
                                T.forward(`/account/cash?id=${bankInfo.id}&bankName=${bankInfo.bankName}&cardNo=${bankInfo.cardNo.slice(-4)}&bankCode=${bankInfo.bankCode}`)
                                }
                             }
                            >
                            <div className="card_icon">
                                <img src={require('../../res/images/bank/'+bankInfo.bankCode.substr(0,6)+'.png')} alt={bankInfo.bankName} width="100%"/>
                            </div>
                            <p className="card_name">{bankInfo.bankName}</p>
                            <p className="card_no">尾号{bankInfo.cardNo.slice(-4)}</p>
                        </div>
                        :
                        <div className="card_info"
                             style={{transform:'translateX('+this.state.offset+'px)'}}
                             onClick={()=>{
                                    T.forward(`/account/cash?id=${bankInfo.id}&bankName=${bankInfo.bankName}&cardNo=${bankInfo.cardNo.slice(-4)}&bankCode=${bankInfo.bankCode}`)
                                }
                             }
                             onTouchStart={
                                this.handleTouchStart
                             }

                             onTouchMove={
                                this.handleTouchMove
                             }

                             onTouchEnd={
                                this.handleTouchEnd
                             }
                            >
                            <div className="card_icon">
                                <img src={require('../../res/images/bank/'+bankInfo.bankCode+'.png')} alt={bankInfo.bankName} width="100%"/>
                            </div>
                            <p className="card_name">{bankInfo.bankName}</p>
                            <p className="card_no">尾号{bankInfo.cardNo.slice(-4)}</p>
                        </div>
                }
                <a className="delete_btn" onClick={()=>{
                    this.props.deleteCard(bankInfo.id);
                    this.setMyState({offset:0})
                }}>删除</a>
            </div>
        )
    }
}

export default CardList;