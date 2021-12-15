const getBelowThreshold = (l, key, thres) => {
  return l.filter((mun) => mun[key] < thres)
}

const getCO2FromMunicipalities = (co2, municipalities) => {
  return co2.filter(d => municipalities.includes(d.municipality))
}

const calculateRenewableVSCO2 = (renewData, co2Data) => {
  let quantile = getPercentiles(renewData, "energy", 10);
  let joined = joinData(renewData, co2Data, "municipality");
  let quartiles = new Array(quantile.length-1);
  let res = new Array(quantile.length-1);
  for (let i = 0; i < quantile.length-1; i++) {
    quartiles[i] = joined.filter(d => {
      return d.energy >= quantile[i] && d.energy < quantile[i+1];
    } );
    res[i] = {
      percentile: Math.round((i+1)*(100/quantile.length)) + "%",
      avg: getAverage(quartiles[i], "CO2")
    }
  }
  return res;
};

const calculateCO2PerInhabitant = (co2Data, inhabitantData) =>{
  for(co2DataPoint of co2Data.filter(entry => entry["municipality"] != "Gemeente onbekend")){
    let thisMunicip = co2DataPoint.municipality
    let thisInhab = inhabitantData.filter(entry => entry["municipality"] == thisMunicip)[0].inhabitants
    co2DataPoint.CO2_per_inhabitant = co2DataPoint.CO2/thisInhab
  }
  return co2Data
}

const calculateCO2PerPoliticalParty = (unique_party_list,electionData, co2Data) => {
  let party_avg_co2_value = []
  // we only calc over municipalities for which we have CO2 values
  let municipalities_with_co2Data = co2Data.filter(entry => entry["CO2"] > 0).map(entry => entry["municipality"])
  let electionDataCorr = electionData.filter(entry => municipalities_with_co2Data.includes(entry["municipality"] ))

  for (let i = 0; i < unique_party_list.length; i++){
    // for any party: we need to find where there voters come from
    let party = unique_party_list[i].party_name
    let votes_party_list = electionDataCorr.filter(entry => entry["party_name"] == party).map(entry => isNaN(entry.votes) ? {...entry, "votes": 0}: entry)
    // just a check for undefined shit: could be removed
    for(let j = 0; j < votes_party_list.length; j++){
      if (typeof votes_party_list[j].percentage == undefined){
        console.log(votes_party_list[j].percentage)
        console.log("undefined shit " +votes_party_list[j].party_name)
      }
    }

    // for any party: to find the percentage of votes coming from some municipality
    let total_votes = electionDataCorr.filter(entry =>  entry['party_name'] == party).reduce((acc,curr) => {return acc + curr['votes']},0);
    let weighted_co2_value = 0
    for (entry of votes_party_list){
      entry.percentage = entry.votes/total_votes
      let co2_value = co2Data.filter(x => x['municipality'] == entry['municipality'])[0].CO2_per_inhabitant
      if (co2_value.length == 0){
        console.log(entry)
      }
      else{
        weighted_co2_value += co2_value * entry.percentage
      }
    }
    party_avg_co2_value.push({'party_name': party, 'CO2': weighted_co2_value})
  }
  return party_avg_co2_value
};

const calculateAveragePoliticalClimateLabel = (electionData, climateLabels) =>{
  var scores = {"A": 5, "B": 4, "C": 3, "D": 2, "E": 1, "F": 0}
  let partiesWithLabel = climateLabels.map(entry => entry["party_name"])
  for(entry of climateLabels){
    entry['climate_score'] = scores[entry["climate_label"]]
  }
  let electionDataForRelevantParties = electionData.filter(entry => partiesWithLabel.includes(entry["party_name"]) && entry["municipality"] != "Nederland")
  let municipalityList = [... new Set(electionDataForRelevantParties.map(entry => entry["municipality"]))]
  let averageClimateLabel = []
  for(let i = 0; i < municipalityList.length; i++){
    let weightedClimateScore = 0
    let thisMunicipality = municipalityList[i]
    let totalVotesInThisMunicipality = electionDataForRelevantParties.filter(entry =>  entry['municipality'] == thisMunicipality).reduce((acc,curr) => {return acc + curr['votes']},0)
    let votesForPartiesInThisMunicipality = electionDataForRelevantParties.filter(entry => entry['municipality'] == thisMunicipality)
    for (let j = 0; j < votesForPartiesInThisMunicipality.length; j++){
      let thisMunicipPartyEntry = votesForPartiesInThisMunicipality[j]
      let thisLabel = climateLabels.filter(entry => thisMunicipPartyEntry["party_name"] == entry["party_name"])[0].climate_score
      weightedClimateScore += thisLabel * thisMunicipPartyEntry["votes"]/totalVotesInThisMunicipality
    }
    averageClimateLabel.push({"municipality": thisMunicipality, "climate_label": weightedClimateScore})
  }
  return averageClimateLabel
}

const mergeGeoPaths = function (data, items) {
  let features = data.features;
  items.forEach(i => {
    let geoitems = i.keys.map(k => features.find(f => f.properties.areaName === k));
    let res = deepCopy(geoitems[0]);
    res.geometry.type = "Polygon";
    res.geometry.coordinates = [];
    res.geometry.coordinates[0] = [].concat(... geoitems.map(g => {
      //Een erg gebeunde manier van paths mergen, kan vast beter
      let arr = [].concat(g.geometry.coordinates[0]);
      if(g.geometry.type === "MultiPolygon") {
        arr = [].concat(...g.geometry.coordinates[0]);
      }
      return arr;
    }));
    res.properties.areaName = i.target;
    geoitems.forEach(g => {
      features.splice(features.indexOf(g),1);
    });
    if(i.target === "Waadhoeke") {
      console.log(res);
    }
    features.push(res);
  })
};

const getCO2DivisionSector = function (data, mun) {
  let entry = data.find(d => d.municipality === mun);
  if (entry) {
    entry = deepCopy(entry);
    delete entry.municipality;
    entry = Object.keys(entry).map(k => {
      return {
        sector: k,
        value: entry[k]
      }
    });
    return entry;
  } else {
    return [{
      sector: "No data available",
      value: "0"
    }]
  }
};

const getMunFromEvent = function(d) {
  return d.target.attributes.municipality_name.value;
};

const getMun = function (data, mun) {
  return data.find(d => d.municipality === mun);

}