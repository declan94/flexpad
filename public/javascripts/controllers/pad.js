angular.module('flexpad')
    .controller('PadCtrl', function($scope, $routeParams, $sce, $uibModal, Load, Alert, Pads, Auth) {

        Load.clear();
        $scope.username = Auth.getUsername;
        $scope.logout = Auth.logout;
        $scope.isLoading = Load.isLoading;

        var padID = $routeParams.padID;
        $scope.padID = padID;
        Load.loading("pad");
        Pads.get({ padID: padID }, function(ret) {
            var prefix = ret.epPrefix;
            $scope.pad = ret.item;
            $scope.frameUrl = $sce.trustAsResourceUrl(prefix + padID + "?showControls=true&showChat=true&showLineNumbers=true&useMonospaceFont=false");
            Load.loaded("pad");
        }, function(err) {
            console.debug(err);
            if (err.data.msg) {
                Alert.error(err.data.msg);
            }
            Load.loaded("pad");
        });

        $scope.share = function(pad) {
            var modalInstance = $uibModal.open({
                animation: true,
                windowTemplateUrl: 'views/modalwindow.html',
                templateUrl: '/views/share.html',
                size: 'lg',
                controller: function($scope, $location) {
                    $scope.pad = pad;
                    $scope.readonly = !pad.id;
                    $scope.updateLink = function() {
                        if ($scope.readonly) {
                            padID = pad.rdID;
                        } else {
                            padID = pad.id;
                        }
                        if ($location.port() == 80) {
                            $scope.shareLink = $location.protocol() + "://" + $location.host() + "/#!/pad/" + padID;
                        } else {
                            $scope.shareLink = $location.protocol() + "://" + $location.host() + ":" + $location.port() + "/#!/pad/" + padID;
                        }
                    };
                    $scope.updateLink();
                }
            });
            modalInstance.result.then(function() {}, function() {});
        };

    });