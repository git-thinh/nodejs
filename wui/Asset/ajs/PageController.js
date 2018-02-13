'use strict';

/* Controllers */

function PageController($rootScope, $scope, $http, $route, $routeParams, $compile, svCore) { 
    jQuery('#box-module').css({ 'overflow': 'hidden' });    
    jQuery('#view-module').css({ 'height': '100vh' });
    jQuery('#view-module').show();

    var moduleID = svCore.getModuleID();
    if (moduleID != 'md-login' && $rootScope.login == false) return;
    if (moduleID == 'md-login' && $rootScope.login == true) return;

    $rootScope.moduleID = moduleID;

    //var moduleID = $routeParams.name;
    //if (moduleID == null || moduleID == undefined || moduleID == 'undefined') moduleID = CONFIG.MODULE_DEFAULT;
    var controllerID = moduleID.split('-').join('').split('.').join('') + 'Ctrl';
    $scope.moduleCtrl = controllerID;

    ////console.clear();
    //console.log('PageController moduleID = ' + moduleID);
    console.log('PageController controllerID = ' + controllerID);
    /******************************************************/
    //var jq = $.noConflict();
    ////jQuery('#message_title').css({ 'color': 'red' });
    /******************************************************/
}
