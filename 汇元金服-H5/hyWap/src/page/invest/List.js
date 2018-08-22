/**
 * Created by xhy on 17/7/13.
 * 投资列表
 */
/**
 * 项目详情
 */
import React from 'react';
import BaseComponent from "../../core/BaseComponent";
import '../../res/css/invest/invest.css';

import Nav from '../../Component/navigator/Navigator';
import Project from '../../Component/project/Project';
import {LoadGrid} from '../../Component/loadGrid/LoadGrid';


class InvestList extends BaseComponent{
    constructor(){
        super();
        this.state = {
            filter:[
                {id:0,text:'全部'},
                {id:1,text:'新手'},
                {id:2,text:'普通'},
                {id:3,text:'体验标'}
            ],
            type:0
        }
    }
    render(){

        return(
            <div className="_investListSec">
                <div className="filter_title">
                    <div className="btn_group">
                        {
                            this.state.filter.map(({id,text},i)=>{
                                return (
                                    <span key={i} className={id == this.state.type ? 'active' : ''} onClick={()=>{
                                        this.setMyState({type:id})
                                    }}>
                                        {text}</span>
                                )
                            })
                        }
                    </div>
                </div>
                <div className="project_wrap">
                    <LoadGrid
                        top={'1rem'}
                        bottom={'1.1rem'}
                        url={'getProjectList'}
                        args={this.state}
                        itemComponent={Project}
                        />
                </div>

                <Nav index="1"/>
            </div>
        )
    }
}

export default  InvestList;