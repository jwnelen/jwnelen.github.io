class barChart {
  constructor(co2data) {
    this.margin = {top: 30, right: 30, bottom: 70, left: 60}
    this.widthBar = 460 - this.margin.left - this.margin.right
    this.heightBar = 400 - this.margin.top - this.margin.bottom;
    this.co2data = co2data
    this.draw();
  }

  update(newData) {
    this.co2data = newData
    this.draw()
  }

  draw() {
    d3.select("#barchartsvg").remove()
    let data = this.co2data.filter(d => d.CO2 > 0)

    const svgBarChart = d3.select("#barChart")
        .append("svg").attr("id", "barchartsvg")
        .attr("width", this.widthBar + this.margin.left + this.margin.right)
        .attr("height", this.heightBar + this.margin.top + this.margin.bottom)
        .append("g")
        .attr("transform", `translate(${this.margin.left},${this.margin.top})`);

    // X axis
    let x = d3.scaleBand()
        .range([ 0, this.widthBar ])
        .domain(data.map(function(d) { return d.municipality; }))
        .padding(0.2);

    svgBarChart.append("g")
        .attr("transform", "translate(0," + this.heightBar + ")")
        .call(d3.axisBottom(x))
        .selectAll("text")
        .attr("transform", "translate(-10,0)rotate(-45)")
        .attr("class", "axis")
        .style("text-anchor", "end");


    const max = Math.max(...data.map( (d) => d.CO2))
    console.log(max)
    // Add Y axis
    let y = d3.scaleLinear()
        .domain([0, max])
        .range([ this.heightBar, 0]);

    svgBarChart.append("g")
        .call(d3.axisLeft(y));

    // Bars
    svgBarChart.selectAll("mybar")
        .data(data)
        .join("rect")
        .attr("x", d => x(d.municipality))
        .attr("y", d => y(d.CO2))
        .attr("width", x.bandwidth())
        .attr("height", d => this.heightBar - y(d.CO2))
        .attr("fill", "#69b3a2")
  }
}
