var HMJsBridge = (function () {
  var BridgeOnloading = false
  var readyCallbackQuene = []
  var HMJsBridge = {}

  window.xmydSigned = function (data) {
    log(data)
    if (data.timestamp === 'error') {
      log('error:' + data.signatrue)
    } else {
      HMJsBridge.callback(data)
    }
  }

  function signatrue(env, callback) {
    HMJsBridge.callback = callback
    var signatrueUrl = HMJsBridge.signatrueUrl
    var url = window.location.href.replace(window.location.hash, '')
    url = signatrueUrl + (signatrueUrl.indexOf('?') ? '&' : '?') + 'url=' + encodeURIComponent(url)
    url = url + '&_=' + (new Date()).getTime()

    var script = window.document.createElement("script")
    script.src = url
    script.async = true
    document.body.appendChild(script)
  }

  function readyCallbacksDo(HM_JsBridge) {
    for (var i = readyCallbackQuene.length - 1; i >= 0; i--) {
      readyCallbackQuene.pop()(HM_JsBridge)
    }
  }

  function HMJsBridgeReady(callback) {
    readyCallbackQuene.push(callback);
    if (window.HM_JsBridge) {
      if (BridgeOnloading) {
        readyCallbacksDo(HM_JsBridge)
      } else {
        BridgeOnloading = true;
        window.HM_JsBridge.init();
        readyCallbacksDo(HM_JsBridge)
      }
    } else {
      if (!BridgeOnloading) {
        document.addEventListener(
          'HM_JsBridgeReady',
          function () {
            BridgeOnloading = true;
            window.HM_JsBridge.init();
            readyCallbacksDo(HM_JsBridge)
          },
          false
        )
      }
    }
  }

  var isSupport = function () {
    var matched = navigator.userAgent.match(/com\.xiaomi\.hm\.health\/(\d+)?\_?((\d+)\.?(\d+)?\.?(\d+)?)/);
    if (matched && matched.length === 6) {
      return Number(matched[3]) * 1000 + Number(matched[4]) * 10 + Number(matched[5]) >= 2090
    } else {
      return false
    }
  }

  var jsbridgeToPageCallback = function (responseData, callback) {
    var message = null;
    try {
      message = JSON.parse(responseData);
    } catch (e) {
      console.log(e);
    }
    typeof callback === 'function' && callback(message, HMJsBridge)
  }

  var preVerifyJsApi = function (requestData, callback) {
    var env = requestData.env ? requestData.env : '';
    signatrue(env, function (data) {
      data.jsApiList = requestData.jsApiList;
      log('preVerifyJsApi:' + JSON.stringify(data))
      HM_JsBridge.invoke('preVerifyJsApi', JSON.stringify(data), function (responseData) {
        jsbridgeToPageCallback(responseData, callback)
      })
    })
  }

  var getLocation = function (callback) {
    HM_JsBridge.invoke('getLocation', null, function (responseData) {
      jsbridgeToPageCallback(responseData, callback)
    })
  }

  var openInBrowser = function (url, callback) {
    log('openInBrowser: url=' + url.url)
    HM_JsBridge.invoke('openInBrowser', JSON.stringify(url), function (responseData) {
      jsbridgeToPageCallback(responseData, callback)
    })
  }

  HMJsBridge.isSupport = isSupport
  HMJsBridge.preVerifyJsApi = preVerifyJsApi
  HMJsBridge.getLocation = getLocation
  HMJsBridge.HMJsBridgeReady = HMJsBridgeReady
  HMJsBridge.openInBrowser = openInBrowser
  HMJsBridge.signatrue = signatrue

  return HMJsBridge
})(window)

function prepareDevEnvirment() {
  HMJsBridge.isSupport = function () {
    return true;
  }
  HMJsBridge.HMJsBridgeReady = function (callback) {
    callback()
  }
  window.HM_JsBridge = {
    init: function () {},
    invoke: function (action, args, callback) {
      log('action=' + action + ", args=" + args)
      callback('{"status":"success"}')
    }
  }
  HMJsBridge.openInBrowser = function (options, callback) {
    window.open(options.url)
    if (callback) callback(options)
  }
}

/*===↓↓↓=== sdk ===↓↓↓===*/
function log(message) {
  if (!window.ZYCFG || !window.ZYCFG.logEnabled) return
  var log = document.getElementById('log')
  if (!log) {
    var container = document.getElementById('mainContainer')
    log = document.createElement('div')
    log.id = 'log'
    container ? container.insertBefore(log, container.firstChild) : document.body.appendChild(log)
  }
  if (typeof (message) !== 'string') {
    message = JSON.stringify(message)
  }
  var logItem = document.createElement('div')
  logItem.innerText = message
  log.appendChild(logItem)
}

window.onerror = function (error) {
  log(error)
}

function openInBrowserWrap(url, callback) {
  try {
    callback = callback || function (data) {
      log(data)
    }
    if (HMJsBridge.isSupport()) {
      HMJsBridge.HMJsBridgeReady(function () {
        HMJsBridge.preVerifyJsApi({
          jsApiList: ['openInBrowser']
        }, function (data) {
          log('HMJsBridge.preVerifyJsApi end')
          if (data.status === 'success') {
            HMJsBridge.openInBrowser({
              url: url
            }, callback)
          } else {
            callback(data)
          }
        })
      })
    } else {
      window.location = url
    }
  } catch (e) {
    log(e)
  }
}

function determineDevice() {
  var userAgent = navigator.userAgent || navigator.vendor || window.opera;
  if (/windows phone/i.test(userAgent)) {
    return "winphone";
  }
  if (/android/i.test(userAgent)) {
    return "android";
  }
  if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
    return "ios";
  }
  return "unknown";
}

function installXmydJsBridge(cfg) {
  var isDev = window.isDevMode || location.host === 'localhost'
  var signUrl = (location.host === 'localhost') ? 'http://localhost:7061' : 'https://wwww.zhiyishow.com'
  window.ZYCFG = cfg
  HMJsBridge.signatrueUrl = signUrl + '/xmyd/d/api/signature?callback=xmydSigned&device=' + determineDevice() + '&aid=' + cfg.aid
  if (isDev) prepareDevEnvirment()
  if (!isDev && !HMJsBridge.isSupport()) {
    return {
      openInBrowser: function () {
        alert("接入演示：openInBrowser called")
      }
    }
  }
  return {
    openInBrowser: openInBrowserWrap
  }
}

/*===↑↑↑=== sdk ===↑↑↑===*/

(function (factory) {
  if (typeof define === 'function' && define.amd) {
      define([], factory);
  } else if (typeof exports === 'object') {
      module.exports = factory();
  }
}(function () {
    return HMJsBridge;
}));
