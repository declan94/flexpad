angular.module('flexpad')
    .controller('LoginCtrl', function ($scope, Load, Relocate, Alert, Auth) {

      Load.clear();

      $scope.login = function (username, password) {
        Load.loading("login");
        Auth.login(username, password, function (result, response) {
          Load.loaded("login");
          if (result) {
            Auth.storeToCookie();
            Relocate.toBack();
          } else {
            console.debug(response);
            if (response.status === -1) {
              Alert.error("无法连接到服务器");
            } else if (response.status === 401) {
              Alert.error(response.data.userMessage);
            } else {
              Alert.error("登录失败");
            }
          }
        });
      };

    });