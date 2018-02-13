function checkAuthRefresh($rootScope) {
    try {
        var request = new XMLHttpRequest();
        request.open('POST', '/md-checkAuth?socket-id=' + $rootScope.socketID, true);
        request.send(null);
    } catch (err) { }
}

function mdmenuCtrl($rootScope, $scope, $timeout, svCore) {

    $scope.isSelectMain = function (index, code, title) {
        index = index.toString();
        var mid = svCore.getModuleID();
        var ok = code == mid;
        if (ok == false) {
            var indexMain = sessionStorage[mid];
            //console.log(indexMain, index);
            ok = indexMain == index;
        }

        //if (ok) $scope.menuMainSelectedText = title;

        return ok;
    }

    $scope.isSelectSub = function (code, mainTitle) {
        var mid = svCore.getModuleID();
        var ok = code == mid;

        //if (ok) $scope.menuMainSelectedText = mainTitle;

        return ok;
    }

    $scope.menuLastOpen = function (event, code) {
        $rootScope.mainBack = false;

        jQuery('#view-module').show();
        $('li.haslast').removeClass('active');
        $('.menu-last li').removeClass('active');
        $(event.target).addClass('active');

        //$(event.target).closest('li').addClass('active');
        console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>');
        event.target.parentElement.parentElement.className = 'ng-scope haslast active';


        if (code != null && code != undefined) {
            setTimeout(function () {
                document.location.href = '/#/' + code;
            }, 100);
        }
    }

    $scope.menuSubOpen = function (event, id, code, items) {

        jQuery('#view-module').show();
        var ele = event.target;
        if (event.target.tagName == 'I') ele = event.target.parentElement;
        //console.log(ele);

        var link = $(ele);
        var li = link.closest('li');
        var icon = link.find('i');

        $('#menu-sub li').removeClass('active');
        li.addClass('active');

        $rootScope.mainBack = false;
        if (code != null && code != undefined) {
            /* Load module */
            $('li.haslast').removeClass('active');
            $('.menu-last li').removeClass('active');

            $rootScope.menuChildLast = '';
            document.location.href = '/#/' + code;
        } else {
            var aml = $rootScope.menuChildLastArray;
            var index = aml.indexOf(id);

            //console.log('  var index = aml.indexOf(id) === ', index);
            //console.log('  var index = aml.indexOf(id) === ', aml);

            if (index == -1) {
                /* show menu last */
                $rootScope.menuChildLast = id;
                aml.push(id);

                document.getElementById('menulast-' + id).className = 'menu-last';

                /* open default first item of third menu */
                if (items != null && items.length > 0) {
                    var codeLast = items[0]['code'];
                    console.log('codeLast = ', codeLast);
                    if (codeLast != null) {
                        //document.location.href = '/#/' + codeLast;
                        setTimeout(function () {
                            var elast = document.getElementById(codeLast);
                            if (elast != null) elast.click();
                        }, 5);
                    }
                }
            } else {
                /* hide menu last */
                document.getElementById('menulast-' + id).className = 'hide';

                aml.splice(index, 1);
                if (aml.length == 0)
                    $rootScope.menuChildLast = '';
                else
                    $rootScope.menuChildLast = aml[0];

                /* content view is blank */
                jQuery('#view-module').hide();

                checkAuthRefresh($rootScope);
            }

            $rootScope.menuChildLastArray = aml;

            icon.toggleClass('glyphicon-triangle-right');
            icon.toggleClass('glyphicon-triangle-bottom');
        }
    }

    $scope.menuMainClick = function (event, index, code, title, items) {
        if (index == 1) {

            /* clear state third menu. if third menu is opened -> close same default */
            $('#menusub-1 li ul').attr('class', 'hide');
            $('#menusub-1 li.haslast a i').attr('class', 'glyphicon glyphicon-triangle-right');
            $rootScope.menuChildLastArray = [];

            /******************************************/

            if (ma_menuData.length > 0 && ma_menuData[0]['menus'] != null) {
                if (ma_menuData[0]['menus'].length > 0 && ma_menuData[0]['menus'][0]['code'] == null) {
                    $('.menu-last li').removeClass('active');
                    $('li.nolast').removeClass('active');
                    $('li.haslast').removeClass('active');
                }
            }
        }

        $scope.selectMain = title;
        $rootScope.mainBack = false;

        if (items != null && items.length > 0) {
            //$scope.menuMainSelectedText = title;
            $rootScope.menuChild = index;
            var codeFirst = items[0]['code'];

            console.log('INDEX of menuMainClick = ' + codeFirst + '  ', index);
            $('#menu-main li').removeClass('active');
            setTimeout(function () {
                console.log(event);
                var it = event.target;
                if (it.tagName == 'A') it = it.parentElement;
                $(it).addClass('active');
                document.getElementById(codeFirst).className = 'nolast active';
            }, 100);

            if (ma_menuData.length > 0 && ma_menuData[0]['menus'] != null &&
                ma_menuData[0]['menus'].length > 0 && ma_menuData[0]['menus'][0]['code'] != null) {
                //alert('asdasd');
                $('li.haslast').removeClass('active');
            } else {
                $('#mn-main-' + index).addClass('active');
            }

            console.log('INDEX of menuMainClick codeFirst = ', codeFirst);
            if (codeFirst != null) {
                jQuery('#view-module').show();
                /* load module by code of item first */
                //setTimeout(function () { $('#menusub-' + index).show(); }, 1);

                setTimeout(function () {
                    $('#' + codeFirst).addClass('active');
                }, 150);

                document.location.href = '/#/' + codeFirst;
            } else {
                /* item first of menu sub has childs (level 3) */
                //svCore.moduleClear();
                jQuery('#view-module').hide();
                checkAuthRefresh($rootScope);
            }
        } else {
            /* load module by code */
            jQuery('#view-module').show();
            $('#menu-sub ul.menu-nav').hide();
            $rootScope.menuChild = '';
            var mcl = $rootScope.menuChildLastArray;
            if (mcl.length > 0)
                $rootScope.menuChildLast = mcl[0];

            console.log(' menuChildLastArray = ', mcl);

            document.location.href = '/#/' + code;
        }
    }

    $scope.menuMainBack = function () {
        $rootScope.mainBack = true;

        checkAuthRefresh($rootScope);
    }

    aready(function () {
        var moduleID = svCore.getModuleID();
        if (moduleID == CONFIG.MODULE_DEFAULT) {
            console.log('SET INDEX DEFAULT = 1');
            $rootScope.menuChild = 1;
        }
    });
}