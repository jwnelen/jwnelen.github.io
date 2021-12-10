class ScatterPlot {
  constructor(id, data, additional_data = [], keyX, keyY) {
    this.margin = {top: 10, right: 30, bottom: 30, left: 60},
        this.width = 860 - this.margin.left - this.margin.right,
        this.height = 800 - this.margin.top - this.margin.bottom;
    this.id = id;
    this.data = data;
    this.keyX = keyX;
    this.keyY = keyY;
    this.additional_data = additional_data
    this.draw();
  }

  update(newData) {
    this.data = newData
    this.draw()
  }

  draw() {
    const self = this;

    d3.select("#" + this.id + "svg").remove()
    const svg = d3.select("#aggrChart")
        .append("svg").attr("id", this.id + "svg")
        .attr("width", this.width + this.margin.left + this.margin.right)
        .attr("height", this.height + this.margin.top + this.margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + this.margin.left + "," + this.margin.top + ")");

    const xs = this.data.map(d => d[this.keyX]).filter((a) => a > 0)
    const ys = this.data.map(d => d[this.keyY]).filter((a) => a > 0)
    const climates_labels = this.additional_data.map(d => d['climate_label']).filter((a) => a > 0)
    console.log(climates_labels)
    const minX = Math.min(...xs);
    const maxX = Math.max(...xs);
    const minY = Math.min(...ys)
    const maxY = Math.max(...ys)
    const minClimate = Math.min(...climates_labels)
    const maxClimate = Math.max(...climates_labels)
    console.log(minClimate)
    console.log(maxClimate)
    // Add X axis
    const xScale = d3.scaleLinear()
        .domain([minX, maxX])
        .range([0, this.width]);

    svg.append("g")
        .attr("transform", "translate(0," + this.height + ")")
        .call(d3.axisBottom(xScale));

    // Add Y axis
    let yScale = d3.scaleLinear()
        .domain([minY, maxY])
        .range([this.height, 0]);

    svg.append("g")
        .call(d3.axisLeft(yScale));

    let myColor = d3.scaleLinear().domain([minClimate,maxClimate])
        .range(["red", "green"])

    // Add dots
    const circles = svg.append('g')
        .selectAll("dot")
        .data(this.data)
        .enter()
        .append("circle")
        .attr("cx", d => xScale(d[self.keyX]))
        .attr("cy", d => yScale(d[self.keyY]))
        .attr("r", 3.5)
        .attr('municipality_name', (d) => d['municipality'])
        .attr('climate_label', (d) => {
          const res = this.additional_data.filter((a) => a.municipality === d['municipality'])
          return res.length > 0 ? res[0].climate_label : 0
        })
        .style("fill", (d) => {
          const res = this.additional_data.filter((a) => a.municipality === d['municipality'])
          const l = res.length > 0 ? res[0].climate_label : 0
          return myColor(l)
        })

    let tip = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0)

    // Add events to circles
    circles.on("mouseover", (d) => {
      console.log(d)
      tip.style("opacity", 1)
          .html(`${d.target.attributes.municipality_name.value} - ${d.target.attributes.climate_label.value}`)
          .style("left", (d.clientX - 30 + "px"))
          .style("top", (d.clientY - 50 + "px"));
    })
        .on("mouseout", function (d) {
          tip.style("opacity", 0)
        })
  }
}