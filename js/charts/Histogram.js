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

    update(newData,verticalLineVal,selectedMun = null) {
        this.data = newData;
        this.verticalLineVal = verticalLineVal
        this.selectedMun = selectedMun
        this.draw()
    }
    

    draw() {
        d3.select("#"+this.id+"svg").remove()
        let data = this.data.filter(d => d[this.key] > 0)

        const svgHist = d3.select("#"+this.id)
            .append("svg").attr("id", this.id+"svg")
            .attr("width", this.width + this.margin.left + this.margin.right)
            .attr("height", this.height + this.margin.top + this.margin.bottom)
            .append("g")
            .attr("transform", `translate(${this.margin.left},${this.margin.top})`);
    
        var thisKey = this.key
        var x = d3.scaleLinear()
        .domain([d3.min(data, function(d){return d[thisKey]}), d3.max(data, function(d){return +d[thisKey]})])
        .range([0, this.width]);

        svgHist.append("g")
        .attr("transform", "translate(0," + this.height + ")")
        .call(d3.axisBottom(x));

        var nbins = data.length/4

        var histogram = d3.histogram()
        .value(function(d) { return d[thisKey] }) 
        .domain(x.domain()) 
        .thresholds(x.ticks(nbins));
        
        var bins = histogram(data)

        var binContainer = svgHist.selectAll(".gBin").data(bins)

        var binContainerEnter = binContainer.enter().append("g").attr("class","gBin").attr("transform", d => `translate(${x(d.x0)}, ${this.height})`)

        binContainerEnter.selectAll("circle").data(d =>{
          return d.map((data,i) =>{
            return{
              "index": i,
              "name": data.municipality,
              "value": data[thisKey],
              "radius": (x(d.x1) - x(d.x0))/2
            };
          })
        })
        .enter()
        .append("circle")
        .attr("cx", 0)
        .attr("cy", d => {return -d.index * 2 * d.radius - d.radius})
        .style("fill",d => {return d.name === this.selectedMun ? "red" : "green"})
        .attr("municipality",d => d.name)
        .attr("r",d => d.radius)

        binContainerEnter.merge(binContainer).attr("transform", d => `translate(${x(d.x0)}, ${this.height})`)

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