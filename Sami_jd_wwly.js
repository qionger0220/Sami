/*
#
京东极速App首页-汪汪乐园
 */
const $ = new Env('Sami汪汪乐园1-20');
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
        if (i>=0 && i<20){
            try {
                if (cookie) {
                $.UserName = decodeURIComponent(cookie.match(/pt_pin=([^; ]+)(?=;?)/) && cookie.match(/pt_pin=([^; ]+)(?=;?)/)[1])
                $.index = i + 1;
                $.isLogin = true;
                $.nickName = '';
                $.dataJson=[];
                $.vo2=[];
                $.hc=false;
                $.hc1=false;
                $.data =[];
                if (!$.isLogin) {
                    $.msg($.name, `【提示】cookie已失效`, `京东账号${$.index} ${$.nickName || $.UserName}\n请重新登录获取\nhttps://bean.m.jd.com/bean/signIndex.action`, { "open-url": "https://bean.m.jd.com/bean/signIndex.action" });
                    continue
                }
                console.log(`\n******开始【京东账号${$.index}】${$.nickName || $.UserName}*********\n`);
                ////////////////////首先查询所有汪汪信息，对于的工位上的汪汪，安排下工位///////////////////////////////////////////////////////////
                for (let ii = 0;ii < 50; ii++){
                    data = await GetAllInfo();
                    let aa=  data.data.hasOwnProperty('workJoyInfoList')
                   if(aa != true){
                       await $.wait(5000);
                       data = await GetAllInfo();
                   }
                   
    
                   
                   $.vo2= data.data;
                   for (let vo of  $.vo2.workJoyInfoList) {
                       if(vo.joyDTO != null){
                           let joyDTOID= vo.joyDTO.id;
                           //console.log("qqqq"+joyDTOID); 
                           let data = await DownPosition(joyDTOID);
                           if (data.code === 0){
                               if (data.errMsg === 'success'){
                                    console.log(`汪汪:`+joyDTOID+`下工位成功!`);
                                }else{
                                    console.log(`汪汪:`+joyDTOID+`下工位失败!`);
                                }
                           }
                           
                       }else if( vo.unlock == true){
                           console.log(`汪汪:工位上空空如也!`);
                       }
                        
                   }
                   
                   await $.wait(5000);
                   $.hcjg = false;
                   ///////////////////////////////////////
                   data = await GetAllInfo();///
                    aa = data.data.hasOwnProperty('workJoyInfoList');
                   if(aa != true){
                       await $.wait(5000);
                       data = await GetAllInfo();
                   }
                   /////////////////////////
                   await $.wait(5000);
                   $.vo2= data.data;
                    for (let vo of  $.vo2.activityJoyList) {
                        let joyDTOID1= vo.id;
                        let joyDTOlevel1= vo.level;
                         for (let vo1 of  $.vo2.activityJoyList) {
                             let joyDTOID2= vo1.id;
                             let joyDTOlevel2= vo1.level;
                             if(joyDTOID1 != joyDTOID2 && joyDTOlevel1 == joyDTOlevel2 ){
                                let DoMerge1 = await DoMerge(joyDTOID1,joyDTOID2);
                                if(DoMerge1.code === 0){
                                    if(DoMerge1.errMsg=="success"){
                                        console.log(`汪汪:合成成功!`);
                                        await $.wait(8000);
                                        $.hcjg = true;
                                        break;
                                    }
                                }
                                await $.wait(2000);
                             }
                         }
                         if ($.hcjg == true){
                            break;
                         }
                    }
                    if( $.hcjg == false){
                        break;
                    }
                }
                ////////////////////开始做任务///////////////////////////////////////////////////////////
                ///////////////////////////////////////
                data = await GetAllTask();///
                $.vo2= data;
                //console.log($.vo2);
                
                for (let vo of  $.vo2.data) {
                    let id=vo.id;
                    let taskTitle=vo.taskTitle;
                    let taskDoTimes=vo.taskDoTimes;
                    console.log('**************************');
                    console.log('开始任务：'+taskTitle);
                    
                    if (id==264 && (taskDoTimes==0 || taskDoTimes===null)){
                        //console.log(taskTitle);
                       await eveDayChack("apDoTask",id,"SIGN",taskTitle);
                       await $.wait(4000);
                       await eveDayChack("apTaskDrawAward",id,"SIGN",taskTitle);
                    }else if(id==264){
                         console.log('-->'+taskTitle + ':任务已完成');
                    }
                    if (id==662 && (taskDoTimes==0 || taskDoTimes===null)){
                       let data = await apDoTask("apDoTask",id,encodeURIComponent(vo.taskSourceUrl),"BROWSE_CHANNEL",taskTitle);
                       //console.log(data)
                       await $.wait(4000);
                       await eveDayChack("apTaskDrawAward",id,"BROWSE_CHANNEL",taskTitle);
                    }else if(id==662){
                         console.log('-->'+taskTitle + ':任务已完成');
                    }
                    
                    if (id==481 && (taskDoTimes != 5 || taskDoTimes===null)){
                      //console.log(taskTitle);
                      data = await gsh("apTaskDetail",id,"BROWSE_CHANNEL");
                      //console.log($.dataJson);
                      if (data.success===true){
                          //taskItemList
                            for (let vo3 of  data.data.taskItemList) {
                                let itemId=vo3.itemId;
                                let itemName=vo3.itemName;
                                console.log('--------------------------------');
                                console.log(itemName);
                                await apDoTask("apDoTask",id,itemId,"BROWSE_CHANNEL",taskTitle);
                                await $.wait(5000);
                                await eveDayChack("apTaskDrawAward",id,"BROWSE_CHANNEL",taskTitle);
                                await $.wait(5000);
                                
                            }
                      }
                    }else if(id==481){
                         console.log('-->'+taskTitle + ':任务已完成');
                    }
                    
                    if (id==630 && (taskDoTimes != 5 || taskDoTimes===null)){
                      // console.log(taskTitle);
                      data = await gsh("apTaskDetail",id,"BROWSE_PRODUCT");
                      //console.log($.dataJson);
                      $.vo3=data;
                      if ($.vo3.success===true){
                          //taskItemList
                          $.jc=taskDoTimes;
                            if(taskDoTimes === null){
                               $.jc = 0;
                            }
                            for (let vo3 of  $.vo3.data.taskItemList) {
                                let itemId=vo3.itemId;
                                let itemName=vo3.itemName;
                                console.log('--------------------------------');
                                console.log(itemName);
                                
                                await apDoTask("apDoTask",id,itemId,"BROWSE_PRODUCT",taskTitle);
                                if (data.success===false){
                                    console.log(`跳入下一个资源`)
                                    if(data.code===2005){
                                      break;
                                    }
                                }else{
                                    await $.wait(5000);
                                    await eveDayChack("apTaskDrawAward",id,"BROWSE_PRODUCT",taskTitle);
                                    await $.wait(5000);
                                    $.jc=$.jc+1;
                                }
                                if($.jc >= 5){
                                        break;
                                    }
                                    if(data.success===false){
                                        break;
                                    }
                                
                            }
                      }
                    }else if(id==630){
                         console.log('-->'+taskTitle + ':任务已完成');
                    }
                    
                   
                  }
                  await $.wait(1000);
                ////////////////////开始购买并合成///////////////////////////////////////////////////////////
                 $.hcjg = false;
                for (let ii = 0;ii < 50; ii++){
                    if ( $.hcjg === false){
                        data = await joyBaseInfo();
                        if(data.code===0){
                            if(data.data.level===30){
                                console.log('汪汪已经成熟啦，赶紧领取！！！');
                                break;
                            }else{
                                console.log('---------------------------------');
                                console.log('汪汪目前等级:'+data.data.level);
                                console.log('汪汪购买等级:'+data.data.fastBuyLevel);
                                if (data.data.joyCoin >= data.data.fastBuyCoin){
                                    data1 = await joyBuy(data.data.fastBuyLevel);
                                    if (data1.code ===0){
                                        console.log('汪汪购买成功:'+data1.data.name);
                                    }else{
                                        console.log('汪汪购买失败,5S后重试');
                                        await $.wait(5000)
                                        data1 = await joyBuy(data.data.fastBuyLevel);
                                        if (data1.code ===0){
                                        console.log('汪汪购买成功:'+data1.data.name);
                                    }else{
                                        console.log('汪汪购买失败，程序退出购买');
                                        break;
                                    }
                                        
                                    }
                                }else{
                                    console.log('汪汪购买失败:没有钱了！！');
                                    break;
                                }
                                
                                
                            }
                        }
                    }
                    
                    //购买成功后开始合成
                   await $.wait(5000);
                  $.hcjg = false;
                   ///////////////////////////////////////
                   //data = await GetAllInfo();///
                   data = await GetAllInfo();///
                   aa=  data.data.hasOwnProperty('workJoyInfoList')
                   if(aa != true){
                       await $.wait(5000);
                       data = await GetAllInfo();
                   }
                   /////////////////////////
                   
                   await $.wait(5000);
                   $.vo2= data.data;
                    for (let vo of  $.vo2.activityJoyList) {
                        let joyDTOID1= vo.id;
                        let joyDTOlevel1= vo.level;
                         for (let vo1 of  $.vo2.activityJoyList) {
                             let joyDTOID2= vo1.id;
                             let joyDTOlevel2= vo1.level;
                             if(joyDTOID1 != joyDTOID2 && joyDTOlevel1 == joyDTOlevel2 ){
                                let DoMerge1 = await DoMerge(joyDTOID1,joyDTOID2);
                                if(DoMerge1.code === 0){
                                    if(DoMerge1.errMsg=="success"){
                                        console.log(`汪汪:合成成功!`);
                                        await $.wait(8000);
                                        $.hcjg = true;
                                        break;
                                    }
                                }
                                await $.wait(2000);
                             }
                         }
                         if ($.hcjg == true){
                            break;
                         }
                    }
                }
                    
                ////////////////////开始上工位打工///////////////////////////////////////////////////////////
                 ///////////////////////////////////////
                   data = await GetAllInfo();///
                   aa=  data.data.hasOwnProperty('workJoyInfoList')
                   if(aa != true){
                       await $.wait(5000);
                       data = await GetAllInfo();
                   }
                   /////////////////////////
                   await $.wait(5000);
                   
                   data.data.activityJoyList=sortByKey( data.data.activityJoyList,"level");
                   $.vo2= data.data;
                   //let string = JSON.stringify(data.data)
                   //console.log(`汪汪:上工位成功!`+string);
                   //{ location: 1, unlock: true, joyDTO: null }
                   for (let vo of  $.vo2.workJoyInfoList) {
                       
                       if (vo.unlock === true && vo.joyDTO === null){
                           for (let vo1 of  $.vo2.activityJoyList) {
                                 let joyDTOID= vo1.id;
                                 data = await joyMove(joyDTOID,vo.location);
                                 console.log(data);
                                 if(data.code === 0){
                                     console.log(`汪汪:`+vo1.level+`上工位成功!`);
                                      //data = await GetAllInfo();
                                      ///////////////////////////////////////
                                       data = await GetAllInfo();///
                                       aa=  data.data.hasOwnProperty('workJoyInfoList')
                                       if(aa != true){
                                           await $.wait(5000);
                                           data = await GetAllInfo();
                                       }
                                       /////////////////////////
                                       await $.wait(5000);
                                        data.data.activityJoyList=sortByKey( data.data.activityJoyList,"level");
                                       $.vo2= data.data;
                                 }
                                 break;
                            }
                       }
                   }
                       
                           
                           
                           
                    
                
                
                
                console.log(`时间等待10S`);
                await $.wait(10000);
                // await GetAllInfo();
                // $.vo2=$.dataJson.data;
                // console.log($.vo2);
                // for (let vo of  $.vo2.workJoyInfoList) {
                //     if(vo.joyDTO != null){
                //       let joyDTOID= vo.joyDTO.id;
                //       let location = vo.location;
                //       console.log("qqqq"+joyDTOID); 
                //       await DownPosition(joyDTOID,"0");
                //       await $.wait(2000);
                //     }
                //   }
                ////////////////////首先查询所有汪汪信息，对于的工位上的汪汪，安排下工位///////////////////////////////////////////////////////////
                //await $.wait(1000);
                ////////////////////下工位后开始进行合成///////////////////////////////////////////////////////////
                // for (let ii = 0; ii < 50; ii++) {
                //     $.hc=false;
                //     console.log(`3`);
                //     await GetAllInfo();
                //     $.vo2=$.dataJson.data;
                //     for (let vo of  $.vo2.activityJoyList) {/////////////////////////////////////////////////
                //         let id= vo.id;
                //         let level = vo.level;
                //         for (let vo1 of  $.vo2.activityJoyList) {//******************************************
                //           let id1= vo1.id;
                //           let level1 = vo1.level;
                //           if (id1 != id && level1===level){
                //               console.log("qqqq"+id1 + "-"+id+"--qqqq"+level1+"-"+level); 
                //               //开始合成，合成成功跳出for循环 进行下一次合成
                //               await DoMerge(id1,id);
                //               console.log(`2`);
                //               //$.hc=true;
                //               break;
                //           }
                //           await $.wait(2000);
                //         }//******************************************
                //         if($.hc===true){
                //             break;
                //         }
                        
                        
                //     }////////////////////////////////////////////////////////////////
                //     if ($.hc===false){
                //         break;
                //     }
                //     if ($.hc1===true){
                //         console.log(`合成网络失败`);
                //         break;
                //     }
                //     console.log(`1`);
                    
                // }
                
                
                
                if (i != cookiesArr.length - 1) {
                    await $.wait(2000);
                }
            }
            } catch (e) {
                
            } finally {
                
            }
        }
    }
})()
    .catch((e) => $.logErr(e))
    .finally(() => $.done())


function sortJson(a,b){  
   return b.level-a.level;  
}  

function sortByKey(array, key) {
     return array.sort(function(a, b) {
         var x = a[key]; var y = b[key];
         return ((x > y) ? -1 : ((x < y) ? 1 : 0));
     });
 }



//获取所有工位信息
function GetAllInfo() {
    return new Promise(async resolve => {
        const options = {
            url: `https://api.m.jd.com/?functionId=joyList&body={%22linkId%22:%22LsQNxL7iWDlXUs6cFl-AAg%22}&_t=1644237008865&appid=activities_platform`,
            headers: {
                "referer": "https://joypark.jd.com/",
                "Content-Type": "application/x-www-form-urlencoded",
                "Cookie": cookie,
                "User-Agent": $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : (require('./USER_AGENTS').USER_AGENT)) : ($.getdata('JDUA') ? $.getdata('JDUA') : "jdapp;iPhone;9.4.4;14.3;network/4g;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1")
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

//下工位
function DownPosition(joyId) {
    return new Promise(async resolve => {
        const options = {
            url: `https://api.m.jd.com/`,
            body: `functionId=joyMove&body={"joyId":${joyId},"location":0,"linkId":"LsQNxL7iWDlXUs6cFl-AAg"}&_t=1644557796198&appid=activities_platform`,
            headers: {
                "referer": "https://joypark.jd.com/",
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
                        //$.dataJson=data;
                        //{"success":true,"code":0,"errMsg":"success","data":{"activityJoyList":[{"id":88670,"level":29,"name":"暖心汪","speed":"268435456","recoveryPrice":1970013226251930,"fastBuyLevel":null,"fastBuyCoin":null},{"id":89068,"level":28,"name":"画家汪","speed":"134217728","recoveryPrice":721616566392651,"fastBuyLevel":null,"fastBuyCoin":null},{"id":89070,"level":26,"name":"滑板汪","speed":"33554432","recoveryPrice":96823594358256,"fastBuyLevel":null,"fastBuyCoin":null}],"workJoyInfoList":[{"location":1,"unlock":true,"joyDTO":null},{"location":2,"unlock":true,"joyDTO":null},{"location":3,"unlock":false,"joyDTO":null},{"location":4,"unlock":false,"joyDTO":null},{"location":5,"unlock":false,"joyDTO":null}],"joyNumber":3}}
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

//开始合成
function DoMerge(joyId1,joyId2) {
    return new Promise(async resolve => {
        const options = {
            url: `https://api.m.jd.com/?functionId=joyMergeGet&body={%22joyOneId%22:${joyId1},%22joyTwoId%22:${joyId2},%22linkId%22:%22LsQNxL7iWDlXUs6cFl-AAg%22}&_t=1644237007838&appid=activities_platform`,
            headers: {
                "referer": "https://joypark.jd.com/",
                "Content-Type": "application/x-www-form-urlencoded",
                "Cookie": cookie,
                "User-Agent": $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : (require('./USER_AGENTS').USER_AGENT)) : ($.getdata('JDUA') ? $.getdata('JDUA') : "jdapp;iPhone;9.4.4;14.3;network/4g;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1")
            }
        }
        $.get(options, (err, resp, data) => {
            try {
                if (err) {
                    console.log(`${JSON.stringify(err)}`)
                    console.log(`${$.name} API请求失败，请检查网路重试`)
                    $.hc1=true;
                } else {
                    if (data) {
                        data = JSON.parse(data);

                        //{"success":true,"code":0,"errMsg":"success","data":{"activityJoyList":[{"id":88670,"level":29,"name":"暖心汪","speed":"268435456","recoveryPrice":1970013226251930,"fastBuyLevel":null,"fastBuyCoin":null},{"id":89068,"level":28,"name":"画家汪","speed":"134217728","recoveryPrice":721616566392651,"fastBuyLevel":null,"fastBuyCoin":null},{"id":89070,"level":26,"name":"滑板汪","speed":"33554432","recoveryPrice":96823594358256,"fastBuyLevel":null,"fastBuyCoin":null}],"workJoyInfoList":[{"location":1,"unlock":true,"joyDTO":null},{"location":2,"unlock":true,"joyDTO":null},{"location":3,"unlock":false,"joyDTO":null},{"location":4,"unlock":false,"joyDTO":null},{"location":5,"unlock":false,"joyDTO":null}],"joyNumber":3}}
                        
                            //$.log(`合成结果: ` + data);
                    } else {
                        console.log(`京东服务器返回空数据`)
                    }
                    $.hc1=false;
                    $.hc=true;
                }
            } catch (e) {
                $.logErr(e, resp)
            } finally {
                resolve(data);
            }
        })
    })
}


//获取所有任务信息
function GetAllTask() {
    return new Promise(async resolve => {
        const options = {
            url: `https://api.m.jd.com/`,
            body:`functionId=apTaskList&body={"linkId":"LsQNxL7iWDlXUs6cFl-AAg"}&_t=1644236293058&appid=activities_platform`,
            headers: {
                "referer": "https://joypark.jd.com/",
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


//每日签到任务
function eveDayChack(functionId,taskId,taskType,taskTitle) {
    return new Promise(async resolve => {
        const options = {
            url: `https://api.m.jd.com/`,
            body:`functionId=${functionId}&body={"taskType":"${taskType}","taskId":${taskId},"linkId":"LsQNxL7iWDlXUs6cFl-AAg"}&_t=1644236536442&appid=activities_platform`,
            headers: {
                "referer": "https://joypark.jd.com/",
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

//每日逛商会
function gsh(functionId,taskId,taskType) {
    return new Promise(async resolve => {
        const options = {
            url: `https://api.m.jd.com/`,
            body:`functionId=${functionId}&body={"taskType":"${taskType}","taskId":${taskId},"channel":4,"linkId":"LsQNxL7iWDlXUs6cFl-AAg"}&_t=1644660402980&appid=activities_platform`,
                   //functionId=apTaskDetail&body={"taskType":"BROWSE_PRODUCT","taskId":483,"channel":4,"linkId":"LsQNxL7iWDlXUs6cFl-AAg"}&_t=1644661811786&appid=activities_platform
            headers: {
                "referer": "https://joypark.jd.com/",
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
                       // $.dataJson=data;
                        
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
                        //$.dataJson1=data;
                        
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


function joyBaseInfo() {
    return new Promise(async resolve => {
        const options = {
            url: `https://api.m.jd.com/`,
            body: `functionId=joyBaseInfo&body={"taskId":"","inviteType":"","inviterPin":"","linkId":"LsQNxL7iWDlXUs6cFl-AAg"}&_t=1646401573255&appid=activities_platform`,
            headers: {
                "authority": "api.m.jd.com",
                "origin": "https://joypark.jd.com",
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

function joyBuy(id) {
    return new Promise(async resolve => {
        const options = {
            url: `https://api.m.jd.com/`,
            body: `functionId=joyBuy&body={"level":${id},"linkId":"LsQNxL7iWDlXUs6cFl-AAg"}&_t=1646401574262&appid=activities_platform`,
            headers: {
                "authority": "api.m.jd.com",
                "origin": "https://joypark.jd.com",
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

function joyMove(id,i) {
    return new Promise(async resolve => {
        const options = {
            url: `https://api.m.jd.com/`,
            body: `functionId=joyMove&body={"joyId":${id},"location":${i},"linkId":"LsQNxL7iWDlXUs6cFl-AAg"}&_t=1646405477001&appid=activities_platform`,
            headers: {
                "authority": "api.m.jd.com",
                "Referer": "https://joypark.jd.com",
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
