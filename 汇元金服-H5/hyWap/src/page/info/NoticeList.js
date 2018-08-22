/**
 * Created by xhy on 17/7/15.
 */
/**
 * Created by xhy-pc on 2016/12/29.
 */
import React from 'react';
import BaseComponent from '../../core/BaseComponent';
import Nav from '../../Component/navigator/Navigator';
import '../../res/css/info/info.css';
import Title from '../../Component/titleBar/TitleBar';
import {LoadGrid} from '../../Component/loadGrid/LoadGrid';
import {Link} from 'react-router';

class NoticeList extends BaseComponent{
    render(){
        return(
            <div className="_noticeSec">
                <Title title="公告"/>
                <LoadGrid
                    top={'1.2rem'}
                    bottom={'1.1rem'}
                    url={'getArticleList'}
                    args={{}}
                    itemComponent={NoticeItem}
                    />
                <Nav index="2"/>
            </div>
        )
    }
}

class NoticeItem extends BaseComponent{

    render(){
        let item = this.props.item;
        return(
            <Link to={"/info/notice/detail/"+item.id} className="n_item">
                <p className="title">{item.title}</p>
                <p className="date">{item.addTime}</p>
            </Link>
        )
    }
}

export  default NoticeList;