var width = 1600;
var height = 1200;

var svg = d3.select("#map_nl")
  .append("svg")
  .attr("width",width)  
  .attr("height",height);

var projection = d3.geoMercator();
var path = d3.geoPath().projection(projection);

var promises = []
// var co2Data = d3.csv("data/totale_co2_2019.csv")
// var mapData = d3.json("data/nl.json")
let incomeJSON = d3.csv("data/income-municipality.csv")

promises.push(incomeJSON)

// promises.push(mapData)
// promises.push(co2Data)

  // create a tooltip
var Tooltip = d3.select("#map_nl")
  .append("div")
  .style("opacity", 0)
  .attr("class", "tooltip")
  .style("background-color", "white")
  .style("border", "solid")
  .style("border-width", "2px")
  .style("border-radius", "5px")
  .style("padding", "5px")
  .style("position","absolute")

const getMunicipalitiesBelowThreshold = (muns, max) => {
  return muns.filter( (mun) => mun.income < max)
}

const createThresholdSelector = (incomes, min, max) => {
  let sliderSimple = d3
      .sliderBottom()
      .min(min)
      .max(max)
      .width(500)
      .tickFormat(d3.format(",.2r"))
      .ticks(5)
      .default((min + max) / 2)
      .on('onchange', val => {
        d3.select('p#value-simple').text(d3.format(",.2r")(val));
        const muns = getMunicipalitiesBelowThreshold(incomes, val)
        d3.select('p#municipalities').text("below threshold: " + muns.map( m => m.municipality));
      });

  let gSimple = d3
      .select('div#slider-simple')
      .append('svg')
      .attr('width', 500)
      .attr('height', 100)
      .append('g')
      .attr('transform', 'translate(30,30)');

  gSimple.call(sliderSimple);

  d3.select('p#value-simple').text(sliderSimple.value());

}

Promise.all(promises).then(promises => {
  console.log(promises)
  const incomeData = promises[0].map( mun => ({"municipality": mun["Gemeenten"], "income": mun["Gemiddeld inkomen per huishouden|2018"]}));

  const incomes = incomeData.map( mun => parseInt(mun.income)).filter(x => x)
  const min = Math.min(...incomes)
  const max = Math.max(...incomes)

  createThresholdSelector(incomeData, min, max)




  // var mapData = promises[0];
  // // var co2Data = promises[1];
  //
  // var colorScaleCO2Data = d3.scaleLinear().domain([-1,12126900]).range(["#e5f5f9","#2ca25f"]);
  // projection.fitSize([width,height],mapData)
  // var municipalities = mapData
  //
  // let mouseOver = function(d) {
  //   Tooltip
  //     .style("opacity", 1)
  //   d3.select(this)
  //     .style("stroke", "black")
  //     .style("opacity", 1)
  //   d3.selectAll(".Municipality")
  //     .transition()
  //     .duration(200)
  //     .style("opacity", .5)
  //   d3.select(this)
  //     .transition()
  //     .duration(100)
  //     .style("opacity", 1)
  //     .style("stroke", "black")
  // }
  //
  // var mouseMove = function(d) {
  //   Tooltip
  //     .html("Say hi to the peeps of " + d.target.attributes.municipality_name.value)
  //     .style("left", (d.clientX - 30 + "px"))
  //     .style("top", (d.clientY - 50 + "px"))
  // }
  //
  // let mouseLeave = function(d) {
  //   Tooltip
  //     .style("opacity", 0)
  //   d3.select(this)
  //     .style("stroke", "black")
  //     .style("opacity", 0.8)
  //   d3.selectAll(".Municipality")
  //     .transition()
  //     .duration(200)
  //     .style("opacity", .8)
  //   d3.select(this)
  //     .transition()
  //     .duration(100)
  //     .style("stroke", "transparent")
  // }
  //
  // const paths = svg.selectAll("path").data(municipalities.features)
  // .join('path')
  // .attr("d",function(d){
  //   return path(d);
  // })
  // .attr("stroke","black")
  // .attr("class",function(d){return "Municipality"})
  // .attr("municipality_name",function(d){return d.properties.areaName})
  // .attr("opacity",0.8)
  // .on("mouseover", mouseOver)
  // // .on("mouseleave", mouseLeave)
  // .on("mousemove", mouseMove)
})