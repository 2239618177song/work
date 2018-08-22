/**
 * Created by xhy on 17/7/13.
 * 投资列表
 */
/**
 * 项目信息
 */
import React from 'react';
import LRBaseComponent from "../../core/BaseComponent";
import T from '../../tool/tool';
import '../../res/css/invest/invest.css';
import Gallery from '../../Component/gallery/Gallery';
import Navigator from '../../Component/titleBar/TitleBar';


class InvestInfo extends LRBaseComponent{

    constructor(){
        super();
        this.state = {
            content : '',
            show:false,
            index:1,
            imgs : [],
            isNew : null
        }
    }

    getUserInfo(callback){
        T.ajax({
            url:'getUserInfo'
        }).done((data)=>{
            callback && callback(data);
        });
    }

    /**
     * 获取文章信息
     */
    getDetailInfo(callback){
        T.ajax({
            url:'getProjectById',
            load:true,
            data:{
                id:this.props.params.id
            }
        }).done((data)=>{
            //判断是否是新手标，并且判断是不是新手用户
            T.ajax({
                url:'getUserInfo'
            }).done((userInfo)=>{
                if(data.isNovice*1 === 1 && userInfo.isNew*1){
                    T.Alert('仅限新手用户查看~',()=>{
                        this.forward('/invest/detail/'+ this.props.params.id);
                    });
                    return;
                }

                if(data.state * 1 !== 22){//如果是在投资中
                    callback(true);
                }else{
                    callback(false);
                }


                //符合查看条件才查看
                this.setMyState({
                    content:data.content
                });
            });

        });
    }

    /**
     * 获取图片信息
     */
    getImgList(state){
        if(!state){
            this.setMyState({
                imgs:null
            });
            return;
        }

        T.ajax({
            url:'getAtt',
            data:{
                // pid:this.getId()
                pid:this.props.params.id
            }
        }).done((data)=>{
            let arr = [];
            data.map((v)=>{
                arr.push(v.imgUrl);
            });
            this.setMyState({
                imgs:arr
            })
        });
    }

    componentDidMount(){
        this.getDetailInfo((state)=>{
            this.getUserInfo((data)=>{
                this.setMyState({
                    isNew:!data.isNew
                });
            });
            this.getImgList(state);
        });

    }

    showPic = (index)=>{
        this.setState({
            index:(index+1),
            show:true
        });
    };

    render(){
        return(
            <div className="_proDetailInfoSec">
                <Navigator title="项目详情" />
                <Article {...this.state}/>
                <Material {...this.state} showPic={this.showPic.bind(this)}/>
                <Gallery {...this.state} handleClose={()=>{
                    this.setState({
                    show:false
                    })
                }}/>
            </div>
        )
    }
}

class Article extends LRBaseComponent{

    render(){
        return(
            <section className="sectionInfo">
                <div className="title">
                    项目详情
                </div>
                <div className="content"
                     id="_content"
                     style={{textAlign:'left'}}
                     dangerouslySetInnerHTML={{__html:this.props.content}}>
                </div>
            </section>
        )
    }
}


class Material extends LRBaseComponent{

    constructor(){
        super();
        this.state = {
            index:1
        }
    }

    /**
     * 获取图片信息
     * @returns {Array}
     */
    getImgList(){
        let listTpl = [];
        if(this.props.imgs === null){
            listTpl.push(
                <div key="1">
                    <img src={require("../../res/images/icon_end_of_time.png")} alt=""/>
                </div>
            )
        }else{
            this.props.imgs.map((item,i)=>{
                listTpl.push(
                    <img key={i} src={item}
                         alt="项目资料附件"
                         onClick={(e)=>{
                            this.props.showPic(i);
                         }}/>
                )
            });
        }

        return listTpl;

    }


    render(){
        return(
            <section className="sectionInfo">
                <div className="title">
                    相关资料
                </div>
                <div className="content gallery" id="_gallery">
                    {this.getImgList()}
                </div>

            </section>
        )
    }
}

export default InvestInfo;