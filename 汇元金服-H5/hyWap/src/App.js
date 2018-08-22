import React,{Component} from 'react';
import { Router, Route, browserHistory } from 'react-router';

//首页
import Index from './page/index/Index';

//活动
import Activity from './page/activity/Activity';

//投资相关
import InvestBase from './page/invest/InvestBase';
import InvestList from './page/invest/List';
import InvestDetail from './page/invest/Detail';
import InvestExpDetail from './page/invest/ExpDetail';
import InvestInfo from './page/invest/Info';
import InvestRecord from './page/invest/Record';
import InvestPay from './page/invest/Pay';
import InvestCalculator from './page/invest/Calculator';

//社区
import InfoBase from './page/info/InfoBase';
import InfoIndex from './page/info/Index';
import InfoNoticeList from './page/info/NoticeList';
import InfoNoticeDetail from './page/info/NoticeDetail';
import InfoAboutUs from './page/info/AboutUs';

//账户中心
import AccountBase from './page/account/AccountBase';
import AccountIndex from './page/account/Index';
import AccountCash from './page/account/Cash';
import AccountRecharge from './page/account/Recharge';
import AccountChargeList from './page/account/OperationList';
import AccountAsset from './page/account/Asset';

//银行卡
import AccountCardList from './page/account/CardList';
import AccountAddCard from './page/account/AddCard';

//券包
import AccountWelfare from './page/account/Welfare';

//资金记录
import AccountCapital from './page/account/Capital';

//投资记录
import AccountInvest from './page/account/Invest';
import AccountInvestList from './page/account/InvestList';

//消息
import AccountMsg from './page/account/MsgList';

//回款日历
import AccountCalendar from './page/account/Calendar';
import AccountRepayList from './page/account/RepayList';

//帮助中心
import HelperIndex from './page/help/Index';
import HelperType from './page/help/Type';

//账户设置
import SettingBase from './page/account/setting/SettingBase';
import SettingIndex from './page/account/setting/Index';
import SettingRealName from './page/account/setting/RealName';
import SettingBindMobile from './page/account/setting/BindMobile';
import SettingAddress from './page/account/setting/Address';
import SettingPassword from './page/account/setting/ResetPwd';
import SettingPayPassword from './page/account/setting/SetPayPwd';
import SettingRestPayPassword from './page/account/setting/ResetPayPwd';
import FindPayPassword from './page/account/setting/FindPayPassword';
//授权投资
import QuickIndex from './page/account/quick/Index';
import QuickSet from './page/account/quick/SetQuick';
import QuickReset from './page/account/quick/ResetQuick';
import QuickFind from './page/account/quick/FindQuick';

//登录注册相关
import UserBase from './page/user/UserBase';
import Login from './page/user/Login';
import Register from './page/user/Register';
import FindPwd from './page/user/FindPwd';

//demo
import Demo from './demo';


class App extends Component {
    
  render() {
    return (
        <Router history={browserHistory}>
            <Route path="/" component={Index}/>
            <Route path="/activity" component={Activity}/>
            <Route path="/invest" component={InvestBase}>
                <Route path="list" component={InvestList}/>
                <Route path="detail/:id" component={InvestDetail}/>
                <Route path="experienceDetail/:id" component={InvestExpDetail}/>
                <Route path="record/:id" component={InvestRecord}/>
                <Route path="info/:id" component={InvestInfo}/>
                <Route path="pay/:id" component={InvestPay}/>
                <Route path="calculator" component={InvestCalculator}/>
            </Route>

            <Route path="/info" component={InfoBase}>
                <Route path="index" component={InfoIndex}/>
                <Route path="notice/list" component={InfoNoticeList}/>
                <Route path="notice/detail/:id" component={InfoNoticeDetail}/>
                <Route path="aboutUs" component={InfoAboutUs}/>
            </Route>

            <Route path="/account" component={AccountBase}>
                <Route path="index" component={AccountIndex}/>
                <Route path="recharge" component={AccountRecharge}/>
                <Route path="cash" component={AccountCash}/>
                <Route path="charge/list/:type" component={AccountChargeList}/>
                <Route path="asset" component={AccountAsset}/>

                <Route path="msg" component={AccountMsg}/>

                <Route path="card/list" component={AccountCardList}/>
                <Route path="card/op/:type" component={AccountAddCard}/>

                <Route path="welfare" component={AccountWelfare}/>
                <Route path="capital" component={AccountCapital}/>
                <Route path="invest" component={AccountInvest}/>
                <Route path="invest/list" component={AccountInvestList}/>
                <Route path="calendar" component={AccountCalendar}/>
                <Route path="repay/list" component={AccountRepayList}/>

            </Route>

			<Route path="/setting" component={SettingBase}>
                <Route path="index" component={SettingIndex}/>
                <Route path="realName" component={SettingRealName}/>
                <Route path="bindMobile" component={SettingBindMobile}/>
                <Route path="auth/index" component={QuickIndex}/>
                <Route path="auth/set" component={QuickSet}/>
                <Route path="auth/reset" component={QuickReset}/>
                <Route path="auth/find" component={QuickFind}/>
                <Route path="address" component={SettingAddress}/>
                <Route path="help/index" component={HelperIndex}/>
                <Route path="help/type/:id" component={HelperType}/>
                <Route path="resetPwd" component={SettingPassword}/>
                <Route path="payPwd/set" component={SettingPayPassword}/>
                <Route path="payPwd/reset" component={SettingRestPayPassword}/>
                <Route path="auth/findpwd" component={FindPayPassword}/>
            </Route>


            <Route path="/user" component={UserBase}>
                <Route path="login" component={Login}/>
                <Route path="register" component={Register}/>
                <Route path="findPwd" component={FindPwd}/>
            </Route>

            <Route path="/demo" component={Demo}></Route>
        </Router>
    );
  }
}

export default App;
