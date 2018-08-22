 (function(){
	var eventType = 'orientationchange' in window ? 'orientationchange' : 'resize';
      window.addEventListener(eventType, (function () {
          function setFontSize() {
            var docElement = document.documentElement;
            var cw = docElement.clientWidth || 750;
            //不限制最大字体
            //docElement.style.fontSize = (100 * (cw / 375)) > 23.5 ? 23.5 + 'px' : (11.75 * (cw / 375)) + 'px';
            //以设计图750px宽度为基准,进行rem换算
            docElement.style.fontSize = (100 * (cw / 750)) + 'px';
          }
          setFontSize();//初始化设置一次
          return setFontSize;
      })(),
      false);
})();