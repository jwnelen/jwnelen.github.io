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

const calculateCO2PerSectorPerInhabitant = (co2PerSector, inhabitantData) =>{
  for(entry of co2PerSector){
    var thisMun = entry.municipality
    var thisInhab = inhabitantData.filter(d => d.municipality === thisMun)[0].inhabitants
    entry['municipality'] = thisMun
    entry['Transport'] = entry.Transport > 0 ? entry.Transport/thisInhab: 0
    entry['Agriculture'] = entry.Agriculture > 0 ? entry.Agriculture/thisInhab : 0
    entry['Built environment'] = entry['Built environment'] > 0 ? entry['Built environment']/thisInhab : 0
    entry['Industry'] = entry.Industry > 0 ? entry['Industry']/thisInhab : 0
  }
}

const reduceByKeyVal = (array,key,val) =>{
  var res = []
  var allKeys = Array.from(new Set(array.map(entry => entry[key]))).sort()
  for(thisKey of allKeys){
    let reducedValue = array.filter(entry => entry[key] == thisKey).reduce( (pv, cv) => {return pv + cv[val]}, 0)
    res.push({[key]: thisKey, [val]: reducedValue})
  }
  return res
}

const calculateAveragePoliticalClimateLabel = (electionData, climateLabels) =>{
  var scores = {"A": 5, "B": 4, "C": 3, "D": 2, "E": 1, "F": 0}
  var invScores = {5: "A", 4: "B", 3: "C", 2: "D", 1: "E", 0: "F"}
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
    let percentageList = []
    for (let j = 0; j < votesForPartiesInThisMunicipality.length; j++){
      let thisMunicipPartyEntry = votesForPartiesInThisMunicipality[j]
      let thisLabel = climateLabels.filter(entry => thisMunicipPartyEntry["party_name"] == entry["party_name"])[0].climate_score
      let thisLabelLetter = invScores[thisLabel]

      percentageList.push({"label": thisLabelLetter, "percentage": thisMunicipPartyEntry["votes"]/totalVotesInThisMunicipality })
      weightedClimateScore += thisLabel * thisMunicipPartyEntry["votes"]/totalVotesInThisMunicipality
    }
    averageClimateLabel.push({"municipality": thisMunicipality, "climate_label": weightedClimateScore, "percentages_votes_per_label": reduceByKeyVal(percentageList,"label","percentage")})
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

const getCO2PerSectorPerInhabitant = function (data, mun) {
  let entry = data.find(d => d.municipality === mun);
  if (entry) {
    entry = deepCopy(entry);
    delete entry.municipality;
    entry = Object.keys(entry).map(k => {
      return {
        sector: k,
        value: entry[k] > 0 ? entry[k]: 0
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

const percentileOfDataset = function(dataset,key,value){
  var worseDataPoints = 0
  for (dataEntry of dataset){
    if(dataEntry[key] <= value){
      worseDataPoints += 1
    }
  }
  return worseDataPoints/dataset.length
}

const calculateFinalScore = function(data, keys) {
  keys.forEach(k => {
    k.max = getMax(data, k.key);
    k.min = getMin(data, k.key);
    });
  let sumWeights = keys.reduce((sum, k) => k.weight + sum, 0);
  let res = data.map(d => {
    let score = keys.reduce((sum, k) => {
      let subScore = d3.scaleLinear().domain([k.min, k.max])(d[k.key]);
      if(k.invert) {
        subScore = 1 - subScore;
      }
      return sum + k.weight*subScore;
    }, 0)/sumWeights*10;
    return {
      municipality: d.municipality,
      score: score
    }
  });
  return res;
};