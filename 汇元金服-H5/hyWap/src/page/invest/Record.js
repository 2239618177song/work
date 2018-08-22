/**
 * Created by xhy on 17/7/13.
 * 投资列表
 */
/**
 * 项目投资记录
 */
import React from 'react';
import BaseComponent from "../../core/BaseComponent";
import '../../res/css/invest/invest.css';

import Title from '../../Component/titleBar/TitleBar';
import {LoadGrid} from '../../Component/loadGrid/LoadGrid';

class InvestRecord extends BaseComponent{
    render(){
        return(
            <div className="_investRecordSec">
                <Title title="投资记录"/>
                <header className="record_title clearfix">
                    <div className="f_left">申购人/时间</div>
                    <div className="f_right">金额(元)</div>
                </header>

                <section className="record_list">
                    <LoadGrid
                        top={'1.8rem'}
                        bottom={'0rem'}
                        url={'getinvestRecords'}
                        itemComponent={Item}
                        args={{projectId:this.props.params.id}}
                        />

                </section>
            </div>
        )
    }
}

class Item extends BaseComponent{
    render(){
        console.log(this.props)
        let {item} = this.props;
        return (
            <div className="item">
                <div className="value">
                    {item.amount}
                </div>
                <div className="itemInfo">
                    <p className="name">{item.mobile}</p>
                    <p className="date">{item.addTime}</p>
                </div>
            </div>
        )
    }
}

export default  InvestRecord;