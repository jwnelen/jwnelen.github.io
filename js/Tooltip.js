class ToolTip {
  constructor(onMove) {
    this.Tooltip = d3.select("#map_nl")
        .append("div")
        .attr("class", "tooltip")
        .style("opacity", 0)
    this.currentMunicipality = "Aa en Hunze";
    this.onMove = onMove;
  }

  mouseOver = function (d, path) {
    this.Tooltip
        .style("opacity", 1)
    d3.select(path)
        .style("stroke", "black")
        .style("opacity", 1)
    d3.selectAll(".municipality")
        .transition()
        .duration(200)
        .style("opacity", .5)
    d3.select(path)
        .transition()
        .duration(100)
        .style("opacity", 1)
        .style("stroke", "black")
  }
  mouseMove = function (d, path, chart) {
    this.Tooltip
        .html("" + d.target.attributes.municipality_name.value)
        .style("left", (d.clientX - 30 + "px"))
        .style("top", (d.clientY - 50 + "px"));
    this.currentMunicipality = d.target.attributes.municipality_name.value;
    this.onMove(this.currentMunicipality);
  }

  mouseLeave = function(d, path) {
    this.Tooltip
        .style("opacity", 0)
    d3.select(path)
        .style("stroke", "black")
        .style("opacity", 0.8)
    d3.selectAll(".municipality")
        .transition()
        .duration(200)
        .style("opacity", .8)
    d3.select(path)
        .transition()
        .duration(100)
        .style("stroke", "black")
  }
}