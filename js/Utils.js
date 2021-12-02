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
}

const calculateCO2PerPoliticalParty = (electionData, co2Data) => {
  let unique_party_list = electionData.filter(entry =>  entry["municipality"] == "Nederland").map(entry => entry["party_name"])
  let party_avg_co2_value = []
  let municipalities_with_co2Data = co2Data.filter(entry => entry["CO2"] > 0).map(entry => entry["municipality"])
  let electionDataCorr = electionData.filter(entry => municipalities_with_co2Data.includes(entry["municipality"] ))
  console.log(electionDataCorr)
  for (let i = 0; i < unique_party_list.length; i++){
    let party = unique_party_list[i]
    let votes_party_list = electionDataCorr.filter(entry =>  entry["party_name"] == party).map(entry => isNaN(entry.votes) ? {...entry, "votes": 0}: entry)
                      
    for(let j = 0; j < votes_party_list.length; j++){
      if (typeof votes_party_list[j].percentage == undefined){
        console.log(votes_party_list[j].percentage)
        console.log("undefined shit " +votes_party_list[j].party_name)
      }
    }
    let total_votes = electionDataCorr.filter(entry =>  entry['party_name'] == party).reduce((acc,curr) => {return acc + curr['votes']},0);
    let percentage_votes_per_party_list = votes_party_list.filter(entry => entry["municipality"] != "Nederland")
    let weighted_co2_value = 0
    for (entry of percentage_votes_per_party_list){
      entry.percentage = entry.votes/total_votes
      let co2_value = co2Data.filter(x => x['municipality'] == entry['municipality'])
      if (co2_value.length == 0){
        console.log(entry)
      }
      else{
        weighted_co2_value = co2Data.filter(x => x['municipality'] == entry['municipality'])[0].CO2 * entry.percentage
      }
    }
    party_avg_co2_value.push({'party_name': party, 'CO2': weighted_co2_value})
  }
  return party_avg_co2_value
}
