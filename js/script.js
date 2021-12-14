const state = {
  currView: CO2,
  update: () => {}
};


let loader = new DataLoader(FILES);

loader.getData(res => {

  cleanupData(res);

  let co2View = new CO2View(res);
  let renewableView = new RenewableView(res);
  let politicalView = new PoliticalView(res);
  let aggregateView = new AggregateView(res);

  state.update = () => {
    switch (state.currView) {
      case CO2: co2View.update(); break;
      case RENEWABLE: renewableView.update(); break;
      case POLITICAL: politicalView.update(); break;
      case AGGREGATE: aggregateView.update(); break;
    }
  }

  updateView(state.currView)

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
  const climateLabels = res["climateLabels"]

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
  parseNumbers(changeKeys(co2PerSector, [
    {from: "Gemeenten", to: "municipality"},
    {from: "Totaal bekende CO2-uitstoot (aardgas elektr. stadswarmte woningen voertuigbrandstoffen)|2019", to: ""},
    {from: "CO2-uitstoot Verkeer en vervoer incl. auto(snel)wegen excl. elektr. railverkeer (scope 1)|2019", to: "Transport"},
    {from: "CO2-uitstoot Landbouw bosbouw en visserij SBI A (aardgas elektr.)|2019", to: "Agriculture"},
    {from: "CO2-uitstoot Gebouwde Omgeving (aardgas elektr. en stadswarmte woningen)|2019", to: "Built environment"},
    {from: "CO2-uitstoot Industrie Energie Afval en Water (aardgas en elektr.)|2019", to: "Industry"},
  ]), ["Transport", "Agriculture", "Built environment", "Industry"]);
  Object.values(res)
      .filter(dataset => Array.isArray(dataset)&&"municipality" in dataset[0])
      .forEach(dataset => {
        let unknownMun = dataset.find(d => d.municipality === "Gemeente onbekend");
        if(unknownMun) {
          dataset.splice(dataset.indexOf(unknownMun));
        }
        changeNames(dataset, "municipality",
            [{from: "Nuenen, Gerwen en Nederwetten", to: "Nuenen"},
              {from: "Nuenen c.a.", to: "Nuenen"},
              {from: "Bergen (L.)", to: "Bergen (L)"},
              {from: "Bergen (NH.)", to: "Bergen (NH)"}])
      });
  calculateCO2PerInhabitant(co2Data,inhabitantData);
}
