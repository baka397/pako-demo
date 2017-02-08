function compressFile() {
    let file = document.querySelector('input[type=file]').files[0];
    let reader = new FileReader();
    console.info('原始文件名:',file.name);
    console.info('原始文件大小:',getSizeInfo(file.size));
    reader.addEventListener('load', function () {
        let output = pako.deflate(reader.result,{to:'string'});
        let fileName = file.name.replace(/[\S\s]+(\.\S+)$/,new Date().getTime()+'$1');
        console.info('压缩包文件名:',fileName);
        console.info('压缩后文件大小:',getSizeInfo(output.length));
        console.info('压缩比率:',Math.round(output.length*100/file.size)/100);
        fetch('/file/',{
            method:'POST',
            headers:{
                'x-file-name':fileName
            },
            body:output
        }).then(response => response.json()).then(res=>{
            console.info(res);
        }).catch(err=>{
            console.error(err);
        })
    });

    if (file) {
        reader.readAsDataURL(file);
    }
}

/**
 * 获取文件大小信息
 * @param  {Number} size kb数
 * @return {String}      实际大小
 */
function getSizeInfo(size){
    if(size===0) return '0KB';
    let sOutput;
    for (let aMultiples = ['KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'], nMultiple = 0, nApprox = size / 1024; nApprox > 1; nApprox /= 1024, nMultiple++) {
        sOutput = parseInt(nApprox) + aMultiples[nMultiple];
    }
    return sOutput;
}