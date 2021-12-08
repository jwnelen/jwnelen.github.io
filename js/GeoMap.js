class GeoMap {
  constructor(id, mapData, caller, onMove) {
    this.id = id;
    this.mapData = mapData;
    this.fill = (d) =>{return caller.fill(d)};

    this.width = document.getElementById(id).clientWidth;
    this.height = document.getElementById(id).clientHeight;

    this.toolTip = new ToolTip(onMove);
    this.draw()
  }

  update() {
    this.draw()
  }

  draw() {
    d3.select(`#${this.id}svg`).remove();
    const self = this;

    const svg = d3.select(`#${this.id}`)
        .append("svg").attr("id", `#${this.id}svg`)
        .attr("width", this.width)
        .attr("height", this.height);

    let projection = d3.geoMercator();
    let path = d3.geoPath().projection(projection);

    projection.fitSize([this.width, this.height], this.mapData);

    svg.selectAll("path").data(this.mapData.features)
        .join('path')
        .attr("d", function (d) {
          return path(d);
        })
        .attr("fill", this.fill)
        .attr("stroke","black")
        .attr("class",function(d){return "Municipality"})
        .attr("municipality_name",function(d){return d.properties.areaName})
        .attr("opacity",0.8)
        .on("mouseover", function(d){
          self.toolTip.mouseOver(d, this)
        })
        .on("mouseleave",  function(d){
          self.toolTip.mouseLeave(d, this)
        })
        .on("mousemove",  function(d){
          self.toolTip.mouseMove(d, this)
        });
  }

}