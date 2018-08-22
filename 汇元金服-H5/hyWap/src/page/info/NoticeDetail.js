/**
 * Created by xhy on 17/7/15.
 */
/**
 * Created by xhy-pc on 2016/12/29.
 */
import React from 'react';
import BaseComponent from '../../core/BaseComponent';
import Nav from '../../Component/navigator/Navigator';
import '../../res/css/activity/activity.css';
import Title from '../../Component/titleBar/TitleBar';
import {LoadGrid} from '../../Component/loadGrid/LoadGrid';
import {Link} from 'react-router';
import T from '../../tool/tool';

class ArticleDetail extends BaseComponent{
    constructor(){
        super();
        this.state = {
            article:{}
        }
    }

    getArticleDetail(){
        T.ajax({
            url:'getArticleDetail',
            load:true,
            data:{
                id:this.props.params.id
            }
        }).done((data)=>{
            this.setState({
                article:data
            })
        });
    }
    componentDidMount(){
        document.body.style.backgroundColor = '#fff';
        this.getArticleDetail();
    }

    componentWillUnmount(){
        document.body.style.backgroundColor = '#f8f8f8';
    }

    render(){
        let article = this.state.article;
        return(
            <div className="_articleDetailSec">
                <Title title={article.title || ''}/>
                <section className="activityList">
                    <header>
                        <div className="title">{article.title}</div>
                        <aside className="date">{article.addTime}</aside>
                    </header>
                </section>
                <article dangerouslySetInnerHTML={{__html:article.content}}>

                </article>
            </div>
        )
    }
}

export  default ArticleDetail;