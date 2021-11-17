
const s = {
  countries: [],
  selected_country: "NLD",
  data: [],
  weighted: true
}

const CODE = "countryterritoryCode"
const NAME = "countriesAndTerritories"
const dateFormat = "%d/%m/%Y"
const fileName = "data.csv"
const CASES = "cases"
const WEIGHTED_CASES = "Cumulative_number_for_14_days_of_COVID-19_cases_per_100000";
const WIDTH_PLOT = 800;
const HEIGHT_PLOT = 400;

let margin = {top: 10, right: 30, bottom: 30, left: 60},
    width = WIDTH_PLOT - margin.left - margin.right,
    height = HEIGHT_PLOT - margin.top - margin.bottom;

// append the svg object to the body of the page
let svg = d3.select("#my_dataviz")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");

d3.csv("/data/" + fileName, (data) => {
  s.data = data;
  const key = "code"
  s.countries = getUniqueValues(getCountries(data), key)
  // just selecting the first country
  s.selected_country = s.countries[0].code

  console.log(data)

  updateSelectionOptions()
  updateChart()
})

const filterOnCountry = (d) => d.filter((ob => ob[CODE] === s.selected_country))
const formatData = (d) => d.map((d) => ({date: d3.timeParse(dateFormat)(d.dateRep), value: d[s.weighted ? WEIGHTED_CASES : CASES]}))
const getCountries = (d) => d.map((d) => ({"code": d[CODE], "name": d[NAME]}))
const getUniqueValues = (d, value) => [...new Map(d.map((d) => [d[value], d])).values()]
const removeData = () => svg.selectAll("*").remove();

const optionChanged = (v) => {
  s.selected_country = v
  updateChart()
}

const weightedChanged = (v) => {
  s.weighted = v
  updateChart()
}

function updateSelectionOptions() {
  let options = d3.select("#countries")
      .selectAll("option")
      .data(s.countries)
      .enter()
      .append("option")

  options.text((a) => a.name).attr("value", (a) => a.code)

}

function updateChart() {
  let d = s.data

  d = filterOnCountry(d)
  d = formatData(d)

  removeData();

  // Add X axis --> it is a date format
  let x = d3.scaleTime()
      .domain(d3.extent(d, function (d) {
        return d.date;
      }))
      .range([0, width]);

  svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

  // Add Y axis
  let y = d3.scaleLinear()
      .domain([0, d3.max(d, function (d) {
        return +d.value;
      })])
      .range([height, 0]);

  svg.append("g")
      .call(d3.axisLeft(y));

  let line = d3.line()
      .x((d) => x(d.date))
      .y((d) => y(d.value))

  let path = svg.append("path")
      .data([d])
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("class", "line")
      .attr("d", line)

  let totalLength = path.node().getTotalLength();

  path
      .attr("stroke-dasharray", totalLength + " " + totalLength)
      .attr("stroke-dashoffset", totalLength)
      .transition()
      .duration(2000)
      .attr("stroke-dashoffset", 0);


}

