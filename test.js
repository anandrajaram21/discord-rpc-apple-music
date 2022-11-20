import osascript from "node-osascript"




osascript.executeFile('./applescript/saveartwork.applescript',{artistname:'pogo', songname:'forget'},function(err,result,raw){
    if(err) return console.error(err)
        console.log(result, raw)
    });