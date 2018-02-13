'use strict';

/* Services */

/* Demonstrate how to register services In this case it is a simple value service. */
angular.module('app.services', [])
.value('version', '0.1')
.factory('svCore', function ($window, $rootScope, $location, CONNECTION_ERROR) {
    var service = {
        guid: function () {
            return 'ID-' + 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            });
        },
        logoutTimeGet: function () {
            var time = {};
            var stime = service.postSynchronous('/admin/getLogoutTime');
            if (stime == null) { 
                alertShow({ type: 'error', content: CONNECTION_ERROR });
                return -1;
            }
            try {
                time = JSON.parse(stime);
            } catch (err) {
                alertShow({ type: 'error', content: 'Json content format is not correct' }); 
                return -1;
            }

            // logout_time: 60000
            var ti = convertNumber(time['logout_time']);
            if (ti == null) {
                alertShow({ type: 'error', content: 'Json content format is not correct' });
                return -1;
            } 
            return ti;
        },
        checkAuth: function () {
            $rootScope.login = false;
            try {
                var request = new XMLHttpRequest();
                request.open('POST', '/md-checkAuth?socket-id=' + $rootScope.socketID, false);
                request.send(null);

                request.onerror = function () {
                    //jQuery('#box-module').html('');
                    //alertShow({ type: 'error', content: CONNECTION_ERROR });
                    //$rootScope.$broadcast(CONFIG.BROADCAST_MESSAGE, CONNECTION_ERROR);
                    return false;
                }

                if (request.status == 500) {
                    //jQuery('#box-module').html('');
                    //alertShow({ type: 'error', content: CONNECTION_ERROR });
                    //$rootScope.$broadcast(CONFIG.BROADCAST_MESSAGE, CONNECTION_ERROR);
                    return false;
                }

                if (request.status === 200) {
                    // { "result": "auth" }
                    // { "result": "req_login" }
                    var val = request.responseText;

                    console.log('---------> hash: ', document.location.hash);
                    console.log('---------> checkAuth: ', val);

                    try {
                        var json = JSON.parse(val);
                        if (json['result'] == 'auth') {
                            $rootScope.login = true;
                            if (document.location.hash == '#/md-login') {
                                setTimeout(function () {
                                    location.href = '/#/' + CONFIG.MODULE_DEFAULT;
                                }, 10);
                            }
                            return true;
                        }
                        if (json['result'] == 'req_login') {
                            $rootScope.menuLoaded = false;
                            $rootScope.login = false; 
                            service.go_login();
                            return false;
                        }
                    } catch (err) {
                        return false;
                    }
                }
            } catch (er) {
                //jQuery('#box-module').html('');
                //alertShow({ type: 'error', content: CONNECTION_ERROR });
                //$rootScope.$broadcast(CONFIG.BROADCAST_MESSAGE, CONNECTION_ERROR);
                return false;
            }
            return false;
        },
        go_login: function () {
            $rootScope.menus = [];
            $rootScope.login = false;

            if (location.href.toString().indexOf('/#/md-login') == -1) {
                setTimeout(function () {
                    location.href = '/#/md-login';
                }, 1);
            }
        },
        logout: function () {
            service.go_login();
        },
        req_login: function (msg) {
            if (msg != null && msg['result'] == 'req_login') {
                service.logout();
                return true;
            }
            return false;
        },
        per_error: function (msg) {
            //{ "result": "per_error", "msg": "You do not have permission to edit any user information" }
            if (msg != null && msg['result'] == 'per_error') {
                var text = msg['msg'];
                $rootScope.per_error = text;

                setTimeout(function () {
                    location.href = '/#/' + CONFIG.MODULE_DEFAULT;
                    jQuery('#box-module').show();
                }, 100);

                return true;
            }
            return false;
        },
        loadMenu: function () { 

            if ($rootScope.login == true) {
                ma_menuAdmin = new Array();
                var type = cooGet('type');

                var arrayMenu = [];

                for (var k = 0; k < ma_menuData.length; k++) {
                    var mm = ma_menuData[k];
                     
                    if (mm.auth == 'Admin' && type != 'Admin') {
                        var mis = mm['menus'];
                        if (mis != null && mis.length > 0) {
                            for (var ki = 0; ki < mis.length; ki++) {
                                var cii = mis[ki]['code'];
                                if (cii != null && cii.toString().length > 0)
                                    if (ma_menuAdmin.indexOf(cii) == -1)
                                        ma_menuAdmin.push(cii);
                            }
                        }
                    }
                    else {
                        var msub = mm['menus'];
                        if (msub != null && msub.length > 0) {
                            for (var ki = 0; ki < msub.length; ki++) {
                                var ms = msub[ki];
                                var codeSub = ms['code'];
                                if (codeSub == null) {
                                    var mlast = ms['menus'];
                                    if (mlast != null && mlast.length > 0) {
                                        for (var kii = 0; kii < mlast.length; kii++) {
                                            var ml = mlast[kii];
                                            var codeLast = ml['code'];
                                            sessionStorage[codeLast] = mm['id'];
                                        }
                                    }
                                } else {
                                    sessionStorage[codeSub] = mm['id'];
                                }
                            }
                        }
                        arrayMenu.push(mm);
                    }
                }

                var MenuCounter = parseInt(document.getElementById('MenuCounter').value);
                //console.log(MenuCounter, arrayMenu.length);
                if (MenuCounter == 0)
                    document.getElementById('MenuCounter').value = arrayMenu.length;
                else if (MenuCounter != arrayMenu.length) {
                    //console.log('go module default');
                    var moduleID = document.location.hash;
                    if (moduleID.length > 2) moduleID = moduleID.substring(2, moduleID.length);
                    if (ma_menuAdmin != null && ma_menuAdmin.length > 0 && ma_menuAdmin.indexOf(moduleID) != -1) {
                        setTimeout(function () {
                            location.href = '/#/' + CONFIG.MODULE_DEFAULT;
                            jQuery('#box-module').show();
                        }, 100);
                        return;
                    }
                }

                //console.log('arrayMenu = ', arrayMenu);
                //console.log('ma_menuAdmin = ', ma_menuAdmin);

                //if ($rootScope.menuLoaded == null || $rootScope.menuLoaded == false) {
                //    console.log('///MENU BINDING ....');
                    $rootScope.menus = arrayMenu;
                //    $rootScope.menuLoaded = true;
                //}
            }
        },
        getModuleID: function () {
            var a = document.location.hash.split('/');
            var moduleID = a[a.length - 1].trim();
            if (moduleID == '') moduleID = $rootScope.moduleID;
            if (moduleID == '' || moduleID == null) moduleID = CONFIG.MODULE_DEFAULT;

            return moduleID;
        },
        reloadModule: function () {
            var url = "/#/" + service.getModuleID();
            $location.path(url);
        },
        checkLink: function (url) {
            var request = new XMLHttpRequest();
            request.open('GET', url, false);
            request.send(null);

            if (request.status === 200) {
                return true;
            }
            return false;
        },
        getSynchronous: function (url) {
            try {
                var request = new XMLHttpRequest();
                request.open('GET', url, false);
                request.overrideMimeType('text/plain; charset=UTF-8');
                request.send(null);

                request.onerror = function () {
                    return null;
                }

                if (request.status === 200) {
                    return request.responseText;
                }
            } catch (er) {
                return null;
            }
            return null;
        },
        postSynchronous: function (url, data) {
            try {
                var request = new XMLHttpRequest();
                request.open('POST', url, false);
                request.setRequestHeader("Content-type", "application/json");
                request.send(data);

                request.onerror = function () {
                    return null;
                }

                if (request.status === 200) {
                    return request.responseText;
                }
            } catch (er) {
                return null;
            }
            return null;
        },
        moduleClear: function () { $('#module').html(''); },
        moduleCurrentExecute: function (functionName, paramenter) {
            //var mdheaderCtrlViewModel = $rootScope.$new();
            //$controller('mdheaderCtrl', { $scope: mdheaderCtrlViewModel });
            //mdheaderCtrlViewModel.updateNotificationState(state);
        },
        popupClose: function (scope) {
            var popupID = scope.popupID;
            if (popupID != null) {
                document.getElementById(popupID).remove();
            }
        },
        popupShow: function (scope, moduleID, data) {
            //var moduleID = 'article-view';

            var parent = scope.$parent;
            if (data != null) {
                for (var key in data) {
                    parent[key] = data[key];
                }
            }

            /** create id modal */
            var id = 'popup-' + 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            });
            parent.popupID = id;

            var pop = document.createElement('div');
            pop.id = id;
            var element = document.createElement('div');
            element.className = 'popup';
            pop.appendChild(element);
            $('body').append(pop);
            //var element = document.getElementById('popup');

            var controllerID = moduleID.split('-').join('').split('.').join('') + 'Ctrl';

            element.setAttribute('ng-controller', controllerID);

            console.log('goView moduleID = ' + moduleID);
            console.log('goView controllerID = ' + controllerID);

            var path = '/Modules/' + moduleID + '/';
            scope.PATH = path;
            scope.moduleID = moduleID;

            var js = service.getSynchronous(path + 'controller.js');
            if (js == null) {
                js = '';
                element.getAttribute('ng-controller', 'noneCtrl');
                alertShow({ type: 'error', content: 'Missing controller: ' + controllerID });
            }

            var script = document.createElement('script');
            script.setAttribute("type", "text/javascript");
            script.innerHTML = js;
            element.parentElement.appendChild(script);

            //newElement = $compile("<div my-directive='n'></div>")(scope)
            //element.parent().append(newElement)

            var css = service.getSynchronous(path + 'css.css');
            if (css == null) css = '';
            var style = document.createElement('style');
            style.setAttribute("type", "text/css");
            style.innerHTML = css;
            element.parentElement.appendChild(style);

            var temp = service.getSynchronous(path + 'temp.htm');
            if (temp == null) temp = '';
            element.innerHTML = temp;

            $compile(element)(parent);

            jQuery("#popup").show();
        }
    };
    return service;
})
.factory('svMenu', function ($http) {
    var jsonTransform = function (data, headers) {
        return angular.fromJson(data);
    };
    var service = {
        getData: function () {
            return $http.get('/Modules/md-menu/data.json', { transformResponse: jsonTransform });
        }
    };
    return service;
})
.factory('svControl', function ($http) {
    var service = {
        groupRadio: function (item, scope) {
            if (item == undefined || item == null) return '';
            var htm = '';
            var val = item['item'], list = item['list'];

            for (var i = 0; i < list.length; i++) {
                var it = list[i];
                if (val == it['id'])
                    htm += '<div class="radio"><label><input checked type="radio" name="radio" data-value="' + it['id'] + '"><span class="label-title">' + it['text'] + '</span></label></div>';
                else
                    htm += '<div class="radio"><label><input type="radio" name="radio" data-value="' + it['id'] + '"><span class="label-title">' + it['text'] + '</span></label></div>';
            }

            return htm;
        },
        dropDownMenu: function (item, scope) {
            if (item == undefined || item == null) return '';
            var htm = '';
            var val = item['item'], list = item['list'];

            for (var i = 0; i < list.length; i++) {
                var it = list[i];
                if (val == it)
                    htm += '<li class="active"><a href="javascript:void(0);" data-value="' + it + '">' + it + '</a></li>';
                else
                    htm += '<li><a href="javascript:void(0);" data-value="' + it + '">' + it + '</a></li>';
            }

            return htm;
        },
        textBox: function (item, scope) {
            if (item == undefined || item == null) return '';
            var readonly = '';
            if (item['disabled'] == true || item['disabled'] == 'true') readonly = ' readonly="readonly" ';

            var model = item['model'];
            if (model == null || model == undefined) model = '';
            else model = ' ng-model = "' + model + '" ';

            var htm =
                '<input ' + model + ' class="form-control" type="text" data-control="text" data-title="' + item['title'] + '" data-category="' + item['category'] + '" ' +
                'data-item="' + item['item'] + '" ' + readonly + ' data-validate="' + item['validate'] + '" data-type="' + item['type'] + '" ' +
                'id="' + item['id'] + '" data-active="' + item['active'] + '" value="' + item['value'] + '">';
            return htm;
        },
        checkBox: function (item, scope) {
            if (item == undefined || item == null) return '';
            var check = '';
            if (item['value'] == true || item['value'] == 'true') check = ' checked ';

            var attrs = item['attrs'];
            if (attrs == null) attrs = '';

            var htm =
                '<input ' + attrs + ' type="checkbox" data-category="' + item['category'] + '" data-item="' + item['item'] + '" ' + check +
                'id="' + item['id'] + '" data-active="' + item['active'] + '">' +
                '<label for="' + item['id'] + '" class="label-title">' + item['label'] + '</label>';
            return htm;
        },
        switchToggle: function (item, scope) {
            if (item == undefined || item == null) return '';
            var check = '';
            if (item['value'] == true || item['value'] == 'true') check = ' checked ';
            var htm =
                '<input type="checkbox" data-control="' + item['control'] + '" data-category="' + item['category'] + '" data-item="' + item['item'] + '" ' + check +
                'id="' + item['id'] + '" data-active="' + item['active'] + '">' +
                '<label for="' + item['id'] + '"></label>';
            return htm;
        },
    };
    return service;
})
.factory('api', function ($http) {
    var jsonTransform = function (data, headers) {
        return angular.fromJson(data);
    };
    var service = {
        user: function () {
            return $http.get('/user', { transformResponse: jsonTransform });
        },
        about: function () {
            return $http.get('/about', { transformResponse: jsonTransform });
        },
        load: function (id) {
            return $http.get('/svc', {
                transformResponse: jsonTransform,
                params: {
                    'file_id': id
                }
            });
        },
        save: function (fileInfo, newRevision) {

            return $http({
                url: '/svc',
                method: fileInfo.resource_id ? 'PUT' : 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                params: {
                    'newRevision': newRevision
                },
                transformResponse: jsonTransform,
                data: JSON.stringify(fileInfo)
            });
        }
    };
    return service;
})
.factory('svMessage', function () {
    var messages = [];
    var message = {};
    return {
        message: message,
        messages: messages,
        push: function (msg) {
            message = msg;
            if (messages.length == CONFIG.MAX_BUFFER_MESSAGE) {
                messages = [];
                console.log('Clear CONFIG.MAX_BUFFER_MESSAGE:', CONFIG.MAX_BUFFER_MESSAGE);
            }
            messages.push(msg);
        }
    };
})