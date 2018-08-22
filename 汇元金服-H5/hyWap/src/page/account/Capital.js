/**
 * Created by xhy on 17/7/13.
 */
/**
 *  资金记录
 */
import React from 'react';
import BaseComponent from '../../core/BaseComponent';
import '../../res/css/account/capital.css';

import TitleBar from '../../Component/titleBar/TitleBar';
import {LoadGrid} from '../../Component/loadGrid/LoadGrid';

class Capital extends BaseComponent{

    render(){
        return (
            <div className="_capitalSec">
                <TitleBar title="资金记录"/>

                <div className="capital_list">s
                    <LoadGrid
                        top={'1.3rem'}
                        bottom={'0rem'}
                        url={'getAccountLogList'}
                        args={{}}
                        itemComponent={CapitalItem}
                    />
                </div>

            </div>
        )
    }
}

class CapitalItem extends BaseComponent{

    render(){
        let {item} = this.props;
        return (
            <div className="item_wrap">
                <div className={`capital_item ${item.plus_minus*1 === 1 ? 'in' : 'out'}`}>
                    <div className="title"><span className="dotted"></span>{item.type}</div>
                    <div className="num">{item.plus_minus*1 === 1 ? '+' : '-'}￥{item.amount}</div>
                    <div className="date"><span className="icon-clock"></span> {item.addTime}</div>
                </div>
            </div>
        )
    }
}

export default Capital;