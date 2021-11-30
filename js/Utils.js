const getBelowThreshold = (l, key, thres) => {
  return l.filter((mun) => mun[key] < thres)
}

const getCO2FromMunicipalities = (co2, municipalities) => {
  return co2.filter(d => municipalities.includes(d.municipality))
}

const calculateRenewableVSCO2 = (renewData, co2Data) => {
  let quantile = getPercentiles(renewData, "energy", 10);
  console.log(quantile);
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