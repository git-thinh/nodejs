function mdmenu21Ctrl($rootScope, $scope, $http, $filter, $timeout, $location, svMessage) {
    $scope.messages = svMessage.messages;

    $scope.$on('MESSAGE', function (event, msg) {
        console.clear();
        $timeout(function () {
            var count = svMessage.messages.length;
            $scope.msgCount = count;
            console.log(count);
        }, 300);
        var tr = document.createElement('tr');
        tr.innerHTML = '<tr><td>' + msg.type + '</td><td style="padding:3px 10px;">' + msg.msg + '</td><td>' + msg.time + '</td></tr>';
        document.getElementById('messageBody').appendChild(tr);
    });

    $scope.refreshMsg = function () {
        console.clear();
        console.log(svMessage.messages.length);
        $scope.messages = svMessage.messages;
    }
}