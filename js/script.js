let loader = new DataLoader([
  {name: "mapData", filename: "data/nl.json"},
  {name: "co2Data", filename: "data/totale_co2_2019.csv"},
  {name: "income", filename: "data/income-municipality.csv"}]);

const getMunicipalitiesBelowIncomeThreshold = (muns, val) => {
  return muns.filter((mun) => mun.income < val)
}

const createThresholdSelector = (incomes, min, max, onChange) => {
  let sliderSimple = d3
      .sliderBottom()
      .min(min)
      .max(max)
      .width(400)
      .tickFormat(d3.format(",.2r"))
      .ticks(6)
      .default((min + max) / 2)
      .on('onchange', val => {
        onChange(val)
      });

  let gSimple = d3
      .select('div#slider-simple')
      .append('svg')
      .attr('width', 500)
      .attr('height', 100)
      .append('g')
      .attr('transform', 'translate(30,30)');

  gSimple.call(sliderSimple);

  // default values displayed
  d3.select('p#value-simple').text(sliderSimple.value());
  const munNames = getMunicipalitiesBelowIncomeThreshold(incomes, sliderSimple.value()).map(mun => mun.municipality)
  d3.select('p#municipalities').text("below threshold: " + munNames.map(m => m.municipality).length);
}

const getCO2FromMunicipalities = (co2, municipalities) => {
  return co2.filter(d => municipalities.includes(d.municipality))
}

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

  const map = new GeoMap({mapData, incomes, middleValue})

  const filteredMunNames = getMunicipalitiesBelowIncomeThreshold(incomes, middleValue).map(mun => mun.municipality)
  let filteredCO2 = getCO2FromMunicipalities(co2Data, filteredMunNames)
  const barChart = new BarChart(filteredCO2)

  const updateOnNewSelection = (newVal) => {
    const munNames = getMunicipalitiesBelowIncomeThreshold(incomes, newVal).map(mun => mun.municipality)
    let filteredCO2 = getCO2FromMunicipalities(co2Data, munNames)

    map.update(newVal)
    barChart.update(filteredCO2)

    d3.select('p#value-simple').text(d3.format(",.2r")(newVal)); // display value
    d3.select('p#municipalities').text("below threshold: " + munNames.length);
  }


  createThresholdSelector(incomes, min, max, v => updateOnNewSelection(v))

})
