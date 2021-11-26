// const widthBar = 400;
// const heightBar = 200;

// set the dimensions and margins of the graph
const margin = {top: 30, right: 30, bottom: 70, left: 60},
    widthBar = 460 - margin.left - margin.right,
    heightBar = 400 - margin.top - margin.bottom;

createBarChart = (data) => {
  data = data.filter(d => d.CO2 > 0)
  console.log(data.length)

  d3.select("#barchartsvg").remove()

  const svgBarChart = d3.select("#barChart")
      .append("svg").attr("id", "barchartsvg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

  // X axis
  let x = d3.scaleBand()
      .range([ 0, widthBar ])
      .domain(data.map(function(d) { return d.municipality; }))
      .padding(0.2);

  svgBarChart.append("g")
      .attr("transform", "translate(0," + heightBar + ")")
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
      .range([ heightBar, 0]);

  svgBarChart.append("g")
      .call(d3.axisLeft(y));

  // Bars
  svgBarChart.selectAll("mybar")
      .data(data)
      .join("rect")
      .attr("x", d => x(d.municipality))
      .attr("y", d => y(d.CO2))
      .attr("width", x.bandwidth())
      .attr("height", d => heightBar - y(d.CO2))
      .attr("fill", "#69b3a2")

}