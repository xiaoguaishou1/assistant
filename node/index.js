import { readFile } from 'fs/promises';
const jsonData = JSON.parse(
    await readFile(
        new URL('../src/json/station.json', import.meta.url)
    )
)

// 处理JSON的公用函数
function handleJSON(jsonData) {
    return new Promise((resolve, reject) => {
        //遍历json对象
        for (let key in jsonData) {
            //处理画布大小
            if (key == 'CanvasBaseSz') {
                jsonData[key] = jsonData[key].split(',')
            }
            //判断jsonData[key]是否为数组
            if (Array.isArray(jsonData[key])) {
                //遍历数组 判断数组中是否存在 key 为 'NameCoord' 的值
                jsonData[key].forEach((item, index) => {
                    if (item && item['NameCoord']) {
                        //处理 NameCoord
                        jsonData[key][index]['NameCoord'] = jsonData[key][index]['NameCoord'].split(',');
                    }
                    // 如果 item['Coord'] 不是数组 则转为数组
                    if (item && item['Coord'] && !Array.isArray(item['Coord'])) {
                        jsonData[key][index]['Coord'] = [jsonData[key][index]['Coord']];
                    }
                })
            }
        }
        return resolve(jsonData)
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
    res.send(data)
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})