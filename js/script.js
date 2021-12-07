let loader = new DataLoader([
  {name: "mapData", filename: "data/nl.json"},
  {name: "co2PerSector", filename: "data/CO2-uitstoot-sectoren.csv"},
  {name: "co2Data", filename: "data/totale_co2_2019.csv"},
  {name: "income", filename: "data/income-municipality.csv"},
  {name: "renewData", filename: "data/Gemeente_hernieuwbare_energie.csv"},
  {name: "electionData", filename:"data/vote_data_per_municip.csv"},
  {name: "inhabitantData", filename:"data/inwoneraantallen_2019.csv"}]);

loader.getData(res => {
  const mapData = res["mapData"];
  mergeGeoPaths(mapData, "Molenwaard", "Giessenlanden", "Molenlanden");
  const incomes = res["income"];
  const co2PerSector = res["co2PerSector"];
  
  const electionData = parseNumbers(res["electionData"],["Votes"])
  const co2Data = parseNumbers(res["co2Data"], ["CO2"]);
  const renewData = parseNumbers(res["renewData"], ["energy", "electricity", "warmth", "transport"]);
  const inhabitantData = parseNumbers(res["inhabitantData"],["Inwoneraantal"])

  changeKeys(electionData, [
    {from:"Municipality name", to: "municipality"},
    {from:"Votes", to: "votes"}
  ])
  changeKeys(inhabitantData,[
    {from:"Gemeente", to:"municipality"},
    {from:"Inwoneraantal",to:"inhabitants"}
  ])
  changeKeys(incomes, [
    {from: 'Gemiddeld inkomen per huishouden|2018', to: "income"},
    {from: "Gemeenten", to: "municipality"}])
  changeKeys(co2Data, [
    {from: "Gemeenten", to: "municipality"}]);
  changeKeys(renewData, [
    {from: "Gemeenten", to: "municipality"}])

  Object.values(res)
      .filter(dataset => Array.isArray(dataset)&&"municipality" in dataset[0])
      .forEach(dataset => changeNames(dataset, "municipality", [{from: "Nuenen, Gerwen en Nederwetten", to: "Nuenen c.a."}]));


  const incomeValues = incomes.map(municipality => parseInt(municipality.income)).filter(x => x)
  const min = Math.min(...incomeValues)
  const max = Math.max(...incomeValues)
  let middleValue = (min + max) / 2

  console.log(calculateCO2PerInhabitant(co2Data,inhabitantData))

  const filteredMunNames = getBelowThreshold(incomes, "income", middleValue).map(mun => mun.municipality)
  let filteredCO2 = getCO2FromMunicipalities(co2Data, filteredMunNames);
  let percentiles = calculateRenewableVSCO2(renewData, co2Data);
  let co2Party = calculateCO2PerPoliticalParty(electionData,co2Data)

  // Constructing all elements
  const slider = new Slider(min, max, (v) => update(v));
  const map = new GeoMap({mapData, incomes, middleValue});
  const barChart = new BarChart("barchart", filteredCO2, "municipality", "CO2");
  const percentileChart = new BarChart("percentilechart", percentiles, "percentile", "avg");
  const partyCO2Chart = new BarChart("partyCO2Chart",co2Party,"party_name","CO2");


  const update = (newVal) => {
    const munNames = getBelowThreshold(incomes, "income", newVal).map(mun => mun.municipality)
    let filteredCO2 = getCO2FromMunicipalities(co2Data, munNames)

    map.update(newVal)
    barChart.update(filteredCO2)

    d3.select('p#value-simple').text(d3.format(",.2r")(newVal)); // display value
    d3.select('p#municipalities').text("below threshold: " + munNames.length);
  }
})
