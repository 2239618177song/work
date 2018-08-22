/**
 * Created by xhy on 17/7/13.
 */
/**
 *  回款记录
 */
import React from 'react';
import BaseComponent from '../../core/BaseComponent';
import '../../res/css/account/invest.css';
import {Link} from 'react-router';

import TitleBar from '../../Component/titleBar/TitleBar';
import {LoadGrid} from '../../Component/loadGrid/LoadGrid';

import T from '../../tool/tool';

class RepayList extends BaseComponent{
    constructor(){
        super();
        this.state = {
            past:'',
            status:99
        }
    }

    filterData = [
        {
            key: 'past',
            text: '日期范围',
            value: [
                {val: '', text: '全部'},
                {val: 7, text: '最近7天'},
                {val: 30, text: '最近1个月'},
                {val: 90, text: '最近3个月'}
            ]
        },
        {
            key: 'status',
            text: '回款状态',
            value: [
                {val: 99, text: '全部'},
                {val: 0, text: '待回款'},
                {val: 1, text: '已回款'}
            ]
        }
    ];

    render(){
        console.log(this.state);
        return (
            <div className="_investSec" style={{paddingTop:'1.0rem'}}>
                <TitleBar title="回款记录"/>

                <aside className="lrToolBar">
                    <ul className="argsType">
                        {
                            this.filterData.map((item,i)=>{
                              return (
                                  <li key={i}>
                                      <span className="title">{item.text}</span>
                                      {
                                          item.value.map((v,j)=>{
                                              return (
                                                  <a
                                                      key={j}
                                                      href="javascript:void(0)"
                                                      className={v.val == this.state[item.key] ? "active" : ""}
                                                      onClick={()=>{
                                                        let state = this.state;
                                                        state[item.key] = v.val;
                                                        this.setMyState(state);
                                                      }}
                                                  >
                                                      {v.text}
                                                  </a>
                                              )
                                          })
                                      }
                                  </li>
                              )
                            })
                        }
                    </ul>
                </aside>

                <LoadGrid
                    top={'2.6rem'}
                    bottom={'0rem'}
                    url={'getProjectCollectList'}
                    args={{
                        past:this.state.past,
                        status:this.state.status
                    }}
                    itemComponent={InvestItem}
                />

            </div>
        )
    }
}

class InvestItem extends BaseComponent{
    render(){
        let {item} = this.props;
        return (
            <Link to={'/invest/detail/'+item.projectId} className={item.state*1 === 1 ? 'invest_item state2' : 'invest_item state1'}>
                <h4 className="title">{item.name}</h4>
                <div className="content clearfix">
                    <div className="state">
                        {item.state*1 === 1 ? '已回款' : '待回款'}
                    </div>
                    <div className="itemInfo">
                        <table>
                            <thead>
                            <tr>
                                <th>回款收益</th>
                                <th>回款本金</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr>
                                <td className="main_red">{item.collectInterest} {item.addInterest*1 > 0 ? [<span className="font_middle" key="1">{'+'+item.addInterest}</span>] : ''}</td>
                                <td>{item.collectPrincipal}</td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                <aside className="date">
                    回款日期：{item.collectTime}
                </aside>
            </Link>
        )
    }
}

export default RepayList;