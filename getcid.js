const fetch = require("node-fetch");
const convert = require('./node_modules/xml-js');
const sleep = require('./node_modules/sleep');
var duration = 0;//这个是视频的长度
const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
});
 
function getItem(arr,n,v) {
    for (var i = 0; i < arr.length; i++)
        if (arr[i][n]<=v&&arr[i][n]>=v-1)
            console.log(arr[i]._text);
}
function display_commit_ter(commit_list){
	duration = duration * 1000;
	const start = Date.now();//这个是开始时间
	sleep.sleep(1);
	var millis = Date.now() - start; //开始时间转换成毫秒
	//console.log(getItem(commit_list,"_attributes",2));
	while(duration > millis){
		millis = Date.now() - start;
		//console.log(millis);
		sleep.sleep(1);
		//millis++;
		getItem(commit_list,"_attributes",millis/1000);//这个地方已经转换成秒了
	}
	//for(let i in commit_list){
		
	//}
	
	//console.log(getItem(commit_list,"_attributes",6.85200));
}

function getcommit(cid){
    var api_bilicommit = "https://api.bilibili.com/x/v1/dm/list.so?oid=" + cid;
    // console.log(api_bilicommit);
    var xml_commit;
    var json_commit;
    fetch(api_bilicommit)
        .then(response => response.text())
        .then(data => {
            xml_commit = data;
            json_commit = convert.xml2json(xml_commit, {compact: true, spaces: 4});
            // console.log(typeof(json_commit));
            json_commit = JSON.parse(json_commit);
            //console.log(json_commit.i.d);
            var commit_list = json_commit.i.d;
            for(let i in commit_list){
                //commit_list[i]._attributes.p = commit_list[i]._attributes.p.split(',');//这个方法把p也就是弹幕的所有特性进行了区分
                //commit_list[i]._attributes.p = commit_list[i]._attributes.p.split(',')[0];//这个方法把p也就是弹幕的所有特性进行了区分
                commit_list[i]._attributes = commit_list[i]._attributes.p.split(',')[0];//这个方法比较过分，给他上一级的变量赋值，这样会舍弃很多信息，但是，这是一个有趣的方法
				//console.log(commit_list[i]);
            }
			display_commit_ter(commit_list);
			//console.log(getItem(commit_list,"_attributes",6.85200));
         });
}
var msg = function(bvid){
    sleep.msleep(50);
    //bvid = "BV1x54y1e7zf";
    var api_transbvidtocid = "https://api.bilibili.com/x/player/pagelist?bvid="+bvid+"&jsonp=jsonp";
    var cid = "";
    fetch(api_transbvidtocid)
        .then((res) => res.json())
        .then((data) => {
            cid = data.data[0].cid;
            console.log(data);
			duration = data.data[0].duration;
			console.log(duration);
            getcommit(cid);
        })
}
readline.question('视频的BV号是：', name => {
  console.log(`正在查找BV ${name}!`);
  msg(name);
  readline.close();
});