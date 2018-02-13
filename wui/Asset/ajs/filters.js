'use strict';

/* Filters */

angular.module('app.filters', [])
    .filter('IFF', function (svControl) {
        return function (item) {
            var v1 = item['value1'];
            var v2 = item['value2'];
            var v3 = item['value3'];
            var v4 = item['value4'];

            var text = '';
            if (v1 == v2) text = v3; else text = v4;

            return text == null ? '' : text.toString();
        }
    })
    .filter('bindUIGroupRadio', function (svControl) {
        return function (items, scope) { return svControl.groupRadio(items, scope); };
    })
    .filter('bindUIDropDownMenu', function (svControl) {
        return function (items, scope) { return svControl.dropDownMenu(items, scope); };
    })
    .filter('bindUICheckBox', function (svControl) {
        return function (item, scope) { return svControl.checkBox(item, scope); };
    })
    .filter('bindUISwitchToggle', function (svControl) {
        return function (item, scope) { return svControl.switchToggle(item, scope); };
    })
    .filter('bindUITextBox', function (svControl) {
        return function (item, scope) { return svControl.textBox(item, scope); };
    })
    .filter('PAGE_BACKGROUND_COLOR', function (PAGE_BACKGROUND_COLOR) {
        return function (text) {
            return String(text).split('PAGE_BACKGROUND_COLOR').join(PAGE_BACKGROUND_COLOR);
        }
    })
    .filter('MENU_BACKGROUND_COLOR', function (MENU_BACKGROUND_COLOR) {
        return function (text) {
            return String(text).split('MENU_BACKGROUND_COLOR').join(MENU_BACKGROUND_COLOR);
        }
    })
    .filter('interpolate', ['version', function (version) {
        return function (text) {
            return String(text).replace(/\%VERSION\%/mg, version);
        }
    }]);
