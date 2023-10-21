function _1(md){return(
md`# HW2 Strong baseline (2pt)`
)}

function _data(FileAttachment){return(
FileAttachment("data.json").json()
)}

function _yCounts(){return(
[]
)}

function _xlabels(){return(
["牡羊座", "金牛座", "雙子座", "巨蟹座", "獅子座", "處女座", "天秤座", "射手座", "摩羯座", "水瓶座", "雙魚座", "天蠍座"]
)}

function _years(data){return(
data.map(item => item.Year)
)}

function _6(yCounts,xlabels,data)
{
  yCounts.length = 0; //將yCounts清空
  for (let y=0; y<=11; y++) { 
    //所有年份都建立兩個Object，一個存放男性資料，一個存放女性資料
    yCounts.push({constellation:xlabels[y], gender:"male", count:0}); 
    //Object包含：1. 星座，2.男性，3.人數(設為0)
    yCounts.push({constellation:xlabels[y], gender:"female", count:0}); 
    //Object包含：1. 星座，2.女性，3.人數(設為0)
  }
  data.forEach (x=> {
    let i = (x.Constellation)* 2 + (x.Gender== "男" ? 0 : 1); 
    yCounts[i].count++;
    //讀取data array，加總每個年份出生的人
  })
  return yCounts
}


function _7(Plot,yCounts){return(
Plot.plot({
  marginTop: 50,
  marginRight: 50,
  marginBottom: 50,
  marginLeft: 50,

  grid: true,
  y: {label: "count"},
  marks: [
    Plot.ruleY([0]),
    Plot.barY(yCounts, {x: "constellation", y: "count", tip: true , fill:"gender"}),
  ],
  layout: {
    yaxis: { range: [0, 5] } // 限制 y 轴范围为 0 到 5
  },
})
)}

export default function define(runtime, observer) {
  const main = runtime.module();
  function toString() { return this.url; }
  const fileAttachments = new Map([
    ["data.json", {url: new URL("./files/2259824662fb612853b8873b8814ace51e8cbac39ba881850d66e26df63f1897b01d1bd3459af6529669fd912da9dd607a30666a93278d7fdfa10bbe22b8913d.json", import.meta.url), mimeType: "application/json", toString}]
  ]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], _1);
  main.variable(observer("data")).define("data", ["FileAttachment"], _data);
  main.variable(observer("yCounts")).define("yCounts", _yCounts);
  main.variable(observer("xlabels")).define("xlabels", _xlabels);
  main.variable(observer("years")).define("years", ["data"], _years);
  main.variable(observer()).define(["yCounts","xlabels","data"], _6);
  main.variable(observer()).define(["Plot","yCounts"], _7);
  return main;
}
