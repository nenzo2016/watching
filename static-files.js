const path = require('path');
const mime = require('mime');
const fs = require('mz/fs');

function staticFiles(url, dir) {
    return async (ctx, next) => {
        let rpath = ctx.request.path;
        if (rpath.startsWith(url)) {
            let fp = path.join(dir, rpath.substring(url.length));
            if (await fs.exists(fp)) {
                ctx.response.type = mime.getType(rpath);
                ctx.response.body = await fs.readFile(fp);
            } else {
                ctx.response.status = 404;
            }
        } else {
            await next();
        }
    };
}
function staticPages(url, pages_dir) {
    return async (ctx, next) => {
        let rpath = ctx.request.path;
        let parse_path=rpath.split('/');
        let dir=pages_dir;
        if(parse_path[2]){
            dir=path.resolve(pages_dir,`./${parse_path[2]}`)
        }
        if (rpath.startsWith(url)) {
            let fp = path.join(pages_dir, rpath.substring(url.length));
            if (await fs.exists(fp)&&!fs.lstatSync(fp).isDirectory()) {
                ctx.response.type = mime.getType(rpath);
                ctx.response.body = await fs.readFile(fp);
            } else {
                let index = path.join(dir,'index.html');
                if (await fs.exists(index)) {
                    ctx.response.type = "text/html";
                    ctx.response.body = await fs.readFile(index);
                } else {
                    ctx.response.status = 404;
                }
            }
        } else {
            await next();
        }
    };
}
module.exports = {
    staticFiles,
    staticPages
};
