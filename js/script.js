let loader = new DataLoader(FILES);

loader.getData(res => {

  cleanupData(res);

  let co2View = new CO2View(res);
  let renewableView = new RenewableView(res);
  let politicalView = new PoliticalView(res);
  let aggregateView = new AggregateView(res);

  state.getCurrentView = () => {
    switch (state.currView) {
      case CO2: return co2View;
      case RENEWABLE: return renewableView;
      case POLITICAL: return politicalView;
      case AGGREGATE: return aggregateView;
    }
  }

  addSelectionOptions(res) //this will trigger an update
});

const addSelectionOptions = (res) => {
  const munNames = res['co2Data'].map(x => x["municipality"])

  const option = (name) => {
    return `<option value='${name}'>${name}</option>`
  }

  const munSelectionBox = '#mun-selection'
  $(munSelectionBox).change((e) => {
    console.log(e)
    state.newMunSelected(e)
    state.update()
  })
  munNames.map( name => $(munSelectionBox).append(option(name)))
  state.setNewMunicipality(munNames[0])
  updateView(state.currView)
  // state.update()
}

function cleanupData(res) {
  const mapData = res["mapData"];
  mergeGeoPaths(mapData, [{keys: ["Molenwaard", "Giessenlanden"], target: "Molenlanden"},
    {keys: ["Spijkenisse", "Bernisse"], target: "Nissewaard"},
    {keys: ["Bellingwedde", "Vlagtwedde"], target: "Westerwolde"},
    {keys: ["Werkendam", "Woudrichem", "Aalburg"], target: "Altena"},
    {keys: ["Appingedam", "Delfzijl", "Loppersum"], target: "Eemsdelta"},
    {keys: ["Bussum", "Muiden", "Naarden"], target: "Gooise Meren"},
    {keys: ["Leerdam", "Vianen", "Zederik"], target: "Vijfheerenlanden"},
    {keys: ["Geldermalsen", "Neerijnen", "Lingewaal"], target: "West Betuwe"},
    {keys: ["Schijndel", "Veghel", "Sint-Oedenrode"], target: "Meierijstad"},
    {keys: ["Hoogezand-Sappemeer", "Slochteren", "Menterwolde"], target: "Midden-Groningen"},
    {keys: ["Bedum", "Eemsmond", "De Marne", "Winsum"], target: "Het Hogeland"},
    {keys: ["Grootegast", "Leek", "Marum", "Zuidhorn"], target: "Westerkwartier"},
    {keys: ["Dongeradeel", "Ferwerderadiel", "Kollumerland en Nieuwkruisland"], target: "Noardeast-Fryslan"},
    {keys: ["Binnenmaas", "Strijen", "Cromstrijen", "Korendijk", "Oud-Beijerland"], target: "Hoeksche Waard"},
    {keys: ["Nederlek", "Ouderkerk", "Vlist", "Bergambacht", "Schoonhoven"], target: "Krimpenerwaard"},
    {keys: ["Franekeradeel", "het Bildt", "Menameradiel", "Littenseradiel"], target: "Waadhoeke"},
    {keys: ["Nuth", "Schinnen", "Onderbanken"], target: "Beekdaelen"}]);
  const incomes = res["income"];
  const co2PerSector = res["co2PerSector"];
  const electionData = parseNumbers(res["electionData"],["Votes"])
  const co2Data = parseNumbers(res["co2Data"], ["CO2"]);
  const renewData = parseNumbers(res["renewData"], ["energy", "electricity", "warmth", "transport"]);
  const inhabitantData = parseNumbers(res["inhabitantData"],["Inwoneraantal"])
  const uniquePartyList = res['uniquePartyList']
  const climateLabels = res["climateLabels"]

  mapData.features.forEach(m => {
    m.municipality = m.properties.areaName
  });

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
  Object.values(res).concat([mapData.features])
      .filter(dataset => Array.isArray(dataset)&&"municipality" in dataset[0])
      .forEach(dataset => {
        let unknownMun = dataset.find(d => d.municipality === "Gemeente onbekend");
        if(unknownMun) {
          dataset.splice(dataset.indexOf(unknownMun));
        }
        changeNames(dataset, "municipality",
            [{from: /Nuenen/, to: "Nuenen"},
              {from: /Bergen \(L[.,]\)/, to: "Bergen (L)"},
              {from: /Bergen \(NH.\)/, to: "Bergen (NH)"},
              {from: /Groesbeek/, to: "Berg en Dal"},
              {from: /Gaasterlan-Sleat/, to: "De Fryske Marren"},
              {from: /Sudwest-Fryslan/, to: "Súdwest-Fryslân"},
              {from: /Noardeast-Frys/, to: "Noardeast-Fryslan"},
              {from: /\'s-Gravenhage/, to: "Den Haag"}])
      });
  mapData.features.forEach(m => {
    m.properties.areaName = m.municipality;
  });
  calculateCO2PerInhabitant(co2Data,inhabitantData);
  calculateCO2PerSectorPerInhabitant(co2PerSector,inhabitantData)
}
