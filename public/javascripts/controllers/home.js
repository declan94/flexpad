angular.module('flexpad')
    .controller('HomeCtrl', function ($scope, Pads, Load, Alert, Relocate) {

        $scope.isLoading = Load.isLoading;
        Load.clear();
        Load.loading("pads");
        Pads.get({}, function (ret) {
            $scope.pads = ret.items;
            Load.loaded("pads");
        }, function(err) {
            console.debug("get pads err", err);
            Load.loaded("pads");
        });

        $scope.createPad = function(title) {
            if (title.match(/^\s*$/)) {
                Alert.error("请输入标题!");
                return;
            }
            Load.loading("createPad");
            Pads.create({}, {title: title}, function (ret) {
                Load.loaded("createPad");
                Relocate.toPad(ret.item);
            }, function (err) {
                Alert.error(err);
                Load.loaded("createPad");
            });
        };

        $scope.gotoPad = Relocate.toPad;

    });