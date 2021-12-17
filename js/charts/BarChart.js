class BarChart {
  constructor(id, data, keyX, keyY, filter0 = true, colorScale = (d) => '#49cfc0',xLab=null,yLab=null) {
    this.margin = {top: 30, right: 30, bottom: 70, left: 60};
    this.widthBar = document.getElementById(id).clientWidth - this.margin.left - this.margin.right;
    this.heightBar = document.getElementById(id).clientHeight - this.margin.top - this.margin.bottom;
    this.colorScale = colorScale
    this.xLab = xLab
    this.yLab = yLab
    this.id = id;
    this.data = data;
    this.keyX = keyX;
    this.keyY = keyY;
    this.filter0 = filter0;
    this.draw();
  }

  update(newData = null) {
    this.data = newData ? newData : this.data;
    this.draw()
  }

  draw() {
    d3.select("#"+this.id+"svg").remove();
    let data = this.data;
    if(this.filter0) {
      data = this.data.filter(d => d[this.keyY] > 0);
    }


    const svgBarChart = d3.select("#"+this.id)
        .append("svg").attr("id", this.id+"svg")
        .attr("width", this.widthBar + this.margin.left + this.margin.right)
        .attr("height", this.heightBar + this.margin.top + this.margin.bottom)
        .append("g")
        .attr("transform", `translate(${this.margin.left},${this.margin.top})`);

    // X axis
    let x = d3.scaleBand()
        .range([ 0, this.widthBar ])
        .domain(data.map((d) => { return d[this.keyX]; }))
        .padding(0.2);

    svgBarChart.append("g")
        .attr("transform", "translate(0," + this.heightBar + ")")
        .call(d3.axisBottom(x))
        .append("text")
        .attr("class", "x label")
        .attr("text-anchor", "middle")
        .attr("x", 0)
        .attr("dx", ".75em")
        .text(this.xLab)
        .attr("transform", "translate("+ this.widthBar/2 +",30)");



    const max = Math.max(...data.map( (d) => d[this.keyY]))
    // Add Y axis
    let y = d3.scaleLinear()
        .domain([0, max])
        .range([ this.heightBar, 0]);


    svgBarChart.append("g")
        .call(d3.axisLeft(y).ticks(3).tickFormat(d => d*100 + "%"))
        .append("text")
        .attr("class", "y label")
        .attr("text-anchor", "middle")
        .attr("y", -45)
        .attr("dy", ".75em")
        .text(this.yLab)
        .attr("transform", "rotate(-90)");

    // Bars
    svgBarChart.selectAll("mybar")
        .data(data)
        .enter()
        .append("rect")
          .attr("x", d => x(d[this.keyX]))
          .attr("y", d => y(d[this.keyY]))
          .attr("width", x.bandwidth())
          .attr("height", d => Math.max(this.heightBar - y(d[this.keyY]), 0))
          .attr("class", "selected")
          .style("fill",(d) => this.colorScale(d[this.keyX]))
  }
}
