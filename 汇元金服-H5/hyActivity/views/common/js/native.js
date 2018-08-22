var lrNative = (function(){
		/*判断终端*/
		var u = navigator.userAgent;
		var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
		var isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
		

		/**
		 * 原生toast
		 * @param  {[type]} message [description]
		 * @return {[type]}         [description]
		 */
		var toAppToast = function(message){
			try {
				if (isIOS){
					window.webkit.messageHandlers.toAppToast.postMessage(message);
				}else{
					lrBridgeJS.toAppToast(message);
				}
			} catch (e) {
				console.info("不支持jsbridge", e);
			}
		};

		/**
		 * 原生页面跳转
		 * @param  {[type]} url [description]
		 * @return {[type]}     [description]
		 */
		var toAppJumpTo = function(url){
			try {
				if (isIOS){
					window.webkit.messageHandlers.toAppJumpTo.postMessage(url);
				}else{
					lrBridgeJS.toAppJumpTo(JSON.stringify(url));
				}
			} catch (e) {
				console.info("不支持jsbridge", e);
			}
		};

		/**
		 * 原生分享
		 * @param  {[type]} shareArgs [description]
		 * @return {[type]}           [description]
		 */
		var toAppShare = function(shareArgs){
			try {
				if (isIOS){
					window.webkit.messageHandlers.toAppShare.postMessage(shareArgs);

				}else{
					lrBridgeJS.toAppShare(JSON.stringify(shareArgs));
				}
			} catch (e) {
				console.info("不支持jsbridge", e);
			}
		};

		/**
		 * 获取登录鉴权参数
		 * @return {[type]} [description]
		 */
		var toAppGetArgs = function(){

			try {
				if (isIOS){
					window.webkit.messageHandlers.toAppGetArgs.postMessage('');
				}else{
					// var androidUrl = JSON.stringify(url);
					lrBridgeJS.toAppGetArgs();

				}
			} catch (e) {
				console.info("不支持jsbridge", e);
			}
			
		};

		/*操作结果返回*/
		var toAppResult = function(resultArgs){
			try {
				debugger;
				if (isIOS){
					window.webkit.messageHandlers.toAppResult.postMessage(resultArgs);
				}else{
					lrBridgeJS.toAppResult(JSON.stringify(resultArgs));
				}
			} catch (e) {
				console.info("不支持jsbridge", e);
			}
		};



	return{
			toAppToast:toAppToast,
			toAppJumpTo:toAppJumpTo,
			toAppGetArgs:toAppGetArgs,
			toAppShare:toAppShare,
			toAppResult:toAppResult
		}
	})();
