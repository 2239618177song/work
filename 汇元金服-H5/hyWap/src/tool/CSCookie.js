/**
 * Created by xhy-pc on 2017/6/29.
 */
export default class CSCookie{
    constructor(domain,path='/setLoginState'){
        this.domain = domain;
        this.path = path;
    }

    url;

    args = '';

    init(fn){
        let $script = document.createElement('script');
        $script.src = this.domain+this.path+'?'+this.args.replace(/^\?/,'');
        $script.onload = ()=>{
            fn && fn();
        };
        document.body.appendChild($script);

    }

    setItem(key='',value=''){
        this.args+='&'+key+'='+value;
        return this;
    }
}