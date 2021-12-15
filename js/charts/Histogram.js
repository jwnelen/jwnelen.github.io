class Histogram {
    constructor(id, data, key, verticalLineVal = null) {
      this.margin = {top: 30, right: 30, bottom: 70, left: 60};
      this.width = document.getElementById(id).clientWidth - this.margin.left - this.margin.right;
      this.height = document.getElementById(id).clientHeight - this.margin.top - this.margin.bottom;
      this.id = id;
      this.data = data;
      this.key = key;
      this.verticalLineVal = verticalLineVal
      this.draw();
    }

    update(newData,verticalLineVal) {
        this.data = newData;
        this.verticalLineVal = verticalLineVal
        this.draw()
        }
        
    draw() {
        let height = this.height
        d3.select("#"+this.id+"svg").remove()
        let data = this.data.filter(d => d[this.key] > 0).map(d => d[this.key])
        const svgHist = d3.select("#"+this.id)
            .append("svg").attr("id", this.id+"svg")
            .attr("width", this.width + this.margin.left + this.margin.right)
            .attr("height", this.height + this.margin.top + this.margin.bottom)
            .append("g")
            .attr("transform", `translate(${this.margin.left},${this.margin.top})`);
    
        // X axis
        var x = d3.scaleLinear()
        .domain([d3.min(data, function(d){return d}), d3.max(data, function(d){return +d})])     // can use this instead of 1000 to have the max of data: d3.max(data, function(d) { return +d.price })
        .range([0, this.width]);
        svgHist.append("g")
        .attr("transform", "translate(0," + this.height + ")")
        .call(d3.axisBottom(x));
    
          // set the parameters for the histogram
        var histogram = d3.histogram()
        .value(function(d) { return d })   // I need to give the vector of value
        .domain(x.domain())  // then the domain of the graphic
        .thresholds(x.ticks(70)); // then the numbers of bins
        
        var bins = histogram(data)
        // Add Y axis
        var y = d3.scaleLinear()
        .range([this.height, 0]);
        y.domain([0, d3.max(bins, function(d) { return d.length; })]);   // d3.hist has to be called before the Y axis obviously

        svgHist.append("g")
        .call(d3.axisLeft(y));

        
        // append the bar rectangles
        svgHist.selectAll("rect")
        .data(bins)
        .enter()
        .append("rect")
            .attr("x", 1)
            .attr("transform", function(d) {return "translate(" + x(d.x0) + "," + y(d.length) + ")"; })
            .attr("width", function(d) {return x(d.x1) - x(d.x0); })
            .attr("height", function(d) { return height - y(d.length); })
            .style("fill", "#69b3a2")


        if (!(this.verticalLineVal === null)){
          svgHist.append("svg:line")
          .attr("x1",x(this.verticalLineVal))
          .attr("x2",x(this.verticalLineVal))
          .attr("y1",0)
          .attr("y2",this.height)
          .style("stroke-dasharray", "4")
          .attr("stroke","grey")
          .attr("stroke-width", 2)
          .attr("fill", "black");
        }
    }
}