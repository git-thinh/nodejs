
function mdheaderCtrl($rootScope, $scope, svCore) {
    $scope.$on(CONFIG.BROADCAST_STATE, function (event, state) {
        //console.log('STATE', state); // 'Data to send'
        var img = document.getElementById('msgStateNotification');
        if (img != null)
            img.src = '/Modules/md-header/img/' + state + '.png';
    });

    $scope.$on(CONFIG.BROADCAST_MESSAGE, function (event, msg) {
        //console.log('MESSAGE', msg); // 'Data to send'
        document.getElementById('msgTextNotification').innerHTML = msg;
    });

    $scope.logout = function () {
        //svCore.logout();
    };
}