/**
 * Created by xhy on 17/7/13.
 */
/**
 *  券包
 */
import React from 'react';
import BaseComponent from '../../core/BaseComponent';
import '../../res/css/account/welfare.css';

import TitleBar from '../../Component/titleBar/TitleBar';
import {LoadGrid} from '../../Component/loadGrid/LoadGrid';

class Welfare extends BaseComponent{
    constructor(){
        super();
        this.state = {
            filter:[
                {id:0,text:'红包券'},
                {id:1,text:'加息券'},
                {id:2,text:'体验券'},
            ],
            type:0
        }
    }
    render(){
        return (
            <div className="_welfareSec">
                <TitleBar title="我的券包"/>
                <div className="filter_top">
                    <div className="btn_group">
                        {
                            this.state.filter.map((item, i)=> {
                                return (
                                    <span
                                        key={i}
                                        className={item.id == this.state.type ? 'active' : ''}
                                        onClick={()=>{
                                          this.setMyState({
                                            type:i
                                          })
                                        }}
                                    >
                                        {item.text}
                                    </span>
                                )
                            })
                        }
                    </div>
                </div>

                <div className="welfare_list">
                    <LoadGrid
                        top={'2rem'}
                        bottom={'0rem'}
                        url={'getWelfareList'}
                        args={{type:this.state.type}}
                        itemComponent={WelfareItem}
                    />
                </div>

            </div>
        )
    }
}

class WelfareItem extends BaseComponent{
    render(){
        let couponItem = this.props.item;

        let clazz = 'welfare_item';

        if(couponItem.state*1 === 1){
            clazz += ' used';
        }else if(couponItem.state*1 === 3){
            clazz += ' out_date';
        }else{
            clazz += ' normal';
        }

        return (
            <div className={clazz}>
                <div className="info">
                    <p className="title">{couponItem.name}</p>
                    <p className="remark">
                        {/*{
                            couponItem.type*1 !== 1 && couponItem.projectDays*1 > 1 ?
                                <span key="2">投资项目天数{couponItem.projectDays}天起</span>
                                :
                                couponItem.remark
                        }*/}
                        {
                            couponItem.type*1 !== 2 ?
                                <span key="2">投资项目天数{couponItem.projectDays}天起</span>
                                :
                                couponItem.remark
                        }
                    </p>
                    <p className="date">
                        有效期至: <span className="main_color">{couponItem.expiredTime}</span>
                    </p>
                </div>

                <div className="value" style={{paddingTop:couponItem.type*1 !== 1 ? '0.5rem' : '0.7rem'}}>
                    <div className="title main_color" >{couponItem.amount}<span>{couponItem.type*1 === 1 ? '%' : '元'}</span></div>
                    {
                        couponItem.type*1 !== 1?
                            <div className="condition">
                                满{couponItem.minInvest}元可使用
                            </div>
                            :
                            ''

                    }

                </div>
            </div>
        )
    }
}

export default Welfare;