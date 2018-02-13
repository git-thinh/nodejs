function mdaddpublicuseraccountCtrl_clear() {
    var userName = document.getElementById('userName');
    var newPassword = document.getElementById('newPassword');
    var confirmPassword = document.getElementById('confirmPassword');
    if (userName != null) userName.value = '';
    if (newPassword != null) newPassword.value = '';
    if (confirmPassword != null) confirmPassword.value = '';
}

function _getUser() {
    var userName = document.getElementById('userName').value;
    var newPassword = document.getElementById('newPassword').value;
    var confirmPassword = document.getElementById('confirmPassword').value;
    return { userName: userName, newPassword: newPassword, confirmPassword: confirmPassword };
}

function mdaddpublicuseraccountCtrl($rootScope, $scope, $route, $controller, $http, $timeout, svCore, CONNECTION_ERROR) {
    var label = {};
    var sLabel = svCore.getSynchronous($scope.PATH + 'label-en.json');
    if (sLabel == null) {
        jQuery('#box-module').hide();
        alertShow({ type: 'error', content: CONNECTION_ERROR });
        return;
    }
    try {
        label = JSON.parse(sLabel);
    } catch (err) {
        alertShow({ type: 'error', content: 'Json content format is not correct' });
        jQuery('#box-module').hide();
        return;
    }
    $scope.label = label;

    var userInit = { userName: "", newPassword: "", confirmPassword: "" };
    $scope.user = userInit;

    $scope.user_name_textbox = {
        id: "userName",
        attrs: ' ng-model="user.userName" class="form-control" value="" '
    };

    $scope.password_new_textbox = {
        id: "newPassword",
        attrs: ' ng-model="user.newPassword" class="form-control" value="" '
    };

    $scope.password_new_confirm_textbox = {
        id: "confirmPassword",
        attrs: ' ng-model="user.confirmPassword" class="form-control" value="" '
    };

    $scope.cancel = function () {
        $scope.user = userInit;
        mdaddpublicuseraccountCtrl_clear();
    };

    $scope.submit = function () {
        var user = _getUser();
        console.log('user = ', user);

        $http.post(CONFIG.URL_API + 'public/validateAccount?socket-id=' + $rootScope.socketID, user).
                      success(function (rsVali) {
                          console.log('rsVali = ', rsVali);

                          if (svCore.per_error(rsVali)) return;

                          if (rsVali['result'] == 'success') {

                              var con = label.Res_0702_01_04.split('{userName}').join(user.userName);
                              alertShow({
                                  type: 'confirm',
                                  title: label.Res_0702_01,
                                  content: con,
                                  cancel: function () {
                                      $scope.user = userInit;
                                      mdaddpublicuseraccountCtrl_clear();
                                  },
                                  ok: function () {
                                      $http.post(CONFIG.URL_API + 'public/addAccount?socket-id=' + $rootScope.socketID, user).
                                            success(function (rsData) {
                                                closeInfiniteIndicator();

                                                if (svCore.per_error(rsData)) return;

                                                console.log('rsData = ', rsData);
                                                if (rsData['result'] == 'success') {
                                                    $scope.user = userInit;
                                                    mdaddpublicuseraccountCtrl_clear();
                                                } else if (rsData['result'] == 'error') {
                                                    alertShow({ type: 'error', content: rsData['msg'] });
                                                }
                                            }).
                                            error(function (data, status, headers, config) {
                                                closeInfiniteIndicator();
                                                alertShow({ type: 'error', content: CONNECTION_ERROR });
                                            });
                                  }
                              });

                          } else if (rsVali['result'] == 'error') {
                              alertShow({ type: 'error', content: rsVali['msg'] });
                          }
                      }).
                      error(function (data, status, headers, config) {
                          closeInfiniteIndicator();
                          alertShow({ type: 'error', content: CONNECTION_ERROR });
                      });
    };
}