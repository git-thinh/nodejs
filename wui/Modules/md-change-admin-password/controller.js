function mdchangeadminpasswordCtrl_clear() {
    var oldPassword = document.getElementById('oldPassword');
    var newPassword = document.getElementById('newPassword');
    var confirmPassword = document.getElementById('confirmPassword');
    if (oldPassword != null) oldPassword.value = '';
    if (newPassword != null) newPassword.value = '';
    if (confirmPassword != null) confirmPassword.value = '';
}

function _getUser() {
    var oldPassword = document.getElementById('oldPassword').value;
    var newPassword = document.getElementById('newPassword').value;
    var confirmPassword = document.getElementById('confirmPassword').value;
    return { oldPassword: oldPassword, newPassword: newPassword, confirmPassword: confirmPassword };
}

function mdchangeadminpasswordCtrl($rootScope, $scope, $route, $controller, $http, $timeout, svCore, CONNECTION_ERROR) {
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

    var userInit = { oldPassword: "", newPassword: "", confirmPassword: "" };
    $scope.user = userInit;
         
    $scope.password_old_textbox = {
        id: "oldPassword",
        attrs: ' ng-model="user.oldPassword" class="form-control" value="" '
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
        mdchangeadminpasswordCtrl_clear();
    };


    $scope.submit = function () {
        var user = _getUser();
        console.log('user = ', user);

        $http
            .post(CONFIG.URL_API + 'admin/validatePassword?socket-id=' + $rootScope.socketID, user)
            .success(function (dataVali) {
                console.log('dataVali = ', dataVali);
                
                if (svCore.per_error(dataVali)) return;

                if (dataVali['result'] == 'success') {

                    var con = label.Res_0701_01_04;
                    alertShow({
                        type: 'confirm',
                        title: label.Res_0701_01,
                        content: con,
                        cancel: function () {
                            mdchangeadminpasswordCtrl_clear();
                        },
                        ok: function () {
                            $http
                                .post(CONFIG.URL_API + 'admin/changePassword?socket-id=' + $rootScope.socketID, user)
                                .success(function (rsData) {
                                    closeInfiniteIndicator();

                                    if (svCore.per_error(rsData)) return;

                                    console.log('rsData = ', rsData);
                                    if (rsData['result'] == 'success') {
                                        mdchangeadminpasswordCtrl_clear();
                                    } else if (rsData['result'] == 'error') {
                                        alertShow({ type: 'error', content: rsData['msg'] });
                                    }
                                })
                                .error(function (data, status, headers, config) {
                                    closeInfiniteIndicator();
                                    alertShow({ type: 'error', content: CONNECTION_ERROR });
                                });
                        }
                    });

                } else if (dataVali['result'] == 'error') {
                    alertShow({ type: 'error', content: dataVali['msg'] });
                }
            }).
            error(function (data, status, headers, config) {
                closeInfiniteIndicator();
                alertShow({ type: 'error', content: CONNECTION_ERROR });
            });
    };
}