class ScatterPlot {
  constructor(id, data, keyX, keyY) {
    this.margin = {top: 10, right: 30, bottom: 30, left: 60},
        this.width = 860 - this.margin.left - this.margin.right,
        this.height = 800 - this.margin.top - this.margin.bottom;
    this.id = id;
    this.data = data;
    this.keyX = keyX;
    this.keyY = keyY;
    this.draw();
  }

  update(newData) {
    this.data = newData
    this.draw()
  }

  draw() {
    d3.select("#"+this.id+"svg").remove()
    const self = this;

    const svg = d3.select("#aggrChart")
        .append("svg").attr("id", this.id+"svg")
        .attr("width", this.width + this.margin.left + this.margin.right)
        .attr("height", this.height + this.margin.top + this.margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + this.margin.left + "," + this.margin.top + ")");

    //var xScale = d3.scaleLinear().domain([0, 100]).range([0, width]),
    //             yScale = d3.scaleLinear().domain([0, 200]).range([height, 0]);

    const xs = this.data.map(d => d[this.keyX]).filter( (a) => a > 0)
    const ys = this.data.map(d => d[this.keyY]).filter( (a) => a > 0)
    //Math.min(...this.data.map(d => d[this.keyX]).filter(d => d > 0))

    const minX = Math.min(...xs);
    const maxX = Math.max(...xs);
    const minY = Math.min(...ys)
    const maxY = Math.max(...ys)

    // Add X axis
    const xScale = d3.scaleLinear()
        .domain([minX, maxX])
        .range([ 0, this.width ]);

    svg.append("g")
        .attr("transform", "translate(0," + this.height + ")")
        .call(d3.axisBottom(xScale));

    // Add Y axis
    let yScale = d3.scaleLinear()
        .domain([minY, maxY])
        .range([this.height, 0]);

    svg.append("g")
        .call(d3.axisLeft(yScale));

    let tip = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0)

    // Add dots
    svg.append('g')
        .selectAll("dot")
        .data(this.data)
        .enter()
        .append("circle")
        .attr("cx", d => xScale(d[self.keyX]))
        .attr("cy", d => yScale(d[self.keyY]))
        .attr("r", 3.5)
        .style("fill", "#69b3a2")

    svg.selectAll("text")
        .data(this.data)
        .enter()
        .append("text")
        .attr("x", d => xScale(d[self.keyX]) + 10)
        .attr("y",d => yScale(d[self.keyY]) + 1)
        .text(function(d) {return d["municipality"]})
        .attr("font-size", "10px")
  }
}