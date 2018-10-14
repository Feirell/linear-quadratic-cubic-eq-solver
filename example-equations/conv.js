const fs = require('fs');
const http = require('http');

function getSVGForLatex(latex) {
    return new Promise(function (resolve, reject) {
        const req = http.request({
            hostname: 'latex.codecogs.com',
            port: 80,
            path: '/svg.latex?' + encodeURIComponent(latex),
            method: 'GET',
            headers: {
                'Accept': 'image/svg+xml'
            }
        });

        req.on('response', res => {
            res.setEncoding('utf8');
            let compl = "";

            res.on('data', (chunk) => {
                compl += chunk;
            });

            res.on('end', () => {
                resolve(compl);
            });
        })

        req.on('error', (e) => {
            reject(e);
        });

        req.end();
    })
}

function btoa(str) {
    return Buffer.from(str, 'binary').toString('base64');
}

function getAndWrite(file, latexStr) {

    getSVGForLatex(latexStr).then(
        function gotAnResponse(str) {
            const length = str.length;
            // const b64encoded = btoa(str);
            // console.log('data:image/svg+xml;base64,' + b64encoded);

            fs.writeFile(file, str, 'utf-8', err => {
                if (err) {
                    console.error('could not write the svg to the file:\n', err);
                } else {
                    console.log('got an svg with a length of ' + length + ' chars and wrote it to ' + file);
                }
            })
        },
        function gotAnError(e) {
            console.error('got an error requesting the svg:\n', e)
        }
    )
}

getAndWrite(process.argv[2], process.argv[3]);