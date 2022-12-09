import { readFile } from 'fs/promises';
// import _ from 'lodash';
const jsonData = JSON.parse(
    await readFile(
        new URL('../src/json/station.json', import.meta.url)
    )
)

// 处理JSON的公用函数
function handleJSON(jsonData) {
    // let result = {};
    // for (let key in jsonData) {
    //     if (Array.isArray(jsonData[key])) { // 如果是数组，则将字符串转成数组
    //         result[key] = jsonData[key].map(item => JSON.parse(item));
    //     } else {
    //         result[key] = jsonData[key];
    //     }
    //     if (key === 'Id' && jsonData[key][jsonData[key].length - 1] === '2') { // 如果Id最后一位数是2，则删除这一项
    //         delete result[key];
    //     }
    // }
    // return jsonData;
    return new Promise((resolve, reject) => {
        // let json = _.cloneDeep(this.json);
        //遍历json对象
        let result = {}
        for (let key in jsonData) {
            //判断json[key]是否为数组
            if (Array.isArray(jsonData[key])) {
                //遍历数组将数组中的字符串转为数组
                result[key] = jsonData[key].map((ele, index) => {
                    if (typeof ele == 'string') {
                        jsonData[key][index] = ele.split(',').map(ele => {
                            return Number(ele)
                        })
                    }
                })
            } else {
                result[key] = jsonData[key]
            }
            //如果jsonData[key].Id 最后一位数是2的话 删除这一项
            if (key === 'Id' && jsonData[key][jsonData[key].length - 1] === '2') { // 如果Id最后一位数是2，则删除这一项
                delete result[key];
            }
        }
        return resolve(result)
    })
}

//express 搭建服务器
import express from 'express';
const app = express();
const port = 3000;
//处理跨域
app.all('*', function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type,Content-Length, Authorization, Accept,X-Requested-With');
    res.header('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS');
    if (req.method == 'OPTIONS') {
        res.send(200);
    } else {
        next();
    }
})
//处理请求
app.get('/station', async (req, res) => {
    const data = await handleJSON(jsonData);
    console.log(data)
    res.send(data)
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})