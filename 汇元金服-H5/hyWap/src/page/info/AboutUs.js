/**
 * Created by xhy on 17/7/31.
 */
import React from 'react';
import BaseComponent from '../../core/BaseComponent';
import Title from '../../Component/titleBar/TitleBar';
import '../../res/css/info/aboutUs.css';
import T from '../../tool/tool';

class AboutUs extends BaseComponent{
    render(){
        return (
            <div className="_aboutSec" style={{paddingTop:this.ifApp ? '0' :'1rem'}}>
                {
                    this.ifApp ?
                        <div></div>
                        :
                        <Title title="关于我们"/>
                }

                <div className="banner_info">
                    <img src={require("../../res/images/hy_banner.png")} alt=""/>
                </div>
                {/*banner*/}
                <div className="about">
                    <div className="sec_title"></div>
                    <div className="content">
                        <div className="item">
                            <div className="left_icon">
                                   <div className="text">公司景愿</div>
                            </div>
                            <div className="right_content">
                                汇元金服以成为国内值得信赖的互联网金融信息服务平台为使命，以打造一流的金融投资机构为目标，专注于资产项目投融资、资产配置管理、在线投融资咨询等各项服务。
                            </div>
                        </div>
                        <div className="item">
                            <div className="left_icon">
                                <div className="text">服务理念</div>
                            </div>
                            <div className="right_content">
                                我们以客户为核心，始终将客户的需求放在第一位，致力于为广大投资理财客户提供专业的信息对接及全程管家式服务。
                            </div>
                        </div>
                        <div className="item">
                            <div className="left_icon">
                                <div className="text">团队精神</div>
                            </div>
                            <div className="right_content">
                                因为热爱，所以坚持；因为共同的梦想和愿景，所以相聚。我们是拼搏奋进的金融人，我们是始终坚守的服务者。
                            </div>
                        </div>
                    </div>
                </div>
                {/*关于汇元*/}

                <div className="profile">
                    <div className="inner_wrap">
                        <div className="top_img">
                            <img src={require('../../res/images/hy_about_banner.jpg')} alt=""/>
                        </div>
                        <div className="sec_title"></div>
                        <div className="content">
                            <p>
                                汇元金服，全称杭州大汇元网络科技有限公 司，2009年4月10日成立，坐落于景色宜人的杭州。注册资金5000万人民币。由扶贫国资控股，拥有强大的国资背景，是多名国内金融投资、风险管理以及高新互联网技术领域的资深专家联合组建的专业金融信息服务平台。
                            </p>
                            <p>
                                致力于为广大投资者提供安全稳健收益高的公司拥有强大的国资背景，是由多名国内金融投资、风险管理以及高新互联网技术领域的资深专家联合组建的专业金融信息服务平台，致力于为广大投资者提供安全稳健收益高的理财产品。
                            </p>
                        </div>
                    </div>
                </div>
                {/*公司简介*/}

                <div className="product">
                    <div className="sec_title"></div>
                    <div className="img_wrap">
                        <img src={require('../../res/images/chanpin_tu.png')} alt="" width={'100%'}/>
                    </div>
                    <div className="product_list">
                        <div className="p_item">
                            <div className="p_title">
                                新手产品年化
                            </div>
                            <div className="p_detail">
                                <p>期限15天内：年化收益12%+6%（100元起）</p>
                            </div>
                        </div>
                        <div className="p_item">
                            <div className="p_title">
                                普通产品
                            </div>
                            <div className="p_detail">
                                <p>期限30天内：年化收益9%（500元起）</p>
                                <p>期限31-60天：年化收益10%（500元起）</p>
                                <p>期限61-90天：年化收益11%（500元起）</p>
                            </div>
                        </div>
                    </div>
                </div>
                {/*汇元产品*/}

                <div className="publish">
                    <div className="sec_title"></div>
                    <div className="photos">
                        <div className="style1">
                            <img src={require('../../res/images/zhizhao_1.png')} alt=""/>
                        </div>
                        <div className="style1">
                            <img src={require('../../res/images/hxccpic.png')} alt=""/>
                        </div>
                        <div className="style2 clearfix">
                            <img src={require('../../res/images/xukezheng.png')} alt=""/>
                        </div>
                    </div>
                </div>
                {/*汇元披露*/}

                <div className="notice">
                    <div className="sec_title"></div>
                    <div className="img_wrap">
                        <img src={require('../../res/images/gonggap_tu.png')} width="100%" alt=""/>
                    </div>
                    <div className="sub_title">
                        汇元金服 汇聚财富
                    </div>
                    <div className="content">
                        <p>更好更快的帮用户把钱包鼓起来！</p>
                        <p>实时查看汇元公告</p>
                        <p>了解最新资讯详情让您不再错过最新的高收益标！</p>
                    </div>
                </div>
                {/*汇元公告*/}

                <div className="photos">
                    <div className="sec_title"></div>
                    <div className="img_wrap">
                        <img src={require('../../res/images/photo1.png')} alt=""/>
                    </div>

                    <div className="img_wrap">
                        <div className="img_inner_wrap1">
                            <img src={require('../../res/images/photo2.png')} alt=""/>
                        </div>
                        <div className="img_inner_wrap2">
                            <img src={require('../../res/images/photo3.png')} alt=""/>
                        </div>
                        <div className="img_inner_wrap3">
                            <img src={require('../../res/images/photo4.png')} alt=""/>
                        </div>
                    </div>

                    <div className="img_wrap">
                        <img src={require('../../res/images/photo5.png')} alt=""/>
                    </div>
                </div>
                {/*汇元相册*/}

                <div className="team">
                    <div className="sec_title"></div>
                    <div className="constructor">
                        <img src={require('../../res/images/zuzhijiagou.png')} alt=""/>
                    </div>
                </div>
                {/*汇元团队*/}

                <div className="partner">
                    <div className="sec_title"></div>
                    <div className="sub_item">
                        <div className="sub_title">
                            <img src={require('../../res/images/fuyouzhifu.png')} alt=""/>
                        </div>
                        <div className="content">
                            <span className="bold">富友集团:</span>
                            2010年富友金融获得中国银联“收单外包机构注册认证“，在全国范围建立银行卡收单服务网络。 2011年获得中国人民银行颁发的银行卡收单和互联网支付牌照，同时获得人民银行颁发的预付卡发行与受理牌照。2014年成为“上海市网络信贷服务业企业联盟”成员单位，是目前国家已颁布牌照的270家第三方支付公司中仅4家公司之一。
                        </div>
                    </div>

                    <div className="sub_item">
                        <div className="sub_title">
                            <img src={require('../../res/images/lvshi.png')} alt=""/>
                        </div>
                        <div className="content">
                            <p><span className="bold">法律事务所：</span>盈科律师事务所，总部北京。律所业务范围广泛，覆盖国际贸易、海外投资、公司、资本证券、两岸事务、私募、投融资与并购、知识产权、房地产、环境保护、海商海事等多个专业领域。成立16年来，累计为100000多家海内外企业提供高度满意的法律服务。</p>
                            <p>在中国大陆拥有40家办公室，36家海外办公室。国内外法学理论及实务领域享有盛誉的法学专家担任其专家顾问团队，为其提供专业权威的科学指导。</p>
                        </div>
                    </div>

                    <div className="sub_item">
                        <div className="sub_title">
                            <img src={require('../../res/images/hxcclogo.png')} alt="" />
                        </div>
                        <div className="content">
                            <p><span className="bold">债权回购方：</span>华夏璀璨（厦门）担保有限公司：在中国(福建)自由贸易试验区注册成立，注册资金5000万元人民币，从事法律法规允许的担保业务（不含融资性担
                                保）。为机构提供金融担保服务，承诺对提供担保的机构24小时内回购债权，让投资人本息有保障。</p>
                        </div>
                    </div>
                </div>
                {/*合作伙伴*/}

                <div className="security">
                    <div className="sec_title"></div>
                    <div className="item_list">
                        <div className="sub_item">
                            <div className="img_wrap">
                                <img src={require('../../res/images/gzbj.png')} alt=""/>
                                <p>国资背景 实力强大</p>
                            </div>
                            <div className="content">
                                汇元金服隶属于扶贫系国资控股，拥有政府、央企、上市公司、银行等众多优质资源，将风险控制最低，为汇元金服的资产保驾护航，为投资人的资金提供安全保障。
                            </div>
                        </div>

                        <div className="sub_item">
                            <div className="img_wrap">
                                <img src={require('../../res/images/sljg.png')} alt=""/>
                                <p>实力机构 回购债权</p>
                            </div>
                            <div className="content">
                                汇元金服以汽车等资产质押为主，所有质押产品经平台评估，价值合理稳定；并由华夏璀璨（厦门）担保有限公司保驾护航，承诺对汇元金服产品24小时内回购债权，让投资人本息有保障。
                            </div>
                        </div>

                        <div className="sub_item">
                            <div className="img_wrap">
                                <img src={require('../../res/images/zjzh.png')} alt=""/>
                                <p>资金账户 专款享用</p>
                            </div>
                            <div className="content">
                                与第三方支付公司--富友支付合作，实现资金专款专用，杜绝资金池。多重身份认证，资金安全有保障。
                            </div>
                        </div>

                        <div className="sub_item">
                            <div className="img_wrap">
                                <img src={require('../../res/images/djls.png')} alt=""/>
                                <p>顶级律师 实力护航</p>
                            </div>
                            <div className="content">
                                与权威律师事务所--盈科律师事务所合作，为投资者保驾护航。
                            </div>
                        </div>
                    </div>
                </div>
                {/*安全保障*/}
            </div>
        )
    }
}

export default  AboutUs;