'use strict';

/* Directives */


angular
    .module('app.directives', [])
    .directive('ngAppVersion', ['version', function (version) {
        return function (scope, elm, attrs) {
            elm.text(version);
        };
    }])
    .directive('onKeyup', function () {
        return function (scope, elm, attrs) {
            elm.bind("keyup", function (event) {
                //scope.$apply(attrs.onKeyup);
                scope.$apply(function () {
                    var fun = scope[attrs.onKeyup];
                    if (typeof fun === "function")
                        fun(event);
                });
            });
        };
    })
    .directive("ngKitCheck", function ($compile) {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                var key = attrs.ngKitCheck;
                var item = scope[key];

                //console.log(key, item);

                if (item != undefined || item != null) {
                    var attrs = item['attrs'];
                    if (attrs == null) attrs = '';

                    var event = item['event'];
                    if (event == null) event = '';
                    else event = ' ng-click = "' + event + '" ';

                    var temp =
                        '<input type="checkbox" id="' + item['id'] + '"' + attrs + '>' +
                        '<label for="' + item['id'] + '" class="label-title"' + event + '>' + item['label'] + '</label>';

                    var linkFn = $compile(temp);
                    var content = linkFn(scope);
                    element.append(content);
                }
            }
        }
    })
    .directive("ngKitSwitch", function ($compile) {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                var key = attrs.ngKitSwitch;
                var item = scope[key];

                //console.log(key, item);

                if (item != undefined || item != null) {
                    var attrs = item['attrs'];
                    if (attrs == null) attrs = '';

                    var event = item['event'];
                    if (event == null) event = '';
                    else event = ' ng-click = "' + event + '" ';

                    var temp =
                        '<input type="checkbox" id="' + item['id'] + '"' + attrs + '>' +
                        '<label for="' + item['id'] + '" ' + event + '></label>';

                    var linkFn = $compile(temp);
                    var content = linkFn(scope);
                    element.append(content);
                }
            }
        }
    })
    .directive("ngKitText", function ($compile) {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                var key = attrs.ngKitText;
                var item = scope[key];

                //console.log(key, item);

                if (item != undefined || item != null) {
                    var attrs = item['attrs'];
                    if (attrs == null) attrs = '';

                    var temp = '<input type="text" id="' + item['id'] + '"' + attrs + '>';

                    var linkFn = $compile(temp);
                    var content = linkFn(scope);
                    element.append(content);
                }
            }
        }
    })
    .directive("ngKitPass", function ($compile) {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                var key = attrs.ngKitPass;
                var item = scope[key];

                //console.log(key, item);

                if (item != undefined || item != null) {
                    var attrs = item['attrs'];
                    if (attrs == null) attrs = '';

                    var temp = '<input type="password" id="' + item['id'] + '"' + attrs + '>';

                    var linkFn = $compile(temp);
                    var content = linkFn(scope);
                    element.append(content);
                }
            }
        }
    })
    .directive('ngResize', function ($window) {
        return function (scope, element) {
            var w = angular.element($window);
            scope.getWindowDimensions = function () {
                return {
                    'h': window.innerHeight || document.body.clientHeight, //w.height(),
                    'w': window.innerWidth || document.body.clientWidth // w.width()
                };
            };
            scope.$watch(scope.getWindowDimensions, function (newValue, oldValue) {
                scope.windowHeight = newValue.h;
                scope.windowWidth = newValue.w;
                if (newValue.w >= 1024) {
                    scope.mainBack = false;
                }

                scope.resizeClass = function () {
                    var bro = '';
                    if (scope.browserName == null || scope.browserName == undefined) {
                        if (angular.ISCHROME) bro = ' chrome';
                        else if (angular.ISSAFARI) bro = ' safari';
                        else if (angular.ISWEBKIT) bro = ' webKit';
                        else if (angular.ISFF) bro = ' firefox';
                        else if (angular.ISIE9UP) bro = ' ie9up';
                        scope.browserName = bro;
                    } else
                        bro = scope.browserName;

                    //console.log('WIDTH BROWSER = ' , newValue.w);

                    var css = 'pc';
                    if (newValue.w < 480)
                        css = 'mobile';
                    else if (newValue.w < 1024)
                        css = 'tablet';

                    return css + bro;
                };
            }, true);

            w.bind('resize', function () {
                scope.$apply();
            });
        }
    })
    .directive('ngModuleController', function ($compile, $rootScope, $window, $http, $routeParams, $timeout, svCore) {
        var linker = function (scope, element, attr) {
            var moduleID = svCore.getModuleID();
            if (moduleID != 'md-login' && $rootScope.login == false) return;
            if (moduleID == 'md-login' && $rootScope.login == true) return;

            var controllerID = scope[attr.ngModuleController];
            element.attr('ng-controller', controllerID);
            element.removeAttr("ng-module-controller");

            //console.log('DIRECTIVE moduleID = ' + moduleID);
            console.log('DIRECTIVE controllerID = ' + controllerID);

            var path = '/Modules/' + moduleID + '/';
            scope.PATH = path;
            scope.moduleID = moduleID;

            var js = svCore.getSynchronous(path + 'controller.js');
            if (js == null) {
                js = 'function ' + controllerID + '($rootScope, $scope) { }';
                //element.attr('ng-controller', 'noneCtrl');
                //alertShow({ type: 'error', content: 'Missing controller: ' + controllerID });
            }
            //else {
            js = js.trim();
            js = js.substring(0, js.length - 1) + ' ; setTimeout(function () { $rootScope.$broadcast("BROADCAST_MODULE_LOADED", "' + moduleID + '");}, 3);      }';
            //}

            var script = document.createElement('script');
            script.setAttribute("type", "text/javascript");
            script.innerHTML = js;
            //script.innerHTML = js + ' ;resetTimerTimeOut();';
            //script.src = path + 'controller.js';
            element.parent().append(script);

            //newElement = $compile("<div my-directive='n'></div>")(scope)
            //element.parent().append(newElement)

            var css = svCore.getSynchronous(path + 'temp.css');
            if (css == null) css = '';
            var style = document.createElement('style');
            style.setAttribute("type", "text/css");
            style.innerHTML = css;
            //style.src = path + 'temp.css';
            element.parent().append(style);

            var temp = svCore.getSynchronous(path + 'temp.html');
            if (temp == null) temp = '';
            temp = '<div id="module" class="view-module ' + moduleID + '">' + temp + '</div>';
            element[0].innerHTML = temp;

            try {
                $compile(element)(scope);
            } catch (err) { }
            //jQuery('html, body').scrollTop(0);
            jQuery('#box-module').show();
            jQuery('#box-module').scrollTop(0);

            /** click auto on Menu 1 -> Menu 1.1 */
            //////if (moduleID == CONFIG.MODULE_DEFAULT || moduleID == '') {
            //////    $timeout(function () {
            //////        jQuery("#menu-main ul li:eq(0) a").trigger('click');
            //////    }, 500);
            //////} 
        };

        return {
            restrict: 'A',
            //terminal: true,
            //priority: 1000,
            link: linker
        };
    })