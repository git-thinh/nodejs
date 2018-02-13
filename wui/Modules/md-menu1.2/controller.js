
function mdmenu12Ctrl($rootScope, $scope) {
    $scope.message = 'md-menu1.2 controller';

    $scope.sendMsg = function () {
        alert('$scope.message = ' + $scope.message);
    }
}