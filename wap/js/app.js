define(["angular",
  'conttrollers/mianController'
  , 'ngInfiniteScroll'
  , 'angularQrcode'
], function (angular) {
  return angular.module("webapp", ['ui.router', 'ngStorage', 'webappControllers', 'ngResource', 'ngDialog', 'angular-md5', 'infinite-scroll', 'monospaced.qrcode', 'widget.scrollbar']);
})