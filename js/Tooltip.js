class ToolTip {
  constructor() {
    this.Tooltip = d3.select("#map_nl")
        .append("div")
        .attr("class", "tooltip")
        .style("opacity", 0)
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
  mouseMove = function (d, path) {
    this.Tooltip
        .html("" + d.target.attributes.municipality_name.value)
        .style("left", (d.clientX - 30 + "px"))
        .style("top", (d.clientY - 50 + "px"))
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