class ToolTip {
  constructor() {
    this.Tooltip = d3.select("#map_nl")
        .append("div")
        .style("opacity", 1)
        .attr("class", "tooltip")
        .style("background-color", "white")
        .style("border", "solid")
        .style("border-width", "2px")
        .style("border-radius", "5px")
        .style("padding", "5px")
        .style("position", "absolute");
  }

  mouseOver = (d) => {
    this.Tooltip
        .style("opacity", 1)
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
  mouseMove = (d) => {
    this.Tooltip
        .html("Say hi to the peeps of " + d.target.attributes.municipality_name.value)
        .style("left", (d.clientX - 30 + "px"))
        .style("top", (d.clientY - 50 + "px"))
  }

  mouseLeave = (d) => {
    this.Tooltip
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
}