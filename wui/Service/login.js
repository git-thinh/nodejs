var fs = require("fs");
var error = require("./error.js").error();
var manager = require("./manager.js");

var ADMIN = "##Admin";
// error message
var error_1 = error[0];
var error_3 = error[2];

var exports = module.exports = {};
var res_msg = {};
res_msg.auth        = '{ "result": "auth"}';
res_msg.req_login   = '{ "result": "req_login"}';
res_msg.auth_failure= '{ "result": "auth_failure","msg":"既にログインされています。"}';
res_msg.success     = '{ "result": "success"}';

//======================================================================
// check login
exports.checkAuth = function (req, res, Mng) {
    console.log(req.url);
    var socket_id = req.url.split("?")[1].substring(10);    
    if (socket_id == undefined || socket_id == "undefined") {        
        console.log("checkAuth-req-login"); 
        res.send(res_msg.req_login);        
        return false;
    }
    if (req.session.login != undefined && req.session.username != undefined && req.session.login == true) {
        console.log("checkAuth-username:" + req.session.username);     
        console.log("checkAuth-socketid:" + socket_id);
        if(Mng.Users[req.session.username] == undefined && (Mng.Map_Sockid2User[socket_id] == undefined || Mng.Map_Sockid2User[socket_id] == req.session.username)){
            // console.log("checkAuth-reset");   
            // manager.SynAddUserToUsersMap(Mng,req.session.username,req.sessionID,socket_id);
            // manager.SynAddUserToSockid2UserMap(Mng,req.session.username,socket_id);
            console.log("checkAuth-current-sid:" + req.sessionID);
            res.send(res_msg.req_login);        
            return false;         
        }else if((Mng.Users[req.session.username] != undefined && req.sessionID != Mng.Users[req.session.username].sid) || Mng.Users[req.session.username] == undefined){
            console.log("checkAuth-current-sid:" + req.sessionID);
            res.send(res_msg.req_login);        
            return false;
        }
        else{
            var bfound = false;
            Mng.Users[req.session.username].socketid.forEach(function(sid) {
                if(sid == socket_id) {
                    bfound = true;                    
                    return;
                }
            });
            if(bfound == false){
                var user = Mng.Map_Sockid2User[socket_id];
                if(user != undefined && Mng.Users[user] != undefined && user != req.session.username){
                    console.log("checkAuth-user: " + user);
                    console.log("checkAuth-sock: " + socket_id);
                    
                    manager.SynRMSockFromUsersMap(Mng,user,socket_id);
                    
                    manager.SynRMSockFromSockid2UserMap(Mng,socket_id);
                    if (Mng.Users[user].socketid.length == 0) {
                        console.log("remove: " + JSON.stringify(Mng.Users[user]));
                        manager.SynRMUserFromUsersMap(Mng,user);                        
                    }
                }
                manager.SynAddSockToUsersMap(Mng,req.session.username,socket_id);                
                manager.SynAddUserToSockid2UserMap(Mng,req.session.username,socket_id);
            }
        }
        
        console.log("checkAuth-auth: " + JSON.stringify(Mng.Users[req.session.username])); 
        res.cookie('type',req.session.type);
        res.send(res_msg.auth);
        return true;
    }
    else{
        if(Mng.Map_Sockid2User[socket_id] != undefined){
            var user = Mng.Map_Sockid2User[socket_id];            
            if(user != undefined && Mng.Users[user] != undefined){
                manager.SynRMUserFromUsersMap(Mng, user);
                manager.SynRMSockFromSockid2UserMap(Mng, socket_id);                
            }
        }
        console.log("checkAuth-req_login"); 
        console.log("sid: " + req.sessionID);
        console.log("session: " + JSON.stringify(req.session));
        res.send(res_msg.req_login);
        return false;
    }
};

exports.login =  function (req, res, Mng, wss) {        
    var socket_id = req.url.split("?")[1].substring(10);
    if(socket_id == undefined || socket_id == 'undefined'){        
        res.send(res_msg.req_login);
        return false;
    }
    var type = '';
    var password = '';
    var username = '';
    
    var err_result = false;
    if (JSON.stringify(req.body) === JSON.stringify({})) {
        err_result = true;
    }
    else {
        var user = req.body;
        if (user.type != undefined) {
            type = user.type
        }
        else {
            err_result = true;
        }
        if (user.password != undefined) {
            password = user.password;
        }
        else {
            err_result = true;
        }
        if (type == 'Public') {
            if (user.userName != undefined && user.userName != '') {
                username = user.userName;
            } else {
                err_result = true;
            }
        }
        else{
            username = ADMIN;
        }
    }
    if (err_result == true) {
        res.send(error_3);
        return false;
    }
    
    if (req.session.login != undefined && req.session.login == true && req.session.username != username) {
        if(Mng.Users[req.session.username] != undefined && Mng.Users[req.session.username].sid == req.sessionID){
            console.log("remove: " + JSON.stringify(Mng.Users[req.session.username]));
            manager.SynRMUserFromUsersMap(Mng,req.session.username);            
        }
        Object.keys(Mng.Users).forEach(function (user) {
            console.log(user + " : " + JSON.stringify(Mng.Users[user]));
            if(Mng.Users[user].sid == req.sessionID){
                console.log("remove: " + JSON.stringify(Mng.Users[user]));
                manager.SynRMUserFromUsersMap(Mng,user);             
                return;
            }
        });

        delete req.session.login;
        delete req.session.type;
        delete req.session.username;
    }
    //Cleanup
    var usertmp = Mng.Map_Sockid2User[socket_id];
    if(usertmp != undefined && Mng.Users[usertmp] != undefined){
        console.log("login-cleanup-case:")
        manager.SynRMSockFromUsersMap(Mng,usertmp,socket_id);
        
        if (Mng.Users[usertmp] != undefined && Mng.Users[usertmp].socketid.length == 0) {
            console.log("login-cleanup-remove: " + JSON.stringify(Mng.Users[usertmp]));
            manager.SynRMUserFromUsersMap(Mng,usertmp);    
        }
        manager.SynRMSockFromSockid2UserMap(Mng,socket_id);
    }
    console.log('Username:' + username)
    if(Mng.Users[username]  != undefined && Mng.Users[username].sid != undefined && Mng.Users[username].sid != ''){
        //Cleanup if no connection to current user
        if(Mng.Users[username].socketid == undefined || Mng.Users[username].socketid.length == 0){
            if (Mng.timerRemoveUser[username] != undefined) {
                console.log("clearInterval(req.timerRemoveUser)")
                clearTimeout(Mng.timerRemoveUser[username]);
                delete Mng.timerRemoveUser[username];
            }
            manager.SynRMUserFromUsersMap(Mng,username);
        }
        else{
            console.log("login-auth_failure: " + JSON.stringify(Mng.Users[username]));
            res.send(res_msg.auth_failure);
            return false;
        }            
    }
    try {
        var userLst = JSON.parse(fs.readFileSync('user.json', 'utf8'));
        if (userLst === JSON.stringify({}) || userLst == "") {
            res.send(error_1);
            return false;
        }
    } catch (err) {
        res.send(error_1);
        console.log(err);
        return false;
    }
    if (type == "Admin") {       
        if (password == userLst.Admin.password && password.trim() != "") {
            req.session.login = true;
            req.session.type = "Admin";
            req.session.username = ADMIN; 
            manager.SynAddUserToUsersMap(Mng,req.session.username,req.sessionID,socket_id);
            manager.SynAddUserToSockid2UserMap(Mng, req.session.username, socket_id);            
            console.log("login-auth: " + JSON.stringify(Mng.Users[req.session.username]));
            res.cookie('type',req.session.type);
            res.send(res_msg.success);            
            return true;
        } else {
            res.send(error_3);
            return false;
        }
    } else {
        if (type == "Public") {
            for (var i = 0; i < userLst.Public.length; i++) {
                if (username == userLst.Public[i].userName) {
                    if (password == userLst.Public[i].password && password.trim() != "") {
                        console.log(req.sessionID)
                        req.session.login = true;
                        req.session.type = "Public";
                        req.session.username = username;
                        manager.SynAddUserToUsersMap(Mng,req.session.username,req.sessionID,socket_id);
                        manager.SynAddUserToSockid2UserMap(Mng, req.session.username, socket_id);  
                        console.log("login-auth: " + JSON.stringify(Mng.Users[req.session.username]));
                        res.cookie('type',req.session.type);
                        res.send(res_msg.success);
                        return true;
                    } else {
                        res.send(error_3);
                        return false;
                    }
                } else {
                    if (i == userLst.Public.length - 1) {
                        res.send(error_3);
                        return false;
                    }
                }
            }
        }
    }
    res.send(error_3);
    return false;
};