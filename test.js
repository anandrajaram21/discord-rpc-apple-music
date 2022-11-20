import osascript from "node-osascript"




osascript.executeFile('./getartwork.applescript',{varName:'value'},function(err,result,raw){
    if(err) return console.error(err)
        console.log(result, raw)
    });