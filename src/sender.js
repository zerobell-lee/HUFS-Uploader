fs = require('fs');
FormData = require('form-data');
fetch = require('node-fetch');
async = require('async')

var imgPath = [
    '/Users/zerobell/Downloads/official_lvlz8_43914955_2263456097222024_2379200537069641746_n.jpg',
    '/Users/zerobell/Downloads/loonatheworld_44909404_208199080112819_53220944215415324_n.jpg',
    '/Users/zerobell/Downloads/hihyeji_44314162_286447928662449_8045075874675128659_n.jpg'
];

makeForm = path => {
    frm = new FormData();
    frm.append('siteId', 'hufsjp2')
    frm.append('handle', '113544142')
    frm.append('attachFile', '10')
    frm.append('command', 'bbsUp')
    frm.append('boardType', '')
    frm.append('imgid', '')
    frm.append('file1', fs.createReadStream(path))

    return frm
}


doUpload = () => {
    async.parallel(imgPath.map((i) => {
        return (callback) => {
            var form = makeForm(i)
            res = fetch('http://builder.hufs.ac.kr/common/upFileExecute1.action', {method: 'POST', body: form})
            .then((res)=>res.text())
            .then((showRes) => {
                var filename1 = showRes.split('filename1 = ')[1].split(';')[0]
                var filename2 = showRes.split('filename2 = ')[1].split(';')[0]
                var fileSize = showRes.split('fileSize = ')[1].split(';')[0]
                var fileCode = showRes.split('fileCode = ')[1].split(';')[0]
                callback(null, `jf_upFile(${filename1}, ${filename2}, ${fileSize}, ${fileCode});\n`)
            })
        }
    }),
    (err, result) => {
        command = ''
        for (j = 0; j < result.length; j++) {
            command += result[j]
        }
        return command
    })
}

var cmd = doUpload()

console.log(cmd)
