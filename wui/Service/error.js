var express = require('express');
function error(){
    var error_1 = '{ "result": "error", "msg": "Server encountered some problem" }';
    var error_2 = '{ "result": "error", "msg": "Setting value is empty" }';  
    var error_3 = '{ "result": "error", "msg": "ログインに失敗しました。" }';
    var error_4 = '{ "result": "error", "msg": "「New Password」と「Confirm New Password」が一致していない" }';
    var error_5 = '{ "result": "error", "msg": "「Old Password」が誤っている" }';
    var error_6 = '{ "result": "error", "msg": "Please fill all the fields" }';
    var error_7 = '{ "result": "error", "msg": "「{userName}」のアカウントが既に登録されている" }';
    var error_8 = '{ "result": "error", "msg": "Please select an account to delete" }';
    var error_9 = '{ "result": "per_error", "msg": "You do not have permission to edit any user information" }';
    var error_10 = '{ "result": "error", "msg": "Invalid value" }';
    var error_11 = '{ "result": "error", "msg": "「{userName}」のアカウントが登録されていない" }';
    return [error_1, error_2, error_3, error_4, error_5, error_6, error_7, error_8, error_9, error_10, error_11]
}
module.exports.error = error;