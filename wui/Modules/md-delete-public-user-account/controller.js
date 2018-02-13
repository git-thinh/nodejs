function mddeletepublicuseraccountCtrl_clear() {
}

function mddeletepublicuseraccountCtrl($rootScope, $scope, $route, $controller, $http, $timeout, svCore, CONNECTION_ERROR) {
    jQuery('#box-module').hide();

    var dataUser = {};
    var sUser = svCore.getSynchronous(CONFIG.URL_API + 'public/getAllAccount');
    if (sUser == null) {
        jQuery('#box-module').hide();
        alertShow({ type: 'error', content: CONNECTION_ERROR });
        return;
    }
    try {
        dataUser = JSON.parse(sUser);
        console.log(' GET USER = ', dataUser);
    } catch (err) {
        alertShow({ type: 'error', content: 'Json content format is not correct' });
        jQuery('#box-module').hide();
        return;
    }

    if (svCore.per_error(dataUser)) {
        return;
    }

    /**********************************************************************/

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


    var initUser = dataUser['data'];
    $scope.users = initUser;
    
    var cacheUser = [];

    $scope.checkUser = function (event, user) {
        var it = document.getElementById('item-' + user);
        if (it != null) {
            if (it.hasAttribute('checked')) {
                /* remove selected */
                it.removeAttribute('checked');
                var index = cacheUser.indexOf(user);
                if (index != -1) cacheUser.splice(index, 1);
            } else {
                /* add selected */
                cacheUser.push(user);
                it.setAttribute('checked', 'checked');
            }
        }
        console.log('cacheUser = ', cacheUser);
    };

    $scope.cancel = function () {
        svCore.reloadModule();
    };
     
    $scope.submit = function () {

        $http.post(CONFIG.URL_API + 'public/validateDeleteAccount?socket-id=' + $rootScope.socketID, cacheUser).
              success(function (rsVali) {
                  closeInfiniteIndicator();
                  console.log('rsVali = ', rsVali);
                  
                  if (svCore.per_error(rsVali)) return;

                  if (rsVali['result'] == 'success') {
                       
                      var con = label.Res_0704_01_02;
                      alertShow({
                          type: 'confirm',
                          title: label.Res_0704_01,
                          content: con,
                          cancel: function () {
                              //alert('cancel');
                              //svCore.reloadModule();
                              document.getElementById('mod-cancel').click();
                          },
                          ok: function () {
                              $http.post(CONFIG.URL_API + 'public/deleteAccount?socket-id=' + $rootScope.socketID, cacheUser).
                                    success(function (rsData) {
                                        closeInfiniteIndicator();
                                        console.log('rsData = ', rsData);
                                        
                                        if (svCore.per_error(rsData)) return;

                                        if (rsData['result'] == 'success') {
                                            svCore.reloadModule();
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

    aready(function () {
        jQuery('#box-module').show();
    });    
}