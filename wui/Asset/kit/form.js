/*================================================================*/
/*=== FORM: SUBMIT, CANCEL ===*/
/*================================================================*/

/** Active the color of category title if change data field 
* @param $it 
*/
function formCategoryActiveColor($it) {
    var catName = $it.data('category');
    if (catName != null && catName.length != '') {
        var $catTitle = $('.' + catName + ' .label-title');
        var $catBox = $('.box-' + catName);
        if ($catTitle.exists() && $catBox.exists()) {

            var flagChanged = false;
            var obj = formSerialize($catBox, false, false);
            jQuery.each(obj, function (_key, _val) {
                var _vals = _val == null ? '' : _val.toString();
                var _val_init = sessionStorage[_key];
                if (_vals != _val_init) {
                    flagChanged = true;
                    /** break for each if field changed value */
                    return false;
                }
            });

            if (flagChanged) {
                if ($catTitle.hasClass('category-active-color') == false)
                    $catTitle.addClass('category-active-color');
            } else {
                if ($catTitle.hasClass('category-active-color'))
                    $catTitle.removeClass('category-active-color');
            }
        }
    }
}


/**
* Form registry event of control bootstrap
* @param hasCacheField is true, registry event form after run cache value default 
*/
function formAddEventControl(hasCacheField) {
    if (hasCacheField == null) hasCacheField = true;
    /** bootstrap control default */

    $('[data-toggle="tooltip"]').tooltip();
    $('[data-toggle="popover"]').popover();

    /** bootstrap control custom */

    $('.group-radio input[type=radio]').unbind('click', function () { });
    $('.group-radio input[type=radio]').bind('click', function () {
        var radio = $(this);

        var val = radio.data('value');
        if (val == null) val = '';

        var inputs = radio.closest('.group-radio').find('input');
        if (inputs.length > 0) {
            var input = inputs[0];
            input.value = val;

            var $cat = $(input);
            formCategoryActiveColor($cat);
        }
    });

    $('.switch label').unbind('click', function () { });
    $('.switch label').bind('click', function () {
        var it = $(this);
        var inputs = it.closest('.switch').find('input');
        if (inputs.length > 0) {
            var input = inputs[0];
            if (input.hasAttribute('disabled') == false) {
                if (input.hasAttribute('checked')) {
                    input.removeAttribute('checked');
                } else {
                    input.setAttribute('checked', 'checked');
                }
            }
            var $cat = $(input);
            formCategoryActiveColor($cat);
        }
    });

    $('.checkbox label').unbind('click', function () { });
    $('.checkbox label').bind('click', function () {
        var it = $(this);
        var inputs = it.closest('.checkbox').find('input');
        if (inputs.length > 0) {
            var input = inputs[0];
            var act = $(input).data('active');
            if (input.hasAttribute('checked')) {
                /** uncheck -> disable */
                if (act != null && act.length > 0) {
                    var ai = act.split(';');
                    for (var i = 0; i < ai.length; i++) {
                        var e_id = ai[i];
                        var ei = document.getElementById(e_id);
                        if (ei != null) {
                            switch (ei.nodeName) {
                                case 'INPUT':
                                    switch (ei.type) {
                                        case 'text':
                                            ei.setAttribute('readonly', 'readonly');
                                            ei.style.opacity = '0.5';
                                            break;
                                        case 'checkbox':
                                            ei.setAttribute('disabled', 'disabled');
                                            ei.style.opacity = '0.5';
                                            $('label[for="' + e_id + '"]').css({ 'opacity': '0.5' });
                                            break;
                                    }
                                    break;
                            }
                        }
                    }
                }
                input.removeAttribute('checked');
            } else {
                /** check -> active */
                if (act != null && act.length > 0) {
                    var ai = act.split(';');
                    for (var i = 0; i < ai.length; i++) {
                        var e_id = ai[i];
                        var ei = document.getElementById(e_id);
                        if (ei != null) {
                            switch (ei.nodeName) {
                                case 'INPUT':
                                    switch (ei.type) {
                                        case 'text':
                                            ei.removeAttribute('readonly');
                                            ei.style.opacity = '1';
                                        case 'checkbox':
                                            ei.removeAttribute('disabled');
                                            ei.style.opacity = '1';
                                            $('label[for="' + e_id + '"]').css({ 'opacity': '1' });
                                            break;
                                    }
                                    break;
                            }
                        }
                    }
                }
                input.setAttribute('checked', 'checked');
            }
            var $cat = $(input);
            formCategoryActiveColor($cat);
        }
    });

    $('.dropdown .dropdown-menu li').unbind('click', function () { });
    $('.dropdown .dropdown-menu li').bind('click', function (e) {
        e.preventDefault();
        var li = $(this);
        if (li.hasClass('disabled')) return;

        li.closest('.dropdown').find('li').removeClass('active');
        li.addClass('active');

        var its = li.find('a');
        if (its.length > 0) {
            var inputs = li.closest('.dropdown').find('input');
            if (inputs.length > 0) {
                var a = its[0];
                var val = $(a).data('value');
                var text = $(a).text();
                if (text == null) text = '';

                var inp = inputs[0];
                $(inp).val(val);
                var btns = li.closest('.dropdown').find('button');
                if (btns.length > 0) {
                    var btn = btns[0];
                    btn.innerHTML = text + '&nbsp;&nbsp;<span class="caret"></span>';
                }

                var $cat = $(inp);
                formCategoryActiveColor($cat);
            }
        }
    });

    // Init a timeout variable to be used below
    var timeout = null;
    $('#box-module input[type=text]').unbind('keyup', function () { });
    $('#box-module input[type=text]').bind('keyup', function (e) {
        // Clear the timeout if it has already been set.
        // This will prevent the previous task from executing
        // if it has been less than <MILLISECONDS>
        clearTimeout(timeout);
        var $cat = $(this);
        // Make a new timeout set to go off in 800ms
        timeout = setTimeout(function () {
            formCategoryActiveColor($cat);
        }, 500);
    });

    $('.box-item .panel-heading').unbind('click', function () { });
    $('.box-item .panel-heading').bind('click', function (e) {
        var it = $(this);
        var expanded = it.attr('aria-expanded');
        if (expanded == 'true') {
            /** open -> close */
            it.children('.glyphicon').removeClass('glyphicon-chevron-up');
            it.children('.glyphicon').addClass('glyphicon-chevron-down');
        } else {
            /** close -> open */
            it.children('.glyphicon').removeClass('glyphicon-chevron-down');
            it.children('.glyphicon').addClass('glyphicon-chevron-up');

            e.preventDefault();

            var boxBody = it.attr('aria-controls');
            var index = $('#' + boxBody).closest('.box-item').attr('role');
            index = convertNumber(index);
            if (index != null) {
                var top = $('#box-scroll-' + index.toString()).offset().top - 45;
                $('html, body').scrollTop(top);
            }
        }
    });

    if (hasCacheField) {
        var $boxModule = $('#box-module');
        var data = formSerialize($boxModule, false, true);
    }
}

/**
* Form validate fields by attributes data-validate, data-item, data-*
* return null if validate fail, return Object when validate pass
* @param selector to for each element input return value, format $(...)
* @param hasValidate to allow run rules validate if is true
* @param setCache is true, run cache value default 
*/
function formSerialize(selector, hasValidate, setCache) {
    if (setCache != true) setCache = false;
    if (hasValidate != true) hasValidate = false;
    if (selector == null) return null;
    var o = {};
    selector.find('input').each(function () {
        var it = $(this);
        var type = this.getAttribute('type');
        if (type == null) type = '';

        var name = this.getAttribute('data-item');
        if (name == null || name == undefined || name == '') {
            /** continue for each inputs */
            return true;
        }

        var val = '';
        switch (type) {
            case 'checkbox':
                var control = this.getAttribute('data-control');
                if (control == null || control == undefined) control = '';
                val = false;
                if (control == 'switch') val = 'Off';
                if (this.hasAttribute('checked')) {
                    val = true;
                    if (control == 'switch') val = 'On';
                }
                break;
            case 'radio':
                break;
            case 'text':
                val = it.val();
                /** check validate */
                if (hasValidate) {
                    if (this.hasAttribute('readonly') == false && this.hasAttribute('disable') == false) {
                        var valis = this.getAttribute('data-validate');
                        if (valis != null && valis != undefined && valis != '') {
                            var title = it.data('title');
                            var chk = validateField(title, val, name, valis);
                            if (chk == false) {
                                o = null;
                                /** break for each inputs */
                                return false;
                            }
                        }
                    }
                }
                break;
            case 'hidden':
                val = $(this).val();
                break;
        }

        if (o != null) {
            if (val == null) val = '';

            var dataType = this.getAttribute('data-type');
            if (dataType == null || dataType == undefined || dataType == '') dataType = 'string';
            else dataType = dataType.toLowerCase();
            if (dataType == 'number') val = convertNumber(val);
            else val = val.toString();

            o[name] = val;
        }

        /* console.log(type + ' | ' + name + ' = ' + val); */
        if (setCache)
            sessionStorage[name] = val;
    });

    return o;
}

/**
* Format data serialize of form
* @param keyParent is key name of parent in struct json
* @param it is item field
* @param lsKey is array key name data of fields on form
* @param lsValue is array value of fiedls on form
*/
function formFormatData(keyParent, it, lsKey, lsValue) {
    for (var key in it) {
        var item = it[key];

        var keyData = keyParent + (keyParent == '' ? '' : '.') + key;
        var keyField = key;
        var catType = typeof item;
        var catLen = lengthPropertyOfObject(item);

        if (catType != 'object' || (catType == 'object' && catLen == 0)) {
            /** simple object: Date, bool, number, string */
            //console.log(keyData);
            var index = lsKey.indexOf(keyData);
            if (index != -1) {
                var val = lsValue[index];
                it[keyField] = val;
                console.log(keyData + ' = ' + val);
                lsKey.splice(index, 1);
                lsValue.splice(index, 1);
            }
        } else {
            /** object multi properties: type is object and length > 0 */
            //console.log(keyData + ' ... ');
            formFormatData(keyData, item, lsKey, lsValue);
        }
    }
}


/**
* Form event click button OK
*/
function formSubmit() {

    console.clear();
    var $boxModule = $('#box-module');
    var data = formSerialize($boxModule, true, false);

    if (data != null) {
        var lsKey = new Array();
        var lsValue = new Array();

        jQuery.each(data, function (key_, val_) {
            lsKey.push(key_);
            lsValue.push(val_);
        });

        var obj = __modItem.Data;
        formFormatData('', obj, lsKey, lsValue);
        console.log(obj);
        console.log(lsKey);

        showInfiniteIndicator();
        setTimeout(function () {
            closeInfiniteIndicator();
            alertShow({ type: 'complete', content: 'Completed', ok: function () { } });
        }, 1000);
    }


    /** POST TO API SERVICE CASSINI TO SAVE JSON DATA */
    /**
    //console.clear();   
    var $boxModule = $('#box-module');
    var data = formSerialize($boxModule, true, false);
    if (data != null) {

        showInfiniteIndicator();

        var lsKey = new Array();
        var lsValue = new Array();

        jQuery.each(data, function (key_, val_) {
            lsKey.push(key_);
            lsValue.push(val_);
        });

        var obj = __modItem.Data;
        formFormatData('', obj, lsKey, lsValue);
        console.log(obj);
        console.log(lsKey);

        var json = JSON.stringify(obj);
        //alert(json);
        var url = __urlAPI + '?mod=' + __modItem.Id;
        callAjax(url, {
            ok: function (result) {
                __modItem.Data = obj;
                modulePublish();
                //alert('OK: ' + result);
                setTimeout(function () {
                    closeInfiniteIndicator();
                    alertShow({ type: 'complete', content: 'Completed', ok: function () { } });
                }, 1000);
            },
            error404: function () {
                closeInfiniteIndicator();
                var msg404 = 'Cannot find page: ' + __urlAPI + '<br>Please check existion the file.'
                alertShow({ type: 'error', content: msg404, cancel: function () { } });
            },
            error: function (error) {
                closeInfiniteIndicator();
                alert('ERROR: ' + error);
            }
        }, json, 'POST');
    } 
    */
}

/**
* Form event click button Cancel
*/
function formCancel() {
    moduleReset();

    //alertShow({
    //    type: 'error', content: 'Message', cancel: function () {
    //        alert('you click button Cancel');
    //    }
    //}); 
}