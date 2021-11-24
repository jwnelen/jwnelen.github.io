const width = 1600;
const height = 1200;

const svg = d3.select("#map_nl")
    .append("svg")
    .attr("width", width)
    .attr("height", height);


let projection = d3.geoMercator();
let path = d3.geoPath().projection(projection);

let loader = new DataLoader([
	{name: "mapData", filename: "data/nl.json"},
	{name: "co2Data", filename: "data/totale_co2_2019.csv"},
  {name: "income", filename: "data/income-municipality.csv"}]);

const getMunicipalitiesBelowThreshold = (muns, val) => {
  return muns.filter((mun) => mun.income < val)
}

const createThresholdSelector = (incomes, min, max, onChange) => {
  let sliderSimple = d3
      .sliderBottom()
      .min(min)
      .max(max)
      .width(400)
      .tickFormat(d3.format(",.2r"))
      .ticks(5)
      .default((min + max) / 2)
      .on('onchange', val => {
        onChange(val)
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

loader.getData(res => {
  let mapData = res["mapData"];
  let incomes = res["income"];

  loader.changeKeys(incomes, [
      {from: 'Gemiddeld inkomen per huishouden|2018', to: "income"},
      {from: "Gemeenten", to: "municipality"}])

  const incomeValues = incomes.map(mun => parseInt(mun.income)).filter(x => x)
  const min = Math.min(...incomeValues)
  const max = Math.max(...incomeValues)
  let threshold = (min + max) / 2
  projection.fitSize([width, height], mapData)

  const fill = (d, incomes, val) => {
    let areaName = d.properties.areaName;
    const munNames = getMunicipalitiesBelowThreshold(incomes, val).map(mun => mun.municipality)
    const allMunNames = incomes.map(mun => mun.municipality)

    if (munNames.includes(areaName)) {
      return "red" // below
    } else if (allMunNames.includes(areaName)) {
      return "green" // above
    } else {
        return "grey" // not found
      }
    }

  const paths = svg.selectAll("path").data(mapData.features)
      .join('path')
      .attr("d", function (d) {
        return path(d);
      })
      .attr("stroke", "black")
      .attr("class", function (d) {
        return "Municipality"
      })
      .attr("municipality_name", function (d) {
        return d.properties.areaName
      })
      .attr("opacity", 0.8)
      .attr("fill", (d) => fill(d, incomes, threshold))

  createThresholdSelector(incomes, min, max, (newVal) => {
    paths.attr("fill", (d) => fill(d, incomes, newVal))
  })

})

  // .on("mouseover", mouseOver)
  // .on("mouseleave", mouseLeave)
  // .on("mousemove", mouseMove)


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
  // let mouseMove = function(d) {
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