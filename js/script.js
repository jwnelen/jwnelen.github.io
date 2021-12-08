var state = {
  currView: "CO2",
  update: () => {}
};

let loader = new DataLoader([
  {name: "mapData", filename: "data/nl.json"},
  {name: "co2PerSector", filename: "data/CO2-uitstoot-sectoren.csv"},
  {name: "co2Data", filename: "data/totale_co2_2019.csv"},
  {name: "income", filename: "data/income-municipality.csv"},
  {name: "renewData", filename: "data/Gemeente_hernieuwbare_energie.csv"},
  {name: "electionData", filename:"data/vote_data_per_municip.csv"},
  {name: "inhabitantData", filename:"data/inwoneraantallen_2019.csv"},
  {name: "uniquePartyList", filename:"data/unique_party_list.csv"}]);

setNavigationLine();
window.onresize = setNavigationLine;

loader.getData(res => {

  cleanupData(res);

  let co2View = new CO2View(res);
  let renewableView = new RenewableView(res);
  let politicalView = new PoliticalView(res);
  let aggregateView = new AggregateView(res);

  switch (state.currView) {
    case "CO2": co2View.init(); break;
    case "renew": renewableView.init(); break;
    case "political": politicalView.init(); break;
    case "aggr": aggregateView.init(); break;
  }

  state.update = () => {
    switch (state.currView) {
      case "CO2": co2View.update(); break;
      case "renew": renewableView.update(); break;
      case "political": politicalView.update(); break;
      case "aggr": aggregateView.update(); break;
    }


    // let filteredElectionData= electionData.filter(entry => munNames.includes(entry["municipality"]))
    // let co2Party = calculateCO2PerPoliticalParty(uniquePartyList,filteredElectionData,co2Data)
    //
    // map.update(newVal);
    // partyCO2Chart.update(co2Party);
    //
    // d3.select('p#value-simple').text(d3.format(",.2r")(newVal)); // display value
    // d3.select('p#municipalities').text("below threshold: " + munNames.length);
  }

});

function cleanupData(res) {
  const mapData = res["mapData"];
  mergeGeoPaths(mapData, "Molenwaard", "Giessenlanden", "Molenlanden");
  const incomes = res["income"];
  const co2PerSector = res["co2PerSector"];

  const electionData = parseNumbers(res["electionData"],["Votes"])
  const co2Data = parseNumbers(res["co2Data"], ["CO2"]);
  const renewData = parseNumbers(res["renewData"], ["energy", "electricity", "warmth", "transport"]);
  const inhabitantData = parseNumbers(res["inhabitantData"],["Inwoneraantal"])
  const uniquePartyList = res['uniquePartyList']
  changeKeys(electionData, [
    {from:"Municipality name", to: "municipality"},
    {from:"Votes", to: "votes"}
  ]);
  changeKeys(inhabitantData,[
    {from:"Gemeente", to:"municipality"},
    {from:"Inwoneraantal",to:"inhabitants"}
  ]);
  changeKeys(incomes, [
    {from: 'Gemiddeld inkomen per huishouden|2018', to: "income"},
    {from: "Gemeenten", to: "municipality"}]);
  changeKeys(co2Data, [
    {from: "Gemeenten", to: "municipality"}]);
  changeKeys(renewData, [
    {from: "Gemeenten", to: "municipality"}]);
  changeKeys(co2PerSector, [
    {from: "Gemeenten", to: "municipality"},
    {from: "Totaal bekende CO2-uitstoot (aardgas elektr. stadswarmte woningen voertuigbrandstoffen)|2019", to: "Total"},
    {from: "CO2-uitstoot Verkeer en vervoer incl. auto(snel)wegen excl. elektr. railverkeer (scope 1)|2019", to: "Transport"},
    {from: "CO2-uitstoot Landbouw bosbouw en visserij SBI A (aardgas elektr.)|2019", to: "Agriculture"},
    {from: "CO2-uitstoot Gebouwde Omgeving (aardgas elektr. en stadswarmte woningen)|2019", to: "Built environment"},
    {from: "CO2-uitstoot Industrie Energie Afval en Water (aardgas en elektr.)|2019", to: "Industry"},
  ]);
  Object.values(res)
      .filter(dataset => Array.isArray(dataset)&&"municipality" in dataset[0])
      .forEach(dataset => changeNames(dataset, "municipality", [{from: "Nuenen, Gerwen en Nederwetten", to: "Nuenen c.a."}]));
  calculateCO2PerInhabitant(co2Data,inhabitantData);
}
