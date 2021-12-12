class ScatterPlot {
  constructor(id, data, caller, additional_data = [], keyX, labelX, keyY, labelY) {
    this.margin = {top: 10, right: 30, bottom: 30, left: 60},
        this.width = 860 - this.margin.left - this.margin.right,
        this.height = 860 - this.margin.top - this.margin.bottom;
    this.id = id;
    this.data = data;
    this.additional_data = additional_data
    this.keyX = keyX;
    this.keyY = keyY;
    this.labelX = labelX;
    this.labelY = labelY;

    this.radius = 6;

    this.fill = (d) => caller.fill(d)
    this.highlight = (d) => caller.highlight(d)
    this.isSelected = (n) => caller.isSelected(n)
    this.onClick = (d) => caller.onClick(d)
    this.draw();
  }

  update() {
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
    const minX = Math.min(...xs);
    const maxX = Math.max(...xs);
    const minY = Math.min(...ys)
    const maxY = Math.max(...ys)
    const minClimate = Math.min(...climates_labels)
    const maxClimate = Math.max(...climates_labels)

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

    let myColor = d3.scaleLinear().domain([minClimate, maxClimate])
        .range(["red", "green"])

    // Add dots
    const circles = svg.append('g')
        .selectAll("dot")
        .data(this.data)
        .enter()
        .append("circle")
        .attr("cx", d => xScale(d[self.keyX]))
        .attr("cy", d => yScale(d[self.keyY]))
        .attr("r", this.radius)
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
        .style("stroke", "yellow")
        .style("stroke-width", (d) => this.isSelected(d.municipality) ? 3 : 0)
        .style('opacity', (d) => this.isSelected(d.municipality) ? 1 : 0.4)
        .style('z-index', (d) => this.isSelected(d.municipality) ? 2 : 1)

    let tip = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0)

    // Add events to circles
    circles.on("mouseover", (d) => {
      tip.style("opacity", 1)
          .html(`${d.target.attributes.municipality_name.value} - ${d.target.attributes.climate_label.value}`)
          .style("left", (d.clientX - 30 + "px"))
          .style("top", (d.clientY - 50 + "px"));
    })
        .on("mouseout", function (d) {
          tip.style("opacity", 0)
        })
        .on("click", this.onClick)


    // Add X axis label:
    svg.append("text")
        .attr("text-anchor", "end")
        .attr("x", this.width / 2 + this.margin.left)
        .attr("y", this.height + this.margin.top + 20)
        .text(this.labelX);

    // Y axis label:
    svg.append("text")
        .attr("text-anchor", "end")
        .attr("transform", "rotate(-90)")
        .attr("y", -this.margin.left + 20)
        .attr("x", -this.margin.top - this.height / 2 + 20)
        .text(this.labelY)
  }
}