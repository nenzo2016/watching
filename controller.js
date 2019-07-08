
const fs = require('fs');
const path = require('path');
const router = require('koa-router')();
// add url-route in /controllers:

function addMapping(mapping,before) {
    for (var url in mapping) {
        if (url.startsWith('GET ')) {
            var path = before+ url.substring(4);
            router.get(path, mapping[url]);
            console.log(`register URL mapping: GET ${path}`);
        } else if (url.startsWith('POST ')) {
            var path = before+ url.substring(5);
            router.post(path, mapping[url]);
            console.log(`register URL mapping: POST ${path}`);
        } else if (url.startsWith('PUT ')) {
            var path = before+ url.substring(4);
            router.put(path, mapping[url]);
            console.log(`register URL mapping: PUT ${path}`);
        } else if (url.startsWith('DELETE ')) {
            var path = before+ url.substring(7);
            router.del(path, mapping[url]);
            console.log(`register URL mapping: DELETE ${path}`);
        } else {
            console.log(`invalid URL: ${url}`);
        }
    }
}

// function addControllers(dir) {
//     fs.readdirSync(path.resolve(__dirname,dir)).filter((f) => {
//         return f.endsWith('.js');
//     }).forEach((f) => {
//         let mapping = require(__dirname + '/' + dir + '/' + f);
//         addMapping(router, mapping);
//     });
// }
function readDirSync(path,before){  
    var pa = fs.readdirSync(path);  
    pa.forEach(function(ele,index){  
        var info = fs.statSync(path+"/"+ele)      
        if(info.isDirectory()){  
            console.log("dir: "+ele)  
            readDirSync(path+"/"+ele,before+"/"+ele);  
        }else{  
            if(ele.endsWith('.js')){
                let mapping = require(path+"/"+ele);
                addMapping(mapping,before);
            }
        }     
    })  
}  
module.exports = function (dir) {
    let controllers_dir = dir || 'controllers';
    readDirSync(path.resolve(__dirname,controllers_dir),"");
    return router.routes();
};
