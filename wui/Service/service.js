// port
var port = "8080";

// node-modules
var express = require('express');
var app = express();
var fs = require("fs");
var bodyParser = require('body-parser');
var validator = require('express-validator');
var expressWs = require('express-ws')(app);
var aWss = expressWs.getWss();
var cookie = require('cookie');
var cookieParser = require('cookie-parser')
var uuidV4 = require('uuid/v4');
var session = require('express-session');
var SECRET = "WEBUI_##2017@MSE";

var login = require("./login.js");
var user = require("./user.js");
var error = require("./error.js").error();
var path = require("path");
var http = require("http");
var https = require("https");
var manager = require("./manager.js");
var locks = require('locks');

// error message
var error_1 = error[0];
var error_2 = error[1];
var error_9 = error[8];

//==============================================================
//Manager session
var Mng = {};

Mng.mutexUsersMap = locks.createMutex();
Mng.mutexSockid2UserMap = locks.createMutex();
Mng.mutexSID2SockMap = locks.createMutex();

Mng.Users = new Object();
Mng.Map_Sockid2User = new Object();
Mng.Sess = new Object();
Mng.Map_SID2Socket = new Object();
Mng.timerRemoveUser = new Object();

//==============================================================

var config = {
    logout_time: 60
};

var loadConfig = function(){
    var bChange = false;
    var cfcontent = fs.readFileSync("config.json");
    if(cfcontent != undefined && cfcontent != ""){
        var json = JSON.parse(cfcontent);
        if(json != undefined && json.logout_time != undefined){
            config = json;
            bChange = true;
        }
    }
    return bChange;
}

loadConfig();

// Server
var server = app.listen(port, function () {
    console.log("App listening at http://localhost:", port)
})
var sessionOptions = {
    genid: function (req) {
        return uuidV4(); // use UUIDs for session IDs
    },
    secret: SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false, expires: false, maxAge: config.logout_time * 1000 }
}
// use express session
app.use(session(sessionOptions));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json());

// user validator
app.use(validator());

//------------------------------------------------------------------------------------
// For webclient
app.use(express.static(path.join(__dirname, '/../'))); //point to client files
//------------------------------------------------------------------------------------

var resetLogoutSession = function(req){
    if(req.session != undefined && req.session.login == true){
        console.log("\nCheck Session Expired:\n");
        console.log("---Timeout :" + config.logout_time);                
        req.session.cookie.maxAge = config.logout_time*1000;
        req.session._garbage = Date();
        req.session.touch();
        if(Mng.Sess[req.sessionID] != undefined){
            console.log("---Remove current timer:" + Mng.Sess[req.sessionID]);
            clearInterval(Mng.Sess[req.sessionID]);
            delete Mng.Sess[req.sessionID];
        }
        console.log("---Set New Timer");
        console.log("req.url: " + req.url);    

        if(req.sessionID != undefined){
            Mng.Sess[req.sessionID] = setInterval(function (curr_ssid) {
                console.log(">>>> Session Expired :" + curr_ssid);
                    
                aWss.clients.forEach(function (client) {    
                    var cookies = cookie.parse(client.upgradeReq.headers.cookie);
                    var ssid = cookieParser.signedCookie(cookies['connect.sid'], SECRET);                    
                    if (curr_ssid == ssid) {
                        console.log(">>>> Send message to request client logout");
                        client.send('{"req":"logout"}');                        
                    }
                });
                
                console.log(">>>> Remove interval function");
                clearInterval(Mng.Sess[curr_ssid]);
                if(Mng.Sess[curr_ssid] != undefined){
                    delete Mng.Sess[curr_ssid];
                }            
            }, config.logout_time*1000,req.sessionID);
        }
    }
}
app.all('*', function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, HEAD');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, accept, content-type, x-parse-application-id, x-parse-rest-api-key, x-parse-session-token');

    //Update session options
    sessionOptions.cookie = { secure: false, expires: false, maxAge: config.logout_time*1000 };
    
    resetLogoutSession(req);

    // intercept OPTIONS method
    if ('OPTIONS' == req.method) {
        res.status(200).send("OK");
    }
    else {
        console.log(">>>> Next");
        next();
    }     
});


var notifyMessageToClients = function (req) {
    var sock_id = req.url.split("?")[1].substring(10);
    aWss.clients.forEach(function (client) {
        if (client.upgradeReq.headers['sec-websocket-key'] != sock_id) {
            client.send('{"msg":"Setting is changed, please refresh your page"}');
        }
    });
}

// check Auth
app.post('/md-checkAuth', function (req, res) {    
    console.log("*Enter-checkAuth\n");
    login.checkAuth(req, res, Mng);
    console.log("*Leave-checkAuth\n");
});

// login
app.post('/md-login', function (req, res) { 
    console.log("*Enter-login\n");
    var result = login.login(req, res, Mng, aWss.clients);
    if(result == true){
        resetLogoutSession(req);
    }
    console.log("*Leave-login\n");
});

// Get menu 1.1 label
app.get('/md-menu1.1/getLabel', function (req, res) {
    if (req.session.login == true) {
        fs.readFile("../Modules/md-menu1.1/label-en.json", 'utf8', function (err, data) {
            if (err) {
                res.send(error_1);
                console.log(err);
            } else {
                if (data === JSON.stringify({}) || data == "") {
                    res.send(error_1);
                } else {
                    res.send('{ "result": "success", "data": ' + data + ' }');
                    //console.log(data);
                }
            }
        });
    } else {
        res.send('{ "result": "req_login" }');
    }
});

// Get menu 1.3 label
app.get('/md-menu1.3/getLabel', function (req, res) {
    if (req.session.login == true) {
        fs.readFile("../Modules/md-menu1.3/label-en.json", 'utf8', function (err, data) {
            if (err) {
                res.send(error_1);
                console.log(err);
            } else {
                if (data === JSON.stringify({}) || data == "") {
                    res.send(error_1);
                } else {
                    res.send('{ "result": "success", "data": ' + data + ' }');
                    //console.log(data);
                }
            }
        });
    } else {
        res.send('{ "result": "req_login" }');
    }
});

// Get menu 1.3 data
app.get('/md-menu1.3/getData', function (req, res) {
    if (req.session.login == true) {
        fs.readFile("../Modules/md-menu1.3/data.json", 'utf8', function (err, data) {
            if (err) {
                res.send(error_1);
                console.log(err);
            } else {
                if (data === JSON.stringify({}) || data == "") {
                    res.send(error_1);
                } else {
                    res.send('{ "result": "success", "data": ' + data + ' }');
                    //console.log(data);
                }
            }
        });
    } else {
        res.send('{ "result": "req_login" }');
    }
});

// Save menu 1.3 setting
app.post('/md-menu1.3/saveSettingData', function (req, res) {
    if (req.session.login == true) {
        if (JSON.stringify(req.body) === JSON.stringify({})) {
            res.send(error_2);
        } else {
            var st1 = req.body.SettingCategory1.Enable;
            var st2 = req.body.SettingCategory2.Enable;
            if (st2 == "true") {
                req.checkBody("SettingCategory2.Setting1", "SettingCategory2/Setting1: Input field must not be empty").notEmpty();
                req.checkBody("SettingCategory2.Setting1", "SettingCategory2/Setting1: The string length must be less than 255").isLength({ min: 0, max: 254 });
            }
            req.checkBody("SettingCategory3.Setting2", "SettingCategory3/Setting2: Input field must not be empty").notEmpty();
            req.checkBody("SettingCategory3.Setting3", "SettingCategory3/Setting3: Input field must not be empty").notEmpty();
            req.checkBody("SettingCategory3.Setting2", "SettingCategory3/Setting2: The string length must be less than 9").isLength({ min: 0, max: 8 });
            req.checkBody("SettingCategory3.Setting3", "SettingCategory3/Setting3: Input value must be in range 1 to 99").isInt({ min: 1, max: 99 });
            // check for errors!        
            var errors = req.validationErrors();
            if (errors != false) {
                console.log(errors[0].msg);
                res.send('{ "result": "error", "msg":"' + errors[0].msg + '" }');
                return;
            } else {
                var data = {};
                try {
                    var oldData = fs.readFileSync('../Modules/md-menu1.3/data.json', 'utf8');
                    if (oldData === JSON.stringify({}) || oldData == "") {
                        res.send(error_1);
                    }
                } catch (err) {
                    res.send(error_1);
                    console.log(err);
                }
                if (st1 == "false") {
                    data["SettingCategory1"] = JSON.parse(oldData).SettingCategory1;
                    data.SettingCategory1.Enable = "false"
                } else {
                    data["SettingCategory1"] = req.body.SettingCategory1;
                }
                if (st2 == "false") {
                    data["SettingCategory2"] = JSON.parse(oldData).SettingCategory2;
                    data.SettingCategory2.Enable = "false"
                } else {
                    data["SettingCategory2"] = req.body.SettingCategory2;
                }
                data["SettingCategory3"] = req.body.SettingCategory3;
                data["SettingCategory4"] = req.body.SettingCategory4;
                try {
                    fs.writeFileSync("../Modules/md-menu1.3/data.json", JSON.stringify(data));
                } catch (err) {
                    res.send(error_1);
                    console.log(err);
                }
                fs.readFile("../Modules/md-menu1.3/data.json", 'utf8', function (err, data) {
                    //console.log(data); 
                    if (err) {
                        res.send(error_1);
                        console.log(err);
                    } else {
                        if (data === JSON.stringify({}) || data == "") {
                            res.send(error_1);
                        } else {
                            notifyMessageToClients(req);
                            res.send('{ "result": "success", "data": ' + data + ' }');
                        }
                    }
                });
            }
        }
    } else {
        res.send('{ "result": "req_login" }');
    }
});

// Websocket
function monitoring() {
    //console.log("monitoring...")
    try {
        var state = fs.readFileSync('state.json', 'UTF-8');
    } catch (err) {
        console.log(err);
    }
    state = JSON.parse(state.replace(/^\uFEFF/, '')).state;
    aWss.clients.forEach(function (client) {
        var cookies = cookie.parse(client.upgradeReq.headers.cookie);
        var sid = cookieParser.signedCookie(cookies['connect.sid'], SECRET);
        var sock_id = client.upgradeReq.headers['sec-websocket-key'];
        if(sid != undefined && Mng.Sess[sid] == undefined && Mng.Map_Sockid2User[sock_id] != undefined){
            client.send('{"req":"logout"}'); 
        }
        client.send('{"state":"' + state + '"}');
    });
}
var interval = setInterval(monitoring, 1000);

var removeAuthUser = function (ws,req) {    
    console.log("Enter-removeAuthUser\n");
    
    var sid = req.sessionID;
    var sock_id = ws.upgradeReq.headers['sec-websocket-key'];

    manager.SynRMSockFromSID2SockMap(Mng, sid, sock_id);

    console.log("removeAuthUser-socket-id: " + sock_id);
    var user = Mng.Map_Sockid2User[sock_id];
    if (user != undefined && Mng.Users[user] != undefined) {
        console.log("removeAuthUser-user: " + user);
        // var index = Mng.Users[user].socketid.indexOf(sock_id);
        // Mng.Users[user].socketid.splice(index, 1);        
        // delete Mng.Map_Sockid2User[sock_id];
        manager.SynRMSockFromUsersMap(Mng, user, sock_id);
        manager.SynRMSockFromSockid2UserMap(Mng, sock_id);
        console.log("removeAuthUser: remain" + JSON.stringify(Mng.Users[user]));
    }
    if (Mng.Users[user] != undefined && Mng.Users[user].socketid.length == 0) {
        manager.SynRMSidFromSID2SockMap(Mng, sid);         
        Mng.timerRemoveUser[user] = setTimeout(function(Mng, user){
            console.log("timerRemoveUser-remove");
            clearTimeout(Mng.timerRemoveUser[user]);
            delete Mng.timerRemoveUser[user];
            manager.SynRMUserFromUsersMap(Mng, user);                                    
        },5000,Mng, user);
    }
    console.log("Leave-removeAuthUser\n");
}

app.ws('/', function (ws, req) {        
    var sock_id = ws.upgradeReq.headers['sec-websocket-key'];   

    manager.SynAddSockToSID2SockMap(Mng, req.sessionID, sock_id, ws);
    if(req.session.username != undefined){
        if(Mng.timerRemoveUser[req.session.username] != undefined){
            console.log("clearTimeout(req.timerRemoveUser)")
            clearTimeout(Mng.timerRemoveUser[req.session.username]);
            delete Mng.timerRemoveUser[req.session.username];
        }
    }

    ws.send('{"socket-id":"' + sock_id + '"}');

    ws.on('message', function (msg) {
        console.log(msg);
    });
    ws.on('close', function () {
        console.log("close");
        removeAuthUser(ws,req);        
        console.log("close-end");
    });
});

// change Admin password
app.post('/admin/validatePassword', function (req, res) {
    if (req.session.type == "Admin") {
        user.validateAdminPassword(req, res);
    } else {
        res.send(error_9);
    }
});

app.post('/admin/changePassword', function (req, res) {
    if (req.session.type == "Admin") {
        user.changeAdminPassword(req, res);
    } else {
        res.send(error_9);
    }
});
// set logout time
app.post('/admin/getLogoutTime', function (req, res) {
    var result = {
        logout_time: config.logout_time
    };
    res.send(JSON.stringify(result));
});
app.post('/admin/saveLogoutTime', function (req, res) {
    if (req.session.type == "Admin") {
        if (JSON.stringify(req.body) === JSON.stringify({})) {
            res.send(error_2);
            return;
        } else { 
            req.checkBody("logout_time", "Logout Time: Input value must be in range 60 to 3600").isInt({ min: 60, max: 3600 });
            var errors = req.validationErrors();
            if (errors != false) {
                console.log(errors);
                res.send('{ "result": "error", "msg":"Logout Time: Input value must be in range 60 to 3600" }');
                return;
            }
            else{
                var data = req.body.logout_time;
                if(data != undefined){
                    config.logout_time = data;
                    try {
                        console.log("saveLogoutTime: " + config.logout_time);   
                        resetLogoutSession(req);                     
                        fs.writeFileSync("config.json", JSON.stringify(config));                        
                    } catch (err) {                        
                        res.send(error_1);
                        console.log(err);
                        return;
                    }
                }
                else{
                    res.send('{ "result": "error", "msg":"Logout Time: Input value must be in range 60 to 3600" }');
                    return;
                }
            }
        }
        res.send('{ "result": "success"}');
    } else {
        res.send(error_9);
    }
});
// Add public user account
app.post('/public/validateAccount', function (req, res) {
    if (req.session.type == "Admin") {
        var type = "add";
        user.validatePublicUser(req, res, type);
    } else {
        res.send(error_9);
    }
});

app.post('/public/addAccount', function (req, res) {
    if (req.session.type == "Admin") {
        user.addPublicUser(req, res);
    } else {
        res.send(error_9);
    }
});

// Get all public user account
app.get('/public/getAllAccount', function (req, res) {
    if (req.session.type == "Admin") {
        user.getAllPublicUser(req, res);
    } else {
        res.send(error_9);
    }
});

// Delete public user account
app.post('/public/validateDeleteAccount', function (req, res) {
    if (req.session.type == "Admin") {
        user.validateDeletePublicUser(req, res);
    } else {
        res.send(error_9);
    }
});

app.post('/public/deleteAccount', function (req, res) {
    if (req.session.type == "Admin") {
        user.deletePublicUser(req, res);
    } else {
        res.send(error_9);
    }
});

// Change public user password
app.post('/public/validatePublicUser', function (req, res) {
    if (req.session.type == "Admin") {
        var type = "change";
        user.validatePublicUser(req, res, type);
    } else {
        res.send(error_9);
    }
});

app.post('/public/changePassword', function (req, res) {
    if (req.session.type == "Admin") {
        user.changePublicUserPassword(req, res);
    } else {
        res.send(error_9);
    }
});
