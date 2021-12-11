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

const mergeGeoPaths = function (data, key1, key2, target) {
	let features = data.features;
	let v1 = features.find(f => f.properties.areaName === key1);
	let v2 = features.find(f => f.properties.areaName === key2);
	let res = deepCopy(v1);
	res.properties.areaName = target;
	//Een erg gebeunde manier van paths mergen, kan vast beter
	res.geometry.coordinates[0] = res.geometry.coordinates[0].concat(v2.geometry.coordinates[0]);
	features.splice(features.indexOf(v1),1);
	features.splice(features.indexOf(v2),1);
	features.push(res);
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