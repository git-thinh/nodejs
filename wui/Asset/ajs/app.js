'use strict';

var ma_menuAdmin = [];
var ma_menuData = [];

function convertNumber(text) {
    if (text == null) return null;
    if (/^(\-|\+)?([0-9]+|Infinity)$/.test(text))
        return Number(text);
    return null;
}

function cooClear() {
    var cookies = document.cookie.split(";");

    for (var i = 0; i < cookies.length; i++) {
        var cookie = cookies[i];
        var eqPos = cookie.indexOf("=");
        var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
    }
}

function cooRemove(name) {
    document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}

function cooSet(cname, cvalue, exdays) {
    if (exdays == null) exdays = 1;
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function cooGet(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function aready(func) {
    angular.element(document).ready(function () {
        func();
    });
}

var wsConnected = false;
var wsConnectingRetry = false;

function connectWS($rootScope, svCore, svMessage) {
    var supportsWebSockets = 'WebSocket' in window || 'MozWebSocket' in window;
    if (supportsWebSockets) {
        var ws = null;

        try {
            ws = new WebSocket(CONFIG.URL_WEBSOCKET);
        } catch (errWs) { }

        if (ws != null) {
            ws.onopen = function () {
                wsConnected = true;
                console.log('Connection Established: ', CONFIG.URL_WEBSOCKET);
                if (wsConnectingRetry) {
                    $('.menu-last').hide();
                    wsConnectingRetry = false;
                    //$rootScope.$broadcast(CONFIG.BROADCAST_MESSAGE, 'The connection is established. Could you refresh page, please?');
                    svCore.checkAuth();
                }
            };
            ws.onclose = function () {
                $('.menu-last').hide();
                console.log('Connection Closed: ', CONFIG.URL_WEBSOCKET);
                wsConnected = false;
                wsConnectingRetry = false;

                setTimeout(function () {
                    if (wsConnected == false && wsConnectingRetry == false) {
                        wsConnectingRetry = true;
                        console.log('WS CLOESD: retry connecting ...');
                        //alertShow({ type: 'error', content: 'An error is occurred during query information from server.' });
                        //$rootScope.$broadcast(CONFIG.BROADCAST_MESSAGE, 'An error is occurred during query information from server.');
                        svCore.checkAuth();
                        connectWS($rootScope, svCore, svMessage);
                    }
                }, CONFIG.TIMEOUT_RETRY_WS);
            };
            ws.onerror = function (error) {
                /* console.log('Error Occured: ' + error); */
                wsConnected = false;
                wsConnectingRetry = false;

                setTimeout(function () {
                    if (wsConnected == false && wsConnectingRetry == false) {
                        wsConnectingRetry = true;
                        console.log('WS ERROR: retry connecting ...');
                        //alertShow({ type: 'error', content: 'An error is occurred during query information from server.' });
                        //$rootScope.$broadcast(CONFIG.BROADCAST_MESSAGE, 'An error is occurred during query information from server.');
                        svCore.checkAuth();
                        connectWS($rootScope, svCore, svMessage);
                    }
                }, CONFIG.TIMEOUT_RETRY_WS);
            };
            ws.onmessage = function (e) {
                wsConnected = true;
                var m = e.data;
                console.log('onmessage = ', m);

                /* m = '{"state":"1"}'; */
                /* m = '{"socket-id":"nCR6Urp1kcmEcwHpoD5mYA=="}' */
                /* {"req":"logout"} */

                var val = null;
                try {
                    val = JSON.parse(m);
                } catch (e1) {
                    console.log(e1.toString(), m);
                    return;
                }

                if (val != null) {
                    if (val['socket-id'] != null) {
                        $rootScope.socketID = val['socket-id'];
                    } else if (val['req'] == 'logout') {
                        location.reload();
                    } else if (val['state'] != null) {
                        var state = 'Off';
                        if (val['state'] == 1 || val['state'] == '1') state = 'On';
                        $rootScope.$broadcast(CONFIG.BROADCAST_STATE, state);
                    } else {
                        if (val['time'] == null || val['time'] == '') {
                            var date = new Date();

                            var MM = date.getMonth() + 1;
                            var dd = date.getDate();
                            var hh = date.getHours();
                            var mm = date.getMinutes();
                            var ss = date.getSeconds();

                            MM = (MM > 9 ? '' : '0') + MM;
                            dd = (dd > 9 ? '' : '0') + dd;
                            hh = (hh > 9 ? '' : '0') + hh;
                            mm = (mm > 9 ? '' : '0') + mm;
                            ss = (ss > 9 ? '' : '0') + ss;

                            MM = (MM > 9 ? '' : '0') + MM;

                            var de = [date.getFullYear(), MM, dd, hh, mm, ss].join('');
                            val['time'] = de;
                        }
                        val['read'] = false;

                        svMessage.push(val);
                        if (val['msg'] != null)
                            $rootScope.$broadcast(CONFIG.BROADCAST_MESSAGE, val['msg']);
                    }
                }
            }
        }
    }
}

(function (window, angular, undefined) {
    'use strict';
    var agl = angular || {};
    var ua = navigator.userAgent;

    agl.ISFF = ua.indexOf('Firefox') != -1;
    agl.ISOPERA = ua.indexOf('Opera') != -1;
    agl.ISCHROME = ua.indexOf('Chrome') != -1;
    agl.ISSAFARI = ua.indexOf('Safari') != -1 && !agl.ISCHROME;
    agl.ISWEBKIT = ua.indexOf('WebKit') != -1;

    agl.ISIE = ua.indexOf('Trident') > 0 || navigator.userAgent.indexOf('MSIE') > 0;
    agl.ISIE6 = ua.indexOf('MSIE 6') > 0;
    agl.ISIE7 = ua.indexOf('MSIE 7') > 0;
    agl.ISIE8 = ua.indexOf('MSIE 8') > 0;
    agl.ISIE9 = ua.indexOf('MSIE 9') > 0;
    agl.ISIE10 = ua.indexOf('MSIE 10') > 0;
    agl.ISOLD = agl.ISIE6 || agl.ISIE7 || agl.ISIE8;

    agl.ISIE11UP = ua.indexOf('MSIE') == -1 && ua.indexOf('Trident') > 0;
    agl.ISIE10UP = agl.ISIE10 || agl.ISIE11UP;
    agl.ISIE9UP = agl.ISIE9 || agl.ISIE10UP;

})(window, window.angular);

////////var m_timerTimeOut = null;
////////function resetTimerTimeOut() {
////////    if (document.location.hash != '#/md-login') {
////////        clearTimeout(m_timerTimeOut);
////////        m_timerTimeOut = setTimeout(goTimeOut, CONFIG.TIMEOUT * 1000);
////////    }
////////}
////////function goTimeOut() {
////////    //cooClear();
////////    //location.reload();
////////    //alertShow({ type: 'error', content: 'time out', cancel: function () { location.reload(); } });
////////    console.log('///////////////////////////////////////////// TIMEOUT >>>> LOGOUT ACCOUNT ');
////////}

////////document.addEventListener("scroll", function (e) {
////////    console.log('/////RESET TIMER TIMEOUT + ', CONFIG.TIMEOUT);
////////    resetTimerTimeOut();
////////}, false);
////////document.addEventListener("click", function (e) {
////////    console.log('/////RESET TIMER TIMEOUT + ', CONFIG.TIMEOUT);
////////    resetTimerTimeOut();
////////}, false);

var m_menu11 = false;

/* Declare app level module which depends on filters, and services */
angular
.module('app', ['app.filters', 'app.services', 'app.directives'])
.constant('CONNECTION_ERROR', 'An error is occurred during query information from server.')
.config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/', { template: '<div ng-module-controller="moduleCtrl"></div>', controller: PageController });
    $routeProvider.when('/:name', { template: '<div ng-module-controller="moduleCtrl"></div>', controller: PageController });
    $routeProvider.otherwise({ redirectTo: '/' });
}])
.run(function ($window, $rootScope, $location, $controller, $timeout, svCore, svMessage) {
   
    $rootScope.timeOut = CONFIG.TIMEOUT;
    sessionStorage.clear();
    connectWS($rootScope, svCore, svMessage);
    $rootScope.per_error = '';
    $rootScope.menuChildLastArray = [];

    var sData = svCore.getSynchronous('/Modules/md-menu/data.json');
    try {
        ma_menuData = JSON.parse(sData);
        ////if (ma_menuData.length > 0 && ma_menuData[0]['menus'] != null) {
        ////    if (ma_menuData[0]['menus'].length > 0 && ma_menuData[0]['menus'][0]['code'] != null) {
        ////        CONFIG.MODULE_DEFAULT = ma_menuData[0]['menus'][0]['code'];
        ////        console.log('SET CONFIG.MODULE_DEFAULT = ', ma_menuData[0]['menus'][0]['code']);
        ////        m_menu11 = true;
        ////    }
        ////}
    } catch (err) {
        console.log('Error validate: ', sData);
    }

    var timeOut = svCore.logoutTimeGet();
    if (timeOut != -1) CONFIG.TIMEOUT = timeOut;
    console.log('timeOut = ', timeOut);

    /***************************************************************/

    $rootScope.$on('BROADCAST_MODULE_LOADED', function (event, moduleID) {
        console.log('///MODULE_LOADED >>> ', moduleID);

        if (moduleID == 'md-login') return;

        /* Restore state menu */
        var indexMain = sessionStorage[moduleID];
        if (moduleID == CONFIG.MODULE_DEFAULT) {
            indexMain = 1;

            $('#menu-sub ul.menu-nav').hide();
            $('li.nolast').removeClass('active');
            $('li.haslast').removeClass('active');
            $('#menu-main ul.menu-nav li:eq(0)').addClass('active');
        } else
            $('#menu-main ul.menu-nav li:eq(0)').removeClass('active');

        console.log('INDEX of BROADCAST_MODULE_LOADED = ', indexMain);

        if (indexMain == undefined || indexMain == null) {
            $('#menu-main ul.menu-nav li:eq(0)').removeClass('active');
            $rootScope.menuChild = '';
        } else
            $rootScope.menuChild = indexMain;

        indexMain = convertNumber(indexMain);
        if (indexMain > 0) {
            document.body.setAttribute('data-menuchild', indexMain);
            var mm = document.getElementById('menu-panel');
            if (mm != null) mm.setAttribute('data-sub', indexMain);

            if (indexMain != 1) {
                var ms1 = document.getElementById('menusub-1');
                if (ms1 != null) ms1.style.display = 'none';
            }

            var ms = document.getElementById('menusub-' + indexMain);
            if (ms != null) {
                $('ul.menusub').hide();
                ms.style.display = 'block';
            }

            if (moduleID != CONFIG.MODULE_DEFAULT) {
                $('li.nolast').removeClass('active');

                var ele = document.getElementById(moduleID);
                if (ele != null && ele.parentElement != null) {
                    if (ele.parentElement.tagName == 'LI') {
                        $('li.haslast').removeClass('active');
                        $(ele.parentElement).addClass('active');
                    } else {
                        var liParent = ele.parentElement.parentElement;
                        if (liParent != null && liParent.tagName == 'LI') {
                            $('li.haslast').removeClass('active');
                            $(liParent).addClass('active');
                        }
                    }
                }
            }
        }

        var itm = document.getElementById(moduleID);
        if (itm != null)
            itm.className = 'nolast active';

        if (indexMain == 1) {
            $('#menu-main ul.menu-nav li:eq(0)').addClass('active');

            if (ma_menuData.length > 0 && ma_menuData[0]['menus'] != null &&
                ma_menuData[0]['menus'].length > 0 && ma_menuData[0]['menus'][0]['code'] != null) {
                //alert(2);

                //CONFIG.MODULE_DEFAULT = ma_menuData[0]['menus'][0]['code'];

                console.log('SET CONFIG.xxxx = ', ma_menuData[0]['menus'][0]['code']);
                if (document.location.hash == '#/md-blank') {
                    setTimeout(function () {
                        $(window).resize();
                        location.href = '/#/' + ma_menuData[0]['menus'][0]['code'];
                    }, 50);
                }
            }
        }
    });

    /* Bind the $locationChangeSuccess event on the rootScope, so that we don't need to bind in induvidual controllers. */
    $rootScope.$on('$locationChangeSuccess', function () {
        if ($rootScope.socketID == undefined || $rootScope.socketID == 'undefined') {
            $('.menu-last').hide();
            $rootScope.login = false;
            $rootScope.user = { user: { type: '' } };
            $rootScope.actualLocation = '';

            setTimeout(function () {
                if ($rootScope.socketID == undefined || $rootScope.socketID == 'undefined') {
                    setInterval(poll, interval);
                }
                else {
                    console.log("******************Ready");
                    jQuery('#box-module').hide();

                    var path = $location.path();
                    console.log('///BEGIN >>> $locationChangeSuccess: ', path);
                    if (path == undefined) {
                        setTimeout(function () {
                            location.href = '/#/' + CONFIG.MODULE_DEFAULT;
                        }, 1);
                        return;
                    }

                    if (angular.ISIE == false) {
                        if (location.href.toString().indexOf('/#/md-login') != -1 && $rootScope.login == true) {
                            setTimeout(function () {
                                location.href = '/#/' + CONFIG.MODULE_DEFAULT;
                            }, 100);
                            return;
                        }
                    }

                    var moduleID = path.substring(1, path.length);

                    if (moduleID != '' && moduleID != 'md-login') {
                        var msg_error = $rootScope.per_error;
                        if (msg_error != null && msg_error.toString().length > 0) {
                            alertShow({
                                type: 'error', content: msg_error, cancel: function () {
                                    $rootScope.per_error = '';
                                }
                            });
                        } else {
                            if (ma_menuAdmin != null && ma_menuAdmin.length > 0 && ma_menuAdmin.indexOf(moduleID) != -1) {
                                /* $rootScope.per_error = 'You are be not permission access.'; */

                                setTimeout(function () {
                                    location.href = '/#/' + CONFIG.MODULE_DEFAULT;
                                    jQuery('#box-module').show();
                                }, 100);
                                return;
                            }
                        }
                    }

                    //jQuery('#box-module').show();

                    var login = svCore.checkAuth();
                    if (login) {

                        if (path == '/md-login')
                            path = '/' + CONFIG.MODULE_DEFAULT;

                        $rootScope.login = true;
                        svCore.loadMenu();

                        /**********************/
                        //alert(path);

                        if (ma_menuData.length > 0 && ma_menuData[0]['menus'] != null &&
                            ma_menuData[0]['menus'].length > 0 && ma_menuData[0]['menus'][0]['code'] != null) {
                            //alert(2);

                            //CONFIG.MODULE_DEFAULT = ma_menuData[0]['menus'][0]['code'];

                            console.log('SET CONFIG.MODULE_DEFAULT = ', ma_menuData[0]['menus'][0]['code']);
                            setTimeout(function () {
                                $(window).resize();
                                $('#menu-main ul.menu-nav li:eq(3)').trigger("click");
                                setTimeout(function () {
                                    $(window).resize();
                                    location.href = '/#/' + ma_menuData[0]['menus'][0]['code'];
                                }, 7);
                            }, 1);
                            return;

                            //setTimeout(function () {
                            //    $(window).resize();
                            //    $('#menu-sub ul.menu-nav li:eq(1)').trigger("click");
                            //}, 150);
                            //location.href = '/#/' + ma_menuData[0]['menus'][0]['code'];
                        } else {
                            setTimeout(function () {
                                $(window).resize();
                                $('#menu-main ul.menu-nav li:eq(0)').addClass('active');
                            }, 150);
                            location.href = '/#/' + CONFIG.MODULE_DEFAULT;
                        }
                        return;

                    }

                    $rootScope.actualLocation = path;
                }
                console.log("*********************************");
                $(window).resize();
            }, 160);
        }
        else {
            jQuery('#box-module').hide();

            var path = $location.path();
            console.log('///BEGIN >>> $locationChangeSuccess: ', path);

            if (path == undefined) {
                setTimeout(function () {
                    location.href = '/#/' + CONFIG.MODULE_DEFAULT;
                }, 1);
                return;
            }

            if (angular.ISIE == false) {
                if (location.href.toString().indexOf('/#/md-login') != -1 && $rootScope.login == true) {
                    setTimeout(function () {
                        location.href = '/#/' + CONFIG.MODULE_DEFAULT;
                    }, 100);
                    return;
                }
            }

            $rootScope.login = false;
            $rootScope.user = { user: { type: '' } };

            var moduleID = path.substring(1, path.length);

            if (moduleID != '' && moduleID != 'md-login') {
                var msg_error = $rootScope.per_error;
                if (msg_error != null && msg_error.toString().length > 0) {
                    alertShow({
                        type: 'error', content: msg_error, cancel: function () {
                            $rootScope.per_error = '';
                        }
                    });
                } else {
                    if (ma_menuAdmin != null && ma_menuAdmin.length > 0 && ma_menuAdmin.indexOf(moduleID) != -1) {
                        /* $rootScope.per_error = 'You are be not permission access.'; */

                        setTimeout(function () {
                            location.href = '/#/' + CONFIG.MODULE_DEFAULT;
                            jQuery('#box-module').show();
                        }, 100);
                        return;
                    }
                }
            }

            //jQuery('#box-module').show();

            var login = svCore.checkAuth();
            if (login) {
                if (path == '/md-login')
                    path = '/' + CONFIG.MODULE_DEFAULT;

                $rootScope.login = true;
                svCore.loadMenu();
            }

            $rootScope.actualLocation = path;
        }
    });
})
.controller('noneCtrl', function () { });
