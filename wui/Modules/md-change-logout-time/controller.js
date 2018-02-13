
function mdchangelogouttimeCtrl($rootScope, $scope, $route, $controller, $http, $timeout, svCore, CONNECTION_ERROR) {
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

    /******************************************/
    $rootScope.timeOut = CONFIG.TIMEOUT;

    $scope.time_logout_textbox = {
        id: "timeLogOut",
        attrs: ' onkeypress="return event.charCode >= 48 && event.charCode <= 57" ng-model="timeOut" class="form-control" value="" '
    };

    $scope.cancel = function () {
        document.getElementById('timeLogOut').value = CONFIG.TIMEOUT;
    };

    $scope.submit = function () {
        var ti = document.getElementById('timeLogOut').value;
        var time = convertNumber(ti);
        if (time == null) {
            alertShow({ type: 'error', content: 'The value of "Logout Time" must be a number.' });
            return;
        }

        ////if (time < 60 || time > 3600) {
        ////    alertShow({ type: 'error', content: 'The LogoutTime value must be in range 60 seconds to 3600 seconds (1h).' });
        ////    return;
        ////}

        $http.post(CONFIG.URL_API + 'admin/saveLogoutTime?socket-id=' + $rootScope.socketID, { logout_time: time }).
              success(function (rsData) {
                  closeInfiniteIndicator();

                  if (svCore.per_error(rsData)) return;

                  console.log('rsData = ', rsData);
                  if (rsData['result'] == 'success') {
                      CONFIG.TIMEOUT = time;
                  } else if (rsData['result'] == 'error') {
                      alertShow({ type: 'error', content: rsData['msg'] });
                  }
              }).
              error(function (data, status, headers, config) {
                  closeInfiniteIndicator();
                  alertShow({ type: 'error', content: CONNECTION_ERROR });
              });
    };
}