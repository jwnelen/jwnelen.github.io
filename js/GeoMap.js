class GeoMap {
  constructor({mapData, incomes, middleValue}) {
    this.mapData = mapData
    this.incomes = incomes
    this.middleValue = middleValue

    this.width = 800;
    this.height = 800;

    this.toolTip = new ToolTip()
    this.draw()
  }

  update(middleValue) {
    this.middleValue = middleValue
    this.draw()
  }

  fill(d, incomes, val) {
    let areaName = d.properties.areaName;
    const munNames = getBelowThreshold(incomes, "income", val).map(mun => mun.municipality)
    const allMunNames = incomes.map(mun => mun.municipality)

    if (munNames.includes(areaName)) {
      return "selected" // below
    } else if (allMunNames.includes(areaName)) {
      return "not-selected" // above
    } else {
      return "unknown" // not found
    }
  }

  draw() {
    d3.select("#mapsvg").remove();

    const svg = d3.select("#map_nl")
        .append("svg").attr("id", "mapsvg")
        .attr("width", this.width)
        .attr("height", this.height);

    let projection = d3.geoMercator();
    let path = d3.geoPath().projection(projection);

    projection.fitSize([this.width, this.height], this.mapData)

    svg.selectAll("path").data(this.mapData.features)
        .join('path')
        .attr("d", function (d) {
          return path(d);
        })
        .attr("stroke", "black")
        .attr("class", "Municipality")
        .attr("municipality_name", function (d) {
          return d.properties.areaName
        })
        .attr("opacity", 0.8)
        .attr("class", (d) => this.fill(d, this.incomes, this.middleValue))
        .on("mouseover", (d) => this.toolTip.mouseOver(d))
        .on("mouseleave", (d) => this.toolTip.mouseLeave(d))
        .on("mousemove", (d) => this.toolTip.mouseMove(d));
  }

}