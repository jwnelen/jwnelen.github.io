var width = 1600;
var height = 1200;

var svg = d3.select("#map_nl")
	.append("svg")
	.attr("width", width)
	.attr("height", height);

var projection = d3.geoMercator();
var path = d3.geoPath().projection(projection);

let loader = new DataLoader([
	{name: "mapData", filename: "data/nl.json"},
	{name: "co2Data", filename: "data/totale_co2_2019.csv"}]);

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
	.style("position", "absolute");

loader.getData(res => {
	var mapData = res["mapData"];
	var co2Data = res["co2Data"];

	var colorScaleCO2Data = d3.scaleLinear().domain([-1, 12126900]).range(["#e5f5f9", "#2ca25f"]);
	projection.fitSize([width, height], mapData);
	var municipalities = mapData;

	let mouseOver = function (d) {
		Tooltip
			.style("opacity", 1);
		d3.select(this)
			.style("stroke", "black")
			.style("opacity", 1)
		d3.selectAll(".Municipality")
			.transition()
			.duration(200)
			.style("opacity", .5)
		d3.select(this)
			.transition()
			.duration(100)
			.style("opacity", 1)
			.style("stroke", "black")
	}

	var mouseMove = function (d) {
		Tooltip
			.html("Say hi to the peeps of " + d.target.attributes.municipality_name.value)
			.style("left", (d.clientX - 30 + "px"))
			.style("top", (d.clientY - 50 + "px"))
	}

	let mouseLeave = function (d) {
		Tooltip
			.style("opacity", 0)
		d3.select(this)
			.style("stroke", "black")
			.style("opacity", 0.8)
		d3.selectAll(".Municipality")
			.transition()
			.duration(200)
			.style("opacity", .8)
		d3.select(this)
			.transition()
			.duration(100)
			.style("stroke", "transparent")
	}

	const paths = svg.selectAll("path").data(municipalities.features)
		.join('path')
		.attr("d", function (d) {
			return path(d);
		})
		.attr("fill", function (d) {
			var areaName = d.properties.areaName;
			var x = co2Data.find(element => element.Gemeenten === areaName)
			if (typeof (x) === "undefined") {
				return "grey";
			} else {
				return colorScaleCO2Data(x.CO2);
			}
		})
		.attr("stroke", "black")
		.attr("class", function (d) {
			return "Municipality"
		})
		.attr("municipality_name", function (d) {
			return d.properties.areaName
		})
		.attr("opacity", 0.8)
		.on("mouseover", mouseOver)
		.on("mouseleave", mouseLeave)
		.on("mousemove", mouseMove);
});

