import LRBaseComponent from "../../core/BaseComponent";
import T from '../../tool/tool';
import config from '../../tool/config';
/*
* Copyright 杭州异人异想网络科技有限公司  异人异想手机网贷理财wap版软件 All Rights Reserved
* @version 1.0  
*/
class LRForm extends LRBaseComponent{
    constructor(){
        super();
        this.state = {
            form:{}
        }
    }

    timer = null;
    TOKEN = ((Math.random()+'').slice(2)*1).toString(36).toUpperCase();

    /**
     * 控制输入
     * @param e
     */
    handleInputChange = (e)=>{
        const $input = e.target;
        const name = $input.name;
        const keyValue = this.state.form;
        //console.log(this.state.form);
        //控制长度
        if($input.maxLength !== undefined  && $input.maxLength > 0){
            keyValue[name] = $input.value.slice(0,$input.maxLength*1);
        }else {
            keyValue[name] = $input.value;
        }
 
        this.setState({
            form:keyValue
        });
    };

    /**
     * 表单字段验证函数
     * @param value 表单值
     * @param validObj 表单对象
     * @returns {boolean} 返回值 true=> 验证通过 false => 验证失败
     */
    validate(value,validObj){
        //debugger;
        //是否可为空？
        if(!validObj.required){//可为空
            const result =  !(validObj.valid instanceof  RegExp) ? true : validObj.valid.test(value);
            if(result){
                return true;
            }else{
                T.showToast(validObj.invalidText || '输入的字段有误');
                return false;
            }
        }else{//不可为空
            if(value == ''){//输入为空
                T.showToast(validObj.emptyText);
                return false;
            }else{//输入不为空
                const result =  !(validObj.valid instanceof  RegExp) ? true : validObj.valid.test(value);
                if(result){
                    return true;
                }else{
                    T.showToast(validObj.invalidText || '输入的字段有误');
                    return false;
                }
            }
        }
    }



    /**
     * 初始化图形验证码
     * @param $img
     */
    initImgVCode($img,opt){
        //debugger;
        const d_opt = {
            token:'',
            callback:T.noop
        };

        opt = T.merge({},d_opt,opt);
        T.ajax({
            url:'getVerifyCode'
        }).done((result)=>{
            $img.src = config.ip+'/AppApi/v'+config.version+'/'+result.vcode+'?v='+Date.now()+'&token='+opt.token;
            opt.callback(opt.token);
        });
    }

    /**
     * 更换图形验证码
     */
    handleChangeImgVCode(e){
        this.initImgVCode(e.target,{
            token:this.TOKEN
        });
        //e.target.click();
    }

    /**
     * 发送验证码
     * @param $btn
     */
    handleSendVCode($btn,opt){
        if(T.hasClass($btn,'disabled')){
            return;
        }

        if(opt.$input.value == ''){
            T.showToast('手机号码不能为空');return;
        }

        if(!/^1[3-8]\d{9}$/.test(opt.$input.value)){
            T.showToast('输入的手机号码格式有误');return;
        }
        /*alert(opt.$vcode.val());*/
        if(opt.$vcode.value == ''){
            T.showToast('图形验证码不能为空');return;
        }


        var data = {};
        data[opt.keyName] = opt.$input.value;//必须要的参数
        data['vCode'] = opt.$vcode.value;//图形验证码

        data = T.merge({},data,opt.extraArgs);

        T.addClass($btn,'disabled');
        $btn.textContent = '发送中...';

        T.ajax({
            url:opt.url,
            load:true,
            method:'post',
            data:data
        }).done((data)=>{
            var countSeconds = opt.delay;
            $btn.textContent = '已发送('+(countSeconds--)+')';
            /*为btn加上已经获取过的标志*/
            this.timer = setInterval(()=>{
                if(countSeconds === -1){//如果时间结束
                    T.removeClass($btn,'disabled').textContent = '重新发送';
                    clearInterval(this.timer);
                    /*制空验证码输入框，并改变验证码*/
                    this.initImgVCode(opt.$imgVcode,{token:this.TOKEN});
                    //opt.$imgVcode.click();
                    opt.$vcode.value = '';
                    opt.timeoutCallback();//超时回调
                    return;
                }

                $btn.textContent = '已发送('+(countSeconds--)+')';

            },1000);
        },(data)=>{
            T.showToast(data.errmsg);
            T.removeClass($btn,'disabled').textContent = '发送验证码';
            /*制空验证码输入框，并改变验证码*/
            //this.initImgVCode(opt.$imgVcode);
            //debugger;
            //opt.$imgVcode.click();
            this.initImgVCode(opt.$imgVcode,{token:this.TOKEN});
            opt.$vcode.value = '';
            clearInterval(this.timer);
        },()=>{
            T.removeClass($btn,'disabled').textContent = '重新发送';
            this.initImgVCode(opt.$imgVcode,{token:this.TOKEN});
            clearInterval(this.timer);
        }).fail(()=>{
            T.removeClass($btn,'disabled').textContent = '重新发送';
            this.initImgVCode(opt.$imgVcode,{token:this.TOKEN});
        });
    }

    componentWillUnmount(){
        clearInterval(this.timer);
    }
}

export default LRForm;