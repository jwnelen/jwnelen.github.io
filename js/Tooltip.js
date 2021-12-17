class ToolTip {
  constructor(id) {
    this.Tooltip = d3.select("#" + id)
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

  }
}