/*
京东App首页-鲤鱼红包
10 7,8 * * * Sami_jd_lyhb.js
 */
const $ = new Env('Sami鲤鱼红包');
//Node.js用户请在jdCookie.js处填写京东ck;
const jdCookieNode = $.isNode() ? require('./jdCookie.js') : '';
const notify = $.isNode() ? require('./sendNotify') : '';
const JD_API_HOST = `https://api.m.jd.com`;
//IOS等用户直接用NobyDa的jd cookie
let cookiesArr = [],cookie = '';

if ($.isNode()) {
    Object.keys(jdCookieNode).forEach((item) => {
        cookiesArr.push(jdCookieNode[item])
    })
    if (process.env.JD_DEBUG && process.env.JD_DEBUG === 'false') console.log = () => {};
} else {
    cookiesArr = [$.getdata('CookieJD'), $.getdata('CookieJD2'), ...jsonParse($.getdata('CookiesJD') || "[]").map(item => item.cookie)].filter(item => !!item);
}

!(async () => {
    if (!cookiesArr[0]) {
        $.msg($.name, '【提示】请先获取cookie\n直接使用NobyDa的京东签到获取', 'https://bean.m.jd.com/bean/signIndex.action', { "open-url": "https://bean.m.jd.com/bean/signIndex.action" });
        return;
    }
    await $.wait(1000);
    for (let i = 0; i < cookiesArr.length; i++) {
        cookie = cookiesArr[i];
        if (cookie) {
            $.UserName = decodeURIComponent(cookie.match(/pt_pin=([^; ]+)(?=;?)/) && cookie.match(/pt_pin=([^; ]+)(?=;?)/)[1])
            $.index = i + 1;
            $.isLogin = true;
            $.nickName = '';
            $.innerStatus = '';
            $.panelSubtitle = '';
            $.requireCount = '';
            $.taskType = '';
            $.dataJson=[];
            $.lyhbld=false; //鲤鱼红包立得判断
            $.dataJson1=[];//逛活动
            $.lyhbld1=false; //逛活动判断
            
            
            if (!$.isLogin) {
                $.msg($.name, `【提示】cookie已失效`, `京东账号${$.index} ${$.nickName || $.UserName}\n请重新登录获取\nhttps://bean.m.jd.com/bean/signIndex.action`, { "open-url": "https://bean.m.jd.com/bean/signIndex.action" });
                continue;
            }
            console.log(`\n******开始【京东账号${$.index}】${$.nickName || $.UserName}*********\n`);
            //做任务
            await GetAllTask();
            //console.log($.dataJson);
            for (let vo of $.dataJson.data.result.taskInfos ) {
                $.innerStatus= vo.innerStatus;
                $.panelSubtitle=vo.panelSubtitle;
                $.requireCount=vo.requireCount;
                $.taskType=vo.taskType;
                //console.log($.panelSubtitle);
               
                if($.taskType===1){ //立得0.1元任务*****************************
                    if($.innerStatus === 7){
                        console.log("立得0.1元任务领取成功");
                        await Stand0_1yuan();
                        await $.wait(15000);
                        if ($.lyhbld === true){ //立得0.1元开始做任务
                            await Stand0_1yuanDoTask();
                            await $.wait(15000);
                            await Stand0_1yuanOverTask();
                            await $.wait(1000);
                            await Stand0_1yuanGetRedPaper();
                            await $.wait(1000);
                        }
                               
                    }else{
                        console.log("立得0.1元任务已完成"); 
                    }
                }
                if($.taskType===0){ //领三张券任务*****************************
                    if($.innerStatus === 7){
                        await Get3Coupons();
                        //console.log("领三张券领取成功");
                    }else{
                        console.log("领三张券任务已完成"); 
                    }
                }
                if($.taskType===4){ //逛活动任务*****************************
                    if($.innerStatus === 7){
                        await Get1DoTask();
                        await $.wait(3000);
                        await Get1_1DoTask();
                        await $.wait(1000);
                        //{"code":0,"data":{"biz_code":0,"biz_msg":"OK","result":{"advertDetails":[{"id":"8301615908","jumpUrl":"https://h5.m.jd.com/rn/42yjy8na6pFsq1cx9MJQ5aTgu3kX/index.html?has_native=0&source=jlhb3","name":"签到领京豆","picUrl":"https://m.360buyimg.com/babel/jfs/t1/172912/30/24008/79104/61c08c5aE404af532/0d4afbb62359bbea.jpg","status":2},{"id":"8301615909","jumpUrl":"https://h5.m.jd.com/babelDiy/Zeus/2UhLBzUEjEXLu8RdMMJQ4UjFcnFC/index.html?babelChannel=ttt1","name":"领现金","picUrl":"https://m.360buyimg.com/babel/jfs/t1/162639/34/21240/114448/61c08c7eE8633b2e0/75bd783517d31b04.jpg","status":2}]},"success":true},"rtn_code":0}
                        for (let vo of $.dataJson1.data.result.advertDetails) {
                            $.advertDetailsId= vo.id;
                            $.advertDetailsname= vo.name;
                            //console.log($.advertDetailsId);
                            //console.log($.advertDetailsname);
                            await Get1_2DoTask( $.advertDetailsId);
                            await $.wait(5000);
                        }
                        await Get1_3GetHB();
                        
                    }else{
                        console.log("逛活动任务已完成"); 
                    }
                }
                if($.taskType===8){ //逛互动任务*****************************
                    if($.innerStatus === 7){
                        await Get2DoTask();
                        await $.wait(3000);
                        await Get2_1DoTask();
                        await $.wait(1000);
                        //{"code":0,"data":{"biz_code":0,"biz_msg":"OK","result":{"advertDetails":[{"id":"8301615908","jumpUrl":"https://h5.m.jd.com/rn/42yjy8na6pFsq1cx9MJQ5aTgu3kX/index.html?has_native=0&source=jlhb3","name":"签到领京豆","picUrl":"https://m.360buyimg.com/babel/jfs/t1/172912/30/24008/79104/61c08c5aE404af532/0d4afbb62359bbea.jpg","status":2},{"id":"8301615909","jumpUrl":"https://h5.m.jd.com/babelDiy/Zeus/2UhLBzUEjEXLu8RdMMJQ4UjFcnFC/index.html?babelChannel=ttt1","name":"领现金","picUrl":"https://m.360buyimg.com/babel/jfs/t1/162639/34/21240/114448/61c08c7eE8633b2e0/75bd783517d31b04.jpg","status":2}]},"success":true},"rtn_code":0}
                        for (let vo of $.dataJson1.data.result.advertDetails) {
                            $.advertDetailsId= vo.id;
                            $.advertDetailsname= vo.name;
                            //console.log($.advertDetailsId);
                            //console.log($.advertDetailsname);
                            await Get2_2DoTask( $.advertDetailsId);
                            await $.wait(5000);
                        }
                        await Get2_3GetHB();
                        
                    }else{
                        console.log("逛互动任务已完成"); 
                    }
                }
                if($.taskType===5){ //逛频道任务*****************************
                    if($.innerStatus === 7){
                        await Get3DoTask();
                        await $.wait(3000);
                        await Get3_1DoTask();
                        await $.wait(1000);
                        //{"code":0,"data":{"biz_code":0,"biz_msg":"OK","result":{"advertDetails":[{"id":"8301615908","jumpUrl":"https://h5.m.jd.com/rn/42yjy8na6pFsq1cx9MJQ5aTgu3kX/index.html?has_native=0&source=jlhb3","name":"签到领京豆","picUrl":"https://m.360buyimg.com/babel/jfs/t1/172912/30/24008/79104/61c08c5aE404af532/0d4afbb62359bbea.jpg","status":2},{"id":"8301615909","jumpUrl":"https://h5.m.jd.com/babelDiy/Zeus/2UhLBzUEjEXLu8RdMMJQ4UjFcnFC/index.html?babelChannel=ttt1","name":"领现金","picUrl":"https://m.360buyimg.com/babel/jfs/t1/162639/34/21240/114448/61c08c7eE8633b2e0/75bd783517d31b04.jpg","status":2}]},"success":true},"rtn_code":0}
                        for (let vo of $.dataJson1.data.result.advertDetails) {
                            $.advertDetailsId= vo.id;
                            $.advertDetailsname= vo.name;
                            //console.log($.advertDetailsId);
                            //console.log($.advertDetailsname);
                            await Get3_2DoTask( $.advertDetailsId);
                            await $.wait(5000);
                        }
                        await Get3_3GetHB();
                        
                    }else{
                        console.log("逛频道任务已完成"); 
                    }
                }
                if($.taskType===2){ //逛店铺任务*****************************
                    if($.innerStatus === 7){
                        await Get4DoTask();
                        await $.wait(3000);
                        await Get4_1DoTask();
                        await $.wait(1000);
                        //{"code":0,"data":{"biz_code":0,"biz_msg":"OK","result":{"advertDetails":[{"id":"8301615908","jumpUrl":"https://h5.m.jd.com/rn/42yjy8na6pFsq1cx9MJQ5aTgu3kX/index.html?has_native=0&source=jlhb3","name":"签到领京豆","picUrl":"https://m.360buyimg.com/babel/jfs/t1/172912/30/24008/79104/61c08c5aE404af532/0d4afbb62359bbea.jpg","status":2},{"id":"8301615909","jumpUrl":"https://h5.m.jd.com/babelDiy/Zeus/2UhLBzUEjEXLu8RdMMJQ4UjFcnFC/index.html?babelChannel=ttt1","name":"领现金","picUrl":"https://m.360buyimg.com/babel/jfs/t1/162639/34/21240/114448/61c08c7eE8633b2e0/75bd783517d31b04.jpg","status":2}]},"success":true},"rtn_code":0}
                        for (let vo of $.dataJson1.data.result.advertDetails) {
                            $.advertDetailsId= vo.id;
                            $.advertDetailsname= vo.name;
                            //console.log($.advertDetailsId);
                            //console.log($.advertDetailsname);
                            await Get4_2DoTask( $.advertDetailsId);
                            await $.wait(5000);
                        }
                        await Get4_3GetHB();
                        
                    }else{
                        console.log("逛频道任务已完成"); 
                    }
                }
                if($.taskType===3){ //逛商品任务***************************
                    if($.innerStatus === 7){
                        await Get5DoTask();
                        await $.wait(3000);
                        await Get5_1DoTask();
                        await $.wait(1000);
                        //{"code":0,"data":{"biz_code":0,"biz_msg":"OK","result":{"advertDetails":[{"id":"8301615908","jumpUrl":"https://h5.m.jd.com/rn/42yjy8na6pFsq1cx9MJQ5aTgu3kX/index.html?has_native=0&source=jlhb3","name":"签到领京豆","picUrl":"https://m.360buyimg.com/babel/jfs/t1/172912/30/24008/79104/61c08c5aE404af532/0d4afbb62359bbea.jpg","status":2},{"id":"8301615909","jumpUrl":"https://h5.m.jd.com/babelDiy/Zeus/2UhLBzUEjEXLu8RdMMJQ4UjFcnFC/index.html?babelChannel=ttt1","name":"领现金","picUrl":"https://m.360buyimg.com/babel/jfs/t1/162639/34/21240/114448/61c08c7eE8633b2e0/75bd783517d31b04.jpg","status":2}]},"success":true},"rtn_code":0}
                        for (let vo of $.dataJson1.data.result.advertDetails) {
                            $.advertDetailsId= vo.id;
                            $.advertDetailsname= vo.name;
                            //console.log($.advertDetailsId);
                            //console.log($.advertDetailsname);
                            await Get5_2DoTask( $.advertDetailsId);
                            await $.wait(5000);
                        }
                        await Get5_3GetHB();
                        
                    }else{
                        console.log("逛频道任务已完成"); 
                    }
                } 
                
                
                
            }
            

            
            
            
            if (i != cookiesArr.length - 1) {
                await $.wait(3000);
            }
        }
    }
})()
    .catch((e) => $.logErr(e))
    .finally(() => $.done())


//获取所有需要做的任务
function GetAllTask() {
    return new Promise(async resolve => {
        const options = {
            url: `https://api.m.jd.com/api?appid=jinlihongbao&functionId=taskHomePage&loginType=2&client=jinlihongbao&t=${Date.now()}&clientVersion=10.3.5&osVersion=-1`,
            body: ``,
            headers: {
                "authority": "api.m.jd.com",
                "origin": "https://happy.m.jd.com",
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
                        $.dataJson=data;
                        //console.log(data);
                        //{code: 0,data: {biz_code: 0,biz_msg: 'OK',result: { taskInfos: [Array] },success: true},rtn_code: 0}
                        //{    activityId: 1065,    brandLogo: 'https://m.360buyimg.com/img/jfs/t1/156678/28/26789/6184/61af3577E05206da9/f0610a747d57a738.png',    canReceive: true,    innerStatus: 3,    panelSubtitle: '完成立得0.1元',    panelTitle: '首页点击“领券”逛10s',    requireCount: 10,    sceneId: 1064,    stockStatus: 0,    subTitle: '立得0.1元',   taskType: 1,    title: '逛“领券”'  }
                        //console.log(data.data.result.taskInfos);

                    } else {
                        console.log(`服务器返回空数据`)
                    }
                }
            } catch (e) {
                $.logErr(e, resp)
            } finally {
                resolve();
            }
        })
    })
}

//鲤鱼红包立得到0.1元领任务
function Stand0_1yuan() {
    return new Promise(async resolve => {
        const options = {
            url: `https://api.m.jd.com/api?appid=jinlihongbao&functionId=startTask&loginType=2&client=jinlihongbao&t=${Date.now()}&clientVersion=10.3.5&osVersion=-1`,
            body: `body=%7B%22taskType%22%3A%221%22%2C%22random%22%3A%2255543311%22%2C%22log%22%3A%221644111111545~17xFT8mdJ2AMDFVTlNNRzAyMQ%3D%3D.ZHhneXZkfmR7dWd%2BZTNwYXkfdS5nfWs3OWRiZWFweX8tfzlkMCkmAyUnagQKBgRqHCQeG34dCRd2YTsWKw%3D%3D.a9af825a~7%2C1~B015631663F82B833EDEFE258847198EBF896BA7~1sugdkm~C~ShFGXRAOaWwfEkVeXREKaBNXBB4GcRhzBx4HewBkHQIeAQAAH0QRHRFVBBkBdh1xBhwFfQUBHwEfAAADHEcTHxNXBR4Gcx9wBB4DewkFHEQcVhFtHxNUQ10WCQUdEUFDEA4QAAUEBQEBAwcFAwEHAgAKBAIRHhJFUVYTCRJFRERHRFVEVRMfFkRRUBEIElRSRkVHRERREh8SQ1VdEwlvBxgHBQAcCxgDAR8BHQVtHxJZWxELAhgRV0IRCBJTUVcHCwJXBAQKBwpQVlMFUVBXAAVTA1cHUwBVBAAHVBEcEV9DEwkWf11fRkoQU1VAUlsGBRIcEUQRCwIHBwACBQACAwEHAAcdEVpaEgoRHVABAVQBAQRVAFELVB8EVlBSBQMGBAUBVQkGBVJRHgcCAgYIAwIBUwUABQZRUVUBBAJXBQdWBAUFUFMCUgVSCwACBQgRHBFXQ1MRDhFOWndCWQt9f2J5CWBTe2YdY39xCQFCYhYdEVxGEA4QdlxfVlxVE3ldUh0THxZdVUcRCBILBgYHCxIdEkNQQhELaAYLBB8HBwNvHBBGXRMJaxNgcnZ9AwERHRFVXVBDXFtUEBgQAAMSHRIBAx4AHwYTHxYKBgUFChIeFgICBwYABgEFBQADAAcAAAAZBwADAwQCCgIGAwUDAQUFBRMfEwIWbhgTWl1REA4QV1VWV1ZWR0QRHRFQWRYJFkQRHhJRXRALEUcCHgIdBBEdEVJVa0UWCxECAhAYEFNXEgsSQlJeV15eDAYBBgACAAMBEBgQXFkSC2sCHwAfAW4dEVZfW1YRCBIDAgYFAgEBBwYCBQEATQBfRn9CCWFYVgtaf3V1AmhdekFTWXBLfFQJDhpjAmBnagR8eWZcY2RjWH5nZ0tkdX5lYmV4d2VHcEsIZ3Rwcn90dVdoZF1%2BV2tlSXt6cmN1eEhiAWdmfQJgWllhdEpbXXtGZh1yWEdlZHJfA3l0ckN7cHV2fUx%2BcmNbXQJ1d3x6dmF8dmBient6WkJncWdHSXJFR2B9W0JKZ1hpYnZhRH5iSVB7cFxGHHZxBlh%2BYGJSfHR6VXVxVkt%2FWXJwdmNQBXFncXZ0Z1NJcUhcaHlwfkV5TH4HeXd3CHxec2JySlYBcmdXanliVnt2YWVzZUhqdXcCBXpyY1d5YXFlZntIQFZ2XnQLfXULZHdJX3F3YnEDeHdeWndhU3x9S2J8dEVEdnxnZWNxY2F4eGNhUGFOWEJyd3t9HANQAwAIBgdUTUcfAE1PTXZNYFlpdHZVeWBwXwVodwFHeHV3QGZrWFd1ZkRnf2pxeHZ0YmtndlR9YWBLAWtiW21%2FYV5lU3xaY2RlS1thdEdDdnFgZmJ0dkV7Y0dBbHBwdnZnYmlmdXUIe3cCTHZ3Y0tndkpTZGZmW2NnSH52cXBieWFcVFVkZQpodgRjd3BYBGd3RGllYmIMDkoDVlxCXgFFFh4TXkNWEgoREk4%3D~12isk3k%22%2C%22sceneid%22%3A%22JLHBhPageh5%22%7D`,
            headers: {
                "authority": "api.m.jd.com",
                "origin": "https://happy.m.jd.com",
                "accept": "application/json, text/plain, */*",
                "referer": "https://happy.m.jd.com/babelDiy/zjyw/3ugedFa7yA6NhxLN5gw2L3PF9sQC/index.html?channel=9",
                "Content-Type": "application/x-www-form-urlencoded",
                "Cookie": cookie,
                "User-Agent": $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : (require('./USER_AGENTS').USER_AGENT)) : ($.getdata('JDUA') ? $.getdata('JDUA') : "jdapp;iPhone;9.4.4;14.3;network/4g;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1")
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
                        console.log(data);
                        //{"code":0,"data":{"biz_code":0,"biz_msg":"领取任务成功","success":true},"rtn_code":0} 
                        if(data.rtn_code===0){
                            if(data.data.biz_msg==="领取任务成功"){ //领取任务成功继续操作
                                $.log(`立得0.1任务: ` + data.data.biz_msg);
                                $.lyhbld = true;
                            }else{
                                $.log(`立得0.1任务: ` + data.data.biz_msg);
                                $.lyhbld = false;
                            }
                        }else{
                            $.log(`立得0.1任务: 获取数据失败` );
                            $.lyhbld = false;
                        }
                            
                    } else {
                        console.log(`服务器返回空数据`)
                    }
                }
            } catch (e) {
                $.logErr(e, resp)
            } finally {
                resolve();
            }
        })
    })

};

//鲤鱼红包立得到0.1元开始做任务
function Stand0_1yuanDoTask() {
    return new Promise(async resolve => {
        const options = {
            url: `https://api.m.jd.com/client.action?functionId=getCcTaskList&clientVersion=10.3.5&build=92468&client=android&partner=oppo&oaid=0DD656F325A74398A1CB3B4372BF1AD576fe38f2bc10980a86dd0681c82e8d89&eid=eidA258381236csdd/N8n/lORYGRZJxEpCvsB3fzfh68tomYApSHfsOuryc+PAzdt2geHVFR/9yAZvIkptxjAS+GyqXcWtQZeiqiCEfgD8e37Cii+0pz&sdkVersion=29&lang=zh_CN&harmonyOs=0&networkType=wifi&uts=0f31TVRjBSsqndu4%2FjgUPz6uymy50MQJsPnVYXZCH8DkVn5LjaFOTjosKDhNnQZbKHAF1Mla9HhEX8D3JoYPcKji52aoqZXYnLbEYhNI4fStkEqbAM9NwH6n9gH5li3r5ndIAds7Cgw8MrSMDFrADzTpEbp43f01AjY6vygNN509Nucit9lij9L9UiOOFHnSCqz2rxttkRjX2NYI7qKZQg%3D%3D&uemps=0-0&ext=%7B%22prstate%22%3A%220%22%2C%22pvcStu%22%3A%221%22%7D&ef=1&ep=%7B%22hdid%22%3A%22JM9F1ywUPwflvMIpYPok0tt5k9kW4ArJEU3lfLhxBqw%3D%22%2C%22ts%22%3A1644110687508%2C%22ridx%22%3A-1%2C%22cipher%22%3A%7B%22area%22%3A%22CV83Cv8yDzu5XzK%3D%22%2C%22d_model%22%3A%22UOTPJJKm%22%2C%22wifiBssid%22%3A%22dW5hbw93bq%3D%3D%22%2C%22osVersion%22%3A%22CJK%3D%22%2C%22d_brand%22%3A%22J1LGJm%3D%3D%22%2C%22screen%22%3A%22CtOzCsenCNqm%22%2C%22uuid%22%3A%22CQHrYJUyDtG2CWY4DJHrZG%3D%3D%22%2C%22aid%22%3A%22CQHrYJUyDtG2CWY4DJHrZG%3D%3D%22%2C%22openudid%22%3A%22CQHrYJUyDtG2CWY4DJHrZG%3D%3D%22%7D%2C%22ciphertype%22%3A5%2C%22version%22%3A%221.2.0%22%2C%22appname%22%3A%22com.jingdong.app.mall%22%7D&st=1644111824242&sign=5030d7a7e7c386da9e80f76c8a7a7e9f&sv=100`,
            body: `body=%7B%7D&`,
            headers: {
                "authority": "api.m.jd.com",
                "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
                "Cookie": cookie,
                "User-Agent": $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : (require('./USER_AGENTS').USER_AGENT)) : ($.getdata('JDUA') ? $.getdata('JDUA') : "jdapp;iPhone;9.4.4;14.3;network/4g;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1")
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
                    } else {
                        console.log(`服务器返回空数据`)
                    }
                }
            } catch (e) {
                $.logErr(e, resp)
            } finally {
                resolve();
            }
        })
    })
}

//鲤鱼红包立得到0.1元结束任务
function Stand0_1yuanOverTask() {
    return new Promise(async resolve => {
        const options = {
            url: `https://api.m.jd.com/client.action?functionId=reportCcTask&clientVersion=10.3.5&build=92468&client=android&partner=oppo&oaid=0DD656F325A74398A1CB3B4372BF1AD576fe38f2bc10980a86dd0681c82e8d89&eid=eidA258381236csdd/N8n/lORYGRZJxEpCvsB3fzfh68tomYApSHfsOuryc+PAzdt2geHVFR/9yAZvIkptxjAS+GyqXcWtQZeiqiCEfgD8e37Cii+0pz&sdkVersion=29&lang=zh_CN&harmonyOs=0&networkType=wifi&uts=0f31TVRjBSsqndu4%2FjgUPz6uymy50MQJsPnVYXZCH8DkVn5LjaFOTjosKDhNnQZbKHAF1Mla9HhEX8D3JoYPcKji52aoqZXYnLbEYhNI4fStkEqbAM9NwH6n9gH5li3r5ndIAds7Cgw8MrSMDFrADzTpEbp43f01AjY6vygNN509Nucit9lij9L9UiOOFHnSCqz2rxttkRjX2NYI7qKZQg%3D%3D&uemps=0-0&ext=%7B%22prstate%22%3A%220%22%2C%22pvcStu%22%3A%221%22%7D&ef=1&ep=%7B%22hdid%22%3A%22JM9F1ywUPwflvMIpYPok0tt5k9kW4ArJEU3lfLhxBqw%3D%22%2C%22ts%22%3A1644110687508%2C%22ridx%22%3A-1%2C%22cipher%22%3A%7B%22area%22%3A%22CV83Cv8yDzu5XzK%3D%22%2C%22d_model%22%3A%22UOTPJJKm%22%2C%22wifiBssid%22%3A%22dW5hbw93bq%3D%3D%22%2C%22osVersion%22%3A%22CJK%3D%22%2C%22d_brand%22%3A%22J1LGJm%3D%3D%22%2C%22screen%22%3A%22CtOzCsenCNqm%22%2C%22uuid%22%3A%22CQHrYJUyDtG2CWY4DJHrZG%3D%3D%22%2C%22aid%22%3A%22CQHrYJUyDtG2CWY4DJHrZG%3D%3D%22%2C%22openudid%22%3A%22CQHrYJUyDtG2CWY4DJHrZG%3D%3D%22%7D%2C%22ciphertype%22%3A5%2C%22version%22%3A%221.2.0%22%2C%22appname%22%3A%22com.jingdong.app.mall%22%7D&st=1644111834457&sign=2e27486865bd006041235366a8ec112e&sv=121`,
            body: `body=%7B%22monitorRefer%22%3A%22%22%2C%22monitorSource%22%3A%22ccgroup_android_index_task%22%2C%22taskId%22%3A%221060%22%2C%22taskType%22%3A%221%22%7D&`,
            headers: {
                "authority": "api.m.jd.com",
                "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
                "Cookie": cookie,
                "User-Agent": $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : (require('./USER_AGENTS').USER_AGENT)) : ($.getdata('JDUA') ? $.getdata('JDUA') : "jdapp;iPhone;9.4.4;14.3;network/4g;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1")
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
                    } else {
                        console.log(`服务器返回空数据`)
                    }
                }
            } catch (e) {
                $.logErr(e, resp)
            } finally {
                resolve();
            }
        })
    })
}

//鲤鱼红包立得到0.1元领红包
function Stand0_1yuanGetRedPaper() {
    return new Promise(async resolve => {
        const options = {
            url: `https://api.m.jd.com/api?appid=jinlihongbao&functionId=h5receiveRedpacketAll&loginType=2&client=jinlihongbao&t=${Date.now()}&clientVersion=10.3.5&osVersion=-1`,
            body: `body=%7B%22taskType%22%3A1%2C%22random%22%3A%2262349411%22%2C%22log%22%3A%221644114228377~1OoQZvoIVtlMDFHa0d2SzAyMQ%3D%3D.dl1zQnp2X3VHf3BddAgxHhMvHH5yJHE8NXZHcVp8a1o5RDV2FT0dDzcCfj8GFCF%2BJygMPmomBQVTdQAaOQ%3D%3D.a76b2dfc~7%2C1~F8C2DC85CC0B6742DF3BD490FCB4D2EAC548DCD9~0ct2znw~C~SRJHWRMOa28dEURfXRMKaRBcBh0GBx9yehxyYXgYARwBAwAdRBMcEFYPHgUHH3Z%2FHnFlAh0FHgIBAxxFEh0SVgMVBgQfdnsbc2dmGEQYRBBsHxJWQl8SCAMUEUNAEQkVAwYHAAAFBAAABwkJAgQFAgsaHxJEVlcVCBJHQEVARFREVRIdEkZVUxACEVZVR0dDRkVSFh0WQFZfEQpqBB0GBAsUChwCAx8GHgVuGBNeWhALAhwTU0ISCBBZVlUFCwFRBgQKAwhVVVAHVlNSAQdRAVcLUgFVBwIAVhIfFl9EEggTf1lfRUkQU1NKUFgFBxEbEEQRDgACBAYAAgQDAgkDBQUUEVpYEQkVH1MDBlQGBQVQAlIIVBwAVlNZBgIFBwUGVAgGAFBRHQECAgQJAQcDUAQIBwZSUVYFBwFVAgJRAAYHUVMBVgZTCgILBggRHxFRQlIRDhNOW3ZBWgl4fWJ6C2NbeGUeY311CgJFZRMYElxHEQoTd15fVV5dE3ldUB0VHhJdVUcWChAIAQQHCBMcEEFbQRIJaAQPAhwAAgFpHBBDXBILaxNgcHd1AwARHxFWXFRBW1hQEh4TAgATHBMBAhwLHQURHxEOAAQFDBMYEgICBwYABgAGBwEKAAYABwAaBAMCBwcCCAEEAAQCAQcFBBAUEQERbh8VW19SFgsWVlRXVVZXREUSHhBZWRIJEUYVHhJQXRMOEkUCHQIfBBMcEFFebEYRCREHABIfFlNQEggTQVFfVF5dDwQKAAQKBwIGEBwRWVsWCmkAHwAdAGwcEFBUXFcRCREGBAQHBQAAAgMBAwIFTgB5UFtbewJyVFxWf3R1BmhZekBSWXFJfVYNDxxqAmJkawN5emVfZmVnW3xlZUhkdntmZGZzdmVGd0oOZnRydn5zdVZoZFx8U2lhSnpwcWFyeUpmA2ZleQBkWVpjdkleXn5HZx16WUNkZnJYAHl3dUJ8cXR2fUh8dmNYXQB%2FcH54dmJ6dGBifnl%2FWUFldmRCSHBHRWBxWkNKZFpuYHViQ35lSFF%2BcFhGH3VxBl50YmFRfnd9VHVxU0l6WnRycWJSB3Bld3Z9Z1NLcktYanpyeUV%2BSH8Ce3R0CH9ac2F5SVcCcWdQa3hiU3l2YmNzZUprd3IABnt6YVd6YXJhZXhKR1NxWncJfHUIYHRIXnN%2BYXEDe3dYW3ZhU359SmN%2Fd0dBdHxkZ2B5YGJ7eGFlU2JJX0d3dHt8HQdTAgIIBQVcTUgfAk1JTHJNYFlidmBWC2VnXFVpenRfZ2F1VFZgZGpyd3duUmdZamh5SFVndGQMa3ZxWFJhWnF9ZWdxZnpzV2VkSl10d2MJdHJiemtwSmVickZDaHFwZnFwAHRTdGRUe3ZiCnZ1YAh7ZllfYmV0UGZpWFJ3cHNfdXVxR3FiAwRgcEliZ2RjQHJ2ZmhoZlUFDk4CVlZASgVJFh0WXUFWEQoTEkw%3D~02qd4xn%22%2C%22sceneid%22%3A%22JLHBhPageh5%22%7D`,
            headers: {
                "authority": "api.m.jd.com",
                "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
                "Cookie": cookie,
                "User-Agent": $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : (require('./USER_AGENTS').USER_AGENT)) : ($.getdata('JDUA') ? $.getdata('JDUA') : "jdapp;iPhone;9.4.4;14.3;network/4g;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1")
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
                        //strPrizeName ＝ 文本_取出中间文本 (信息返回1, “biz_msg” ＋ #引号 ＋ “:” ＋ #引号, #引号)
                            $.log(`立得0.1任务领红包: ` + data.data.biz_msg);
                    } else {
                        console.log(`服务器返回空数据`)
                    }
                }
            } catch (e) {
                $.logErr(e, resp)
            } finally {
                resolve();
            }
        })
    })
}

//鲤鱼红包领三张券任务
function Get3Coupons() {
    return new Promise(async resolve => {
        const options = {
            url: `https://api.m.jd.com/api?appid=jinlihongbao&functionId=startTask&loginType=2&client=jinlihongbao&t=${Date.now()}&clientVersion=10.3.5&osVersion=-1`,
            body: `body=%7B%22taskType%22%3A%220%22%2C%22random%22%3A%2235024511%22%2C%22log%22%3A%221644239687461~1N6cdfVMsvaMDFjc21DYTAyMQ%3D%3D.UkVZd1NQSll6WFFDVT1QDUE7dyUaElRwH1JfW29WT0ITcR9SDQc1MjohJ3ILFjkkNg1WCVg3AytABAUwXk4T.8171615a~7%2C1~9D6A66D314A04D5CF85C41BB1CF1B0657AF3B85F~1monfpa~C~SRNHWxEKb2weEEZcXRAIaBJSBhkBBx9yBh0HB2B0GAAcAgICHEYQHxJSBBkBBx9yBh0HB2BgGAAcAgICHEYQHxJSAhkBBx9yBh0HB2RyGEQeVBBvHBBVQV4UCQUfFkBDEAsRBwUEAAMBCwcCBAQHCwYOCgMRGBFHV1URDBFEQEVGRlRHVhAeEUdTUhYJFlVWRkVHQkZRFh0QQlZcEghpBxwACgEfDR8BAh0CGgZtGBNYWBAIAR4QUEMUCRZSUVYGCgNVAgcJAwhTV1AEVVFRAgZXAFEAVQJWBgAEUhEcFl9CEAgQfFtcRkgWUlVBV1sGBhMfFEcSDgAEBgYAAwsECwcCBQUfFllbEAsRGwUABgACA1cGBVQLAh1TVwZQUVdWBgQAAAtTBAVRH1QABwYCVwJVUFIGAAMCBQVRUgIGVwJWA1FRUgUGAlZXCwYDAFcSHhNVRlESDhNYRGFrYngDWUV8ekFfAUkFRlN7BVp2ZQwPEB4QXkQQCRJxXFtUWFYQe19QGBEcFl9TRBAIEgsABwYOERgRR1BCEAtoAAcAGAIEAm8eEkBdEQptEXtjZHwQcwQKRREcFlBcVkBdWVYQHxIDHQURGBEBAh8AGAYSGBMLAAYECBAeEQUABwIBBwAGBwcHAAUGAAIfBwEBAwQBCwMFBQQAAAADBBMfFAISaR0QW11TEggQVVZQVVJVQEcSHhNSXBEKFkQQHhBRWRAIEUcFHQYdABEcEFJVaUUSDhMCABAeElBWEQoUQVVdUFxdDwIGBgEEAQADEB4QXVgQCWsHHwQfBG4cEFNfWVQSDhMDBAYGAgELBwYDCwEBSgJVdnVyAEpdZX5FV1BTA1dTAwYDAgBWV1ECCwMDBAFUAVUHAQBTBFYABQRISxgCSk1OcE9nTn14cUYCYWR0XFN6clxzdXJDeWRcZHJkYFdRYXRnZHVgamN0RENgdlxAYWVycFJ1UWZoYFlgamdlWHF3cghgcUNmY3tiVnd1Z1xmdUYKemRwant0RERzdVMDYnFyBnd1ZEBoY2R3anFKZmZkdWZjdnFcY3EBSnB3dGlldnNdc3VFZWRhcg0LTQReQkMBVlQRGhFdR1YQCBAQTQ%3D%3D~1d8p5vy%22%2C%22sceneid%22%3A%22JLHBhPageh5%22%7D`,
            headers: {
                "authority": "api.m.jd.com",
                "origin": "https://happy.m.jd.com",
                "accept": "application/json, text/plain, */*",
                "referer": "https://happy.m.jd.com/babelDiy/zjyw/3ugedFa7yA6NhxLN5gw2L3PF9sQC/index.html?channel=9",
                "Content-Type": "application/x-www-form-urlencoded",
                "Cookie": cookie,
                "User-Agent": $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : (require('./USER_AGENTS').USER_AGENT)) : ($.getdata('JDUA') ? $.getdata('JDUA') : "jdapp;iPhone;9.4.4;14.3;network/4g;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1")
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
                        //console.log(data);
                        //{"code":0,"data":{"biz_code":0,"biz_msg":"领取任务成功","success":true},"rtn_code":0}  领任务成功
                        if(data.rtn_code===0){
                            if(data.data.biz_msg==="领取任务成功"){ //领取任务成功继续操作
                                $.log(`领三张券任务: ` + data.data.biz_msg);
                            }else{
                                $.log(`领三张券任务: ` + data.data.biz_msg);
                            }
                        }else{
                            $.log(`领三张券任务: 获取数据为空`);
                        }
                    } else {
                        console.log(`服务器返回空数据`)
                    }
                }
            } catch (e) {
                $.logErr(e, resp)
            } finally {
                resolve();
            }
        })
    })

};

//鲤鱼红包领逛活动任务
function Get1DoTask() {
    return new Promise(async resolve => {
        const options = {
            url: `https://api.m.jd.com/api?appid=jinlihongbao&functionId=startTask&loginType=2&client=jinlihongbao&t=${Date.now()}&clientVersion=10.3.5&osVersion=-1`,
            body: `body=%7B%22taskType%22%3A%224%22%2C%22random%22%3A%2298009111%22%2C%22log%22%3A%221644117530283~1riIMW9B5okMDFZZEVnTzAyMQ%3D%3D.aFJxU35oU3RUe21Udhl3alY%2FXw4VXHIyMWhIc0t4dVU7VTFoGj8MCykNfC4CCi58NiwSMWg3ARtcdxEeJw%3D%3D.9c01c567~7%2C1~5BBC114DC3849A75CC7BEF83F7751E9CD5694861~09ycbsl~C~SRNGWxEOaxFVBxwDAR5zehwLcWt5HwEcAQIGH0ASHxNVBxgHeB1xcx8IcmhlHAMfAgYDGEQRHRNVAxwFBB9yBBwLcWpzHgAcBgMEHEcTHRNRBx8GZhxxAx8IcmlgHQMYAwQAH0UTbBkTRl9eEglrEVQGHQZ3HnR0GAh7fXUdBB8CAQMcRxIfElcHHwV0GnFzHAt5fnkZABwBAwAfRBEcEVQDHAZwH3Z3Hwl5YGYdRx1VEm4cEVdBXhALAxoRR0MRCxMAAwUGAAIHAgMHCAQIBggFAhEYEkRUVRMPE0ZFR0RHVkZWERwQRldXEQ4SVVdFRUFFR1ARHBFAV14RCmkFHgAEBxwKHQABGQAeBG4cEVpZEgkBHhNRRREOElJUVAcNA1QFBwkECVJVUQZXUlEHBVUDVgJQAFMFAwZXEh8SXUARChB9W1hGTBBSUENSXQcGEx8SRxIJAQUEBgADAQYHAAEJAh0XW1kTCRIeUwMCVgIHBlMHUQ1UHgFVUFQEAAcHBgJWCwUHUVccAQUCAAgCBwJTAwEGB1JSVgIGAVUGAVQCAgVWUwNXBlINAQEECxIfElVAURIIE0hdd0RZCnh8Yn8IY1J4ZR5gfXILAkRgEBoRWkYRCxN2Wl5VXVYQel5QHhEcEF9TQBEOEgoDBQcNEx4TQFNBEglrBAgCHQEAA2kcEUNeEw9qEGFxdX4AAxIfElNfVkRcXVQRHRMABRMeEwIAHQMdBREcEAgAAgUMEh8TAQIBBwMHAgYGAwEDBQMGAh8AAAUDBQcJAgACBgICBgYGERwRARBsHhRaW1ERCxNXU1dUV1VERxIfElJaEAsQQxEYElBYEwsXRgEfAR4HEh8SUFZtRxAMEQQCER0TU1ETCBNBUV1UXF0OCQoBAg8CBQERHRNcXxMIagYcBhwHbR8SUF1dUREOEgIHBQUEAAUAAQQCAQROAllrBmF9UHNYXnJ8dXMDa1x5QlBackh%2BVw8MHGQCZmdrAX95YF1gZWBbfWRlSGZ2eGdkYnhxZUZ1SAhhdXNzfHd2VGpnX31RaWNOe3xyYnB7SGQAZGd%2BAWNZW2J2SV1ffUFmG3JZQmZkdF4AeHdxQHhydnR%2BSnx0ZFtbAnRyf3pwYH93Y2F5eHhZQGR3ZUFOckNHYXhYQkxmW2hhdWJHfGFLU31yWkEccHEHXX1gZFN%2FdXlWdnJUSH1adHJwZFADcWZ0dXRhUkpwS19renJ9R3pKfAF%2Bd3EIfVtwYnRLVQBxZFRpe2FUeHBjY3RlTmp0cgEFfHNgVnpicmZkeEpDUHRYcwt7dQphdElZcHRjcgB7dFxZdWJVfntMYnp0REF1fGFkYHBgYnt7YWJSYkhaRHV3fX0dBlMDBgkFBldOSxwCTk1OcE9mdFd8YlRJdmdjXVR2Ykh1YV9XUWdje3NyZWZRZnNSZHNzZGR1AQdlYVhcZWdjZGx1BX1ldmNSdGRISXF1cgl7clRbZHZgVWJydgdkcFZ4dmRzUFV1Zkt4YmELc3BOB3JiS15QZl5kamlbYmZyRGlwdmcJamNlAGh3AXdmYHNZcHQBUGVhYQ4NTAEHUgtBBl4THRNYQlUTCRIRTQ%3D%3D~02e9srh%22%2C%22sceneid%22%3A%22JLHBhPageh5%22%7D`,
            headers: {
                "authority": "api.m.jd.com",
                "origin": "https://happy.m.jd.com",
                "accept": "application/json, text/plain, */*",
                "referer": "https://happy.m.jd.com/babelDiy/zjyw/3ugedFa7yA6NhxLN5gw2L3PF9sQC/index.html?channel=9",
                "Content-Type": "application/x-www-form-urlencoded",
                "Cookie": cookie,
                "User-Agent": $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : (require('./USER_AGENTS').USER_AGENT)) : ($.getdata('JDUA') ? $.getdata('JDUA') : "jdapp;iPhone;9.4.4;14.3;network/4g;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1")
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
                        //console.log(data);
                        //{"code":0,"data":{"biz_code":0,"biz_msg":"领取任务成功","success":true},"rtn_code":0}  领任务成功
                        if(data.data.biz_msg==="领取任务成功"){ //领取任务成功继续操作
                            $.log(`逛活动任务: ` + data.data.biz_msg);
                        }else{
                            $.log(`逛活动任务: ` + data.data.biz_msg);
                        }    
                    } else {
                        console.log(`服务器返回空数据`)
                    }
                }
            } catch (e) {
                $.logErr(e, resp)
            } finally {
                resolve();
            }
        })
    })

};

//鲤鱼红包领逛活动详情
function Get1_1DoTask() {
    return new Promise(async resolve => {
        const options = {
            url: `https://api.m.jd.com/api?appid=jinlihongbao&functionId=getTaskDetailForColor&loginType=2&client=jinlihongbao&t=${Date.now()}&clientVersion=10.3.5&osVersion=-1`,
            body: `body=%7B%22taskType%22%3A%224%22%7D`,
            headers: {
                "authority": "api.m.jd.com",
                "Content-Type": "application/x-www-form-urlencoded",
                "accept": "application/json, text/plain, */*",
                "referer": "https://happy.m.jd.com/babelDiy/zjyw/3ugedFa7yA6NhxLN5gw2L3PF9sQC/index.html?channel=9",
                "origin": "https://happy.m.jd.com",
                "Cookie": cookie,
                "User-Agent": $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : (require('./USER_AGENTS').USER_AGENT)) : ($.getdata('JDUA') ? $.getdata('JDUA') : "jdapp;iPhone;9.4.4;14.3;network/4g;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1")
            }
        }
        $.post(options, (err, resp, data) => {
            try {
                if (err) {
                    console.log(`${JSON.stringify(err)}`)
                    console.log(`${$.name} API请求失败，请检查网路重试1`)
                } else {
                    if (data) {
                        data = JSON.parse(data);
                        
                        //{  code: 0,  data: {    biz_code: 0,    biz_msg: 'OK',    result: { advertDetails: [Array] },    success: true  },  rtn_code: 0}
                        $.dataJson1=data;
                            //for (let vo of $.dataJson.data.result.taskInfos ) {
                                
                            //}
                    } else {
                        console.log(`服务器返回空数据`)
                    }
                }
            } catch (e) {
                $.logErr(e, resp)
            } finally {
                resolve();
            }
        })
    })
}

//鲤鱼红包领逛活动开始做任务
function Get1_2DoTask(id1) {
    return new Promise(async resolve => {
        const options = {
            url: `https://api.m.jd.com/api?appid=jinlihongbao&functionId=taskReportForColor&loginType=2&client=jinlihongbao&t=${Date.now()}&clientVersion=10.3.5&osVersion=-1`,
            body: `body=%7B%22taskType%22%3A%224%22%2C%22detailId%22%3A%22${id1}%22%7D`,
            headers: {
                "authority": "api.m.jd.com",
                "Content-Type": "application/x-www-form-urlencoded",
                "accept": "application/json, text/plain, */*",
                "referer": "https://happy.m.jd.com/babelDiy/zjyw/3ugedFa7yA6NhxLN5gw2L3PF9sQC/index.html?channel=9",
                "origin": "https://happy.m.jd.com",
                "Cookie": cookie,
                "User-Agent": $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : (require('./USER_AGENTS').USER_AGENT)) : ($.getdata('JDUA') ? $.getdata('JDUA') : "jdapp;iPhone;9.4.4;14.3;network/4g;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1")
            }
        }
        $.post(options, (err, resp, data) => {
            try {
                if (err) {
                    console.log(`${JSON.stringify(err)}`)
                    console.log(`${$.name} API请求失败，请检查网路重试1`)
                } else {
                    if (data) {
                        data = JSON.parse(data);
                        //console.log(data.data.biz_msg);//$.advertDetailsname
                         $.log(`逛活动: ` + $.advertDetailsname +` `+ data.data.biz_msg);
                        //{  code: 0,  data: {    biz_code: 0,    biz_msg: 'OK',    result: { advertDetails: [Array] },    success: true  },  rtn_code: 0}
                        //$.dataJson1=data;
                            //for (let vo of $.dataJson.data.result.taskInfos ) {
                                
                            //}
                    } else {
                        console.log(`服务器返回空数据`)
                    }
                }
            } catch (e) {
                $.logErr(e, resp)
            } finally {
                resolve();
            }
        })
    })
}

//鲤鱼红包领逛活动领红包
function Get1_3GetHB() {
    return new Promise(async resolve => {
        const options = {
            url: `https://api.m.jd.com/api?appid=jinlihongbao&functionId=h5receiveRedpacketAll&loginType=2&client=jinlihongbao&t=${Date.now()}&clientVersion=10.3.5&osVersion=-1`,
            body: `body=%7B%22taskType%22%3A4%2C%22random%22%3A%2273302411%22%2C%22log%22%3A%221644118589727~1NiNpqsIkcCMDFZZEVnTzAyMQ%3D%3D.aFJxU35oU3RUe21Udhl3alY%2FXw4VXHIyMWhIc0t4dVU7VTFoGj8MCykNfC4CCi58NiwSMWg3ARtcdxEeJw%3D%3D.9c01c567~7%2C1~AE13DC4B23DA8D2ECF47257ED21CBB62283750BE~06auitb~C~ShBGXxIKaGwfE0deWRACYxFVBh8FdR1wZh4JeH4dAh8DAAQeTBofE1cFHgR2HnBmHAl5AR8AHQAEAhRMER0RVgIfB3UecGUcCnoDHUYcQBBlFBFWQVwRCAIeEEFDEgkTAgcHBAUDAA0EBgsABAACBQsQHBJEVFcTCRJARkxMR1dGVBEeE0VXUxIKEVdVRUdEQEdZGh8TQ1ZdEAtpBh4GBwQdCh0CABgDFA1uHRFYWRALAR4QU0MRCxFQVlUCCgpeBwUKBQpTVFAEV1NTAgdSAlYDVQNeDAIGVxAfEF9CEAgSfFpfRkkTUVVAW1AFBREeEUYTCAMEBAQCAAsECwkDAA8UEVtYEAkQHFECAFUCBgZSAFEJUB8IXFJQBgAFBgcDVAoFBFJUHgIAAQAKCQ4AUwUCBwRQUFcABQFVBwBUAwQCUFsIVQZQCgMBBAoQHhJWQ1MRCxFKX3ZIUQp4fmF5C2BReWcdYH1zCwNFYRYeGlZFEwkQdF1eVV5XEHldUh0THxJaU04aCRMKAAcECRAeEENTQRMJagQIBB4LDgNsHxBBXRMIaRBgcnZ8AwERHBZTVlxBXlpWER4TAwIQHBICAR0CHQUWHhoBAQUFChEeEwIBBgYBBQAFBAACBwQLDAAcBQECAQcECgEFAwcCAgcGBhYeGgkRbB8QWl1QEAgQVlZVV1VXR0QWHhpZWRMJEEYQHRBRWxIKEUYAHwEeABAUGlBXbEQRCBMCABAcElFVEQsRQlVcXFdeDAQBAAIDBgMDEhwRXFkTCWsFHggUA2wfEFFeXlUQCBIBBQUHAAIHBQAMCQIGTQNaawZheVF3WF5yfnV1Am1fckpQW3JKflUMDxxgAWJkaQN%2Fe2VYYGxrWH9nZEtnd3hkZGR7dmRGdUoJYHZ5enx2dlZqZV1%2FUWphSHt5cWByek1jCW5lfAJiWlpjd0tdXn9EZBxzWUNjZ3lXAXh3c0B6cHR1fEh9dWNbXgF3d3xzfWJ8dWJieHl5W0FkdWdCS3BER2Z7UUtKZlprYXdgRX1jSFN8cltGHHR1BlR0YmBRf3d4V3dwVUh%2BWXdwc2FTA3NtfXd0Z1FLc0ldanhxfUd7S3wAeHB3AHZZcGBzSVUAcGZVaXhiVntzYWF2ZEJidHIDBnpwY1V7YHFmZHlKQlF1XncAd3YIY3dLXnB0YHMAeHdeWndhV3t7Qml9dURCd39lZ2BzY2J7emFjUmJOWU57d3h%2BHARQAwEKBQdUTUkfAE1OSnBGbHFVe2BUSnZkZF5Wd2JJdWBfV1ZlaXJydWVgUmdzUWd0cmZmdwIFZmJcXW1tYWdpdAJ%2FZ3VgUXFlSUlxdHIJfHBfU2V2YVFidHcGZ3NXfXRncVJWdmJKcGliCHFwSwZ3YEpdUWdYZGtpW2JhcE9hcHdmCmtnZwZqdgB2ZGRxWnJ3BVFtamIMDkwDB1UKRwRdEh8TXkJUEg4QGkU%3D~1qoo8gq%22%2C%22sceneid%22%3A%22JLHBhPageh5%22%7D`,
            headers: {
                "authority": "api.m.jd.com",
                "Content-Type": "application/x-www-form-urlencoded",
                "accept": "application/json, text/plain, */*",
                "referer": "https://happy.m.jd.com/babelDiy/zjyw/3ugedFa7yA6NhxLN5gw2L3PF9sQC/index.html?channel=9",
                "origin": "https://happy.m.jd.com",
                "Cookie": cookie,
                "User-Agent": $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : (require('./USER_AGENTS').USER_AGENT)) : ($.getdata('JDUA') ? $.getdata('JDUA') : "jdapp;iPhone;9.4.4;14.3;network/4g;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1")
            }
        }
        $.post(options, (err, resp, data) => {
            try {
                if (err) {
                    console.log(`${JSON.stringify(err)}`)
                    console.log(`${$.name} API请求失败，请检查网路重试1`)
                } else {
                    if (data) {
                        data = JSON.parse(data);
                        //console.log(data);
                        $.log(`逛活动兑换红包: ` + data.data.biz_msg);
                        //{  code: 0,  data: { biz_code: 11, biz_msg: '您已成功领取红包，快去买买买吧~', success: false },  rtn_code: 0}
                        //$.dataJson1=data;
                            //for (let vo of $.dataJson.data.result.taskInfos ) {
                                
                            //}
                    } else {
                        console.log(`服务器返回空数据`)
                    }
                }
            } catch (e) {
                $.logErr(e, resp)
            } finally {
                resolve();
            }
        })
    })
}

//鲤鱼红包领逛互动任务
function Get2DoTask() {
    return new Promise(async resolve => {
        const options = {
            url: `https://api.m.jd.com/api?appid=jinlihongbao&functionId=startTask&loginType=2&client=jinlihongbao&t=${Date.now()}&clientVersion=10.3.5&osVersion=-1`,
            body: `body=%7B%22taskType%22%3A%228%22%2C%22random%22%3A%2260203011%22%2C%22log%22%3A%221644119567362~1D59sXFzLDUMDFZZEVnTzAyMQ%3D%3D.aFJxU35oU3RUe21Udhl3alY%2FXw4VXHIyMWhIc0t4dVU7VTFoGj8MCykNfC4CCi58NiwSMWg3ARtcdxEeJw%3D%3D.9c01c567~7%2C1~68BBFB36ABD69E03CB0956AB76688EC8A9DA453C~1vix5ou~C~ShNAWREKa2wcEUVdXBEObxFXBh8CaB1zARh4aQgGHAIfAwEDGEARHxFWBB8Aaxh2Bhx7aAl4HQIfAwQEH0cRHhFWABwFbh9yBR17anACHUYYUhFuHxBUQF8TDgAfEkNCEgkTAgcHAAUCCwYLAwUBAAIHCwQSHRJEVFcTCRZAR0dHRlVHVxMYFkRVURMKEVdVRUdAQEZSER4RQlVfFg5oBBwHBwsdCh0CBBgCHwZvHxBbWxYOABwSUkMRCxFQVlECCwFVBgcLBghVUVEGVVJTAgdSAlYHVQJVBwMEVhMdFlpDEgoTfFpfRkkTVVVBUFsEBxAdE0AWCQEGBQQCAAoEBQMHBQEfEFlZEwsWGVAAAlQCBgZSAFENUB4DV1NSBwMHAAICVggEBFJUHgIABQALAgUBUQQBBQJVUVUCBAFVBwBUAwACUVADVARRCQEHAQsSHBNWQ1MRCxFOX3dDWgt6f2J7DWVQe2UcYH1zCwNFZRYfEV1EEQgTdltbVFxVEXldUh0THxZaUkURCBELAwUCDBEcEkJTQRMJagQMBB8ABQJuHhNDWxYJaxJhcnZ8AwERGBZSXVdAXFtVExgWAgASHRICAR0CHQEWHxEKAAcECRMYFgMDBAcBBQAFBAAGBwUABwEeBAIABwIFCAMEAwcCAgcGAhYfEQIQbh4TWFtVEQoSV1ZVV1VXR0AWHxFSWBEIE0QWGBFTWRMKEUYAHwEaABEfEVFVbUcTDhYDAhIdElFVEQsRRlVdV1xfDgQBAwQHAwEBExwRXFkTCW8GHwMfAm4eE1NYW1QSChMBBQUHAAIDBQEHAgMETABYbQNge1N2WF5yfnV1Bm1eeUFRWXNJfFMJDh5iAGJkaQN%2Fe2FYYWdgWX1mZ0lhcnlmZmV7dmRGdUoNYHdycX10d1VoY1h%2BU2hgSHt5cWByfk1iAmVkfgNhWFxmdklfX39EZBxzWUdjZnJcAHp2cEJ8dXV3fkl9dWNbXgFzd314dmN%2BdGFgfnx4WUNldWdCS3BEQ2Z6WkBLZFtoY3FlRH9hSVN8cltGHHB1B19%2FY2JQfHV%2BUnZyV0l%2BWXdwc2FXA3JmdnZ2ZlJJdUxcaHpwfUd7S3wAfHB2C31YcmFwS1MFcWRXaHhiVntzYWV2ZUlpdXACBXh2ZlR5YnBmZHlKQlFxXnYLfHcKYnRJWHV1YnEBeHdeWndhU3t6SWJ8d0VBdXlgZmJxYmJ7emFjUmZOWEVwdnp%2FHwZWBgAIBwZUTUkfAE1KSnFNZ3BXemNWTHNlZlxXd2JJdWBfU1ZkYnlzd2RjUGF2UGV2c2ZmdwIFZmZcXGZmYGVodwB5YnRiU3BlSUlxdHINfHFUWGR0YFJgcnIHZXFWfXRncVJWcmJLe2JjCnBzSQByYUhfUGdYZGtpW2ZhcURqcXVnCWlhYgdodAF2ZGRxWnJzBVBmYWMOD08BAVALRQZcEh8TXkJUFg4REU4%3D~07mh0tc%22%2C%22sceneid%22%3A%22JLHBhPageh5%22%7D`,
            headers: {
                "authority": "api.m.jd.com",
                "origin": "https://happy.m.jd.com",
                "accept": "application/json, text/plain, */*",
                "referer": "https://happy.m.jd.com/babelDiy/zjyw/3ugedFa7yA6NhxLN5gw2L3PF9sQC/index.html?channel=9",
                "Content-Type": "application/x-www-form-urlencoded",
                "Cookie": cookie,
                "User-Agent": $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : (require('./USER_AGENTS').USER_AGENT)) : ($.getdata('JDUA') ? $.getdata('JDUA') : "jdapp;iPhone;9.4.4;14.3;network/4g;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1")
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
                        //console.log(data);
                        //{"code":0,"data":{"biz_code":0,"biz_msg":"领取任务成功","success":true},"rtn_code":0}  领任务成功
                        if(data.data.biz_msg==="领取任务成功"){ //领取任务成功继续操作
                            $.log(`逛互动任务: ` + data.data.biz_msg);
                        }else{
                            $.log(`逛互动任务: ` + data.data.biz_msg);
                        }    
                    } else {
                        console.log(`服务器返回空数据`)
                    }
                }
            } catch (e) {
                $.logErr(e, resp)
            } finally {
                resolve();
            }
        })
    })

};

//鲤鱼红包领逛互动详情
function Get2_1DoTask() {
    return new Promise(async resolve => {
        const options = {
            url: `https://api.m.jd.com/api?appid=jinlihongbao&functionId=getTaskDetailForColor&loginType=2&client=jinlihongbao&t=${Date.now()}&clientVersion=10.3.5&osVersion=-1`,
            body: `body=%7B%22taskType%22%3A%228%22%7D`,
            headers: {
                "authority": "api.m.jd.com",
                "Content-Type": "application/x-www-form-urlencoded",
                "accept": "application/json, text/plain, */*",
                "referer": "https://happy.m.jd.com/babelDiy/zjyw/3ugedFa7yA6NhxLN5gw2L3PF9sQC/index.html?channel=9",
                "origin": "https://happy.m.jd.com",
                "Cookie": cookie,
                "User-Agent": $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : (require('./USER_AGENTS').USER_AGENT)) : ($.getdata('JDUA') ? $.getdata('JDUA') : "jdapp;iPhone;9.4.4;14.3;network/4g;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1")
            }
        }
        $.post(options, (err, resp, data) => {
            try {
                if (err) {
                    console.log(`${JSON.stringify(err)}`)
                    console.log(`${$.name} API请求失败，请检查网路重试1`)
                } else {
                    if (data) {
                        data = JSON.parse(data);
                        
                        //{  code: 0,  data: {    biz_code: 0,    biz_msg: 'OK',    result: { advertDetails: [Array] },    success: true  },  rtn_code: 0}
                        $.dataJson1=data;
                            //for (let vo of $.dataJson.data.result.taskInfos ) {
                                
                            //}
                    } else {
                        console.log(`服务器返回空数据`)
                    }
                }
            } catch (e) {
                $.logErr(e, resp)
            } finally {
                resolve();
            }
        })
    })
}

//鲤鱼红包领逛互动开始做任务
function Get2_2DoTask(id1) {
    return new Promise(async resolve => {
        const options = {
            url: `https://api.m.jd.com/api?appid=jinlihongbao&functionId=taskReportForColor&loginType=2&client=jinlihongbao&t=${Date.now()}&clientVersion=10.3.5&osVersion=-1`,
            body: `body=%7B%22taskType%22%3A%228%22%2C%22detailId%22%3A%22${id1}%22%7D`,
            headers: {
                "authority": "api.m.jd.com",
                "Content-Type": "application/x-www-form-urlencoded",
                "accept": "application/json, text/plain, */*",
                "referer": "https://happy.m.jd.com/babelDiy/zjyw/3ugedFa7yA6NhxLN5gw2L3PF9sQC/index.html?channel=9",
                "origin": "https://happy.m.jd.com",
                "Cookie": cookie,
                "User-Agent": $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : (require('./USER_AGENTS').USER_AGENT)) : ($.getdata('JDUA') ? $.getdata('JDUA') : "jdapp;iPhone;9.4.4;14.3;network/4g;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1")
            }
        }
        $.post(options, (err, resp, data) => {
            try {
                if (err) {
                    console.log(`${JSON.stringify(err)}`)
                    console.log(`${$.name} API请求失败，请检查网路重试1`)
                } else {
                    if (data) {
                        data = JSON.parse(data);
                        //console.log(data.data.biz_msg);//$.advertDetailsname
                         $.log(`逛互动: ` + $.advertDetailsname +` `+ data.data.biz_msg);
                        //{  code: 0,  data: {    biz_code: 0,    biz_msg: 'OK',    result: { advertDetails: [Array] },    success: true  },  rtn_code: 0}
                        //$.dataJson1=data;
                            //for (let vo of $.dataJson.data.result.taskInfos ) {
                                
                            //}
                    } else {
                        console.log(`服务器返回空数据`)
                    }
                }
            } catch (e) {
                $.logErr(e, resp)
            } finally {
                resolve();
            }
        })
    })
}

//鲤鱼红包领逛互动领红包
function Get2_3GetHB() {
    return new Promise(async resolve => {
        const options = {
            url: `https://api.m.jd.com/api?appid=jinlihongbao&functionId=h5receiveRedpacketAll&loginType=2&client=jinlihongbao&t=${Date.now()}&clientVersion=10.3.5&osVersion=-1`,
            body: `body=%7B%22taskType%22%3A8%2C%22random%22%3A%2216252611%22%2C%22log%22%3A%221644120134570~1BeVTqoeHpTMDFZZEVnTzAyMQ%3D%3D.aFJxU35oU3RUe21Udhl3alY%2FXw4VXHIyMWhIc0t4dVU7VTFoGj8MCykNfC4CCi58NiwSMWg3ARtcdxEeJw%3D%3D.9c01c567~7%2C1~7F6872FB827D1FCA50CDCD69D4D9D42E023DE9F2~0ikgmem~C~ShJHXRIIbxBVBR0HZB0IAR0EZnsfBB0AAQAfRBIeFlYHHgZjHAlzHgVmABgCGwMAARxHEhwQUAQcBWAdCQMcBmd2HwUdBQMAHUQRHBJWAh8HYxwIfB0EZGYcAhoDBQMcRRIfElQEGQR%2BH3F2HAVndh0BHQQDBR9EE20fEkRcWRALaBJVBRwFcx11dBhwAHZjHQEdAAACGEYTHxJVBxwFcx11dBhwAHV%2BHQEdAAACGEYTHxJVARwFcB11dBhwAHR0HUUfRBJvGBBWQV4TCgQcEEJDEQ4RBAUEBQECCQUEDAEDAQUBCAkSHhNHVlARDxFERURHRFZHUhAdEUdUURMKEFdWR0BHQUZRExwRQFRcFghqBxwHCAEcCx0BAxgCGQZtHRJZWhIIBx4TUEMTChNRV1QGCwZVAQcJBglSVVIEUVFSAgZQA1QDUwBWBwUEUREcE15DEgoQeFtfRkgRUVBCUVkGBxYfF0cSCwEFBAQDBgIAAAQEBwEcEFtbEQ4RGFAAA1UBBQdTBVAIVx0BVFBRBwMGBwICUwsFBVFWHQMBBQYJAgYCUgcABgdRUVEBAAJWBwNWAAQEVlEBVQdSCAEDBwkSHxZVRVESCxJJW3RCXQt4fmN7CWBTeWQdY3pxDQFGYBIfEl5EFggTdF9eV11VEnheUBoRGRFeUEYRChILBgYHCxIdEkJTQBMKaAMLBR8DBwBuHBJAWxALaBJhcnR9AgESHxZSW1dCXllXEhwQBQITHxIAAB8DHAQSHxYKBwcGCRIfEgABAAQABQEHBQICAQcDBwceAwABAgYFCAMHBwYCAgYEBhMcEAASbhgRXFxREwoRVlZUUlRXR0QTHBNRWBMKEUERGRFTWBIJEkcBGgAfBxIdElJWbUcSCRYDBxEcE1JXEgoQRlNfV19cDQAGAAQCBQUCFx8SXFoRCmsDAR4AABwEbR0SUF1fVBYJFwIGBQQCAQcDBgYAAgdPAVhpBWJ7UHNbWHB9dXYBaV14RlFbckh8VwwNHGMBYWNrBX14ZFxhZGNZemZnS2V3emdmZnp1ZkF3TApkdXFxf3d3UGtmX31SaGBIenlyYnV5TGIBZ2Z%2BAWBbXGB0Sl9ff0ZlHXNaQGNmdFwCeHRyQ3hzcnV%2FS313YllfAHZzfX92ZH52YWF5eHtbR2Z0Z0NJcUZHYHhZQE1kXGpidGFEf2FKV31yW0cedHAEXn1hYlZ%2BcXlWdHJUSH5YcnFzYVMGcWR1dnRkUExyTVxoe3F%2BRHpKeQF5d3UJfltxYXBKVAVxYVRpeWFUeHJgZXBnSWp2cwEEe3NiVH1hdGVneUlAUnVYcQp%2BdglhdUlcc3dicgR7cVxZd2JUf3lIZXx1REB1fWVlYHBjYXx4Z2FRY0pYRnN2fX8fBFIDAwkHBVVOSxgCS01Oc05nclR6ZlVJdGZnXFd3Y0l2YlhUV2Rhe3F3ZmJTYXBSZnZzZmR2AwVlYVxcYGZiZ2p1AX1kc2BScmVLSHN1cwh4cVNYY3RiUmF1dgRndVV8dGZzU1R2ZEl4YmUKd3FIBXZhSF9TY1lka2hZYmRyRWhzdWELbWZmBWh3AHZlYXBacncAU2RiYwwNTQQGUQtFB10RHBJfR1UTCRITTQ%3D%3D~136jr20%22%2C%22sceneid%22%3A%22JLHBhPageh5%22%7D`,
            headers: {
                "authority": "api.m.jd.com",
                "Content-Type": "application/x-www-form-urlencoded",
                "accept": "application/json, text/plain, */*",
                "referer": "https://happy.m.jd.com/babelDiy/zjyw/3ugedFa7yA6NhxLN5gw2L3PF9sQC/index.html?channel=9",
                "origin": "https://happy.m.jd.com",
                "Cookie": cookie,
                "User-Agent": $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : (require('./USER_AGENTS').USER_AGENT)) : ($.getdata('JDUA') ? $.getdata('JDUA') : "jdapp;iPhone;9.4.4;14.3;network/4g;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1")
            }
        }
        $.post(options, (err, resp, data) => {
            try {
                if (err) {
                    console.log(`${JSON.stringify(err)}`)
                    console.log(`${$.name} API请求失败，请检查网路重试1`)
                } else {
                    if (data) {
                        data = JSON.parse(data);
                        //console.log(data);
                        $.log(`逛互动兑换红包: ` + data.data.biz_msg);
                        //{  code: 0,  data: { biz_code: 11, biz_msg: '您已成功领取红包，快去买买买吧~', success: false },  rtn_code: 0}
                        //$.dataJson1=data;
                            //for (let vo of $.dataJson.data.result.taskInfos ) {
                                
                            //}
                    } else {
                        console.log(`服务器返回空数据`)
                    }
                }
            } catch (e) {
                $.logErr(e, resp)
            } finally {
                resolve();
            }
        })
    })
}

//鲤鱼红包领逛频道任务
function Get3DoTask() {
    return new Promise(async resolve => {
        const options = {
            url: `https://api.m.jd.com/api?appid=jinlihongbao&functionId=startTask&loginType=2&client=jinlihongbao&t=${Date.now()}&clientVersion=10.3.5&osVersion=-1`,
            body: `body=%7B%22taskType%22%3A%225%22%2C%22random%22%3A%2240368411%22%2C%22log%22%3A%221644120386908~1OYpt2VLBSdMDFZZEVnTzAyMQ%3D%3D.aFJxU35oU3RUe21Udhl3alY%2FXw4VXHIyMWhIc0t4dVU7VTFoGj8MCykNfC4CCi58NiwSMWg3ARtcdxEeJw%3D%3D.9c01c567~7%2C1~05E06E196AFCB0DB7B15C6C6BD4A73FDDF9DDD52~0yfg0cm~C~SRJFXxIOam0fEEdeXhILYxRXBR4BaxxwAR0HdX5gHAIcAwADHEUaGhFUBB0CaB5yAB4FcX1%2FHwMdAAMAHUwUHxJXAR4BahxzAxwBdH1%2FHkYcVRJsFBRUQl0SCQYeEkJBEg4TAQUGBwEBAAALAwYEBwQGBQoSHRBHUVUSCRBHREdERV5DVRIfEkRVUxILEFZSRURHRkZRERwTSFJdEglrBxwECAAeCRgAAB8DHwVuHBNSXBEKABwRU0ESCxBRUVQGCwBVBAcJBgFXVlIFVVBTAwZQAVUHUAFVBgIHVxIdGlhDEgkSf1lcRUkSUVVDU1sEBxIfEkUaDAIGBwQCAgIDCQQJBAkcEVhYEgkSHFsGAVUBBQRRA1IIVh0EVVFSBwEGBwYAXg4GBFJVHgMBAQUKAQICUgUCBwZSUlQKAwJWBQNWAAYGU1EAUgZTCwIABQsSHRpQQ1IRChFKWXRBWwl9fGN5C2JTeGUcaHhxCAFGYhIeEl9EEg4Td1xdVFxWEHhWVR0SHxJdUUQSCxAJBgUGCxAfEkBTQxoMaAcLAB8DBABsHhJGXhIJaRFgcXV8CAYRHBFRXVRAX1hWEhgTAQMQHxICAB8LGAYSHxIKAgYGCRAcFgEDBwQCBgIGBAsEAAYABAAdBAMAAQYCCQMGAQcDAgYEDhQfEgISbhwQWV5TEg4TVlVUVVZVREUaGhFRWRIJEkcSHRBTXRMKEUUAHgEeBRoaEVNVb0USCBIBABIYE1JXEAkSQVFfXFleDQcAAAYKBAADEhgTXVkQCWsBHAEUBm4cEVJfX1USCxABAgUEAgMEAQEEAAkBTQFaaQRjeVN2Wl13fHR1AGpdeUJSUndLfVQNDh5gAWNlaAR%2FeGZeYWRgW39sYEtldXplZmZ7dGdFcEgJZ3Zycnx3dFxvZFx%2BU2thSnh5cGF1e0liA2VmfgFhUV5hdUpfXX9FZR5wWkdmZXJdAXl3cUJwd3V3fUh%2BdmBYXgB3d397dmN%2BdmNhe3B9WkNndWdDSnFGRWJ9WENKZVppYXVgT3liSFB%2FcFhFH3VzBFh9YWJQfnR5VnR6UUt%2BWXZwcmBTBnNlcXV1Z1FLcUtfaXJ3fkR5SH4DenR0Cn5ecGNySFQBcWRWYX5iV3tyYWFwZktod3cBBHpwYVd6YnBuYXtJQFJ2WncIfncJZHRIX3N1YnIAeXxZWnZhV3x5SGF%2FdkdEdX1nZ2FxYGJ5c2RhUWFKWEZxdHh%2FHgNTAgAKBAdXTkkUB01OTXJNZHBUeWBXTHZmZV5Vd2JId2laVFJkYXlxdmZjU2V2UmV1cGVldQEFbWRbX2ZlYWZodgB%2FZnNjU3JnSUhxdXABfnFXWGZ0YlFhd3QEYXBXfnVlclBVd25Oe2FiCXFySgR3YEhbUGdYZ2toW2JkekFqc3VlC2hnZgVqdAR3Z2ZwWHF0AVJtZGINDk4DBVYIRARdFh0SXkFUEgkSE0U%3D~1x8ud8m%22%2C%22sceneid%22%3A%22JLHBhPageh5%22%7D`,
            headers: {
                "authority": "api.m.jd.com",
                "origin": "https://happy.m.jd.com",
                "accept": "application/json, text/plain, */*",
                "referer": "https://happy.m.jd.com/babelDiy/zjyw/3ugedFa7yA6NhxLN5gw2L3PF9sQC/index.html?channel=9",
                "Content-Type": "application/x-www-form-urlencoded",
                "Cookie": cookie,
                "User-Agent": $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : (require('./USER_AGENTS').USER_AGENT)) : ($.getdata('JDUA') ? $.getdata('JDUA') : "jdapp;iPhone;9.4.4;14.3;network/4g;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1")
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
                        //console.log(data);
                        //{"code":0,"data":{"biz_code":0,"biz_msg":"领取任务成功","success":true},"rtn_code":0}  领任务成功
                        if(data.data.biz_msg==="领取任务成功"){ //领取任务成功继续操作
                            $.log(`逛频道任务: ` + data.data.biz_msg);
                        }else{
                            $.log(`逛频道任务: ` + data.data.biz_msg);
                        }    
                    } else {
                        console.log(`服务器返回空数据`)
                    }
                }
            } catch (e) {
                $.logErr(e, resp)
            } finally {
                resolve();
            }
        })
    })

};

//鲤鱼红包领逛频道详情
function Get3_1DoTask() {
    return new Promise(async resolve => {
        const options = {
            url: `https://api.m.jd.com/api?appid=jinlihongbao&functionId=getTaskDetailForColor&loginType=2&client=jinlihongbao&t=${Date.now()}&clientVersion=10.3.5&osVersion=-1`,
            body: `body=%7B%22taskType%22%3A%225%22%7D`,
            headers: {
                "authority": "api.m.jd.com",
                "Content-Type": "application/x-www-form-urlencoded",
                "accept": "application/json, text/plain, */*",
                "referer": "https://happy.m.jd.com/babelDiy/zjyw/3ugedFa7yA6NhxLN5gw2L3PF9sQC/index.html?channel=9",
                "origin": "https://happy.m.jd.com",
                "Cookie": cookie,
                "User-Agent": $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : (require('./USER_AGENTS').USER_AGENT)) : ($.getdata('JDUA') ? $.getdata('JDUA') : "jdapp;iPhone;9.4.4;14.3;network/4g;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1")
            }
        }
        $.post(options, (err, resp, data) => {
            try {
                if (err) {
                    console.log(`${JSON.stringify(err)}`)
                    console.log(`${$.name} API请求失败，请检查网路重试1`)
                } else {
                    if (data) {
                        data = JSON.parse(data);
                        
                        //{  code: 0,  data: {    biz_code: 0,    biz_msg: 'OK',    result: { advertDetails: [Array] },    success: true  },  rtn_code: 0}
                        $.dataJson1=data;
                            //for (let vo of $.dataJson.data.result.taskInfos ) {
                                
                            //}
                    } else {
                        console.log(`服务器返回空数据`)
                    }
                }
            } catch (e) {
                $.logErr(e, resp)
            } finally {
                resolve();
            }
        })
    })
}

//鲤鱼红包领逛频道开始做任务
function Get3_2DoTask(id1) {
    return new Promise(async resolve => {
        const options = {
            url: `https://api.m.jd.com/api?appid=jinlihongbao&functionId=taskReportForColor&loginType=2&client=jinlihongbao&t=${Date.now()}&clientVersion=10.3.5&osVersion=-1`,
            body: `body=%7B%22taskType%22%3A%225%22%2C%22detailId%22%3A%22${id1}%22%7D`,
            headers: {
                "authority": "api.m.jd.com",
                "Content-Type": "application/x-www-form-urlencoded",
                "accept": "application/json, text/plain, */*",
                "referer": "https://happy.m.jd.com/babelDiy/zjyw/3ugedFa7yA6NhxLN5gw2L3PF9sQC/index.html?channel=9",
                "origin": "https://happy.m.jd.com",
                "Cookie": cookie,
                "User-Agent": $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : (require('./USER_AGENTS').USER_AGENT)) : ($.getdata('JDUA') ? $.getdata('JDUA') : "jdapp;iPhone;9.4.4;14.3;network/4g;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1")
            }
        }
        $.post(options, (err, resp, data) => {
            try {
                if (err) {
                    console.log(`${JSON.stringify(err)}`)
                    console.log(`${$.name} API请求失败，请检查网路重试1`)
                } else {
                    if (data) {
                        data = JSON.parse(data);
                        //console.log(data.data.biz_msg);//$.advertDetailsname
                        console.log(data);
                         $.log(`逛频道: ` + $.advertDetailsname +` `+ data.data.biz_msg);
                        //{  code: 0,  data: {    biz_code: 0,    biz_msg: 'OK',    result: { advertDetails: [Array] },    success: true  },  rtn_code: 0}
                        //$.dataJson1=data;
                            //for (let vo of $.dataJson.data.result.taskInfos ) {
                                
                            //}
                    } else {
                        console.log(`服务器返回空数据`)
                    }
                }
            } catch (e) {
                $.logErr(e, resp)
            } finally {
                resolve();
            }
        })
    })
}

//鲤鱼红包领逛频道领红包
function Get3_3GetHB() {
    return new Promise(async resolve => {
        const options = {
            url: `https://api.m.jd.com/api?appid=jinlihongbao&functionId=h5receiveRedpacketAll&loginType=2&client=jinlihongbao&t=${Date.now()}&clientVersion=10.3.5&osVersion=-1`,
            body: `body=%7B%22taskType%22%3A5%2C%22random%22%3A%2224075511%22%2C%22log%22%3A%221644121211793~1ZZaIuZnm4RMDFQTGJ6TjAyMQ%3D%3D.YXpWTn9ifVNCfWN8VAR4aC0oNSA9Pg8DMGFgVFZ5fH0cSDBhMhgRCiAlWzMDAwZbKy0bGU8qABJ0UAwfLg%3D%3D.ad7d2812~7%2C1~CA5667178F313B8A3E7177AA003F9CB032F4912D~1sjnaci~C~ShJHWRAOaRZVBh4FeB4IeBxhfWodAh8DAQEcRxYeFlYCHAV7HAlqHGF%2BexwCHwMBAx1FEh8WVgIfAXgcCnIdYn5mHAAeAwEDHUcTHRJXAh8BexgIex9gfnccAB4BAAMdRxMfE1UGHgF4GAtsHWBjcR0DHgEAARxHE24dEUVfXREOaRZWARwFdBx0ChwAeGUBHwAdAQMBHUQRGBBQBRkEdx91CR4BeWdjHAIfAwEDHUUSHxZWBR8BeRx2CB0DeGlmHUUfRRFsHxNWQl0WCAUeFkJDEQoTAwYFBAACAgAHAwYCCAEBBAYWHhZGVVcSCxBERURFRFVEVRMfE0ZVUhYIFlRSRURHRERTEh0SQVRdEwlqBx0HCAAYCxgDBB0BHwVsHhJbWhMKAh0RUkATCxJSUVcCCgZXBAcJBgtRVFIHVVBSAgdSAlQDUgVUAAMDVRIfEl9CEgsSfVldREsRUlBDU1sCBhYeFkUSCQEHBgQAAgACAgAECAAdE1pYFggWH1cBAlYCBAVRAFIIVB4BV1BSBAMGBwIDUgoBBVFWHQIBAQUIAAYAUwUBBwdQUlYGBwVUAgJVAwQHUFMBVgZTCwEABAsTHRJVRFAWCBZLW3dAWAt5fGN7CWJSeGQeYX9yCwZEZRAYE15FEgsQd15fVlxWEXpfUB8THBFaU0IQDhMJAQQHChIdEkJTQRMJagQJARwAAgJpHhZDXxEKahBgc3V8AAMTHxNSX1VCXF1WFh4WAAARHBMDAB8DHwURHREIAQUHCBEYEAQBAAcBBQEHBwMDAwcDBwIeBwAAAgYFDAEBAQACAQUFBxAcEwETbR8TWl5SEwsSVVJUUlRSRUQRHBNTWhMKE0URHRFSWhMLEkQHHAYcABMcEVNXbUYTChMAARMfE1FVEwoRRlNaVltcDQEEAQUFBAEAEh8TXlsRC2oIHwYAGAAGbBwRUl1dVxMKEwEFBQcAAQAABAIDCwdMBUsDUHFLVVhIclx9d3cBaF57Q1NZdUp5VQkMHmEBY2VoAX55ZV9jZ2JYf2VmS2F0fmRiZXt2ZUR2SQhkdXFxfnR0V2hmXH5XamVKfHlyYnF7S2EAZmd9AmFaWWF0SF9de0VhHXZbQ2RlcF0CeHRwQ3twdXZ9SXx2YVxdBnV3f3t2YXx0YGB6eXtaQmd0Z0JJcURDYH1bR0hnWmljd2FGf2BIUH5wWUQedXEHWH5lY1Z8dHlWdHBXSX5bdnBzYVIEcGR1d3FmV0p1SV9renB%2FRHtIfAN7dXYJfVtwY3JOVQVwYFZpe2FWenJjYXNmSWt0cgMFeHJhU3tmc2JmeEpDU3dadAh%2BdQphdklfcHdicgR6cF1dd2JUf3hIYX90RkB3fGdkYXBiYnt%2FYGZTZktbRXN1e30fB1MCAAkEBldPSBwCSkxKcEpicnlydHNXYmUASFd5dQBwYHdHVWx0endsZ3ZRZnRzYnlIe2N2cFRidlkJY2Zmc313WHhke3JzYWZmAXd1RFZhcER0Y3hbdndxVV9icURlfXNIdFR0XEd1dmBUY3BiB3B3ZkVmaQB6Y3JadXBxRnlwdFsJZ2QAQ2d3YHZjdVlHcXhge2JlRwwNTQECWVFLX1kRGBBZQVMTChESTA%3D%3D~1ok7by3%22%2C%22sceneid%22%3A%22JLHBhPageh5%22%7D`,
            headers: {
                "authority": "api.m.jd.com",
                "Content-Type": "application/x-www-form-urlencoded",
                "accept": "application/json, text/plain, */*",
                "referer": "https://happy.m.jd.com/babelDiy/zjyw/3ugedFa7yA6NhxLN5gw2L3PF9sQC/index.html?channel=9",
                "origin": "https://happy.m.jd.com",
                "Cookie": cookie,
                "User-Agent": $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : (require('./USER_AGENTS').USER_AGENT)) : ($.getdata('JDUA') ? $.getdata('JDUA') : "jdapp;iPhone;9.4.4;14.3;network/4g;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1")
            }
        }
        $.post(options, (err, resp, data) => {
            try {
                if (err) {
                    console.log(`${JSON.stringify(err)}`)
                    console.log(`${$.name} API请求失败，请检查网路重试1`)
                } else {
                    if (data) {
                        data = JSON.parse(data);
                        //console.log(data);
                        $.log(`逛频道兑换红包: ` + data.data.biz_msg);
                        //{  code: 0,  data: { biz_code: 11, biz_msg: '您已成功领取红包，快去买买买吧~', success: false },  rtn_code: 0}
                        //$.dataJson1=data;
                            //for (let vo of $.dataJson.data.result.taskInfos ) {
                                
                            //}
                    } else {
                        console.log(`服务器返回空数据`)
                    }
                }
            } catch (e) {
                $.logErr(e, resp)
            } finally {
                resolve();
            }
        })
    })
}

//鲤鱼红包领逛店铺任务
function Get4DoTask() {
    return new Promise(async resolve => {
        const options = {
            url: `https://api.m.jd.com/api?appid=jinlihongbao&functionId=startTask&loginType=2&client=jinlihongbao&t=${Date.now()}&clientVersion=10.3.5&osVersion=-1`,
            body: `body=%7B%22taskType%22%3A%222%22%2C%22random%22%3A%2228565311%22%2C%22log%22%3A%221644883057253~16NjBXDQpOpMDFqZFliTzAyMQ%3D%3D.W1JtVndSVm5afFtdbhwFBgBgIz5TLT0qMVtIb054RlUnUDFbGi4LAiU7bTQAWAJ0M2IEPgopKRAiASs4FA%3D%3D.3f741b97~7%2C1~F98D93793EDD3C8F8CC1740BE5A6B54D285BF229~1usyehu~C~SBJCXhILa20dGkZcXRYJbRFWBh0HYh9yfx8FZ2RxHQkcAgAEH0IRHhFUBBwHYxpxeR0FZmQAHgMeBAMGH0YRHBFVAh0CYBxzeRwEbmR8HEEfUBFvHxJUQ10SDAIcE0NDEwIQAwYABw4LAAQIAQQDCAUACAYSHBNPV1YSDhFCR0ZHRFVEVRIaEUdUURILGlRUREBHQkZTERwRQVdeFAlrBRwHAQseCxwFAxoCHgZtHxNZWhQJAR0SU0IaCBBRUVYACwBVBAcIBAlXVlIHVVNSCQRTA1EAVwJUBwEEVREcFF1AEwoSfVFcR0gUUldBUVsGBxMfEkIRCgAGBAUACgEAAQQEBgEfEllaEQoUHh0EUwUJDAVUU1ADUgEAAwIFEx8SUENSEwoSRlF%2FfW8AZXkBVB5hHl9pY31VSndoeUYaHhBeQhEMEXVcX1RdVhB%2FXVMfEhwTVlNEEg4RDwEEAgARHRFDVUESC2sIAQgeAQYEbhoRQFwSCWoRYHJgfQEAEh0aU1xURlxfVxAfEgIAERwUAgAfBB4BGh4QCQYFBwMQHxIGAgAGAwAIAgQDBgsEBAMCHgIFAgAEBQMAAgUDAwMDBgIaHhABFm4aEVtcURELEVZQVVZXVkRFGh4QUV4RDBFHERwRUloSDBFHAh4CHwwQHhJXVWlFEAkSAwMRHBRRVBMKEkNZXFZfWQ4ECwcFBQAAAhIaEV1bEgpqCR4CHARuGhFQX19UEwkSBwUEBQgIAw8HCgQFA0gCa3tBfn5qQEBqe3x0dklZamR9ZUl3S39UDQ4fYnYPcVV5RHdkbWAdUwR1ZGJ2eUh7WFt1cVoIXWdhaFFiY1RydwRxQmtmVH1WWgdydkkEVHpSUXdxXmJheHFEA3RzUF95SXF%2Fe1dkE31wZQdiT35jfWJiAXpyTgJyWnlbYVBrBHFnflxWcXFRenNECX1mW0l5eEUJeEVfVnFkZnh6c2kAdEhBRHljZXp3eVVwfwd2Y2JYC1NQc2VTcXsAYXYAaH55AQV5dUEODx0DUQYAAQEGAk9HHABGTExySmdkZXV1YQNkdVhRZmZZYX53UEJ4dgVcYHBKcWFiYwp3YV9UQWFiaHZ0Y2lydV5cZGJYZn50XAZxc3BTZHlQf3lhYWpydkVqUnFzZlJwdVx0dnEBbXBFZX1ldFBkdWZ5U3YBXWFyRl9Wc3pZdXZhXAtNA0JBAAdcXxQfElxDVxMCEBBN~02ttumv%22%2C%22sceneid%22%3A%22JLHBhPageh5%22%7D`,
            headers: {
                "authority": "api.m.jd.com",
                "origin": "https://happy.m.jd.com",
                "accept": "application/json, text/plain, */*",
                "referer": "https://happy.m.jd.com/babelDiy/zjyw/3ugedFa7yA6NhxLN5gw2L3PF9sQC/index.html?channel=9",
                "Content-Type": "application/x-www-form-urlencoded",
                "Cookie": cookie,
                "User-Agent": $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : (require('./USER_AGENTS').USER_AGENT)) : ($.getdata('JDUA') ? $.getdata('JDUA') : "jdapp;iPhone;9.4.4;14.3;network/4g;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1")
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
                        //console.log(data);
                        //{"code":0,"data":{"biz_code":0,"biz_msg":"领取任务成功","success":true},"rtn_code":0}  领任务成功
                        if(data.data.biz_msg==="领取任务成功"){ //领取任务成功继续操作
                            $.log(`逛店铺任务: ` + data.data.biz_msg);
                        }else{
                            $.log(`逛店铺任务: ` + data.data.biz_msg);
                        }    
                    } else {
                        console.log(`服务器返回空数据`)
                    }
                }
            } catch (e) {
                $.logErr(e, resp)
            } finally {
                resolve();
            }
        })
    })

};

//鲤鱼红包领店铺详情
function Get4_1DoTask() {
    return new Promise(async resolve => {
        const options = {
            url: `https://api.m.jd.com/api?appid=jinlihongbao&functionId=getTaskDetailForColor&loginType=2&client=jinlihongbao&t=${Date.now()}&clientVersion=10.3.5&osVersion=-1`,
            body: `body=%7B%22taskType%22%3A%222%22%7D`,
            headers: {
                "authority": "api.m.jd.com",
                "Content-Type": "application/x-www-form-urlencoded",
                "accept": "application/json, text/plain, */*",
                "referer": "https://happy.m.jd.com/babelDiy/zjyw/3ugedFa7yA6NhxLN5gw2L3PF9sQC/index.html?channel=9",
                "origin": "https://happy.m.jd.com",
                "Cookie": cookie,
                "User-Agent": $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : (require('./USER_AGENTS').USER_AGENT)) : ($.getdata('JDUA') ? $.getdata('JDUA') : "jdapp;iPhone;9.4.4;14.3;network/4g;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1")
            }
        }
        $.post(options, (err, resp, data) => {
            try {
                if (err) {
                    console.log(`${JSON.stringify(err)}`)
                    console.log(`${$.name} API请求失败，请检查网路重试1`)
                } else {
                    if (data) {
                        data = JSON.parse(data);
                        
                        //{  code: 0,  data: {    biz_code: 0,    biz_msg: 'OK',    result: { advertDetails: [Array] },    success: true  },  rtn_code: 0}
                        $.dataJson1=data;
                            //for (let vo of $.dataJson.data.result.taskInfos ) {
                                
                            //}
                    } else {
                        console.log(`服务器返回空数据`)
                    }
                }
            } catch (e) {
                $.logErr(e, resp)
            } finally {
                resolve();
            }
        })
    })
}

//鲤鱼红包领逛店铺开始做任务
function Get4_2DoTask(id1) {
    return new Promise(async resolve => {
        const options = {
            url: `https://api.m.jd.com/api?appid=jinlihongbao&functionId=taskReportForColor&loginType=2&client=jinlihongbao&t=${Date.now()}&clientVersion=10.3.5&osVersion=-1`,
            body: `body=%7B%22taskType%22%3A%222%22%2C%22detailId%22%3A%22${id1}%22%7D`,
            headers: {
                "authority": "api.m.jd.com",
                "Content-Type": "application/x-www-form-urlencoded",
                "accept": "application/json, text/plain, */*",
                "referer": "https://happy.m.jd.com/babelDiy/zjyw/3ugedFa7yA6NhxLN5gw2L3PF9sQC/index.html?channel=9",
                "origin": "https://happy.m.jd.com",
                "Cookie": cookie,
                "User-Agent": $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : (require('./USER_AGENTS').USER_AGENT)) : ($.getdata('JDUA') ? $.getdata('JDUA') : "jdapp;iPhone;9.4.4;14.3;network/4g;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1")
            }
        }
        $.post(options, (err, resp, data) => {
            try {
                if (err) {
                    console.log(`${JSON.stringify(err)}`)
                    console.log(`${$.name} API请求失败，请检查网路重试1`)
                } else {
                    if (data) {
                        data = JSON.parse(data);
                        //console.log(data.data.biz_msg);//$.advertDetailsname
                        console.log(data);
                         $.log(`逛店铺: ` + $.advertDetailsname +` `+ data.data.biz_msg);
                        //{  code: 0,  data: {    biz_code: 0,    biz_msg: 'OK',    result: { advertDetails: [Array] },    success: true  },  rtn_code: 0}
                        //$.dataJson1=data;
                            //for (let vo of $.dataJson.data.result.taskInfos ) {
                                
                            //}
                    } else {
                        console.log(`服务器返回空数据`)
                    }
                }
            } catch (e) {
                $.logErr(e, resp)
            } finally {
                resolve();
            }
        })
    })
}

//鲤鱼红包领逛店铺领红包
function Get4_3GetHB() {
    return new Promise(async resolve => {
        const options = {
            url: `https://api.m.jd.com/api?appid=jinlihongbao&functionId=h5receiveRedpacketAll&loginType=2&client=jinlihongbao&t=${Date.now()}&clientVersion=10.3.5&osVersion=-1`,
            body: `body=%7B%22taskType%22%3A2%2C%22random%22%3A%2239299111%22%2C%22log%22%3A%221644884372534~1MSjTPpDzsXMDFLTGxnbjAyMQ%3D%3D.enpYU1ZzeF9VWHp7WBlbLShfIl0ZHl9UEHpgWktZZ30SVRB6MhsOIwQTWDEheSpBNkMlFj8sCDEKNC4ZNQ%3D%3D.05f5fd59~7%2C1~FA5C546DEA858859485A32FD347B496191259F56~0m82osd~C~ShJHXxEKb24cE0RfWRAIahFUBh0Fcx90ZhxpamQcBR0AAQAdQBAeE1cHHgZxHXdnHWppdh8BGgMAARxFFh4QVQIdBXIfdWQcAAADcB9FGEcSbBwTU0BcEwkBHxJAQhEKEwEFBgcIDAcDAwUEDAALCQcCERwRRlZUEwoRRkdEQEdWRFYTGBBFVFISCRJVV0dERURGUxEcFkNUXxILbwYeBgMGHwkfAAMcABwGbx8SXlkSCwEdFlFBEwkSUlVWBwsCVwQHCwQJVVZSB1VSVwMEUABVAFECVwcBBlQRHhFeRBEKE3xYWkdKEVJRQVNbBwcSHRJHEAkBAgcECQgFBwUABAAEHxJZWhEKEx0eB1AFDAcHV1NVBFYAAwMCBRIfE1VAUxIJEERZeXxvBWZ%2BBlQfYB5eaWN4V0l2aXlEEB8SWkUSCxJ2W11VXVYQel5QHxEcE15SRBEKFgoCBwEBFh4QQlBCEQpoCQMAHQMFAm4cFkFfEwpqFmJ2Yn4AAxIfE1JeVUJcW1cSGBEBABIdFgMCHwceAxIfEwoCBwEDEB8SAQADBwUCDAEGAgQDBQYABx4EBwAABgUCBwEDAQMDBwQBEx8SAhJuHRFZXlERCBFWUlVWV1ZFQBAeE1JaEQoRRBEcE1NaEAkSQwAeAx4FFh4QUlVvRRIJEwMCExwRUFcSDhFCUF5VW18PAgoCCgkCAAISHRJeWBEKbwscARwBaR4QU19fVBIJEwIGBQQLCgcDBgAGCQlPBXlLXUJhYkRZX2V9dXZLU2tmeWJKcEh8Uw8PH2J2CnJWeUd3ZGVhHVAAcmFhdXpJfFtadHRZC1xkYGpZYWFXdHcCdkNoZ1d9UVgDcHVIB1R4W1B1cFpiZXhzQwB3c1Nee0hzf3hXZht8c2YDYEl%2BY31iZQN5c0gAdll7WmNYagZyYn5aVHNxU3pyQwp7ZFtJfXpGAHlHXFJxY2Z6eHNpA3RIQ0R5Y2V7cnNVc3wDdmViWwtTUnJlUXR4BGN2AWl3fwEHfHVHDg0dAlEHAgEEBwFOQx8BT05Pdkxmc2l4dVdEZHVYWmhlSmZ%2FcgN%2BenddbVBzSXlpYmJfdmZcf19iWlB%2FcnJpd3ZJX2djSWpgYgFmfndhcFJ7cEB7ZgNpfXZGV2twY2pRdXZfd3VHRmZxc2FiYktfa3cARGh1AFhocUd6U3FiXnh1WUANSgNDBkkJDV4QHRFdQFcRCxESTA%3D%3D~1rk0i03%22%2C%22sceneid%22%3A%22JLHBhPageh5%22%7D`,
            headers: {
                "authority": "api.m.jd.com",
                "Content-Type": "application/x-www-form-urlencoded",
                "accept": "application/json, text/plain, */*",
                "referer": "https://happy.m.jd.com/babelDiy/zjyw/3ugedFa7yA6NhxLN5gw2L3PF9sQC/index.html?channel=9",
                "origin": "https://happy.m.jd.com",
                "Cookie": cookie,
                "User-Agent": $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : (require('./USER_AGENTS').USER_AGENT)) : ($.getdata('JDUA') ? $.getdata('JDUA') : "jdapp;iPhone;9.4.4;14.3;network/4g;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1")
            }
        }
        $.post(options, (err, resp, data) => {
            try {
                if (err) {
                    console.log(`${JSON.stringify(err)}`)
                    console.log(`${$.name} API请求失败，请检查网路重试1`)
                } else {
                    if (data) {
                        data = JSON.parse(data);
                        //console.log(data);
                        $.log(`逛店铺兑换红包: ` + data.data.biz_msg);
                        //{  code: 0,  data: { biz_code: 11, biz_msg: '您已成功领取红包，快去买买买吧~', success: false },  rtn_code: 0}
                        //$.dataJson1=data;
                            //for (let vo of $.dataJson.data.result.taskInfos ) {
                                
                            //}
                    } else {
                        console.log(`服务器返回空数据`)
                    }
                }
            } catch (e) {
                $.logErr(e, resp)
            } finally {
                resolve();
            }
        })
    })
}

//鲤鱼红包领逛店铺任务
function Get5DoTask() {
    return new Promise(async resolve => {
        const options = {
            url: `https://api.m.jd.com/api?appid=jinlihongbao&functionId=startTask&loginType=2&client=jinlihongbao&t=${Date.now()}&clientVersion=10.3.5&osVersion=-1`,
            body: `body=%7B%22taskType%22%3A%223%22%2C%22random%22%3A%2299492411%22%2C%22log%22%3A%221644885753102~12IdHQrwErsMDFLTGxnbjAyMQ%3D%3D.enpYU1ZzeF9VWHp7WBlbLShfIl0ZHl9UEHpgWktZZ30SVRB6MhsOIwQTWDEheSpBNkMlFj8sCDEKNC4ZNQ%3D%3D.05f5fd59~7%2C1~CEB25B62E3BFD6AB712B8047B9FE0563D30D33D9~0knoy18~C~SBNHXxYJb24cE0ReXxYLaBBXBB4Efhxxcx9meAJ6HwEfAAACGEURHhFVBB0HfR9zcR5gfwdwHAAeAAIEHUcQHxNXAR4Efh1xcBhneAcJHUUcVBZsHxBUQ10SCQIfE0BBFgkWAgYFBAgKAAIEAAYFAQMLBQsTHxBDVlARChNEREZARVVHVRMfEkRVUhMJEFJVQEdERUVREBgTQ1ZdEwlrBxwEAQQeDR8FAxwAHAVvGBNZWBELAhwRU0ATCRBVVlEFCANWBAYNBgpTVlMFVVBTAgdSAVEAVQJWBQEHVhYdEVxDEwkSf1ldREsSVVJGUFgHBBIeFkURCAIHBwQLCAYGBgEFAwYfEltbEggWHB4HUAQLBARWUFUDVgYBBAEGExwSVERTEQgRRlp9fG8HZ3wAUh5lHl5rY3tUTndre0QTHxJdRhELEXVbXFNfVRF5XlEaEx8QXVBFEgkSCgMFAwQRGBFDUkISCG8JAwIfAgUAbhwRQ1wQDmgWY3RifQACFh0RU11VQV9aVBEdEQMFERgRAQEeBBwEEx8QCgMFAQMSHxMGAQcFAQAIAgQDBQcHBQEFHAcGAwMHBwEBBgAEAAICBgMQGBMCEG4dEVlcURELEVRSVVJVVkVEEh4WUFkQCRNGEh8SUFgRCBZEBx0CHwQSHhZSVW1FEwkSAwIRHRFQUBEOEUJQXlRdWQwKCwcIAQQCAREdEV9eEQ5oAh0AHAJpHRFQX15UEgkSAgcHBgwLAAACAgYIC0oAeEtfQGJhR1pdZ352cktVa2Z8YUpzTHxUDw4fYnYKclZ5R3VhZmYcUwF2YmNwe0t6Wll2d1oIX2Zia11jZVd2dQJyQmxnVH5WWwJxdUgHVXhYV3Z1WWFme3NFB3ZxUVx%2BSXF9e1RkGH12ZgdiSXxhfmBlAXpwSwBxW3pbY1lqBHVgeVlVcnJRe3ZGCnlmWkt5e0QCe0RdVnFmZnp4c2oDc0lERXpjZnp1cVRzfAFxZmVZCFJTcmRXdnsCY3cDaXV7AAR%2BdEMOCR0DUwcDAwMEAUxEHQJOTU5xT2dwbntyVEdkdlhZbGdLZ3x3A354d19oUXNMeW1iYl13ZV56XmJaUH51cWp2dUlYZ2VLbWNhAGV%2FdmVwUXpxQnhiA2l%2Fd0RRbXFmalF3dlx0ckZEZHFwYWJlSFxrdANEaXMCW2lyR3tWc2Fde3dYQw5OA0IESwwKWBEcE11DVRYLERBO~1i3xx3j%22%2C%22sceneid%22%3A%22JLHBhPageh5%22%7D`,
            headers: {
                "authority": "api.m.jd.com",
                "origin": "https://happy.m.jd.com",
                "accept": "application/json, text/plain, */*",
                "referer": "https://happy.m.jd.com/babelDiy/zjyw/3ugedFa7yA6NhxLN5gw2L3PF9sQC/index.html?channel=9",
                "Content-Type": "application/x-www-form-urlencoded",
                "Cookie": cookie,
                "User-Agent": $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : (require('./USER_AGENTS').USER_AGENT)) : ($.getdata('JDUA') ? $.getdata('JDUA') : "jdapp;iPhone;9.4.4;14.3;network/4g;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1")
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
                        //console.log(data);
                        //{"code":0,"data":{"biz_code":0,"biz_msg":"领取任务成功","success":true},"rtn_code":0}  领任务成功
                        if(data.data.biz_msg==="领取任务成功"){ //领取任务成功继续操作
                            $.log(`逛店铺任务: ` + data.data.biz_msg);
                        }else{
                            $.log(`逛店铺任务: ` + data.data.biz_msg);
                        }    
                    } else {
                        console.log(`服务器返回空数据`)
                    }
                }
            } catch (e) {
                $.logErr(e, resp)
            } finally {
                resolve();
            }
        })
    })

};

//鲤鱼红包领店铺详情
function Get5_1DoTask() {
    return new Promise(async resolve => {
        const options = {
            url: `https://api.m.jd.com/api?appid=jinlihongbao&functionId=getTaskDetailForColor&loginType=2&client=jinlihongbao&t=${Date.now()}&clientVersion=10.3.5&osVersion=-1`,
            body: `body=%7B%22taskType%22%3A%223%22%7D`,
            headers: {
                "authority": "api.m.jd.com",
                "Content-Type": "application/x-www-form-urlencoded",
                "accept": "application/json, text/plain, */*",
                "referer": "https://happy.m.jd.com/babelDiy/zjyw/3ugedFa7yA6NhxLN5gw2L3PF9sQC/index.html?channel=9",
                "origin": "https://happy.m.jd.com",
                "Cookie": cookie,
                "User-Agent": $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : (require('./USER_AGENTS').USER_AGENT)) : ($.getdata('JDUA') ? $.getdata('JDUA') : "jdapp;iPhone;9.4.4;14.3;network/4g;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1")
            }
        }
        $.post(options, (err, resp, data) => {
            try {
                if (err) {
                    console.log(`${JSON.stringify(err)}`)
                    console.log(`${$.name} API请求失败，请检查网路重试1`)
                } else {
                    if (data) {
                        data = JSON.parse(data);
                        
                        //{  code: 0,  data: {    biz_code: 0,    biz_msg: 'OK',    result: { advertDetails: [Array] },    success: true  },  rtn_code: 0}
                        $.dataJson1=data;
                            //for (let vo of $.dataJson.data.result.taskInfos ) {
                                
                            //}
                    } else {
                        console.log(`服务器返回空数据`)
                    }
                }
            } catch (e) {
                $.logErr(e, resp)
            } finally {
                resolve();
            }
        })
    })
}

//鲤鱼红包领逛店铺开始做任务
function Get5_2DoTask(id1) {
    return new Promise(async resolve => {
        const options = {
            url: `https://api.m.jd.com/api?appid=jinlihongbao&functionId=taskReportForColor&loginType=2&client=jinlihongbao&t=${Date.now()}&clientVersion=10.3.5&osVersion=-1`,
            body: `body=%7B%22taskType%22%3A%223%22%2C%22detailId%22%3A%22${id1}%22%7D`,
            headers: {
                "authority": "api.m.jd.com",
                "Content-Type": "application/x-www-form-urlencoded",
                "accept": "application/json, text/plain, */*",
                "referer": "https://happy.m.jd.com/babelDiy/zjyw/3ugedFa7yA6NhxLN5gw2L3PF9sQC/index.html?channel=9",
                "origin": "https://happy.m.jd.com",
                "Cookie": cookie,
                "User-Agent": $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : (require('./USER_AGENTS').USER_AGENT)) : ($.getdata('JDUA') ? $.getdata('JDUA') : "jdapp;iPhone;9.4.4;14.3;network/4g;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1")
            }
        }
        $.post(options, (err, resp, data) => {
            try {
                if (err) {
                    console.log(`${JSON.stringify(err)}`)
                    console.log(`${$.name} API请求失败，请检查网路重试1`)
                } else {
                    if (data) {
                        data = JSON.parse(data);
                        //console.log(data.data.biz_msg);//$.advertDetailsname
                        console.log(data);
                         $.log(`逛商品: ` + $.advertDetailsname +` `+ data.data.biz_msg);
                        //{  code: 0,  data: {    biz_code: 0,    biz_msg: 'OK',    result: { advertDetails: [Array] },    success: true  },  rtn_code: 0}
                        //$.dataJson1=data;
                            //for (let vo of $.dataJson.data.result.taskInfos ) {
                                
                            //}
                    } else {
                        console.log(`服务器返回空数据`)
                    }
                }
            } catch (e) {
                $.logErr(e, resp)
            } finally {
                resolve();
            }
        })
    })
}

//鲤鱼红包领逛店铺领红包
function Get5_3GetHB() {
    return new Promise(async resolve => {
        const options = {
            url: `https://api.m.jd.com/api?appid=jinlihongbao&functionId=h5receiveRedpacketAll&loginType=2&client=jinlihongbao&t=${Date.now()}&clientVersion=10.3.5&osVersion=-1`,
            body: `body=%7B%22taskType%22%3A3%2C%22random%22%3A%2273558111%22%2C%22log%22%3A%221644886093877~1jIdeXCzgk1MDFLTGxnbjAyMQ%3D%3D.enpYU1ZzeF9VWHp7WBlbLShfIl0ZHl9UEHpgWktZZ30SVRB6MhsOIwQTWDEheSpBNkMlFj8sCDEKNC4ZNQ%3D%3D.05f5fd59~7%2C1~E81553F5F06A863B1A5A34C3B4AB8F0EA857A4AB~0r24uio~C~SBNGXxAOaBJUBxUFbh5xfR5kcmofAR0HAwEeRhAYEVQGHAB7GHNzFWRwchwCHgMHAx1GEB4WVwYdCW8edXYcb3B5HwEdAAMHH0UQHhBQBR0JfBRzcx5me2QeAh4DAAMbRxMeEFYCHglgHXl1GGRzDR4DHQADAB9DEWweEEZaXhIKahpWAR8FaB53ABwEcX1vHwAcAgIEH0QSHRpWAx8FaB53ABwEcWJ2HwAcAgIEH0QSHRpWBR8FaB53BxwEcWJjH0QeRhBpHxJXQ1YQDgEcG0FBEQoRAQUDBwkKBwUBAAEABAkBAAYSFRBFVlQRChFDR0VGRlRBVRIcE09XVRAKG1RUR0RHREZWER0QQlZaEQprBRQFBAscAB4DAxwCHAZqHxNYWBAOABwSUksQDhBRXFcECwJVBAcOBAhTV1ACVlNTAA5TB1cDWANUBwEEVBEbEV9CEAgWf1leREASVVNCWloEBxIfEkcVCQAEBgYMCwYACAsKAwUcG1hZEQoRHR4CUAQKBgVSUFQAVQoABAAGGx4QVUBREgkVRFh%2FfW0AZX8CVxVjGVxqanlUSXZreUQVHxNcRBAOEXdfXl9eURJ5V1EcERwRXlJBEQsQCwACAgASHRpBV0ASA2kKAwAfAwUHbh0QQF0WCWsSYXxheQIAGx4QUl5XQlxeVxMeEAMFERwSAAgcABwAGx4QCgIFAQMVHxMHAQECBgMIAgwBAwEGDwEEHgQFAAADBQMBAAEEAAIDBwsQGBABG28eEVlcURENEVdUVFRSVUREExQQVVgSAxBHERwRU1oVCRNFARwGHQQSHRpRUm1GGwgQAwIRHBFVVxMIEEBVXVRfXAUFBwcFAQMDAhIfEl5dEQtpBB4FARwBAGUeFlBcVlUQCRICBgcDCwkGAQAHBQgJTwl5TV5BaGNGWV5lfXdxS1BqZH9lSXFIfF8PCRxhfwtwVnhHd2ZiYR5RAnRmYnR6SXBbXHd3UApeZGFqWWNmV3d2AHBEa2ZXfV1YBXN2QQZWeFpQdXJdYmZ5cUUHdHJTXndIdXx7XmcZfHJmA2JOfmB8YGMEenJIAHpZfVlgUWsEcmN%2BWlZ0cVB7cEUNeGVbSXF6QAN6Tl1QcWJmenp0aQB1SkVDemJle35zU3B%2FCndnYloLU1B1ZVJ1egJkdQBpd3MBAX92Tg8PHQNRBwAGBAQATEUYAk5OT3pMYHBqcXRVRGV1WFhvZUlnfXQEfXt3XWFQdUp6YGNgX3dmXH1YYllRfXR1anZ2SVNnZUppaWMDZn93YXJVe3NBeWAEanx2RltrdmBpWHR0X3Z1R0RhcXBgYGRMXGp3AEhocwNbYXBFelJxYlx%2FdVpBD0wEQAdJCQFeFh4SVEFVEQoREk4%3D~0wvr5hu%22%2C%22sceneid%22%3A%22JLHBhPageh5%22%7D`,
            headers: {
                "authority": "api.m.jd.com",
                "Content-Type": "application/x-www-form-urlencoded",
                "accept": "application/json, text/plain, */*",
                "referer": "https://happy.m.jd.com/babelDiy/zjyw/3ugedFa7yA6NhxLN5gw2L3PF9sQC/index.html?channel=9",
                "origin": "https://happy.m.jd.com",
                "Cookie": cookie,
                "User-Agent": $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : (require('./USER_AGENTS').USER_AGENT)) : ($.getdata('JDUA') ? $.getdata('JDUA') : "jdapp;iPhone;9.4.4;14.3;network/4g;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1")
            }
        }
        $.post(options, (err, resp, data) => {
            try {
                if (err) {
                    console.log(`${JSON.stringify(err)}`)
                    console.log(`${$.name} API请求失败，请检查网路重试1`)
                } else {
                    if (data) {
                        data = JSON.parse(data);
                        //console.log(data);
                        $.log(`逛商品兑换红包: ` + data.data.biz_msg);
                        //{  code: 0,  data: { biz_code: 11, biz_msg: '您已成功领取红包，快去买买买吧~', success: false },  rtn_code: 0}
                        //$.dataJson1=data;
                            //for (let vo of $.dataJson.data.result.taskInfos ) {
                                
                            //}
                    } else {
                        console.log(`服务器返回空数据`)
                    }
                }
            } catch (e) {
                $.logErr(e, resp)
            } finally {
                resolve();
            }
        })
    })
}





//抽京豆
function SoyBean() {
    return new Promise(async resolve => {
        const options = {
            url: `https://api.m.jd.com/client.action?functionId=babelGetLottery&clientVersion=10.3.5&build=92468&client=android&partner=oppo&oaid=0DD656F325A74398A1CB3B4372BF1AD576fe38f2bc10980a86dd0681c82e8d89&eid=eidA258381236csdd/N8n/lORYGRZJxEpCvsB3fzfh68tomYApSHfsOuryc+PAzdt2geHVFR/9yAZvIkptxjAS+GyqXcWtQZeiqiCEfgD8e37Cii+0pz&sdkVersion=29&lang=zh_CN&harmonyOs=0&networkType=wifi&uts=0f31TVRjBSsqndu4%2FjgUPz6uymy50MQJQqSeDwnfcLV0YIwYCEVF97Fz3gV6smSjveEy48Mfo%2B%2BwsJf41ORp%2FrMxjQeIp8g3Woz6RV6Li%2Fq606ysUbYGgau5i52%2BkEuiFenMyF9nwwTKFYV9jWlhOttVTJIKNG%2FCG5QmVefUcx9aXV3DvGjV%2BFIT%2BMZ0o7TIj%2FHhiXYOwhmYCw5DYvLPBw%3D%3D&uemps=0-0&ext=%7B%22prstate%22%3A%220%22%2C%22pvcStu%22%3A%221%22%7D&ef=1&ep=%7B%22hdid%22%3A%22JM9F1ywUPwflvMIpYPok0tt5k9kW4ArJEU3lfLhxBqw%3D%22%2C%22ts%22%3A1644133997882%2C%22ridx%22%3A-1%2C%22cipher%22%3A%7B%22area%22%3A%22CV83Cv8yDzu5XzK%3D%22%2C%22d_model%22%3A%22UOTPJJKm%22%2C%22wifiBssid%22%3A%22dW5hbw93bq%3D%3D%22%2C%22osVersion%22%3A%22CJK%3D%22%2C%22d_brand%22%3A%22J1LGJm%3D%3D%22%2C%22screen%22%3A%22CtOzCsenCNqm%22%2C%22uuid%22%3A%22CQHrYJUyDtG2CWY4DJHrZG%3D%3D%22%2C%22aid%22%3A%22CQHrYJUyDtG2CWY4DJHrZG%3D%3D%22%2C%22openudid%22%3A%22CQHrYJUyDtG2CWY4DJHrZG%3D%3D%22%7D%2C%22ciphertype%22%3A5%2C%22version%22%3A%221.2.0%22%2C%22appname%22%3A%22com.jingdong.app.mall%22%7D&st=1644147681173&sign=859e677553f58c62ed91953e81ce9617&sv=122`,
            body: `body=%7B%22authType%22%3A%222%22%2C%22awardSource%22%3A%221%22%2C%22enAwardK%22%3A%22ltvTJ%2FWYFPZcuWIWHCAjR7UWX%2FLGhxgp6yq7DZD3KhIaqi8FPY5ILGaO2QbOnCf0PX15rGkQsaQW%5CnKBQ3CCcHlhgQqvoVdEBn3tuQuy3AnsYYEKr6FXRAZ5vfj7LjlksJb2u81yD67JIcMZ%2Fqttr2%2FS4K%5CnuspMTok7xcEUCVJPkIhNjn96P9AssVgdhsaLZBfmMo55mUGZb5D47rx717ck%2FCVkhDYNTLhKmpm5%5Cn99PCqt%2BOdvT9uVLviKKLw0xSfxo%2FZwywFychFd14ITqaQwn90veyNGzjij06l7T7ug4NJ322fQjP%5Cn73ZgzF0ONAkEq1sWQKjIy4cxoP0knGgppTXKXFf%2BkDs4Mjk6rUwEiY%2FcVbM3fxZVxR%2FebzYxpv5L%5Cn6KvliG3cIM4A3ZA%3D_babel%22%2C%22encryptAssignmentId%22%3A%222x5WEhFsDhmf8JohWQJFYfURTh9w%22%2C%22encryptProjectId%22%3A%223u4fVy1c75fAdDN6XRYDzAbkXz1E%22%2C%22lotteryCode%22%3A%22336014%22%2C%22riskParam%22%3A%7B%22childActivityUrl%22%3A%22https%3A%2F%2Fpro.m.jd.com%2Fmall%2Factive%2F2xoBJwC5D1Q3okksMUFHcJQhFq8j%2Findex.html%3Ftttparams%3D6p1C14eyJnTGF0IjoiMzkuOTIxNDY5IiwiZ0xuZyI6IjExNi40NDMxMDciLCJncHNfYXJlYSI6IjBfMF8wXzAiLCJsYXQiOjAsImxuZyI6MCwibW9kZWwiOiJQQkVNMDAiLCJwcnN0YXRlIjoiMCIsInVuX2FyZWEiOiIxXzcyXzI3OTlfMC6J9%22%2C%22eid%22%3A%22eidA258381236csdd%2FN8n%2FlORYGRZJxEpCvsB3fzfh68tomYApSHfsOuryc%2BPAzdt2geHVFR%2F9yAZvIkptxjAS%2BGyqXcWtQZeiqiCEfgD8e37Cii%2B0pz%22%2C%22pageClickKey%22%3A%22Babel_WheelSurf%22%2C%22shshshfpb%22%3A%22JD012145b9Wunim5iUXi1644147540806015qIDCYL1S2pffM59xCGe_c3_1EHfJL7iMNlQe9lKmuU64hz2TJl7fQ9eX4vYV9N9F3PRbiLZHvtBt3tSpckE1Pa2hOT5s9nt0ug9h8x%7EvkURW78GHJ3xXQYgTtMt2aDVRNws0Uqn4lTzH8gagVp1HIxcMSagcTIP1Tgsne1alhwMzlGFvmRP4bnSTZ0suYj3usUZqluFh_QqUwCJTRyqNWgSjkjenfw5T-y8jgsz2g4tYmpSWJ9-qr2crVwHTwzeQBoma1GWsjV1Kv15OMjY%22%7D%2C%22srv%22%3A%22%7B%5C%22bord%5C%22%3A%5C%220%5C%22%2C%5C%22fno%5C%22%3A%5C%220-0-2%5C%22%2C%5C%22mid%5C%22%3A%5C%2270952802%5C%22%2C%5C%22bi2%5C%22%3A%5C%222%5C%22%2C%5C%22bid%5C%22%3A%5C%220%5C%22%2C%5C%22aid%5C%22%3A%5C%2201155413%5C%22%7D%22%7D&`,
            headers: {
                "authority": "api.m.jd.com",
                "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
                "Cookie": cookie,
                "User-Agent": $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : (require('./USER_AGENTS').USER_AGENT)) : ($.getdata('JDUA') ? $.getdata('JDUA') : "jdapp;iPhone;9.4.4;14.3;network/4g;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1")
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
                            $.log(`豆抽奖: ` + data.promptMsg);
                    } else {
                        console.log(`服务器返回空数据`)
                    }
                }
            } catch (e) {
                $.logErr(e, resp)
            } finally {
                resolve();
            }
        })
    })
}


// prettier-ignore
function Env(t,e){"undefined"!=typeof process&&JSON.stringify(process.env).indexOf("GITHUB")>-1&&process.exit(0);class s{constructor(t){this.env=t}send(t,e="GET"){t="string"==typeof t?{url:t}:t;let s=this.get;return"POST"===e&&(s=this.post),new Promise((e,i)=>{s.call(this,t,(t,s,r)=>{t?i(t):e(s)})})}get(t){return this.send.call(this.env,t)}post(t){return this.send.call(this.env,t,"POST")}}return new class{constructor(t,e){this.name=t,this.http=new s(this),this.data=null,this.dataFile="box.dat",this.logs=[],this.isMute=!1,this.isNeedRewrite=!1,this.logSeparator="\n",this.startTime=(new Date).getTime(),Object.assign(this,e),this.log("",`🔔${this.name}, 开始!`)}isNode(){return"undefined"!=typeof module&&!!module.exports}isQuanX(){return"undefined"!=typeof $task}isSurge(){return"undefined"!=typeof $httpClient&&"undefined"==typeof $loon}isLoon(){return"undefined"!=typeof $loon}toObj(t,e=null){try{return JSON.parse(t)}catch{return e}}toStr(t,e=null){try{return JSON.stringify(t)}catch{return e}}getjson(t,e){let s=e;const i=this.getdata(t);if(i)try{s=JSON.parse(this.getdata(t))}catch{}return s}setjson(t,e){try{return this.setdata(JSON.stringify(t),e)}catch{return!1}}getScript(t){return new Promise(e=>{this.get({url:t},(t,s,i)=>e(i))})}runScript(t,e){return new Promise(s=>{let i=this.getdata("@chavy_boxjs_userCfgs.httpapi");i=i?i.replace(/\n/g,"").trim():i;let r=this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout");r=r?1*r:20,r=e&&e.timeout?e.timeout:r;const[o,h]=i.split("@"),n={url:`http://${h}/v1/scripting/evaluate`,body:{script_text:t,mock_type:"cron",timeout:r},headers:{"X-Key":o,Accept:"*/*"}};this.post(n,(t,e,i)=>s(i))}).catch(t=>this.logErr(t))}loaddata(){if(!this.isNode())return{};{this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e);if(!s&&!i)return{};{const i=s?t:e;try{return JSON.parse(this.fs.readFileSync(i))}catch(t){return{}}}}}writedata(){if(this.isNode()){this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e),r=JSON.stringify(this.data);s?this.fs.writeFileSync(t,r):i?this.fs.writeFileSync(e,r):this.fs.writeFileSync(t,r)}}lodash_get(t,e,s){const i=e.replace(/\[(\d+)\]/g,".$1").split(".");let r=t;for(const t of i)if(r=Object(r)[t],void 0===r)return s;return r}lodash_set(t,e,s){return Object(t)!==t?t:(Array.isArray(e)||(e=e.toString().match(/[^.[\]]+/g)||[]),e.slice(0,-1).reduce((t,s,i)=>Object(t[s])===t[s]?t[s]:t[s]=Math.abs(e[i+1])>>0==+e[i+1]?[]:{},t)[e[e.length-1]]=s,t)}getdata(t){let e=this.getval(t);if(/^@/.test(t)){const[,s,i]=/^@(.*?)\.(.*?)$/.exec(t),r=s?this.getval(s):"";if(r)try{const t=JSON.parse(r);e=t?this.lodash_get(t,i,""):e}catch(t){e=""}}return e}setdata(t,e){let s=!1;if(/^@/.test(e)){const[,i,r]=/^@(.*?)\.(.*?)$/.exec(e),o=this.getval(i),h=i?"null"===o?null:o||"{}":"{}";try{const e=JSON.parse(h);this.lodash_set(e,r,t),s=this.setval(JSON.stringify(e),i)}catch(e){const o={};this.lodash_set(o,r,t),s=this.setval(JSON.stringify(o),i)}}else s=this.setval(t,e);return s}getval(t){return this.isSurge()||this.isLoon()?$persistentStore.read(t):this.isQuanX()?$prefs.valueForKey(t):this.isNode()?(this.data=this.loaddata(),this.data[t]):this.data&&this.data[t]||null}setval(t,e){return this.isSurge()||this.isLoon()?$persistentStore.write(t,e):this.isQuanX()?$prefs.setValueForKey(t,e):this.isNode()?(this.data=this.loaddata(),this.data[e]=t,this.writedata(),!0):this.data&&this.data[e]||null}initGotEnv(t){this.got=this.got?this.got:require("got"),this.cktough=this.cktough?this.cktough:require("tough-cookie"),this.ckjar=this.ckjar?this.ckjar:new this.cktough.CookieJar,t&&(t.headers=t.headers?t.headers:{},void 0===t.headers.Cookie&&void 0===t.cookieJar&&(t.cookieJar=this.ckjar))}get(t,e=(()=>{})){t.headers&&(delete t.headers["Content-Type"],delete t.headers["Content-Length"]),this.isSurge()||this.isLoon()?(this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.get(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)})):this.isQuanX()?(this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t))):this.isNode()&&(this.initGotEnv(t),this.got(t).on("redirect",(t,e)=>{try{if(t.headers["set-cookie"]){const s=t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString();s&&this.ckjar.setCookieSync(s,null),e.cookieJar=this.ckjar}}catch(t){this.logErr(t)}}).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)}))}post(t,e=(()=>{})){if(t.body&&t.headers&&!t.headers["Content-Type"]&&(t.headers["Content-Type"]="application/x-www-form-urlencoded"),t.headers&&delete t.headers["Content-Length"],this.isSurge()||this.isLoon())this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.post(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)});else if(this.isQuanX())t.method="POST",this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t));else if(this.isNode()){this.initGotEnv(t);const{url:s,...i}=t;this.got.post(s,i).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)})}}time(t,e=null){const s=e?new Date(e):new Date;let i={"M+":s.getMonth()+1,"d+":s.getDate(),"H+":s.getHours(),"m+":s.getMinutes(),"s+":s.getSeconds(),"q+":Math.floor((s.getMonth()+3)/3),S:s.getMilliseconds()};/(y+)/.test(t)&&(t=t.replace(RegExp.$1,(s.getFullYear()+"").substr(4-RegExp.$1.length)));for(let e in i)new RegExp("("+e+")").test(t)&&(t=t.replace(RegExp.$1,1==RegExp.$1.length?i[e]:("00"+i[e]).substr((""+i[e]).length)));return t}msg(e=t,s="",i="",r){const o=t=>{if(!t)return t;if("string"==typeof t)return this.isLoon()?t:this.isQuanX()?{"open-url":t}:this.isSurge()?{url:t}:void 0;if("object"==typeof t){if(this.isLoon()){let e=t.openUrl||t.url||t["open-url"],s=t.mediaUrl||t["media-url"];return{openUrl:e,mediaUrl:s}}if(this.isQuanX()){let e=t["open-url"]||t.url||t.openUrl,s=t["media-url"]||t.mediaUrl;return{"open-url":e,"media-url":s}}if(this.isSurge()){let e=t.url||t.openUrl||t["open-url"];return{url:e}}}};if(this.isMute||(this.isSurge()||this.isLoon()?$notification.post(e,s,i,o(r)):this.isQuanX()&&$notify(e,s,i,o(r))),!this.isMuteLog){let t=["","==============📣系统通知📣=============="];t.push(e),s&&t.push(s),i&&t.push(i),console.log(t.join("\n")),this.logs=this.logs.concat(t)}}log(...t){t.length>0&&(this.logs=[...this.logs,...t]),console.log(t.join(this.logSeparator))}logErr(t,e){const s=!this.isSurge()&&!this.isQuanX()&&!this.isLoon();s?this.log("",`❗️${this.name}, 错误!`,t.stack):this.log("",`❗️${this.name}, 错误!`,t)}wait(t){return new Promise(e=>setTimeout(e,t))}done(t={}){const e=(new Date).getTime(),s=(e-this.startTime)/1e3;this.log("",`🔔${this.name}, 结束! 🕛 ${s} 秒`),this.log(),(this.isSurge()||this.isQuanX()||this.isLoon())&&$done(t)}}(t,e)}
