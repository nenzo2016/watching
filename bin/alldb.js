const fs = require('fs');
const path = require('path');
let files = fs.readdirSync(path.resolve(__dirname,"../models"));

let js_files = files.filter((f)=>{
    return f.endsWith('.js');
}, files);


for (let f of js_files) {
    console.log(`import model from file ${f}...`);
    require('../models/' + f).sync({ force: true });
}
