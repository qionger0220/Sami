/*
#领现金
京东App首页-领现金
13 7,8  * * * jd_lxj.js
 */
const $ = new Env('领现金');
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
    for (let i = 0; i < cookiesArr.length; i++) {
        cookie = cookiesArr[i];
        if (cookie) {
            $.UserName = decodeURIComponent(cookie.match(/pt_pin=([^; ]+)(?=;?)/) && cookie.match(/pt_pin=([^; ]+)(?=;?)/)[1])
            $.index = i + 1;
            $.isLogin = true;
            $.nickName = '';
            if (!$.isLogin) {
                $.msg($.name, `【提示】cookie已失效`, `京东账号${$.index} ${$.nickName || $.UserName}\n请重新登录获取\nhttps://bean.m.jd.com/bean/signIndex.action`, { "open-url": "https://bean.m.jd.com/bean/signIndex.action" });
                continue
            }
            console.log(`\n******开始【京东账号${$.index}】${$.nickName || $.UserName}*********\n`);
            //做任务
            data = await homePage();
            //console.log(data.data.result.taskInfos)
        	for (let vo of data.data.result.taskInfos) {
			    if(vo.type===4){//逛商品
    			    let body='body=%7B%22type%22%3A4%2C%22taskInfo%22%3A%2210025072089962%22%7D&build=167945&client=apple&clientVersion=10.3.4&d_brand=apple&d_model=iPhone13%2C1&ef=1&eid=eidIc98d812270s8YJsI7x6OQ4SE/oNrRYKmoGCbCm002iJf1jMsFpgLxu2RGdxkRDEZNU1pWW0cvbGnPi%2Bhmydl%2BleT3quEAT%2B6VnQbdtggDOcLcrAx&ep=%7B%22ciphertype%22%3A5%2C%22cipher%22%3A%7B%22screen%22%3A%22CJOyDIeyDNC2%22%2C%22wifiBssid%22%3A%22Y2GmDzC4CNZwCNTvEWDsCzUnEJLvCQCnDNCzYWUzD2Y%3D%22%2C%22osVersion%22%3A%22CJUkCM4y%22%2C%22area%22%3A%22CJTpEJK0XzumDV81CNYmCG%3D%3D%22%2C%22openudid%22%3A%22ZwTwDNS0DtKzDwS3CtYnY2Y2ZJHsCzLwYJYzDNC0ZtunCzTwZJVwZG%3D%3D%22%2C%22uuid%22%3A%22aQf1ZRdxb2r4ovZ1EJZhcxYlVNZSZz09%22%7D%2C%22ts%22%3A1646182804%2C%22hdid%22%3A%22JM9F1ywUPwflvMIpYPok0tt5k9kW4ArJEU3lfLhxBqw%3D%22%2C%22version%22%3A%221.0.3%22%2C%22appname%22%3A%22com.360buy.jdmobile%22%2C%22ridx%22%3A-1%7D&ext=%7B%22prstate%22%3A%220%22%2C%22pvcStu%22%3A%221%22%7D&isBackground=N&joycious=59&lang=zh_CN&networkType=wifi&networklibtype=JDNetworkBaseAF&partner=apple&rfs=0000&scope=11&sign=f6a8e443cbfaa923b43198d2bcd17fb1&st=1646183397713&sv=121&uemps=0-1&uts=0f31TVRjBSsqndu4/jgUPz6uymy50MQJu80uo1ZShhcKcFZypBzGgVDpmkYb1W4rFze3PpCU5%2B6Rvd6%2Birj7D/BTujC2L8axiZKoLG/12rGWzaPv/JTzN5Bh%2BYO7BaemwTBZpQeheEKggtsG9Ocln5eRb%2BvSDrSIUyifzdc55hQluvw3xFu5KnTwTiFscT%2BsGr5m4VaDQVApBp19Bfg5KA%3D%3D';
			        let body1='body=%7B%22type%22%3A4%2C%22taskInfo%22%3A%2210042703455175%22%7D&build=167945&client=apple&clientVersion=10.3.4&d_brand=apple&d_model=iPhone13%2C1&ef=1&eid=eidIc98d812270s8YJsI7x6OQ4SE/oNrRYKmoGCbCm002iJf1jMsFpgLxu2RGdxkRDEZNU1pWW0cvbGnPi%2Bhmydl%2BleT3quEAT%2B6VnQbdtggDOcLcrAx&ep=%7B%22ciphertype%22%3A5%2C%22cipher%22%3A%7B%22screen%22%3A%22CJOyDIeyDNC2%22%2C%22wifiBssid%22%3A%22Y2GmDzC4CNZwCNTvEWDsCzUnEJLvCQCnDNCzYWUzD2Y%3D%22%2C%22osVersion%22%3A%22CJUkCM4y%22%2C%22area%22%3A%22CJTpEJK0XzumDV81CNYmCG%3D%3D%22%2C%22openudid%22%3A%22ZwTwDNS0DtKzDwS3CtYnY2Y2ZJHsCzLwYJYzDNC0ZtunCzTwZJVwZG%3D%3D%22%2C%22uuid%22%3A%22aQf1ZRdxb2r4ovZ1EJZhcxYlVNZSZz09%22%7D%2C%22ts%22%3A1646182804%2C%22hdid%22%3A%22JM9F1ywUPwflvMIpYPok0tt5k9kW4ArJEU3lfLhxBqw%3D%22%2C%22version%22%3A%221.0.3%22%2C%22appname%22%3A%22com.360buy.jdmobile%22%2C%22ridx%22%3A-1%7D&ext=%7B%22prstate%22%3A%220%22%2C%22pvcStu%22%3A%221%22%7D&isBackground=N&joycious=59&lang=zh_CN&networkType=wifi&networklibtype=JDNetworkBaseAF&partner=apple&rfs=0000&scope=11&sign=02efd6eeaf4d5cf11a30f2ada5da7623&st=1646184136180&sv=111&uemps=0-1&uts=0f31TVRjBSsqndu4/jgUPz6uymy50MQJu80uo1ZShhcKcFZypBzGgVDpmkYb1W4rFze3PpCU5%2B6Rvd6%2Birj7D/BTujC2L8axiZKoLG/12rGWzaPv/JTzN5Bh%2BYO7BaemwTBZpQeheEKggtsG9Ocln5eRb%2BvSDrSIUyifzdc55hQluvw3xFu5KnTwTiFscT%2BsGr5m4VaDQVApBp19Bfg5KA%3D%3D';
			        
			             if(vo.doTimes < vo.times){
    			           await doTask(body);
    			           await $.wait(6000);
    			           await doTask(body1);
    			           await $.wait(6000);
    			        }
			    }
			    if(vo.type===2){//逛商品
    			    let body='body=%7B%22type%22%3A2%2C%22taskInfo%22%3A%221000408007%22%7D&build=167945&client=apple&clientVersion=10.3.4&d_brand=apple&d_model=iPhone13%2C1&ef=1&eid=eidIc98d812270s8YJsI7x6OQ4SE/oNrRYKmoGCbCm002iJf1jMsFpgLxu2RGdxkRDEZNU1pWW0cvbGnPi%2Bhmydl%2BleT3quEAT%2B6VnQbdtggDOcLcrAx&ep=%7B%22ciphertype%22%3A5%2C%22cipher%22%3A%7B%22screen%22%3A%22CJOyDIeyDNC2%22%2C%22wifiBssid%22%3A%22Y2GmDzC4CNZwCNTvEWDsCzUnEJLvCQCnDNCzYWUzD2Y%3D%22%2C%22osVersion%22%3A%22CJUkCM4y%22%2C%22area%22%3A%22CJTpEJK0XzumDV81CNYmCG%3D%3D%22%2C%22openudid%22%3A%22ZwTwDNS0DtKzDwS3CtYnY2Y2ZJHsCzLwYJYzDNC0ZtunCzTwZJVwZG%3D%3D%22%2C%22uuid%22%3A%22aQf1ZRdxb2r4ovZ1EJZhcxYlVNZSZz09%22%7D%2C%22ts%22%3A1646182804%2C%22hdid%22%3A%22JM9F1ywUPwflvMIpYPok0tt5k9kW4ArJEU3lfLhxBqw%3D%22%2C%22version%22%3A%221.0.3%22%2C%22appname%22%3A%22com.360buy.jdmobile%22%2C%22ridx%22%3A-1%7D&ext=%7B%22prstate%22%3A%220%22%2C%22pvcStu%22%3A%221%22%7D&isBackground=N&joycious=59&lang=zh_CN&networkType=wifi&networklibtype=JDNetworkBaseAF&partner=apple&rfs=0000&scope=11&sign=27923887c84334ba1308f9386ce072e7&st=1646182836051&sv=100&uemps=0-1&uts=0f31TVRjBSsqndu4/jgUPz6uymy50MQJu80uo1ZShhcKcFZypBzGgVDpmkYb1W4rFze3PpCU5%2B6Rvd6%2Birj7D/BTujC2L8axiZKoLG/12rGWzaPv/JTzN5Bh%2BYO7BaemwTBZpQeheEKggtsG9Ocln5eRb%2BvSDrSIUyifzdc55hQluvw3xFu5KnTwTiFscT%2BsGr5m4VaDQVApBp19Bfg5KA%3D%3D';
			        
			         for (let ii = 0; ii < 2; ii++){
			             if(vo.doTimes < vo.times){
    			           await doTask(body);
    			           await $.wait(6000);
    			        }else{
			            console.log(vo.name + `任务已完成`)
			            break
			        }
			         }
			    }
			    if(vo.type===16){
			         let body='body=%7B%22type%22%3A16%2C%22taskInfo%22%3A%22https%3A%5C/%5C/pro.m.jd.com%5C/mall%5C/active%5C/3GZJACnxh9TajiEcBvkAMTm2MN7u%5C/index.html?babelChannel%3Dttt22%22%7D&build=167945&client=apple&clientVersion=10.3.4&d_brand=apple&d_model=iPhone13%2C1&ef=1&eid=eidIc98d812270s8YJsI7x6OQ4SE/oNrRYKmoGCbCm002iJf1jMsFpgLxu2RGdxkRDEZNU1pWW0cvbGnPi%2Bhmydl%2BleT3quEAT%2B6VnQbdtggDOcLcrAx&ep=%7B%22ciphertype%22%3A5%2C%22cipher%22%3A%7B%22screen%22%3A%22CJOyDIeyDNC2%22%2C%22wifiBssid%22%3A%22Y2GmDzC4CNZwCNTvEWDsCzUnEJLvCQCnDNCzYWUzD2Y%3D%22%2C%22osVersion%22%3A%22CJUkCM4y%22%2C%22area%22%3A%22CJTpEJK0XzumDV81CNYmCG%3D%3D%22%2C%22openudid%22%3A%22ZwTwDNS0DtKzDwS3CtYnY2Y2ZJHsCzLwYJYzDNC0ZtunCzTwZJVwZG%3D%3D%22%2C%22uuid%22%3A%22aQf1ZRdxb2r4ovZ1EJZhcxYlVNZSZz09%22%7D%2C%22ts%22%3A1646096034%2C%22hdid%22%3A%22JM9F1ywUPwflvMIpYPok0tt5k9kW4ArJEU3lfLhxBqw%3D%22%2C%22version%22%3A%221.0.3%22%2C%22appname%22%3A%22com.360buy.jdmobile%22%2C%22ridx%22%3A-1%7D&ext=%7B%22prstate%22%3A%220%22%2C%22pvcStu%22%3A%221%22%7D&isBackground=N&joycious=59&lang=zh_CN&networkType=wifi&networklibtype=JDNetworkBaseAF&partner=apple&rfs=0000&scope=11&sign=30e4cc820e15224f442495766723a1f3&st=1646113957945&sv=102&uemps=0-1&uts=0f31TVRjBSsqndu4/jgUPz6uymy50MQJQK5a1ZM5c4AnvMg/N1eSzpgBG6HTznJvnzecGU5FVxAXmn/nR9zJLQvRVo0xxWwJaHWjLYByGcyB%2BNiYllicLPUbc8shJWAghQzzvkhe5xXmnBvW3rK5mhGl%2B2juxLxYAvwavtQ%2BX6Uvr6WfeNZHUOCiT1KZcHHy0yYMbWeHKEr6ZW7VV4tnkg%3D%3D';
			        for (let ii = 0; ii < 2; ii++){
			            if(vo.doTimes < vo.times){
    			           await doTask(body);
    			           await $.wait(6000);
    			        }else{
			            console.log(vo.name + `任务已完成`)
			            break
			        }
			        }
			        
			    }
			    if(vo.type===17){
			        if(vo.doTimes < vo.times){
			           let body='body=%7B%22type%22%3A17%2C%22taskInfo%22%3A%22https%3A%5C/%5C/wqs.jd.com%5C/fortune_island%5C/index2.html?ad_od%3D1%26ptag%3D139254.28.12%22%7D&build=167945&client=apple&clientVersion=10.3.4&d_brand=apple&d_model=iPhone13%2C1&ef=1&eid=eidIc98d812270s8YJsI7x6OQ4SE/oNrRYKmoGCbCm002iJf1jMsFpgLxu2RGdxkRDEZNU1pWW0cvbGnPi%2Bhmydl%2BleT3quEAT%2B6VnQbdtggDOcLcrAx&ep=%7B%22ciphertype%22%3A5%2C%22cipher%22%3A%7B%22screen%22%3A%22CJOyDIeyDNC2%22%2C%22wifiBssid%22%3A%22Y2GmDzC4CNZwCNTvEWDsCzUnEJLvCQCnDNCzYWUzD2Y%3D%22%2C%22osVersion%22%3A%22CJUkCM4y%22%2C%22area%22%3A%22CJTpEJK0XzumDV81CNYmCG%3D%3D%22%2C%22openudid%22%3A%22ZwTwDNS0DtKzDwS3CtYnY2Y2ZJHsCzLwYJYzDNC0ZtunCzTwZJVwZG%3D%3D%22%2C%22uuid%22%3A%22aQf1ZRdxb2r4ovZ1EJZhcxYlVNZSZz09%22%7D%2C%22ts%22%3A1646096034%2C%22hdid%22%3A%22JM9F1ywUPwflvMIpYPok0tt5k9kW4ArJEU3lfLhxBqw%3D%22%2C%22version%22%3A%221.0.3%22%2C%22appname%22%3A%22com.360buy.jdmobile%22%2C%22ridx%22%3A-1%7D&ext=%7B%22prstate%22%3A%220%22%2C%22pvcStu%22%3A%221%22%7D&isBackground=N&joycious=59&lang=zh_CN&networkType=wifi&networklibtype=JDNetworkBaseAF&partner=apple&rfs=0000&scope=11&sign=2a9244d0f694afa362f11e166b5c0fa6&st=1646114598671&sv=101&uemps=0-1&uts=0f31TVRjBSsqndu4/jgUPz6uymy50MQJQK5a1ZM5c4AnvMg/N1eSzpgBG6HTznJvnzecGU5FVxAXmn/nR9zJLQvRVo0xxWwJaHWjLYByGcyB%2BNiYllicLPUbc8shJWAghQzzvkhe5xXmnBvW3rK5mhGl%2B2juxLxYAvwavtQ%2BX6Uvr6WfeNZHUOCiT1KZcHHy0yYMbWeHKEr6ZW7VV4tnkg%3D%3D';
			           await doTask(body);
			           await $.wait(6000);
			           await doTask(body);
			           await $.wait(6000);
			           await doTask(body);
			           await $.wait(6000);
			        }else{
			            console.log(vo.name + `任务已完成`)
			        }
			    }
			}

            
            if (i != cookiesArr.length - 1) {
                await $.wait(2000);
            }
        }
    }
})()
    .catch((e) => $.logErr(e))
    .finally(() => $.done())


function homePage() {
    return new Promise(async resolve => {
        const options = {
            url: `https://106.39.171.220/client.action?functionId=cash_homePage`,
            body: 'body=%7B%7D&build=167945&client=apple&clientVersion=10.3.4&d_brand=apple&d_model=iPhone13%2C1&ef=1&eid=eidIc98d812270s8YJsI7x6OQ4SE/oNrRYKmoGCbCm002iJf1jMsFpgLxu2RGdxkRDEZNU1pWW0cvbGnPi%2Bhmydl%2BleT3quEAT%2B6VnQbdtggDOcLcrAx&ep=%7B%22ciphertype%22%3A5%2C%22cipher%22%3A%7B%22screen%22%3A%22CJOyDIeyDNC2%22%2C%22wifiBssid%22%3A%22Y2GmDzC4CNZwCNTvEWDsCzUnEJLvCQCnDNCzYWUzD2Y%3D%22%2C%22osVersion%22%3A%22CJUkCM4y%22%2C%22area%22%3A%22CJTpEJK0XzumDV81CNYmCG%3D%3D%22%2C%22openudid%22%3A%22ZwTwDNS0DtKzDwS3CtYnY2Y2ZJHsCzLwYJYzDNC0ZtunCzTwZJVwZG%3D%3D%22%2C%22uuid%22%3A%22aQf1ZRdxb2r4ovZ1EJZhcxYlVNZSZz09%22%7D%2C%22ts%22%3A1646096034%2C%22hdid%22%3A%22JM9F1ywUPwflvMIpYPok0tt5k9kW4ArJEU3lfLhxBqw%3D%22%2C%22version%22%3A%221.0.3%22%2C%22appname%22%3A%22com.360buy.jdmobile%22%2C%22ridx%22%3A-1%7D&ext=%7B%22prstate%22%3A%220%22%2C%22pvcStu%22%3A%221%22%7D&isBackground=N&joycious=59&lang=zh_CN&networkType=wifi&networklibtype=JDNetworkBaseAF&partner=apple&rfs=0000&scope=11&sign=18d126029882cc57846f70a38d0106c9&st=1646112288202&sv=122&uemps=0-1&uts=0f31TVRjBSsqndu4/jgUPz6uymy50MQJQK5a1ZM5c4AnvMg/N1eSzpgBG6HTznJvnzecGU5FVxAXmn/nR9zJLQvRVo0xxWwJaHWjLYByGcyB%2BNiYllicLPUbc8shJWAghQzzvkhe5xXmnBvW3rK5mhGl%2B2juxLxYAvwavtQ%2BX6Uvr6WfeNZHUOCiT1KZcHHy0yYMbWeHKEr6ZW7VV4tnkg%3D%3D',
            headers: {
                "Host": "api.m.jd.com",
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
                    } else {
                        console.log(`服务器返回空数据`)
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

function doTask(body={}) {
    return new Promise(async resolve => {
        const options = {
            url: `https://106.39.169.120/client.action?functionId=cash_doTask`,
            body: body,
            headers: {
                "Host": "api.m.jd.com",
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
                        //console.log(data)
                        data = JSON.parse(data);
                        if (data.code===0){
                            if(data.data.bizCode==105){
                                console.log('活动太火爆啦')
                            }
                            if(data.data.bizCode==0){
                                console.log(data.data.result.name + ' 执行任务成功')
                            }
                            if(data.data.bizCode==103){
                                console.log(data.data.result.name + ' 任务已完成')
                            }
                        }
                        
                        
                    } else {
                        console.log(`服务器返回空数据`)
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


// prettier-ignore
function Env(t,e){"undefined"!=typeof process&&JSON.stringify(process.env).indexOf("GITHUB")>-1&&process.exit(0);class s{constructor(t){this.env=t}send(t,e="GET"){t="string"==typeof t?{url:t}:t;let s=this.get;return"POST"===e&&(s=this.post),new Promise((e,i)=>{s.call(this,t,(t,s,r)=>{t?i(t):e(s)})})}get(t){return this.send.call(this.env,t)}post(t){return this.send.call(this.env,t,"POST")}}return new class{constructor(t,e){this.name=t,this.http=new s(this),this.data=null,this.dataFile="box.dat",this.logs=[],this.isMute=!1,this.isNeedRewrite=!1,this.logSeparator="\n",this.startTime=(new Date).getTime(),Object.assign(this,e),this.log("",`🔔${this.name}, 开始!`)}isNode(){return"undefined"!=typeof module&&!!module.exports}isQuanX(){return"undefined"!=typeof $task}isSurge(){return"undefined"!=typeof $httpClient&&"undefined"==typeof $loon}isLoon(){return"undefined"!=typeof $loon}toObj(t,e=null){try{return JSON.parse(t)}catch{return e}}toStr(t,e=null){try{return JSON.stringify(t)}catch{return e}}getjson(t,e){let s=e;const i=this.getdata(t);if(i)try{s=JSON.parse(this.getdata(t))}catch{}return s}setjson(t,e){try{return this.setdata(JSON.stringify(t),e)}catch{return!1}}getScript(t){return new Promise(e=>{this.get({url:t},(t,s,i)=>e(i))})}runScript(t,e){return new Promise(s=>{let i=this.getdata("@chavy_boxjs_userCfgs.httpapi");i=i?i.replace(/\n/g,"").trim():i;let r=this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout");r=r?1*r:20,r=e&&e.timeout?e.timeout:r;const[o,h]=i.split("@"),n={url:`http://${h}/v1/scripting/evaluate`,body:{script_text:t,mock_type:"cron",timeout:r},headers:{"X-Key":o,Accept:"*/*"}};this.post(n,(t,e,i)=>s(i))}).catch(t=>this.logErr(t))}loaddata(){if(!this.isNode())return{};{this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e);if(!s&&!i)return{};{const i=s?t:e;try{return JSON.parse(this.fs.readFileSync(i))}catch(t){return{}}}}}writedata(){if(this.isNode()){this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e),r=JSON.stringify(this.data);s?this.fs.writeFileSync(t,r):i?this.fs.writeFileSync(e,r):this.fs.writeFileSync(t,r)}}lodash_get(t,e,s){const i=e.replace(/\[(\d+)\]/g,".$1").split(".");let r=t;for(const t of i)if(r=Object(r)[t],void 0===r)return s;return r}lodash_set(t,e,s){return Object(t)!==t?t:(Array.isArray(e)||(e=e.toString().match(/[^.[\]]+/g)||[]),e.slice(0,-1).reduce((t,s,i)=>Object(t[s])===t[s]?t[s]:t[s]=Math.abs(e[i+1])>>0==+e[i+1]?[]:{},t)[e[e.length-1]]=s,t)}getdata(t){let e=this.getval(t);if(/^@/.test(t)){const[,s,i]=/^@(.*?)\.(.*?)$/.exec(t),r=s?this.getval(s):"";if(r)try{const t=JSON.parse(r);e=t?this.lodash_get(t,i,""):e}catch(t){e=""}}return e}setdata(t,e){let s=!1;if(/^@/.test(e)){const[,i,r]=/^@(.*?)\.(.*?)$/.exec(e),o=this.getval(i),h=i?"null"===o?null:o||"{}":"{}";try{const e=JSON.parse(h);this.lodash_set(e,r,t),s=this.setval(JSON.stringify(e),i)}catch(e){const o={};this.lodash_set(o,r,t),s=this.setval(JSON.stringify(o),i)}}else s=this.setval(t,e);return s}getval(t){return this.isSurge()||this.isLoon()?$persistentStore.read(t):this.isQuanX()?$prefs.valueForKey(t):this.isNode()?(this.data=this.loaddata(),this.data[t]):this.data&&this.data[t]||null}setval(t,e){return this.isSurge()||this.isLoon()?$persistentStore.write(t,e):this.isQuanX()?$prefs.setValueForKey(t,e):this.isNode()?(this.data=this.loaddata(),this.data[e]=t,this.writedata(),!0):this.data&&this.data[e]||null}initGotEnv(t){this.got=this.got?this.got:require("got"),this.cktough=this.cktough?this.cktough:require("tough-cookie"),this.ckjar=this.ckjar?this.ckjar:new this.cktough.CookieJar,t&&(t.headers=t.headers?t.headers:{},void 0===t.headers.Cookie&&void 0===t.cookieJar&&(t.cookieJar=this.ckjar))}get(t,e=(()=>{})){t.headers&&(delete t.headers["Content-Type"],delete t.headers["Content-Length"]),this.isSurge()||this.isLoon()?(this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.get(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)})):this.isQuanX()?(this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t))):this.isNode()&&(this.initGotEnv(t),this.got(t).on("redirect",(t,e)=>{try{if(t.headers["set-cookie"]){const s=t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString();s&&this.ckjar.setCookieSync(s,null),e.cookieJar=this.ckjar}}catch(t){this.logErr(t)}}).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)}))}post(t,e=(()=>{})){if(t.body&&t.headers&&!t.headers["Content-Type"]&&(t.headers["Content-Type"]="application/x-www-form-urlencoded"),t.headers&&delete t.headers["Content-Length"],this.isSurge()||this.isLoon())this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.post(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)});else if(this.isQuanX())t.method="POST",this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t));else if(this.isNode()){this.initGotEnv(t);const{url:s,...i}=t;this.got.post(s,i).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)})}}time(t,e=null){const s=e?new Date(e):new Date;let i={"M+":s.getMonth()+1,"d+":s.getDate(),"H+":s.getHours(),"m+":s.getMinutes(),"s+":s.getSeconds(),"q+":Math.floor((s.getMonth()+3)/3),S:s.getMilliseconds()};/(y+)/.test(t)&&(t=t.replace(RegExp.$1,(s.getFullYear()+"").substr(4-RegExp.$1.length)));for(let e in i)new RegExp("("+e+")").test(t)&&(t=t.replace(RegExp.$1,1==RegExp.$1.length?i[e]:("00"+i[e]).substr((""+i[e]).length)));return t}msg(e=t,s="",i="",r){const o=t=>{if(!t)return t;if("string"==typeof t)return this.isLoon()?t:this.isQuanX()?{"open-url":t}:this.isSurge()?{url:t}:void 0;if("object"==typeof t){if(this.isLoon()){let e=t.openUrl||t.url||t["open-url"],s=t.mediaUrl||t["media-url"];return{openUrl:e,mediaUrl:s}}if(this.isQuanX()){let e=t["open-url"]||t.url||t.openUrl,s=t["media-url"]||t.mediaUrl;return{"open-url":e,"media-url":s}}if(this.isSurge()){let e=t.url||t.openUrl||t["open-url"];return{url:e}}}};if(this.isMute||(this.isSurge()||this.isLoon()?$notification.post(e,s,i,o(r)):this.isQuanX()&&$notify(e,s,i,o(r))),!this.isMuteLog){let t=["","==============📣系统通知📣=============="];t.push(e),s&&t.push(s),i&&t.push(i),console.log(t.join("\n")),this.logs=this.logs.concat(t)}}log(...t){t.length>0&&(this.logs=[...this.logs,...t]),console.log(t.join(this.logSeparator))}logErr(t,e){const s=!this.isSurge()&&!this.isQuanX()&&!this.isLoon();s?this.log("",`❗️${this.name}, 错误!`,t.stack):this.log("",`❗️${this.name}, 错误!`,t)}wait(t){return new Promise(e=>setTimeout(e,t))}done(t={}){const e=(new Date).getTime(),s=(e-this.startTime)/1e3;this.log("",`🔔${this.name}, 结束! 🕛 ${s} 秒`),this.log(),(this.isSurge()||this.isQuanX()||this.isLoon())&&$done(t)}}(t,e)}
