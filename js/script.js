let loader = new DataLoader([
  {name: "mapData", filename: "data/nl.json"},
  {name: "co2Data", filename: "data/totale_co2_2019.csv"},
  {name: "income", filename: "data/income-municipality.csv"}]);

loader.getData(res => {
  const mapData = res["mapData"];
  const incomes = res["income"];
  const co2Data = res["co2Data"]

  loader.changeKeys(incomes, [
    {from: 'Gemiddeld inkomen per huishouden|2018', to: "income"},
    {from: "Gemeenten", to: "municipality"}])

  loader.changeKeys(co2Data, [
    {from: "Gemeenten", to: "municipality"}])

  const incomeValues = incomes.map(municipality => parseInt(municipality.income)).filter(x => x)
  const min = Math.min(...incomeValues)
  const max = Math.max(...incomeValues)
  let middleValue = (min + max) / 2

  const filteredMunNames = getBelowThreshold(incomes, "income", middleValue).map(mun => mun.municipality)
  let filteredCO2 = getCO2FromMunicipalities(co2Data, filteredMunNames)

  // Constructing all elements
  const slider = new Slider(min, max, (v) => update(v))
  const map = new GeoMap({mapData, incomes, middleValue})
  const barChart = new BarChart(filteredCO2)

  const update = (newVal) => {
    const munNames = getBelowThreshold(incomes, "income", newVal).map(mun => mun.municipality)
    let filteredCO2 = getCO2FromMunicipalities(co2Data, munNames)

    map.update(newVal)
    barChart.update(filteredCO2)

    d3.select('p#value-simple').text(d3.format(",.2r")(newVal)); // display value
    d3.select('p#municipalities').text("below threshold: " + munNames.length);
  }
})
