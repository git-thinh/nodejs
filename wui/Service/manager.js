var exports = module.exports = {};

exports.SynRMSockFromUsersMap = function(Mng, user, socket_id){   
    if(Mng == undefined || user == undefined || socket_id == undefined) {
        console.error("ERROR: SynRMSockFromUsersMap -> undefined arguments");
    }
    Mng.mutexUsersMap.lock(function () {
        console.log("Lock- SynRMSockFromUsersMap");
        //synchronized code block 
        var index = Mng.Users[user].socketid.indexOf(socket_id);
        Mng.Users[user].socketid.splice(index, 1);

        Mng.mutexUsersMap.unlock();
        console.log("Unlock- SynRMSockFromUsersMap");
    });
}
exports.SynRMUserFromUsersMap = function(Mng,user){  
    if(Mng == undefined || user == undefined) {
        console.error("ERROR: SynRMUserFromUsersMap -> undefined arguments");
    }     
    Mng.mutexUsersMap.lock(function () { 
        console.log("Lock- SynRMUserFromUsersMap");       
        //synchronized code block 
        if(user != undefined && Mng.Users[user] != undefined){
            delete Mng.Users[user];
        }        

        Mng.mutexUsersMap.unlock();
        console.log("Unlock- SynRMUserFromUsersMap");
    });
}
exports.SynAddUserToUsersMap = function(Mng, user, sid, socket_id){   
    if(Mng == undefined || user == undefined || sid == undefined || socket_id == undefined) {
        console.error("ERROR: SynAddUserToUsersMap -> undefined arguments");
    }    
    Mng.mutexUsersMap.lock(function () { 
        console.log("Lock- SynAddUserToUsersMap"); 
        //synchronized code block 
        Mng.Users[user] = {"sid": sid, "socketid":[socket_id]};

        Mng.mutexUsersMap.unlock();
        console.log("Unlock- SynAddUserToUsersMap"); 
    });
}
exports.SynAddSockToUsersMap = function(Mng, user, socket_id){
    if(Mng == undefined || user == undefined || socket_id == undefined) {
        console.error("ERROR: SynAddSockToUsersMap -> undefined arguments");
    }           
    Mng.mutexUsersMap.lock(function () { 
        console.log("Lock- SynAddSockToUsersMap"); 
        //synchronized code block 
        if(Mng.Users[user] != undefined && Mng.Users[user].socketid != undefined){
            Mng.Users[user].socketid.push(socket_id);   
        }        

        Mng.mutexUsersMap.unlock();
        console.log("Unlock- SynAddSockToUsersMap"); 
    });
}
exports.SynRMSockFromSockid2UserMap = function(Mng,socket_id){   
    if(Mng == undefined || socket_id == undefined) {
        console.error("ERROR: SynRMSockFromSockid2UserMap -> undefined arguments");
    }     
    Mng.mutexSockid2UserMap.lock(function () {
        console.log("Lock- SynRMSockFromSockid2UserMap"); 
        //synchronized code block 
        delete Mng.Map_Sockid2User[socket_id];

        Mng.mutexSockid2UserMap.unlock();
        console.log("Unlock- SynRMSockFromSockid2UserMap"); 
    });
}
exports.SynAddUserToSockid2UserMap = function(Mng, user, socket_id){
    if(Mng == undefined || user == undefined|| socket_id == undefined) {
        console.error("ERROR: SynAddUserToSockid2UserMap -> undefined arguments");
    }     
    Mng.mutexSockid2UserMap.lock(function () {
        console.log("Lock- SynAddUserToSockid2UserMap"); 
        //synchronized code block 
        Mng.Map_Sockid2User[socket_id] = user; 

        Mng.mutexSockid2UserMap.unlock();
        console.log("Unlock- SynAddUserToSockid2UserMap"); 
    });
}
exports.SynRMSockFromSID2SockMap = function(Mng, sid, socket_id){   
    if(Mng == undefined || sid == undefined || socket_id == undefined) {
        console.error("ERROR: SynRMSockFromSID2SockMap -> undefined arguments");
    }     
    Mng.mutexSID2SockMap.lock(function () {
        console.log("Lock- SynRMSockFromSID2SockMap"); 
        //synchronized code block 
        if(Mng.Map_SID2Socket[sid] != undefined && Mng.Map_SID2Socket[sid][socket_id] != undefined){
            delete Mng.Map_SID2Socket[sid][socket_id];
        }     

        Mng.mutexSID2SockMap.unlock();
        console.log("Unlock- SynRMSockFromSID2SockMap"); 
    });
}
exports.SynRMSidFromSID2SockMap = function(Mng, sid){   
    if(Mng == undefined || sid == undefined) {
        console.error("ERROR: SynRMSidFromSID2SockMap -> undefined arguments");
    }       
    Mng.mutexSID2SockMap.lock(function () {
        console.log("Lock- SynRMSidFromSID2SockMap"); 
        //synchronized code block 
        if(sid != undefined && Mng.Map_SID2Socket[sid] != undefined){
            delete Mng.Map_SID2Socket[sid];
        }     

        Mng.mutexSID2SockMap.unlock();
        console.log("Unlock- SynRMSidFromSID2SockMap"); 
    });
}
exports.SynAddSockToSID2SockMap = function(Mng, sid, socket_id, ws){   
    if(Mng == undefined || sid == undefined || socket_id == undefined || ws == undefined) {
        console.error("ERROR: SynAddSockToSID2SockMap -> undefined arguments");
    }     
    Mng.mutexSID2SockMap.lock(function () {
        console.log("Lock- SynAddSockToSID2SockMap"); 
        //synchronized code block 
        if (Mng.Map_SID2Socket[sid] == undefined) {
            Mng.Map_SID2Socket[sid] = new Object();            
        }        
        Mng.Map_SID2Socket[sid][socket_id] = ws;

        Mng.mutexSID2SockMap.unlock();
        console.log("Unlock- SynAddSockToSID2SockMap"); 
    });
}