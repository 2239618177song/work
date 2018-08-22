define([
    'webappControllers'
], function (controllers) {
    controllers.controller('conferenceController', ['$scope', '$rootScope', '$filter', '$state', 'resourceService', '$localStorage', '$timeout', '$stateParams', function ($scope, $rootScope, $filter, $state, resourceService, $localStorage, $timeout, $stateParams) {
        if ($stateParams.wap) {
            $scope.wap = $stateParams.wap;
        }
        if((parseFloat($stateParams.currentv))>0 && (parseFloat($stateParams.currentv))<5){
            $scope.currentv = parseFloat($stateParams.currentv);
            $('.parta').load(function(){
                $('html,body').animate({scrollTop:($('#video-box').offset().top-20)},200);
            })
        }
        else{
            $scope.currentv = 1;
        }
        var swiper = new Swiper('.swiper-container', {
            paginationClickable: true,
            autoplay: 3000,
            spaceBetween: 0,
            loop: true,
            autoplayDisableOnInteraction: false,
            prevButton: '.button-prev',
            nextButton: '.button-next',
            onSlideNextStart: function (swiper) {
                $timeout(function () {
                    $scope.selected = swiper.activeIndex;
                })
            },
            onSlidePrevStart: function (swiper) {
                $timeout(function () {
                    $scope.selected = swiper.activeIndex;
                })
            }
        });
        $scope.onselPhoto = function (index) {
            swiper.slideTo(index);
        }
    }]);
})
