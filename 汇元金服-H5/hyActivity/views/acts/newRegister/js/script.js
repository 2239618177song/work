var NewerReg = (function(){
    /*表单相关*/
    var $mobile= $('[name=mobile]'),
        $vcode = $('[name=vCode]'),
        $password = $('[name=password]'),
        //$inviteCode = $('[name=inviteCode]'),
        $vcodeBtn = $('#vCode'),

        $imgVCodeInput = $('[name=imgVCodeInput]'),
        $imgVcode = $('#imgVCode'),
        $openProtocol = $('#openProtocol'),
        $btn = $('#btnSubmit'),
        $checkProtocol = $('#checkProtocol');

    var initSomePlugins = function(){
        /*标识符*/
        var TOKEN = TL.getRandom();//前端生成token，忽略可能的重复

        /*图形验证码*/
        TL.getVcode({
            elem:$imgVcode,
            token:TOKEN
        });

        /*展开协议*/
        $openProtocol.click(function(){
            var $this = $(this);
            if($this.data('load')){
            }
            TL.openRegisterProtocol();
        });

        /*发送短信*/
        TL.sendVcode({
            $input:$mobile,//手机号码
            $btn:$vcodeBtn,//发送按钮
            $vcode:$imgVCodeInput,
            $imgVcode:$imgVcode,
            url:'sendRegisterMobileVCode',
            delay:60,
            keyName:'mobile',
            extraArgs:{
                token:TOKEN,
                version:'1.2.0'
            }
        });
    };


    var bindEvent = function () {
        $btn.bind('click',function(){
            var $this = $(this);

            if($this.hasClass('disabled'))return;
            if($mobile.val() == ''){
                $.Alert('手机号码不能为空！');return;
            }

            if(!/^1[3-9]\d{9}$/.test($mobile.val())){
                $.Alert('手机号码格式有误！');return;
            }

            if($imgVCodeInput.val() == ''){
                $.Alert('图形验证码不能为空！');return;
            }

            if($vcode.val() == ''){
                $.Alert('手机验证码不能为空！');return;
            }

            if($password.val() == ''){
                $.Alert('密码不能为空！');return;
            }

            if(!/^(?![\d]+$)(?![a-zA-Z]+$)(?![^\da-zA-Z]+$)[^\s]{6,18}$/.test($password.val())){
                $.Alert('密码格式有误(6-18为数字字母的组合)！');return;
            }

            if(!$checkProtocol[0].checked){
                $.Alert('请确认用户注册协议！');
                return;
            }

            //var semChannel = TL.getQueryField('from');

            $this.addClass('disabled');

            var data = {
                mobile:$mobile.val(),
                vCode:$vcode.val(),
                password:$password.val(),
                invitationCode:TL.getQueryField('iCode') || ''
            };

            TL.Ajax({
                url:'inviteRegister',
                data:data,
                load:true,
                type:'post'
            }).done(function(){
                $this.removeClass('disabeld');
                $.Alert('恭喜,注册成功!', function () {
                   window.location.href = _config.mainIP+'/user/login';
                    $this.removeClass('disabled');
                });
            },function(){
                $this.removeClass('disabled');
            }).fail(function(){
                $this.removeClass('disabled');
            });

        });
    };

    return {
        init: function () {
            initSomePlugins();
            bindEvent();
        }
    }
})();


$(function () {
   NewerReg.init();
});