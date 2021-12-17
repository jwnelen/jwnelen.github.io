class ToolTip {
  constructor() {
    this.Tooltip = d3.select("#map_nl")
        .append("div")
        .attr("class", "tooltip")
        .style("opacity", 0)

    this.toolTipText = d => `${d.target.attributes.municipality_name.value}`;
  }

  setToolTipText = function(text) {
    this.toolTipText = text;
  };

  mouseOver = function (d, path) {
    this.Tooltip
        .style("opacity", 1)
    d3.select(path)
        .style("stroke", "black")
        .style("opacity", 1)
    d3.selectAll(".municipality")
        .style("opacity", .5)
    d3.select(path)
        .style("opacity", 1)
        .style("stroke", "black")
  }
  mouseMove = function (d, path) {
    let attrs = d.target.attributes;
    this.Tooltip
        .html(this.toolTipText(d))
        .style("left", (d.clientX - 30 + "px"))
        .style("top", (d.clientY - 50 + "px"));
  };

  mouseLeave = function(d, path) {
    this.Tooltip
        .style("opacity", 0)
    d3.select(path)
        .style("stroke", "black")
        .style("opacity", 0.8)
    d3.selectAll(".municipality")
        .style("opacity", .8)
    d3.select(path)
        .style("stroke", "black")
  }
}