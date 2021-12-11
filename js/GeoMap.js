class GeoMap {
  /**
   *
   * @param id - id of the div that the map will be inserted to
   * @param mapData - geodata of the map
   * @param caller - The object that calls the function, needs to have fill method to define how the map will be colored
   * @param onMove - Function to be called when the mouse moves over the map
   * @param onClick- Function to be alled when the mouse clicks on a municipality
   */
  constructor(id, mapData, caller, onMove = () => {}, onClick = () => {}) {
    this.id = id;
    this.mapData = mapData;
    this.fill = (d) =>{return caller.fill(d)};
    this.onMove = onMove;
    this.onClick = onClick;

    this.width = document.getElementById(id).clientWidth;
    this.height = document.getElementById(id).clientHeight;

    this.toolTip = new ToolTip();
    this.draw()
  }

  update() {
    this.draw()
  }

  draw() {
    $(`#${this.id}svg`).remove();
    const self = this;

    const svg = d3.select(`#${this.id}`)
        .append("svg").attr("id", `${this.id}svg`)
        .attr("width", this.width)
        .attr("height", this.height);

    let projection = d3.geoMercator();
    let path = d3.geoPath().projection(projection);

    projection.fitSize([this.width, this.height], this.mapData);

    let svgs = svg.selectAll("path").data(this.mapData.features)
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
          self.toolTip.mouseMove(d, this);
          self.onMove(d.target.attributes.municipality_name.value);
        })
        .on("click", function(d) {
          svgs.attr("fill", self.fill);
          d3.select(this).attr("fill", "red");
          self.onClick(d);
        });
  }

}