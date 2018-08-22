/**
 * Created by xhy on 17/7/15.
 */
/**
 * 消息列表
 */
import React from 'react';
import BaseComponent from '../../core/BaseComponent';
import '../../res/css/info/info.css';
import Title from '../../Component/titleBar/TitleBar';
import {LoadGrid} from '../../Component/loadGrid/LoadGrid';
import {Link} from 'react-router';
import T from '../../tool/tool';

class MsgList extends BaseComponent{
    render(){
        return(
            <div className="_noticeSec">
                <Title title="我的消息"/>
                <LoadGrid
                    top={'1.2rem'}
                    bottom={'0rem'}
                    url={'getMessageList'}
                    args={{}}
                    itemComponent={MsgItem}
                    />
            </div>
        )
    }
}

class MsgItem extends BaseComponent{
    constructor(props){
        super(props);
        this.state = {
            read:this.props.item.state*1,
            open:false
        }
    }

    handleClick = (e)=>{
        let open = !this.state.open;
        this.setMyState({
            open:open
        });
        if(this.state.read*1 === 1){return;}
        T.ajax({
            url:'messageUpdateAjax',
            data:{
                id:this.props.item.id,
                state:1
            },
            method:'post'
        }).done(()=>{

            this.setMyState({
                read:1,
                open:open
            })
        })
    };

    render(){
        let msgItem = this.props.item;
        let clazzName = 'n_item';
        if(this.state.read !== 0){
            clazzName += ' hasRead';
        }

        if(this.state.open === true){
            clazzName += ' actived';
        }
        return(
            <div>
                <div className={clazzName} onClick={this.handleClick.bind(this)}>
                    <p className="title">{msgItem.messageTitle}</p>
                    <p className="date">{msgItem.addTime}</p>
                </div>
                <div className="slidePanel" style={{display:(this.state.open ? 'block':'none')}} >
                    <p dangerouslySetInnerHTML={{__html:msgItem.messageContext}}>
                    </p>
                </div>
            </div>
        )
    }
}

export  default MsgList;