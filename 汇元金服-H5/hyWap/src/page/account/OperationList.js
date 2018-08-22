/**
 * Created by xhy on 17/7/13.
 */
/**
 *  充值提现记录
 */
import React from 'react';
import BaseComponent from '../../core/BaseComponent';
import '../../res/css/account/invest.css';
import {Link} from 'react-router';

import TitleBar from '../../Component/titleBar/TitleBar';
import {LoadGrid} from '../../Component/loadGrid/LoadGrid';

import T from '../../tool/tool';

class OperationList extends BaseComponent{
    constructor(props){
        super(props);
        this.state = {
            status:99,
            type:props.params.type === 'cash' ? 1 : 0
        }
    }

    filterData = [
        {
            key: 'status',
            text: '状态',
            value: [
                {val: 99, text: '全部'},
                {val: 1, text: '成功'},
                {val: 0, text: '处理中'},
                {val: 9, text: '失败'}
            ]
        },
        {
            key: 'type',
            text: '类型',
            value: [
                {val: 0, text: '充值'},
                {val: 1, text: '提现'}
            ]
        }
    ];

    render(){
        console.log(this.state);
        return (
            <div className="_operationSec" style={{paddingTop:'1.0rem'}}>
                <TitleBar title="充值提现记录"/>

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

                <div className="record_list">
                    <LoadGrid
                        top={'2.6rem'}
                        bottom={'0rem'}
                        url={'getRechargeCashList'}
                        args={{
                            type:this.state.type,
                            status:this.state.status
                        }}
                        itemComponent={Record}
                    />
                </div>


            </div>
        )
    }
}

class Record extends BaseComponent{
    render(){
        let {item} = this.props;
        let statusStr = '';
        switch(item.state*1){
            case 0:statusStr = '处理中';break;
            case 1:statusStr = '成功';break;
            case 2:statusStr = '审核中';break;
            case 4:statusStr = '申请中';break;
            case 9:statusStr = '失败';break;

        }
        return(
            <div className={item.state*1 === 1 ? 'record success' : 'record going'}>
                <p>
                    <span className="f_left type">{item.title}</span>
                    <span className="f_right value">{item.amount}</span>
                </p>
                <p>
                    <span className="f_left date">{item.addTime}</span>
				<span className="f_right status">
                    {statusStr}
				</span>
                </p>
            </div>
        )
    }
}

export default OperationList;