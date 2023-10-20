import define1 from "./a33468b95d0b15b0@817.js";

function _1(md){return(
md`<div style="color: grey; font: 13px/25.5px var(--sans-serif); text-transform: uppercase;"><h1 style="display: none;">Stacked bar chart, horizontal</h1><a href="https://d3js.org/">D3</a> › <a href="/@d3/gallery">Gallery</a></div>

# Stacked bar chart, horizontal 

This [stacked bar chart](/@d3/stacked-bar-chart/2) shows population by age and state. Data: [American Community Survey](/@mbostock/working-with-the-census-api)`
)}

async function _data(FileAttachment)
{
  const data = await FileAttachment("data.csv").csv({typed: true});
  return data.columns.slice(5).flatMap((columns) => data.map((d) => ({
    index:d.序號,
    class:d.班級,
    id:d.學號,
    name: d.姓名,
    github: d.GitHub,
    columns,
    hw:d[columns]
  })));
}


function _4(md){return(
md`Using [Observable Plot](https://observablehq.com/plot)’s concise API, you can create a similar chart with a [bar mark](https://observablehq.com/plot/marks/bar). See the [Plot: Stacked Bar Chart, Horizontal](https://observablehq.com/@observablehq/plot-stacked-bar-chart-horizontal?intent=fork) example notebook.`
)}

function _5(Plot,data){return(
Plot.plot({
  x: {axis: "top", transform: (d) => d },
  color: {scheme: "RdYlBu"},
  marks: [Plot.barX(data, {y: "name", x: "hw", fill: "hw"})]
})
)}

export default function define(runtime, observer) {
  const main = runtime.module();
  function toString() { return this.url; }
  const fileAttachments = new Map([
    ["data.csv", {url: new URL("./files/b7b8f9f8c14bdf52dd177532b5651d75602fff4d5d751b53f28a1f03cfacd2c1f9816c10799d35dcb012d944680c093f241054b87b125ed9b721aee190efd06e.csv", import.meta.url), mimeType: "text/csv", toString}]
  ]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], _1);
  main.variable(observer("data")).define("data", ["FileAttachment"], _data);
  const child1 = runtime.module(define1);
  main.import("legend", child1);
  main.variable(observer()).define(["md"], _4);
  main.variable(observer()).define(["Plot","data"], _5);
  return main;
}
