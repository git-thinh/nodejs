function mdloginCtrl($rootScope, $scope, $controller, $http, $timeout, svCore, CONNECTION_ERROR) {
    $('.menu-last').hide();


    /* clear state third menu. if third menu is opened -> close same default */
    $('#menusub-1 li ul').attr('class', 'hide');
    $('#menusub-1 li.haslast a i').attr('class', 'glyphicon glyphicon-triangle-right');
    $rootScope.menuChildLastArray = [];

    $rootScope.login = false;

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

    var typeAdmin = '';
    var typePublic = '';

    var userName_keyup_timer = null;
    $scope.userName_keyup = function (event) {
        $timeout.cancel(userName_keyup_timer);
        if (event.keyCode == 13) {
            userName_keyup_timer = $timeout(function () {
                document.getElementById('password').focus();
            }, 10);
        }
    };

    var password_keyup_timer = null;
    $scope.password_keyup = function (event) {
        $timeout.cancel(password_keyup_timer);
        if (event.keyCode == 13) {
            password_keyup_timer = $timeout(function () {
                document.getElementById('ui-btn-login').click();
            }, 10);
        }
    };

    $scope.userName_textbox = {
        id: "userName",
        attrs: ' on-keyup="userName_keyup" ng-model="user.userName" class="form-control" value="" '
    };

    $scope.password_textbox = {
        id: "password",
        attrs: ' on-keyup="password_keyup" ng-model="user.password" class="form-control" value="" '
    };


    $scope.setTypeInit = function (type) {
        var ti = type;
        if (ti == undefined || ti == null || ti == '')
            ti = label['Res_0000_01_03'];
        return ti + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class=caret></span>';
    };

    $scope.isSelectType = function (type) {
        return $rootScope.user.type === type;
    };

    $scope.changeType = function (type) {
        $rootScope.user.type = type;
        $rootScope.user.userName = '';
        $rootScope.user.password = '';
        console.log($rootScope.user);
    };

    typeAdmin = label['Res_0000_01_03'];
    typePublic = label['Res_0000_01_04'];
    $rootScope.user = { type: typeAdmin, userName: "", password: "" };
    $scope.typeUsers = [typeAdmin, typePublic];

    aready(function () {
        var moduleID = svCore.getModuleID(); 
        if (moduleID == 'md-login') {
            var elog = document.getElementById('mod-login');
            if (elog != null) elog.style.display = 'table';
        }  
    });

    $scope.login = function () {
        

        var user = {};
        user['type'] = $rootScope.user.type;
        //user['password'] = $rootScope.user.password;
        user['password'] = document.getElementById('password').value;

        if ($rootScope.user.type == typePublic) {
            //user['userName'] = $rootScope.user.userName;
            user['userName'] = document.getElementById('userName').value;
        }

        console.log(JSON.stringify(user));

        var urlLogin = CONFIG.URL_API + 'md-login?socket-id=' + $rootScope.socketID;
        console.log(urlLogin);

        $http.post(urlLogin, user).
              success(function (val, status, headers, config) {
                  console.log('RESULT LOGIN: ', JSON.stringify(val));

                  if (val['result'] == 'auth' || val['result'] == 'success') {
                      var elog = document.getElementById('mod-login');
                      if (elog != null) elog.style.display = 'none';

                      closeInfiniteIndicator();

                      $rootScope.login = true;
                      $rootScope.user = user;
                      cooSet('type', user.type);

                      svCore.loadMenu();

                      setTimeout(function () {
                          location.href = '/#/' + CONFIG.MODULE_DEFAULT;
                      }, 1);
                  } else {
                      closeInfiniteIndicator();
                      // {result: "auth"}
                      // {result: "auth_failure", msg: "This username is logged"}
                      var msg = 'Unknow exception is occurred';

                      if ((val['result'] == 'auth_failure' || val['result'] == 'error') && val['msg'] != null) {
                          msg = val['msg'];
                      }

                      alertShow({
                          type: 'error', content: msg, cancel: function () { }
                      });
                  }
              }).
              error(function (data, status, headers, config) {
                  closeInfiniteIndicator();
                  alertShow({ type: 'error', content: CONNECTION_ERROR });
              });
    };
}