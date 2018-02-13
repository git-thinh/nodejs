var fs = require("fs");
var error = require("./error.js").error();

// error message
var error_1 = error[0];
var error_4 = error[3];
var error_5 = error[4];
var error_6 = error[5];
var error_7 = error[6];
var error_8 = error[7];
var error_10 = error[9];
var error_11 = error[10];

var exports = module.exports = {};

// change admin password
exports.validateAdminPassword = function (req, res) {
    var err_result = checkReqBodyAdmin(req.body);
    if (err_result == true) {
        res.send(error_1);
    } else {
        var oldPassword = req.body.oldPassword;
        var newPassword = req.body.newPassword;
        var confirmPassword = req.body.confirmPassword;
        var checkPassword = compare(newPassword, confirmPassword);
        var checkNewPassword = checkNull(newPassword);
        var checkConfirmPassword = checkNull(confirmPassword);
        var checkOldPassword = checkNull(oldPassword);
        if (checkOldPassword == true || checkNewPassword == true || checkConfirmPassword == true) {
            res.send(error_6);
            return;
        } else {
            if (checkNewPassword == "space" || checkConfirmPassword == "space" || checkOldPassword == "space") {
                res.send(error_10);
                return;
            }
        }
        try {
            var userLst = JSON.parse(fs.readFileSync('user.json', 'utf8'));
            if (userLst === JSON.stringify({}) || userLst == "") {
                res.send(error_1);
            }
        } catch (err) {
            res.send(error_1);
            console.log(err);
        }
        if (oldPassword == userLst.Admin.password) {
            if (checkPassword == false) {
                res.send(error_4);
            } else {
                res.send('{ "result": "success", "msg": "Ok"}')
            }
        } else {
            res.send(error_5);
        }
    }
};

exports.changeAdminPassword = function (req, res) {
    var oldPassword = req.body.oldPassword;
    var newPassword = req.body.newPassword;
    var confirmPassword = req.body.confirmPassword;
    try {
        var userLst = JSON.parse(fs.readFileSync('user.json', 'utf8'));
        if (userLst === JSON.stringify({}) || userLst == "") {
            res.send(error_1);
        }
    } catch (err) {
        res.send(error_1);
        console.log(err);
    }
    userLst.Admin.password = newPassword;
    try {
        fs.writeFileSync('user.json', JSON.stringify(userLst));
    } catch (err) {
        res.send(error_1);
        console.log(err);
    }
    res.send('{ "result": "success", "msg": "Change admin password successfully"}')
};

// Add public user account
exports.validatePublicUser = function (req, res, type) {
    var err_result = checkReqBodyPublic(req.body);
    if (err_result == true) {
        res.send(error_1);
    } else {
        var userName = req.body.userName;
        var newPassword = req.body.newPassword;
        var confirmPassword = req.body.confirmPassword;
        var checkPassword = compare(newPassword, confirmPassword);
        var checkNewPassword = checkNull(newPassword);
        var checkUserName = checkNull(userName);
        var checkConfirmPassword = checkNull(confirmPassword);
        if (checkNewPassword == true || checkUserName == true || checkConfirmPassword == true) {
            res.send(error_6);
            return;
        } else {
            if (checkNewPassword == "space" || checkConfirmPassword == "space" || checkUserName == "space") {
                res.send(error_10);
                return;
            }
        }
        if (checkPassword == false) {
            res.send(error_4);
            return;
        }
        try {
            var userLst = JSON.parse(fs.readFileSync('user.json', 'utf8'));
            if (userLst === JSON.stringify({}) || userLst == "") {
                res.send(error_1);
            }
        } catch (err) {
            res.send(error_1);
            console.log(err);
        }
        if (type == "add") {
            if (userLst.Public.length == 0) {
                res.send('{ "result": "success", "msg": "Ok"}');
            }
            for (var i = 0; i < userLst.Public.length; i++) {
                if (userName == userLst.Public[i].userName) {
                    var msg = '{ "result": "error", "msg":"' + JSON.parse(error_7).msg.replace('{userName}', userName) + '"}';
                    res.send(msg);
                    return;
                } else {
                    if (i == userLst.Public.length - 1) {
                        res.send('{ "result": "success", "msg": "Ok"}')
                    }
                }

            }
        } else {
            if (userLst.Public.length == 0) {
                var msg = '{ "result": "error", "msg":"' + JSON.parse(error_11).msg.replace('{userName}', userName) + '"}';
                res.send(msg);
                return;
            }
            for (var i = 0; i < userLst.Public.length; i++) {
                if (userName == userLst.Public[i].userName) {
                    res.send('{ "result": "success", "msg": "Ok"}')
                    return;
                } else {
                    if (i == userLst.Public.length - 1) {
                        var msg = '{ "result": "error", "msg":"' + JSON.parse(error_11).msg.replace('{userName}', userName) + '"}';
                        res.send(msg);
                        return;
                    }
                }

            }
        }
    }
};

exports.addPublicUser = function (req, res) {
    var userName = req.body.userName;
    var newPassword = req.body.newPassword;
    var confirmPassword = req.body.confirmPassword;
    try {
        var userLst = JSON.parse(fs.readFileSync('user.json', 'utf8'));
        if (userLst === JSON.stringify({}) || userLst == "") {
            res.send(error_1);
        }
    } catch (err) {
        res.send(error_1);
        console.log(err);
    }
    var newUser = { "userName": userName, "password": newPassword };
    userLst.Public.push(newUser);
    try {
        fs.writeFileSync('user.json', JSON.stringify(userLst));
    } catch (err) {
        res.send(error_1);
        console.log(err);
    }
    res.send('{ "result": "success", "msg": "Add public user successfully"}')
};

// Get all public user account
exports.getAllPublicUser = function (req, res) {
    fs.readFile('user.json', 'utf8', function (err, data) {
        if (err) {
            res.send(error_1);
            console.log(err);
        } else {
            if (data === JSON.stringify({}) || data == "") {
                res.send(error_1);
            } else {
                var userLst = [];
                for (var i = 0; i < JSON.parse(data).Public.length; i++) {
                    userLst.push(JSON.parse(data).Public[i].userName)
                }
                res.send('{ "result": "success", "data": ' + JSON.stringify(userLst) + ' }');
                //console.log(data);shj
            }
        }
    });
}

// Delete public user account
exports.validateDeletePublicUser = function (req, res) {
    var err_result = false;
    if (JSON.stringify(req.body) === JSON.stringify({})) {
        err_result = true;
    }
    if (err_result == true) {
        res.send(error_1);
    } else {
        if (req.body.length == 0) {
            res.send(error_8);
            return;
        }
    }
    res.send('{ "result": "success", "msg": "Ok"}')
};

exports.deletePublicUser = function (req, res) {
    var userName = req.body;
    try {
        var userLst = JSON.parse(fs.readFileSync('user.json', 'utf8'));
        if (userLst === JSON.stringify({}) || userLst == "") {
            res.send(error_1);
        }
    } catch (err) {
        res.send(error_1);
        console.log(err);
    }
    for (var j = 0; j < userName.length; j++) {
        for (var i = 0; i < userLst.Public.length; i++) {
            if (userName[j] == userLst.Public[i].userName) {
                userLst.Public.splice(i, 1);
                try {
                    fs.writeFileSync('user.json', JSON.stringify(userLst));
                } catch (err) {
                    res.send(error_1);
                    console.log(err);
                }
            }
        }
    }
    var newUserLst = [];
    for (var i = 0; i < userLst.Public.length; i++) {
        newUserLst.push(userLst.Public[i].userName)
    }
    res.send('{ "result": "success", "data": ' + JSON.stringify(newUserLst) + '}')
};

// Change public user password
exports.changePublicUserPassword = function (req, res) {
    var userName = req.body.userName;
    var newPassword = req.body.newPassword;
    try {
        var userLst = JSON.parse(fs.readFileSync('user.json', 'utf8'));
        if (userLst === JSON.stringify({}) || userLst == "") {
            res.send(error_1);
        }
    } catch (err) {
        res.send(error_1);
        console.log(err);
    }
    for (var i = 0; i < userLst.Public.length; i++) {
        if (userName == userLst.Public[i].userName) {
            userLst.Public[i].password = newPassword;
            try {
                fs.writeFileSync('user.json', JSON.stringify(userLst));
            } catch (err) {
                res.send(error_1);
                console.log(err);
            }
            res.send('{ "result": "success", "msg": "Change public user password successfully"}');
            return;
        } else {
            if (i == userLst.Public.length - 1) {
                res.send(error_1);
                return;
            }
        }

    }
};

function checkReqBodyAdmin(reqBody) {
    if (JSON.stringify(reqBody) === JSON.stringify({})) {
        return true;
    } else {
        if (reqBody.oldPassword == undefined || reqBody.newPassword == undefined || reqBody.confirmPassword == undefined) {
            return true;
        } else {
            return false;
        }
    }
};
function checkReqBodyPublic(reqBody) {
    if (JSON.stringify(reqBody) === JSON.stringify({})) {
        return true;
    } else {
        if (reqBody.userName == undefined || reqBody.newPassword == undefined || reqBody.confirmPassword == undefined) {
            return true;
        } else {
            return false;
        }
    }
};
function compare(newValue, confirmValue) {
    if (newValue == confirmValue) {
        return true;
    } else {
        return false;
    }
};
function checkNull(checkValue) {
    if (checkValue == "" || checkValue == null) {
        return true;
    } else {
        if (checkValue.trim() == "") {
            return "space";
        } else {
            return false;
        }
    }
};
