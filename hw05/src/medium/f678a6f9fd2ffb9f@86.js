function _1(md){return(
md`# HW 05 Medium Baseline`
)}

function _data(FileAttachment){return(
FileAttachment("output.json").json()
)}

function _mygroup(data)
{
  // 複製一份資料
  let dataCopy = data;

  // 過濾掉 12組以外的資料
  dataCopy.children = dataCopy.children.filter(d => d.Group == 12)

  return dataCopy;
}


function _tree(d3,mygroup,drag,invalidation)
{
  function toggleNode(event, d) {
    
    if (d.data.leval == 1) { // 點到根節點
      let trans = true;
      nodes.forEach(node => { // toggle 組長節點
        if (node.data.leval == 2) {
          node.collapsed = !node.collapsed;
          trans = node.collapsed;
        } else if (node.data.leval == 3 && trans) {
          node.collapsed = trans;
        }
      });
      
    } else if (d.data.leval == 2) { // 點到組長節點
      let G = d.data.Group;
      nodes.forEach(node => { // toggle 組員節點
         if (node.data.leval > 2 && node.data.Group == G) {
           node.collapsed = !node.collapsed;
         }
      })
    }
    update()
  };

  function update() {
    node.attr("transform", d => {
      `translate(${d.x},${d.y})`;
      link
        .attr("x1", d => d.source.x)
        .attr("y1", d => d.source.y)
        .attr("x2", d => d.target.x)
        .attr("y2", d => d.target.y)
      node.style("display", d => d.collapsed ? "none" : null);
      link.style("display", d => d.target.collapsed ? "none" : null);
    })
  }
   // 指定圖表的尺寸。
  const width = 500;
  const height = 400;

  // 計算圖形並啟動力模擬。
  const root = d3.hierarchy(mygroup);
  const links = root.links();
  const nodes = root.descendants();
  
  const simulation = d3.forceSimulation(nodes)
      .force("link", d3.forceLink(links).id(d => d.id).distance(100).strength(1))
      .force("charge", d3.forceManyBody().strength(-400))
      .force("x", d3.forceX())
      .force("y", d3.forceY());

  // 創建容器 SVG。
  const svg = d3.create("svg")
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", [-width / 2, -height / 2, width, height])
      .attr("style", "max-width: 100%; height: auto;");

  // 添加連結。
  const link = svg.append("g")
      .attr("stroke", "#00f")
      .attr("stroke-opacity", 0.6)
      .selectAll("line")
      .data(links)
      .join("line");
  
  const linkForce = d3.forceLink(links)
    .id(d => d.id)
    .distance(1000) // 增加連結的距離
    .strength(1); // 可選：設定連結的強度

  // 設定節點的顏色，根據階層關係選擇不同的顏色
  const colorScale = d3.scaleOrdinal(d3.schemeCategory10); // 使用 D3 的顏色比例尺
  
  // 添加節點。
  const node = svg.append("g")
      .selectAll("g")
      .data(nodes)
      .join("g")
      .attr("transform", d => `translate(${d.x},${d.y})`) // 定位節點
      .call(drag(simulation))
      .on("click", toggleNode)
      .on("mouseenter", (event, d) => {
          if (d.data.leval === 2 || d.data.leval === 3) {
            const enlargement = 2; // 放大倍數
            const newWidth = circleRadius * size_offset * enlargement;
            const newHeight = circleRadius * size_offset * enlargement;
        
            // 計算放大後的 x 和 y 偏移量，以保持置中效果
            const xOffset = -circleRadius * size_offset * (enlargement / 2);
            const yOffset = -circleRadius * size_offset * (enlargement / 2);
        
            d3.select(event.currentTarget)
              .select("circle")
              .attr("r", circleRadius)
              .transition()
              .duration(100)
              .attr("r", circleRadius * enlargement);
            d3.select(event.currentTarget)
              .select("image")
              .transition()
              .duration(100)
              .attr("width", newWidth)
              .attr("height", newHeight)
              .attr("x", xOffset)
              .attr("y", yOffset);
          }
        })
        .on("mouseleave", (event, d) => {
          d3.select(event.currentTarget)
            .select("circle")
            .transition()
            .duration(100)
            .attr("r", circleRadius);
          d3.select(event.currentTarget)
            .select("image")
            .transition()
            .duration(100)
            .attr("width", circleRadius * size_offset)
            .attr("height", circleRadius * size_offset)
            .attr("x", -(circleRadius * offset))
            .attr("y", -(circleRadius * offset));
        });

  // 添加節點外框
  const circleRadius = 20; // 調整圓圈半徑大小
  node.append("circle")
      .attr("r", circleRadius)
      .attr("fill", "white") // 內部填充顏色
      .attr("stroke", d => colorScale(d.depth)) // 外框顏色根據節點深度
      .attr("stroke-width", 3);

  // 添加節點内每個人的照片
  const size_offset = 1.2; // 設定組員圖片大小
  const offset = size_offset / 2; // 計算組員圖片放置位置的偏移量
  node.append("image")
    .attr("x", -(circleRadius * offset))
    .attr("y", -(circleRadius * offset))
    .attr("width", circleRadius * size_offset)
    .attr("height", circleRadius * size_offset)
    .attr("href", d => d.data.image_url);

  // 添加節點文字説明
  node.append("title")
    .text(d => {
      if (d.data.leval == 1) {
        return d.data.Name;
      } else if (d.data.leval == 2) {
        return `組別： ${d.data.group}\n` + 
               `組長： ${d.data.Teamleadername}\n` + 
               `隊名： ${d.data.Teamname}\n` + 
               `團隊里程數： ${d.data.Teram_Mileage}`;
      } else if (d.data.leval == 3) {
        return `系所： ${d.data.Department}\n` + 
               `學號： ${d.data.Classnumber}\n` + 
               `姓名： ${d.data.Name}\n` + 
               `個人里程數： ${d.data.Personal_Mileage}\n` + 
               `作業1成績： ${d.data.Hw1_score}分\n` + 
               `作業2成績： ${d.data.Hw2_score}分\n` + 
               `作業3成績： ${d.data.Hw3_score}分\n` + 
               `作業4成績： ${d.data.Hw4_score}分\n` + 
               `作業5成績： ${d.data.Hw5_score}分\n` + 
               `作業6成績： ${d.data.Hw6_score}分\n` + 
               `作業7成績： ${d.data.Hw7_score}分\n` + 
               `作業8成績： ${d.data.Hw8_score}分\n` + 
               `作業9成績： ${d.data.Hw9_score}分\n` + 
               `作業10成績： ${d.data.Hw10_score}分`;
      }
    });
  
 // 設定節點初始位置在畫布的中間
  nodes.forEach(node => {
    node.y = 0; // 將y座標設定在畫布的中間
  });

  // 更新力模擬的y方向力，讓節點向下運動
  simulation.force("y", d3.forceY().strength(0.1).y(d => d.depth * 100)); // 調整力的方向和大小
  
  simulation.on("tick", () => {
    node.attr("transform", d => `translate(${d.x},${d.y})`); // 更新節點位置
    link
        .attr("x1", d => d.source.x)
        .attr("y1", d => d.source.y)
        .attr("x2", d => d.target.x)
        .attr("y2", d => d.target.y);
  });

  invalidation.then(() => simulation.stop());

  return svg.node();
}


function _drag(d3){return(
simulation => {
// Reheat the simulation when drag starts, and fix the subject position.
  function dragstarted(event, d) {
    if (!event.active) simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
  }

  // Update the subject (dragged node) position during drag.
  function dragged(event, d) {
    d.fx = event.x;
    d.fy = event.y;
  }

  // Restore the target alpha so the simulation cools after dragging ends.
  // Unfix the subject position now that it’s no longer being dragged.
  function dragended(event, d) {
    if (!event.active) simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
  }

  return d3.drag()
    .on("start", dragstarted)
    .on("drag", dragged)
    .on("end", dragended);
}
)}

export default function define(runtime, observer) {
  const main = runtime.module();
  function toString() { return this.url; }
  const fileAttachments = new Map([
    ["output.json", {url: new URL("../output.json", import.meta.url), mimeType: "application/json", toString}]
  ]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], _1);
  main.variable(observer("data")).define("data", ["FileAttachment"], _data);
  main.variable(observer("mygroup")).define("mygroup", ["data"], _mygroup);
  main.variable(observer("tree")).define("tree", ["d3","mygroup","drag","invalidation"], _tree);
  main.variable(observer("drag")).define("drag", ["d3"], _drag);
  return main;
}
