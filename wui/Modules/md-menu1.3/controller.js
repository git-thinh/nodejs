function mdmenu13Ctrl($rootScope, $scope, $http, $filter, $timeout, $location, svCore, CONNECTION_ERROR) { 
    jQuery('#box-module').hide();

    //data_new['SettingCategory1']['Enable'] = 
    //data_new['SettingCategory1']['Setting']['Setting1'] = 
    //data_new['SettingCategory1']['Setting']['Setting2'] = 
    //data_new['SettingCategory1']['Setting']['Setting3'] = 
    //data_new['SettingCategory2']['Enable'] = 
    //data_new['SettingCategory2']['Setting1'] = 
    //data_new['SettingCategory3']['Setting1'] = 
    //data_new['SettingCategory3']['Setting2'] = 
    //data_new['SettingCategory3']['Setting3'] = 
    //data_new['SettingCategory4']['Setting1'] = 

    // { "result": "error", "msg": "Login failed" }
    // { "result": "success", "data": "'+ data +'" }'

    aready(function () {
        jQuery('#box-module').css({ 'height': 'calc(100vh - 46px)' });
        jQuery('#box-module').css({ 'overflow': 'auto' });
        jQuery('#view-module').css({ 'height': '2000px' });
        //jQuery('#box-module').show();
    });

    $scope.settingCategoryAccordion = function (index, event) {
        var ele = event.target;
        //console.log('settingCategoryAccordion ' + index, ele);

        //ele = document.getElementById('');
        if (ele.hasAttribute('aria-expanded') == false)
            ele = ele.parentElement;

        var it = jQuery(ele);
        var close = ele.getAttribute('aria-expanded');
        if (close == 'false' || close == false) {
            /** close -> open */
            it.children('.glyphicon').removeClass('glyphicon-chevron-down');
            it.children('.glyphicon').addClass('glyphicon-chevron-up');


            //e.preventDefault();

            //var boxBody = it.attr('aria-controls');
            //var index = jQuery('#' + boxBody).closest('.box-item').attr('role');
            //index = convertNumber(index);
            //if (index != null) {
            jQuery('#box-module').scrollTop(0);
            var top = jQuery('#box-scroll-' + index.toString()).offset().top - 45;
            jQuery('#box-module').scrollTop(top);
            //console.log(index, top);
        } else {
            /** open -> close */
            it.children('.glyphicon').removeClass('glyphicon-chevron-up');
            it.children('.glyphicon').addClass('glyphicon-chevron-down');
        }
    };

    $scope.logDataNew = function () {
        console.clear();
        console.log('Data', data_new);
    };


    //#region [=== VARIABLES ===]

    var data = {};
    var data_new = {};
    var label = {};

    var settingcategory1_enable = '';
    var settingname1_setting1 = '';
    var settingname1_setting2 = '';
    var settingname1_setting3 = '';
    var settingcategory2_enable = '';
    var settingcategory3_setting1 = '';
    var settingcategory4_setting1 = '';

    //#endregion

    //#region [=== BIND DATA FROM SERVICE API ==] 

    var urlData = CONFIG.URL_API + 'md-menu1.3/getData';
    var urlLabel = CONFIG.URL_API + 'md-menu1.3/getLabel';

    var sLabel = svCore.getSynchronous(urlLabel);
    var sData = svCore.getSynchronous(urlData);

    if (sLabel == null || sData == null) {
        jQuery('#box-module').hide();
        alertShow({ type: 'error', content: CONNECTION_ERROR });
        return;
    }

    if (sLabel == null) sLabel = '{}';
    if (sData == null) sData = '{}';

    //jQuery('#box-module').show();
    try {
        data = JSON.parse(sData);
        data_new = JSON.parse(sData);
        label = JSON.parse(sLabel);
    } catch (err) {
        //console.log('Error json', sData);
        //console.log('Error json', sLabel);
        jQuery('#box-module').hide();
        alertShow({ type: 'error', content: 'Unknow exception is occurred' });
        return;
    }

    //console.log('data 1.3 = ', sData);
    //console.log('label 1.3 = ', sLabel);
    //if (label['result'] == 'req_login' || data['result'] == 'req_login') {
    //    svCore.login();
    //    return;
    //}

    if (svCore.req_login(label)) return;
    if (svCore.req_login(data)) return;


    //Check content from data
    if (data['result'] != 'success' || data['data'] == null) {
        var msg = 'Unknow exception is occurred';

        if (data['result'] == 'error' && data['msg'] != null) {
            msg = data['msg'];
        }

        jQuery('#box-module').hide();
        alertShow({ type: 'error', content: msg });
        return;
    }

    //Check content from label
    if (label['result'] != 'success' || label['data'] == null) {
        var msg = 'Unknow exception is occurred';

        if (label['result'] == 'error' && label['msg'] != null) {
            msg = data['msg'];
        }

        jQuery('#box-module').hide();
        alertShow({ type: 'error', content: msg });
        return;
    }

    data = data['data'];
    data_new = data_new['data'];
    label = label['data'];

    //console.log('data = ', data);
    //console.log('lable = ', label);

    try {
        settingcategory1_enable = data['SettingCategory1']['Enable'];
        settingname1_setting1 = data['SettingCategory1']['Setting']['Setting1'];
        settingname1_setting2 = data['SettingCategory1']['Setting']['Setting2'];
        settingname1_setting3 = data['SettingCategory1']['Setting']['Setting3'];
        settingcategory2_enable = data['SettingCategory2']['Enable'];
        settingcategory3_setting1 = data['SettingCategory3']['Setting1'];
        settingcategory4_setting1 = data['SettingCategory4']['Setting1'];

        if (settingcategory1_enable != "true") settingcategory1_enable = "false";
        if (settingcategory2_enable != "true") settingcategory2_enable = "false";
    } catch (e1) {
        alertShow({ type: 'error', content: 'Cannot find some key, ' + e1.toString() });
        return;
    }

    $scope.label = label;

    //#endregion

    //#region [=== CHECK DATA STATE TO CHANGE CATEGORY COLOR ===] 

    $scope.checkDataStateChangeCategoryColorByField = function (index, id, value) {
        var flagChanged = false;
        var val = null;
        var a = id.split('.');
        var vtem = null;
        for (var i = 0; i < a.length; i++) {
            var key = a[i];
            if (a.length == 1) {
                val = data[key];
            } else {
                if (i == 0) {
                    vtem = data[key];
                } else {
                    if (i == a.length - 1)
                        val = vtem[key];
                    else
                        vtem = vtem[key];
                }
            }
        }

        //console.log(id + ' = ' + val + ' || ' + value);
        if (val.toString() != value.toString()) {
            $catTitle = jQuery('.settingcategory' + index + ' .label-title');
            /* Field changed data state */
            if ($catTitle.hasClass('category-active-color') == false)
                $catTitle.addClass('category-active-color');
        } else
            $scope.checkDataStateChangeCategoryColorByBox(index);
    };

    $scope.checkDataStateChangeCategoryColorByBox = function (index) {
        //console.log('checkDataStateChangeCategoryColorByBox = ', index);
        /* Check all fields changed data state */
        $catTitle = jQuery('.settingcategory' + index + ' .label-title');
        var changed = false;

        switch (index) {
            case 1:
                if (data['SettingCategory1']['Enable'] == data_new['SettingCategory1']['Enable']) {
                    if (data['SettingCategory1']['Setting']['Setting1'] == data_new['SettingCategory1']['Setting']['Setting1']) {
                        if (data['SettingCategory1']['Setting']['Setting2'] == data_new['SettingCategory1']['Setting']['Setting2']) {
                            if (data['SettingCategory1']['Setting']['Setting3'] != data_new['SettingCategory1']['Setting']['Setting3'])
                                changed = true;
                        } else changed = true;
                    } else changed = true;
                } else changed = true;
                break;
            case 2:
                if (data['SettingCategory2']['Enable'] == data_new['SettingCategory2']['Enable']) {
                    if (data['SettingCategory2']['Setting1'] != data_new['SettingCategory2']['Setting1']) {
                        changed = true;
                    }
                } else changed = true;
                break;
            case 3:
                if (data['SettingCategory3']['Setting1'] == data_new['SettingCategory3']['Setting1']) {
                    if (data['SettingCategory3']['Setting2'] == data_new['SettingCategory3']['Setting2']) {
                        if (data['SettingCategory3']['Setting3'] != data_new['SettingCategory3']['Setting3'])
                            changed = true;
                    } else changed = true;
                } else changed = true;
                break;
            case 4:
                if (data['SettingCategory4']['Setting1'] != data_new['SettingCategory4']['Setting1'])
                    changed = true;
                break;
        }

        if (changed) {
            if ($catTitle.hasClass('category-active-color') == false)
                $catTitle.addClass('category-active-color');
        } else {
            if ($catTitle.hasClass('category-active-color'))
                $catTitle.removeClass('category-active-color');
        }
    };

    //#endregion

    //#region [=== EVENT CONTROLS ===] 

    $scope.category1_enable_checkbox_Click = function ($event) {
        var it = $event.target;
        var id = it.getAttribute('for');
        var nodeCheck = document.getElementById(id);
        var val = nodeCheck.getAttribute('checked');
        if (val == 'checked') val = true;
        else val = false;

        if (val) {
            nodeCheck.removeAttribute('checked');
            val = false;
        } else {
            nodeCheck.setAttribute('checked', 'checked');
            val = true;
        }

        $scope.category1_setting_hide = val ? false : true;

        //console.log(id, val);
        data_new['SettingCategory1']['Enable'] = val.toString();
        $scope.logDataNew();
        $scope.checkDataStateChangeCategoryColorByField(1, 'SettingCategory1.Enable', val.toString());
    };

    $scope.settingcategory1_setting_setting123_Click = function ($event) {
        var it = $event.target;
        var id = it.getAttribute('for');
        var nodeCheck = document.getElementById(id);
        var val = nodeCheck.getAttribute('checked');
        if (val == 'checked') val = true;
        else val = false;

        if (val) {
            nodeCheck.removeAttribute('checked');
            val = false;
        } else {
            nodeCheck.setAttribute('checked', 'checked');
            val = true;
        }

        var sval = val ? 'On' : 'Off';
        switch (id) {
            case 'SettingCategory1.Setting.Setting1':
                data_new['SettingCategory1']['Setting']['Setting1'] = sval;
                break;
            case 'SettingCategory1.Setting.Setting2':
                data_new['SettingCategory1']['Setting']['Setting2'] = sval;
                break;
            case 'SettingCategory1.Setting.Setting3':
                data_new['SettingCategory1']['Setting']['Setting3'] = sval;
                break;
        }
        $scope.checkDataStateChangeCategoryColorByField(1, id, sval);

        //console.log(id, val ? 'On' : 'Off');
        $scope.logDataNew();
    };

    $scope.category2_enable_checkbox_Click = function ($event) {
        var it = $event.target;
        var id = it.getAttribute('for');
        var nodeCheck = document.getElementById(id);
        var val = nodeCheck.getAttribute('checked');
        if (val == 'checked') val = true;
        else val = false;

        if (val) {
            nodeCheck.removeAttribute('checked');
            val = false;
        } else {
            nodeCheck.setAttribute('checked', 'checked');
            val = true;
        }

        $scope.category2_setting_hide = val ? false : true;

        data_new['SettingCategory2']['Enable'] = val.toString();
        $scope.logDataNew();
        //console.log(id, val);
        $scope.checkDataStateChangeCategoryColorByField(2, 'SettingCategory2.Enable', val.toString());
    };

    $scope.settingcategory4_setting1_Change = function (val) {
        console.log('SettingCategory4.Setting1', val);
        data_new['SettingCategory4']['Setting1'] = val;
        $scope.logDataNew();
        $scope.checkDataStateChangeCategoryColorByField(4, 'SettingCategory4.Setting1', val.toString());
    };

    //#endregion

    //#region [=== SETTING CATEGORY 1 ===]

    var settingcategory1_enable_attrs = '';
    if (settingcategory1_enable == 'true' || settingcategory1_enable == true) {
        settingcategory1_enable_attrs = ' checked="checked" ';
        $scope.category1_setting_hide = false;
    } else {
        $scope.category1_setting_hide = true;
    }

    $scope.settingcategory1_enable_checkbox = {
        id: "SettingCategory1.Enable",
        attrs: settingcategory1_enable_attrs,
        label: label.Res_0103_01_01_01,
        event: 'category1_enable_checkbox_Click($event)',
    };

    $scope.settingcategory1_setting_setting1_switch = {
        id: "SettingCategory1.Setting.Setting1",
        attrs: settingname1_setting1 == 'On' ? ' checked="checked" ' : '',
        event: 'settingcategory1_setting_setting123_Click($event)',
    };
    $scope.settingcategory1_setting_setting2_switch = {
        id: "SettingCategory1.Setting.Setting2",
        attrs: settingname1_setting2 == 'On' ? ' checked="checked" ' : '',
        event: 'settingcategory1_setting_setting123_Click($event)',
    };
    $scope.settingcategory1_setting_setting3_switch = {
        id: "SettingCategory1.Setting.Setting3",
        attrs: settingname1_setting3 == 'On' ? ' checked="checked" ' : '',
        event: 'settingcategory1_setting_setting123_Click($event)',
    };


    //#endregion

    //#region [=== SETTING CATEGORY 2 ===]

    var settingcategory2_enable_attrs = '';
    if (settingcategory2_enable == 'true' || settingcategory2_enable == true) {
        settingcategory2_enable_attrs = ' checked="checked" ';
        $scope.category2_setting_hide = false;
    } else {
        $scope.category2_setting_hide = true;
    }

    $scope.settingcategory2_enable_checkbox = {
        id: "SettingCategory2.Enable",
        attrs: settingcategory2_enable_attrs,
        label: label.Res_0103_01_02_01,
        event: 'category2_enable_checkbox_Click($event)',
    };

    var settingcategory2_setting1_attrs = ' on-keyup="settingcategory2_setting1_keyup" class="form-control" value="' + data['SettingCategory2']['Setting1'] + '" ';
    $scope.settingcategory2_setting1_textbox = {
        id: "SettingCategory2.Setting1",
        attrs: settingcategory2_setting1_attrs
    };

    // Init a timeout variable to be used below
    var settingcategory2_setting1_timer = null;
    $scope.settingcategory2_setting1_keyup = function (event) {
        //console.log(event);
        // Clear the timeout if it has already been set.
        // This will prevent the previous task from executing
        // if it has been less than <MILLISECONDS>
        // clearTimeout(timeout);
        $timeout.cancel(settingcategory2_setting1_timer); //here it will clear the timeout

        var key = event.key;
        var val = event.target.value;
        data_new['SettingCategory2']['Setting1'] = val;

        // Make a new timeout set to go off in 800ms
        settingcategory2_setting1_timer = $timeout(function () {
            $scope.checkDataStateChangeCategoryColorByField(2, 'SettingCategory2.Setting1', val);
        }, 500);
    };

    //#endregion

    //#region [=== SETTING CATEGORY 3 ===]

    $scope.settingcategory3_setting1 = settingcategory3_setting1;
    $scope.settingcategory3_setting1_items = ['List Item 1', 'List Item 2', 'List Item 3'];

    $scope.settingcategory3_setting1_isSelectMain = function (val) {
        return val === settingcategory3_setting1;
    };

    $scope.settingcategory3_setting1_Click = function (val) {
        settingcategory3_setting1 = val;
        $scope.settingcategory3_setting1 = val;
        data_new['SettingCategory3']['Setting1'] = val;
        //console.log('SettingCategory3.Setting1', val);
        $scope.checkDataStateChangeCategoryColorByField(3, 'SettingCategory3.Setting1', val.toString());
    };

    /*///////////////////////////*/

    var settingcategory3_setting2_attrs = ' on-keyup="settingcategory3_setting2_keyup" class="form-control" value="' + data['SettingCategory3']['Setting2'] + '" ';
    $scope.settingcategory3_setting2_textbox = {
        id: "SettingCategory3.Setting2",
        attrs: settingcategory3_setting2_attrs
    };

    // Init a timeout variable to be used below
    var settingcategory3_setting2_timer = null;
    $scope.settingcategory3_setting2_keyup = function (event) {
        //console.log(event);
        // Clear the timeout if it has already been set.
        // This will prevent the previous task from executing
        // if it has been less than <MILLISECONDS>
        // clearTimeout(timeout);
        $timeout.cancel(settingcategory3_setting2_timer); //here it will clear the timeout

        var key = event.key;
        var val = event.target.value;
        data_new['SettingCategory3']['Setting2'] = val;

        // Make a new timeout set to go off in 800ms
        settingcategory3_setting2_timer = $timeout(function () {
            $scope.checkDataStateChangeCategoryColorByField(3, 'SettingCategory3.Setting2', val);
        }, 500);
    };

    var settingcategory3_setting3_attrs = ' on-keyup="settingcategory3_setting3_keyup" class="form-control" value="' + data['SettingCategory3']['Setting3'] + '" ';
    $scope.settingcategory3_setting3_textbox = {
        id: "SettingCategory3.Setting3",
        attrs: settingcategory3_setting3_attrs
    };

    // Init a timeout variable to be used below
    var settingcategory3_setting3_timer = null;
    $scope.settingcategory3_setting3_keyup = function (event) {
        //console.log(event);
        // Clear the timeout if it has already been set.
        // This will prevent the previous task from executing
        // if it has been less than <MILLISECONDS>
        // clearTimeout(timeout);
        $timeout.cancel(settingcategory3_setting3_timer); //here it will clear the timeout

        var key = event.key;
        var val = event.target.value;
        data_new['SettingCategory3']['Setting3'] = val;

        // Make a new timeout set to go off in 800ms
        settingcategory3_setting3_timer = $timeout(function () {
            $scope.checkDataStateChangeCategoryColorByField(3, 'SettingCategory3.Setting3', val);
        }, 500);
    };

    //#endregion

    //#region [=== SETTING CATEGORY 4 ===]

    $scope.settingcategory4_setting1 = settingcategory4_setting1;

    //#endregion

    //#region [=== EVENT SUBMIT ===] 

    $scope.formSubmit = function () {
        svCore.checkAuth();

        var dataPost = JSON.stringify(data_new);
        console.log('dataPost = ', dataPost);

        showInfiniteIndicator();

        var url = CONFIG.URL_API + 'md-menu1.3/saveSettingData?socket-id=' + $rootScope.socketID;
        //var url = CONFIG.URL_API + 'md-menu1.3/saveSettingData?';
        console.log(url);
        $http({
            method: 'POST',
            url: url,
            data: data_new,
            headers: {
                'socket-id': $rootScope.socketID
            }
        })
            .success(function (val, status, headers, config) {
                if (svCore.req_login(val)) return;

                if (val['result'] == 'success') {
                    $timeout(function () {
                        closeInfiniteIndicator();
                        alertShow({ type: 'complete', content: 'Completed', ok: function () { $timeout(function () { svCore.reloadModule(); }, 300); } });
                    }, 1000);
                } else {
                    closeInfiniteIndicator();

                    var msg = 'Unknow exception is occurred';

                    if (val['result'] == 'error' && val['msg'] != null) {
                        msg = val['msg'];
                    }

                    alertShow({
                        type: 'error', content: msg, cancel: function () { }
                    });
                }
            })
            .error(function (data, status, headers, config) {
                closeInfiniteIndicator();
                alertShow({ type: 'error', content: CONNECTION_ERROR });
            });
    }

    $scope.formCancel = function () {
        setTimeout(function () {
            $('.label-title').removeClass('category-active-color');
        }, 500);
        svCore.reloadModule();
    }

    //#endregion
}