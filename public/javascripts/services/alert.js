/**
 * Created by declan on 17/7/26.
 */

angular.module('flexpad')
    .service('Alert', function ($timeout, $uibModal) {

        var _alert = function(info, type, autoDismiss) {
            var modalInstance = $uibModal.open({
                animation: true,
                windowTemplateUrl: 'views/alertwindow.html',
                templateUrl: 'views/alertmodal.html',
                controller: function($scope) {
                    $scope.alertType = type;
                    $scope.alertInfo = info;
                },
                size: 'sm'
            });

            if (type !== 'confirm') {
                modalInstance.result.then(function(){}, function(){});
            }

            if (autoDismiss !== undefined) {
                $timeout(function () {
                    modalInstance.dismiss();
                }, autoDismiss);
            }

            return modalInstance.result;
        };

        this.inform = function(info) {
            _alert(info, 'inform', 1500);
        };

        this.error = function(info) {
            info = info || '未知错误';
            _alert(info, 'error');
        };

        this.confirm = function(info) {
            return _alert(info, 'confirm');
        };

    });
