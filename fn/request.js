const request = require('request');


module.exports=function(option) {
    return new Promise(function(resolve, reject){
        var auto={
            url:"",
            method: "POST",
            json: true,
            headers: {
                "Accept":"*/*",
                "content-type": "application/json",
                'User-Agent':'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2883.87 Safari/537.36',
                'X-Requested-With':'XMLHttpRequest'
            }
        }
        var headers={...auto.headers,...option.headers};
        var option_={...auto,...option};
        option_.headers=headers;
        request(option_, function(error, response, body) {
            if (!error && response.statusCode == 200) {
                if(body){
                    resolve(body)
                }else{
                    resolve({})
                }
            }else{
                resolve(0)
            }
        }); 
    })
}