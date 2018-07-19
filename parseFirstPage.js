var tmp = require('temporary')
var fs = require('fs')
var path = require('path');
var exec = require('child_process').exec;

function makeid() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < 5; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}
module.exports = (buffer, type, targetType) => {

    return new Promise(function (resolve, reject) {

        console.log('coming');
        var srcFile   = new tmp.File('tempname' + makeid() + '.' + type);
        var file = new tmp.File()
        var outdir = new tmp.Dir()

        var str = '';
        if (targetType == 'jpg') {
            str = 'jpeg';
        } else if (targetType == 'png') {
            str = 'png16m -r300 -dDownScaleFactor=4';
        }

        srcFile.writeFile(buffer, (err) => {
            if (err) {
                console.log('error', err);
            }

            console.log('worked 1', srcFile.path);
            
            let newFileName = path.join(
                outdir.path,
                path.basename(srcFile.path, path.extname(path.basename(srcFile.path)))
            ) + '.' + targetType;

            console.log(newFileName);

            // var cmd = 'gs -sDEVICE=jpeg -sOutputFile=' + newFileName + ' -dLastPage=1 ' + pdfFile.path;
            var cmd = 'convert -density 200 -flatten -background white ' + srcFile.path + '[0]  ' + newFileName;

            console.log(cmd);
            exec(cmd, function (error, stdout, stderr) {
                if (error) {
                    console.log('error2', error);
                    reject(error)
                } else {
                    console.log('worked 2');
                    fs.readFile(newFileName, (err, buffer) => {
                        if (err) reject(err);

                        resolve(buffer)
                    })
                }
            });
        })
    });
}