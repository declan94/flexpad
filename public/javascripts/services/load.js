angular.module('flexpad')
    .service('Load', function ($uibModal, $timeout) {

        var self = this;

        this._loadingData = {};

        this.modalInstance = null;

        this.clear = function() {
            this._loadingData = {};
        };

        var _isLoading = function() {
            for (var tag in self._loadingData) {
                if (self._loadingData.hasOwnProperty(tag) && self._loadingData[tag]) {
                    return true;
                }
            }
            return false;
        };
        self._loading = _isLoading();

        this.isLoading = function () {
            return self._loading;
        };

        this.setLoadInfo = function(info){
            self.loadInfo = info;
        };

        this.loading = function(tag, info) {
            if (info !== undefined) {
                self.setLoadInfo(info);
            }
            tag = tag || "DefaultLoadingTag";
            self._loadingData[tag] = true;
            self._loading = _isLoading();
            if (self.modalInstance === null) {
                $timeout(function() {
                    if (!self.isLoading()) {
                        return;
                    }
                    self.modalInstance = $uibModal.open({
                        animation: true,
                        windowTemplateUrl: "views/loadingtoastwindow.html",
                        templateUrl: 'views/loadingtoast.html',
                        controller: function($scope) {
                            $scope.load = self;
                            $scope.$watch('load._loading', function (newVal) {
                                if (!newVal) {
                                    self.modalInstance = null;
                                    $scope.$close();
                                }
                            });
                        },
                        size: 'sm'
                    });
                    self.modalInstance.result.then(function(){}, function(){});
                }, 100);
            }
        };

        this.loaded = function(tag) {
            tag = tag || "DefaultLoadingTag";
            self._loadingData[tag] = false;
            self._loading = _isLoading();
        };

    });
